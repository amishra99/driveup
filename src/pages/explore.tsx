// App.jsx
import React, { useState, useEffect, useRef } from "react";
import { toast, Toaster } from "react-hot-toast";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { motion } from "framer-motion";
import {
  Search,
  Grid,
  Plus,
  Camera,
  Fuel,
  Zap,
  Bot,
  Battery,
  Headset,
  CarFront,
  BarChart,
  Users,
  DollarSign,
  MessageCircle,
  HelpCircle,
  Settings,
  Circle,
  PanelRightOpen,
  PanelRightClose,
  Cog,
  Star,
  StarHalf,
  Menu,
  ChevronLeft,
  ChevronDown,
} from "lucide-react";
import Image from "next/image";
import Select from "react-select";
import Slider from "rc-slider";
import "rc-slider/assets/index.css";
import { useRouter } from "next/router";
import { User } from "firebase/auth"; // Import User type
import { auth } from "@/utils/firebaseConfig";
import { db, doc, getDoc, setDoc } from "@/utils/firebaseConfig";
import {
  updateDoc,
  arrayUnion,
  arrayRemove,
  onSnapshot,
} from "firebase/firestore";
import { signOut } from "firebase/auth";
import Link from "next/link";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination, Autoplay } from "swiper/modules";
import Head from "next/head";

const brands = [
  "Aston Martin",
  "Audi",
  "Bentley",
  "BMW",
  "BYD",
  "Citroen",
  "Ferrari",
  "Force Motors",
  "Honda",
  "Hyundai",
  "ISUZU",
  "Jaguar",
  "Jeep",
  "Kia",
  "Lamborghini",
  "Land Rover",
  "Lexus",
  "Lotus",
  "Mahindra",
  "Maruti Suzuki",
  "Maserati",
  "Mclaren",
  "Mercedes Benz",
  "MG Motor",
  "MINI",
  "Nissan",
  "Porsche",
  "Renault",
  "Rolls Royce",
  "Skoda",
  "Tata",
  "Toyota",
  "Volkswagen",
  "Volvo",
];

const bodyTypes = ["Sedan", "SUV", "Hatchback", "Luxury"];
const fuelTypes = ["Electric", "Hybrid"];

type Car = {
  model_id: string;
  model: string;
  brand: string;
  body_type: string;
  primary_image_url: string;
  secondary_image_urls: string[]; // assuming array
  brochure_url: string;
  color_options: string[]; // assuming array
  color_image_urls: string[]; // assuming array
  brief_info: string;
  rating: number;
  fuel_options: string;
  fuel: string;
  hp: string;
  cc: string;
  starting_price: number;
};

const CarCard = ({ car }: { car: Car }) => {
  const [favorites, setFavorites] = useState<string[]>([]); // Store model IDs
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    const currentUser = auth.currentUser;
    if (!currentUser) return;

    const userRef = doc(db, "users", currentUser.uid);

    // ✅ Realtime Listener to Firestore
    const unsubscribe = onSnapshot(userRef, (userSnap) => {
      if (userSnap.exists()) {
        const userData = userSnap.data();
        setUser(userData);
        setFavorites(userData.favorites || []); // ✅ Automatically update favorites
      }
    });

    return () => unsubscribe(); // ✅ Clean up listener on unmount
  }, [auth.currentUser]); // ✅ Runs once when user logs in

  const toggleFavorite = async (carId: string) => {
    if (!user || !auth.currentUser) {
      toast.error("You need to be logged in to favorite cars.");
      return;
    }

    try {
      const userRef = doc(db, "users", auth.currentUser.uid);
      const userSnap = await getDoc(userRef);
      let updatedFavorites = [];

      if (userSnap.exists()) {
        const userData = userSnap.data();
        const currentFavorites = userData.favorites || [];

        if (currentFavorites.includes(carId)) {
          updatedFavorites = currentFavorites.filter(
            (model_id: string) => model_id !== carId
          );
        } else {
          updatedFavorites = [...currentFavorites, carId]; // ✅ Add Favorite
        }
      } else {
        updatedFavorites = [carId]; // If no favorites exist, create an array
      }

      // ✅ Update State Immediately (Without Re-fetching)
      setFavorites(updatedFavorites);

      // ✅ Update Firestore
      await setDoc(userRef, { favorites: updatedFavorites }, { merge: true });

      // ✅ Show toast message
      toast.success(
        updatedFavorites.includes(carId)
          ? "Added to Favorites!"
          : "Removed from Favorites"
      );
    } catch (error) {
      console.error("Error updating favorites:", error);
      toast.error("Failed to update favorites. Please try again.");
    }
  };

  return (
    <div className="car-card p-4 bg-[#2a2a2a] hover:bg-[#323232] hover:scale-[1.02] transition-transform duration-300 ease-in-out shadow-none rounded-lg border-none outline-none">
      <div className="flex justify-between items-start mb-3">
        <div>
          <div className="flex items-center gap-2">
            <span className="font-semibold text-[#E9D8A6]">{car.model}</span>
          </div>
          <p className="text-gray-400 text-sm">{car.body_type}</p>
          <p className="mt-1">
            <span className="text-xs text-gray-400">Ex-Showroom Price</span>
            <br />
            <span className="text-xs text-white">
              Starting at{" "}
              <span className="font-semibold text-base text-white">
                ₹ {formatPrice(car.starting_price)}
              </span>
            </span>
          </p>
        </div>
        {/* <Button variant="link" className="text-[#0A9396] text-sm">
          View Details
        </Button>*/}
      </div>

      {/* ✅ Star button is inside the image wrapper but positioned at the top right */}
      <div className="relative mb-3 w-full">
        <img
          src={car.primary_image_url}
          alt={`${car.brand} ${car.model}`}
          className="w-full h-auto object-cover rounded-lg"
        />

        {/* ⭐ Positioned at the top-right of the image */}
        <button
          className={`absolute top-2 right-2 p-2 rounded-full bg-black/50 hover:bg-black/70 transition ${
            favorites?.includes(car.model_id)
              ? "text-[#EE9B00]"
              : "text-gray-400"
          }`}
          onClick={(e) => {
            e.stopPropagation();
            toggleFavorite(car.model_id);
          }}
          style={{ zIndex: 10 }} // Ensure it's above the image but below the View Details button
        >
          <Star className="w-5 h-5" />
        </button>
      </div>

      <div className="grid grid-cols-3 gap-2">
        <div className="feature-badge p-2 text-center bg-white/10 rounded-lg">
          <Fuel className="mb-1 mx-auto text-gray-400" />
          <p
            className="text-xs text-gray-400 truncate max-w-full"
            title={car.fuel_options}
          >
            {car.fuel_options}
          </p>
        </div>
        <div className="feature-badge p-2 text-center bg-white/10 rounded-lg">
          <Zap className="mb-1 mx-auto text-gray-400" />
          <p className="text-xs text-gray-400">
            {car.hp.toLowerCase() === "electric" ? car.hp : `${car.hp} BHP`}
          </p>{" "}
        </div>
        <div className="feature-badge p-2 text-center bg-white/10 rounded-lg">
          <Cog className="mb-1 mx-auto text-gray-400" />
          <p className="text-xs text-gray-400">
            {car.cc.toLowerCase() === "electric" ? car.cc : `${car.cc} cc`}
          </p>
        </div>
      </div>
    </div>
  );
};

type SidebarProps = {
  isOpen: boolean;
  toggleSidebar: () => void;
};

const Sidebar = ({ isOpen, toggleSidebar }: SidebarProps) => {
  const [user, setUser] = useState<any>(null);
  const [showModal, setShowModal] = useState(false);
  const [name, setName] = useState("");
  const [city, setCity] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const fetchUserData = async () => {
      const currentUser = auth.currentUser;
      if (!currentUser) return;

      const userRef = doc(db, "users", currentUser.uid);
      const userSnap = await getDoc(userRef);

      if (userSnap.exists()) {
        const userData = userSnap.data();
        setUser(userData);
        setName(userData.name || "");
        setCity(userData.city || "");
      }
    };

    fetchUserData();
  }, []);

  const handleSave = async () => {
    setLoading(true);

    try {
      const currentUser = auth.currentUser;
      if (!currentUser) throw new Error("No user logged in");

      const userRef = doc(db, "users", currentUser.uid);
      await setDoc(userRef, { name, city }, { merge: true });

      setUser({ ...user, name, city });
      setShowModal(false);
    } catch (error) {
      console.error("Error updating profile:", error);
    }

    setLoading(false);
  };

  const handleLogout = async () => {
    try {
      await auth.signOut();
      localStorage.removeItem("user");

      console.log("✅ User logged out successfully!");

      // 🔹 Reset reCAPTCHA when user logs out
      if (window.recaptchaVerifier) {
        window.recaptchaVerifier.clear();
        window.recaptchaVerifier = null;
        console.log("♻️ reCAPTCHA reset on logout.");
      }

      router.push("/"); // ✅ Redirect smoothly
    } catch (error) {
      console.error("❌ Error logging out:", error);
      alert("Failed to log out. Please try again.");
    }
  };

  return (
    <aside
      className={`fixed top-0 left-0 h-screen min-h-full bg-[#212121] p-6 transition-all duration-300 flex flex-col z-50 
    ${isOpen ? "w-full lg:w-64" : "w-16"}`}
    >
      <div className="relative w-full">
        <Button
          variant="ghost"
          className={`absolute top-0 right-0 m-0 text-white hover:bg-white p-4 ${
            isOpen ? "p-2" : "left-1/2 transform -translate-x-1/2"
          }`}
          onClick={toggleSidebar}
        >
          {isOpen ? (
            <ChevronLeft className="w-7 h-7" />
          ) : (
            <Menu className="w-7 h-7" />
          )}
        </Button>
      </div>
      <div
        className={`flex justify-center w-full ${
          isOpen ? "mt-10 mb-6" : "mt-12 mb-10"
        }`}
      >
        <Image
          src={isOpen ? "/driveup_logo_white.png" : "/driveup_fav_white.png"}
          alt="DriveUp logo"
          width={isOpen ? 120 : 70}
          height={isOpen ? 50 : 70}
          className={`${
            isOpen ? "w-[120px] h-[50px]" : "w-[30px] h-[30px] max-w-none"
          }`}
        />
      </div>
      <nav className="flex flex-col gap-4 w-full items-center">
        <Button
          variant="ghost"
          className={`w-full flex items-center p-4 rounded-lg text-black text-base hover:bg-white transition-all duration-300 ${
            isOpen ? "justify-start" : "justify-center"
          }`}
          style={{ backgroundColor: "#0A9396" }}
        >
          <Grid className="w-7 h-7" />{" "}
          {isOpen && <span className="ml-2 text-sm">Explore</span>}
        </Button>
        <Button
          variant="ghost"
          className={`w-full flex items-center p-4 text-gray-400 text-base hover:bg-white transition-all duration-300 ${
            isOpen ? "justify-start" : "justify-center"
          }`}
          onClick={() => router.push("/findyourcar")} // Navigate on click
        >
          <CarFront className="w-7 h-7" />{" "}
          {isOpen && <span className="ml-2 text-sm">Find Your Car</span>}
        </Button>
        <Button
          variant="ghost"
          className={`w-full flex items-center p-4 text-gray-400 text-base hover:bg-white transition-all duration-300 ${
            isOpen ? "justify-start" : "justify-center"
          }`}
          onClick={() => router.push("/drivebot")} // Navigate on click
        >
          <Bot className="w-7 h-7" />{" "}
          {isOpen && <span className="ml-2 text-sm">DriveBot</span>}
        </Button>
        <Button
          variant="ghost"
          className={`w-full flex items-center p-4 text-gray-400 text-base hover:bg-white transition-all duration-300 ${
            isOpen ? "justify-start" : "justify-center"
          }`}
          onClick={() => router.push("/consultation")} // Navigate on click
        >
          <Headset className="w-7 h-7" />{" "}
          {isOpen && <span className="ml-2 text-sm">Expert Consultation</span>}
        </Button>
        <Button
          variant="ghost"
          className={`w-full flex items-center p-4 text-gray-400 text-base hover:bg-white transition-all duration-300 ${
            isOpen ? "justify-start" : "justify-center"
          }`}
          onClick={() => router.push("/fuelpricetracker")} // Navigate on click
        >
          <Fuel className="w-7 h-7" />{" "}
          {isOpen && <span className="ml-2 text-sm">Fuel Price Tracker</span>}
        </Button>
        <Button
          variant="ghost"
          className={`w-full flex items-center p-4 text-gray-400 text-base hover:bg-white transition-all duration-300 ${
            isOpen ? "justify-start" : "justify-center"
          }`}
          onClick={() => router.push("/help")} // Navigate on click
        >
          <HelpCircle className="w-7 h-7" />{" "}
          {isOpen && <span className="ml-2 text-sm">Help</span>}
        </Button>
        <div className="absolute bottom-6 flex flex-col items-center w-full text-white">
          <div
            className={`flex items-center ${
              isOpen ? "justify-start w-full ml-16" : "justify-center"
            }`}
          >
            <img
              src="/user.png"
              alt="Profile"
              className="w-8 h-8 rounded-full"
            />
            {isOpen && (
              <div className="flex flex-col items-center">
                {/* Avatar Clickable */}
                <div
                  className="flex items-center cursor-pointer"
                  onClick={() => setShowModal(true)}
                >
                  <div className="ml-3">
                    <p className="text-sm font-medium text-[#E9D8A6]">
                      {user?.name || "User"}
                    </p>
                    <p className="text-xs font-medium text-gray-400">
                      {user?.city || "Select City"}
                    </p>
                  </div>
                </div>
              </div>
            )}
            {showModal && (
              <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-70 z-50">
                <div className="bg-[#1E1E1E] p-6 rounded-lg shadow-lg text-white w-96">
                  <h2 className="text-base font-bold mb-4 text-center">
                    Time for an Upgrade? Update Your Details Here!
                  </h2>
                  <div className="grid gap-4">
                    <Input
                      type="text"
                      placeholder="Name"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                    />
                    <select
                      className="p-2 bg-gray-800 border border-gray-600 text-white rounded-md"
                      value={city}
                      onChange={(e) => setCity(e.target.value)}
                    >
                      <option value="">Select City</option>
                      <option value="Ahmedabad">Ahmedabad</option>
                      <option value="Bengaluru">Bengaluru</option>
                      <option value="Chennai">Chennai</option>
                      <option value="Hyderabad">Hyderabad</option>
                      <option value="Kolkata">Kolkata</option>
                      <option value="Mumbai">Mumbai</option>
                      <option value="New-Delhi">New Delhi</option>
                      <option value="Patna">Patna</option>
                      <option value="Pune">Pune</option>
                    </select>

                    <Button onClick={handleSave} disabled={loading}>
                      {loading ? "Saving..." : "Save Changes"}
                    </Button>

                    <Button
                      onClick={handleLogout}
                      className="bg-red-600 hover:bg-red-700"
                    >
                      Logout
                    </Button>

                    <Button
                      onClick={() => setShowModal(false)}
                      className="bg-gray-600 hover:bg-gray-700"
                    >
                      Cancel
                    </Button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </nav>
    </aside>
  );
};

type PriceFilterProps = {
  minPrice: number;
  maxPrice: number;
  setPriceRange: (range: number[]) => void;
};

const PriceFilter = ({
  minPrice,
  maxPrice,
  setPriceRange,
}: PriceFilterProps) => (
  <div className="w-60 flex flex-col gap-3 p-3 rounded-lg">
    <span className="text-[#E9D8A6] text-xs lg:text-sm font-semibold">
      Price Range
    </span>
    <Slider
      range
      min={200000}
      max={50000000}
      defaultValue={[minPrice, maxPrice]}
      onChange={(value) => {
        if (Array.isArray(value)) {
          setPriceRange(value);
        }
      }}
      trackStyle={[{ backgroundColor: "#0A9396", height: "4px" }]}
      handleStyle={[
        {
          borderColor: "#0A9396",
          backgroundColor: "#0A9396",
          width: "12px",
          height: "12px",
        },
        {
          borderColor: "#0A9396",
          backgroundColor: "#0A9396",
          width: "12px",
          height: "12px",
        },
      ]}
      railStyle={{ backgroundColor: "#444", height: "4px" }}
    />
    <div className="flex justify-between text-xs text-gray-300">
      <span suppressHydrationWarning>₹{formatPrice(minPrice)}</span>
      <span suppressHydrationWarning>₹{formatPrice(maxPrice)}</span>
    </div>
  </div>
);

type SearchBarProps = {
  searchQuery: string;
  setSearchQuery: (value: string) => void;
};

const SearchBar = ({ searchQuery, setSearchQuery }: SearchBarProps) => {
  const [showSearchInput, setShowSearchInput] = useState(false);

  const handleSearch = () => {
    console.log("Searching for:", searchQuery);
    // Filtering is already handled in the main component
  };

  return (
    <div className="relative w-full flex items-center gap-2">
      {/* Desktop Search Bar */}
      <div className="hidden sm:flex w-full relative">
        <input
          type="text"
          placeholder="Search here"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)} // Updates global state
          className="w-full p-2 bg-[#2a2a2a] border border-[#E9D8A6] text-white rounded-md"
        />
        <Search className="w-4 h-4 bg-[#2a2a2a] absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 mr-2" />
      </div>

      {/* Mobile Search Button */}
      <Button
        className="bg-[#EE9B00] text-black hover:bg-white transition-all duration-300 sm:hidden w-full flex items-center gap-2"
        onClick={() => setShowSearchInput(true)}
      >
        <Search className="w-5 h-5" />
      </Button>

      {/* Mobile Search Modal */}
      {showSearchInput && (
        <div className="fixed inset-0 bg-black bg-opacity-80 flex justify-center items-center z-50 sm:hidden">
          <div className="relative w-11/12 sm:w-2/3 lg:w-1/2 p-4 bg-[#2a2a2a] border border-[#E9D8A6] rounded-md shadow-lg">
            <input
              type="text"
              placeholder="Search here"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)} // Updates global state
              className="w-full p-3 bg-[#2a2a2a] border border-[#E9D8A6] text-white rounded-md"
              autoFocus
            />
            <div className="flex justify-between mt-3">
              <Button
                className="text-white"
                onClick={() => setShowSearchInput(false)}
              >
                Go Back
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

const formatPrice = (price: number) => {
  if (price >= 10000000) {
    return `${(price / 10000000).toFixed(2)} Cr`; // Convert to Crores if 1 Cr+
  } else {
    return `${(price / 100000).toFixed(2)} L`; // Convert to Lakhs otherwise
  }
};

const App = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [selectedBrand, setSelectedBrand] = useState("Mercedes Benz");
  const [selectedFuel, setSelectedFuel] = useState<string | null>(null);
  const [selectedbody, setselectedbody] = useState<string | null>(null);
  const [priceRange, setPriceRange] = useState([200000, 50000000]);
  const [showSearchInput, setShowSearchInput] = useState(false);
  const router = useRouter();
  const [user, setUser] = useState<any>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [scrollProgress, setScrollProgress] = useState(100);
  const scrollContainerRef = useRef(null);
  const [selectedCar, setSelectedCar] = useState<Car | null>(null);
  const [name, setName] = useState("");
  const [city, setCity] = useState("");
  const [favorites, setFavorites] = useState<string[]>([]); // Store model IDs
  const [showFavorites, setShowFavorites] = useState(false); // Toggle favorite view

  useEffect(() => {
    const currentUser = auth.currentUser;
    if (!currentUser) return;

    const userRef = doc(db, "users", currentUser.uid);

    // ✅ Realtime Listener to Firestore
    const unsubscribe = onSnapshot(userRef, (userSnap) => {
      if (userSnap.exists()) {
        const userData = userSnap.data();
        setUser(userData);
        setFavorites(userData.favorites || []); // ✅ Automatically update favorites
      }
    });

    return () => unsubscribe(); // ✅ Clean up listener on unmount
  }, [auth.currentUser]); // ✅ Runs once when user logs in

  const toggleFavorite = async (carId: string) => {
    if (!user || !auth.currentUser) {
      toast.error("You need to be logged in to favorite cars.");
      return;
    }

    try {
      const userRef = doc(db, "users", auth.currentUser.uid);
      const userSnap = await getDoc(userRef);
      let updatedFavorites = [];

      if (userSnap.exists()) {
        const userData = userSnap.data();
        const currentFavorites = userData.favorites || [];

        if (currentFavorites.includes(carId)) {
          updatedFavorites = currentFavorites.filter(
            (model_id: string) => model_id !== carId
          );
        } else {
          updatedFavorites = [...currentFavorites, carId]; // ✅ Add Favorite
        }
      } else {
        updatedFavorites = [carId]; // If no favorites exist, create an array
      }

      // ✅ Update State Immediately (Without Re-fetching)
      setFavorites(updatedFavorites);

      // ✅ Update Firestore
      await setDoc(userRef, { favorites: updatedFavorites }, { merge: true });

      // ✅ Show toast message
      toast.success(
        updatedFavorites.includes(carId)
          ? "Added to Favorites!"
          : "Removed from Favorites"
      );
    } catch (error) {
      console.error("Error updating favorites:", error);
      toast.error("Failed to update favorites. Please try again.");
    }
  };

  useEffect(() => {
    const fetchUserData = async () => {
      const currentUser = auth.currentUser;
      if (!currentUser) return;

      const userRef = doc(db, "users", currentUser.uid);
      const userSnap = await getDoc(userRef);

      if (userSnap.exists()) {
        const userData = userSnap.data();
        setUser(userData);
        setName(userData.name || "");
        setCity(userData.city || "");
      }
    };

    fetchUserData();
  }, []);

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      if (!user) {
        // ✅ FIX: Redirect only if not already on login page
        if (router.pathname !== "/") {
          router.push("/");
        }
      } else {
        setUser(user);
      }
    });

    return () => unsubscribe();
  }, [router]);

  useEffect(() => {
    const handleResize = () => {
      setIsSidebarOpen(window.innerWidth >= 768);
      setShowSearchInput(window.innerWidth >= 640);
    };

    if (typeof window !== "undefined") {
      setIsSidebarOpen(window.innerWidth >= 768);
      setShowSearchInput(window.innerWidth >= 640);
      window.addEventListener("resize", handleResize);
    }
    return () => {
      if (typeof window !== "undefined") {
        window.removeEventListener("resize", handleResize);
      }
    };
  }, []);
  const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen);

  const rating = selectedCar?.rating; // 🔥 Dynamic rating (Change this value as needed)
  const [isFavorite, setIsFavorite] = useState(false);

  const [carModels, setCarModels] = useState<Car[]>([]);
  const [filteredCars, setFilteredCars] = useState<Car[]>([]);
  const [loading, setLoading] = useState(true); // ✅ Add Loading State

  useEffect(() => {
    setLoading(true); // ✅ Show loading state before API call

    fetch("/api/cars/models")
      .then((res) => res.json())
      .then((data) => {
        setCarModels(data);
        setFilteredCars(data); // ✅ Initialize with all cars
      })
      .catch((error) => console.error("Error fetching car models:", error))
      .finally(() => {
        setLoading(false); // ✅ Hide loading state after data loads
      });
  }, []);

  const SkeletonCard = () => (
    <div className="animate-pulse bg-[#2a2a2a] rounded-lg p-4 h-50 w-full">
      <div className="bg-white/10 h-32 w-full rounded-lg"></div>
      <div className="h-4 bg-white/10 mt-4 w-3/4 rounded"></div>
      <div className="h-3 bg-white/10 mt-2 w-1/2 rounded"></div>
    </div>
  );

  type CarVariant = {
    variant_id: string;
    variant: string;
    specifications: Record<string, any>; // or define the shape if known
    prices: {
      [city: string]: {
        on_road_price: string; // or number
        ex_showroom_price: string;
        rto_others: string;
        insurance: string;
        // other fields
      };
    };
  };

  const [variants, setVariants] = useState<CarVariant[]>([]);
  const [selectedVariant, setSelectedVariant] = useState<CarVariant | null>(
    null
  );

  const filteredFeatures =
    selectedVariant?.specifications &&
    Object.keys(selectedVariant.specifications).length > 0
      ? Object.entries(selectedVariant.specifications)
          .map(([category, specs]) => {
            const filteredSpecs = Object.entries(specs)
              .filter(([name]) =>
                name.toLowerCase().includes(searchTerm.toLowerCase())
              )
              .map(([name, value]) => ({
                name,
                value: value || "N/A", // Ensure empty values are handled
              }));

            return filteredSpecs.length > 0
              ? { category, list: filteredSpecs }
              : null;
          })
          .filter(Boolean) // Remove empty categories
      : [];

  useEffect(() => {
    if (selectedCar?.model_id) {
      fetch(`/api/cars/variant-details?model_id=${selectedCar.model_id}`)
        .then((res) => res.json())
        .then((data) => {
          setVariants(data);
          if (data.length > 0) {
            setSelectedVariant(data[0]); // Ensure a default variant is selected
          } else {
            setSelectedVariant(null); // Handle case where no variants exist
          }
        })
        .catch((error) => console.error("Error fetching variants:", error));
    }
  }, [selectedCar]);

  useEffect(() => {
    const newFilteredCars = carModels.filter((car) => {
      return (
        (showFavorites ? favorites.includes(car.model_id) : true) && // ✅ Only include favorites if enabled
        (!showFavorites && selectedBrand
          ? car.brand === selectedBrand
          : true) && // ✅ Completely ignore brand if favorites are ON
        (searchQuery
          ? car.model.toLowerCase().includes(searchQuery.toLowerCase())
          : true) &&
        (selectedFuel ? car.fuel === selectedFuel : true) &&
        (selectedbody ? car.body_type === selectedbody : true) &&
        car.starting_price >= priceRange[0] &&
        car.starting_price <= priceRange[1]
      );
    });

    setFilteredCars(newFilteredCars);
  }, [
    selectedBrand,
    searchQuery,
    selectedFuel,
    selectedbody,
    priceRange,
    carModels,
    showFavorites, // ✅ Ensure favorites filtering updates dynamically
    favorites, // ✅ Ensure changes in favorites update the list
  ]);

  const [loadingVariant, setLoadingVariant] = useState(false);

  useEffect(() => {
    if (selectedCar) {
      setLoadingVariant(true); // ✅ Start loading state

      if (variants.length > 0) {
        setTimeout(() => {
          setSelectedVariant(variants[0]); // ✅ Set first variant
          setLoadingVariant(false); // ✅ Stop loading state
        }, 50); // Small delay for smoother transition
      }
    }
  }, [selectedCar, variants]);

  const scrollRef = useRef<HTMLDivElement | null>(null);

  const handleMouseDown = (e: React.MouseEvent<HTMLDivElement>) => {
    const slider = scrollRef.current;
    if (!slider) return;

    let isDown = true;
    let startX = e.pageX - slider.offsetLeft;
    let scrollLeft = slider.scrollLeft;

    const handleMouseMove = (event: MouseEvent) => {
      if (!isDown || !slider) return;
      event.preventDefault();
      const x = event.pageX - slider.offsetLeft;
      const walk = (x - startX) * 2; // Adjust speed factor
      slider.scrollLeft = scrollLeft - walk;
    };

    const handleMouseUp = () => {
      isDown = false;
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mouseup", handleMouseUp);
    };

    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("mouseup", handleMouseUp);
  };

  const currentYear = new Date().getFullYear(); // ✅ Dynamic Year

  const [compareCars, setCompareCars] = useState<string[]>([]); // ✅ Explicitly typed
  const [comparisonData, setComparisonData] = useState([]); // Full data for selected cars
  const [showComparison, setShowComparison] = useState(false); // Toggle Comparison View
  const [comparisonCars, setComparisonCars] = useState<Car[]>([]);

  const MAX_COMPARE_CARS = 3; // 🔹 Set Maximum Cars to Compare

  type Specifications = {
    [category: string]: {
      [specName: string]: string;
    };
  };

  type ComparisonTableProps = {
    cars: Car[];
  };

  const ComparisonTable = ({ cars }: ComparisonTableProps) => {
    const [selectedVariants, setSelectedVariants] = useState<{
      [modelId: string]: CarVariant;
    }>({});

    const [variantOptions, setVariantOptions] = useState<{
      [modelId: string]: CarVariant[];
    }>({});

    // 🔹 Fetch variants for each car when the component loads
    useEffect(() => {
      const fetchVariants = async () => {
        const variantData: Record<string, CarVariant[]> = {}; // ✅ type added
        const selectedData: Record<string, CarVariant> = {}; // ✅ type added

        for (const car of cars) {
          const res = await fetch(
            `/api/cars/variant-details?model_id=${car.model_id}`
          );
          const data: CarVariant[] = await res.json();

          if (data.length > 0) {
            variantData[car.model_id] = data; // Store all variants
            selectedData[car.model_id] = data[0]; // Default to first variant
          }
        }

        setVariantOptions(variantData);
        setSelectedVariants(selectedData);
      };

      fetchVariants();
    }, [cars]);

    const allCategories: {
      [category: string]: {
        [specName: string]: Set<string>;
      };
    } = {};

    // 🔹 Collect specifications grouped by category
    Object.values(selectedVariants).forEach((variant) => {
      if (variant?.specifications) {
        Object.entries(variant.specifications).forEach(([category, specs]) => {
          if (!allCategories[category]) allCategories[category] = {};
          Object.entries(specs).forEach(([spec, value]) => {
            if (!allCategories[category][spec])
              allCategories[category][spec] = new Set();
            allCategories[category][spec].add(
              typeof value === "string" ? value.toLowerCase().trim() : "-"
            );
          });
        });
      }
    });

    return (
      <div className="mt-8">
        <h2 className="text-xl font-bold text-white mb-4">Car Comparison</h2>
        <div className="overflow-x-auto scrollbar-hidden">
          <table className="w-full border-collapse border border-gray-700 min-w-[600px]">
            <thead>
              <tr className="bg-[#333] text-white">
                <th className="p-3 text-left sticky left-0 bg-[#333] z-10">
                  Specification
                </th>
                {cars.map((car) => (
                  <th key={car.model_id} className="p-3 text-center">
                    {car.model}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {/* 🔹 Variant Selection Row */}
              <tr className="border border-gray-700">
                <td className="p-3 text-left font-bold sticky left-0 bg-[#222] z-10">
                  Variant
                </td>
                {cars.map((car) => (
                  <td key={car.model_id} className="p-3">
                    <select
                      className="bg-gray-700 text-white p-2 rounded w-full"
                      value={selectedVariants[car.model_id]?.variant_id || ""}
                      onChange={(e) => {
                        const newVariant = variantOptions[car.model_id]?.find(
                          (v) => String(v.variant_id) === e.target.value
                        );
                        if (newVariant) {
                          setSelectedVariants((prev) => ({
                            ...prev,
                            [car.model_id]: newVariant,
                          }));
                        }
                      }}
                    >
                      {variantOptions[car.model_id]?.map((variant) => (
                        <option
                          key={variant.variant_id}
                          value={variant.variant_id}
                        >
                          {variant.variant}
                        </option>
                      ))}
                    </select>
                  </td>
                ))}
              </tr>

              {/* 🔹 Grouped Features by Category */}
              {Object.entries(allCategories).map(([category, specs]) => (
                <React.Fragment key={category}>
                  {/* Category Header Row */}
                  <tr className="bg-[#222] text-white">
                    <td
                      colSpan={cars.length + 1}
                      className="p-3 font-bold text-left"
                    >
                      {category}
                    </td>
                  </tr>

                  {/* Features Under Each Category */}
                  {Object.entries(specs).map(([specName, values]) => {
                    const valuesArray = [...values];
                    const isCommonFeature = valuesArray.length === 1;

                    return (
                      <tr key={specName} className="border border-gray-700">
                        <td
                          className={`p-3 text-white sticky left-0 bg-[#222] z-10 ${
                            isCommonFeature ? "text-green-400" : ""
                          }`}
                        >
                          {specName}
                        </td>
                        {cars.map((car) => {
                          const selectedVariant =
                            selectedVariants[car.model_id];
                          const value =
                            selectedVariant?.specifications?.[category]?.[
                              specName
                            ] || "-";

                          return (
                            <td
                              key={car.model_id}
                              className={`p-3 text-center ${
                                isCommonFeature
                                  ? "text-green-400"
                                  : "text-gray-300"
                              }`}
                            >
                              {value}
                            </td>
                          );
                        })}
                      </tr>
                    );
                  })}
                </React.Fragment>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    );
  };

  useEffect(() => {
    setComparisonCars((prev) =>
      prev.filter((car) => favorites.includes(car.model_id))
    );
  }, [favorites]);

  const toggleComparison = (car: Car) => {
    setComparisonCars((prev: Car[]) => {
      const isAlreadyAdded = prev.some((c) => c.model_id === car.model_id);

      if (isAlreadyAdded) {
        return prev.filter((c) => c.model_id !== car.model_id); // ✅ Remove if already added
      } else {
        if (prev.length >= MAX_COMPARE_CARS) {
          toast.error("You can only compare up to 3 cars.");
          return prev; // ❌ Do not add more than the limit
        }
        return [...prev, car]; // ✅ Add if within limit
      }
    });
  };

  return (
    <>
      <Head>
        <title>Explore Cars – DriveUp</title>
        <meta
          name="description"
          content="Discover cars by features, safety, performance, and design. Filter and compare cars easily on DriveUp."
        />
        <meta property="og:title" content="Explore Cars – DriveUp" />
        <meta
          property="og:description"
          content="Search and filter cars by safety, fuel type, features and more."
        />
        <meta property="og:url" content="https://www.driveup.in/explore" />
        <meta property="og:image" content="/og-image.png" />
      </Head>

      <Toaster />
      <div className="flex min-h-screen w-full max-w-full overflow-x-hidden bg-[#1a1a1a] text-white">
        <Sidebar isOpen={isSidebarOpen} toggleSidebar={toggleSidebar} />
        <motion.div
          key={selectedCar ? selectedCar.model_id : "explore"}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.8 }}
          className="flex min-h-screen w-full max-w-full overflow-x-hidden bg-[#1a1a1a] text-white"
        >
          {!selectedCar ? (
            <main
              className={`transition-all duration-300 ${
                isSidebarOpen ? "ml-64" : "ml-16"
              } p-4 sm:p-8 min-w-screen flex-1 max-w-full overflow-x-hidden`}
            >
              <div className="flex flex-col gap-4 mb-6">
                <div className="flex justify-between items-center">
                  <h1 className="text-2xl mt-2">
                    Let's Explore
                    <strong className="text-[#E9D8A6] font-bold"> Cars</strong>
                  </h1>
                  <div className="flex flex-row sm:justify-between items-center sm:mt-4 mt-2 gap-4">
                    <div className="relative">
                      <SearchBar
                        searchQuery={searchQuery}
                        setSearchQuery={setSearchQuery}
                      />
                    </div>
                    {showSearchInput ? (
                      <button
                        onClick={(e) => {
                          setShowFavorites((prev) => !prev);
                          e.currentTarget.blur(); // ✅ Remove focus after click
                        }}
                        className={`px-6 py-2 transition-all rounded flex items-center gap-2 ${
                          showFavorites
                            ? "bg-[#0A9396] text-white hover:bg-[#00796B]"
                            : "bg-[#EE9B00] text-black hover:bg-white"
                        }`}
                      >
                        {showFavorites ? "Back to Explore" : "Your Favorites"}
                      </button>
                    ) : (
                      <Button
                        className={`p-3 rounded ${
                          showFavorites
                            ? "bg-[#0A9396] text-white"
                            : "bg-[#EE9B00] text-black"
                        } hover:bg-white transition-all duration-300 sm:hidden w-full flex items-center gap-2`}
                        onClick={(e) => {
                          setShowFavorites((prev) => !prev);
                          e.currentTarget.blur(); // ✅ Remove focus after click
                        }}
                      >
                        <Star className="w-5 h-5" />
                      </Button>
                    )}
                  </div>
                </div>

                {/* Filters Section */}
                <div className="flex flex-wrap items-center gap-4 mt-6 sm:mt-6 lg:mt-1">
                  {/* Brand Dropdown with Custom Styling */}
                  {!showFavorites && (
                    <div className="relative w-60">
                      <Select
                        className="text-xs lg:text-sm"
                        options={brands.map((brand) => ({
                          label: brand,
                          value: brand,
                        }))}
                        value={{ label: selectedBrand, value: selectedBrand }}
                        onChange={(selectedOption) =>
                          setSelectedBrand(selectedOption?.value || "")
                        }
                        placeholder="Select Brand"
                        isSearchable={true}
                        styles={{
                          control: (base) => ({
                            ...base,
                            backgroundColor: "#333",
                            borderColor: "#E9D8A6",
                            color: "white",
                          }),
                          menu: (base) => ({
                            ...base,
                            backgroundColor: "#222",
                            color: "white",
                          }),
                          singleValue: (base) => ({
                            ...base,
                            color: "white",
                          }),
                          option: (base, state) => ({
                            ...base,
                            backgroundColor: state.isSelected
                              ? "#0A9396"
                              : "#222",
                            color: "white",
                            ":hover": {
                              backgroundColor: "#0A9396",
                            },
                          }),
                        }}
                      />
                    </div>
                  )}

                  <PriceFilter
                    minPrice={priceRange[0]}
                    maxPrice={priceRange[1]}
                    setPriceRange={setPriceRange}
                  />
                  <div className="w-[1px] h-8 bg-gray-500 mx-2"></div>

                  {/* Quick Capsule Filters with Colors */}
                  <div className="flex items-center gap-2 overflow-x-auto max-w-full">
                    {bodyTypes.map((body, index) => (
                      <Button
                        key={index}
                        variant="ghost"
                        className={`px-6 py-2 text-xs lg:text-sm bg-[#94D2BD] rounded-full border-none ${
                          selectedbody === body
                            ? "bg-[#005F73] text-white border-white"
                            : "text-black"
                        } hover:bg-white hover:text-black transition-all shadow-md`}
                        onClick={(e) => {
                          setselectedbody(selectedbody === body ? null : body);
                          e.currentTarget.blur(); // ✅ removes focus after click
                        }}
                      >
                        {body}
                      </Button>
                    ))}
                  </div>

                  <div className="flex items-center gap-2 overflow-x-auto max-w-full">
                    {fuelTypes.map((fuel, index) => (
                      <Button
                        key={index}
                        variant="ghost"
                        className={`px-6 py-2 text-xs lg:text-sm bg-[#E9D8A6] rounded-full border-none ${
                          selectedFuel === fuel
                            ? "bg-[#BB3E03] text-white border-white"
                            : "text-black"
                        } hover:bg-white hover:text-black transition-all shadow-md`}
                        onClick={(e) => {
                          setSelectedFuel(selectedFuel === fuel ? null : fuel);
                          e.currentTarget.blur(); // ✅ removes focus after click
                        }}
                      >
                        {fuel}
                      </Button>
                    ))}
                  </div>
                  {/*
                <Link href="/explore_test">
                  Clear Filters Button
                  <Button className="px-6 py-2 rounded-full bg-[#EE9B00] text-black hover:bg-white transition-all">
                    Details
                  </Button>
                </Link>*/}
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {loading
                  ? // ✅ Show Skeleton Loaders
                    [...Array(6)].map((_, index) => (
                      <SkeletonCard key={index} />
                    ))
                  : // ✅ Show Actual Cars Once API Loads
                    filteredCars.map((car: Car) => (
                      <div
                        onClick={() => setSelectedCar(car)} // ✅ Clicking on the Card should open details
                        className="cursor-pointer"
                      >
                        <CarCard car={car} />

                        {showFavorites && (
                          <button
                            className={`mt-2 py-1 w-full rounded bg-[#0A9396] text-white ${
                              compareCars.includes(car.model_id)
                                ? "opacity-50 cursor-not-allowed"
                                : "hover:bg-[#00796B]"
                            }`}
                            onClick={(e) => {
                              e.stopPropagation(); // ✅ Prevents triggering the div's onClick
                              toggleComparison(car);
                            }}
                            disabled={compareCars.includes(car.model_id)}
                          >
                            {comparisonCars.includes(car)
                              ? "Remove from Compare"
                              : "Add to Compare"}
                          </button>
                        )}
                      </div>
                    ))}
              </div>
              {/* ✅ Comparison Table (Only When Cars Are Selected) */}
              {comparisonCars.length > 0 && (
                <ComparisonTable cars={comparisonCars} />
              )}
              <footer className="text-center text-gray-400 z-20 w-full relative py-4 h-auto">
                {/* ✅ Desktop Footer */}
                <div className="hidden lg:block text-sm mt-2 -mb-4">
                  <p>&copy; {currentYear} DriveUp. All rights reserved.</p>
                  <p className="mt-1 text-xs">
                    <a
                      href="/terms-and-conditions"
                      className="underline hover:text-gray-300 transition"
                    >
                      Terms & Conditions
                    </a>
                    &nbsp;&nbsp;|&nbsp;&nbsp;
                    <a
                      href="/privacy-policy"
                      className="underline hover:text-gray-300 transition"
                    >
                      Privacy Policy
                    </a>
                  </p>
                </div>

                {/* ✅ Mobile Footer */}
                <div className="lg:hidden text-sm">
                  <p>&copy; {currentYear} DriveUp. All rights reserved.</p>
                  <p className="mt-1 text-xs">
                    <a
                      href="/terms-and-conditions"
                      className="underline hover:text-gray-300 transition"
                    >
                      Terms & Conditions
                    </a>
                    &nbsp;&nbsp;|&nbsp;&nbsp;
                    <a
                      href="/privacy-policy"
                      className="underline hover:text-gray-300 transition"
                    >
                      Privacy Policy
                    </a>
                  </p>
                </div>
              </footer>
            </main>
          ) : (
            <main
              className={`transition-all duration-300 ${
                isSidebarOpen ? "ml-64" : "ml-16"
              } p-4 sm:p-8 min-w-screen flex-1 max-w-full overflow-x-hidden`}
            >
              <button
                className="mb-6 text-gray-400 hover:text-white"
                onClick={() => setSelectedCar(null)}
              >
                ← Back
              </button>

              <div className="bg-[#2a2a2a] border-0 rounded-lg p-4 lg:p-8">
                <div className="flex justify-between items-start mb-8">
                  <div className="flex items-center gap-4">
                    <div>
                      <h2 className="text-lg sm:text-xl lg:text-2xl text-[#E9D8A6] font-bold">
                        {selectedCar.model}
                      </h2>
                      {/* ⭐ Rating Section */}
                      <div className="flex items-center mt-1">
                        {rating && !isNaN(rating) ? ( // ✅ Ensure rating is valid
                          <>
                            {[...Array(5)].map((_, index) => {
                              if (index < Math.floor(rating)) {
                                return (
                                  <Star
                                    key={index}
                                    className="text-yellow-400 w-4 h-4"
                                  />
                                ); // Full Star
                              } else if (
                                index === Math.floor(rating) &&
                                rating % 1 !== 0
                              ) {
                                return (
                                  <StarHalf
                                    key={index}
                                    className="text-yellow-400 w-4 h-4"
                                  />
                                ); // Half Star
                              } else {
                                return (
                                  <Star
                                    key={index}
                                    className="text-gray-600 w-4 h-4"
                                  />
                                ); // Empty Star
                              }
                            })}
                            <span className="text-gray-400 text-sm ml-2">
                              ({rating.toFixed(1)}/5)
                            </span>
                          </>
                        ) : (
                          <span className="text-gray-400 text-sm">
                            No Rating Available
                          </span> // ✅ Show message when rating is missing
                        )}
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-gray-400 text-xs sm:text-xs lg:text-lg">
                      On-Road Price in {user?.city}
                    </p>
                    <div className="relative inline-block group ">
                      <p className="text-base sm:text-base lg:text-2xl font-bold text-white cursor-pointer">
                        ₹{" "}
                        {selectedVariant?.prices &&
                        user?.city &&
                        selectedVariant.prices[user.city.toLowerCase()] &&
                        selectedVariant.prices[user.city.toLowerCase()]
                          .on_road_price
                          ? formatPrice(
                              parseFloat(
                                selectedVariant.prices[user.city.toLowerCase()]
                                  .on_road_price
                              )
                            )
                          : "N/A"}
                      </p>

                      {/* ✅ Price Breakdown Tooltip (Now Fully Responsive & Fixed) */}
                      {selectedVariant?.prices && user?.city && (
                        <div
                          className="absolute left-1/2 transform -translate-x-[80%] lg:-translate-x-1/2 absolute left-1/2 transform -translate-x-1/2 mt-2 
            w-72 max-w-[calc(100vw-20px)] bg-[#333] text-white text-sm p-3 rounded-lg shadow-lg 
            sm:left-5 sm:right-auto sm:transform-none lg:left-auto lg:right-0 mt-2 w-72 bg-[#333] text-white text-sm p-3 rounded-lg shadow-lg 
      hidden group-hover:block transition-opacity duration-200 border border-[#444] z-50"
                        >
                          <p className="font-bold text-[#E9D8A6] text-center">
                            On-Road Price Breakdown
                          </p>
                          <hr className="border-[#444] my-2" />

                          <p className="text-center">
                            Ex-Showroom: ₹{" "}
                            {formatPrice(
                              parseFloat(
                                selectedVariant.prices[user.city.toLowerCase()]
                                  .ex_showroom_price
                              )
                            )}
                          </p>

                          <p className="text-center">
                            RTO + Others: ₹{" "}
                            {formatPrice(
                              parseFloat(
                                selectedVariant.prices[user.city.toLowerCase()]
                                  .rto_others
                              )
                            )}
                          </p>

                          <p className="text-center">
                            Insurance: ₹{" "}
                            {formatPrice(
                              parseFloat(
                                selectedVariant.prices[user.city.toLowerCase()]
                                  .insurance
                              )
                            )}
                          </p>

                          <hr className="border-[#444] my-2" />

                          <p className="font-bold text-[#E9D8A6] text-center">
                            Total On-Road: ₹{" "}
                            {formatPrice(
                              parseFloat(
                                selectedVariant.prices[user.city.toLowerCase()]
                                  .on_road_price
                              )
                            )}
                          </p>
                          <p className="text-gray-400 text-xs mt-3 italic text-center">
                            *Prices are indicative and may vary. Please confirm
                            with the showroom for exact pricing.
                          </p>
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                {/* 🔹 Two-column layout with unified styling */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  {/* 🔹 Left Side: Car Image & Key Features */}
                  <div className="relative mb-3 w-full">
                    <div>
                      {/* 🔹 Swiper Carousel */}
                      <Swiper
                        modules={[Navigation, Pagination, Autoplay]}
                        spaceBetween={10}
                        slidesPerView={1}
                        navigation
                        pagination={{ clickable: true }}
                        autoplay={{ delay: 3000 }}
                        className="rounded-2xl overflow-hidden custom-swiper"
                      >
                        {selectedCar.secondary_image_urls.map(
                          (image, index) => (
                            <SwiperSlide key={index}>
                              <img
                                src={image}
                                className="w-full h-[200px] sm:h-[200px] md:h-[300px] lg:h-[400px] object-cover rounded-2xl mb-4"
                                alt={`Car Image ${index + 1}`}
                              />
                            </SwiperSlide>
                          )
                        )}
                      </Swiper>
                      {/* ⭐ Positioned at the top-right of the image */}
                      <button
                        className={`absolute top-2 right-2 p-2 rounded-full bg-black/50 hover:bg-black/70 transition ${
                          favorites?.includes(selectedCar.model_id)
                            ? "text-[#EE9B00]"
                            : "text-gray-400"
                        }`}
                        onClick={(e) => {
                          e.stopPropagation();
                          toggleFavorite(selectedCar.model_id);
                        }}
                        style={{ zIndex: 10 }} // Ensure it's above the image but below the View Details button
                      >
                        <Star className="w-5 h-5" />
                      </button>
                    </div>
                    <h2 className="text-base lg:text-xl font-bold mb-4 text-white">
                      Key Features
                    </h2>
                    <div className="grid grid-cols-3 gap-4">
                      <div className="bg-[#404040] p-4 rounded-xl text-center">
                        <Fuel className="h-5 w-5 sm:h-5 sm:w-5 md:h-8 md:w-8 mx-auto mb-2 text-gray-400" />
                        <p
                          className="text-xs lg:text-sm text-gray-400 truncate max-w-full"
                          title={selectedCar.fuel_options}
                        >
                          {selectedCar.fuel_options}
                        </p>
                      </div>
                      <div className="bg-[#404040] p-4 rounded-xl text-center">
                        <Zap className="h-5 w-5 sm:h-5 sm:w-5 md:h-8 md:w-8 mx-auto mb-2 text-gray-400" />
                        <p className="text-xs lg:text-sm text-gray-400">
                          {" "}
                          {selectedCar.hp.toLowerCase() === "electric"
                            ? selectedCar.hp
                            : `${selectedCar.hp} BHP`}
                        </p>
                      </div>
                      <div className="bg-[#404040] p-4 rounded-xl text-center">
                        <Cog className="h-5 w-5 sm:h-5 sm:w-5 md:h-8 md:w-8 mx-auto mb-2 text-gray-400" />
                        <p className="text-xs lg:text-sm text-gray-400">
                          {" "}
                          {selectedCar.cc.toLowerCase() === "electric"
                            ? selectedCar.cc
                            : `${selectedCar.cc} cc`}
                        </p>
                      </div>
                    </div>

                    <h2 className="text-base lg:text-xl font-bold mt-8 mb-4 text-white">
                      Car Description
                    </h2>
                    <p className="text-sm lg:text-base text-gray-400">
                      {selectedCar.brief_info}
                    </p>
                    {/* 🔹 Color Options Section (Better UI) */}
                    <div className="mt-6">
                      <h2 className="text-base lg:text-xl font-bold mb-4 text-white">
                        Available Colors
                      </h2>
                      <div
                        ref={scrollRef}
                        className="flex overflow-x-auto gap-4 py-2 overflow-x-scroll scrollbar-hidden snap-x snap-mandatory"
                        onMouseDown={handleMouseDown}
                      >
                        {selectedCar.color_options.map((color, index) => (
                          <div
                            key={index}
                            className="flex flex-col items-center"
                          >
                            {/* Circular Swatches for Better Aesthetics */}
                            <div className="w-24 h-24 rounded-full border-2 border-gray-500 shadow-md overflow-hidden">
                              <img
                                src={selectedCar.color_image_urls[index]}
                                alt={color}
                                className="w-full h-full object-cover"
                              />
                            </div>
                            {/* Color Name Below Swatch */}
                            <p className="text-xs text-gray-300 mt-1 text-center">
                              {color}
                            </p>
                          </div>
                        ))}
                      </div>
                    </div>

                    {selectedCar?.brochure_url ? (
                      <Link
                        href={selectedCar.brochure_url}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        <Button className="px-6 py-2 w-full mt-4 bg-[#94D2BD] text-black hover:bg-white transition-all">
                          Download Brochure
                        </Button>
                      </Link>
                    ) : (
                      <Button className="px-6 py-2 w-full mt-4 bg-gray-400 text-black hover:bg-white transition-all pointer-events-none">
                        Brochure Not Available
                      </Button>
                    )}
                  </div>

                  {/* 🔹 Right Side: Scrollable Features List with Search & Filter */}
                  <div className="relative p-4 lg:p-6 rounded-lg bg-[#2a2a2a] shadow-md border border-gray-600">
                    {/* Animated Scroll Progress Bar */}
                    <motion.div
                      className="absolute top-0 left-0 h-[3px] bg-[#0A9396] rounded-lg"
                      style={{ width: `${scrollProgress}%` }}
                    />

                    <h2 className="text-md lg:text-xl font-bold text-[#E9D8A6] mb-4">
                      Specifications
                    </h2>
                    {/* Variant Dropdown */}
                    <div className="mt-4">
                      <h2 className="text-xs lg:text-sm font-bold text-gray-400 mb-2">
                        Select Variant
                      </h2>
                      <select
                        className="w-full px-4 py-2 bg-[#333] text-white rounded-lg border border-gray-700 outline-none cursor-pointer text-xs lg:text-base"
                        value={selectedVariant?.variant_id || ""}
                        onChange={(e) => {
                          const selected = variants.find(
                            (v) => String(v.variant_id) === e.target.value
                          );
                          setSelectedVariant(selected || null);
                        }}
                        disabled={!variants.length} // ✅ Disable dropdown while loading
                      >
                        {/* Default "Select a variant" option */}
                        <option value="" disabled>
                          Select a variant
                        </option>

                        {/* Map available variants */}
                        {variants.map((variant) => (
                          <option
                            key={variant.variant_id}
                            value={variant.variant_id}
                          >
                            {variant.variant}
                          </option>
                        ))}
                      </select>
                    </div>

                    {/* 🔎 Search Input */}
                    <input
                      type="text"
                      placeholder="Search features"
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="w-full mt-4 mb-4 px-4 py-2 bg-[#333] text-white rounded-lg outline-none border border-gray-700 text-xs lg:text-base"
                    />

                    {/* Features List */}
                    <div
                      className="h-[800px] overflow-y-auto scrollbar-hidden custom-scroll"
                      ref={scrollContainerRef}
                    >
                      {filteredFeatures.length === 0 ? (
                        <p className="text-gray-500 text-xs lg:text-sm">
                          No matching features found.
                        </p>
                      ) : (
                        filteredFeatures.map((section, index) => {
                          if (!section) return null; // ✅ Early return if section is null

                          return (
                            <div key={index} className="mb-6">
                              <h3 className="text-base lg:text-lg font-semibold text-gray-300 sticky top-0 bg-[#2a2a2a] py-2">
                                {section.category}
                              </h3>
                              <ul className="text-gray-400 text-sm space-y-2 mt-2">
                                {section.list.map((feature, idx) => (
                                  <li
                                    key={idx}
                                    className="flex justify-between hover:bg-[#303030] p-2 rounded-md text-xs sm:text-xs lg:text-sm"
                                  >
                                    {feature.name}
                                    <span className="lg:font-semibold text-white text-xs sm:text-xs lg:text-sm text-right">
                                      {String(feature.value)}{" "}
                                      {/* ✅ Safe render */}
                                    </span>
                                  </li>
                                ))}
                              </ul>
                            </div>
                          );
                        })
                      )}
                    </div>
                  </div>
                </div>
              </div>
              <footer className="text-center text-gray-400 z-20 w-full relative py-4 h-auto">
                {/* ✅ Desktop Footer */}
                <div className="hidden lg:block text-sm mt-2 -mb-4">
                  <p>&copy; {currentYear} DriveUp. All rights reserved.</p>
                  <p className="mt-1 text-xs">
                    <a
                      href="/terms-and-conditions"
                      className="underline hover:text-gray-300 transition"
                    >
                      Terms & Conditions
                    </a>
                    &nbsp;&nbsp;|&nbsp;&nbsp;
                    <a
                      href="/privacy-policy"
                      className="underline hover:text-gray-300 transition"
                    >
                      Privacy Policy
                    </a>
                  </p>
                </div>

                {/* ✅ Mobile Footer */}
                <div className="lg:hidden text-sm">
                  <p>&copy; {currentYear} DriveUp. All rights reserved.</p>
                  <p className="mt-1 text-xs">
                    <a
                      href="/terms-and-conditions"
                      className="underline hover:text-gray-300 transition"
                    >
                      Terms & Conditions
                    </a>
                    &nbsp;&nbsp;|&nbsp;&nbsp;
                    <a
                      href="/privacy-policy"
                      className="underline hover:text-gray-300 transition"
                    >
                      Privacy Policy
                    </a>
                  </p>
                </div>
              </footer>
            </main>
          )}
        </motion.div>
      </div>
    </>
  );
};

export default App;

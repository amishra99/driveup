// App.jsx
import { useState, useRef, useEffect, useLayoutEffect } from "react";
import { motion } from "framer-motion";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
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
  ArrowLeft,
  StarHalf,
} from "lucide-react";
import Image from "next/image";
import Select from "react-select";
import Slider from "rc-slider";
import "rc-slider/assets/index.css";
import { useRouter } from "next/router";
import { User } from "firebase/auth"; // Import User type
import { auth } from "@/utils/firebaseConfig";
import { db, doc, getDoc, setDoc } from "@/utils/firebaseConfig";
import { signOut } from "firebase/auth";
import Link from "next/link";
import { CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination, Autoplay } from "swiper/modules";

const carImages = [
  "https://images.unsplash.com/photo-1601362840469-51e4d8d58785?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
  "https://images.unsplash.com/photo-1511919884226-fd3cad34687c?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
  "https://images.unsplash.com/photo-1552519507-da3b142c6e3d?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
];

const cars = [
  {
    brand: "BMW",
    model: "XM",
    transmission: "Manual",
    price: "93,899",
    image: "https://media.zigcdn.com/media/model/2025/Jan/bmw_x3_360x240.jpg",
    specs: {
      type: "Petrol",
      hp: "653 HP",
      cc: "1197 cc",
    },
  },
  {
    brand: "BMW",
    model: "M8 Gran Coupé",
    transmission: "Automatic",
    price: "93,899",
    image: "https://media.zigcdn.com/media/model/2025/Jan/bmw_x3_360x240.jpg",
    specs: {
      type: "Diesel",
      hp: "653 HP",
      cc: "1197 cc",
    },
  },
  {
    brand: "BMW",
    model: "M8 Gran Coupé",
    transmission: "Automatic",
    price: "93,899",
    image: "https://media.zigcdn.com/media/model/2024/Apr/bmw-i5_360x240.jpg",
    specs: {
      type: "Hybrid",
      hp: "653 HP",
      cc: "1197 cc",
    },
  },
  {
    brand: "BMW",
    model: "M8 Gran Coupé",
    transmission: "Manual",
    price: "93,899",
    image: "https://media.zigcdn.com/media/model/2024/Apr/bmw-i5_360x240.jpg",
    specs: {
      type: "Electric",
      hp: "653 HP",
      cc: "1197 cc",
    },
  },
];
const brands = [
  "BMW",
  "Audi",
  "Mercedes",
  "Tesla",
  "Toyota",
  "Honda",
  "Ford",
  "Chevrolet",
  "Hyundai",
  "Nissan",
  "Volkswagen",
  "Volvo",
  "Jaguar",
  "Land Rover",
  "Porsche",
  "Lexus",
  "Mazda",
  "Subaru",
  "Kia",
  "Renault",
];

const thumbnails = [
  "https://images.unsplash.com/photo-1633078654544-61b3455b9161?auto=format&fit=crop&w=100",
  "https://images.unsplash.com/photo-1633078654544-61b3455b9161?auto=format&fit=crop&w=100",
];

const Sidebar = ({ isOpen, toggleSidebar }) => {
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
            <PanelRightOpen className="w-7 h-7" />
          ) : (
            <PanelRightClose className="w-7 h-7" />
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
        >
          <CarFront className="w-7 h-7" />{" "}
          {isOpen && <span className="ml-2 text-sm">Choose Your Car</span>}
        </Button>
        <Button
          variant="ghost"
          className={`w-full flex items-center p-4 text-gray-400 text-base hover:bg-white transition-all duration-300 ${
            isOpen ? "justify-start" : "justify-center"
          }`}
        >
          <Bot className="w-7 h-7" />{" "}
          {isOpen && <span className="ml-2 text-sm">DriveBot</span>}
        </Button>
        <Button
          variant="ghost"
          className={`w-full flex items-center p-4 text-gray-400 text-base hover:bg-white transition-all duration-300 ${
            isOpen ? "justify-start" : "justify-center"
          }`}
        >
          <Headset className="w-7 h-7" />{" "}
          {isOpen && <span className="ml-2 text-sm">Expert Consultation</span>}
        </Button>
        <Button
          variant="ghost"
          className={`w-full flex items-center p-4 text-gray-400 text-base hover:bg-white transition-all duration-300 ${
            isOpen ? "justify-start" : "justify-center"
          }`}
        >
          <Fuel className="w-7 h-7" />{" "}
          {isOpen && <span className="ml-2 text-sm">Fuel Price Tracker</span>}
        </Button>
        <Button
          variant="ghost"
          className={`w-full flex items-center p-4 text-gray-400 text-base hover:bg-white transition-all duration-300 ${
            isOpen ? "justify-start" : "justify-center"
          }`}
        >
          <HelpCircle className="w-7 h-7" />{" "}
          {isOpen && <span className="ml-2 text-sm">Help Request</span>}
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
                      <option value="Delhi">Delhi</option>
                      <option value="Hyderabad">Hyderabad</option>
                      <option value="Kolkata">Kolkata</option>
                      <option value="Mumbai">Mumbai</option>
                      <option value="New Delhi">New Delhi</option>
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

const App = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [user, setUser] = useState<User | null>(null);
  const scrollContainerRef = useRef(null);
  const router = useRouter();
  const [showSearchInput, setShowSearchInput] = useState(false);
  const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen);
  const [searchTerm, setSearchTerm] = useState("");
  const [scrollProgress, setScrollProgress] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      if (scrollContainerRef.current) {
        const { scrollTop, scrollHeight, clientHeight } =
          scrollContainerRef.current;
        const progress = (scrollTop / (scrollHeight - clientHeight)) * 100;
        setScrollProgress(progress);
      }
    };

    if (scrollContainerRef.current) {
      scrollContainerRef.current.addEventListener("scroll", handleScroll);
    }

    return () => {
      if (scrollContainerRef.current) {
        scrollContainerRef.current.removeEventListener("scroll", handleScroll);
      }
    };
  }, []);

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

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      if (!user) {
        if (router.pathname !== "/") {
          router.push("/");
        }
      } else {
        setUser(user);
      }
    });

    return () => unsubscribe();
  }, [router]);

  const features = [
    {
      category: "Engine & Transmission",
      list: [
        { name: "Battery Capacity", value: "83.9 kWh" },
        { name: "Max Power", value: "653HP" },
        { name: "Transmission", value: "Automatic" },
      ],
    },
    {
      category: "Brakes & Suspension",
      list: [
        { name: "Front Brake Type", value: "Disc" },
        { name: "Rear Brake Type", value: "Disc" },
        { name: "Suspension", value: "Adaptive Air Suspension" },
      ],
    },
    {
      category: "Safety & Security",
      list: [
        { name: "Airbags", value: "Yes" },
        { name: "Parking Assist", value: "Yes" },
        { name: "ABS", value: "Yes" },
      ],
    },
    {
      category: "Safety & Security",
      list: [
        { name: "Airbags", value: "Yes" },
        { name: "Parking Assist", value: "Yes" },
        { name: "ABS", value: "Yes" },
      ],
    },
    {
      category: "Safety & Security",
      list: [
        { name: "Airbags", value: "Yes" },
        { name: "Parking Assist", value: "Yes" },
        { name: "ABS", value: "Yes" },
      ],
    },
    {
      category: "Safety & Security",
      list: [
        { name: "Airbags", value: "Yes" },
        { name: "Parking Assist", value: "Yes" },
        { name: "ABS", value: "Yes" },
      ],
    },
  ];

  const filteredFeatures = features
    .map((section) => ({
      ...section,
      list: section.list.filter((feature) =>
        feature.name.toLowerCase().includes(searchTerm.toLowerCase())
      ),
    }))
    .filter((section) => section.list.length > 0);
  const rating = 4.4; // 🔥 Dynamic rating (Change this value as needed)
  const [isFavorite, setIsFavorite] = useState(false);

  return (
    <div className="flex min-h-screen w-full max-w-full overflow-x-hidden bg-[#1a1a1a] text-white">
      <Sidebar isOpen={isSidebarOpen} toggleSidebar={toggleSidebar} />
      <main
        className={`transition-all duration-300 ${
          isSidebarOpen ? "ml-64" : "ml-16"
        } p-4 sm:p-8 min-w-screen flex-1 max-w-full overflow-x-hidden`}
      >
        <button className="mb-6 text-gray-400 hover:text-white">← Back</button>

        <div className="bg-[#2a2a2a] border-0 rounded-lg p-8">
          <div className="flex justify-between items-start mb-8">
            <div className="flex items-center gap-4">
              <div>
                <h2 className="text-2xl text-[#E9D8A6] font-bold">
                  BMW i4 M50 xDrive
                </h2>
                {/* ⭐ Rating Section */}
                <div className="flex items-center mt-1">
                  {[...Array(5)].map((_, index) => {
                    if (index < Math.floor(rating)) {
                      return (
                        <Star key={index} className="text-yellow-400 w-4 h-4" />
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
                        <Star key={index} className="text-gray-600 w-4 h-4" />
                      ); // Empty Star
                    }
                  })}
                  <span className="text-gray-400 text-sm ml-2">
                    ({rating.toFixed(1)}/5)
                  </span>
                </div>
              </div>
            </div>
            <div className="text-right">
              <p className="text-gray-400">On-Road Price in Pune</p>
              <p className="text-2xl font-bold text-white">$93,899.00</p>
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
                  {carImages.map((image, index) => (
                    <SwiperSlide key={index}>
                      <img
                        src={image}
                        className="w-full h-[400px] object-cover rounded-2xl mb-4"
                        alt={`Car Image ${index + 1}`}
                      />
                    </SwiperSlide>
                  ))}
                </Swiper>
                {/* ⭐ Positioned at the top-right of the image */}
                <button
                  className={`absolute top-2 right-2 p-2 rounded-full bg-black/50 hover:bg-black/70 transition ${
                    isFavorite ? "text-[#EE9B00]" : "text-gray-400"
                  }`}
                  onClick={(e) => {
                    e.stopPropagation();
                    setIsFavorite((prev) => !prev);
                  }}
                  style={{ zIndex: 10 }} // Ensure it's above the image but below the View Details button
                >
                  <Star className="w-5 h-5" />
                </button>
              </div>
              <h2 className="text-xl font-bold mb-4 text-white">
                Key Features
              </h2>
              <div className="grid grid-cols-3 gap-4">
                <div className="bg-[#404040] p-4 rounded-xl text-center te">
                  <Fuel className="h-8 w-8 mx-auto mb-2 text-gray-400" />
                  <p className="text-sm text-gray-400">Petrol Car</p>
                </div>
                <div className="bg-[#404040] p-4 rounded-xl text-center">
                  <Zap className="h-8 w-8 mx-auto mb-2 text-gray-400" />
                  <p className="text-sm text-gray-400">653 HP</p>
                </div>
                <div className="bg-[#404040] p-4 rounded-xl text-center">
                  <Cog className="h-8 w-8 mx-auto mb-2 text-gray-400" />
                  <p className="text-sm text-gray-400">1197 cc</p>
                </div>
              </div>

              <h2 className="text-xl font-bold mt-8 mb-4 text-white">
                Car Description
              </h2>
              <p className="text-gray-400">
                BMW X3 is a 5-seater SUV car with price starting from Rs. 75.80
                lakh. The car is available in petrol automatic and diesel
                automatic configurations in 5 colours and 2 variants. The car is
                offered with 2 liter diesel & 2 liter petrol engines. X3 has
                petrol mileage of 13.38 and diesel mileage of 17.86 kmpl.
              </p>
            </div>

            {/* 🔹 Right Side: Scrollable Features List with Search & Filter */}
            <div className="relative p-6 rounded-lg bg-[#2a2a2a] shadow-md border border-gray-600">
              {/* Animated Scroll Progress Bar */}
              <motion.div
                className="absolute top-0 left-0 h-[3px] bg-gradient-to-r from-[#0A9396] to-[#94D2BD] rounded-lg"
                style={{ width: `${scrollProgress}%` }}
              />

              <h2 className="text-xl font-bold text-[#E9D8A6] mb-4">
                Specifications
              </h2>
              {/* 🔹 Variant Dropdown (Newly Added) */}
              <div className="mt-4">
                <h2 className="text-sm font-bold text-gray-400 mb-2">
                  Select Variant
                </h2>
                <select className="w-full px-4 py-2 bg-[#333] text-white rounded-lg border border-gray-700 outline-none cursor-pointer">
                  <option value="bmw-m50">BMW i4 M50 xDrive</option>
                  <option value="bmw-40">BMW i4 eDrive40</option>
                  <option value="bmw-m-sport">BMW i4 M Sport</option>
                </select>
              </div>
              {/* 🔎 Search Input */}
              <input
                type="text"
                placeholder="Search features"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full mt-4 mb-4 px-4 py-2 bg-[#333] text-white rounded-lg outline-none border border-gray-700"
              />

              {/* Features List */}
              <div
                className="h-[580px] overflow-y-auto scrollbar-hidden custom-scroll"
                ref={scrollContainerRef}
              >
                {filteredFeatures.length === 0 ? (
                  <p className="text-gray-500 text-sm">
                    No matching features found.
                  </p>
                ) : (
                  filteredFeatures.map((section, index) => (
                    <div key={index} className="mb-6">
                      <h3 className="text-lg font-semibold text-gray-300 sticky top-0 bg-[#2a2a2a] py-2">
                        {section.category}
                      </h3>
                      <ul className="text-gray-400 text-sm space-y-2 mt-2">
                        {section.list.map((feature, idx) => (
                          <li
                            key={idx}
                            className="flex justify-between hover:bg-[#303030] p-2 rounded-md"
                          >
                            {feature.name}
                            <span className="font-semibold text-white">
                              {feature.value}
                            </span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default App;

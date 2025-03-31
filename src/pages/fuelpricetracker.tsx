import React, { useState, useEffect, useRef } from "react";
import { toast, Toaster } from "react-hot-toast";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { motion } from "framer-motion";
import ShinyText from "@/components/ShinyText/ShinyText";
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
  Info,
  Lightbulb,
  BadgeCheck,
  Layers3,
  XCircle,
  MailCheck,
  PhoneCall,
  Sparkles,
  MailX,
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
  addDoc,
  collection,
  serverTimestamp,
} from "firebase/firestore";
import { signOut, getAuth } from "firebase/auth";
import Link from "next/link";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination, Autoplay } from "swiper/modules";
import { Progress } from "@/components/ui/progress";
import success from "@/components/success.json";
import dynamic from "next/dynamic";
import FuelPriceChart from "@/components/FuelPriceChart";
import {
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import Head from "next/head";

const Lottie = dynamic(() => import("react-lottie-player"), { ssr: false });

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
          className={`w-full flex items-center p-4 rounded-lg text-gray-400 text-base hover:bg-white transition-all duration-300 ${
            isOpen ? "justify-start" : "justify-center"
          }`}
          onClick={() => router.push("/explore")} // Navigate on click
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
          className={`w-full flex items-center p-4 text-black text-base hover:bg-white transition-all duration-300 ${
            isOpen ? "justify-start" : "justify-center"
          }`}
          style={{ backgroundColor: "#0A9396" }}
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



const useAnimatedNumber = (target: number | null, duration = 800) => {
  const [value, setValue] = useState(0);

  useEffect(() => {
    if (target === null || isNaN(target)) return;

    let start = 0;
    const stepTime = 10;
    const increment = target / (duration / stepTime);

    const step = () => {
      start += increment;
      if (start < target) {
        setValue(parseFloat(start.toFixed(2)));
        setTimeout(step, stepTime);
      } else {
        setValue(parseFloat(target.toFixed(2)));
      }
    };

    step();
  }, [target]);

  return value;
};

const App = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const router = useRouter();
  const [user, setUser] = useState<any>(null);
  const [name, setName] = useState("");

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
    };

    if (typeof window !== "undefined") {
      setIsSidebarOpen(window.innerWidth >= 768);
      window.addEventListener("resize", handleResize);
    }
    return () => {
      if (typeof window !== "undefined") {
        window.removeEventListener("resize", handleResize);
      }
    };
  }, []);

  const [city, setCity] = useState("pune"); // default fallback

  useEffect(() => {
    const fetchCity = async () => {
      const user = getAuth().currentUser;
      if (user) {
        const docRef = doc(db, "users", user.uid);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          const userCity = docSnap.data().city?.toLowerCase();
          if (userCity) setCity(userCity);
        }
      }
    };
    fetchCity();
  }, []);

  const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen);

  const currentYear = new Date().getFullYear(); // ✅ Dynamic Year

  const [fuelType, setFuelType] = useState<"petrol" | "diesel">("petrol");

  const [fuelPriceData, setFuelPriceData] = useState<any>({});

  useEffect(() => {
    const fetchFuelPrice = async () => {
      const docRef = doc(db, "fuel_prices", city.toLowerCase());
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        const data = docSnap.data();
        setFuelPriceData(data); // ✅ Store both fuel types
      }
    };

    fetchFuelPrice();
  }, [city]);

  const fuelTrend = fuelPriceData?.[fuelType]; // e.g. "petrol"
  const latestFuelPrice = fuelTrend ? Object.values(fuelTrend).at(-1) : null;

  const [carType, setCarType] = useState<"compact" | "sedan" | "suv">(
    "compact"
  );
  const [drivingType, setDrivingType] = useState<"city" | "highway" | "mixed">(
    "mixed"
  );
  const [distance, setDistance] = useState<number>(50);
  const [cost, setCost] = useState<number | null>(null);

  const mileageMap: {
    [carType: string]: { [drivingType: string]: number };
  } = {
    compact: { city: 15, highway: 20, mixed: 17 },
    sedan: { city: 12, highway: 18, mixed: 15 },
    suv: { city: 8, highway: 14, mixed: 11 },
  };
  const [customMileage, setCustomMileage] = useState<number | undefined>();
  const animatedCost = useAnimatedNumber(cost);
  const [activeTab, setActiveTab] = useState<"trend" | "calculator">("trend");

  return (
    <>
      <Head>
        <title>Fuel Price Tracker – Live Prices by City | DriveUp</title>
        <meta
          name="description"
          content="Track daily petrol and diesel prices in your city. Save money and plan smarter with DriveUp."
        />
        <meta property="og:title" content="Fuel Price Tracker – DriveUp" />
        <meta
          property="og:description"
          content="Live fuel prices from major cities across India."
        />
        <meta property="og:url" content="https://driveup.in/fuelpricetracker" />
        <meta property="og:image" content="/og-image.png" />
      </Head>

      <Toaster />
      <div className="flex min-h-screen w-full max-w-full overflow-x-hidden bg-[#1a1a1a] text-white">
        <Sidebar isOpen={isSidebarOpen} toggleSidebar={toggleSidebar} />
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.8 }}
          className="flex min-h-screen w-full max-w-full overflow-x-hidden bg-[#1a1a1a] text-white"
        >
          <main
            className={`transition-all duration-300 ${
              isSidebarOpen ? "ml-64" : "ml-16"
            } p-4 sm:p-8 min-w-screen flex-1 max-w-full overflow-x-hidden`}
          >
            <div className="flex flex-col gap-1 mb-6">
              <div className="flex justify-between items-center">
                <h1 className="text-2xl mt-4">
                  Stay ahead with
                  <strong className="text-[#E9D8A6] font-bold">
                    {" "}
                    real-time fuel prices
                  </strong>
                </h1>
              </div>
              <p className="text-gray-400 text-sm">
                Whether you're planning a road trip or just heading to work —
                check the latest petrol & diesel prices across major cities in
                seconds.
              </p>
            </div>
            <div className="flex justify-center mb-2">
              <div className="inline-flex border border-zinc-700 rounded-lg bg-zinc-900 text-sm">
                <button
                  onClick={() => setActiveTab("trend")}
                  className={`px-4 py-2 rounded-l-lg ${
                    activeTab === "trend"
                      ? "bg-primary text-[#E9D8A6]"
                      : "text-zinc-400 hover:text-white"
                  }`}
                >
                  Fuel Price Trend
                </button>
                <button
                  onClick={() => setActiveTab("calculator")}
                  className={`px-4 py-2 rounded-r-lg ${
                    activeTab === "calculator"
                      ? "bg-primary text-[#E9D8A6]"
                      : "text-zinc-400 hover:text-white"
                  }`}
                >
                  Fuel Cost Calculator
                </button>
              </div>
            </div>

            {activeTab === "trend" && (
              <div className="px-4 py-8">
                <FuelPriceChart city={city} setCity={setCity} />
              </div>
            )}

            {/* 🚗 Estimated Fuel Cost Calculator */}
            {activeTab === "calculator" && (
              <div className="px-4 py-8 mt-2">
                <Card className="bg-[#1f1f1f] shadow-sm border-zinc-700 rounded-lg">
                  <CardHeader className="px-6 pt-6 pb-4">
                    <CardTitle className="text-xl text-white">
                      Estimated Fuel Cost{" "}
                      <strong className="capitalize text-[#E9D8A6]">
                        Calculator{" "}
                      </strong>{" "}
                    </CardTitle>
                    <CardDescription className="text-sm text-muted-foreground">
                      Plan your ride smarter. Calculate how much fuel your trip
                      will cost based on city, fuel type, car category &
                      distance.
                    </CardDescription>
                  </CardHeader>

                  <CardContent className="px-6 pb-6">
                    <form
                      onSubmit={(e) => {
                        e.preventDefault();

                        const mileage =
                          customMileage || mileageMap[carType][drivingType];
                        const fuelTrend = fuelPriceData?.[fuelType];
                        const latestFuelPrice = fuelTrend
                          ? Object.entries(fuelTrend)
                              .sort(
                                ([dateA], [dateB]) =>
                                  new Date(dateA).getTime() -
                                  new Date(dateB).getTime()
                              )
                              .at(-1)?.[1]
                          : null;

                        if (!latestFuelPrice || !mileage) {
                          setCost(null);
                          return;
                        }

                        const litresUsed = distance / mileage;
                        const estimated = litresUsed * latestFuelPrice;
                        setCost(estimated);
                      }}
                      className="space-y-6"
                    >
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {/* Fuel Type */}
                        <div>
                          <label className="text-sm font-medium text-white">
                            Fuel Type
                          </label>
                          <p className="text-xs text-muted-foreground mb-1">
                            Choose the fuel used by your car
                          </p>
                          <select
                            value={fuelType}
                            onChange={(e) =>
                              setFuelType(e.target.value as "petrol" | "diesel")
                            }
                            className="w-full p-2 rounded-md bg-zinc-800 border border-zinc-600 text-white"
                          >
                            <option value="petrol">Petrol</option>
                            <option value="diesel">Diesel</option>
                          </select>
                        </div>

                        {/* Car Type */}
                        <div>
                          <label className="text-sm font-medium text-white">
                            Car Type
                          </label>
                          <p className="text-xs text-muted-foreground mb-1">
                            Select your car category for mileage estimates
                          </p>
                          <select
                            value={carType}
                            onChange={(e) =>
                              setCarType(
                                e.target.value as "compact" | "sedan" | "suv"
                              )
                            }
                            className="w-full p-2 rounded-md bg-zinc-800 border border-zinc-600 text-white"
                          >
                            <option value="compact">Compact</option>
                            <option value="sedan">Sedan</option>
                            <option value="suv">SUV</option>
                          </select>
                        </div>

                        {/* Driving Condition */}
                        <div>
                          <label className="text-sm font-medium text-white">
                            Driving Condition
                          </label>
                          <p className="text-xs text-muted-foreground mb-1">
                            Where will you be driving the most?
                          </p>
                          <select
                            value={drivingType}
                            onChange={(e) =>
                              setDrivingType(
                                e.target.value as "city" | "highway" | "mixed"
                              )
                            }
                            className="w-full p-2 rounded-md bg-zinc-800 border border-zinc-600 text-white"
                          >
                            <option value="city">City</option>
                            <option value="highway">Highway</option>
                            <option value="mixed">Mixed</option>
                          </select>
                        </div>

                        {/* Distance */}
                        <div>
                          <label className="text-sm font-medium text-white">
                            Distance (in km)
                          </label>
                          <p className="text-xs text-muted-foreground mb-1">
                            Enter your total trip distance
                          </p>
                          <input
                            type="number"
                            value={distance}
                            onChange={(e) =>
                              setDistance(parseFloat(e.target.value))
                            }
                            placeholder="e.g. 50"
                            className="w-full p-2 rounded-md bg-zinc-800 border border-zinc-600 text-white"
                          />
                        </div>
                        {/* Optional Custom Mileage */}
                        <div className="md:col-span-2">
                          <label className="text-sm font-medium text-white">
                            Custom Mileage (optional)
                          </label>
                          <p className="text-xs text-muted-foreground mb-1">
                            Leave blank to use our average estimate. Your
                            mileage may vary!
                          </p>
                          <input
                            type="number"
                            min={1}
                            value={customMileage}
                            onChange={(e) =>
                              setCustomMileage(
                                e.target.value
                                  ? parseFloat(e.target.value)
                                  : undefined
                              )
                            }
                            placeholder="e.g. 18"
                            className="w-full p-2 rounded-md bg-zinc-800 border border-zinc-600 text-white"
                          />
                        </div>
                      </div>

                      {/* Submit Button */}
                      <button
                        type="submit"
                        className="w-full md:w-fit bg-[#0A9396] hover:bg-[#005F73] text-white text-sm px-5 py-2 rounded-md transition-all duration-200"
                      >
                        Calculate Fuel Cost
                      </button>

                      {/* Result Display */}
                      {cost > 0 && (
                        <motion.div
                          className="shadow-sm"
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ duration: 0.5 }}
                        >
                          <div className="mt-6 p-4 rounded-lg border border-zinc-600 bg-zinc-800 shadow-sm">
                            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-6">
                              {/* ✅ Left Side: Textual Info */}
                              <div className="flex-1">
                                <span className="text-xs text-green-500 bg-green-900/20 rounded-full px-2 py-1 mb-2 inline-block">
                                  Based on latest {fuelType} price in{" "}
                                  <strong className="capitalize">
                                    {city.replace("-", " ")}
                                  </strong>
                                </span>
                                <p className="text-sm text-muted-foreground flex items-center gap-2">
                                  <Fuel className="w-4 h-4 text-muted-foreground" />
                                  Estimated Fuel Cost
                                </p>

                                <p className="text-3xl font-semibold text-green-400 mt-1">
                                  ₹{(animatedCost ?? 0).toFixed(2)}
                                </p>

                                <p className="text-xs text-muted-foreground mt-2">
                                  Calculated using mileage of{" "}
                                  <strong>
                                    {customMileage ||
                                      mileageMap[carType][drivingType]}{" "}
                                    km/l
                                  </strong>
                                </p>
                                {/* ⚠️ Disclaimer */}
                                <p className="text-[11px] text-zinc-500 mt-4 italic">
                                  This is only an approximate estimate. Actual
                                  cost may vary depending on your car condition,
                                  traffic, terrain, fuel quality, and driving
                                  behavior.
                                </p>
                              </div>

                              {/* ✅ Right Side: Gauge */}
                              <div className="flex flex-col items-center justify-center">
                                <svg
                                  width="100"
                                  height="100"
                                  viewBox="0 0 100 100"
                                >
                                  <circle
                                    cx="50"
                                    cy="50"
                                    r="45"
                                    stroke="#3f3f46"
                                    strokeWidth="10"
                                    fill="none"
                                  />
                                  <circle
                                    cx="50"
                                    cy="50"
                                    r="45"
                                    stroke={
                                      cost && cost < 500
                                        ? "#22c55e" // green
                                        : cost < 1000
                                        ? "#facc15" // yellow
                                        : "#ef4444" // red
                                    }
                                    strokeWidth="10"
                                    fill="none"
                                    strokeDasharray={`${Math.min(
                                      (cost / 1000) * 283,
                                      283
                                    )}, 283`}
                                    strokeLinecap="round"
                                    transform="rotate(-90 50 50)"
                                  />
                                  <text
                                    x="50"
                                    y="54"
                                    textAnchor="middle"
                                    fontSize="14"
                                    fill="#e4e4e7"
                                    fontWeight="bold"
                                  >
                                    {cost && cost < 500
                                      ? "Low"
                                      : cost < 1000
                                      ? "Medium"
                                      : "High"}
                                  </text>
                                </svg>
                                <span className="text-xs text-muted-foreground mt-1">
                                  Cost Intensity
                                </span>
                              </div>
                            </div>
                          </div>
                        </motion.div>
                      )}
                    </form>
                  </CardContent>
                </Card>
              </div>
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
        </motion.div>
      </div>
    </>
  );
};

export default App;

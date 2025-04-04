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
  Info,
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
import { Progress } from "@/components/ui/progress";
import ailoading from "@/components/ailoading.json";
import dynamic from "next/dynamic";
import Head from "next/head";
import { MultiValue } from "react-select";

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
          className={`w-full flex items-center p-4 text-black text-base hover:bg-white transition-all duration-300 ${
            isOpen ? "justify-start" : "justify-center"
          }`}
          style={{ backgroundColor: "#0A9396" }}
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

const formatPrice = (price: number) => {
  if (price >= 10000000) {
    return `${(price / 10000000).toFixed(2)} Cr`; // Convert to Crores if 1 Cr+
  } else {
    return `${(price / 100000).toFixed(2)} L`; // Convert to Lakhs otherwise
  }
};

const questions = [
  {
    id: "budget",
    question: "What is your budget for the car?",
    options: [
      { id: "<10,00,000", label: "Below 10 Lakhs" },
      { id: "10,00,000 to 20,00,000", label: "10 to 20 Lakhs" },
      { id: "20,00,000 to 40,00,000", label: "20 to 40 Lakhs" },
      { id: ">40,00,000", label: "Above 40 Lakhs" },
    ],
    allowSkip: false, // No skip for this question
    type: "single-select", // ✅ Marked as single-select
    info: "The budget refers to the Ex-showroom price of the car, which excludes road tax, insurance, and registration charges.",
  },
  {
    id: "fuel",
    question: "What fuel type do you prefer?",
    options: [
      { id: "Petrol", label: "Petrol" },
      { id: "Diesel", label: "Diesel" },
      { id: "CNG", label: "CNG" },
      { id: "Electric(Battery)", label: "Electric (EV)" },
    ],
    allowSkip: false, // No skip for this question
    type: "single-select", // ✅ Marked as single-select
  },
  {
    id: "bodyType",
    question: "What kind of car are you looking for?",
    options: [
      { id: "Hatchback", label: "Hatchback" },
      { id: "Sedan", label: "Sedan" },
      { id: "SUV", label: "SUV" },
      { id: "MUV", label: "MUV" },
    ],
    allowSkip: false, // No skip for this question
    type: "single-select", // ✅ Marked as single-select
  },
  //{
  // id: "primaryUsage",
  // question: "How do you plan to use the car?",
  // options: [
  //   { id: "dailycommuting", label: "City Commuting" },
  //  { id: "longhighway", label: "Long Drives" },
  //   { id: "familycar", label: "Family Car" },
  //   { id: "offroading", label: "Off-roading" },
  //],
  // allowSkip: false, // No skip for this question
  // type: "single-select", // ✅ Marked as single-select
  //},
  {
    id: "seatingCapacity",
    question: "How many people should the car accommodate?",
    options: [
      { id: "2", label: "2" },
      { id: "4-5", label: "4 to 5" },
      { id: "6-7", label: "6 to 7" },
      { id: "8+", label: "8+" },
    ],
    allowSkip: false, // No skip for this question
    type: "single-select", // ✅ Marked as single-select
  },
  {
    id: "transmissionType",
    question: "Do you prefer a manual or automatic transmission?",
    options: [
      { id: "Manual", label: "Manual" },
      { id: "Automatic", label: "Automatic" },
      { id: "no_preference", label: "No preference" },
    ],
    allowSkip: false, // No skip for this question
    type: "single-select", // ✅ Marked as single-select
  },
  {
    id: "brand",
    question: "Do you have a preferred car brand?",
    allowSkip: true, // Allow skipping this question
    type: "multi-select", // Identifies this as a dropdown type
  },
  {
    id: "safetyPreference",
    question: "How important are safety features to you?",
    options: [
      { id: "basic", label: "Basic" },
      { id: "advanced", label: "Advanced" },
      { id: "top_tier", label: "Top-tier" },
      { id: "no_preference", label: "No Preference" },
    ],
    allowSkip: false, // No skip for this question
    type: "single-select", // ✅ Marked as single-select
    info: "Basic Safety: ABS, dual airbags.\n Advanced Safety: 6+ airbags, ESP, ADAS.\n Top-Tier Safety: NCAP 5-star rating, auto braking, blind-spot monitoring.",
  },
  {
    id: "performancePreference",
    question: "What matters more to you - Mileage vs Performance?",
    options: [
      { id: "highMileage", label: "High Mileage" },
      { id: "balanced", label: "Balanced" },
      { id: "performance", label: "Performance" },
      { id: "no_preference", label: "No Preference" },
    ],
    allowSkip: true, // No skip for this question
    type: "single-select", // ✅ Marked as single-select
    info: "High Mileage: Engine Power less than 90 BHP.\n Balanced: Engine Power between 90 and 120 BHP.\n Performance: Engine Power more than 120 BHP.",
  },
  {
    id: "additionalFeatures",
    question: "Would you like any of these additional preferences?",
    options: [
      { id: "sunroof", label: "Sunroof" },
      { id: "awd", label: "AWD/4WD" },
      { id: "boot", label: "Large Boot" },
      { id: "no_preference", label: "No Preference" },
    ],
    allowSkip: true, // No skip for this question
    type: "multi-checkbox", // This differentiates it from dropdown multi-select
  },
];

const brandOptions = [
  { value: "Aston Martin", label: "Aston Martin" },
  { value: "Audi", label: "Audi" },
  { value: "Bentley", label: "Bentley" },
  { value: "BMW", label: "BMW" },
  { value: "BYD", label: "BYD" },
  { value: "Citroen", label: "Citroen" },
  { value: "Ferrari", label: "Ferrari" },
  { value: "Force Motors", label: "Force Motors" },
  { value: "Honda", label: "Honda" },
  { value: "Hyundai", label: "Hyundai" },
  { value: "ISUZU", label: "ISUZU" },
  { value: "Jaguar", label: "Jaguar" },
  { value: "Jeep", label: "Jeep" },
  { value: "Kia", label: "Kia" },
  { value: "Lamborghini", label: "Lamborghini" },
  { value: "Land Rover", label: "Land Rover" },
  { value: "Lexus", label: "Lexus" },
  { value: "Lotus", label: "Lotus" },
  { value: "Mahindra", label: "Mahindra" },
  { value: "Maruti Suzuki", label: "Maruti Suzuki" },
  { value: "Maserati", label: "Maserati" },
  { value: "Mclaren", label: "Mclaren" },
  { value: "Mercedes Benz", label: "Mercedes Benz" },
  { value: "MG Motor", label: "MG Motor" },
  { value: "MINI", label: "MINI" },
  { value: "Nissan", label: "Nissan" },
  { value: "Porsche", label: "Porsche" },
  { value: "Renault", label: "Renault" },
  { value: "Rolls Royce", label: "Rolls Royce" },
  { value: "Skoda", label: "Skoda" },
  { value: "Tata", label: "Tata" },
  { value: "Toyota", label: "Toyota" },
  { value: "Volkswagen", label: "Volkswagen" },
  { value: "Volvo", label: "Volvo" },
];

const App = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const router = useRouter();
  const [user, setUser] = useState<any>(null);
  const [name, setName] = useState("");
  const [city, setCity] = useState("");

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

  const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen);

  const currentYear = new Date().getFullYear(); // ✅ Dynamic Year

  const [step, setStep] = useState(0);

  const [showInfo, setShowInfo] = useState(false);

  type Answers = {
    budget: string;
    fuel: string;
    bodyType: string;
    seatingCapacity: string;
    transmissionType: string;
    brand: string[];
    safetyPreference: string;
    performancePreference: string;
    additionalFeatures: string[];

    [key: string]: string | string[]; // 🔥 Add this line
  };

  const [answers, setAnswers] = useState<Answers>({
    budget: "",
    fuel: "",
    bodyType: "",
    seatingCapacity: "",
    transmissionType: "no_preference",
    brand: [],
    safetyPreference: "no_preference",
    performancePreference: "",
    additionalFeatures: [],
  });

  const currentQuestion = questions[step];
  const isAnswered = !!answers[currentQuestion.id as keyof Answers];

  const handleSelect = (questionId: keyof Answers, value: string) => {
    setAnswers((prev) => ({
      ...prev,
      [questionId]: value,
    }));
  };

  type OptionType = { value: string; label: string };

  const handleMultiSelect = (
    questionId: keyof Answers,
    selectedOptions: MultiValue<OptionType>
  ) => {
    setAnswers((prev) => ({
      ...prev,
      [questionId]: selectedOptions.map((option) => option.value),
    }));
  };

  const handleCheckboxSelect = (
    questionId: keyof Answers,
    optionId: string,
    checked: boolean
  ) => {
    setAnswers((prev) => {
      const selected = Array.isArray(prev[questionId])
        ? (prev[questionId] as string[])
        : [];

      return {
        ...prev,
        [questionId]: checked
          ? [...selected, optionId]
          : selected.filter((id) => id !== optionId),
      };
    });
  };

  const handleNext = () => {
    if (!isAnswered && !currentQuestion.allowSkip) return; // Prevent skipping unanswered required questions

    let nextStep = step + 1; // Default next step

    console.log("🚀 Current Step:", step);
    console.log("🚀 Next Step Before Skipping:", nextStep);
    console.log("🚀 Current Question ID:", questions[step].id);
    console.log("🚀 Selected Fuel Type:", answers.fuel);

    // ✅ Skip "Transmission Type" & "Performance Preference" at any step if fuel is "Electric(Battery)"
    while (
      nextStep < questions.length && // Ensure we don't go out of bounds
      answers.fuel === "Electric(Battery)" && // Check if EV is selected
      (questions[nextStep]?.id === "transmissionType" ||
        questions[nextStep]?.id === "performancePreference")
    ) {
      console.log(`⏩ Skipping ${questions[nextStep]?.id}...`);
      nextStep++; // 🚀 Skip the question
    }

    console.log("🚀 Next Step After Skipping:", nextStep);
    setStep(nextStep);
  };

  const handleSkip = () => {
    if (step < questions.length - 1) {
      setStep(step + 1);
    }
  };

  const handleBack = () => {
    if (step === 0) return; // Prevent going back from first question

    let prevStep = step - 1; // Default: Move one step back

    console.log("⬅️ Current Step:", step);
    console.log("⬅️ Previous Step Before Skipping:", prevStep);
    console.log("⬅️ Selected Fuel Type:", answers.fuel);

    // ✅ Skip "Transmission Type" & "Performance Preference" when going back
    while (
      prevStep > 0 && // Ensure we don't go below first question
      answers.fuel === "Electric(Battery)" &&
      (questions[prevStep]?.id === "transmissionType" ||
        questions[prevStep]?.id === "performancePreference")
    ) {
      console.log(`⏪ Skipping ${questions[prevStep]?.id}...`);
      prevStep--; // 🚀 Skip the question when going back
    }

    console.log("⬅️ Previous Step After Skipping:", prevStep);
    setStep(prevStep);
  };

  const totalQuestions = questions.filter(
    (q) =>
      !(
        answers.fuel === "Electric(Battery)" &&
        (q.id === "transmissionType" || q.id === "performancePreference")
      )
  ).length;

  const currentQuestionIndex = questions.filter(
    (q, index) =>
      index <= step &&
      !(
        answers.fuel === "Electric(Battery)" &&
        (q.id === "transmissionType" || q.id === "performancePreference")
      )
  ).length;

  const [loading, setLoading] = useState(false);

  type CarRecommendation = {
    variant_id: string;
    model: string;
    variant: string;
    body_type: string;
    car_price: number;
    performance_and_fuel_economy_fuel_type: string;
    explanation: string[] | string;
  };

  const [recommendations, setRecommendations] = useState<CarRecommendation[]>(
    []
  );
  const [hasSubmitted, setHasSubmitted] = useState(false);

  const loadingRef = useRef<HTMLDivElement | null>(null);

  const handleSubmit = async () => {
    setLoading(true);
    setHasSubmitted(true); // ✅ Mark form as submitted

    // ✅ Scroll to Lottie animation when loading starts
    setTimeout(() => {
      loadingRef.current?.scrollIntoView({ behavior: "smooth" });
    }, 100); // Small delay to ensure smooth scrolling

    const structuredData = {
      budget: answers.budget,
      fuelType: answers.fuel,
      bodyType: answers.bodyType,
      seatingCapacity: answers.seatingCapacity,
      transmissionType:
        answers.fuel === "Electric(Battery)"
          ? "no_preference"
          : answers.transmissionType, // ✅ Skip for EVs
      performancePreference:
        answers.fuel === "Electric(Battery)"
          ? "no_preference"
          : answers.performancePreference, // ✅ Skip for EVs
      brandPreference: answers.brand || [],
      safetyPreference: answers.safetyPreference,
      additionalFeatures: answers.additionalFeatures || [],
    };

    console.log("🚀 Sending Data to API:", structuredData);

    try {
      const response = await fetch("/api/cars/recommendations", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(structuredData),
      });

      if (!response.ok) {
        throw new Error(`API Error: ${response.status} ${response.statusText}`);
      }

      const data = await response.json();
      console.log("✅ API Response:", data);

      if (data.recommendations && Array.isArray(data.recommendations)) {
        setRecommendations(data.recommendations);
      } else {
        throw new Error("Invalid API Response: recommendations missing");
      }
    } catch (error) {
      console.error("❌ Error fetching recommendations:", error);
      setRecommendations([]);
    }

    setLoading(false);
  };

  return (
    <>
      <Head>
        <title>Find Your Car – AI Car Matchmaker | DriveUp</title>
        <meta
          name="description"
          content="Let our AI recommend the best car for you based on your needs, preferences, and budget."
        />
        <meta property="og:title" content="Find Your Car – AI Car Matchmaker" />
        <meta
          property="og:description"
          content="Answer a few questions and let AI find your perfect car match."
        />
        <meta property="og:url" content="https://www.driveup.in/findyourcar" />
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
                  Let's find a suitable
                  <strong className="text-[#E9D8A6] font-bold">
                    {" "}
                    car for you!
                  </strong>
                </h1>
              </div>
              <p className="text-gray-400 text-sm">
                Before we roll, let’s get to know you better! Answer a few quick
                questions, and we’ll match you with the perfect ride!
              </p>
            </div>
            <div className="h-auto flex items-center justify-center p-4">
              <Card className="w-full max-w-3xl p-0 lg:p-6 flex flex-col gap-6 relative rounded-2xl bg-[#1a1a1a] shadow-none border-none mt-10 mb-10">
                {/* Question Counter */}
                <div className="text-center text-sm text-gray-400">
                  Question {currentQuestionIndex} of {totalQuestions}
                </div>

                {/* Question Section */}
                <div className="flex flex-col text-center">
                  <h1 className="text-lg lg:text-2xl font-bold text-[#E9D8A6] mb-10">
                    {currentQuestion.question}
                  </h1>
                  {/* Render Single-Select as Buttons */}
                  {currentQuestion.type === "single-select" && (
                    <div className="grid grid-cols-2 gap-4">
                      {currentQuestion.options?.map((option) => (
                        <Button
                          key={option.id}
                          variant="outline"
                          className={`p-3 h-auto text-white border border-white rounded-lg transition-all duration-300 
          w-full text-center text-xs lg:text-sm px-4 py-3 leading-tight
          ${
            answers[currentQuestion.id] === option.id
              ? "border-[#EE9B00] text-[#EE9B00]"
              : ""
          }`}
                          onClick={() =>
                            handleSelect(currentQuestion.id, option.id)
                          }
                        >
                          {option.label}
                        </Button>
                      ))}
                    </div>
                  )}

                  {/* Render Multi-Select Dropdown (Brand Preference) */}
                  {currentQuestion.type === "multi-select" && (
                    <Select
                      options={brandOptions}
                      isMulti
                      value={
                        Array.isArray(answers[currentQuestion.id])
                          ? (answers[currentQuestion.id] as string[]).map(
                              (val) => ({
                                value: val,
                                label:
                                  brandOptions.find((opt) => opt.value === val)
                                    ?.label || val,
                              })
                            )
                          : []
                      }
                      onChange={(selectedOptions) =>
                        handleMultiSelect(
                          currentQuestion.id as keyof Answers,
                          selectedOptions
                        )
                      }
                      placeholder="Select preferred brands"
                      className="text-black z-50 text-xs lg:text-sm"
                      styles={{
                        control: (base) => ({
                          ...base,
                          backgroundColor: "gray-400",
                          color: "black",
                        }),
                      }}
                    />
                  )}

                  {/* Render Multi-Checkbox (Additional Features) */}
                  {currentQuestion.type === "multi-checkbox" && (
                    <div className="grid grid-cols-2 gap-4">
                      {currentQuestion.options?.map((option) => (
                        <label
                          key={option.id}
                          className="flex items-center gap-2 cursor-pointer bg-[#1a1a1a] border border-white rounded-lg px-3 lg:px-4 py-3 transition-all duration-300 hover:border-[#EE9B00] text-xs lg:text-sm"
                        >
                          <input
                            type="checkbox"
                            value={option.id}
                            checked={answers[currentQuestion.id]?.includes(
                              option.id
                            )}
                            onChange={(e) =>
                              handleCheckboxSelect(
                                currentQuestion.id,
                                option.id,
                                e.target.checked
                              )
                            }
                            className="hidden"
                          />
                          <div
                            className={`w-3 h-3 lg:w-5 lg:h-5 flex items-center justify-center border border-white rounded-md  ${
                              answers[currentQuestion.id]?.includes(option.id)
                                ? "bg-[#EE9B00] border-[#EE9B00]"
                                : "bg-transparent"
                            }`}
                          >
                            {answers[currentQuestion.id]?.includes(
                              option.id
                            ) && (
                              <span className="text-black font-bold">✔</span>
                            )}
                          </div>
                          <span className="text-white text-xs lg:text-sm">
                            {option.label}
                          </span>
                        </label>
                      ))}
                    </div>
                  )}

                  {/* Show "Learn More" button if question has additional details */}
                  {currentQuestion.info && (
                    <div className="mt-2 text-left">
                      <button
                        className="text-gray-400 text-xs hover:text-[#EE9B00] transition duration-200"
                        onClick={() => setShowInfo(!showInfo)}
                      >
                        {showInfo ? "Hide details" : "Learn more"}
                      </button>
                      {showInfo && (
                        <div className="mt-2 text-gray-400 text-sm bg-gray-800 p-3 rounded-lg">
                          {currentQuestion.info
                            .split("\n")
                            .map((line, index) => (
                              <p key={index}>{line}</p>
                            ))}
                        </div>
                      )}
                    </div>
                  )}
                </div>

                {/* Navigation Buttons */}
                <div className="flex justify-between mt-4">
                  <Button
                    variant="ghost"
                    onClick={handleBack}
                    disabled={step === 0}
                    className="text-white"
                  >
                    Back
                  </Button>
                  <div className="flex gap-4">
                    {currentQuestion.allowSkip && (
                      <Button
                        onClick={handleSkip}
                        variant="ghost"
                        className="text-gray-400"
                      >
                        Skip
                      </Button>
                    )}
                    <Button
                      variant="ghost"
                      onClick={(e) => {
                        e.preventDefault();
                        if (step === questions.length - 1) {
                          handleSubmit(); // No need to pass `e`
                        } else {
                          handleNext();
                        }
                      }}
                      disabled={
                        (loading && step === questions.length - 1) ||
                        (!isAnswered && !currentQuestion.allowSkip)
                      }
                      className="text-white"
                    >
                      {loading && step === questions.length - 1
                        ? "Processing..."
                        : step === questions.length - 1
                        ? "Find Cars"
                        : "Next"}
                    </Button>
                  </div>
                </div>

                {/* Progress Bar */}
                <Progress
                  value={((step + 1) / questions.length) * 100}
                  className="mt-4 h-2 rounded-full bg-black/30 [&>div]:bg-[#0A9396]"
                />
                <p className="text-center text-[#94D2BD] text-xs mt-4 font-semibold">
                  Powered by DriveUp AI
                </p>
              </Card>
            </div>
            {/* Car Recommendations */}
            {hasSubmitted && loading ? (
              // ✅ Show car animation GIF during loading
              <div
                ref={loadingRef}
                className="flex flex-col items-center justify-center mt-2"
              >
                <Lottie
                  loop
                  animationData={ailoading}
                  play
                  className="w-56 h-56"
                />
                <p className="text-gray-400 mb-20 -mt-10">
                  Finding the best cars for you...
                </p>
              </div>
            ) : recommendations.length > 0 ? (
              <div className="w-full max-w-full mt-8 ">
                {/* ✅ Header for Recommendations */}
                <h2 className="text-2xl font-bold text-[#E9D8A6] text-center">
                  DriveUp AI-Powered Recommendations
                </h2>
                <p className="text-gray-400 text-sm mt-1 text-center mb-8">
                  Our intelligent system analyzes your preferences to find the{" "}
                  <strong>top 3 best cars</strong> for you.
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  {recommendations.map((car) => (
                    <div
                      key={car.variant_id}
                      className="p-6 rounded-xl shadow-lg bg-[#2a2a2a]"
                    >
                      <h3 className="text-xl font-semibold text-[#E9D8A6]">
                        {car.model}
                      </h3>
                      <p className="text-sm font-semibold">{car.variant}</p>
                      <p className="text-gray-400">
                        {car.body_type} |{" "}
                        {car.performance_and_fuel_economy_fuel_type} | ₹
                        {formatPrice(car.car_price)}
                      </p>

                      {/* ✅ Show explanations as bullet points */}
                      {Array.isArray(car.explanation) ? (
                        <ul className="list-disc pl-5 text-gray-300 mt-2 text-sm">
                          {car.explanation.map((point, index) => (
                            <li key={index}>{point}</li>
                          ))}
                        </ul>
                      ) : (
                        <p className="text-gray-300 mt-2">{car.explanation}</p>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              hasSubmitted &&
              !loading && (
                <p className="text-gray-500 mt-6 text-center mb-10">
                  ⚠️ No recommendations found. Try adjusting your preferences.
                </p>
              )
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

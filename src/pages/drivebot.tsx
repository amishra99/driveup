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
  Trash2,
  X,
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
          className={`w-full flex items-center p-4 text-black text-base hover:bg-white transition-all duration-300 ${
            isOpen ? "justify-start" : "justify-center"
          }`}
          style={{ backgroundColor: "#0A9396" }}
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

const Footer = () => (
  <footer className="bg-[#212121] text-gray-400 text-center p-6 mt-8 w-full">
    <p>© {new Date().getFullYear()} DriveUp. All rights reserved.</p>
  </footer>
);

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

  const [userInput, setUserInput] = useState("");
  const [response, setResponse] = useState("");
  const [loading, setLoading] = useState(false);

  const [conversationHistory, setConversationHistory] = useState(() => {
    const saved = sessionStorage.getItem("drivebot_history");
    return saved ? JSON.parse(saved) : [];
  });

  useEffect(() => {
    const lastTime = sessionStorage.getItem("drivebot_last_activity");
    const now = Date.now();

    // Clear if more than 15 mins (900000 ms)
    if (lastTime && now - parseInt(lastTime) > 15 * 60 * 1000) {
      sessionStorage.removeItem("drivebot_history");
    }

    // Update activity timestamp
    sessionStorage.setItem("drivebot_last_activity", now.toString());
  }, []);

  const handleQuery = async () => {
    if (!userInput.trim()) return;

    const maxQuestions = 10;
    let questionCount = parseInt(
      sessionStorage.getItem("questionCount") || "0",
      10
    );

    // ❌ Exceeded question limit
    if (questionCount >= maxQuestions) {
      toast.error(
        "You've reached the limit of questions for this session. Please try again later. Premium Plans Coming Soon!!"
      );
      return;
    }

    // ✅ Increment question count
    questionCount++;
    sessionStorage.setItem("questionCount", questionCount.toString());

    setLoading(true);
    setResponse("");

    const updatedHistory = [
      ...conversationHistory,
      { role: "user", content: userInput },
    ];

    try {
      const res = await fetch("/api/cars/drivebot-query", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userQuery: userInput,
          history: updatedHistory,
        }),
      });

      const data = await res.json();
      let botReply = data.summary;

      // ✅ Fallback for empty AI responses
      if (!botReply || botReply.trim().length === 0) {
        botReply =
          "Oops! I'm sorry, I couldn't find an answer for that. Try rephrasing your question.";
      }

      const newHistory = [
        ...updatedHistory,
        { role: "assistant", content: botReply },
      ];

      setConversationHistory(newHistory);
      sessionStorage.setItem("drivebot_history", JSON.stringify(newHistory));
      sessionStorage.setItem("drivebot_last_activity", Date.now().toString());

      setResponse(botReply);
      setUserInput("");
    } catch (err) {
      console.error("❌ Error:", err);
      const fallback = "An error occurred. Please try again.";
      setConversationHistory([
        ...updatedHistory,
        { role: "assistant", content: fallback },
      ]);
      setResponse(fallback);
    }

    setLoading(false);
  };

  const [showGuidelines, setShowGuidelines] = useState(false);

  type ChatMessage = {
    role: "user" | "assistant";
    content: string;
  };

  return (
    <>
      <Head>
        <title>DriveBot – Ask Anything About Cars | DriveUp</title>
        <meta
          name="description"
          content="Chat with DriveBot and get instant answers about car features, safety, performance, and more."
        />
        <meta
          property="og:title"
          content="DriveBot – Ask Anything About Cars"
        />
        <meta
          property="og:description"
          content="Your personal car assistant powered by AI."
        />
        <meta property="og:url" content="https://driveup.in/drivebot" />
        <meta property="og:image" content="/og-image.png" />
      </Head>

      <Toaster position="top-right" />
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
                  Have a car question? Ask
                  <strong className="text-[#E9D8A6] font-bold">
                    {" "}
                    DriveBot!
                  </strong>
                </h1>
              </div>
              <p className="text-gray-400 text-sm mt-1 flex items-center">
                Whether you're curious about features, safety, or performance —
                just ask away and DriveBot will handle the rest.
              </p>
            </div>

            {showGuidelines && (
              <div className="relative bg-[#2c2c2c] text-gray-300 text-sm p-6 rounded-xl mb-6 shadow-md border border-[#3a3a3a]">
                {/* Close Button */}
                <button
                  onClick={() => setShowGuidelines(false)}
                  className="absolute top-3 right-3 text-gray-500 hover:text-gray-300 transition"
                  aria-label="Close"
                >
                  <X size={16} />
                </button>
                <h3 className="text-lg font-semibold text-white mb-4">
                  How to Get the Best Answers from{" "}
                  <span className="text-[#E9D8A6]">DriveBot</span>
                </h3>
                <div className="mt-4 mb-4 text-gray-400 text-xs">
                  <strong>Disclaimer:</strong>
                  <p>
                    DriveBot is not a general conversational AI. It is trained
                    to answer car-related queries such as features, pricing,
                    specifications, and safety. While we strive for accuracy,
                    DriveBot may occasionally make mistakes. Please verify
                    important information (especially before making decisions).
                    For best results, ask clear, direct questions.
                  </p>
                </div>
                <div className="bg-[#2c2c2c] text-gray-300 text-sm p-4 rounded-md mb-4">
                  <strong className="text-white">Usage Limits:</strong>
                  <p className="mt-1">
                    You can ask up to <strong>10 questions</strong> per session.
                  </p>

                  <strong className="text-white mt-3 block">
                    Coming Soon:
                  </strong>
                  <p className="mt-1">
                    We're working on{" "}
                    <span className="text-[#E9D8A6] font-medium">
                      {" "}
                      premium subscriptions & credit-based plans
                    </span>{" "}
                    for unlimited access!
                  </p>
                </div>

                {/* --- Section 1: Dos and Don'ts --- */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                  <div className="bg-[#1f1f1f] p-4 rounded-lg border border-[#3d3d3d]">
                    <h4 className="text-sm font-semibold text-green-400 mb-2">
                      ✅ Do
                    </h4>
                    <ul className="space-y-1 list-disc list-inside text-gray-300 text-xs lg:text-sm leading-relaxed">
                      <li>Ask clear, specific car-related questions</li>
                      <li>Mention the brand or model name</li>
                      <li>Use exact feature terms like “ADAS”, “Sunroof”</li>
                      <li>Refer to safety, performance, or comfort specs</li>
                      <li>Use "Clear Chat" to start over if needed</li>
                    </ul>
                  </div>
                  <div className="bg-[#1f1f1f] p-4 rounded-lg border border-[#3d3d3d]">
                    <h4 className="text-sm font-semibold text-red-400 mb-2">
                      🚫 Don’t
                    </h4>
                    <ul className="space-y-1 list-disc list-inside text-gray-300 text-xs lg:text-sm leading-relaxed">
                      <li>
                        Ask overly general questions like “Which is the best
                        car?”
                      </li>
                      <li>Use vague or incomplete queries</li>
                      <li>Expect loan, insurance or servicing suggestions</li>
                      <li>
                        Request non-car topics (finance, dealer info, etc.)
                      </li>
                      <li>Repeat the same question multiple times</li>
                    </ul>
                  </div>
                </div>

                {/* --- Section 2: Example Questions --- */}
                <div className="mb-6">
                  <h4 className="text-sm font-semibold text-white mb-2">
                    Example Questions
                  </h4>
                  <div className="bg-[#1f1f1f] p-4 rounded-lg border border-[#3d3d3d] space-y-1 text-xs lg:text-sm text-gray-300">
                    <p>• Which Hyundai cars have ADAS?</p>
                    <p>• What is the mileage of Tata Nexon petrol?</p>
                    <p>• List SUVs with 6 airbags and a sunroof</p>
                    <p>• Do any electric cars support autonomous parking?</p>
                  </div>
                </div>

                {/* --- Section 3: Supported Feature Types --- */}
                <div>
                  <h4 className="text-sm font-semibold text-white mb-3">
                    DriveBot Can Answer About:
                  </h4>
                  <div className="flex flex-wrap gap-2">
                    {[
                      "Airbags & Safety",
                      "ADAS Features",
                      "Sunroof Types",
                      "Transmission",
                      "Fuel Type",
                      "Mileage (ARAI)",
                      "Autonomous Parking",
                      "Connectivity",
                      "Drive Type (AWD/RWD/FWD)",
                    ].map((feature, idx) => (
                      <span
                        key={idx}
                        className="bg-[#1f1f1f] border border-[#3d3d3d] px-3 py-1 rounded-full text-xs text-gray-300"
                      >
                        {feature}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            )}

            <div className="mt-20 mb-12 w-full">
              <div className="w-full max-w-4xl mx-auto px-2 lg:px-6">
                {/* Chat Messages */}
                <div
                  className={`relative mt-6 bg-[#1f1f1f] p-4 sm:p-6 rounded-lg transition-all duration-300 ease-in-out ${
                    conversationHistory.length === 0 && !loading
                      ? "h-[150px]"
                      : conversationHistory.length < 5 || loading
                      ? "min-h-[300px] sm:min-h-[400px]"
                      : "min-h-[300px] sm:min-h-[400px] max-h-[75vh] overflow-y-auto"
                  }`}
                >
                  {conversationHistory.length === 0 ? (
                    <div className="relative bg-transparent text-xs lg:text-sm text-center text-gray-500 py-11">
                      {/* ℹ️ How to Use button */}
                      <button
                        onClick={() => setShowGuidelines(!showGuidelines)}
                        className="absolute -top-2 -right-1 flex items-center text-gray-500 hover:text-gray-300 transition"
                      >
                        <Info size={14} className="mr-1" />
                        <span className="text-xs">How to Use</span>
                      </button>
                      Start chatting with{" "}
                      <span className="text-[#E9D8A6] font-medium">
                        DriveBot
                      </span>{" "}
                      to explore car insights!
                    </div>
                  ) : (
                    conversationHistory.map(
                      (message: ChatMessage, index: number) => (
                        <div key={index} className="mb-4">
                          {message.role === "user" ? (
                            <div className="text-right">
                              <p className="text-xs text-gray-400">You</p>
                              <div className="inline-block bg-[#0A9396] text-white p-3 rounded-lg max-w-[85%] sm:max-w-[80%] text-xs lg:text-sm">
                                {message.content}
                              </div>
                            </div>
                          ) : (
                            <div className="text-left">
                              <p className="text-xs text-gray-400">DriveBot</p>
                              <div className="inline-block bg-[#262626] text-white p-3 rounded-lg max-w-[85%] sm:max-w-[80%] text-xs lg:text-sm">
                                {message.content}
                              </div>
                            </div>
                          )}
                        </div>
                      )
                    )
                  )}

                  {/* Loading animation */}
                  {loading && (
                    <div className="text-left w-full">
                      <p className="text-xs text-gray-400">DriveBot</p>
                      <div className="inline-block bg-[#262626] text-white p-3 rounded-lg max-w-[85%] sm:max-w-[70%]">
                        <span className="inline-block w-2 h-2 mx-1 bg-white rounded-full animate-bounce"></span>
                        <span className="inline-block w-2 h-2 mx-1 bg-white rounded-full animate-bounce delay-100"></span>
                        <span className="inline-block w-2 h-2 mx-1 bg-white rounded-full animate-bounce delay-200"></span>
                      </div>
                    </div>
                  )}

                  {/* ✅ Clear Chat Button - now inside and padded */}
                  {conversationHistory.length > 0 && (
                    <div className="mt-4 w-full flex justify-center">
                      <button
                        onClick={() => {
                          setConversationHistory([]);
                          sessionStorage.removeItem("drivebot_history");
                        }}
                        className="text-xs text-gray-500 hover:text-gray-300 transition flex items-center"
                      >
                        <Trash2
                          size={14}
                          className="mr-1 inline align-middle opacity-50 hover:opacity-100"
                        />
                        Clear Chat
                      </button>
                    </div>
                  )}
                </div>

                {/* Chat Input */}
                <div className="mt-4 bg-[#404040] p-4 sm:p-6 rounded-lg">
                  <div className="flex flex-col sm:flex-row sm:items-start sm:space-x-4 space-y-3 sm:space-y-0">
                    <textarea
                      className="flex-1 bg-transparent text-white border border-gray-700 rounded-md p-2 resize-none focus:outline-none focus:ring-1 focus:ring-[#0A9396] text-xs lg:text-sm"
                      rows={3}
                      placeholder="Ask me anything about cars. I know their secrets..."
                      value={userInput}
                      onChange={(e) => setUserInput(e.target.value)}
                    />
                    <button
                      onClick={handleQuery}
                      disabled={loading}
                      className="bg-[#0A9396] text-white px-4 py-2 rounded-md hover:bg-[#005F73] transition-colors text-xs lg:text-sm w-full sm:w-auto"
                    >
                      {loading ? "Sending..." : "Send"}
                    </button>
                  </div>
                </div>
              </div>

              <p className="text-center text-gray-400 text-xs mt-4">
                DriveBot v0.5.0.{" "}
                <span className="text-[#94D2BD] font-semibold">
                  Powered by DriveUp AI and OpenAI
                </span>
              </p>
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
        </motion.div>
      </div>
    </>
  );
};

export default App;

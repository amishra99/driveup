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
          className={`w-full flex items-center p-4 text-black text-base hover:bg-white transition-all duration-300 ${
            isOpen ? "justify-start" : "justify-center"
          }`}
          style={{ backgroundColor: "#0A9396" }}
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



const bulletItems = [
  {
    icon: <MailCheck className="text-blue-400 mt-1" size={18} />,
    pill: "Email Support",
    desc: "Fast replies for straightforward questions — no wait, no fluff.",
  },
  {
    icon: <PhoneCall className="text-green-400 mt-1" size={18} />,
    pill: "Live 1:1 Call",
    desc: "Book a personal session for in-depth advice or comparisons.",
  },
  {
    icon: <Lightbulb className="text-yellow-400 mt-1" size={18} />,
    pill: "Smart Suggestions",
    desc: "We match cars to your lifestyle — not just trending models.",
  },
  {
    icon: <Sparkles className="text-purple-400 mt-1" size={18} />,
    pill: "Clarity on Features",
    desc: "We simplify jargon so you focus on what truly matters.",
  },
  {
    icon: <BadgeCheck className="text-emerald-400 mt-1" size={18} />,
    pill: "No Ads. No Bias.",
    desc: "Advice you can trust — brand-neutral and focused on you.",
  },
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

  const [step, setStep] = useState<
    "form" | "followup" | "email-details" | "calendar" | "done" | "success"
  >("form");
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    concern: "",
    budget: "",
    brands: "",
    usage: "",
    timeline: "",
    transmission: "",
  });

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const { name, email, concern } = formData;
    if (!name || !email || !concern)
      return alert("Please fill all required fields.");
    setStep("followup");
  };

  const handleSubmitToFirestore = async (type: "email" | "call") => {
    const user = getAuth().currentUser;

    try {
      // 1. Save to Firestore
      await addDoc(collection(db, "consultation_requests"), {
        userId: user?.uid || null,
        name: formData.name,
        email: formData.email,
        phone: formData.phone || "",
        concern: formData.concern,
        type,
        budget: formData.budget || "",
        brands: formData.brands || "",
        usage: formData.usage || "",
        timeline: formData.timeline || "",
        transmission: formData.transmission || "",
        paymentStatus: type === "call" ? "paid" : "free",
        calendlyScheduled: type === "call",
        createdAt: serverTimestamp(),
      });

      // 2. Admin notification
      await addDoc(collection(db, "mail"), {
        to: "driveupweb@gmail.com",
        message: {
          subject: "New Consultation Request on DriveUp",
          text: `
  New consultation received on DriveUp.
  
  Name: ${formData.name}
  Email: ${formData.email}
  Phone: ${formData.phone}
  Concern: ${formData.concern}
  Type: ${type}
  Budget: ${formData.budget}
  Preferred Brands: ${formData.brands}
  Usage: ${formData.usage}
  Timeline: ${formData.timeline}
  Transmission: ${formData.transmission}
          `,
        },
      });

      // 3. Thank-you email to user
      await addDoc(collection(db, "mail"), {
        to: formData.email,
        message: {
          subject: "Thanks for reaching out to DriveUp",
          text: "Thanks for your consultation request — we’ll be in touch shortly!",
          html: `
  <!DOCTYPE html>
  <html lang="en">
    <head>
      <meta charset="UTF-8" />
      <title>DriveUp – Thank You</title>
    </head>
    <body style="
    margin: 0;
    padding: 0;
    font-family: 'Trebuchet MS', 'Arial Narrow', Arial, sans-serif;
    background-color: #f7f7f7;
  ">
      <table width="100%" cellpadding="0" cellspacing="0" style="background-color:#f7f7f7;padding:0 0 40px">
        <tr>
          <td align="center">
            <table width="600" cellpadding="0" cellspacing="0" style="background-color:#ffffff;border-radius:12px;overflow:hidden">
              <tr>
                <td align="center" style="padding:30px 20px 10px">
                  <img src="https://i.ibb.co/YF0K7WTV/driveup-logo-black.png" alt="DriveUp Logo" width="150" />
                </td>
              </tr>
              <tr>
                <td style="background-color:#fff1e6;padding:30px 40px;text-align:center;">
                  <img src="https://s6.gifyu.com/images/bz4xY.gif" style="height:180px;" alt="Thanks" />
                  <h2 style="color:#111;font-size:22px;font-weight:700;margin:10px 0 10px;">
                    Thanks for reaching out, ${formData.name}!
                  </h2>
                  <p style="font-size:15px;color:#444;line-height:1.6;margin:0;">
                    We’ve received your consultation request. You’ll ${
                      type === "call"
                        ? "be redirected to schedule your call shortly"
                        : "hear back from our expert within 24 hours"
                    }.
                  </p>
                </td>
              </tr>
              <tr>
                <td style="background-color:#f4f4f4;padding:30px 40px;">
                  <h3 style="margin:0 0 15px;font-size:18px;color:#bb3e03;">Your Submitted Details</h3>
                  <p style="font-size:15px;color:#333;margin-bottom:8px;">
                    <strong>Concern:</strong><br />${formData.concern}
                  </p>
  
                  ${
                    type === "email" && formData.budget
                      ? `
                    <p style="font-size:15px;color:#333;margin-bottom:8px;">
                      <strong>Budget:</strong><br />${formData.budget}
                    </p>`
                      : ""
                  }
  
                  ${
                    type === "email" && formData.timeline
                      ? `
                    <p style="font-size:15px;color:#333;margin-bottom:8px;">
                      <strong>Buying Timeline:</strong><br />${formData.timeline}
                    </p>`
                      : ""
                  }
  
                  ${
                    type === "email" && formData.transmission
                      ? `
                    <p style="font-size:15px;color:#333;margin-bottom:8px;">
                      <strong>Transmission Preference:</strong><br />${formData.transmission}
                    </p>`
                      : ""
                  }
                </td>
              </tr>
              <tr>
                <td align="center" style="padding:30px 40px;">
                  <a href="https://driveup.in" style="background-color:#bb3e03;color:#fff;text-decoration:none;padding:12px 24px;border-radius:8px;font-weight:600;">
                    Explore DriveUp
                  </a>
                </td>
              </tr>
              <tr>
                <td align="center" style="padding:20px 30px">
                  <p style="font-size:13px;color:#888;margin-bottom:6px;">Browse our flagship AI features:</p>
                  <p style="font-size:14px;margin:0;">
                    <a href="https://driveup.in/findyourcar" style="color:#bb3e03;text-decoration:none;">Find Your Car</a> &nbsp;|&nbsp;
                    <a href="https://driveup.in/drivebot" style="color:#bb3e03;text-decoration:none;">DriveBot</a>
                  </p>
                </td>
              </tr>
              <tr>
                <td align="center" style="padding-bottom:20px;padding-top:10px; font-size:12px;color:#aaa;line-height:1.6; background-color:#fff1e6; ">
                  <div style="margin-bottom: 10px;">
                    <a href="https://driveup.in/privacy-policy" style="color:#bb3e03;text-decoration:none;margin-right:12px;">Privacy Policy</a>
                    <a href="https://driveup.in/terms-and-conditions" style="color:#bb3e03;text-decoration:none;">Terms & Conditions</a>
                  </div>
                  © ${new Date().getFullYear()} DriveUp. All rights reserved. <br> Drive Smarter. DriveUp.
                </td>
              </tr>
            </table>
          </td>
        </tr>
      </table>
    </body>
  </html>
          `,
        },
      });

      console.log("✅ Saved to Firestore & emails sent");
    } catch (error) {
      console.error("❌ Firestore Error:", error);
    }
  };

  useEffect(() => {
    const script = document.createElement("script");
    script.src = "https://checkout.razorpay.com/v1/checkout.js";
    script.async = true;
    document.body.appendChild(script);

    return () => {
      document.body.removeChild(script);
    };
  }, []);

  const handleEmailFlow = () => {
    setStep("email-details");
  };

  useEffect(() => {
    if (step === "success") {
      const timeout = setTimeout(() => {
        setStep("calendar");
      }, 5000);
      return () => clearTimeout(timeout);
    }
  }, [step]);

  const handleCallFlow = async () => {
    setLoading(true);

    const res = await fetch("/api/payment", {
      method: "POST",
      body: JSON.stringify({ amount: 49 }), // ₹49 → 4900 paise inside API
    });
    const paymentData = await res.json();
    setLoading(false);

    // ✅ Make sure Razorpay is loaded
    if (typeof window === "undefined" || !(window as any).Razorpay) {
      alert("Razorpay SDK not loaded. Please try again.");
      return;
    }

    const options = {
      key: "rzp_test_SDzEUBKgZ8Dqti",
      amount: paymentData.amount,
      currency: "INR",
      name: "DriveUp Expert Consultation",
      description: "Car Consultation Payment",
      order_id: paymentData.id,
      handler: async function () {
        await handleSubmitToFirestore("call");
        setStep("success");
      },
      prefill: {
        name: formData.name,
        email: formData.email,
        contact: formData.phone,
      },
      theme: {
        color: "#00E0C6",
      },
    };

    const razorpay = new (window as any).Razorpay(options);
    razorpay.open();
  };

  return (
    <>
      <Head>
        <title>Expert Car Consultation – Book Advice | DriveUp</title>
        <meta
          name="description"
          content="Get expert help before buying your next car. Book an email or video consultation."
        />
        <meta property="og:title" content="Expert Car Consultation – DriveUp" />
        <meta
          property="og:description"
          content="Ask questions, get personalized help from our car experts."
        />
        <meta property="og:url" content="https://driveup.in/consultation" />
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
                  Talk to a real
                  <strong className="text-[#E9D8A6] font-bold">
                    {" "}
                    car expert
                  </strong>
                </h1>
              </div>
              <p className="text-gray-400 text-sm">
                Stuck choosing the right car? Share your concern and we’ll help
                you figure it out — via email or a quick expert call.
              </p>
            </div>
            <div className=" px-6 py-12 max-w-6xl mx-auto text-white">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                {/* Left Side – Benefits */}
                <div className="space-y-10">
                  <div className="space-y-6 pr-4">
                    <h2 className="text-xl font-semibold text-white tracking-wide">
                      DriveUp - Your co-driver for car decisions
                    </h2>

                    <div className="space-y-6 text-sm text-gray-300 md:pr-6 md:border-r md:border-white/10">
                      {bulletItems.map((item, index) => (
                        <motion.div
                          key={index}
                          className="flex items-start gap-3"
                          initial={{ opacity: 0, x: -15 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{
                            delay: index * 0.08,
                            duration: 0.4,
                            ease: "easeOut",
                          }}
                        >
                          {item.icon}
                          <div>
                            <div className="inline-block text-xs font-medium bg-zinc-800 text-white px-3 py-1 rounded-full mb-1 border border-white/10">
                              <ShinyText
                                text={item.pill}
                                disabled={false}
                                speed={3}
                                className=" animate-shine"
                              />
                            </div>
                            <p className="text-gray-400">{item.desc}</p>
                          </div>
                        </motion.div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Right Side – Form & Flow */}
                <div>
                  {step === "form" && (
                    <form onSubmit={handleFormSubmit} className="space-y-5">
                      <h3 className="text-xl font-semibold text-white">
                        Let’s start with the basics
                      </h3>
                      <p className="text-gray-400 text-sm mb-2">
                        Tell us your concern — we’ll help you through email or a
                        quick call.
                      </p>

                      <input
                        name="name"
                        type="text"
                        required
                        onChange={handleChange}
                        placeholder="Full Name *"
                        className="w-full bg-zinc-800 text-white placeholder:text-gray-400 border border-zinc-700 px-4 py-3 rounded-lg"
                      />
                      <input
                        name="email"
                        type="email"
                        required
                        onChange={handleChange}
                        placeholder="Email *"
                        className="w-full bg-zinc-800 text-white placeholder:text-gray-400 border border-zinc-700 px-4 py-3 rounded-lg"
                      />
                      <input
                        name="phone"
                        type="text"
                        onChange={handleChange}
                        placeholder="Phone (optional)"
                        className="w-full bg-zinc-800 text-white placeholder:text-gray-400 border border-zinc-700 px-4 py-3 rounded-lg"
                      />
                      <textarea
                        name="concern"
                        rows={4}
                        required
                        onChange={handleChange}
                        placeholder="Describe your concern *"
                        className="w-full bg-zinc-800 text-white placeholder:text-gray-400 border border-zinc-700 px-4 py-3 rounded-lg"
                      />

                      <button
                        type="submit"
                        className="bg-[#0A9396] text-white px-6 py-3 rounded-lg hover:opacity-70 transition "
                      >
                        Continue
                      </button>
                    </form>
                  )}

                  {step === "followup" && (
                    <div className="space-y-6">
                      <h3 className="text-xl font-semibold text-white">
                        How would you like to proceed?
                      </h3>

                      <div className="flex flex-col sm:flex-row gap-4">
                        {/* Email Option */}
                        <div className="flex flex-col items-center flex-1">
                          <button
                            onClick={handleEmailFlow}
                            className="w-full bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition text-sm"
                          >
                            Get Answer via Email (Free)
                          </button>
                        </div>

                        {/* Call Option */}
                        <div className="flex flex-col items-center flex-1">
                          <button
                            onClick={handleCallFlow}
                            disabled={loading}
                            className="w-full bg-emerald-500 text-white px-6 py-3 rounded-lg hover:bg-emerald-600 transition text-sm"
                          >
                            {loading
                              ? "Redirecting..."
                              : "Schedule a Call (₹49)"}
                          </button>
                          <span className="mt-1 text-xs text-gray-400">
                            Recommended
                          </span>
                        </div>
                      </div>

                      {/* Benefits Comparison */}
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-4 text-sm text-gray-300">
                        {/* Call Benefits */}
                        <div className="bg-zinc-800 border border-zinc-700 rounded-lg p-5 space-y-3">
                          <div className="flex items-center gap-2 text-white text-sm font-semibold">
                            <PhoneCall className="text-green-400" size={18} />
                            Why choose a 1:1 call?
                          </div>
                          <ul className="list-disc list-inside pl-2 space-y-1">
                            <li>Talk directly to a real car expert</li>
                            <li>Ask unlimited follow-up questions</li>
                            <li>Live comparisons and deeper advice</li>
                            <li>Priority support for urgent decisions</li>
                          </ul>
                        </div>

                        {/* Email Cons */}
                        <div className="bg-zinc-800 border border-zinc-700 rounded-lg p-5 space-y-3">
                          <div className="flex items-center gap-2 text-white text-sm font-semibold">
                            <MailX className="text-red-400" size={18} />
                            Limitations of email-only support
                          </div>
                          <ul className="list-disc list-inside pl-2 space-y-1">
                            <li>Response may take up to 24 hours</li>
                            <li>No live discussion or clarification</li>
                            <li>
                              Harder to compare multiple cars or trade-offs
                            </li>
                            <li>Best for simple, direct queries</li>
                          </ul>
                        </div>
                      </div>
                    </div>
                  )}

                  {step === "email-details" && (
                    <form
                      onSubmit={async (e) => {
                        e.preventDefault();
                        await handleSubmitToFirestore("email");
                        setStep("done");
                      }}
                      className="space-y-5"
                    >
                      {/* Back Button */}
                      <div className="flex items-center justify-between">
                        <h3 className="text-xl font-semibold text-white">
                          A few more details (optional)
                        </h3>
                        <button
                          type="button"
                          onClick={() => setStep("followup")}
                          className="text-xl text-gray-400 hover:text-white transition flex items-center"
                        >
                          ←
                        </button>
                      </div>
                      <p className="text-gray-400 text-sm">
                        These help us give you better recommendations.
                      </p>

                      <input
                        name="budget"
                        type="text"
                        onChange={handleChange}
                        placeholder="Budget Range (e.g. ₹10-15L)"
                        className="w-full bg-zinc-800 text-white placeholder:text-gray-400 border border-zinc-700 px-4 py-3 rounded-lg"
                      />
                      <input
                        name="brands"
                        type="text"
                        onChange={handleChange}
                        placeholder="Preferred Brands (comma-separated)"
                        className="w-full bg-zinc-800 text-white placeholder:text-gray-400 border border-zinc-700 px-4 py-3 rounded-lg"
                      />
                      <select
                        name="usage"
                        onChange={handleChange}
                        className="w-full bg-zinc-800 text-white border border-zinc-700 px-4 py-3 rounded-lg"
                      >
                        <option value="">
                          Usage Type (City, Highway, Family...)
                        </option>
                        <option value="city">City Commute</option>
                        <option value="highway">Highway Travel</option>
                        <option value="family">Family Usage</option>
                        <option value="off-road">Off-Road / Adventure</option>
                      </select>
                      <select
                        name="timeline"
                        onChange={handleChange}
                        className="w-full bg-zinc-800 text-white border border-zinc-700 px-4 py-3 rounded-lg"
                      >
                        <option value="">Buying Timeline</option>
                        <option value="immediate">Within 1 month</option>
                        <option value="3 months">1–3 months</option>
                        <option value="researching">
                          Just researching for now
                        </option>
                      </select>
                      <select
                        name="transmission"
                        onChange={handleChange}
                        className="w-full bg-zinc-800 text-white border border-zinc-700 px-4 py-3 rounded-lg"
                      >
                        <option value="">Transmission Preference</option>
                        <option value="manual">Manual</option>
                        <option value="automatic">Automatic</option>
                        <option value="any">Doesn't matter</option>
                      </select>

                      <button
                        type="submit"
                        className="bg-[#0A9396] text-white px-6 py-3 rounded-lg hover:opacity-90 transition"
                      >
                        Submit Response
                      </button>
                    </form>
                  )}

                  {step === "done" && (
                    <div className="text-green-400 font-medium text-lg mt-6">
                      Thank you! We've received your information. You’ll hear
                      from us within 24 hours.
                    </div>
                  )}
                  {step === "success" && (
                    <div className="space-y-5 text-white">
                      <Lottie
                        loop
                        animationData={success}
                        play
                        className="w-40 h-40"
                      />
                      <h3 className="text-xl font-semibold text-green-400 -mt-10">
                        Payment Successful
                      </h3>

                      <p className="text-gray-300">
                        Thanks for your payment! You’ll be redirected shortly to
                        schedule your expert call.
                      </p>

                      {/* Animated dots */}
                      <p className="text-base text-gray-400 italic">
                        Redirecting{"  "}
                        <span className="inline-block animate-bounce delay-0">
                          .
                        </span>
                        <span className="inline-block animate-bounce delay-100">
                          .
                        </span>
                        <span className="inline-block animate-bounce delay-200">
                          .
                        </span>
                      </p>

                      {/* Fallback link */}
                      <p className="text-xs text-gray-500">
                        Not redirected?{" "}
                        <button
                          onClick={() => setStep("calendar")}
                          className="underline hover:text-white transition"
                        >
                          Click here to continue
                        </button>
                      </p>
                    </div>
                  )}

                  {step === "calendar" && (
                    <div>
                      <h3 className="text-xl font-semibold text-white mb-2">
                        Schedule Your Call
                      </h3>
                      <iframe
                        src="https://calendly.com/driveupconsultation/30min?primary_color=00e0c6&text_color=ffffff&background_color=18181b"
                        width="100%"
                        height="600"
                        frameBorder="0"
                        className="rounded-lg border border-zinc-700"
                        allow="camera; microphone"
                      ></iframe>
                      <p className="text-sm text-gray-400 mt-4">
                        Once you’ve scheduled your call, check your email for
                        the invite.
                        <br />
                        We’re excited to talk — see you soon!
                      </p>
                    </div>
                  )}
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
        </motion.div>
      </div>
    </>
  );
};

export default App;

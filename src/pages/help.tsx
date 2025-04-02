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
  Mail,
  Phone,
  MessageSquare,
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
  Timestamp,
  collection,
  addDoc,
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
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
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
          className={`w-full flex items-center p-4 text-black text-base hover:bg-white transition-all duration-300 ${
            isOpen ? "justify-start" : "justify-center"
          }`}
          style={{ backgroundColor: "#0A9396" }}
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

const categorizedFaqs = {
  General: [
    {
      question: "What is DriveUp?",
      answer:
        "DriveUp is your all-in-one car companion—explore cars, get AI recommendations, track fuel prices, and more, all in one sleek platform.",
    },
    {
      question: "Is DriveUp free to use?",
      answer:
        "Yes! All core features are free. We may offer premium consultation or add-on services in the future — but browsing, comparing, and asking questions will always be free.",
    },
    {
      question: "Where does DriveUp get the car data from?",
      answer:
        "We aggregate data from trusted automotive sources to ensure accuracy, and we update regularly to reflect new models and features.",
    },
    {
      question: "Can I use DriveUp on mobile?",
      answer:
        "Absolutely! DriveUp is fully responsive and works beautifully on mobile, tablet, and desktop — so you can research cars anytime, anywhere.",
    },
    {
      question: "Is my data safe on DriveUp?",
      answer:
        "Yes. We take privacy seriously. Any data you provide (like for consultations) is stored securely and never shared without your consent.",
    },
    {
      question: "How often is the site updated?",
      answer:
        "We're constantly improving DriveUp! From updating fuel prices daily to adding new car models, features, and tools — you’ll always see the latest here.",
    },
  ],
  Features: [
    {
      question: "How do I use the AI car recommendation feature?",
      answer:
        "Head over to the 'Find Your Car' page and answer a few quick questions. Our AI will suggest the best cars for you based on your needs.",
    },
    {
      question: "How accurate are the fuel prices?",
      answer:
        "Fuel prices are updated daily from reliable public sources. While we ensure regular updates, slight variations may occur locally.",
    },
    {
      question: "What is the Explore Page?",
      answer:
        "The Explore Page lets you browse and compare different car models based on key specs like safety, performance, comfort, and price — all in one place.",
    },
    {
      question: "Can I filter cars by specific features?",
      answer:
        "Yes! You can filter cars by fuel type, transmission, safety features, performance, and more — making it easy to find exactly what you're looking for.",
    },

    {
      question: "What is DriveBot?",
      answer:
        "DriveBot is your AI car assistant. Ask it anything — from car specs to suggestions — and it’ll fetch answers based on real data instantly.",
    },
    {
      question: "Does DriveBot remember what I ask?",
      answer:
        "Yes — DriveBot remembers your questions during your visit, so you can have a smooth, contextual chat until the session ends.",
    },
    {
      question: "What is the ‘Find Your Car’ feature?",
      answer:
        "It's a smart car recommendation tool powered by AI — just answer a few fun questions, and we’ll suggest the best cars tailored to your needs.",
    },
    {
      question: "How accurate are the recommendations?",
      answer:
        "We analyze your preferences across safety, performance, budget, and more, then rank the most relevant cars using real data — not ads.",
    },
    {
      question: "Can I retake the quiz?",
      answer:
        "Absolutely! You can revisit the 'Find Your Car' feature anytime and try different answers to explore other options.",
    },
    {
      question: "Where do the fuel prices come from?",
      answer:
        "We fetch live fuel prices daily from public sources like GoodReturns to give you the latest info, city by city.",
    },
    {
      question: "Can I calculate my fuel cost?",
      answer:
        "Yes! Just enter your city, distance, and driving conditions — and we’ll show you the estimated fuel cost using real-time prices.",
    },
    {
      question: "Do you save fuel price history?",
      answer:
        "Right now we only show the latest prices, but we may add historical trends in a future update.",
    },
  ],
  Support: [
    {
      question: "Can I contact someone for specific car advice?",
      answer:
        "Absolutely! Use the Contact Form in the Help section to reach out. You can even schedule a paid expert consultation if needed.",
    },
    {
      question: "How does Expert Consultation work?",
      answer:
        "You just fill out a short form about your car concern, and an expert will respond either via email or by scheduling a call — your choice!",
    },
    {
      question: "Is there a charge for consultations?",
      answer:
        "Email consultations are free, while call-based expert sessions may include a nominal fee depending on the request.",
    },
    {
      question: "How soon will I get a response?",
      answer:
        "We typically respond to all queries within 24 hours — often much faster!",
    },
  ],
};

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

  const [searchTerm, setSearchTerm] = useState("");
  const [activeTab, setActiveTab] = useState("General");

  type Category = keyof typeof categorizedFaqs;

  const faqs = categorizedFaqs[activeTab as Category] || [];

  const filteredFaqs = faqs.filter((faq) =>
    faq.question.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const [formType, setFormType] = useState<"contact" | "feedback" | null>(null);

  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!formType) return;

    const form = e.currentTarget; // ✅ safer than `e.target`

    const formData = {
      name:
        (form.elements.namedItem("name") as HTMLInputElement)?.value ||
        "Anonymous",
      email: (form.email as HTMLInputElement)?.value,
      phone: (form.phone as HTMLInputElement)?.value || "N/A",
      message: (form.message as HTMLTextAreaElement)?.value,
      category: (form.category as HTMLSelectElement)?.value || null, // for feedback only
      timestamp: Timestamp.now(),
    };

    const collectionName = formType === "contact" ? "contacts" : "feedbacks";
    const subject =
      formType === "contact"
        ? "New Contact Submission on DriveUp"
        : "New Feedback on DriveUp";

    const text =
      formType === "contact"
        ? `
  New contact received on DriveUp:
  
  Name: ${formData.name}
  Email: ${formData.email}
  Phone: ${formData.phone}
  Message: ${formData.message}
  `
        : `
  New feedback received on DriveUp:
  
  Name: ${formData.name}
  Email: ${formData.email}
  Phone: ${formData.phone}
  Category: ${formData.category}
  Message: ${formData.message}
  `;

    try {
      await addDoc(collection(db, collectionName), formData);

      await addDoc(collection(db, "mail"), {
        to: "driveupweb@gmail.com",
        message: {
          subject,
          text,
        },
      });

      toast.success(
        formType === "contact"
          ? "Your message has been sent!"
          : "Thanks for the feedback!"
      );

      setIsSubmitted(true);
      form.reset();
      setTimeout(() => {
        setIsSubmitted(false);
        setFormType(null);
      }, 3000);
    } catch (err) {
      console.error("Error submitting form:", err);
    }
  };

  const closeForm = () => {
    setFormType(null);
    setIsSubmitted(false);
  };

  return (
    <>
      <Head>
        <title>Help & Support – DriveUp</title>
        <meta
          name="description"
          content="Need help with DriveUp? Browse FAQs or contact our team for support or feedback."
        />
        <meta property="og:title" content="Help & Support – DriveUp" />
        <meta
          property="og:description"
          content="Get answers to your questions and contact DriveUp support."
        />
        <meta property="og:url" content="https://driveup.in/help" />
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
                  Need a hand?{" "}
                  <span className="text-[#E9D8A6] font-semibold">
                    Help is here.
                  </span>
                </h1>
              </div>
              <p className="text-gray-400 text-sm mt-1 flex items-center">
                Got questions, suggestions, or just feeling curious? Browse our
                FAQs, drop us a message, or share your feedback — we’ve got your
                back, every mile of the way.
              </p>
            </div>
            <section className="w-full max-w-5xl mx-auto py-16 px-2 lg:px-4 md:px-6">
              <h2 className="text-center text-xl lg:text-4xl font-bold bg-gradient-to-r from-[#0A9396] to-[#94D2BD] bg-clip-text text-transparent mb-4">
                Frequently Asked Questions
              </h2>
              <p className="text-center text-gray-400 mb-10 max-w-2xl mx-auto text-xs lg:text-sm md:text-base">
                Need help with something? Browse by category or search your
                query below.
              </p>

              <div className="mb-6 max-w-lg mx-auto">
                <Input
                  type="text"
                  placeholder="Search FAQs..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="bg-[#1e1e1e] border border-gray-700 placeholder:text-gray-500 text-white text-sm lg:text-base"
                />
              </div>

              <Tabs
                value={activeTab}
                onValueChange={(val) => {
                  setActiveTab(val);
                  setSearchTerm(""); // Reset search on tab switch
                }}
                className="w-full"
              >
                <TabsList className="flex justify-center mb-10 bg-[#1a1a1a] rounded-full px-4 py-2 gap-2">
                  {Object.keys(categorizedFaqs).map((category) => (
                    <TabsTrigger
                      key={category}
                      value={category}
                      className="rounded-full px-4 py-1.5 text-xs lg:text-sm md:text-base font-medium data-[state=active]:bg-gradient-to-r data-[state=active]:from-[#0A9396] data-[state=active]:to-[#94D2BD] data-[state=active]:text-black"
                    >
                      {category}
                    </TabsTrigger>
                  ))}
                </TabsList>

                {Object.keys(categorizedFaqs).map((category) => (
                  <TabsContent key={category} value={category}>
                    <Accordion type="single" collapsible className="space-y-4">
                      {filteredFaqs.length > 0 ? (
                        filteredFaqs.map((faq, index) => (
                          <AccordionItem
                            key={index}
                            value={`faq-${index}`}
                            className="bg-[#1b1b1b] border border-gray-700 rounded-2xl shadow-md overflow-hidden transition-all hover:shadow-lg"
                          >
                            <AccordionTrigger className="text-left text-xs lg:text-lg font-semibold px-6 py-4 [&>svg]:text-gray-400 hover:[&>svg]:text-white no-underline hover:no-underline focus:no-underline">
                              {faq.question}
                            </AccordionTrigger>

                            <AccordionContent className="px-6 pb-6 text-gray-400 text-xs lg:text-base leading-relaxed">
                              {faq.answer}
                            </AccordionContent>
                          </AccordionItem>
                        ))
                      ) : (
                        <p className="text-center text-gray-500 pt-6">
                          No results found.
                        </p>
                      )}
                    </Accordion>
                  </TabsContent>
                ))}
              </Tabs>
              <div className="text-center text-sm text-gray-400 mt-8">
                Still have questions or feedback?{" "}
                <button
                  onClick={() => {
                    setFormType("contact");
                    setIsSubmitted(false);
                  }}
                  className="underline text-white hover:no-underline mx-1"
                >
                  Contact us
                </button>
                or
                <button
                  onClick={() => {
                    setFormType("feedback");
                    setIsSubmitted(false);
                  }}
                  className="underline text-white hover:no-underline mx-1"
                >
                  Send feedback
                </button>
              </div>

              {/* FORM CONTAINER */}
              {formType && (
                <div className="relative">
                  {/* Success Message */}
                  {isSubmitted ? (
                    <div className="text-center py-8">
                      <h3 className="text-lg lg:text-xl text-white font-semibold mb-2 mt-10">
                        Thanks!
                      </h3>
                      <p className="text-gray-400">
                        We've received your {formType} and will get back to you
                        soon.
                      </p>
                    </div>
                  ) : (
                    <>
                      {formType === "contact" && (
                        <div className="mt-10 bg-[#1b1b1b] p-6 lg:p-8 rounded-xl border border-gray-700 shadow-lg relative">
                          {/* Close Button */}
                          <button
                            onClick={closeForm}
                            className="absolute top-4 right-4 text-gray-400 hover:text-red-500 transition-colors"
                          >
                            <X size={20} />
                          </button>

                          {/* Header */}
                          <h3 className="text-lg lg:text-2xl font-bold text-white mb-1 mt-4 lg:mt-0">
                            Let’s Connect
                          </h3>
                          <p className="text-gray-400 text-xs lg:text-sm mb-6">
                            Have a question or need support? Fill out the form
                            and we’ll get back to you as soon as we can.
                          </p>

                          {/* Form */}
                          <form
                            className="grid grid-cols-1 gap-5"
                            onSubmit={handleSubmit}
                          >
                            {/* Name */}
                            <div className="relative">
                              <Users className="absolute left-3 top-3 h-3 w-3 lg:h-4 lg:w-4 text-gray-500" />
                              <input
                                type="text"
                                name="name"
                                required
                                placeholder="Your Name"
                                className="w-full pl-10 pr-4 py-2 bg-[#27272a] border border-gray-700 rounded-md text-white placeholder:text-gray-500 focus:outline-none focus:ring-1 focus:ring-white text-xs lg:text-base"
                              />
                            </div>

                            {/* Email */}
                            <div className="relative">
                              <Mail className="absolute left-3 top-3 h-3 w-3 lg:h-4 lg:w-4 text-gray-500" />
                              <input
                                type="email"
                                name="email"
                                required
                                placeholder="Email Address"
                                className="w-full pl-10 pr-4 py-2 bg-[#27272a] border border-gray-700 rounded-md text-white placeholder:text-gray-500 focus:outline-none focus:ring-1 focus:ring-white text-xs lg:text-base"
                              />
                            </div>

                            {/* Phone */}
                            <div className="relative">
                              <Phone className="absolute left-3 top-3 h-3 w-3 lg:h-4 lg:w-4 text-gray-500" />
                              <input
                                type="tel"
                                name="phone"
                                required
                                placeholder="Phone Number"
                                className="w-full pl-10 pr-4 py-2 bg-[#27272a] border border-gray-700 rounded-md text-white placeholder:text-gray-500 focus:outline-none focus:ring-1 focus:ring-white text-xs lg:text-base"
                              />
                            </div>

                            {/* Message */}
                            <div className="relative">
                              <MessageSquare className="absolute left-3 top-3 h-3 w-3 lg:h-4 lg:w-4 text-gray-500" />
                              <textarea
                                required
                                name="message"
                                rows={4}
                                placeholder="Your Message"
                                className="w-full pl-10 pr-4 py-2 bg-[#27272a] border border-gray-700 rounded-md text-white placeholder:text-gray-500 focus:outline-none focus:ring-1 focus:ring-white text-xs lg:text-base"
                              />
                            </div>

                            {/* Submit Button */}
                            <button
                              type="submit"
                              className="bg-[#94D2BD] hover:bg-[#0A9396] text-black py-2 px-4 rounded-md text-xs lg:text-sm font-medium transition-colors"
                            >
                              Send Message
                            </button>
                          </form>
                        </div>
                      )}

                      {formType === "feedback" && (
                        <div className="mt-10 bg-[#1b1b1b] p-6 lg:p-8 rounded-xl border border-gray-700 shadow-lg relative">
                          {/* Close Button */}
                          <button
                            onClick={closeForm}
                            className="absolute top-4 right-4 text-gray-400 hover:text-red-500 transition-colors"
                          >
                            <X size={20} />
                          </button>

                          {/* Header */}
                          <h3 className="text-lg lg:text-2xl font-bold text-white mb-1 mt-4 lg:mt-0">
                            We’d Love Your Feedback
                          </h3>
                          <p className="text-gray-400 text-xs lg:text-sm mb-6">
                            Help us improve DriveUp — let us know what’s working
                            great and what could be better.
                          </p>

                          {/* Form */}
                          <form
                            className="grid grid-cols-1 gap-5"
                            onSubmit={handleSubmit}
                          >
                            {/* Name (Optional) */}
                            <div className="relative">
                              <Users className="absolute left-3 top-3 h-3 w-3 lg:h-4 lg:w-4 text-gray-500" />
                              <input
                                type="text"
                                name="name"
                                placeholder="Your Name (Optional)"
                                className="w-full pl-10 pr-4 py-2 bg-[#27272a] border border-gray-700 rounded-md text-white placeholder:text-gray-500 focus:outline-none focus:ring-1 focus:ring-white text-xs lg:text-base"
                              />
                            </div>

                            {/* Email */}
                            <div className="relative">
                              <Mail className="absolute left-3 top-3 h-3 w-3 lg:h-4 lg:w-4 text-gray-500" />
                              <input
                                type="email"
                                name="email"
                                required
                                placeholder="Email Address"
                                className="w-full pl-10 pr-4 py-2 bg-[#27272a] border border-gray-700 rounded-md text-white placeholder:text-gray-500 focus:outline-none focus:ring-1 focus:ring-white text-xs lg:text-base"
                              />
                            </div>

                            {/* Phone */}
                            <div className="relative">
                              <Phone className="absolute left-3 top-3 h-3 w-3 lg:h-4 lg:w-4 text-gray-500" />
                              <input
                                type="tel"
                                name="phone"
                                required
                                placeholder="Phone Number"
                                className="w-full pl-10 pr-4 py-2 bg-[#27272a] border border-gray-700 rounded-md text-white placeholder:text-gray-500 focus:outline-none focus:ring-1 focus:ring-white text-xs lg:text-base"
                              />
                            </div>

                            {/* Feedback Category Dropdown */}
                            <div className="relative">
                              <MessageSquare className="absolute left-3 top-3 h-3 w-3 lg:h-4 lg:w-4 text-gray-500" />
                              <select
                                name="category"
                                required
                                className="w-full pl-10 pr-4 py-2 bg-[#27272a] border border-gray-700 rounded-md text-white appearance-none focus:outline-none focus:ring-1 focus:ring-white text-xs lg:text-base"
                              >
                                <option value="">
                                  What's your feedback about?
                                </option>
                                <option value="UI/UX">UI/Design</option>
                                <option value="feature">
                                  Feature Suggestion
                                </option>
                                <option value="bug">Bug/Issue</option>
                                <option value="content">
                                  Content/Info Accuracy
                                </option>
                                <option value="general">
                                  General Feedback
                                </option>
                              </select>
                            </div>

                            {/* Feedback Message */}
                            <div className="relative">
                              <MessageSquare className="absolute left-3 top-3 h-3 w-3 lg:h-4 lg:w-4 text-gray-500" />
                              <textarea
                                name="message"
                                required
                                rows={4}
                                placeholder="Share your thoughts..."
                                className="w-full pl-10 pr-4 py-2 bg-[#27272a] border border-gray-700 rounded-md text-white placeholder:text-gray-500 focus:outline-none focus:ring-1 focus:ring-white text-xs lg:text-base"
                              />
                            </div>

                            {/* Submit Button */}
                            <button
                              type="submit"
                              className="bg-[#94D2BD] hover:bg-[#0A9396] text-black py-2 px-4 rounded-md text-xs lg:text-sm font-medium transition-colors"
                            >
                              Submit Feedback
                            </button>
                          </form>
                        </div>
                      )}
                    </>
                  )}
                </div>
              )}
            </section>

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

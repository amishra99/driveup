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

const App = () => {
  const currentYear = new Date().getFullYear(); // ✅ Dynamic Year
  const router = useRouter();

  return (
    <>
      <Head>
        <title>Terms and Conditions – DriveUp</title>
        <meta
          name="description"
          content="Read the terms of use for DriveUp’s services including user conduct, payments, and legal disclaimers."
        />
        <meta property="og:title" content="Terms and Conditions – DriveUp" />
        <meta
          property="og:description"
          content="These terms govern your use of the DriveUp platform."
        />
        <meta
          property="og:url"
          content="https://driveup.in/terms-and-conditions"
        />
        <meta property="og:image" content="/og-image.png" />
      </Head>

      <Toaster position="top-right" />
      <div className="flex min-h-screen w-full max-w-full overflow-x-hidden bg-[#1a1a1a] text-white">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.8 }}
          className="flex min-h-screen w-full max-w-full overflow-x-hidden bg-[#1a1a1a] text-white"
        >
          <main className="p-4 sm:p-8 min-w-screen flex-1 max-w-full overflow-x-hidden">
            {/* Header with logo and back button */}
            <div className="max-w-4xl mx-auto flex justify-between px-4 py-4 border-b border-gray-200 shadow-sm sticky top-0 z-10">
              <div className="flex items-center space-x-2">
                <Image
                  src="/driveup_logo_white.png"
                  alt="DriveUp Logo"
                  width={140}
                  height={140}
                />
              </div>
              <button
                onClick={() => router.back()}
                className="text-sm px-4 py-2 text-gray-400 hover:text-white transition"
              >
                ← Back
              </button>
            </div>
            <div className="max-w-4xl mx-auto px-4 py-10 text-zinc-400">
              <h1 className="text-3xl font-bold mb-6 text-[#E9D8A6]">
                Terms and Conditions
              </h1>
              <p className="mb-4">
                These Terms and Conditions ("Terms") govern your use of the
                DriveUp website (the "Service") operated by DriveUp ("we", "us",
                or "our").
              </p>
              <p className="mb-4">
                By accessing or using our Service, you agree to be bound by
                these Terms. If you disagree with any part of the Terms, please
                do not use our Service.
              </p>

              <h2 className="text-2xl font-semibold mt-10 mb-4 text-white">
                1. Use of the Service
              </h2>
              <p className="mb-4">
                DriveUp provides car-related information, tools, and expert
                consultation features. You may be required to create an account
                to access certain features. You are responsible for maintaining
                the confidentiality of your account and password and for
                restricting access to your device.
              </p>
              <p className="mb-4">
                You agree to provide accurate, current, and complete information
                during registration and to update such information to keep it
                accurate and complete.
              </p>
              <h2 className="text-2xl font-semibold mt-10 mb-4 text-white">
                2. Payments and Consultations
              </h2>
              <p className="mb-4">
                Some features of the Service, such as expert consultations, may
                require payment. All payments are securely processed through
                Razorpay. By submitting payment information, you authorize us to
                charge the applicable fees.
              </p>
              <p className="mb-4">
                Prices, available slots, and service details are subject to
                change without prior notice.
              </p>

              <h2 className="text-2xl font-semibold mt-10 mb-4 text-white">
                3. Refunds and Cancellations
              </h2>
              <p className="mb-4">
                If you are not satisfied with a paid consultation or need to
                cancel your booking, you may request a refund or reschedule
                prior to the scheduled time. Refunds will be processed in
                accordance with our internal refund policy and may take up to 7
                business days.
              </p>
              <p className="mb-4">
                To request a refund or cancel a session, please contact us
                through the Help page or email us at support@driveup.in.
              </p>

              <h2 className="text-2xl font-semibold mt-10 mb-4 text-white">
                4. User Responsibilities
              </h2>
              <p className="mb-4">
                You agree to use the Service only for lawful purposes and in
                accordance with these Terms. You are responsible for any
                activity conducted through your account.
              </p>

              <h2 className="text-2xl font-semibold mt-10 mb-4 text-white">
                5. Prohibited Activities
              </h2>
              <p className="mb-4">You agree not to:</p>
              <ul className="list-disc list-inside space-y-2 mb-6">
                <li>Use the Service for any unlawful or fraudulent purpose</li>
                <li>
                  Attempt to interfere with the proper functioning of the
                  Service
                </li>
                <li>
                  Access data not intended for you or breach system security
                </li>
                <li>
                  Copy, modify, or reverse engineer any part of the Service
                </li>
                <li>
                  Impersonate any person or entity or misrepresent your identity
                </li>
              </ul>

              <h2 className="text-2xl font-semibold mt-10 mb-4 text-white">
                6. Intellectual Property
              </h2>
              <p className="mb-4">
                The Service and its original content, including but not limited
                to logos, visual design, text, trademarks, images, and software,
                are and will remain the exclusive property of DriveUp.
              </p>
              <p className="mb-4">
                You may not use our branding, logos, or other proprietary
                content without prior written permission.
              </p>
              <h2 className="text-2xl font-semibold mt-10 mb-4 text-white">
                7. Termination
              </h2>
              <p className="mb-4">
                We reserve the right to suspend or terminate your access to the
                Service at any time, without prior notice or liability, for any
                reason including, but not limited to, your breach of these
                Terms.
              </p>
              <p className="mb-4">
                Upon termination, your right to use the Service will immediately
                cease. If you wish to terminate your account, you may do so by
                contacting us.
              </p>

              <h2 className="text-2xl font-semibold mt-10 mb-4 text-white">
                8. Limitation of Liability
              </h2>
              <p className="mb-4">
                In no event shall DriveUp, its directors, employees, or
                affiliates be liable for any indirect, incidental, special,
                consequential or punitive damages arising out of or related to
                your use of the Service.
              </p>
              <p className="mb-4">
                Our total liability for any claims under these Terms is limited
                to the amount you paid us, if any, for accessing the Service
                during the prior six (6) months.
              </p>

              <h2 className="text-2xl font-semibold mt-10 mb-4 text-white">
                9. Governing Law
              </h2>
              <p className="mb-4">
                These Terms shall be governed and construed in accordance with
                the laws of India, without regard to its conflict of law
                provisions.
              </p>
              <p className="mb-4">
                Any disputes arising under or in connection with this agreement
                shall be subject to the exclusive jurisdiction of the courts in
                Mumbai, Maharashtra.
              </p>

              <h2 className="text-2xl font-semibold mt-10 mb-4 text-white">
                10. Changes to These Terms
              </h2>
              <p className="mb-4">
                We reserve the right to update or modify these Terms at any
                time. If a revision is material, we will provide at least 7
                days’ notice prior to any new terms taking effect. The updated
                Terms will be posted on this page.
              </p>
              <p className="mb-6">
                You are advised to review these Terms periodically. Your
                continued use of the Service after any changes constitutes
                acceptance of the updated Terms.
              </p>

              <h2 className="text-2xl font-semibold mt-10 mb-4 text-white">
                11. Contact Us
              </h2>
              <p className="mb-2">
                If you have any questions about these Terms and Conditions, you
                can contact us:
              </p>
              <ul className="list-disc list-inside space-y-2 mb-10">
                <li>
                  By visiting:{" "}
                  <a
                    href="https://driveup.in/help"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-600 underline"
                  >
                    https://driveup.in/help
                  </a>
                </li>
              </ul>
            </div>
            <footer className="text-center text-gray-400 z-20 w-full relative py-4 h-2">
              {/* ✅ Desktop Footer */}
              <p className="text-sm hidden lg:block mt-2">
                &copy; {currentYear} DriveUp. All rights reserved.
              </p>

              {/* ✅ Mobile Footer */}
              <p className="text-sm lg:hidden">
                &copy; {currentYear} DriveUp. All rights reserved.
              </p>
            </footer>
          </main>
        </motion.div>
      </div>
    </>
  );
};

export default App;

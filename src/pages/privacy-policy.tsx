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
        <title>Privacy Policy – DriveUp</title>
        <meta
          name="description"
          content="Learn how DriveUp collects, uses, and protects your personal data in compliance with privacy regulations."
        />
        <meta property="og:title" content="Privacy Policy – DriveUp" />
        <meta
          property="og:description"
          content="Understand how we handle your data and privacy."
        />
        <meta property="og:url" content="https://www.driveup.in/privacy-policy" />
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
                Privacy Policy
              </h1>
              <p className="mb-4">
                This Privacy Policy describes Our policies and procedures on the
                collection, use and disclosure of Your information when You use
                the Service and tells You about Your privacy rights and how the
                law protects You.
              </p>
              <p className="mb-4">
                We use Your Personal data to provide and improve the Service. By
                using the Service, You agree to the collection and use of
                information in accordance with this Privacy Policy.
              </p>

              <h2 className="text-2xl font-semibold mt-10 mb-4 text-white">
                Interpretation and Definitions
              </h2>
              <h3 className="text-xl font-medium mt-6 mb-2">Interpretation</h3>
              <p className="mb-4">
                The words of which the initial letter is capitalized have
                meanings defined under the following conditions. The following
                definitions shall have the same meaning regardless of whether
                they appear in singular or in plural.
              </p>

              <h3 className="text-xl font-medium mt-6 mb-2">Definitions</h3>
              <p className="mb-2">For the purposes of this Privacy Policy:</p>
              <ul className="list-disc list-inside space-y-2 mb-6">
                <li>
                  <strong>Account</strong> means a unique account created for
                  You to access our Service or parts of our Service.
                </li>
                <li>
                  <strong>Affiliate</strong> means an entity that controls, is
                  controlled by or is under common control with a party.
                </li>
                <li>
                  <strong>Company</strong> (referred to as either &quot;the
                  Company&quot;, &quot;We&quot;, &quot;Us&quot; or
                  &quot;Our&quot; in this Agreement) refers to DriveUp.
                </li>
                <li>
                  <strong>Cookies</strong> are small files placed on Your device
                  by a website, containing the details of Your browsing history
                  among its many uses.
                </li>
                <li>
                  <strong>Country</strong> refers to: Maharashtra, India
                </li>
                <li>
                  <strong>Device</strong> means any device that can access the
                  Service.
                </li>
                <li>
                  <strong>Personal Data</strong> is any information that relates
                  to an identified or identifiable individual.
                </li>
                <li>
                  <strong>Service</strong> refers to the Website.
                </li>
                <li>
                  <strong>Service Provider</strong> means any natural or legal
                  person who processes the data on behalf of the Company.
                </li>
                <li>
                  <strong>Usage Data</strong> refers to data collected
                  automatically, either generated by the use of the Service or
                  from the Service infrastructure itself.
                </li>
                <li>
                  <strong>Website</strong> refers to DriveUp, accessible from{" "}
                  <a
                    href="https://driveup.in"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-[#0A9396] underline"
                  >
                    driveup.in
                  </a>
                </li>
                <li>
                  <strong>You</strong> means the individual using the Service,
                  or the company or legal entity on behalf of which such
                  individual is using the Service.
                </li>
              </ul>
              <h2 className="text-2xl font-semibold mt-10 mb-4 text-white">
                Collecting and Using Your Personal Data
              </h2>

              <h3 className="text-xl font-medium mt-6 mb-2">
                Types of Data Collected
              </h3>
              <h4 className="text-lg font-semibold mt-4 mb-2">Personal Data</h4>
              <p className="mb-4">
                While using Our Service, We may ask You to provide Us with
                certain personally identifiable information that can be used to
                contact or identify You. Personally identifiable information may
                include, but is not limited to:
              </p>
              <ul className="list-disc list-inside space-y-2 mb-6">
                <li>Email address</li>
                <li>First name and last name</li>
                <li>Phone number</li>
                <li>Usage Data</li>
              </ul>

              <h4 className="text-lg font-semibold mt-4 mb-2">Usage Data</h4>
              <p className="mb-4">
                Usage Data is collected automatically when using the Service. It
                may include information such as Your Device's IP address,
                browser type, browser version, pages visited, time and date of
                visit, time spent, device identifiers and other diagnostic data.
              </p>
              <p className="mb-4">
                When accessing via mobile, we may collect data like device type,
                unique ID, mobile IP, operating system, and other diagnostics.
                We may also collect browser data and mobile access logs.
              </p>

              <h4 className="text-lg font-semibold mt-4 mb-2">
                Tracking Technologies and Cookies
              </h4>
              <p className="mb-4">
                We use Cookies and similar technologies to track the activity on
                Our Service and store certain information. Tracking technologies
                include beacons, tags, and scripts to improve and analyze Our
                Service.
              </p>
              <ul className="list-disc list-inside space-y-2 mb-6">
                <li>
                  <strong>Browser Cookies:</strong> A cookie is a small file
                  placed on Your Device. You can instruct Your browser to refuse
                  all Cookies or to indicate when a Cookie is being sent.
                  However, if You do not accept Cookies, You may not be able to
                  use some parts of our Service. Unless you have adjusted Your
                  browser setting so that it will refuse Cookies, our Service
                  may use Cookies.
                </li>
                <li>
                  <strong>Web Beacons:</strong> Certain sections of our Service
                  and our emails may contain small electronic files known as web
                  beacons (also referred to as clear gifs, pixel tags, and
                  single-pixel gifs) that permit the Company, for example, to
                  count users who have visited those pages or opened an email
                  and for other related website statistics (for example,
                  recording the popularity of a certain section and verifying
                  system and server integrity).
                </li>
              </ul>
              <p className="mb-4">
                Cookies can be "Persistent" or "Session" based. Persistent
                cookies remain after you close your browser. Session cookies are
                deleted when you close it.
              </p>

              <p className="mb-2 font-semibold">
                We use both for the purposes below:
              </p>
              <ul className="list-disc list-inside space-y-4 mb-6">
                <li>
                  <strong>Essential Cookies:</strong> Allow functionality like
                  login, preventing fraud, and ensuring security. Required for
                  services to work.
                </li>
                <li>
                  <strong>Consent Cookies:</strong> Used to track whether you
                  accepted cookies.
                </li>
                <li>
                  <strong>Functionality Cookies:</strong> Store preferences like
                  language, region, or session data.
                </li>
              </ul>

              <h3 className="text-xl font-medium mt-10 mb-4">
                Use of Your Personal Data
              </h3>
              <p className="mb-4">
                The Company may use Personal Data for the following purposes:
              </p>

              <ul className="list-disc list-inside space-y-4 mb-6">
                <li>
                  <strong>To provide and maintain our Service:</strong>{" "}
                  including monitoring its usage.
                </li>
                <li>
                  <strong>To manage Your Account:</strong> to enable Your
                  registration and access to Service features.
                </li>
                <li>
                  <strong>For contract performance:</strong> including
                  product/service purchases or any other agreements via the
                  Service.
                </li>
                <li>
                  <strong>To contact You:</strong> via email, phone, SMS, or app
                  notifications for updates, services, or technical issues.
                </li>
                <li>
                  <strong>To provide You</strong> with offers, news, or similar
                  services unless you’ve opted out.
                </li>
                <li>
                  <strong>To manage Your requests:</strong> responding to and
                  resolving inquiries made by You.
                </li>
                <li>
                  <strong>For business transfers:</strong> such as mergers,
                  restructuring, or asset sales.
                </li>
                <li>
                  <strong>For other purposes:</strong> analytics, performance
                  tracking, marketing effectiveness, and service improvement.
                </li>
              </ul>

              <p className="mb-4">
                We may share Your personal information in the following cases:
              </p>

              <ul className="list-disc list-inside space-y-4 mb-6">
                <li>
                  <strong>With Service Providers:</strong> for usage monitoring,
                  analysis, or communication.
                </li>
                <li>
                  <strong>For business transfers:</strong> during discussions or
                  actions relating to mergers, acquisitions, or asset sales.
                </li>
                <li>
                  <strong>With Affiliates:</strong> including parent and
                  subsidiary companies, joint ventures, or other entities under
                  shared control.
                </li>
                <li>
                  <strong>With business partners:</strong> to offer you
                  products, services, or promotions.
                </li>
                <li>
                  <strong>With other users:</strong> if you interact in public
                  areas of the Service (e.g., comments or discussions).
                </li>
                <li>
                  <strong>With Your consent:</strong> in any other case
                  explicitly agreed to by You.
                </li>
              </ul>
              <h3 className="text-xl font-medium mt-10 mb-4">
                Retention of Your Personal Data
              </h3>
              <p className="mb-4">
                The Company will retain Your Personal Data only for as long as
                is necessary for the purposes set out in this Privacy Policy. We
                may retain and use Your Personal Data to the extent necessary to
                comply with legal obligations, resolve disputes, and enforce our
                agreements and policies.
              </p>
              <p className="mb-6">
                Usage Data may be retained for a shorter period unless used to
                improve Service functionality or security, or if required
                legally.
              </p>

              <h3 className="text-xl font-medium mt-10 mb-4">
                Transfer of Your Personal Data
              </h3>
              <p className="mb-4">
                Your information may be transferred to — and maintained on —
                systems located outside Your jurisdiction, where data protection
                laws may differ.
              </p>
              <p className="mb-4">
                Your submission of such information represents Your agreement to
                that transfer. The Company will take all steps to ensure Your
                data is handled securely and in accordance with this Privacy
                Policy.
              </p>

              <h3 className="text-xl font-medium mt-10 mb-4">
                Delete Your Personal Data
              </h3>
              <p className="mb-4">
                You have the right to request deletion of Your Personal Data.
                You can delete certain data from within the Service, or contact
                Us to access, amend, or delete personal information provided by
                You.
              </p>
              <p className="mb-6">
                We may retain some data where we are legally obligated to do so
                or if it’s necessary for legitimate business reasons.
              </p>
              <h3 className="text-xl font-medium mt-10 mb-4">
                Disclosure of Your Personal Data
              </h3>

              <h4 className="text-lg font-semibold mt-4 mb-2">
                Business Transactions
              </h4>
              <p className="mb-4">
                If the Company is involved in a merger, acquisition, or asset
                sale, Your Personal Data may be transferred. You will be
                notified before such transfer becomes subject to a different
                Privacy Policy.
              </p>

              <h4 className="text-lg font-semibold mt-4 mb-2">
                Law Enforcement
              </h4>
              <p className="mb-4">
                The Company may disclose Your Personal Data if required to do so
                by law or in response to valid requests by public authorities
                (e.g. court or government agency).
              </p>

              <h4 className="text-lg font-semibold mt-4 mb-2">
                Other Legal Requirements
              </h4>
              <p className="mb-4">
                The Company may disclose Your Personal Data in the good faith
                belief that such action is necessary to:
              </p>
              <ul className="list-disc list-inside space-y-2 mb-6">
                <li>Comply with a legal obligation</li>
                <li>
                  Protect and defend the rights or property of the Company
                </li>
                <li>
                  Prevent or investigate possible wrongdoing in connection with
                  the Service
                </li>
                <li>Protect the personal safety of Users or the public</li>
                <li>Protect against legal liability</li>
              </ul>

              <h3 className="text-xl font-medium mt-10 mb-4">
                Security of Your Personal Data
              </h3>
              <p className="mb-6">
                We take data security seriously, but no transmission or storage
                system is 100% secure. While we use commercially acceptable
                means to protect Your Personal Data, we cannot guarantee its
                absolute security.
              </p>

              <h2 className="text-2xl font-semibold mt-10 mb-4 text-white">
                Children's Privacy
              </h2>
              <p className="mb-4">
                Our Service does not address anyone under the age of 13. We do
                not knowingly collect personally identifiable information from
                anyone under 13. If You are a parent or guardian and believe
                Your child has provided Us with Personal Data, please contact
                Us.
              </p>
              <p className="mb-6">
                If we become aware of data collected from a minor without
                parental consent, we will delete that information. Where local
                law requires parental consent for data processing, we may
                require verification before continuing.
              </p>
              <h2 className="text-2xl font-semibold mt-10 mb-4 text-white">
                Links to Other Websites
              </h2>
              <p className="mb-4">
                Our Service may contain links to other websites that are not
                operated by Us. If You click on a third-party link, You will be
                directed to that third party's site. We strongly advise You to
                review the Privacy Policy of every site You visit.
              </p>
              <p className="mb-6">
                We have no control over and assume no responsibility for the
                content, privacy policies or practices of any third-party sites
                or services.
              </p>

              <h2 className="text-2xl font-semibold mt-10 mb-4 text-white">
                Changes to this Privacy Policy
              </h2>
              <p className="mb-4">
                We may update Our Privacy Policy from time to time. We will
                notify You of any changes by posting the new Privacy Policy on
                this page.
              </p>
              <p className="mb-4">
                We will let You know via email and/or a prominent notice on Our
                Service prior to the change becoming effective, and we will
                update the "Last updated" date at the top of this Privacy
                Policy.
              </p>
              <p className="mb-6">
                You are advised to review this Privacy Policy periodically for
                any changes. Changes to this Privacy Policy are effective when
                they are posted on this page.
              </p>

              <h2 className="text-2xl font-semibold mt-10 mb-4 text-white">
                Contact Us
              </h2>
              <p className="mb-2">
                If you have any questions about this Privacy Policy, You can
                contact us:
              </p>
              <ul className="list-disc list-inside space-y-2 mb-6">
                <li>
                  By visiting this page on our website:{" "}
                  <a
                    href="https://driveup.in/help"
                    className="text-[#0A9396] underline"
                    target="_blank"
                    rel="noopener noreferrer"
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

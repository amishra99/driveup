import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import dynamic from "next/dynamic";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import carLoadingAnimation from "@/components/loadingCarAnimation.json";

// ✅ This ensures Lottie is only rendered on the client
const Lottie = dynamic(() => import("react-lottie-player"), {
  ssr: false,
});

// 🔹 Import Lottie animation JSON (Replace with your animation)

const LoadingPage = () => {
  const router = useRouter();
  const [showSecondHeader, setShowSecondHeader] = useState(false);
  const [showSecondText, setShowSecondText] = useState(false);
  const [showSkipButton, setShowSkipButton] = useState(false);

  useEffect(() => {
    // Show "Welcome to DriveUp" after 3 seconds
    const headerTimeout = setTimeout(() => {
      setShowSecondHeader(true);
    }, 3000);

    // Show "Almost there!" after 7 seconds
    const textTimeout = setTimeout(() => {
      setShowSecondText(true);
    }, 6000);

    // Show "Skip" button after 3 seconds (prevents instant skipping)
    const skipTimeout = setTimeout(() => {
      setShowSkipButton(true);
    }, 3000);

    // Redirect to /explore after 10 seconds
    const redirectTimeout = setTimeout(() => {
      router.push("/explore");
    }, 9500);

    return () => {
      clearTimeout(headerTimeout);
      clearTimeout(textTimeout);
      clearTimeout(skipTimeout);
      clearTimeout(redirectTimeout);
    };
  }, [router]);

  // 🔹 Skip button handler
  const handleSkip = () => {
    console.log("🚀 User skipped loading screen!");
    router.push("/explore");
  };

  return (
    <div className="h-screen flex flex-col justify-center items-center bg-black text-white text-center relative">
      {/* 🔹 DriveUp Logo */}
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 1 }}
      >
        <Image
          src="/driveup_logo_white.png"
          alt="DriveUp Logo"
          width={150}
          height={150}
        />
      </motion.div>

      {/* 🔹 Animated Header Text Change (Appears Early at 3s) */}
      <div className="mt-2 h-[60px] flex items-center justify-center">
        <AnimatePresence mode="wait">
          <motion.h1
            key={showSecondHeader ? "second-header" : "first-header"}
            className="text-4xl tracking-wide sm:text-4xl font-bold text-[#E9D8A6]"
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
            transition={{ duration: 1 }}
          >
            {showSecondHeader ? "Welcome to DriveUp" : "Hey There!"}
          </motion.h1>
        </AnimatePresence>
      </div>

      {/* 🔹 Animated Subtext Change (Appears Late at 7s) */}
      <div className="ml-4 mr-4 h-[50px] flex items-center justify-center">
        <AnimatePresence mode="wait">
          <motion.p
            key={showSecondText ? "second-text" : "first-text"}
            className="text-lg text-gray-400"
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
            transition={{ duration: 1 }}
          >
            {showSecondText
              ? "Almost there!"
              : "A smarter drive awaits. Just a moment..."}
          </motion.p>
        </AnimatePresence>
      </div>

      {/* 🔹 Lottie Animation */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1.5, duration: 1 }}
        className="mt-6"
      >
        <Lottie
          loop
          animationData={carLoadingAnimation}
          play
          className="w-40 h-40"
        />
      </motion.div>

      {/* 🔹 Skip Button (Appears after 2s) */}
      {showSkipButton && (
        <motion.button
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.2 }} // 🔹 Balanced visibility
          whileHover={{ opacity: 0.8, textDecoration: "underline" }} // 🔹 Subtle highlight on hover
          transition={{ duration: 1 }}
          onClick={handleSkip}
          className="absolute bottom-12 text-sm text-gray-300 font-light tracking-wide hover:text-white transition duration-300"
        >
          You can skip... but why rush?
        </motion.button>
      )}
    </div>
  );
};

export default LoadingPage;

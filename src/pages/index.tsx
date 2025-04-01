import Image from "next/image";
import Hyperspeed from "@/components/Hyperspeed/Hyperspeed";
import BlurText from "@/components/BlurText/BlurText";
import InfiniteScroll from "@/components/InfiniteScroll";
import ShinyText from "@/components/ShinyText/ShinyText";
import { LoginForm } from "@/components/login-form";
import { motion } from "framer-motion";
import { useModal } from "@/components/ui/animated-modal";

export default function Home() {
  const { setOpen } = useModal(); // ✅ Access modal state
  const currentYear = new Date().getFullYear(); // ✅ Dynamic Year

  const handleAnimationComplete = () => {
    console.log("Animation completed!");
  };

  return (
    <>
      {/* 🚀 Hyperspeed Background (Covers Text + Button on Mobile, Full on Desktop) */}
      <div className="absolute inset-0 w-full h-full -z-10">
        <Hyperspeed
          effectOptions={{
            onSpeedUp: () => {},
            onSlowDown: () => {},
            distortion: "LongRaceDistortion",
            length: 400,
            roadWidth: 10,
            islandWidth: 5,
            lanesPerRoad: 2,
            fov: 70,
            fovSpeedUp: 120,
            speedUp: 2,
            carLightsFade: 0.4,
            totalSideLightSticks: 50,
            lightPairsPerRoadWay: 70,
            shoulderLinesWidthPercentage: 0.05,
            brokenLinesWidthPercentage: 0.1,
            brokenLinesLengthPercentage: 0.5,
            lightStickWidth: [0.12, 0.5],
            lightStickHeight: [1.3, 1.7],
            movingAwaySpeed: [60, 80],
            movingCloserSpeed: [-120, -160],
            carLightsLength: [400 * 0.05, 400 * 0.15],
            carLightsRadius: [0.05, 0.14],
            carWidthPercentage: [0.3, 0.5],
            carShiftX: [-0.2, 0.2],
            carFloorSeparation: [0.05, 1],
            colors: {
              roadColor: 0x080808,
              islandColor: 0x0a0a0a,
              background: 0x000000,
              shoulderLines: 0x131318,
              brokenLines: 0x131318,
              leftCars: [0xee9b00, 0xca6702, 0xbb3e03],
              rightCars: [0xa4e3e6, 0x80d1d4, 0x53c2c6],
              sticks: 0xa4e3e6,
            },
          }}
        />
      </div>

      {/* 🚀 DriveUp Logo (Properly Positioned for Mobile & Desktop) */}
      <motion.div
        initial={{ opacity: 0, y: -30 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: 20 }}
        transition={{ duration: 1, ease: "easeOut", delay: 0.5 }}
      >
        <div className="fixed w-screen top-2 left-1/2 -translate-x-1/2 flex justify-center z-50 bg-[#0a0a0a]">
          <Image
            src="/driveup_logo_white.png"
            alt="DriveUp logo"
            width={150}
            height={50}
            priority
          />
        </div>
      </motion.div>

      {/* 🚀 Layout: Desktop (50/50), Mobile (Stacked with Login Below) */}
      <div className="relative z-10 flex flex-col lg:flex-row justify-between items-center h-auto lg:h-screen p-8 sm:p-6 gap-10 lg:gap-0">
        {/* ✅ Left Section (DriveUp Header, Subheader, Button, Infinite Scroll) */}
        <main className="w-full lg:w-1/2 max-w-4xl text-center lg:text-left">
          <div className="w-full flex justify-center lg:justify-start lg:pl-12 mt-36 sm:mt-16">
            <h1 className="font-lufga text-5xl sm:text-6xl lg:text-7xl font-bold text-white">
              <BlurText
                text="Drive Smarter. DriveUp!"
                delay={100}
                animateBy="words"
                direction="top"
                onAnimationComplete={handleAnimationComplete}
                className="text-5xl sm:text-5xl mb-8 text-[#E9D8A6] tracking-wide"
              />
            </h1>
          </div>

          <div className="w-full flex justify-center lg:justify-start lg:pl-12">
            <h2 className="font-lufga text-lg sm:text-2xl text-gray-300 max-w-2xl leading-relaxed">
              <BlurText
                text="Find, and explore cars like never before – your ultimate one-stop destination for all things automotive with DriveUp!"
                delay={60}
                animateBy="words"
                direction="top"
                onAnimationComplete={handleAnimationComplete}
                className="text-lg sm:text-xl mb-8"
              />
            </h2>
          </div>

          {/* ✅ Call to Action Button */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.6, ease: "easeOut", delay: 0.3 }}
          >
            <button
              onClick={() => setOpen(true)}
              className="shiny-button max-w-full inline-flex flex-nowrap mt-2 lg:ml-12"
            >
              <ShinyText
                text="Know more"
                disabled={false}
                speed={3}
                className=" animate-shine"
              />
            </button>
          </motion.div>

          {/* ✅ Infinite Scroll (Exactly as Before) */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.6, ease: "easeOut", delay: 0.3 }}
            whileHover={{
              scale: 1.02,
              boxShadow: "0px 4px 20px rgba(255, 255, 255, 0.2)",
            }}
            whileTap={{ scale: 0.98 }}
            className="w-full sm:w-3/4 inline-flex flex-nowrap mt-10 mx-auto lg:ml-12 lg:mr-20 [mask-image:_linear-gradient(to_right,transparent_0,_black_128px,_black_calc(100%-200px),transparent_100%)]"
          >
            <InfiniteScroll />
          </motion.div>
        </main>

        {/* ✅ Right Section: Desktop Stays the Same, Mobile Moves Below */}
        <div className="w-full lg:w-1/2 flex justify-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.6, ease: "easeOut", delay: 0.7 }}
            whileHover={{
              scale: 1.02,
              boxShadow: "0px 4px 20px rgba(255, 255, 255, 0.2)",
            }}
            whileTap={{ scale: 0.98 }}
            className="flex flex-col items-center justify-center bg-white/2 p-8 md:p-12 rounded-lg backdrop-blur-lg w-full max-w-sm sm:max-w-md mt-12 lg:mt-0"
          >
            <div className="w-full">
              <LoginForm />
            </div>
          </motion.div>
        </div>
      </div>
      {/* ✅ Footer (Blends into Hyperspeed) */}
      <footer className="text-center text-white z-20">
        {/* ✅ Desktop: Footer on top of Hyperspeed */}
        <p className="text-sm hidden lg:block absolute bottom-2 w-full">
          &copy; {currentYear} DriveUp. All rights reserved.
        </p>

        {/* ✅ Mobile: Footer below login page */}
        <p className="text-sm lg:hidden mt-8 pb-4">
          &copy; {currentYear} DriveUp. All rights reserved.
        </p>
      </footer>
    </>
  );
}

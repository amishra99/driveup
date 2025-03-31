"use client";
import React from "react";
import {
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalTrigger,
} from "@/components/ui/animated-modal";
import Image from "next/image";
import { motion } from "framer-motion";
import { useModal } from "@/components/ui/animated-modal"; // ✅ Import modal context hook

export function AnimatedModalDemo() {
  const { open, setOpen } = useModal(); // ✅ Use context instead of passing props

  return (
    <>
      {open && (
        <ModalBody>
          <ModalContent>
            {/* Header Section */}
            <h5 className="text-base md:text-3xl text-neutral-700 dark:text-neutral-100 font-extrabold text-center mb-6">
              Why Choose{" "}
              <span className="px-2 py-1 rounded-lg bg-gray-100 dark:bg-neutral-800 dark:border-neutral-700 border border-gray-300">
                DriveUp
              </span>
              ?
            </h5>

            {/* Intro Section */}
            <p className="text-center text-neutral-600 dark:text-neutral-300 text-sm md:text-base leading-relaxed mb-6 px-4">
              Your ultimate car companion that simplifies car ownership, helping
              you make smarter choices effortlessly. Whether you're buying,
              maintaining, or exploring cars, we’ve got you covered.
            </p>

            {/* Features Section */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-w-lg mx-auto">
              {/* Feature Items */}
              <div className="flex items-center gap-2">
                🚘{" "}
                <span className="text-neutral-700 dark:text-neutral-300 text-xs">
                  <strong>Car Features Dashboard: </strong>Explore & compare car
                  specs effortlessly.
                </span>
              </div>

              <div className="flex items-center gap-2">
                🤖{" "}
                <span className="text-neutral-700 dark:text-neutral-300 text-xs">
                  <strong>AI-Powered Car Recommendations: </strong> Get
                  personalized suggestions based on your needs.
                </span>
              </div>

              <div className="flex items-center gap-2">
                🎙️{" "}
                <span className="text-neutral-700 dark:text-neutral-300 text-xs">
                  <strong>Expert Consultation: </strong> Chat or video-call with
                  experts.
                </span>
              </div>

              <div className="flex items-center gap-2">
                🔥{" "}
                <span className="text-neutral-700 dark:text-neutral-300 text-xs">
                  <strong>AI Chat for Car Queries: </strong> Ask anything about
                  cars & get instant answers.
                </span>
              </div>

              <div className="flex items-center gap-2">
                ⛽{" "}
                <span className="text-neutral-700 dark:text-neutral-300 text-xs">
                  <strong>Real-time Fuel Price Tracker: </strong> Stay updated
                  on fuel costs in your city.
                </span>
              </div>

              <div className="flex items-center gap-2">
                🚀{" "}
                <span className="text-neutral-700 dark:text-neutral-300 text-xs">
                  <strong>Coming Soon: </strong> EV charger maps, insurance
                  comparisons, servicing & more!
                </span>
              </div>
            </div>

            {/* Why Log In? Section */}
            <div className="mt-8 p-4 rounded-lg border border-gray-200 dark:border-neutral-700 bg-gray-50 dark:bg-neutral-800 text-center">
              <h5 className="text-md md:text-lg font-bold text-neutral-700 dark:text-neutral-100">
                Unlock More with DriveUp
              </h5>
              <p className="text-sm text-neutral-600 dark:text-neutral-300 mt-2">
                Login to save your preferences, track fuel prices for your city,
                get AI-powered recommendations, and access exclusive car
                insights tailored just for you!
              </p>
            </div>
          </ModalContent>
        </ModalBody>
      )}
    </>
  );
}

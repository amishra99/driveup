"use client";
import {
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalTrigger,
} from "@/components/ui/animated-modal";
import Image from "next/image";
import { motion } from "framer-motion";
import { useModal } from "@/components/ui/animated-modal"; // ✅ Import modal context hook
import React, { useState, useEffect, useRef } from "react";
import { Car, Brain, Mic, Flame, Fuel, Rocket } from "lucide-react"; // import required icons

export function AnimatedModalDemo() {
  const { open, setOpen } = useModal(); // ✅ Use context instead of passing props

  return (
    <>
      {open && (
        <ModalBody>
          <ModalContent>
            {/* Header Section */}
            <h5 className="text-2xl md:text-3xl text-[#001219] font-extrabold text-center mb-6">
              Why Choose DriveUp?
            </h5>

            {/* Intro Section */}
            <p className="text-center text-neutral-600 dark:text-neutral-300 text-xs lg:text-sm leading-relaxed mb-6 px-2 lg:px-4">
              Your ultimate car companion that simplifies car ownership, helping
              you make smarter choices effortlessly. Whether you're buying,
              maintaining, or exploring cars, we’ve got you covered.
            </p>

            {/* Features Section */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-w-lg mx-auto">
              <div className="flex items-start gap-3">
                <Car className="w-8 h-8 text-[#EE9B00]" />
                <span className="text-neutral-700 dark:text-neutral-300 text-xs leading-snug">
                  <strong>Car Features Dashboard: </strong>Explore & compare car
                  specs effortlessly.
                </span>
              </div>

              <div className="flex items-start gap-3">
                <Brain className="w-8 h-8 text-[#0A9396]" />
                <span className="text-neutral-700 dark:text-neutral-300 text-xs leading-snug">
                  <strong>AI-Powered Car Recommendations: </strong> Get
                  personalized suggestions based on your needs.
                </span>
              </div>

              <div className="flex items-start gap-3">
                <Mic className="w-6 h-6 text-[#BB3E03]" />
                <span className="text-neutral-700 dark:text-neutral-300 text-xs leading-snug">
                  <strong>Expert Consultation: </strong> Chat or video-call with
                  experts.
                </span>
              </div>

              <div className="flex items-start gap-3">
                <Flame className="w-8 h-8 text-[#E63946]" />
                <span className="text-neutral-700 dark:text-neutral-300 text-xs leading-snug">
                  <strong>AI Chat for Car Queries: </strong> Ask anything about
                  cars & get instant answers.
                </span>
              </div>

              <div className="flex items-start gap-3">
                <Fuel className="w-8 h-8 text-[#457B9D]" />
                <span className="text-neutral-700 dark:text-neutral-300 text-xs leading-snug">
                  <strong>Real-time Fuel Price Tracker: </strong> Stay updated
                  on fuel costs in your city.
                </span>
              </div>

              <div className="flex items-start gap-3">
                <Rocket className="w-8 h-8 text-[#9D4EDD]" />
                <span className="text-neutral-700 dark:text-neutral-300 text-xs leading-snug">
                  <strong>Coming Soon: </strong> EV charger maps, insurance
                  comparisons, servicing & more!
                </span>
              </div>
            </div>

            {/* Why Log In? Section */}
            <div className="mt-6 p-4 rounded-lg border border-gray-200 dark:border-neutral-700 bg-gray-50 dark:bg-neutral-800 text-center">
              <h5 className="text-md md:text-lg font-bold text-neutral-700 dark:text-neutral-100">
                Unlock More with DriveUp
              </h5>
              <p className="text-xs lg:text-sm text-neutral-600 dark:text-neutral-300 mt-2">
                Login to save your preferences, track fuel prices for your city,
                get AI-powered recommendations, and access exclusive car
                insights tailored just for you!
              </p>
              <button
                onClick={() => {
                  setOpen(false); // Close the modal
                  const loginEl = document.getElementById("login-form");
                  if (loginEl) {
                    setTimeout(() => {
                      loginEl.scrollIntoView({ behavior: "smooth" });
                    }, 200); // Slight delay after closing
                  }
                }}
                className="px-6 py-2 text-xs lg:text-sm bg-[#AE2012] text-white rounded hover:bg-[#9B2226] transition-all mt-6 mb-2"
              >
                Fire Up DriveUp
              </button>
            </div>
          </ModalContent>
        </ModalBody>
      )}
    </>
  );
}

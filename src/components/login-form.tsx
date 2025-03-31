import { useState, useEffect } from "react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useModal } from "@/components/ui/animated-modal";
import { useRouter } from "next/router";
import {
  auth,
  setupRecaptchaVerifier,
  RecaptchaVerifier,
  signInWithPhoneNumber,
  PhoneAuthProvider,
  signInWithCredential,
  db,
  doc,
  getDoc,
  setDoc,
} from "@/utils/firebaseConfig";

export function LoginForm({
  className,
  ...props
}: React.ComponentPropsWithoutRef<"div">) {
  const { setOpen } = useModal();
  const router = useRouter();
  const [phone, setPhone] = useState("");
  const [otp, setOtp] = useState("");
  const [otpSent, setOtpSent] = useState(false);
  const [showUserInfoModal, setShowUserInfoModal] = useState(false);
  const [name, setName] = useState("");
  const [city, setCity] = useState("");
  const [countdown, setCountdown] = useState<number | null>(null);
  const [verificationId, setVerificationId] = useState(null);
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  // Reset OTP state on page refresh
  useEffect(() => {
    setOtpSent(false);
    setCountdown(null);
  }, []);

  useEffect(() => {
    if (!(window as any).recaptchaVerifier) {
      (window as any).recaptchaVerifier = new RecaptchaVerifier(
        auth,
        "recaptcha-container",
        {
          size: "invisible",
        }
      );
    }
  }, []);

  // Start countdown when OTP is sent
  useEffect(() => {
    if (otpSent && countdown !== null && countdown > 0) {
      const timer = setInterval(() => {
        setCountdown((prev) => (prev !== null ? prev - 1 : 0));
      }, 1000);

      return () => clearInterval(timer);
    }
  }, [otpSent, countdown]);

  // Reset `otpSent` when countdown reaches 0
  useEffect(() => {
    if (countdown === 0) {
      setOtpSent(false);
      setCountdown(null);
    }
  }, [countdown]);

  // ✅ Send OTP
  const handleSendOtp = async () => {
    if (phone.length < 10) return alert("Enter a valid phone number");

    setLoading(true);
    setMessage("Initializing reCAPTCHA...");

    try {
      // ✅ Always reset and initialize reCAPTCHA before sending OTP
      setupRecaptchaVerifier();

      setMessage("Sending OTP...");

      // ✅ Get reCAPTCHA Verifier
      const appVerifier = window.recaptchaVerifier;

      // ✅ Send OTP
      const confirmation = await signInWithPhoneNumber(
        auth,
        `+91${phone}`,
        appVerifier
      );

      // ✅ Store verification ID
      setVerificationId(confirmation.verificationId);
      setOtpSent(true);
      setCountdown(30);
      setMessage("✅ OTP Sent! Please enter the OTP.");
    } catch (error) {
      console.error("❌ Error sending OTP:", error);
      setMessage(`Error: ${error.message}`);
    }

    setLoading(false);
  };

  // ✅ Verify OTP & Check for First-Time User
  const [debugMessage, setDebugMessage] = useState("");

  const [userStatus, setUserStatus] = useState("checking"); // ✅ Controls what happens after login

  const handleVerifyOtp = async (e) => {
    e.preventDefault();
    if (!otp || !verificationId) {
      setDebugMessage("⚠ Enter OTP before verifying.");
      return;
    }

    setLoading(true);
    setMessage("Verifying OTP...");
    setDebugMessage("⏳ Verifying OTP...");

    try {
      const credential = PhoneAuthProvider.credential(verificationId, otp);
      const userCredential = await signInWithCredential(auth, credential);
      const user = userCredential.user;

      await auth.updateCurrentUser(user);
      console.log("✅ User authenticated:", user.uid);
      setDebugMessage(`✅ OTP Verified! User UID: ${user.uid}`);

      localStorage.removeItem("user");

      // ✅ Firestore User Check
      setDebugMessage("⏳ Checking if user exists in Firestore...");
      console.log("⏳ Checking Firestore...");

      const userDocRef = doc(db, "users", user.uid);
      const userDoc = await getDoc(userDocRef);

      if (!userDoc.exists()) {
        setDebugMessage(
          "🚀 First-time user detected! Opening user info form..."
        );
        console.log("🚀 First-time user detected! Opening user info form...");
        setShowUserInfoModal(true);
        setUserStatus("new"); // ✅ Set state to stop redirecting
      } else {
        console.log("✅ User exists in Firestore:", userDoc.data());
        setDebugMessage("✅ Existing user found in Firestore!");
        localStorage.setItem("user", JSON.stringify(userDoc.data()));
        setUserStatus("existing"); // ✅ Set state to redirect
      }
    } catch (error) {
      console.error("❌ OTP Verification Error:", error);
      setDebugMessage("❌ Invalid OTP. Try again.");
      setMessage("Invalid OTP. Try again.");

      await auth.signOut();
      localStorage.removeItem("user");
      setUserStatus("checking"); // Reset state to allow retry
    }

    setLoading(false);
  };

  const handleSaveUserInfo = async () => {
    if (!name || !city) {
      console.log("⚠ Please enter name and city.");
      return;
    }

    const user = auth.currentUser;
    if (!user) {
      console.log("❌ Error: No authenticated user found.");
      return;
    }

    try {
      console.log("⏳ Saving user info to Firestore...");

      await setDoc(doc(db, "users", user.uid), {
        name,
        city,
        phone: user.phoneNumber || "N/A",
      });

      localStorage.setItem(
        "user",
        JSON.stringify({ name, city, phone: user.phoneNumber || "N/A" })
      );

      console.log("✅ User info saved successfully!");
      setShowUserInfoModal(false);
      router.push("/loading");
    } catch (error) {
      console.error("❌ Firestore error:", error);
      alert("Failed to save user info. Please try again.");
    }
  };

  useEffect(() => {
    if (userStatus === "existing" && !showUserInfoModal) {
      console.log("🔥 Redirecting after profile save...");
      router.push("/loading");
    }
  }, [userStatus, showUserInfoModal]); // ✅ Redirects only when user is confirmed

  return (
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      <form onSubmit={handleVerifyOtp}>
        <div className="flex flex-col gap-6">
          {/* Logo & Heading */}
          <div className="flex flex-col items-center gap-3">
            <h1 className="text-2xl font-bold text-[#E9D8A6]">
              Let's Get You Logged In!
            </h1>
            <p className="text-center text-sm text-white/80">
              Unlock the full experience and explore cars tailored just for you!{" "}
              <button
                type="button"
                onClick={() => setOpen(true)}
                className="underline underline-offset-4 text-white/90 hover:text-white transition-all"
              >
                Discover why it’s worth it!
              </button>
            </p>
          </div>

          {/* Login Form Fields */}
          <div className="flex flex-col gap-6">
            {/* Phone Number Input with OTP Button */}
            <div className="grid gap-2">
              <Label htmlFor="phone" className="text-white/90">
                Phone Number
              </Label>
              <div className="flex items-center gap-2">
                <Input
                  id="phone"
                  type="tel"
                  placeholder="Enter your number"
                  required
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="bg-white/10 border border-white/20 placeholder-white/50 text-white focus:ring-white focus:border-white flex-1"
                />
                <Button
                  type="button"
                  onClick={handleSendOtp}
                  disabled={otpSent || phone.length < 10}
                  className={`px-4 py-2 rounded-lg transition-all duration-300 ${
                    otpSent
                      ? "bg-gray-500 text-white cursor-not-allowed"
                      : "bg-primary hover:bg-primary/80"
                  }`}
                >
                  {otpSent ? `Resend in ${countdown}s` : "Send OTP"}
                </Button>
              </div>
            </div>

            {/* OTP Input */}
            {otpSent && (
              <div className="grid gap-2">
                <Label htmlFor="otp" className="text-white/90">
                  OTP
                </Label>
                <Input
                  id="otp"
                  type="text"
                  maxLength={6}
                  placeholder="Enter 6-digit OTP"
                  required
                  value={otp}
                  onChange={(e) => setOtp(e.target.value)}
                  className="bg-white/10 border border-white/20 placeholder-white/50 text-white focus:ring-white focus:border-white text-center tracking-widest"
                />
              </div>
            )}

            {/* Login Button */}
            <Button
              type="submit"
              className="w-full bg-[#0A9396] text-white hover:bg-[#94D2BD] text-black transition-all duration-300"
              disabled={loading}
            >
              {loading ? "Verifying..." : "Let's Go"}
            </Button>
          </div>

          {/* Terms and Conditions */}
          <div className="text-center text-xs text-white/70">
            By clicking Let's Go, you agree to our{" "}
            <a
              href="https://driveup.in/terms-and-conditions"
              className="underline underline-offset-4 text-white/90 hover:text-white transition-all"
            >
              Terms of Service
            </a>{" "}
            and{" "}
            <a
              href="https://driveup.in/privacy-policy"
              className="underline underline-offset-4 text-white/90 hover:text-white transition-all"
            >
              Privacy Policy
            </a>
            .
          </div>
        </div>
      </form>
      {/* ✅ Ensure the modal is displayed properly */}
      {userStatus === "new" && showUserInfoModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-80 z-50">
          <div className="bg-[#2A2A2A] p-6 rounded-xl shadow-lg text-white w-96">
            <h2 className="text-base mb-4 text-center">
              <strong>Let's Make This Official! </strong>Just a Few More Details
              & You're All Set!
            </h2>

            <div className="grid gap-4">
              {/* Name */}
              <div className="grid gap-2">
                <label className="text-sm text-white/80">Full Name</label>
                <Input
                  type="text"
                  placeholder="Enter your full name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full bg-[#232323] border border-white/20 placeholder-gray-400 text-gray-400 focus:ring-white focus:border-white px-4 py-3 rounded-lg"
                />
              </div>

              {/* City Dropdown */}
              <div className="grid gap-2">
                <label className="text-sm text-white/80">City</label>
                <select
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                  className="w-full bg-[#232323] border border-white/20 placeholder-white/50 text-gray-400 focus:ring-white focus:border-white px-4 py-3 rounded-lg"
                >
                  <option value="" disabled>
                    Select your city
                  </option>
                  <option value="Ahmedabad">Ahmedabad</option>
                  <option value="Bengaluru">Bengaluru</option>
                  <option value="Chennai">Chennai</option>
                  <option value="Delhi">Delhi</option>
                  <option value="Hyderabad">Hyderabad</option>
                  <option value="Kolkata">Kolkata</option>
                  <option value="Mumbai">Mumbai</option>
                  <option value="New-Delhi">New Delhi</option>
                  <option value="Patna">Patna</option>
                  <option value="Pune">Pune</option>
                </select>
              </div>

              {/* Save Button */}
              <Button
                onClick={handleSaveUserInfo}
                className="w-full bg-[#0A9396] text-white hover:bg-[#94D2BD] text-black transition-all duration-300 py-3 rounded-lg"
              >
                Save & Continue
              </Button>
            </div>
          </div>
        </div>
      )}
      {/* ✅ TEMPORARY DEBUG BUTTON TO OPEN MODAL */}
      <div id="recaptcha-container"></div> {/* Required for Firebase OTP */}
      <p className="text-center text-white/80 text-sm">{message}</p>
    </div>
  );
}

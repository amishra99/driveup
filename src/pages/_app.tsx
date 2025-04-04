import "@/styles/globals.css";
import "@/styles/custom-swiper.css"; // Move global styles here
import "leaflet/dist/leaflet.css";
import type { AppProps } from "next/app";
import { ModalProvider } from "@/components/ui/animated-modal";
import { AnimatedModalDemo } from "@/components/DiscoverModal_Login";
import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { auth, db, doc, getDoc } from "@/utils/firebaseConfig";
import {
  setPersistence,
  browserLocalPersistence,
  onAuthStateChanged,
  User,
} from "firebase/auth";
import Head from "next/head";
import Script from "next/script";

export default function App({ Component, pageProps }: AppProps) {
  const router = useRouter();
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [userStatus, setUserStatus] = useState<string | null>("checking");

  // Enable persistent login
  useEffect(() => {
    setPersistence(auth, browserLocalPersistence)
      .then(() => console.log("✅ Firebase Auth Persistence Enabled!"))
      .catch((error) => console.error("❌ Error enabling persistence:", error));
  }, []);

  // Listen to auth state and redirect as needed
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user: User | null) => {
      if (user) {
        console.log("✅ User detected:", user.uid);
        localStorage.setItem("user", JSON.stringify(user));
        setUser(user);
        setUserStatus("checking");

        const userDocRef = doc(db, "users", user.uid);
        const userDoc = await getDoc(userDocRef);

        if (!userDoc.exists()) {
          console.log("🚀 New user detected!");
          setUserStatus("new");
        } else {
          console.log("✅ Existing user. Setting status...");
          setUserStatus("existing");
        }
      } else {
        console.log("❌ User signed out or unauthenticated.");
        localStorage.removeItem("user");
        sessionStorage.removeItem("alreadyRedirected"); // ✅ Clear session redirect flag
        setUser(null);
        setUserStatus(null);

        if (router.pathname !== "/") {
          router.replace("/"); // ✅ Send back to index on logout
        }
      }

      setLoading(false);
    });

    return () => unsubscribe();
  }, [router]);

  // Redirect existing users from `/` to `/loading` only once per session
  useEffect(() => {
    const alreadyRedirected = sessionStorage.getItem("alreadyRedirected");

    if (
      user &&
      userStatus === "existing" &&
      router.pathname === "/" &&
      !alreadyRedirected
    ) {
      sessionStorage.setItem("alreadyRedirected", "true");
      console.log("🔥 Redirecting to /loading...");
      router.push("/loading");
    }
  }, [user, userStatus, router.pathname]);

  if (loading) return <p className="text-center text-white">Loading...</p>;

  return (
    <>
      {/* ✅ Google Analytics - DriveUp */}
      <Script
        strategy="afterInteractive"
        src="https://www.googletagmanager.com/gtag/js?id=G-66FE7C5MBM"
      />
      <Script
        id="google-analytics"
        strategy="afterInteractive"
        dangerouslySetInnerHTML={{
          __html: `
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', 'G-66FE7C5MBM');
          `,
        }}
      />
      <Head>
        <title>
          DriveUp – Compare Cars, Get AI Recommendations & Drive Smarter
        </title>
        <meta
          name="description"
          content="DriveUp is your all-in-one platform for car owners and buyers. Explore, compare, and drive smarter."
        />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/driveup_fav.png" />

        {/* Open Graph Defaults */}
        <meta
          property="og:title"
          content="DriveUp – Compare Cars, Get AI Advice & Drive Smarter"
        />
        <meta
          property="og:description"
          content="Explore cars, get AI recommendations, track fuel prices, and more – all on DriveUp."
        />
        <meta property="og:image" content="/og-image.png" />
        <meta property="og:url" content="https://www.driveup.in" />
      </Head>
      <ModalProvider>
        <Component {...pageProps} />
        <AnimatedModalDemo />
      </ModalProvider>
    </>
  );
}

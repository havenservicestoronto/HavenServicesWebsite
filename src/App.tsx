import { useState, useEffect } from "react";
import Navbar from "./components/Navbar";
import Hero from "./components/Hero";
import Services from "./components/Services";
import AboutOwners from "./components/AboutOwners";
import WhyChooseUs from "./components/WhyChooseUs";
import Portfolio from "./components/Portfolio";
import BookingForm from "./components/BookingForm";
import Footer from "./components/Footer";
import AdminDashboard from "./components/AdminDashboard";

export default function App() {
  const [currentHash, setCurrentHash] = useState(window.location.hash);

  useEffect(() => {
    const handleHashChange = () => {
      setCurrentHash(window.location.hash);
      
      // Handle page anchor scrolling
      const hash = window.location.hash;
      if (hash && hash !== "#admin") {
        const targetId = hash.slice(1);
        const element = document.getElementById(targetId);
        if (element) {
          element.scrollIntoView({ behavior: "smooth" });
        }
      }
    };

    window.addEventListener("hashchange", handleHashChange);
    
    // Initial check on load in case the page loaded with a hash
    if (window.location.hash && window.location.hash !== "#admin") {
      setTimeout(() => {
        const targetId = window.location.hash.slice(1);
        const element = document.getElementById(targetId);
        if (element) {
          element.scrollIntoView({ behavior: "smooth" });
        }
      }, 300);
    }

    return () => window.removeEventListener("hashchange", handleHashChange);
  }, []);

  // Determine if viewing the hidden admin dashboard
  const showAdmin = currentHash === "#admin";

  if (showAdmin) {
    return (
      <div className="min-h-screen bg-slate-50 animate-fadeIn font-sans">
        <AdminDashboard />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white text-gray-800 font-sans antialiased selection:bg-brand-blue/10 selection:text-brand-blue">
      {/* Dynamic Main Website Header, Sections & Footer */}
      <Navbar />
      <main>
        <Hero />
        <Services />
        <AboutOwners />
        <WhyChooseUs />
        <Portfolio />
        <BookingForm />
      </main>
      <Footer />
    </div>
  );
}

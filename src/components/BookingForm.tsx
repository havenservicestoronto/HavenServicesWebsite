import React, { useState, FormEvent } from "react";
import { collection, addDoc } from "firebase/firestore";
import { db } from "../lib/firebase";
import { Check, AlertCircle, Send } from "lucide-react";

const AVAILABLE_SERVICES = [
  { id: "window", label: "Window Washing" },
  { id: "solar", label: "Solar Panel Cleaning" },
  { id: "gutter", label: "Gutter Cleaning" },
  { id: "lawn", label: "Lawn Care" },
];

export default function BookingForm() {
  const [propertyType, setPropertyType] = useState<"Residential" | "Commercial">("Residential");
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [address, setAddress] = useState("");
  const [selectedServices, setSelectedServices] = useState<string[]>([]);
  const [preferredDate, setPreferredDate] = useState("");
  const [preferredTime, setPreferredTime] = useState("Morning (8 AM - 12 PM)");
  const [notes, setNotes] = useState("");

  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");

  const handleToggleService = (serviceName: string) => {
    if (selectedServices.includes(serviceName)) {
      setSelectedServices(selectedServices.filter((s) => s !== serviceName));
    } else {
      setSelectedServices([...selectedServices, serviceName]);
    }
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError("");

    if (!name.trim()) return setError("Please enter your name");
    if (!phone.trim()) return setError("Please enter your phone number");
    if (!email.trim()) return setError("Please enter your email address");
    if (!address.trim()) return setError("Please enter your service address");
    if (selectedServices.length === 0) return setError("Please select at least one service");
    if (!preferredDate) return setError("Please pick a preferred date");

    setLoading(true);

    try {
      await addDoc(collection(db, "bookings"), {
        propertyType,
        name: name.trim(),
        phone: phone.trim(),
        email: email.trim().toLowerCase(),
        address: address.trim(),
        services: selectedServices,
        preferredDate,
        preferredTime,
        additionalNotes: notes.trim(),
        status: "Pending",
        createdAt: Date.now(),
      });

      setSuccess(true);
      // Reset form fields
      setPropertyType("Residential");
      setName("");
      setPhone("");
      setEmail("");
      setAddress("");
      setSelectedServices([]);
      setPreferredDate("");
      setPreferredTime("Morning (8 AM - 12 PM)");
      setNotes("");
    } catch (err: any) {
      console.error("Error submitting booking booking document to firestore:", err);
      setError("We encountered an error saving your booking. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  // Restrict preferred date choosing from matching today onwards (Toronto local date 2026-06-19)
  const todayStr = "2026-06-19";

  return (
    <section id="quote" className="py-24 bg-[#FAF2DF] scroll-mt-24 transition-colors duration-300">
      <div className="max-w-4xl mx-auto px-6">
        {/* Simplified Calm Header */}
        <div className="text-center max-w-xl mx-auto mb-12">
          <span className="text-xs uppercase font-semibold tracking-widest text-[#196BAB] block mb-2">
            Simple Booking
          </span>
          <h2 className="font-display text-2xl sm:text-3xl text-gray-950 mb-3 tracking-tight">
            Get a Free Quote
          </h2>
          <div className="w-12 h-1 bg-[#196BAB] rounded-full mx-auto mb-4" />
          <p className="text-gray-500 text-sm font-medium leading-relaxed font-sans">
            Fill out this quick form. Perseus or Shepherd will contact you with an estimate or booking conformation within 2 hours.
          </p>
        </div>

        {/* Outer Form Card — Pure White with soft gold/blue border */}
        <div className="bg-white rounded-3xl p-6 sm:p-10 border-2 border-[#196BAB]/45 shadow-md relative overflow-hidden">
          {success ? (
            <div className="py-12 px-6 text-center flex flex-col items-center justify-center animate-fadeIn">
              <div className="w-14 h-14 bg-brand-blue/10 text-brand-blue rounded-full flex items-center justify-center mb-5 border border-brand-blue/20">
                <Check className="w-6 h-6 stroke-[3]" />
              </div>
              <h3 className="font-display text-lg text-gray-900 mb-2">
                Booking Received!
              </h3>
              <p className="text-gray-600 text-sm max-w-md mx-auto mb-8 leading-relaxed">
                Thank you for choosing Haven Services! Your request has been logged successfully. <strong>Perseus or Shepherd</strong> will review your details and reach out to you via phone/email shortly.
              </p>
              <button
                onClick={() => setSuccess(false)}
                className="px-6 py-2.5 bg-brand-blue hover:bg-brand-blue-dark text-white font-semibold text-xs rounded-full shadow-sm hover:shadow transition-all duration-200"
              >
                Submit New Request
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-8">
              {error && (
                <div className="p-4 bg-red-50 text-red-600 rounded-xl flex items-start gap-3 border border-red-100 text-sm animate-shake">
                  <AlertCircle className="w-5 h-5 shrink-0 mt-0.5" />
                  <span>{error}</span>
                </div>
              )}

              {/* PROPERTY TYPE SELECTOR: Residential vs Commercial */}
              <div>
                <span className="block text-xs uppercase font-extrabold text-gray-700 tracking-wider mb-3">
                  1. Property Type
                </span>
                <div className="grid grid-cols-2 gap-4">
                  <button
                    type="button"
                    onClick={() => setPropertyType("Residential")}
                    className={`py-3 px-4 rounded-xl border-2 text-center font-bold text-xs sm:text-sm transition-all duration-250 cursor-pointer focus:outline-none flex items-center justify-center gap-2 ${
                      propertyType === "Residential"
                        ? "bg-[#196BAB]/10 border-[#196BAB] text-[#196BAB] scale-[1.01]"
                        : "bg-slate-50/50 border-slate-150 text-gray-500 hover:border-slate-200 hover:bg-slate-50"
                    }`}
                  >
                    <span className={`w-3.5 h-3.5 rounded-full border-2 flex items-center justify-center ${propertyType === "Residential" ? "border-[#196BAB]" : "border-gray-300"}`}>
                      {propertyType === "Residential" && <span className="w-1.5 h-1.5 rounded-full bg-[#196BAB]" />}
                    </span>
                    Residential
                  </button>
                  <button
                    type="button"
                    onClick={() => setPropertyType("Commercial")}
                    className={`py-3 px-4 rounded-xl border-2 text-center font-bold text-xs sm:text-sm transition-all duration-250 cursor-pointer focus:outline-none flex items-center justify-center gap-2 ${
                      propertyType === "Commercial"
                        ? "bg-[#196BAB]/10 border-[#196BAB] text-[#196BAB] scale-[1.01]"
                        : "bg-slate-50/50 border-slate-150 text-gray-500 hover:border-slate-200 hover:bg-slate-50"
                    }`}
                  >
                    <span className={`w-3.5 h-3.5 rounded-full border-2 flex items-center justify-center ${propertyType === "Commercial" ? "border-[#196BAB]" : "border-gray-300"}`}>
                      {propertyType === "Commercial" && <span className="w-1.5 h-1.5 rounded-full bg-[#196BAB]" />}
                    </span>
                    Commercial
                  </button>
                </div>
              </div>

              {/* SECTION 2: Select services with highly simplified pills */}
              <div>
                <span className="block text-xs uppercase font-bold text-gray-700 tracking-wider mb-3">
                  2. Services Needed
                </span>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  {AVAILABLE_SERVICES.map((srv) => {
                    const isSelected = selectedServices.includes(srv.label);
                    return (
                      <button
                        type="button"
                        key={srv.id}
                        onClick={() => handleToggleService(srv.label)}
                        className={`py-3 px-2 rounded-xl border text-center flex flex-col items-center justify-center gap-1.5 transition-all duration-200 focus:outline-none cursor-pointer ${
                          isSelected
                            ? "bg-[#196BAB]/10 border-[#196BAB] text-[#196BAB] scale-[1.02]"
                            : "bg-slate-50/50 border-slate-100 text-gray-600 hover:border-slate-200 hover:bg-slate-50"
                        }`}
                      >
                        {isSelected ? (
                          <div className="w-5 h-5 bg-[#196BAB]/20 text-[#196BAB] rounded-full flex items-center justify-center border border-[#196BAB]/20">
                            <Check className="w-3 h-3 stroke-[3]" />
                          </div>
                        ) : (
                          <div className="w-5 h-5 bg-white rounded-full border border-slate-200" />
                        )}
                        <span className="text-xs font-semibold">
                          {srv.label}
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* SECTION 3: Dynamic Customer & Address fields */}
              <div>
                <span className="block text-xs uppercase font-bold text-gray-700 tracking-wider mb-3">
                  3. Contact Details & Location
                </span>
                <div className="grid md:grid-cols-2 gap-4">
                  {/* Full Name */}
                  <div className="flex flex-col gap-1">
                    <label className="text-[11px] font-semibold text-gray-400 uppercase tracking-wide px-1">
                      Full Name
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. John Doe"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className="w-full px-4 py-2.5 bg-slate-50/50 focus:bg-white border border-slate-200/80 rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-blue/10 focus:border-[#196BAB] text-sm text-gray-800 transition-all font-medium"
                      required
                    />
                  </div>

                  {/* Phone Number */}
                  <div className="flex flex-col gap-1">
                    <label className="text-[11px] font-semibold text-gray-400 uppercase tracking-wide px-1">
                      Phone Number
                    </label>
                    <input
                      type="tel"
                      placeholder="e.g. (416) 555-0199"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      className="w-full px-4 py-2.5 bg-slate-50/50 focus:bg-white border border-slate-200/80 rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-blue/10 focus:border-[#196BAB] text-sm text-gray-800 transition-all font-medium"
                      required
                    />
                  </div>

                  {/* Email */}
                  <div className="flex flex-col gap-1">
                    <label className="text-[11px] font-semibold text-gray-400 uppercase tracking-wide px-1">
                      Email address
                    </label>
                    <input
                      type="email"
                      placeholder="e.g. john@example.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full px-4 py-2.5 bg-slate-50/50 focus:bg-white border border-slate-200/80 rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-blue/10 focus:border-[#196BAB] text-sm text-gray-800 transition-all font-medium"
                      required
                    />
                  </div>

                  {/* Address */}
                  <div className="flex flex-col gap-1">
                    <label className="text-[11px] font-semibold text-gray-400 uppercase tracking-wide px-1">
                      Service Address
                    </label>
                    <input
                      type="text"
                      placeholder="Street, City (Toronto & Suburbs)"
                      value={address}
                      onChange={(e) => setAddress(e.target.value)}
                      className="w-full px-4 py-2.5 bg-slate-50/50 focus:bg-white border border-slate-200/80 rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-blue/10 focus:border-[#196BAB] text-sm text-gray-800 transition-all font-medium"
                      required
                    />
                  </div>
                </div>
              </div>

              {/* SECTION 4: Simple Schedule block */}
              <div>
                <span className="block text-xs uppercase font-bold text-gray-700 tracking-wider mb-3">
                  4. Preferred appointment times
                </span>
                <div className="grid md:grid-cols-2 gap-4">
                  {/* Preferred Date */}
                  <div className="flex flex-col gap-1">
                    <label className="text-[11px] font-semibold text-gray-400 uppercase tracking-wide px-1">
                      Target Date
                    </label>
                    <input
                      type="date"
                      value={preferredDate}
                      min={todayStr}
                      onChange={(e) => setPreferredDate(e.target.value)}
                      className="w-full px-4 py-2.5 bg-slate-50/50 focus:bg-white border border-slate-200/80 rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-blue/10 focus:border-[#196BAB] text-sm text-gray-800 transition-all font-medium"
                      required
                    />
                  </div>

                  {/* Preferred Time Window */}
                  <div className="flex flex-col gap-1">
                    <label className="text-[11px] font-semibold text-gray-400 uppercase tracking-wide px-1">
                      Preferred Time Window
                    </label>
                    <div className="relative">
                      <select
                        value={preferredTime}
                        onChange={(e) => setPreferredTime(e.target.value)}
                        className="w-full px-4 py-2.5 bg-slate-50/50 focus:bg-white border border-slate-200/80 rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-blue/10 focus:border-[#196BAB] text-sm text-gray-800 font-semibold transition-all appearance-none"
                      >
                        <option>Morning (8 AM - 12 PM)</option>
                        <option>Afternoon (12 PM - 4 PM)</option>
                        <option>Evening (4 PM - 8 PM)</option>
                      </select>
                      <div className="absolute right-4 top-3.5 pointer-events-none text-gray-400">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2.5"
                          className="w-3.5 h-3.5"
                        >
                          <polyline points="6 9 12 15 18 9" />
                        </svg>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* SECTION 5: Notes */}
              <div className="flex flex-col gap-1">
                <label className="text-xs uppercase font-bold text-gray-700 tracking-wider mb-1">
                  5. Additional property info (Optional)
                </label>
                <textarea
                  placeholder="e.g. number of storeys, specific lawn boundaries, or key access details"
                  value={notes}
                  rows={3}
                  onChange={(e) => setNotes(e.target.value)}
                  className="w-full px-4 py-3 bg-slate-50/50 focus:bg-white border border-slate-200/80 rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-blue/10 focus:border-[#196BAB] text-sm text-gray-800 transition-all font-medium"
                />
              </div>

              {/* SUBMIT BUTTON */}
              <div className="pt-2 text-center">
                <button
                  type="submit"
                  disabled={loading}
                  className="inline-flex items-center justify-center gap-2 px-8 py-3 bg-brand-blue hover:bg-brand-blue-dark text-white rounded-full font-semibold text-sm transition-all duration-300 shadow-md hover:shadow-lg focus:outline-none disabled:opacity-50 cursor-pointer"
                >
                  {loading ? (
                    <>
                      <svg className="animate-spin h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                      </svg>
                      <span>Submitting Request...</span>
                    </>
                  ) : (
                    <>
                      <Send className="w-3.5 h-3.5" />
                      <span>Send Quote Request</span>
                    </>
                  )}
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </section>
  );
}

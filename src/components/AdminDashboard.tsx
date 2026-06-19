import React, { useState, useEffect, FormEvent } from "react";
import { 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword, 
  signOut, 
  onAuthStateChanged, 
  User 
} from "firebase/auth";
import { 
  collection, 
  query, 
  orderBy, 
  onSnapshot, 
  doc, 
  updateDoc, 
  deleteDoc,
  writeBatch
} from "firebase/firestore";
import { auth, db } from "../lib/firebase";
import { Booking } from "../types";
import { 
  Lock, Mail, Key, LogIn, LogOut, Search, Filter, Calendar as CalendarIcon, 
  Check, Edit, Trash2, Clock, X, CheckSquare, Plus, AlertCircle, RefreshCw, 
  Smartphone, MapPin, User as UserIcon, BookOpen, Layers, ChevronLeft, ChevronRight
} from "lucide-react";

// Allowed email administrators
const ALLOWED_ADMINS = [
  "havenservicestoronto@gmail.com",
  "ptecsonmedia@gmail.com",
  "shepherd.burke16@gmail.com"
];

const STATUS_VARIANTS: Record<string, { bg: string; text: string; dot: string }> = {
  Pending: { bg: "bg-amber-50 border-amber-100", text: "text-amber-800", dot: "bg-amber-500" },
  Confirmed: { bg: "bg-indigo-50 border-indigo-100", text: "text-indigo-800", dot: "bg-indigo-500" },
  Completed: { bg: "bg-emerald-50 border-emerald-100", text: "text-emerald-800", dot: "bg-emerald-500" },
  Cancelled: { bg: "bg-rose-50 border-rose-100", text: "text-rose-800", dot: "bg-rose-500" }
};

export default function AdminDashboard() {
  // Auth details
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [authLoading, setAuthLoading] = useState(true);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isRegistering, setIsRegistering] = useState(false);
  const [authError, setAuthError] = useState("");

  // Bookings details
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loadingBookings, setLoadingBookings] = useState(true);

  // Search & Filter state
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("All");
  const [selectedDateFilter, setSelectedDateFilter] = useState<string>("");

  // Modals / Actions
  const [editingBooking, setEditingBooking] = useState<Booking | null>(null);
  const [bookingToDelete, setBookingToDelete] = useState<Booking | null>(null);

  // Form states (for Editor Modal)
  const [editPropertyType, setEditPropertyType] = useState<"Residential" | "Commercial">("Residential");
  const [editName, setEditName] = useState("");
  const [editPhone, setEditPhone] = useState("");
  const [editEmail, setEditEmail] = useState("");
  const [editAddress, setEditAddress] = useState("");
  const [editServices, setEditServices] = useState<string[]>([]);
  const [editDate, setEditDate] = useState("");
  const [editTime, setEditTime] = useState("");
  const [editNotes, setEditNotes] = useState("");
  const [editStatus, setEditStatus] = useState<Booking["status"]>("Pending");
  const [editError, setEditError] = useState("");

  // Calendar State (Viewing current month bookings)
  const [calendarYear, setCalendarYear] = useState(2026);
  const [calendarMonth, setCalendarMonth] = useState(5); // June is 5 (0-indexed)

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        if (ALLOWED_ADMINS.includes(user.email || "")) {
          setCurrentUser(user);
          setAuthError("");
        } else {
          // Signout immediately if not authorized admin
          signOut(auth);
          setCurrentUser(null);
          setAuthError("Unauthorized email access. Entry restricted to Co-Owner accounts.");
        }
      } else {
        setCurrentUser(null);
      }
      setAuthLoading(false);
    });

    return () => unsubscribe();
  }, []);

  // Fetching live Bookings
  useEffect(() => {
    if (!currentUser) return;

    setLoadingBookings(true);
    const bookingsQuery = query(collection(db, "bookings"), orderBy("createdAt", "desc"));
    
    const unsubscribe = onSnapshot(bookingsQuery, (snapshot) => {
      const items: Booking[] = [];
      snapshot.forEach((doc) => {
        items.push({ id: doc.id, ...doc.data() } as Booking);
      });
      setBookings(items);
      setLoadingBookings(false);
    }, (err) => {
      console.error("Firestore loading error:", err);
      setLoadingBookings(false);
    });

    return () => unsubscribe();
  }, [currentUser]);

  // Auth Submit
  const handleAuthSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setAuthError("");

    if (!email.trim() || !password.trim()) {
      setAuthError("Please fill out all login fields");
      return;
    }

    // Safety email validation
    const targetEmail = email.trim().toLowerCase();
    if (!ALLOWED_ADMINS.includes(targetEmail)) {
      setAuthError("Unauthorized admin email. Management terminal access denied.");
      return;
    }

    try {
      if (isRegistering) {
        await createUserWithEmailAndPassword(auth, targetEmail, password);
      } else {
        await signInWithEmailAndPassword(auth, targetEmail, password);
      }
      setPassword("");
    } catch (err: any) {
      console.error("Auth error trace:", err);
      if (err.code === "auth/invalid-credential" || err.code === "auth/wrong-password") {
        setAuthError("Incorrect password or login details. Please check and try again.");
      } else if (err.code === "auth/user-not-found") {
        setAuthError("No account found. Reach out to Perseus to pre-authorize your login email.");
      } else {
        setAuthError(err.message || "Authentication failed.");
      }
    }
  };

  const handleLogout = () => {
    signOut(auth);
  };

  // Open Edit Modal
  const openEditModal = (booking: Booking) => {
    setEditingBooking(booking);
    setEditPropertyType(booking.propertyType || "Residential");
    setEditName(booking.name);
    setEditPhone(booking.phone);
    setEditEmail(booking.email);
    setEditAddress(booking.address);
    setEditServices(booking.services);
    setEditDate(booking.preferredDate);
    setEditTime(booking.preferredTime);
    setEditNotes(booking.additionalNotes);
    setEditStatus(booking.status);
    setEditError("");
  };

  const toggleEditService = (service: string) => {
    if (editServices.includes(service)) {
      setEditServices(editServices.filter((s) => s !== service));
    } else {
      setEditServices([...editServices, service]);
    }
  };

  // Save Edit Function
  const saveBookingEdit = async (e: FormEvent) => {
    e.preventDefault();
    setEditError("");

    if (!editName.trim()) return setEditError("Name is required");
    if (!editPhone.trim()) return setEditError("Phone is required");
    if (!editEmail.trim()) return setEditError("Email is required");
    if (!editAddress.trim()) return setEditError("Address is required");
    if (editServices.length === 0) return setEditError("Please select at least one service");
    if (!editDate) return setEditError("Date is required");

    if (!editingBooking?.id) return;

    try {
      const docRef = doc(db, "bookings", editingBooking.id);
      await updateDoc(docRef, {
        propertyType: editPropertyType,
        name: editName.trim(),
        phone: editPhone.trim(),
        email: editEmail.trim(),
        address: editAddress.trim(),
        services: editServices,
        preferredDate: editDate,
        preferredTime: editTime,
        additionalNotes: editNotes.trim(),
        status: editStatus
      });
      setEditingBooking(null);
    } catch (err: any) {
      console.error("Error updating booking details:", err);
      setEditError("Failed to update database record. Please try again.");
    }
  };

  // Quick Status Edit
  const updateStatusQuick = async (bookingId: string | undefined, newStatus: Booking["status"]) => {
    if (!bookingId) return;
    try {
      const docRef = doc(db, "bookings", bookingId);
      await updateDoc(docRef, { status: newStatus });
    } catch (err) {
      console.error("Error updating status:", err);
    }
  };

  // Delete Action
  const confirmDeleteBooking = async () => {
    if (!bookingToDelete?.id) return;
    try {
      await deleteDoc(doc(db, "bookings", bookingToDelete.id));
      setBookingToDelete(null);
    } catch (err) {
      console.error("Error deleting document from Firestore:", err);
    }
  };

  // Filter Bookings Based on Search Query + Dropdowns
  const filteredBookings = bookings.filter((b) => {
    const matchesSearch = 
      b.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      b.address.toLowerCase().includes(searchQuery.toLowerCase()) ||
      b.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      b.phone.includes(searchQuery);

    const matchesStatus = statusFilter === "All" || b.status === statusFilter;
    const matchesDate = !selectedDateFilter || b.preferredDate === selectedDateFilter;

    return matchesSearch && matchesStatus && matchesDate;
  });

  // KPI calculations
  const totalCount = bookings.length;
  const pendingCount = bookings.filter((b) => b.status === "Pending").length;
  const confirmedCount = bookings.filter((b) => b.status === "Confirmed").length;
  const completedCount = bookings.filter((b) => b.status === "Completed").length;

  // Calendar grouping helper
  const bookingsByDateMap = bookings.reduce((acc, booking) => {
    const date = booking.preferredDate;
    if (!acc[date]) acc[date] = [];
    acc[date].push(booking);
    return acc;
  }, {} as Record<string, Booking[]>);

  // Generate Calendar Days
  const getDaysInMonth = (year: number, month: number) => {
    return new Date(year, month + 1, 0).getDate();
  };

  const getFirstDayOfMonth = (year: number, month: number) => {
    return new Date(year, month, 1).getDay();
  };

  const daysInMonthCount = getDaysInMonth(calendarYear, calendarMonth);
  const firstDayIndex = getFirstDayOfMonth(calendarYear, calendarMonth);

  const monthNames = [
    "January", "February", "March", "April", "May", "June", 
    "July", "August", "September", "October", "November", "December"
  ];

  const handlePrevMonth = () => {
    if (calendarMonth === 0) {
      setCalendarMonth(11);
      setCalendarYear(calendarYear - 1);
    } else {
      setCalendarMonth(calendarMonth - 1);
    }
  };

  const handleNextMonth = () => {
    if (calendarMonth === 11) {
      setCalendarMonth(0);
      setCalendarYear(calendarYear + 1);
    } else {
      setCalendarMonth(calendarMonth + 1);
    }
  };

  // Seed sample database bookings (Only with admin consent but perfect for testing!)
  const seedSampleBookings = async () => {
    setLoadingBookings(true);
    const sampleData: Omit<Booking, "id">[] = [
      {
        propertyType: "Residential",
        name: "Alice Montgomery",
        phone: "(416) 555-0812",
        email: "alice.montgomery@rogers.com",
        address: "42 High Park Ave, Toronto, ON",
        services: ["Window Washing", "Gutter Cleaning"],
        preferredDate: "2026-06-21",
        preferredTime: "Morning (8 AM - 12 PM)",
        additionalNotes: "Standard heritage detached home. Please wash outside and inside.",
        status: "Pending",
        createdAt: Date.now() - 3600000 * 2,
      },
      {
        propertyType: "Commercial",
        name: "Marcus Vance",
        phone: "(647) 555-0925",
        email: "marcus@vancedevelopments.ca",
        address: "702 Queen St West, Toronto, ON",
        services: ["Solar Panel Cleaning"],
        preferredDate: "2026-06-25",
        preferredTime: "Afternoon (12 PM - 4 PM)",
        additionalNotes: "Flat commercial roof. Sizable array. Easy ladder access available.",
        status: "Confirmed",
        createdAt: Date.now() - 3600000 * 12,
      },
      {
        propertyType: "Residential",
        name: "Diane Peterson",
        phone: "(416) 555-0744",
        email: "diane_p@sympatico.ca",
        address: "18 Pine Hills Rd, Scarborough, ON",
        services: ["Lawn Care"],
        preferredDate: "2026-06-19",
        preferredTime: "Morning (8 AM - 12 PM)",
        additionalNotes: "Corner lot, needs edges trimmed nicely near pavement sidewalks.",
        status: "Completed",
        createdAt: Date.now() - 3600000 * 24,
      }
    ];

    try {
      const batch = writeBatch(db);
      sampleData.forEach((item) => {
        const newDocRef = doc(collection(db, "bookings"));
        batch.set(newDocRef, item);
      });
      await batch.commit();
    } catch (err) {
      console.error("Error seeding data:", err);
    } finally {
      setLoadingBookings(false);
    }
  };

  if (authLoading) {
    return (
      <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center p-6 text-center">
        <div className="w-12 h-12 border-4 border-brand-blue border-t-transparent rounded-full animate-spin mb-4" />
        <p className="font-semibold text-gray-700 text-sm">Validating administrative session...</p>
      </div>
    );
  }

  // 1. LOGIN INTERFACE (Unauthenticated state)
  if (!currentUser) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center px-4 py-12">
        <div className="max-w-md w-full bg-white rounded-3xl p-8 border border-slate-100 shadow-xl relative overflow-hidden">
          {/* Logo element */}
          <div className="text-center mb-8">
            <div className="w-12 h-12 bg-brand-blue/10 border border-brand-blue/20 rounded-full flex items-center justify-center text-brand-blue mx-auto mb-4">
              <Lock className="w-5 h-5 fill-brand-blue/10 animate-pulse" />
            </div>
            <h1 className="font-display text-xl uppercase tracking-wider text-gray-950">
              HAVEN DIRECT
            </h1>
            <p className="text-xs uppercase tracking-widest text-[#D5AF33] font-semibold -mt-0.5 mb-1">
              Co-Owner Administration
            </p>
            <span className="text-xs text-gray-400">
              Input credential set to check booking logs
            </span>
          </div>

          <form onSubmit={handleAuthSubmit} className="space-y-5">
            {authError && (
              <div className="p-4 bg-rose-50 text-rose-600 rounded-2xl flex items-start gap-2.5 border border-rose-100 text-xs animate-shake leading-snug">
                <AlertCircle className="w-4.5 h-4.5 shrink-0" />
                <span>{authError}</span>
              </div>
            )}

            {/* Email field */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-gray-700 uppercase tracking-wider block">
                email address
              </label>
              <div className="relative">
                <span className="absolute left-4 top-3.5 text-gray-400">
                  <Mail className="w-4 h-4" />
                </span>
                <input
                  type="email"
                  placeholder="perseus@havenservices.ca"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-11 pr-4 py-3 bg-slate-50 hover:bg-slate-100/50 focus:bg-white border border-slate-100 rounded-full text-sm text-gray-800 transition-all font-medium focus:outline-none focus:ring-2 focus:ring-brand-blue/20"
                  required
                />
              </div>
            </div>

            {/* Password field */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-gray-700 uppercase tracking-wider block">
                password
              </label>
              <div className="relative">
                <span className="absolute left-4 top-3.5 text-gray-400">
                  <Key className="w-4 h-4" />
                </span>
                <input
                  type="password"
                  placeholder="••••••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-11 pr-4 py-3 bg-slate-50 hover:bg-slate-100/50 focus:bg-white border border-slate-100 rounded-full text-sm text-gray-800 transition-all font-medium focus:outline-none focus:ring-2 focus:ring-brand-blue/20"
                  required
                />
              </div>
            </div>

            {/* Submit */}
            <button
              type="submit"
              className="w-full py-3.5 bg-brand-blue hover:bg-brand-blue-dark text-white font-semibold text-sm rounded-full shadow-md hover:shadow-lg transition-all duration-200 cursor-pointer flex items-center justify-center gap-2"
            >
              <LogIn className="w-4 h-4" />
              <span>{isRegistering ? "Register Co-Owner" : "Admin Login"}</span>
            </button>

            {/* Toggle Signin Mode */}
            <div className="text-center pt-2">
              <button
                type="button"
                onClick={() => setIsRegistering(!isRegistering)}
                className="text-xs text-slate-500 hover:text-brand-blue font-semibold underline decoration-dashed transition-colors"
              >
                {isRegistering 
                  ? "Already have an account? Sign in here" 
                  : "First time logging in? Click here to register your email"}
              </button>
            </div>
          </form>

          {/* Bottom info */}
          <div className="mt-8 pt-6 border-t border-slate-100 text-center text-[10px] text-gray-400">
            Secure admin portal for havenservices.ca. Unauthorized intrusion attempts are monitored.
          </div>
        </div>
      </div>
    );
  }

  // 2. DASHBOARD MAIN VIEW (Authenticated block)
  return (
    <div className="min-h-screen bg-slate-50/50 pt-10 pb-20 px-4 md:px-8">
      {/* Top Banner Control */}
      <div className="max-w-7xl mx-auto mb-10 flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white p-6 rounded-3xl border border-slate-100/80 shadow-xs relative">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 bg-brand-blue/5 rounded-full flex items-center justify-center text-brand-blue border border-brand-blue/10">
            <BookOpen className="w-5 h-5" />
          </div>
          <div>
            <h1 className="font-display text-lg uppercase tracking-wider text-gray-950">
              MANAGEMENT TERMINAL
            </h1>
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse" />
              <span className="text-xs font-semibold text-gray-500 truncate max-w-[200px]">
                Active: {currentUser.email}
              </span>
            </div>
          </div>
        </div>

        {/* Action button grouping */}
        <div className="flex items-center gap-3">
          <a
            href="#"
            className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-gray-700 text-xs font-bold rounded-full transition-colors flex items-center gap-1.5"
          >
            <span>Exit to Site</span>
          </a>

          {bookings.length === 0 && (
            <button
              onClick={seedSampleBookings}
              className="px-4 py-2 bg-emerald-50 hover:bg-emerald-100 text-emerald-800 text-xs font-bold rounded-full border border-emerald-200 transition-colors flex items-center gap-1"
            >
              <RefreshCw className="w-3 h-3 animate-spin duration-3000" />
              <span>Seed Booking Samples</span>
            </button>
          )}

          <button
            onClick={handleLogout}
            className="px-4 py-2 bg-rose-50 hover:bg-rose-100 text-rose-600 text-xs font-bold rounded-full border border-rose-100 transition-colors flex items-center gap-1.5 cursor-pointer"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span>Sign Out</span>
          </button>
        </div>
      </div>

      {/* KPI Stats widgets */}
      <div className="max-w-7xl mx-auto mb-10 grid grid-cols-2 md:grid-cols-4 gap-4">
        {/* Total stats */}
        <div className="bg-white p-5 rounded-3xl border border-slate-100 shadow-xs flex flex-col justify-between">
          <span className="text-xs uppercase tracking-wider text-gray-500 font-bold">
            Total Bookings
          </span>
          <div className="flex items-baseline justify-between mt-4">
            <span className="text-3xl font-display text-gray-950 leading-none">
              {totalCount}
            </span>
            <span className="text-[10px] bg-slate-100 text-gray-600 font-bold px-2 py-0.5 rounded-full uppercase">
              ALL ITEMS
            </span>
          </div>
        </div>

        {/* Pending stats */}
        <div className="bg-white p-5 rounded-3xl border border-slate-100 shadow-xs flex flex-col justify-between">
          <span className="text-xs uppercase tracking-wider text-amber-600 font-bold">
            Pending Approval
          </span>
          <div className="flex items-baseline justify-between mt-4">
            <span className="text-3xl font-display text-amber-600 leading-none">
              {pendingCount}
            </span>
            <span className="text-[10px] bg-amber-50 text-amber-700 border border-amber-100 font-bold px-2 py-0.5 rounded-full uppercase">
              NEW REQUESTS
            </span>
          </div>
        </div>

        {/* Confirmed stats */}
        <div className="bg-white p-5 rounded-3xl border border-slate-100 shadow-xs flex flex-col justify-between">
          <span className="text-xs uppercase tracking-wider text-indigo-600 font-bold">
            Confirmed Slots
          </span>
          <div className="flex items-baseline justify-between mt-4">
            <span className="text-3xl font-display text-indigo-600 leading-none">
              {confirmedCount}
            </span>
            <span className="text-[10px] bg-indigo-50 text-indigo-700 border border-indigo-100 font-bold px-2 py-0.5 rounded-full uppercase">
              SCHEDULED
            </span>
          </div>
        </div>

        {/* Completed stats */}
        <div className="bg-white p-5 rounded-3xl border border-slate-100 shadow-xs flex flex-col justify-between">
          <span className="text-xs uppercase tracking-wider text-emerald-600 font-bold">
            Completed Cleanups
          </span>
          <div className="flex items-baseline justify-between mt-4">
            <span className="text-3xl font-display text-emerald-600 leading-none">
              {completedCount}
            </span>
            <span className="text-[10px] bg-emerald-50 text-emerald-700 border border-emerald-100 font-bold px-2 py-0.5 rounded-full uppercase">
              DELIVERED
            </span>
          </div>
        </div>
      </div>

      {/* Main Container: Calendar side & Data Table side */}
      <div className="max-w-7xl mx-auto grid lg:grid-cols-12 gap-8 items-start">
        {/* CALENDAR BLOCK - 4 columns wide on lg */}
        <div className="lg:col-span-4 bg-white p-6 rounded-3xl border border-slate-100 shadow-xs">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-sm font-bold uppercase tracking-wider text-gray-900 flex items-center gap-2">
              <CalendarIcon className="w-4 h-4 text-brand-blue" />
              <span>Calendar View</span>
            </h2>

            {/* Navigation buttons */}
            <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-full">
              <button
                onClick={handlePrevMonth}
                className="w-6 h-6 rounded-full flex items-center justify-center hover:bg-white text-gray-600 transition-all text-xs"
              >
                <ChevronLeft className="w-3.5 h-3.5" />
              </button>
              <span className="text-[11px] font-bold text-gray-800 px-1 min-w-[75px] text-center">
                {monthNames[calendarMonth]}
              </span>
              <button
                onClick={handleNextMonth}
                className="w-6 h-6 rounded-full flex items-center justify-center hover:bg-white text-gray-600 transition-all text-xs"
              >
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          <p className="text-xs text-gray-400 mb-6">
            Click on highlighted days with checkmarks below to filter the bookings table to that specific target date.
          </p>

          {/* Calendar grid */}
          <div className="grid grid-cols-7 gap-1 text-center text-xs font-semibold text-gray-500 border-b border-slate-100 pb-2 mb-2">
            <span>Su</span>
            <span>Mo</span>
            <span>Tu</span>
            <span>We</span>
            <span>Th</span>
            <span>Fr</span>
            <span>Sa</span>
          </div>

          <div className="grid grid-cols-7 gap-1.5">
            {/* Empty boxes for starting week offsets */}
            {Array.from({ length: firstDayIndex }).map((_, idx) => (
              <div key={`offset-${idx}`} className="aspect-square" />
            ))}

            {/* Day grid mapping */}
            {Array.from({ length: daysInMonthCount }).map((_, idx) => {
              const day = idx + 1;
              const dateString = `${calendarYear}-${String(calendarMonth + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
              const dayBookings = bookingsByDateMap[dateString] || [];
              const hasBookings = dayBookings.length > 0;
              const isCurrentlySelected = selectedDateFilter === dateString;

              return (
                <button
                  key={`day-${day}`}
                  onClick={() => {
                    if (isCurrentlySelected) {
                      setSelectedDateFilter(""); // Clear filter
                    } else if (hasBookings) {
                      setSelectedDateFilter(dateString);
                    } else {
                      setSelectedDateFilter(dateString); // even if empty, let's filter
                    }
                  }}
                  className={`aspect-square rounded-full text-xs font-semibold flex flex-col items-center justify-center relative transition-all focus:outline-none cursor-pointer ${
                    isCurrentlySelected
                      ? "bg-brand-blue text-white shadow-xs font-black ring-2 ring-brand-blue-dark/20"
                      : hasBookings
                      ? "bg-brand-blue/10 text-brand-blue hover:bg-brand-blue/20 cursor-pointer font-bold border border-brand-blue/20"
                      : "text-gray-700 hover:bg-slate-50"
                  }`}
                >
                  <span>{day}</span>
                  {hasBookings && !isCurrentlySelected && (
                    <span className="absolute bottom-1 w-1.5 h-1.5 bg-brand-gold rounded-full" />
                  )}
                </button>
              );
            })}
          </div>

          {/* Active calendar filters */}
          {selectedDateFilter && (
            <div className="mt-6 pt-5 border-t border-slate-100 flex items-center justify-between text-xs font-semibold bg-brand-blue/5 p-3 rounded-2xl border border-brand-blue/10 animate-scaleIn">
              <div className="flex items-center gap-1.5 text-brand-blue">
                <CalendarIcon className="w-3.5 h-3.5" />
                <span>Showing: {selectedDateFilter}</span>
              </div>
              <button
                onClick={() => setSelectedDateFilter("")}
                className="text-gray-500 hover:text-rose-600 transition-colors uppercase text-[10px] font-bold"
              >
                Clear Filter
              </button>
            </div>
          )}
        </div>

        {/* BOOKINGS TABLE BLOCK - 8 columns wide on lg */}
        <div className="lg:col-span-8 space-y-6">
          {/* Filters & Search top row */}
          <div className="bg-white p-5 rounded-3xl border border-slate-100 shadow-xs flex flex-col md:flex-row items-center gap-4">
            {/* Search Box */}
            <div className="relative w-full md:flex-1">
              <span className="absolute left-4 top-3 text-gray-400">
                <Search className="w-4.5 h-4.5" />
              </span>
              <input
                type="text"
                placeholder="Search bookings by customer, zip, email, or phone..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-11 pr-4 py-2.5 bg-slate-50 focus:bg-white border border-slate-100 focus:border-brand-blue rounded-full text-sm text-gray-800 transition-all font-medium focus:outline-none"
              />
            </div>

            {/* Status Select filter */}
            <div className="relative w-full md:w-48">
              <span className="absolute left-4 top-3 text-gray-400">
                <Filter className="w-4 h-4" />
              </span>
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="w-full pl-10 pr-8 py-2.5 bg-slate-50 border border-slate-100 rounded-full text-sm font-semibold text-gray-800 focus:outline-none focus:ring-2 focus:ring-brand-blue/10 appearance-none"
              >
                <option value="All">All Statuses</option>
                <option value="Pending">Pending</option>
                <option value="Confirmed">Confirmed</option>
                <option value="Completed">Completed</option>
                <option value="Cancelled">Cancelled</option>
              </select>
              <div className="absolute right-4 top-3.5 pointer-events-none text-gray-400">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-3.5 h-3.5">
                  <polyline points="6 9 12 15 18 9" />
                </svg>
              </div>
            </div>
          </div>

          {/* Bookings table/list view */}
          <div className="bg-white rounded-3xl border border-slate-100 shadow-xs overflow-hidden">
            <div className="p-6 border-b border-slate-100/60 flex items-center justify-between">
              <h2 className="text-sm font-bold uppercase tracking-wider text-gray-900">
                Booking Inquiries ({filteredBookings.length})
              </h2>
              {selectedDateFilter && (
                <span className="text-xs bg-brand-blue/5 text-brand-blue font-semibold px-3 py-1 rounded-full">
                  Filtered by Date
                </span>
              )}
            </div>

            {loadingBookings ? (
              <div className="py-24 text-center flex flex-col items-center justify-center">
                <div className="w-10 h-10 border-4 border-brand-blue border-t-transparent rounded-full animate-spin mb-4" />
                <p className="text-sm text-gray-500 font-semibold">Retrieving real-time data from Firestore...</p>
              </div>
            ) : filteredBookings.length === 0 ? (
              <div className="py-24 text-center px-6">
                <div className="w-14 h-14 bg-slate-100 text-slate-400 rounded-full flex items-center justify-center mx-auto mb-4 border border-slate-200">
                  <BookOpen className="w-6 h-6" />
                </div>
                <h3 className="font-display text-sm uppercase tracking-wider text-gray-850 mb-1">
                  No records match
                </h3>
                <p className="text-sm text-gray-400 max-w-sm mx-auto">
                  Try clearing booking search filters or wait for potential customers to submit requests on the home page.
                </p>
                {selectedDateFilter && (
                  <button
                    onClick={() => setSelectedDateFilter("")}
                    className="mt-4 text-xs bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold px-4 py-2 rounded-full"
                  >
                    Clear Calendar Filter
                  </button>
                )}
              </div>
            ) : (
              <div className="divide-y divide-slate-100">
                {filteredBookings.map((bk) => (
                  <div
                    key={bk.id}
                    className="p-6 hover:bg-slate-50/50 transition-colors duration-200 flex flex-col md:flex-row md:items-start justify-between gap-6"
                  >
                    {/* Booking Details */}
                    <div className="space-y-3 md:flex-1">
                      {/* Name & Badge Row */}
                      <div className="flex items-center gap-3 flex-wrap">
                        <span className="font-display text-xs text-gray-950 block">
                          {bk.name}
                        </span>
                        
                        {bk.propertyType && (
                          <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-[9px] font-extrabold uppercase tracking-wider border ${
                            bk.propertyType === "Commercial"
                              ? "bg-purple-50 border-purple-150 text-purple-700"
                              : "bg-blue-50 border-blue-150 text-blue-700"
                          }`}>
                            {bk.propertyType}
                          </span>
                        )}
                        
                        {/* Status label */}
                        <span className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-bold border ${STATUS_VARIANTS[bk.status]?.bg} ${STATUS_VARIANTS[bk.status]?.text}`}>
                          <span className={`w-1.5 h-1.5 rounded-full ${STATUS_VARIANTS[bk.status]?.dot}`} />
                          <span>{bk.status}</span>
                        </span>
                        
                        {/* Time label */}
                        <span className="text-[10px] font-bold text-gray-400">
                          {new Date(bk.createdAt).toLocaleDateString()}
                        </span>
                      </div>

                      {/* Services Requested badges */}
                      <div className="flex items-center gap-1.5 flex-wrap">
                        {bk.services.map((srv, idx) => (
                          <span
                            key={idx}
                            className="bg-brand-blue/5 text-brand-blue text-[10px] font-bold px-2 py-0.5 rounded-full border border-brand-blue/10"
                          >
                            {srv}
                          </span>
                        ))}
                      </div>

                      {/* Info matrix */}
                      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-x-6 gap-y-2 text-xs pt-1">
                        {/* Phone */}
                        <div className="flex items-center gap-2 text-gray-600">
                          <Smartphone className="w-3.5 h-3.5 text-slate-400" />
                          <a href={`tel:${bk.phone}`} className="hover:underline hover:text-brand-blue">
                            {bk.phone}
                          </a>
                        </div>
                        {/* Email */}
                        <div className="flex items-center gap-2 text-gray-600">
                          <Mail className="w-3.5 h-3.5 text-slate-400" />
                          <a href={`mailto:${bk.email}`} className="hover:underline hover:text-brand-blue truncate">
                            {bk.email}
                          </a>
                        </div>
                        {/* Preferred slot */}
                        <div className="flex items-center gap-2 text-gray-600">
                          <Clock className="w-3.5 h-3.5 text-slate-400" />
                          <span>
                            {bk.preferredDate} ({bk.preferredTime})
                          </span>
                        </div>
                      </div>

                      {/* Address */}
                      <div className="flex items-start gap-2 text-xs text-gray-600 bg-slate-50 p-2.5 rounded-xl border border-slate-100/60 font-medium">
                        <MapPin className="w-4 h-4 text-slate-400 shrink-0" />
                        <span>Address: {bk.address}</span>
                      </div>

                      {/* Additional notes */}
                      {bk.additionalNotes && (
                        <div className="text-xs text-slate-500 italic px-3 border-l-2 border-slate-200 py-1 max-w-xl">
                          " {bk.additionalNotes} "
                        </div>
                      )}
                    </div>

                    {/* Active Actions */}
                    <div className="flex flex-row md:flex-col items-center md:items-end justify-between md:justify-start gap-3 border-t md:border-t-0 border-slate-100 pt-4 md:pt-0 shrink-0">
                      {/* Set status inline */}
                      <div className="flex items-center gap-1">
                        <span className="text-[10px] text-gray-400 font-bold uppercase mr-1">
                          Set:
                        </span>
                        {(["Pending", "Confirmed", "Completed", "Cancelled"] as Booking["status"][]).map((st) => (
                          <button
                            key={st}
                            onClick={() => updateStatusQuick(bk.id, st)}
                            className={`w-6 h-6 rounded-full flex items-center justify-center text-[9px] font-bold border transition-all ${
                              bk.status === st
                                ? "bg-slate-900 border-slate-900 text-white font-black"
                                : "bg-white hover:bg-slate-100 border-slate-100 text-slate-500"
                            }`}
                            title={`Mark as ${st}`}
                          >
                            {st[0]}
                          </button>
                        ))}
                      </div>

                      {/* Edit or Delete */}
                      <div className="flex items-center gap-2">
                        {/* Edit */}
                        <button
                          onClick={() => openEditModal(bk)}
                          className="p-2 bg-slate-50 hover:bg-slate-100 text-gray-600 rounded-full hover:text-brand-blue border border-slate-100 transition-colors"
                          title="Edit Booking"
                        >
                          <Edit className="w-3.5 h-3.5" />
                        </button>

                        {/* Delete */}
                        <button
                          onClick={() => setBookingToDelete(bk)}
                          className="p-2 bg-rose-50 hover:bg-rose-100 text-rose-500 rounded-full border border-rose-100 transition-colors"
                          title="Delete Request"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* 3. MODAL: EDIT RECORD */}
      {editingBooking && (
        <div className="fixed inset-0 z-100 bg-slate-950/40 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-3xl max-w-xl w-full p-6 sm:p-8 shadow-2xl relative animate-scaleIn border border-slate-100 max-h-[90vh] overflow-y-auto">
            <button
              onClick={() => setEditingBooking(null)}
              className="absolute right-4 top-4 p-2 text-gray-400 hover:text-rose-500 rounded-full"
            >
              <X className="w-5 h-5" />
            </button>

            <h3 className="font-display text-sm tracking-wide uppercase text-gray-950 mb-4 flex items-center gap-2">
              <Edit className="w-4 h-4 text-brand-blue" />
              <span>Modify Booking Record</span>
            </h3>

            {editError && (
              <div className="mb-4 p-3 bg-red-50 text-red-500 rounded-xl text-xs flex items-center gap-2 border border-red-100">
                <AlertCircle className="w-4.5 h-4.5" />
                <span>{editError}</span>
              </div>
            )}

            <form onSubmit={saveBookingEdit} className="space-y-4 text-xs font-semibold">
              <div className="grid sm:grid-cols-2 gap-4">
                {/* Name */}
                <div className="space-y-1">
                  <label className="text-gray-500 uppercase tracking-wider block">Customer Name</label>
                  <input
                    type="text"
                    value={editName}
                    onChange={(e) => setEditName(e.target.value)}
                    className="w-full px-4 py-3 bg-slate-50 border border-slate-100 rounded-lg focus:outline-none focus:ring-1 focus:ring-brand-blue text-xs text-gray-800"
                  />
                </div>

                {/* Phone */}
                <div className="space-y-1">
                  <label className="text-gray-500 uppercase tracking-wider block">Phone Number</label>
                  <input
                    type="text"
                    value={editPhone}
                    onChange={(e) => setEditPhone(e.target.value)}
                    className="w-full px-4 py-3 bg-slate-50 border border-slate-100 rounded-lg focus:outline-none focus:ring-1 focus:ring-brand-blue text-xs text-gray-800"
                  />
                </div>

                {/* Email */}
                <div className="space-y-1">
                  <label className="text-gray-500 uppercase tracking-wider block">Email Address</label>
                  <input
                    type="email"
                    value={editEmail}
                    onChange={(e) => setEditEmail(e.target.value)}
                    className="w-full px-4 py-3 bg-slate-50 border border-slate-100 rounded-lg focus:outline-none focus:ring-1 focus:ring-brand-blue text-xs text-gray-800"
                  />
                </div>

                {/* Status */}
                <div className="space-y-1">
                  <label className="text-gray-500 uppercase tracking-wider block">Current Status</label>
                  <select
                    value={editStatus}
                    onChange={(e) => setEditStatus(e.target.value as Booking["status"])}
                    className="w-full px-4 py-3 bg-slate-50 border border-slate-100 rounded-lg focus:outline-none focus:ring-1 focus:ring-brand-blue text-xs text-gray-800 font-semibold"
                  >
                    <option value="Pending">Pending Approval</option>
                    <option value="Confirmed">Confirmed Slot</option>
                    <option value="Completed">Completed Job</option>
                    <option value="Cancelled">Cancelled Booking</option>
                  </select>
                </div>

                {/* Property Type */}
                <div className="space-y-1">
                  <label className="text-gray-500 uppercase tracking-wider block">Property Type</label>
                  <select
                    value={editPropertyType}
                    onChange={(e) => setEditPropertyType(e.target.value as "Residential" | "Commercial")}
                    className="w-full px-4 py-3 bg-slate-50 border border-slate-100 rounded-lg focus:outline-none focus:ring-1 focus:ring-brand-blue text-xs text-gray-800 font-semibold"
                  >
                    <option value="Residential">Residential</option>
                    <option value="Commercial">Commercial</option>
                  </select>
                </div>
              </div>

              {/* Address */}
              <div className="space-y-1">
                <label className="text-gray-500 uppercase tracking-wider block">Service Address</label>
                <input
                  type="text"
                  value={editAddress}
                  onChange={(e) => setEditAddress(e.target.value)}
                  className="w-full px-4 py-3 bg-slate-50 border border-slate-100 rounded-lg focus:outline-none focus:ring-1 focus:ring-brand-blue text-xs text-gray-800"
                />
              </div>

              {/* Requested services selection */}
              <div className="space-y-1.5">
                <label className="text-gray-500 uppercase tracking-wider block">Services Requested</label>
                <div className="flex items-center gap-2 flex-wrap">
                  {["Window Washing", "Solar Panel Cleaning", "Gutter Cleaning", "Lawn Care"].map((srv) => {
                    const selected = editServices.includes(srv);
                    return (
                      <button
                        type="button"
                        key={srv}
                        onClick={() => toggleEditService(srv)}
                        className={`px-3 py-2 rounded-lg text-xs font-semibold border transition-all ${
                          selected
                            ? "bg-brand-blue border-brand-blue text-white"
                            : "bg-slate-50 border-slate-100 text-gray-600 hover:bg-slate-100"
                        }`}
                      >
                        {srv}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Scheduling info */}
              <div className="grid sm:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-gray-500 uppercase tracking-wider block">Preferred Date</label>
                  <input
                    type="date"
                    value={editDate}
                    onChange={(e) => setEditDate(e.target.value)}
                    className="w-full px-4 py-3 bg-slate-50 border border-slate-100 rounded-lg focus:outline-none focus:ring-1 focus:ring-brand-blue text-xs text-gray-800"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-gray-500 uppercase tracking-wider block">Preferred Time window</label>
                  <select
                    value={editTime}
                    onChange={(e) => setEditTime(e.target.value)}
                    className="w-full px-4 py-3 bg-slate-50 border border-slate-100 rounded-lg focus:outline-none focus:ring-1 focus:ring-brand-blue text-xs text-gray-800"
                  >
                    <option>Morning (8 AM - 12 PM)</option>
                    <option>Afternoon (12 PM - 4 PM)</option>
                    <option>Evening (4 PM - 8 PM)</option>
                  </select>
                </div>
              </div>

              {/* Additional notes */}
              <div className="space-y-1">
                <label className="text-gray-500 uppercase tracking-wider block">Client Notes</label>
                <textarea
                  value={editNotes}
                  rows={2}
                  onChange={(e) => setEditNotes(e.target.value)}
                  className="w-full px-4 py-3 bg-slate-50 border border-slate-100 rounded-lg focus:outline-none focus:ring-1 focus:ring-brand-blue text-xs text-gray-700 font-medium"
                />
              </div>

              {/* CTA save buttons */}
              <div className="pt-4 border-t border-slate-100 text-right space-x-3">
                <button
                  type="button"
                  onClick={() => setEditingBooking(null)}
                  className="px-5 py-2.5 bg-slate-100 hover:bg-slate-200 text-gray-700 font-bold rounded-full transition-colors cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2.5 bg-brand-blue hover:bg-brand-blue-dark text-white font-bold rounded-full transition-colors cursor-pointer"
                >
                  Save Record
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* 4. MODAL: SAFETY DELETE CONFIRMATION */}
      {bookingToDelete && (
        <div className="fixed inset-0 z-100 bg-slate-950/40 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-sm w-full p-6 shadow-2xl relative border border-slate-100 animate-scaleIn">
            <div className="w-12 h-12 bg-rose-50 text-rose-500 rounded-full flex items-center justify-center mb-4 border border-rose-100 mx-auto">
              <Trash2 className="w-5 h-5" />
            </div>

            <h3 className="font-display text-sm uppercase tracking-wider text-gray-950 text-center mb-2">
              Confirm Delete
            </h3>
            <p className="text-gray-500 text-xs text-center leading-relaxed mb-6">
              Are you sure you want to delete the booking for <strong>{bookingToDelete.name}</strong>? This action is permanent and cannot be undone in Firestore.
            </p>

            <div className="flex items-center gap-3">
              <button
                onClick={() => setBookingToDelete(null)}
                className="flex-1 py-3 bg-slate-100 hover:bg-slate-200 text-gray-700 rounded-full text-xs font-bold transition-all cursor-pointer text-center"
              >
                No, Keep It
              </button>
              <button
                onClick={confirmDeleteBooking}
                className="flex-1 py-3 bg-rose-500 hover:bg-rose-600 text-white rounded-full text-xs font-bold shadow-md shadow-rose-500/10 transition-all cursor-pointer text-center"
              >
                Yes, Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

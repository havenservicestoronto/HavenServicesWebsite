export interface Booking {
  id?: string;
  propertyType?: "Residential" | "Commercial";
  name: string;
  phone: string;
  email: string;
  address: string;
  services: string[]; // e.g. ["Window Washing", "Lawn Care"]
  preferredDate: string; // YYYY-MM-DD
  preferredTime: string; // e.g. "Morning (8 AM - 12 PM)", "Afternoon (12 PM - 4 PM)", "Evening (4 PM - 8 PM)"
  additionalNotes: string;
  status: "Pending" | "Confirmed" | "Completed" | "Cancelled";
  createdAt: number; // millisecond timestamp
}

export interface ServiceItem {
  id: string;
  title: string;
  description: string;
  priceRange: string;
  iconName: string; // for dynamic rendering with Lucide
}

export interface CoOwner {
  name: string;
  title: string;
  bio: string;
  email: string;
  phone: string;
  imgPlaceholder: string; // SVG or color string
}

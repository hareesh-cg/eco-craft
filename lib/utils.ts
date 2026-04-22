import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatPrice(price: number): string {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(price);
}

export function formatDate(date: string): string {
  return new Intl.DateTimeFormat("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
  }).format(new Date(date));
}

export function slugify(text: string): string {
  return text.toLowerCase().replace(/\s+/g, "-").replace(/[^\w-]+/g, "");
}

export const categoryLabels: Record<string, string> = {
  home_decor: "Home Decor",
  jewelry: "Jewelry",
  accessories: "Accessories",
  plastic_bottles: "Plastic Bottles",
  wrappers: "Wrappers",
  hard_plastic: "Hard Plastic",
  mixed: "Mixed",
  crafting: "Crafting",
  collection: "Collection",
  design: "Design",
  delivery: "Delivery",
  full_time: "Full Time",
  part_time: "Part Time",
  contract: "Contract",
};

export const categoryColors: Record<string, string> = {
  home_decor: "bg-eco-100 text-eco-700",
  jewelry: "bg-purple-100 text-purple-700",
  accessories: "bg-amber-100 text-amber-700",
  plastic_bottles: "bg-blue-100 text-blue-700",
  wrappers: "bg-pink-100 text-pink-700",
  hard_plastic: "bg-gray-100 text-gray-700",
  mixed: "bg-orange-100 text-orange-700",
  crafting: "bg-eco-100 text-eco-700",
  collection: "bg-blue-100 text-blue-700",
  design: "bg-purple-100 text-purple-700",
  delivery: "bg-amber-100 text-amber-700",
};

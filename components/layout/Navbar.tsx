"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { Leaf, ShoppingCart, Menu, X, User, LogOut, ChevronDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { createClient } from "@/lib/supabase/client";
import type { Profile } from "@/types";

const navLinks = [
  { href: "/shop", label: "Shop" },
  { href: "/waste", label: "Sell Waste" },
  { href: "/jobs", label: "Jobs" },
  { href: "/innovation", label: "Innovation" },
  { href: "/about", label: "About" },
  { href: "/contact", label: "Contact" },
];

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const [cartCount, setCartCount] = useState(0);
  const [user, setUser] = useState<Profile | null>(null);
  const [scrolled, setScrolled] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const pathname = usePathname();
  const router = useRouter();
  const supabase = createClient();

  useEffect(() => {
    const cart = JSON.parse(localStorage.getItem("eco_cart") || "[]");
    setCartCount(cart.reduce((sum: number, item: { quantity: number }) => sum + item.quantity, 0));

    const getUser = async () => {
      const { data: { user: authUser } } = await supabase.auth.getUser();
      if (authUser) {
        const { data } = await supabase.from("profiles").select("*").eq("id", authUser.id).single();
        setUser(data);
      }
    };
    getUser();

    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll);

    const handleCartUpdate = () => {
      const cart = JSON.parse(localStorage.getItem("eco_cart") || "[]");
      setCartCount(cart.reduce((sum: number, item: { quantity: number }) => sum + item.quantity, 0));
    };
    window.addEventListener("cart-updated", handleCartUpdate);

    return () => {
      window.removeEventListener("scroll", handleScroll);
      window.removeEventListener("cart-updated", handleCartUpdate);
    };
  }, []);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    setUser(null);
    setProfileOpen(false);
    router.push("/");
    router.refresh();
  };

  const isHome = pathname === "/";

  return (
    <nav className={cn(
      "fixed top-0 left-0 right-0 z-50 transition-all duration-300",
      scrolled || !isHome
        ? "bg-white/95 backdrop-blur-md shadow-sm border-b border-eco-100"
        : "bg-transparent"
    )}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 group">
            <div className="w-8 h-8 bg-eco-600 rounded-lg flex items-center justify-center group-hover:bg-eco-700 transition-colors">
              <Leaf className="w-5 h-5 text-white" />
            </div>
            <span className={cn(
              "text-xl font-bold transition-colors",
              scrolled || !isHome ? "text-eco-800" : "text-white drop-shadow"
            )}>
              EcoCraft
            </span>
          </Link>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center gap-1">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={cn(
                  "px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200",
                  pathname === link.href
                    ? "bg-eco-100 text-eco-700"
                    : scrolled || !isHome
                      ? "text-gray-600 hover:text-eco-700 hover:bg-eco-50"
                      : "text-white/90 hover:text-white hover:bg-white/10"
                )}
              >
                {link.label}
              </Link>
            ))}
          </div>

          {/* Right side */}
          <div className="hidden md:flex items-center gap-2">
            <Link href="/cart" className="relative p-2 rounded-lg hover:bg-eco-50 transition-colors">
              <ShoppingCart className={cn("w-5 h-5", scrolled || !isHome ? "text-gray-600" : "text-white")} />
              {cartCount > 0 && (
                <span className="absolute -top-1 -right-1 w-5 h-5 bg-amber-500 text-white text-xs rounded-full flex items-center justify-center font-semibold">
                  {cartCount}
                </span>
              )}
            </Link>

            {user ? (
              <div className="relative">
                <button
                  onClick={() => setProfileOpen(!profileOpen)}
                  className="flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-eco-50 transition-colors"
                >
                  <div className="w-7 h-7 bg-eco-600 rounded-full flex items-center justify-center text-white text-xs font-bold">
                    {user.full_name?.[0]?.toUpperCase() || "U"}
                  </div>
                  <span className={cn("text-sm font-medium", scrolled || !isHome ? "text-gray-700" : "text-white")}>
                    {user.full_name?.split(" ")[0]}
                  </span>
                  <ChevronDown className={cn("w-4 h-4", scrolled || !isHome ? "text-gray-500" : "text-white/70")} />
                </button>
                {profileOpen && (
                  <div className="absolute right-0 mt-2 w-48 bg-white rounded-xl shadow-lg border border-eco-100 py-1 z-50">
                    <Link href="/dashboard" className="flex items-center gap-2 px-4 py-2 text-sm text-gray-700 hover:bg-eco-50" onClick={() => setProfileOpen(false)}>
                      <User className="w-4 h-4" /> Dashboard
                    </Link>
                    {user.role === "admin" && (
                      <Link href="/admin" className="flex items-center gap-2 px-4 py-2 text-sm text-gray-700 hover:bg-eco-50" onClick={() => setProfileOpen(false)}>
                        <User className="w-4 h-4" /> Admin Panel
                      </Link>
                    )}
                    <hr className="my-1 border-eco-100" />
                    <button onClick={handleLogout} className="flex items-center gap-2 px-4 py-2 text-sm text-red-600 hover:bg-red-50 w-full">
                      <LogOut className="w-4 h-4" /> Logout
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <Link href="/auth/login">
                  <Button variant="ghost" size="sm" className={cn(scrolled || !isHome ? "" : "text-white hover:bg-white/10")}>
                    Login
                  </Button>
                </Link>
                <Link href="/auth/signup">
                  <Button size="sm">Sign Up</Button>
                </Link>
              </div>
            )}
          </div>

          {/* Mobile menu button */}
          <button className="md:hidden p-2" onClick={() => setOpen(!open)}>
            {open
              ? <X className={cn("w-6 h-6", scrolled || !isHome ? "text-gray-700" : "text-white")} />
              : <Menu className={cn("w-6 h-6", scrolled || !isHome ? "text-gray-700" : "text-white")} />
            }
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {open && (
        <div className="md:hidden bg-white border-t border-eco-100 shadow-lg">
          <div className="px-4 py-3 space-y-1">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setOpen(false)}
                className={cn(
                  "block px-3 py-2 rounded-lg text-sm font-medium",
                  pathname === link.href ? "bg-eco-100 text-eco-700" : "text-gray-600 hover:bg-eco-50"
                )}
              >
                {link.label}
              </Link>
            ))}
            <hr className="border-eco-100 my-2" />
            <Link href="/cart" onClick={() => setOpen(false)} className="flex items-center gap-2 px-3 py-2 text-sm text-gray-600 hover:bg-eco-50 rounded-lg">
              <ShoppingCart className="w-4 h-4" /> Cart {cartCount > 0 && `(${cartCount})`}
            </Link>
            {user ? (
              <>
                <Link href="/dashboard" onClick={() => setOpen(false)} className="block px-3 py-2 text-sm text-gray-600 hover:bg-eco-50 rounded-lg">Dashboard</Link>
                <button onClick={handleLogout} className="w-full text-left px-3 py-2 text-sm text-red-600 hover:bg-red-50 rounded-lg">Logout</button>
              </>
            ) : (
              <div className="flex gap-2 pt-2">
                <Link href="/auth/login" className="flex-1" onClick={() => setOpen(false)}>
                  <Button variant="outline" size="sm" className="w-full">Login</Button>
                </Link>
                <Link href="/auth/signup" className="flex-1" onClick={() => setOpen(false)}>
                  <Button size="sm" className="w-full">Sign Up</Button>
                </Link>
              </div>
            )}
          </div>
        </div>
      )}
    </nav>
  );
}

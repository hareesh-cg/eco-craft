"use client";
import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import {
  ArrowRight, Leaf, Recycle, Briefcase, Lightbulb,
  ShoppingBag, Upload, Star, ChevronRight, Users, Package, Zap
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

// --- Animated counter hook ---
function useCounter(target: number, duration = 2000) {
  const [count, setCount] = useState(0);
  const ref = useRef<HTMLDivElement>(null);
  const started = useRef(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !started.current) {
          started.current = true;
          let start = 0;
          const step = target / (duration / 16);
          const timer = setInterval(() => {
            start += step;
            if (start >= target) { setCount(target); clearInterval(timer); }
            else setCount(Math.floor(start));
          }, 16);
        }
      },
      { threshold: 0.5 }
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, [target, duration]);

  return { count, ref };
}

// --- Data ---
const stats = [
  { label: "Products Listed", value: 240, suffix: "+", icon: Package, color: "text-eco-600" },
  { label: "Waste Collected", value: 5800, suffix: " kg", icon: Recycle, color: "text-amber-600" },
  { label: "Jobs Created", value: 180, suffix: "+", icon: Briefcase, color: "text-blue-600" },
  { label: "Innovations Shared", value: 95, suffix: "+", icon: Lightbulb, color: "text-purple-600" },
];

const featuredProducts = [
  {
    id: "1", name: "Woven Bottle Vase", category: "Home Decor", price: 649,
    image: "https://images.unsplash.com/photo-1602143407151-7111542de6e8?w=400&q=80",
    badge: "Bestseller",
  },
  {
    id: "2", name: "Recycled Bead Necklace", category: "Jewelry", price: 349,
    image: "https://images.unsplash.com/photo-1611085583191-a3b181a88401?w=400&q=80",
    badge: "New",
  },
  {
    id: "3", name: "Plastic Strip Basket", category: "Accessories", price: 499,
    image: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400&q=80",
    badge: null,
  },
  {
    id: "4", name: "Bottle Cap Mirror Frame", category: "Home Decor", price: 899,
    image: "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=400&q=80",
    badge: "Trending",
  },
];

const steps = [
  {
    step: "01", icon: Upload, title: "Upload Your Waste",
    desc: "Sellers upload plastic waste — bottles, wrappers, hard plastic — with photos, quantity, and price.",
    color: "bg-amber-500",
  },
  {
    step: "02", icon: Users, title: "Get Connected & Paid",
    desc: "Buyers and recyclers discover your listing, contact you directly, and pay for the waste.",
    color: "bg-eco-600",
  },
  {
    step: "03", icon: Zap, title: "Products Are Crafted",
    desc: "Artisans transform collected waste into stunning eco-friendly decor, jewelry, and accessories.",
    color: "bg-purple-600",
  },
];

const jobCategories = [
  { icon: "✂️", label: "Crafting", count: "42 jobs" },
  { icon: "🚛", label: "Collection", count: "28 jobs" },
  { icon: "🎨", label: "Design", count: "19 jobs" },
  { icon: "📦", label: "Delivery", count: "35 jobs" },
];

const innovations = [
  {
    title: "Solar Bottle Lantern",
    desc: "Repurposed plastic bottles as solar-powered garden lights.",
    tags: ["Lighting", "Solar", "Garden"],
    image: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400&q=80",
  },
  {
    title: "Plastic Brick Housing",
    desc: "Compressed plastic waste bricks used for affordable housing construction.",
    tags: ["Construction", "Housing", "Innovation"],
    image: "https://images.unsplash.com/photo-1504307651254-35680f356dfd?w=400&q=80",
  },
  {
    title: "Wrapper Art Panels",
    desc: "Colorful mosaic wall panels made entirely from flattened wrappers.",
    tags: ["Art", "Interior", "Decor"],
    image: "https://images.unsplash.com/photo-1513519245088-0e12902e5a38?w=400&q=80",
  },
];

const testimonials = [
  {
    name: "Priya Sharma", role: "Seller, Mumbai",
    text: "I used to throw away kilos of plastic every month. Now I earn ₹3,000 extra just by listing my waste. EcoCraft changed my life!",
    avatar: "P", color: "bg-eco-600",
  },
  {
    name: "Rajan Mehta", role: "Buyer, Bengaluru",
    text: "The products are absolutely gorgeous. My living room now has three EcoCraft pieces and every guest asks where I got them.",
    avatar: "R", color: "bg-amber-500",
  },
  {
    name: "Sunita Bai", role: "Job Seeker, aged 47",
    text: "I found a part-time crafting job through EcoCraft at 47. It gave me income, purpose, and a community I now call family.",
    avatar: "S", color: "bg-purple-600",
  },
];

// --- Stat Counter Card ---
function StatCard({ label, value, suffix, icon: Icon, color }: typeof stats[0]) {
  const { count, ref } = useCounter(value);
  return (
    <div ref={ref} className="text-center">
      <div className={`text-4xl font-bold ${color} mb-1`}>
        {count.toLocaleString()}{suffix}
      </div>
      <div className="flex items-center justify-center gap-1.5 text-gray-500 text-sm">
        <Icon className="w-4 h-4" />
        {label}
      </div>
    </div>
  );
}

export default function HomePage() {
  return (
    <div className="overflow-x-hidden">
      {/* ── Hero ── */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 eco-gradient" />
        <div className="absolute inset-0 opacity-20"
          style={{ backgroundImage: "url('https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?w=1920&q=80')", backgroundSize: "cover", backgroundPosition: "center" }}
        />
        <div className="absolute inset-0 bg-gradient-to-b from-eco-900/40 via-transparent to-eco-900/60" />

        <div className="relative z-10 text-center text-white px-4 max-w-5xl mx-auto">
          <Badge className="mb-6 bg-white/20 text-white border-white/30 text-sm px-4 py-1">
            🌱 India&apos;s Plastic Upcycling Platform
          </Badge>
          <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold leading-tight mb-6 drop-shadow-lg">
            Turning Plastic Waste<br />
            <span className="text-amber-300">into Beautiful Futures</span>
          </h1>
          <p className="text-xl sm:text-2xl text-white/85 mb-10 max-w-2xl mx-auto leading-relaxed">
            Buy stunning upcycled decor, sell your plastic waste, find green jobs,
            and showcase your recycling innovations — all in one place.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/shop">
              <Button size="xl" variant="amber" className="gap-2 shadow-xl">
                <ShoppingBag className="w-5 h-5" /> Shop Products
              </Button>
            </Link>
            <Link href="/waste">
              <Button size="xl" variant="outline" className="gap-2 border-white text-white hover:bg-white/10">
                <Recycle className="w-5 h-5" /> Sell Your Waste
              </Button>
            </Link>
          </div>

          <div className="absolute bottom-10 left-1/2 -translate-x-1/2 animate-bounce">
            <ChevronRight className="w-6 h-6 text-white/60 rotate-90" />
          </div>
        </div>
      </section>

      {/* ── Stats ── */}
      <section className="py-16 bg-white border-b border-eco-100">
        <div className="max-w-5xl mx-auto px-4 grid grid-cols-2 md:grid-cols-4 gap-8">
          {stats.map((s) => <StatCard key={s.label} {...s} />)}
        </div>
      </section>

      {/* ── Featured Products ── */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <Badge variant="secondary" className="mb-3">Featured Products</Badge>
            <h2 className="text-4xl font-bold text-eco-900 mb-3">Crafted from Waste, Made with Love</h2>
            <p className="text-gray-500 max-w-xl mx-auto">Each product is handcrafted by local artisans using reclaimed plastic. Beautiful. Sustainable. Unique.</p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
            {featuredProducts.map((p) => (
              <Link key={p.id} href={`/shop/${p.id}`}>
                <Card className="overflow-hidden card-hover cursor-pointer">
                  <div className="relative h-52">
                    <Image src={p.image} alt={p.name} fill className="object-cover" />
                    {p.badge && (
                      <span className="absolute top-3 left-3 bg-amber-500 text-white text-xs font-semibold px-2 py-0.5 rounded-full">
                        {p.badge}
                      </span>
                    )}
                  </div>
                  <CardContent className="p-4">
                    <Badge variant="secondary" className="mb-2 text-xs">{p.category}</Badge>
                    <h3 className="font-semibold text-eco-900 mb-1">{p.name}</h3>
                    <div className="flex items-center justify-between">
                      <span className="text-lg font-bold text-eco-600">₹{p.price}</span>
                      <Button size="sm" variant="secondary">Add to Cart</Button>
                    </div>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
          <div className="text-center">
            <Link href="/shop">
              <Button size="lg" variant="outline" className="gap-2">
                View All Products <ArrowRight className="w-4 h-4" />
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* ── How It Works ── */}
      <section className="py-20 bg-white">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-14">
            <Badge variant="secondary" className="mb-3">How It Works</Badge>
            <h2 className="text-4xl font-bold text-eco-900 mb-3">Three Simple Steps</h2>
            <p className="text-gray-500 max-w-lg mx-auto">From waste in your hands to art on someone&apos;s wall — the EcoCraft journey.</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {steps.map((s, i) => (
              <div key={s.step} className="relative text-center group">
                {i < steps.length - 1 && (
                  <div className="hidden md:block absolute top-12 left-[60%] w-full h-0.5 bg-gradient-to-r from-eco-200 to-transparent z-0" />
                )}
                <div className={`relative z-10 w-24 h-24 ${s.color} rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-lg group-hover:scale-105 transition-transform`}>
                  <s.icon className="w-10 h-10 text-white" />
                  <span className="absolute -top-2 -right-2 w-7 h-7 bg-white border-2 border-gray-200 rounded-full text-xs font-bold text-gray-600 flex items-center justify-center">
                    {s.step}
                  </span>
                </div>
                <h3 className="text-xl font-bold text-eco-900 mb-3">{s.title}</h3>
                <p className="text-gray-500 leading-relaxed text-sm">{s.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Jobs Teaser ── */}
      <section className="py-20 eco-gradient-light">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <Badge variant="secondary" className="mb-3">Job Opportunities</Badge>
              <h2 className="text-4xl font-bold text-eco-900 mb-4">Green Jobs for Everyone</h2>
              <p className="text-gray-600 mb-8 leading-relaxed">
                We believe sustainability creates livelihoods. Whether you&apos;re a student, a homemaker,
                or someone between jobs aged 40–55 — there&apos;s a role for you in the green economy.
              </p>
              <Link href="/jobs">
                <Button size="lg" className="gap-2">
                  <Briefcase className="w-5 h-5" /> Explore Jobs <ArrowRight className="w-4 h-4" />
                </Button>
              </Link>
            </div>
            <div className="grid grid-cols-2 gap-4">
              {jobCategories.map((c) => (
                <Link key={c.label} href="/jobs">
                  <Card className="p-5 card-hover cursor-pointer hover:border-eco-300">
                    <div className="text-3xl mb-3">{c.icon}</div>
                    <div className="font-semibold text-eco-900">{c.label}</div>
                    <div className="text-sm text-eco-600 font-medium">{c.count}</div>
                  </Card>
                </Link>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── Innovation Spotlight ── */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <Badge variant="secondary" className="mb-3">Innovation Spotlight</Badge>
            <h2 className="text-4xl font-bold text-eco-900 mb-3">Brilliant Ideas from the Community</h2>
            <p className="text-gray-500 max-w-lg mx-auto">See what happens when creative minds meet plastic waste. These innovations prove recycling is art.</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
            {innovations.map((inn) => (
              <Card key={inn.title} className="overflow-hidden card-hover">
                <div className="relative h-48">
                  <Image src={inn.image} alt={inn.title} fill className="object-cover" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                  <div className="absolute bottom-3 left-3 right-3">
                    <div className="flex gap-1 flex-wrap">
                      {inn.tags.map((tag) => (
                        <span key={tag} className="text-xs bg-white/20 text-white backdrop-blur-sm px-2 py-0.5 rounded-full">
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
                <CardContent className="p-4">
                  <h3 className="font-bold text-eco-900 mb-1">{inn.title}</h3>
                  <p className="text-sm text-gray-500">{inn.desc}</p>
                </CardContent>
              </Card>
            ))}
          </div>
          <div className="text-center">
            <Link href="/innovation">
              <Button size="lg" variant="outline" className="gap-2">
                View All Innovations <ArrowRight className="w-4 h-4" />
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* ── Testimonials ── */}
      <section className="py-20 bg-white">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <Badge variant="secondary" className="mb-3">Testimonials</Badge>
            <h2 className="text-4xl font-bold text-eco-900 mb-3">What Our Community Says</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {testimonials.map((t) => (
              <Card key={t.name} className="p-6 card-hover">
                <div className="flex gap-1 mb-4">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 text-amber-400 fill-amber-400" />
                  ))}
                </div>
                <p className="text-gray-600 text-sm leading-relaxed mb-6 italic">&ldquo;{t.text}&rdquo;</p>
                <div className="flex items-center gap-3">
                  <div className={`w-10 h-10 ${t.color} rounded-full flex items-center justify-center text-white font-bold`}>
                    {t.avatar}
                  </div>
                  <div>
                    <div className="font-semibold text-eco-900 text-sm">{t.name}</div>
                    <div className="text-xs text-gray-500">{t.role}</div>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA Banner ── */}
      <section className="py-20 eco-gradient text-white">
        <div className="max-w-3xl mx-auto text-center px-4">
          <Leaf className="w-14 h-14 mx-auto mb-6 text-eco-200" />
          <h2 className="text-4xl sm:text-5xl font-bold mb-4">Join EcoCraft Today</h2>
          <p className="text-eco-100 text-xl mb-10">
            Be part of India&apos;s growing circular economy. Sell waste, buy beautiful, get hired, or share your innovation.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/auth/signup">
              <Button size="xl" variant="amber" className="gap-2 shadow-xl">
                Get Started Free <ArrowRight className="w-5 h-5" />
              </Button>
            </Link>
            <Link href="/about">
              <Button size="xl" variant="outline" className="border-white text-white hover:bg-white/10">
                Learn Our Mission
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}

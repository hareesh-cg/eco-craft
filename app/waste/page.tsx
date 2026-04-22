"use client";
import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { MapPin, Weight, Phone, Search, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { createClient } from "@/lib/supabase/client";
import { formatPrice, categoryLabels, categoryColors } from "@/lib/utils";
import type { WasteListing } from "@/types";

const wasteTypes = ["all", "plastic_bottles", "wrappers", "hard_plastic", "mixed"];

export default function WastePage() {
  const [listings, setListings] = useState<WasteListing[]>([]);
  const [filtered, setFiltered] = useState<WasteListing[]>([]);
  const [search, setSearch] = useState("");
  const [activeType, setActiveType] = useState("all");
  const [loading, setLoading] = useState(true);
  const [contactModal, setContactModal] = useState<WasteListing | null>(null);

  useEffect(() => {
    createClient().from("waste_listings").select("*, seller:profiles(full_name, email)").eq("status", "active").order("created_at", { ascending: false })
      .then(({ data }) => { setListings(data || []); setFiltered(data || []); setLoading(false); });
  }, []);

  useEffect(() => {
    let result = listings;
    if (activeType !== "all") result = result.filter((w) => w.waste_type === activeType);
    if (search) result = result.filter((w) => w.title.toLowerCase().includes(search.toLowerCase()) || w.location.toLowerCase().includes(search.toLowerCase()));
    setFiltered(result);
  }, [search, activeType, listings]);

  return (
    <div className="min-h-screen bg-gray-50 pt-20 pb-12">
      <div className="eco-gradient py-12 px-4">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4 text-white">
          <div>
            <h1 className="text-4xl font-bold mb-1">Waste Marketplace</h1>
            <p className="text-eco-100">Buy or sell plastic waste — give it a second life</p>
          </div>
          <Link href="/waste/sell">
            <Button size="lg" variant="amber" className="gap-2">
              <Plus className="w-5 h-5" /> List My Waste
            </Button>
          </Link>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col sm:flex-row gap-4 mb-8">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <Input placeholder="Search by title or location…" className="pl-10 bg-white"
              value={search} onChange={(e) => setSearch(e.target.value)} />
          </div>
          <div className="flex gap-2 flex-wrap">
            {wasteTypes.map((t) => (
              <button key={t} onClick={() => setActiveType(t)}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${activeType === t ? "bg-eco-600 text-white shadow-sm" : "bg-white text-gray-600 border hover:border-eco-300"}`}>
                {t === "all" ? "All Types" : categoryLabels[t]}
              </button>
            ))}
          </div>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(6)].map((_, i) => <div key={i} className="bg-white rounded-2xl h-72 animate-pulse" />)}
          </div>
        ) : filtered.length === 0 ? (
          <div className="text-center py-20 text-gray-400">No waste listings found.</div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filtered.map((w) => (
              <Card key={w.id} className="overflow-hidden card-hover">
                <div className="relative h-48">
                  <Image src={w.image_url || "https://images.unsplash.com/photo-1604187351574-c75ca79f5807?w=400&q=80"}
                    alt={w.title} fill className="object-cover" />
                  <div className={`absolute top-3 left-3 text-xs font-semibold px-2 py-1 rounded-full ${categoryColors[w.waste_type]}`}>
                    {categoryLabels[w.waste_type]}
                  </div>
                </div>
                <CardContent className="p-4">
                  <h3 className="font-bold text-eco-900 mb-1">{w.title}</h3>
                  <p className="text-xs text-gray-500 mb-3 line-clamp-2">{w.description}</p>
                  <div className="flex items-center gap-3 text-sm text-gray-600 mb-3">
                    <span className="flex items-center gap-1"><Weight className="w-3.5 h-3.5" />{w.quantity} {w.unit}</span>
                    <span className="flex items-center gap-1"><MapPin className="w-3.5 h-3.5" />{w.location}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    {w.price_per_unit ? (
                      <span className="font-bold text-eco-600">{formatPrice(w.price_per_unit)}/{w.unit}</span>
                    ) : (
                      <span className="text-gray-400 text-sm">Price negotiable</span>
                    )}
                    <Button size="sm" variant="outline" className="gap-1" onClick={() => setContactModal(w)}>
                      <Phone className="w-3.5 h-3.5" /> Contact
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>

      {/* Contact Modal */}
      {contactModal && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4" onClick={() => setContactModal(null)}>
          <div className="bg-white rounded-2xl p-6 max-w-sm w-full shadow-xl" onClick={(e) => e.stopPropagation()}>
            <h3 className="text-lg font-bold text-eco-900 mb-2">Contact Seller</h3>
            <p className="text-sm text-gray-500 mb-4">For: <strong>{contactModal.title}</strong></p>
            <div className="space-y-3 bg-eco-50 rounded-xl p-4">
              <div className="flex items-center gap-2 text-sm">
                <span className="font-medium text-eco-800">Seller:</span>
                <span>{(contactModal.seller as { full_name: string })?.full_name || "EcoCraft Seller"}</span>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <span className="font-medium text-eco-800">Email:</span>
                <span>{(contactModal.seller as { email: string })?.email || "seller@ecocraft.in"}</span>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <span className="font-medium text-eco-800">Phone:</span>
                <span>+91 98765 43210</span>
              </div>
            </div>
            <Button className="w-full mt-4" onClick={() => setContactModal(null)}>Close</Button>
          </div>
        </div>
      )}
    </div>
  );
}

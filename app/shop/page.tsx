"use client";
import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Search, ShoppingCart, Filter } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { createClient } from "@/lib/supabase/client";
import { formatPrice, categoryLabels, categoryColors } from "@/lib/utils";
import { toast } from "sonner";
import type { Product, CartItem } from "@/types";

const categories = ["all", "home_decor", "jewelry", "accessories"];

export default function ShopPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [filtered, setFiltered] = useState<Product[]>([]);
  const [search, setSearch] = useState("");
  const [activeCategory, setActiveCategory] = useState("all");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    createClient().from("products").select("*").eq("status", "active").order("created_at", { ascending: false })
      .then(({ data }) => { setProducts(data || []); setFiltered(data || []); setLoading(false); });
  }, []);

  useEffect(() => {
    let result = products;
    if (activeCategory !== "all") result = result.filter((p) => p.category === activeCategory);
    if (search) result = result.filter((p) => p.name.toLowerCase().includes(search.toLowerCase()));
    setFiltered(result);
  }, [search, activeCategory, products]);

  function addToCart(product: Product) {
    const cart: CartItem[] = JSON.parse(localStorage.getItem("eco_cart") || "[]");
    const existing = cart.find((i) => i.id === product.id);
    if (existing) existing.quantity += 1;
    else cart.push({ id: product.id, name: product.name, price: product.price, image_url: product.image_url, quantity: 1, category: product.category });
    localStorage.setItem("eco_cart", JSON.stringify(cart));
    window.dispatchEvent(new Event("cart-updated"));
    toast.success(`${product.name} added to cart!`);
  }

  return (
    <div className="min-h-screen bg-gray-50 pt-20 pb-12">
      {/* Header */}
      <div className="eco-gradient py-12 px-4">
        <div className="max-w-7xl mx-auto text-center text-white">
          <h1 className="text-4xl font-bold mb-2">Eco-Friendly Shop</h1>
          <p className="text-eco-100">Handcrafted products made entirely from upcycled plastic waste</p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Search + Filter */}
        <div className="flex flex-col sm:flex-row gap-4 mb-8">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <Input placeholder="Search products…" className="pl-10 bg-white"
              value={search} onChange={(e) => setSearch(e.target.value)} />
          </div>
          <div className="flex gap-2 flex-wrap">
            {categories.map((c) => (
              <button key={c}
                onClick={() => setActiveCategory(c)}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${activeCategory === c ? "bg-eco-600 text-white shadow-sm" : "bg-white text-gray-600 border hover:border-eco-300"}`}>
                {c === "all" ? "All Products" : categoryLabels[c]}
              </button>
            ))}
          </div>
        </div>

        {/* Results count */}
        <div className="flex items-center gap-2 mb-6 text-sm text-gray-500">
          <Filter className="w-4 h-4" />
          {loading ? "Loading…" : `${filtered.length} product${filtered.length !== 1 ? "s" : ""} found`}
        </div>

        {/* Grid */}
        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[...Array(8)].map((_, i) => (
              <div key={i} className="bg-white rounded-2xl h-72 animate-pulse" />
            ))}
          </div>
        ) : filtered.length === 0 ? (
          <div className="text-center py-20">
            <p className="text-gray-400 text-lg">No products found.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {filtered.map((product) => (
              <Card key={product.id} className="overflow-hidden card-hover group">
                <Link href={`/shop/${product.id}`}>
                  <div className="relative h-52 overflow-hidden">
                    <Image src={product.image_url || "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400&q=80"}
                      alt={product.name} fill className="object-cover group-hover:scale-105 transition-transform duration-300" />
                    <div className={`absolute top-3 left-3 text-xs font-semibold px-2 py-1 rounded-full ${categoryColors[product.category]}`}>
                      {categoryLabels[product.category]}
                    </div>
                  </div>
                </Link>
                <CardContent className="p-4">
                  <Link href={`/shop/${product.id}`}>
                    <h3 className="font-semibold text-eco-900 mb-1 hover:text-eco-600 transition-colors">{product.name}</h3>
                  </Link>
                  <p className="text-xs text-gray-500 mb-3 line-clamp-2">{product.description}</p>
                  <div className="flex items-center justify-between">
                    <span className="text-lg font-bold text-eco-600">{formatPrice(product.price)}</span>
                    <Button size="sm" onClick={() => addToCart(product)} className="gap-1">
                      <ShoppingCart className="w-3.5 h-3.5" /> Add
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

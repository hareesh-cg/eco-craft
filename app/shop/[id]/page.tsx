"use client";
import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useParams } from "next/navigation";
import { ArrowLeft, ShoppingCart, Plus, Minus, Star, Package } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { createClient } from "@/lib/supabase/client";
import { formatPrice, categoryLabels, categoryColors } from "@/lib/utils";
import { toast } from "sonner";
import type { Product, CartItem } from "@/types";

export default function ProductDetailPage() {
  const { id } = useParams();
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [qty, setQty] = useState(1);

  useEffect(() => {
    createClient().from("products").select("*, seller:profiles(full_name, email)").eq("id", id).single()
      .then(({ data }) => { setProduct(data); setLoading(false); });
  }, [id]);

  function addToCart() {
    if (!product) return;
    const cart: CartItem[] = JSON.parse(localStorage.getItem("eco_cart") || "[]");
    const existing = cart.find((i) => i.id === product.id);
    if (existing) existing.quantity += qty;
    else cart.push({ id: product.id, name: product.name, price: product.price, image_url: product.image_url, quantity: qty, category: product.category });
    localStorage.setItem("eco_cart", JSON.stringify(cart));
    window.dispatchEvent(new Event("cart-updated"));
    toast.success(`${qty}× ${product.name} added to cart!`);
  }

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center pt-16">
      <div className="w-8 h-8 border-4 border-eco-600 border-t-transparent rounded-full animate-spin" />
    </div>
  );

  if (!product) return (
    <div className="min-h-screen flex items-center justify-center pt-16 text-gray-500">Product not found.</div>
  );

  return (
    <div className="min-h-screen bg-gray-50 pt-20 pb-12">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Link href="/shop" className="inline-flex items-center gap-1.5 text-eco-600 hover:text-eco-700 text-sm font-medium mb-6">
          <ArrowLeft className="w-4 h-4" /> Back to Shop
        </Link>

        <div className="grid lg:grid-cols-2 gap-10">
          {/* Image */}
          <div className="relative aspect-square rounded-2xl overflow-hidden shadow-lg">
            <Image src={product.image_url || "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800&q=80"}
              alt={product.name} fill className="object-cover" />
          </div>

          {/* Details */}
          <div className="flex flex-col justify-center space-y-6">
            <div>
              <div className={`inline-flex text-xs font-semibold px-3 py-1 rounded-full mb-3 ${categoryColors[product.category]}`}>
                {categoryLabels[product.category]}
              </div>
              <h1 className="text-3xl font-bold text-eco-900 mb-2">{product.name}</h1>
              <div className="flex items-center gap-1 mb-4">
                {[...Array(5)].map((_, i) => <Star key={i} className="w-4 h-4 text-amber-400 fill-amber-400" />)}
                <span className="text-sm text-gray-500 ml-1">(48 reviews)</span>
              </div>
              <p className="text-gray-600 leading-relaxed">{product.description}</p>
            </div>

            <div className="flex items-baseline gap-3">
              <span className="text-4xl font-bold text-eco-600">{formatPrice(product.price)}</span>
              <span className="text-sm text-gray-500 line-through">{formatPrice(product.price * 1.3)}</span>
              <Badge variant="secondary">23% off</Badge>
            </div>

            {product.seller && (
              <Card className="p-4 flex items-center gap-3">
                <div className="w-10 h-10 bg-eco-600 rounded-full flex items-center justify-center text-white font-bold">
                  {(product.seller as { full_name: string }).full_name?.[0]?.toUpperCase()}
                </div>
                <div>
                  <div className="text-xs text-gray-500">Sold by</div>
                  <div className="font-semibold text-eco-900">{(product.seller as { full_name: string }).full_name}</div>
                </div>
              </Card>
            )}

            {/* Quantity */}
            <div className="flex items-center gap-4">
              <span className="text-sm font-medium text-gray-700">Quantity:</span>
              <div className="flex items-center border rounded-lg overflow-hidden">
                <button onClick={() => setQty(Math.max(1, qty - 1))}
                  className="p-2 hover:bg-gray-100 transition-colors"><Minus className="w-4 h-4" /></button>
                <span className="px-4 py-2 font-semibold">{qty}</span>
                <button onClick={() => setQty(Math.min(product.stock, qty + 1))}
                  className="p-2 hover:bg-gray-100 transition-colors"><Plus className="w-4 h-4" /></button>
              </div>
              <span className="text-xs text-gray-500">{product.stock} in stock</span>
            </div>

            <div className="flex gap-3">
              <Button size="lg" className="flex-1 gap-2" onClick={addToCart}>
                <ShoppingCart className="w-5 h-5" /> Add to Cart
              </Button>
              <Button size="lg" variant="outline" className="flex-1">Buy Now</Button>
            </div>

            <div className="grid grid-cols-3 gap-3 pt-2">
              {[
                { icon: "♻️", label: "100% Upcycled" },
                { icon: "🤝", label: "Artisan Made" },
                { icon: "🚚", label: "Free Delivery ₹999+" },
              ].map((f) => (
                <div key={f.label} className="text-center p-3 bg-eco-50 rounded-xl">
                  <div className="text-xl mb-1">{f.icon}</div>
                  <div className="text-xs font-medium text-eco-700">{f.label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

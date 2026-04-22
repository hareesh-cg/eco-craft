"use client";
import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { ShoppingCart, Plus, Minus, Trash2, ArrowLeft, CheckCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { formatPrice } from "@/lib/utils";
import { toast } from "sonner";
import type { CartItem } from "@/types";

export default function CartPage() {
  const [cart, setCart] = useState<CartItem[]>([]);
  const [ordered, setOrdered] = useState(false);

  useEffect(() => {
    setCart(JSON.parse(localStorage.getItem("eco_cart") || "[]"));
  }, []);

  function save(updated: CartItem[]) {
    setCart(updated);
    localStorage.setItem("eco_cart", JSON.stringify(updated));
    window.dispatchEvent(new Event("cart-updated"));
  }

  function updateQty(id: string, delta: number) {
    const updated = cart.map((i) => i.id === id ? { ...i, quantity: Math.max(1, i.quantity + delta) } : i);
    save(updated);
  }

  function remove(id: string) {
    save(cart.filter((i) => i.id !== id));
    toast.info("Item removed");
  }

  function checkout() {
    save([]);
    setOrdered(true);
    toast.success("Order placed successfully!");
  }

  const total = cart.reduce((sum, i) => sum + i.price * i.quantity, 0);
  const itemCount = cart.reduce((sum, i) => sum + i.quantity, 0);

  if (ordered) return (
    <div className="min-h-screen bg-gray-50 pt-24 flex items-center justify-center px-4">
      <div className="text-center max-w-md">
        <div className="w-20 h-20 bg-eco-100 rounded-full flex items-center justify-center mx-auto mb-6">
          <CheckCircle className="w-12 h-12 text-eco-600" />
        </div>
        <h2 className="text-2xl font-bold text-eco-900 mb-2">Order Placed!</h2>
        <p className="text-gray-500 mb-6">Thank you for shopping sustainably. Your eco-friendly products will arrive within 5–7 business days.</p>
        <Link href="/shop"><Button size="lg">Continue Shopping</Button></Link>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50 pt-20 pb-12">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Link href="/shop" className="inline-flex items-center gap-1.5 text-eco-600 text-sm font-medium mb-6">
          <ArrowLeft className="w-4 h-4" /> Continue Shopping
        </Link>
        <h1 className="text-2xl font-bold text-eco-900 mb-8 flex items-center gap-2">
          <ShoppingCart className="w-6 h-6" /> Your Cart
          {itemCount > 0 && <span className="text-sm font-normal text-gray-500">({itemCount} item{itemCount > 1 ? "s" : ""})</span>}
        </h1>

        {cart.length === 0 ? (
          <div className="text-center py-20">
            <ShoppingCart className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h2 className="text-xl font-semibold text-gray-500 mb-4">Your cart is empty</h2>
            <Link href="/shop"><Button size="lg">Start Shopping</Button></Link>
          </div>
        ) : (
          <div className="grid lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-4">
              {cart.map((item) => (
                <Card key={item.id} className="overflow-hidden">
                  <CardContent className="p-4 flex gap-4">
                    <div className="relative w-20 h-20 rounded-xl overflow-hidden flex-shrink-0">
                      <Image src={item.image_url || "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=200&q=80"}
                        alt={item.name} fill className="object-cover" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="font-semibold text-eco-900 truncate">{item.name}</h3>
                      <p className="text-eco-600 font-bold">{formatPrice(item.price)}</p>
                      <div className="flex items-center gap-3 mt-2">
                        <div className="flex items-center border rounded-lg overflow-hidden">
                          <button onClick={() => updateQty(item.id, -1)} className="p-1.5 hover:bg-gray-100">
                            <Minus className="w-3.5 h-3.5" />
                          </button>
                          <span className="px-3 text-sm font-semibold">{item.quantity}</span>
                          <button onClick={() => updateQty(item.id, 1)} className="p-1.5 hover:bg-gray-100">
                            <Plus className="w-3.5 h-3.5" />
                          </button>
                        </div>
                        <button onClick={() => remove(item.id)} className="text-red-400 hover:text-red-600 transition-colors">
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="font-bold text-eco-900">{formatPrice(item.price * item.quantity)}</div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* Order Summary */}
            <div>
              <Card className="p-6 sticky top-24">
                <h2 className="text-lg font-bold text-eco-900 mb-4">Order Summary</h2>
                <div className="space-y-3 mb-4">
                  <div className="flex justify-between text-sm"><span className="text-gray-500">Subtotal</span><span>{formatPrice(total)}</span></div>
                  <div className="flex justify-between text-sm"><span className="text-gray-500">Delivery</span><span className="text-eco-600">{total >= 999 ? "Free" : formatPrice(49)}</span></div>
                  <div className="flex justify-between text-sm"><span className="text-gray-500">Eco Discount</span><span className="text-eco-600">-{formatPrice(Math.round(total * 0.05))}</span></div>
                  <hr className="border-eco-100" />
                  <div className="flex justify-between font-bold text-lg">
                    <span>Total</span>
                    <span className="text-eco-600">{formatPrice(total + (total >= 999 ? 0 : 49) - Math.round(total * 0.05))}</span>
                  </div>
                </div>
                <Button className="w-full" size="lg" onClick={checkout}>Place Order</Button>
                <p className="text-xs text-gray-400 text-center mt-3">Mock checkout — no real payment</p>
              </Card>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

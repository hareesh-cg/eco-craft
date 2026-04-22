"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ShoppingBag, Package, Recycle, Briefcase, Lightbulb, ArrowRight, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { createClient } from "@/lib/supabase/client";
import { formatPrice, formatDate } from "@/lib/utils";
import type { Profile, Order, Product, WasteListing, JobApplication } from "@/types";

export default function DashboardPage() {
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);
  const [orders, setOrders] = useState<Order[]>([]);
  const [myProducts, setMyProducts] = useState<Product[]>([]);
  const [myWaste, setMyWaste] = useState<WasteListing[]>([]);
  const [myApplications, setMyApplications] = useState<JobApplication[]>([]);
  const router = useRouter();
  const supabase = createClient();

  useEffect(() => {
    async function load() {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) { router.push("/auth/login"); return; }

      const { data: prof } = await supabase.from("profiles").select("*").eq("id", user.id).single();
      if (!prof) { router.push("/auth/login"); return; }
      setProfile(prof);

      if (prof.role === "admin") { router.push("/admin"); return; }

      if (prof.role === "buyer") {
        const { data } = await supabase.from("orders").select("*").eq("buyer_id", user.id).order("created_at", { ascending: false }).limit(5);
        setOrders(data || []);
      }
      if (prof.role === "seller") {
        const [{ data: prods }, { data: waste }] = await Promise.all([
          supabase.from("products").select("*").eq("seller_id", user.id).order("created_at", { ascending: false }),
          supabase.from("waste_listings").select("*").eq("seller_id", user.id).order("created_at", { ascending: false }),
        ]);
        setMyProducts(prods || []);
        setMyWaste(waste || []);
      }
      if (prof.role === "job_seeker") {
        const { data } = await supabase.from("job_applications").select("*, job:job_listings(*)").eq("applicant_id", user.id).order("created_at", { ascending: false });
        setMyApplications(data || []);
      }
      setLoading(false);
    }
    load();
  }, []);

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center pt-16">
      <div className="w-8 h-8 border-4 border-eco-600 border-t-transparent rounded-full animate-spin" />
    </div>
  );

  if (!profile) return null;

  return (
    <div className="min-h-screen bg-gray-50 pt-20 pb-12">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-12 h-12 bg-eco-600 rounded-xl flex items-center justify-center text-white text-lg font-bold">
              {profile.full_name?.[0]?.toUpperCase()}
            </div>
            <div>
              <h1 className="text-2xl font-bold text-eco-900">Welcome, {profile.full_name.split(" ")[0]}!</h1>
              <Badge variant="secondary" className="capitalize">{profile.role.replace("_", " ")}</Badge>
            </div>
          </div>
        </div>

        {/* Buyer Dashboard */}
        {profile.role === "buyer" && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <Card className="p-5 text-center">
                <ShoppingBag className="w-8 h-8 text-eco-600 mx-auto mb-2" />
                <div className="text-2xl font-bold text-eco-900">{orders.length}</div>
                <div className="text-sm text-gray-500">Total Orders</div>
              </Card>
              <Link href="/shop"><Card className="p-5 text-center card-hover cursor-pointer hover:border-eco-300">
                <Package className="w-8 h-8 text-amber-500 mx-auto mb-2" />
                <div className="text-lg font-semibold text-eco-900">Browse Shop</div>
                <div className="text-sm text-gray-500">Find new products</div>
              </Card></Link>
              <Link href="/cart"><Card className="p-5 text-center card-hover cursor-pointer hover:border-eco-300">
                <ArrowRight className="w-8 h-8 text-purple-500 mx-auto mb-2" />
                <div className="text-lg font-semibold text-eco-900">View Cart</div>
                <div className="text-sm text-gray-500">Complete your order</div>
              </Card></Link>
            </div>
            <Card>
              <CardHeader><CardTitle>Recent Orders</CardTitle></CardHeader>
              <CardContent>
                {orders.length === 0 ? (
                  <div className="text-center py-8">
                    <ShoppingBag className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                    <p className="text-gray-500">No orders yet.</p>
                    <Link href="/shop"><Button className="mt-4">Start Shopping</Button></Link>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {orders.map((order) => (
                      <div key={order.id} className="flex justify-between items-center py-3 border-b last:border-0">
                        <div>
                          <div className="font-medium text-eco-900">{formatPrice(order.total)}</div>
                          <div className="text-sm text-gray-500">{formatDate(order.created_at)}</div>
                        </div>
                        <Badge variant="active">{order.status}</Badge>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        )}

        {/* Seller Dashboard */}
        {profile.role === "seller" && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <Card className="p-5 text-center">
                <Package className="w-8 h-8 text-eco-600 mx-auto mb-2" />
                <div className="text-2xl font-bold text-eco-900">{myProducts.length}</div>
                <div className="text-sm text-gray-500">My Products</div>
              </Card>
              <Card className="p-5 text-center">
                <Recycle className="w-8 h-8 text-amber-500 mx-auto mb-2" />
                <div className="text-2xl font-bold text-eco-900">{myWaste.length}</div>
                <div className="text-sm text-gray-500">Waste Listings</div>
              </Card>
              <Link href="/waste/sell"><Card className="p-5 text-center card-hover cursor-pointer hover:border-eco-300">
                <Plus className="w-8 h-8 text-purple-500 mx-auto mb-2" />
                <div className="text-lg font-semibold text-eco-900">Sell Waste</div>
                <div className="text-sm text-gray-500">New listing</div>
              </Card></Link>
            </div>
            <Card>
              <CardHeader><CardTitle>My Waste Listings</CardTitle></CardHeader>
              <CardContent>
                {myWaste.length === 0 ? (
                  <div className="text-center py-8">
                    <Recycle className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                    <p className="text-gray-500">No waste listings yet.</p>
                    <Link href="/waste/sell"><Button className="mt-4">List Waste</Button></Link>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {myWaste.map((w) => (
                      <div key={w.id} className="flex justify-between items-center py-3 border-b last:border-0">
                        <div>
                          <div className="font-medium text-eco-900">{w.title}</div>
                          <div className="text-sm text-gray-500">{w.quantity} {w.unit} · {w.location}</div>
                        </div>
                        <Badge variant={w.status as "active" | "pending" | "rejected" | "sold"}>{w.status}</Badge>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        )}

        {/* Job Seeker Dashboard */}
        {profile.role === "job_seeker" && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <Card className="p-5 text-center">
                <Briefcase className="w-8 h-8 text-eco-600 mx-auto mb-2" />
                <div className="text-2xl font-bold text-eco-900">{myApplications.length}</div>
                <div className="text-sm text-gray-500">Applications</div>
              </Card>
              <Link href="/jobs"><Card className="p-5 text-center card-hover cursor-pointer hover:border-eco-300">
                <ArrowRight className="w-8 h-8 text-amber-500 mx-auto mb-2" />
                <div className="text-lg font-semibold text-eco-900">Browse Jobs</div>
                <div className="text-sm text-gray-500">Find opportunities</div>
              </Card></Link>
              <Link href="/innovation"><Card className="p-5 text-center card-hover cursor-pointer hover:border-eco-300">
                <Lightbulb className="w-8 h-8 text-purple-500 mx-auto mb-2" />
                <div className="text-lg font-semibold text-eco-900">Innovations</div>
                <div className="text-sm text-gray-500">Explore ideas</div>
              </Card></Link>
            </div>
            <Card>
              <CardHeader><CardTitle>My Applications</CardTitle></CardHeader>
              <CardContent>
                {myApplications.length === 0 ? (
                  <div className="text-center py-8">
                    <Briefcase className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                    <p className="text-gray-500">No applications yet.</p>
                    <Link href="/jobs"><Button className="mt-4">Find Jobs</Button></Link>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {myApplications.map((app) => (
                      <div key={app.id} className="flex justify-between items-center py-3 border-b last:border-0">
                        <div>
                          <div className="font-medium text-eco-900">{(app.job as JobApplication["job"])?.title}</div>
                          <div className="text-sm text-gray-500">{(app.job as JobApplication["job"])?.company} · {formatDate(app.created_at)}</div>
                        </div>
                        <Badge variant="active">Applied</Badge>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </div>
  );
}

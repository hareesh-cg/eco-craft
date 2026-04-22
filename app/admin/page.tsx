"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Users, Package, Recycle, Briefcase, Lightbulb, CheckCircle, XCircle, Trash2, Shield } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { createClient } from "@/lib/supabase/client";
import { formatPrice, formatDate, categoryLabels } from "@/lib/utils";
import { toast } from "sonner";
import type { Profile, Product, WasteListing, JobListing, Innovation } from "@/types";

const tabs = ["Overview", "Users", "Products", "Waste", "Jobs", "Innovations"] as const;
type Tab = typeof tabs[number];

export default function AdminPage() {
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<Tab>("Overview");
  const [profiles, setProfiles] = useState<Profile[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [waste, setWaste] = useState<WasteListing[]>([]);
  const [jobs, setJobs] = useState<JobListing[]>([]);
  const [innovations, setInnovations] = useState<Innovation[]>([]);
  const [appCount, setAppCount] = useState(0);
  const router = useRouter();
  const supabase = createClient();

  useEffect(() => {
    async function load() {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) { router.push("/auth/login"); return; }
      const { data: prof } = await supabase.from("profiles").select("*").eq("id", user.id).single();
      if (!prof || prof.role !== "admin") { router.push("/dashboard"); return; }

      const [p, pr, w, j, inn, apps] = await Promise.all([
        supabase.from("profiles").select("*").order("created_at", { ascending: false }),
        supabase.from("products").select("*").order("created_at", { ascending: false }),
        supabase.from("waste_listings").select("*").order("created_at", { ascending: false }),
        supabase.from("job_listings").select("*").order("created_at", { ascending: false }),
        supabase.from("innovations").select("*, author:profiles(full_name)").order("created_at", { ascending: false }),
        supabase.from("job_applications").select("id", { count: "exact" }),
      ]);
      setProfiles(p.data || []);
      setProducts(pr.data || []);
      setWaste(w.data || []);
      setJobs(j.data || []);
      setInnovations(inn.data || []);
      setAppCount(apps.count || 0);
      setLoading(false);
    }
    load();
  }, []);

  async function updateStatus(table: string, id: string, status: string) {
    const { error } = await supabase.from(table).update({ status }).eq("id", id);
    if (error) { toast.error(error.message); return; }
    toast.success(`Status updated to ${status}`);
    if (table === "products") setProducts((p) => p.map((x) => x.id === id ? { ...x, status: status as Product["status"] } : x));
    if (table === "waste_listings") setWaste((w) => w.map((x) => x.id === id ? { ...x, status: status as WasteListing["status"] } : x));
    if (table === "innovations") setInnovations((i) => i.map((x) => x.id === id ? { ...x, status: status as Innovation["status"] } : x));
  }

  async function deleteRow(table: string, id: string) {
    const { error } = await supabase.from(table).delete().eq("id", id);
    if (error) { toast.error(error.message); return; }
    toast.success("Deleted");
    if (table === "products") setProducts((p) => p.filter((x) => x.id !== id));
    if (table === "waste_listings") setWaste((w) => w.filter((x) => x.id !== id));
    if (table === "job_listings") setJobs((j) => j.filter((x) => x.id !== id));
  }

  async function updateRole(id: string, role: string) {
    const { error } = await supabase.from("profiles").update({ role }).eq("id", id);
    if (error) { toast.error(error.message); return; }
    setProfiles((p) => p.map((x) => x.id === id ? { ...x, role: role as Profile["role"] } : x));
    toast.success("Role updated");
  }

  if (loading) return <div className="min-h-screen flex items-center justify-center pt-16"><div className="w-8 h-8 border-4 border-eco-600 border-t-transparent rounded-full animate-spin" /></div>;

  return (
    <div className="min-h-screen bg-gray-50 pt-16">
      {/* Header */}
      <div className="eco-gradient py-8 px-4">
        <div className="max-w-7xl mx-auto flex items-center gap-3 text-white">
          <Shield className="w-7 h-7" />
          <h1 className="text-2xl font-bold">Admin Panel</h1>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {/* Tabs */}
        <div className="flex gap-2 flex-wrap mb-8 border-b border-eco-100 pb-3">
          {tabs.map((t) => (
            <button key={t} onClick={() => setActiveTab(t)}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${activeTab === t ? "bg-eco-600 text-white" : "text-gray-600 hover:bg-eco-50"}`}>
              {t}
            </button>
          ))}
        </div>

        {/* Overview */}
        {activeTab === "Overview" && (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
            {[
              { icon: Users, label: "Users", value: profiles.length, color: "text-blue-600 bg-blue-50" },
              { icon: Package, label: "Products", value: products.length, color: "text-eco-600 bg-eco-50" },
              { icon: Recycle, label: "Waste Listings", value: waste.length, color: "text-amber-600 bg-amber-50" },
              { icon: Briefcase, label: "Jobs", value: jobs.length, color: "text-purple-600 bg-purple-50" },
              { icon: Lightbulb, label: "Innovations", value: innovations.length, color: "text-pink-600 bg-pink-50" },
            ].map(({ icon: Icon, label, value, color }) => (
              <Card key={label} className="p-5 text-center">
                <div className={`w-12 h-12 rounded-xl flex items-center justify-center mx-auto mb-3 ${color}`}>
                  <Icon className="w-6 h-6" />
                </div>
                <div className="text-2xl font-bold text-eco-900">{value}</div>
                <div className="text-sm text-gray-500">{label}</div>
              </Card>
            ))}
          </div>
        )}

        {/* Users */}
        {activeTab === "Users" && (
          <Card>
            <CardHeader><CardTitle>All Users ({profiles.length})</CardTitle></CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead><tr className="border-b text-left text-gray-500">
                    <th className="pb-3 pr-4">Name</th><th className="pb-3 pr-4">Email</th>
                    <th className="pb-3 pr-4">Role</th><th className="pb-3">Joined</th>
                  </tr></thead>
                  <tbody className="divide-y divide-gray-50">
                    {profiles.map((p) => (
                      <tr key={p.id} className="hover:bg-gray-50">
                        <td className="py-3 pr-4 font-medium">{p.full_name}</td>
                        <td className="py-3 pr-4 text-gray-500">{p.email}</td>
                        <td className="py-3 pr-4">
                          <Select value={p.role} onValueChange={(v) => updateRole(p.id, v)}>
                            <SelectTrigger className="h-8 w-32"><SelectValue /></SelectTrigger>
                            <SelectContent>
                              <SelectItem value="buyer">Buyer</SelectItem>
                              <SelectItem value="seller">Seller</SelectItem>
                              <SelectItem value="job_seeker">Job Seeker</SelectItem>
                              <SelectItem value="admin">Admin</SelectItem>
                            </SelectContent>
                          </Select>
                        </td>
                        <td className="py-3 text-gray-500">{formatDate(p.created_at)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Products */}
        {activeTab === "Products" && (
          <Card>
            <CardHeader><CardTitle>All Products ({products.length})</CardTitle></CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead><tr className="border-b text-left text-gray-500">
                    <th className="pb-3 pr-4">Name</th><th className="pb-3 pr-4">Category</th>
                    <th className="pb-3 pr-4">Price</th><th className="pb-3 pr-4">Status</th><th className="pb-3">Actions</th>
                  </tr></thead>
                  <tbody className="divide-y divide-gray-50">
                    {products.map((p) => (
                      <tr key={p.id} className="hover:bg-gray-50">
                        <td className="py-3 pr-4 font-medium">{p.name}</td>
                        <td className="py-3 pr-4 text-gray-500">{categoryLabels[p.category]}</td>
                        <td className="py-3 pr-4">{formatPrice(p.price)}</td>
                        <td className="py-3 pr-4"><Badge variant={p.status as "active" | "pending" | "rejected"}>{p.status}</Badge></td>
                        <td className="py-3">
                          <div className="flex gap-1">
                            {p.status !== "active" && <button onClick={() => updateStatus("products", p.id, "active")} className="p-1.5 text-eco-600 hover:bg-eco-50 rounded"><CheckCircle className="w-4 h-4" /></button>}
                            {p.status !== "rejected" && <button onClick={() => updateStatus("products", p.id, "rejected")} className="p-1.5 text-red-500 hover:bg-red-50 rounded"><XCircle className="w-4 h-4" /></button>}
                            <button onClick={() => deleteRow("products", p.id)} className="p-1.5 text-gray-400 hover:bg-gray-100 rounded"><Trash2 className="w-4 h-4" /></button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Waste */}
        {activeTab === "Waste" && (
          <Card>
            <CardHeader><CardTitle>Waste Listings ({waste.length})</CardTitle></CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead><tr className="border-b text-left text-gray-500">
                    <th className="pb-3 pr-4">Title</th><th className="pb-3 pr-4">Type</th>
                    <th className="pb-3 pr-4">Location</th><th className="pb-3 pr-4">Status</th><th className="pb-3">Actions</th>
                  </tr></thead>
                  <tbody className="divide-y divide-gray-50">
                    {waste.map((w) => (
                      <tr key={w.id} className="hover:bg-gray-50">
                        <td className="py-3 pr-4 font-medium">{w.title}</td>
                        <td className="py-3 pr-4 text-gray-500">{categoryLabels[w.waste_type]}</td>
                        <td className="py-3 pr-4 text-gray-500">{w.location}</td>
                        <td className="py-3 pr-4"><Badge variant={w.status as "active" | "pending" | "rejected" | "sold"}>{w.status}</Badge></td>
                        <td className="py-3">
                          <div className="flex gap-1">
                            {w.status !== "active" && <button onClick={() => updateStatus("waste_listings", w.id, "active")} className="p-1.5 text-eco-600 hover:bg-eco-50 rounded"><CheckCircle className="w-4 h-4" /></button>}
                            {w.status !== "sold" && <button onClick={() => updateStatus("waste_listings", w.id, "sold")} className="p-1.5 text-gray-500 hover:bg-gray-100 rounded text-xs font-medium px-2">Sold</button>}
                            {w.status !== "rejected" && <button onClick={() => updateStatus("waste_listings", w.id, "rejected")} className="p-1.5 text-red-500 hover:bg-red-50 rounded"><XCircle className="w-4 h-4" /></button>}
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Jobs */}
        {activeTab === "Jobs" && (
          <Card>
            <CardHeader><CardTitle>Job Listings ({jobs.length})</CardTitle></CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead><tr className="border-b text-left text-gray-500">
                    <th className="pb-3 pr-4">Title</th><th className="pb-3 pr-4">Company</th>
                    <th className="pb-3 pr-4">Category</th><th className="pb-3 pr-4">Location</th><th className="pb-3">Actions</th>
                  </tr></thead>
                  <tbody className="divide-y divide-gray-50">
                    {jobs.map((j) => (
                      <tr key={j.id} className="hover:bg-gray-50">
                        <td className="py-3 pr-4 font-medium">{j.title}</td>
                        <td className="py-3 pr-4 text-gray-500">{j.company}</td>
                        <td className="py-3 pr-4"><Badge variant="secondary">{categoryLabels[j.category]}</Badge></td>
                        <td className="py-3 pr-4 text-gray-500">{j.location}</td>
                        <td className="py-3">
                          <button onClick={() => deleteRow("job_listings", j.id)} className="p-1.5 text-red-400 hover:bg-red-50 rounded"><Trash2 className="w-4 h-4" /></button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Innovations */}
        {activeTab === "Innovations" && (
          <Card>
            <CardHeader><CardTitle>Innovations ({innovations.length})</CardTitle></CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead><tr className="border-b text-left text-gray-500">
                    <th className="pb-3 pr-4">Title</th><th className="pb-3 pr-4">Author</th>
                    <th className="pb-3 pr-4">Tags</th><th className="pb-3 pr-4">Status</th><th className="pb-3">Actions</th>
                  </tr></thead>
                  <tbody className="divide-y divide-gray-50">
                    {innovations.map((inn) => (
                      <tr key={inn.id} className="hover:bg-gray-50">
                        <td className="py-3 pr-4 font-medium">{inn.title}</td>
                        <td className="py-3 pr-4 text-gray-500">{(inn.author as { full_name: string } | undefined)?.full_name || "—"}</td>
                        <td className="py-3 pr-4">
                          <div className="flex gap-1 flex-wrap">
                            {inn.tags.slice(0, 2).map((t) => <span key={t} className="text-xs bg-eco-100 text-eco-700 px-1.5 py-0.5 rounded">{t}</span>)}
                          </div>
                        </td>
                        <td className="py-3 pr-4"><Badge variant={inn.status as "pending" | "active" | "rejected"}>{inn.status}</Badge></td>
                        <td className="py-3">
                          <div className="flex gap-1">
                            {inn.status !== "approved" && <button onClick={() => updateStatus("innovations", inn.id, "approved")} className="p-1.5 text-eco-600 hover:bg-eco-50 rounded"><CheckCircle className="w-4 h-4" /></button>}
                            {inn.status !== "rejected" && <button onClick={() => updateStatus("innovations", inn.id, "rejected")} className="p-1.5 text-red-500 hover:bg-red-50 rounded"><XCircle className="w-4 h-4" /></button>}
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}

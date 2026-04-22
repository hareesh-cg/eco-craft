"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Upload, CheckCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { createClient } from "@/lib/supabase/client";
import { toast } from "sonner";

export default function SellWastePage() {
  const [form, setForm] = useState({ title: "", description: "", waste_type: "plastic_bottles", quantity: "", unit: "kg", location: "", price_per_unit: "" });
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const router = useRouter();
  const supabase = createClient();

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) { toast.error("Please log in first"); router.push("/auth/login"); return; }

    let image_url = null;
    if (imageFile) {
      const ext = imageFile.name.split(".").pop();
      const path = `${user.id}/${Date.now()}.${ext}`;
      const { data: uploadData } = await supabase.storage.from("waste-images").upload(path, imageFile, { upsert: true });
      if (uploadData) {
        const { data: urlData } = supabase.storage.from("waste-images").getPublicUrl(path);
        image_url = urlData.publicUrl;
      }
    }

    const { error } = await supabase.from("waste_listings").insert({
      seller_id: user.id,
      title: form.title,
      description: form.description,
      waste_type: form.waste_type,
      quantity: parseFloat(form.quantity),
      unit: form.unit,
      location: form.location,
      price_per_unit: form.price_per_unit ? parseFloat(form.price_per_unit) : null,
      image_url,
      status: "active",
    });

    if (error) toast.error(error.message);
    else setSuccess(true);
    setLoading(false);
  }

  if (success) return (
    <div className="min-h-screen bg-gray-50 pt-24 flex items-center justify-center px-4">
      <div className="text-center max-w-md">
        <div className="w-20 h-20 bg-eco-100 rounded-full flex items-center justify-center mx-auto mb-6">
          <CheckCircle className="w-12 h-12 text-eco-600" />
        </div>
        <h2 className="text-2xl font-bold text-eco-900 mb-2">Listing Submitted!</h2>
        <p className="text-gray-500 mb-6">Your waste listing is now live. Buyers can contact you directly.</p>
        <div className="flex gap-3 justify-center">
          <Link href="/waste"><Button>View Listings</Button></Link>
          <Button variant="outline" onClick={() => { setSuccess(false); setForm({ title: "", description: "", waste_type: "plastic_bottles", quantity: "", unit: "kg", location: "", price_per_unit: "" }); setImageFile(null); }}>
            List More
          </Button>
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50 pt-20 pb-12">
      <div className="eco-gradient py-10 px-4 mb-8">
        <div className="max-w-2xl mx-auto text-white">
          <h1 className="text-3xl font-bold mb-1">Sell Your Waste</h1>
          <p className="text-eco-100">Turn your plastic waste into income. Fill in the details below.</p>
        </div>
      </div>

      <div className="max-w-2xl mx-auto px-4">
        <Link href="/waste" className="inline-flex items-center gap-1.5 text-eco-600 text-sm font-medium mb-6">
          <ArrowLeft className="w-4 h-4" /> Back to Listings
        </Link>

        <div className="bg-white rounded-2xl shadow-sm border border-eco-100 p-8">
          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="space-y-1.5">
              <Label htmlFor="title">Item Title</Label>
              <Input id="title" placeholder="e.g. Clean PET Bottles — 50 kg lot" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} required />
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="description">Description</Label>
              <Textarea id="description" placeholder="Describe the waste: condition, sorting status, pickup info…" rows={3} value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <Label>Waste Type</Label>
                <Select value={form.waste_type} onValueChange={(v) => setForm({ ...form, waste_type: v })}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="plastic_bottles">Plastic Bottles</SelectItem>
                    <SelectItem value="wrappers">Wrappers</SelectItem>
                    <SelectItem value="hard_plastic">Hard Plastic</SelectItem>
                    <SelectItem value="mixed">Mixed</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-1.5">
                <Label>Unit</Label>
                <Select value={form.unit} onValueChange={(v) => setForm({ ...form, unit: v })}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="kg">Kilograms (kg)</SelectItem>
                    <SelectItem value="pieces">Pieces</SelectItem>
                    <SelectItem value="bags">Bags</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <Label htmlFor="quantity">Quantity</Label>
                <Input id="quantity" type="number" placeholder="e.g. 50" value={form.quantity} onChange={(e) => setForm({ ...form, quantity: e.target.value })} required />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="price">Price per unit (₹) <span className="text-gray-400 text-xs">optional</span></Label>
                <Input id="price" type="number" placeholder="e.g. 12" value={form.price_per_unit} onChange={(e) => setForm({ ...form, price_per_unit: e.target.value })} />
              </div>
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="location">Location</Label>
              <Input id="location" placeholder="e.g. Koramangala, Bengaluru" value={form.location} onChange={(e) => setForm({ ...form, location: e.target.value })} required />
            </div>

            <div className="space-y-1.5">
              <Label>Image <span className="text-gray-400 text-xs">optional</span></Label>
              <label className="flex flex-col items-center justify-center border-2 border-dashed border-eco-200 rounded-xl p-6 cursor-pointer hover:border-eco-400 hover:bg-eco-50 transition-all">
                <Upload className="w-8 h-8 text-eco-400 mb-2" />
                <span className="text-sm text-gray-500">{imageFile ? imageFile.name : "Click to upload image"}</span>
                <input type="file" accept="image/*" className="hidden" onChange={(e) => setImageFile(e.target.files?.[0] || null)} />
              </label>
            </div>

            <Button type="submit" size="lg" className="w-full" disabled={loading}>
              {loading ? "Submitting…" : "Submit Listing"}
            </Button>
          </form>
        </div>
      </div>
    </div>
  );
}

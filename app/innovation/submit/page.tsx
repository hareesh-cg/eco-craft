"use client";
import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowLeft, Upload, X, CheckCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { createClient } from "@/lib/supabase/client";
import { toast } from "sonner";

export default function SubmitInnovationPage() {
  const [form, setForm] = useState({ title: "", description: "", tags: "" });
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
      const { data: uploadData } = await supabase.storage.from("innovation-images").upload(path, imageFile, { upsert: true });
      if (uploadData) {
        const { data: urlData } = supabase.storage.from("innovation-images").getPublicUrl(path);
        image_url = urlData.publicUrl;
      }
    }

    const tags = form.tags.split(",").map((t) => t.trim()).filter(Boolean);
    const { error } = await supabase.from("innovations").insert({
      author_id: user.id, title: form.title, description: form.description, tags, image_url, status: "pending",
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
        <h2 className="text-2xl font-bold text-eco-900 mb-2">Idea Submitted!</h2>
        <p className="text-gray-500 mb-6">Your innovation idea is under review and will appear on the Innovation Hub once approved.</p>
        <Link href="/innovation"><Button>View Innovation Hub</Button></Link>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50 pt-20 pb-12">
      <div className="eco-gradient py-10 px-4 mb-8">
        <div className="max-w-2xl mx-auto text-white">
          <h1 className="text-3xl font-bold mb-1">Share Your Innovation</h1>
          <p className="text-eco-100">Got a brilliant idea for reusing plastic? Tell the world.</p>
        </div>
      </div>

      <div className="max-w-2xl mx-auto px-4">
        <Link href="/innovation" className="inline-flex items-center gap-1.5 text-eco-600 text-sm font-medium mb-6">
          <ArrowLeft className="w-4 h-4" /> Back to Innovation Hub
        </Link>

        <div className="bg-white rounded-2xl shadow-sm border border-eco-100 p-8">
          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="space-y-1.5">
              <Label htmlFor="title">Innovation Title</Label>
              <Input id="title" placeholder="e.g. Solar Bottle Lantern" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} required />
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="description">Describe Your Idea</Label>
              <Textarea id="description" rows={6} placeholder="Explain what the innovation is, how it works, and what problem it solves. Be as detailed as you like!" value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} required />
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="tags">Tags <span className="text-gray-400 text-xs">comma-separated</span></Label>
              <Input id="tags" placeholder="e.g. Lighting, Solar, Garden, PET Bottles" value={form.tags} onChange={(e) => setForm({ ...form, tags: e.target.value })} />
              {form.tags && (
                <div className="flex flex-wrap gap-1.5 mt-2">
                  {form.tags.split(",").map((t) => t.trim()).filter(Boolean).map((tag) => (
                    <span key={tag} className="text-xs bg-eco-100 text-eco-700 px-2 py-0.5 rounded-full">{tag}</span>
                  ))}
                </div>
              )}
            </div>

            <div className="space-y-1.5">
              <Label>Image <span className="text-gray-400 text-xs">optional</span></Label>
              <label className="flex flex-col items-center justify-center border-2 border-dashed border-eco-200 rounded-xl p-6 cursor-pointer hover:border-eco-400 hover:bg-eco-50 transition-all">
                <Upload className="w-8 h-8 text-eco-400 mb-2" />
                <span className="text-sm text-gray-500">{imageFile ? imageFile.name : "Click to upload an image of your innovation"}</span>
                <input type="file" accept="image/*" className="hidden" onChange={(e) => setImageFile(e.target.files?.[0] || null)} />
              </label>
            </div>

            <Button type="submit" size="lg" className="w-full" disabled={loading}>
              {loading ? "Submitting…" : "Submit Innovation"}
            </Button>
            <p className="text-xs text-center text-gray-400">Your idea will be reviewed by our team before going live.</p>
          </form>
        </div>
      </div>
    </div>
  );
}

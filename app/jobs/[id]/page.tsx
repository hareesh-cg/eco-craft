"use client";
import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, MapPin, Clock, Users, CheckCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { createClient } from "@/lib/supabase/client";
import { categoryLabels, categoryColors } from "@/lib/utils";
import { toast } from "sonner";
import type { JobListing, Profile } from "@/types";

const jobTypeLabel: Record<string, string> = { full_time: "Full Time", part_time: "Part Time", contract: "Contract" };

export default function JobDetailPage() {
  const { id } = useParams();
  const [job, setJob] = useState<JobListing | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [form, setForm] = useState({ name: "", email: "", phone: "", cover_letter: "" });
  const [submitting, setSubmitting] = useState(false);
  const [applied, setApplied] = useState(false);
  const supabase = createClient();

  useEffect(() => {
    async function load() {
      const [{ data: jobData }, { data: { user } }] = await Promise.all([
        supabase.from("job_listings").select("*").eq("id", id).single(),
        supabase.auth.getUser(),
      ]);
      setJob(jobData);
      if (user) {
        const { data: prof } = await supabase.from("profiles").select("*").eq("id", user.id).single();
        setProfile(prof);
        setForm((f) => ({ ...f, name: prof?.full_name || "", email: prof?.email || "" }));
      }
      setLoading(false);
    }
    load();
  }, [id]);

  async function handleApply(e: React.FormEvent) {
    e.preventDefault();
    setSubmitting(true);
    const { data: { user } } = await supabase.auth.getUser();
    const { error } = await supabase.from("job_applications").insert({
      job_id: id, applicant_id: user?.id || null,
      name: form.name, email: form.email, phone: form.phone, cover_letter: form.cover_letter,
    });
    if (error) toast.error(error.message);
    else { setApplied(true); setShowModal(false); toast.success("Application submitted!"); }
    setSubmitting(false);
  }

  if (loading) return <div className="min-h-screen flex items-center justify-center pt-16"><div className="w-8 h-8 border-4 border-eco-600 border-t-transparent rounded-full animate-spin" /></div>;
  if (!job) return <div className="min-h-screen flex items-center justify-center pt-16 text-gray-500">Job not found.</div>;

  return (
    <div className="min-h-screen bg-gray-50 pt-20 pb-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Link href="/jobs" className="inline-flex items-center gap-1.5 text-eco-600 text-sm font-medium mb-6">
          <ArrowLeft className="w-4 h-4" /> Back to Jobs
        </Link>

        <div className="grid lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-6">
            <Card className="p-6">
              <div className="flex items-start gap-4">
                <div className="w-14 h-14 bg-eco-100 rounded-xl flex items-center justify-center text-3xl">
                  {job.category === "crafting" ? "✂️" : job.category === "collection" ? "🚛" : job.category === "design" ? "🎨" : "📦"}
                </div>
                <div className="flex-1">
                  <div className="flex flex-wrap gap-2 mb-1">
                    <Badge className={`text-xs ${categoryColors[job.category]}`} variant="outline">{categoryLabels[job.category]}</Badge>
                    <Badge variant="secondary">{jobTypeLabel[job.job_type]}</Badge>
                  </div>
                  <h1 className="text-2xl font-bold text-eco-900">{job.title}</h1>
                  <p className="text-gray-600 font-medium">{job.company}</p>
                  <div className="flex flex-wrap gap-4 mt-3 text-sm text-gray-500">
                    <span className="flex items-center gap-1"><MapPin className="w-4 h-4" />{job.location}</span>
                    <span className="flex items-center gap-1"><Clock className="w-4 h-4" />{jobTypeLabel[job.job_type]}</span>
                    {job.age_preference && <span className="flex items-center gap-1"><Users className="w-4 h-4" />{job.age_preference}</span>}
                  </div>
                </div>
              </div>
            </Card>

            <Card className="p-6">
              <h2 className="text-lg font-bold text-eco-900 mb-3">Job Description</h2>
              <p className="text-gray-600 leading-relaxed whitespace-pre-line">{job.description}</p>
            </Card>

            {job.requirements && (
              <Card className="p-6">
                <h2 className="text-lg font-bold text-eco-900 mb-3">Requirements</h2>
                <p className="text-gray-600 leading-relaxed whitespace-pre-line">{job.requirements}</p>
              </Card>
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-4">
            <Card className="p-6">
              <div className="text-2xl font-bold text-eco-600 mb-1">{job.salary_range}</div>
              <p className="text-sm text-gray-500 mb-4">per month</p>
              {applied ? (
                <div className="flex items-center gap-2 text-eco-600 font-medium">
                  <CheckCircle className="w-5 h-5" /> Application Submitted!
                </div>
              ) : (
                <Button className="w-full" size="lg" onClick={() => setShowModal(true)}>Apply Now</Button>
              )}
            </Card>
            <Card className="p-4">
              <h3 className="font-semibold text-eco-900 mb-3">Job Details</h3>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between"><span className="text-gray-500">Category</span><span className="font-medium">{categoryLabels[job.category]}</span></div>
                <div className="flex justify-between"><span className="text-gray-500">Type</span><span className="font-medium">{jobTypeLabel[job.job_type]}</span></div>
                {job.age_preference && <div className="flex justify-between"><span className="text-gray-500">Age</span><span className="font-medium">{job.age_preference}</span></div>}
                <div className="flex justify-between"><span className="text-gray-500">Location</span><span className="font-medium">{job.location}</span></div>
              </div>
            </Card>
          </div>
        </div>
      </div>

      {/* Apply Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4" onClick={() => setShowModal(false)}>
          <div className="bg-white rounded-2xl p-6 max-w-md w-full shadow-xl" onClick={(e) => e.stopPropagation()}>
            <h3 className="text-xl font-bold text-eco-900 mb-1">Apply for {job.title}</h3>
            <p className="text-sm text-gray-500 mb-5">{job.company} · {job.location}</p>
            <form onSubmit={handleApply} className="space-y-4">
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1"><Label>Full Name</Label><Input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} required /></div>
                <div className="space-y-1"><Label>Phone</Label><Input value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} placeholder="+91 XXXXX XXXXX" /></div>
              </div>
              <div className="space-y-1"><Label>Email</Label><Input type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} required /></div>
              <div className="space-y-1"><Label>Cover Letter <span className="text-gray-400 text-xs">optional</span></Label>
                <Textarea rows={4} value={form.cover_letter} onChange={(e) => setForm({ ...form, cover_letter: e.target.value })} placeholder="Why are you the right person for this role?" />
              </div>
              <div className="flex gap-3">
                <Button type="button" variant="outline" className="flex-1" onClick={() => setShowModal(false)}>Cancel</Button>
                <Button type="submit" className="flex-1" disabled={submitting}>{submitting ? "Submitting…" : "Submit Application"}</Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

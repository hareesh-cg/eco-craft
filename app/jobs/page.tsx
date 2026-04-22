"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { MapPin, Clock, Search, Briefcase } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { createClient } from "@/lib/supabase/client";
import { categoryLabels, categoryColors } from "@/lib/utils";
import type { JobListing } from "@/types";

const categories = ["all", "crafting", "collection", "design", "delivery"];
const jobTypeLabel: Record<string, string> = { full_time: "Full Time", part_time: "Part Time", contract: "Contract" };

export default function JobsPage() {
  const [jobs, setJobs] = useState<JobListing[]>([]);
  const [filtered, setFiltered] = useState<JobListing[]>([]);
  const [search, setSearch] = useState("");
  const [activeCategory, setActiveCategory] = useState("all");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    createClient().from("job_listings").select("*").eq("status", "active").order("created_at", { ascending: false })
      .then(({ data }) => { setJobs(data || []); setFiltered(data || []); setLoading(false); });
  }, []);

  useEffect(() => {
    let result = jobs;
    if (activeCategory !== "all") result = result.filter((j) => j.category === activeCategory);
    if (search) result = result.filter((j) => j.title.toLowerCase().includes(search.toLowerCase()) || j.company.toLowerCase().includes(search.toLowerCase()));
    setFiltered(result);
  }, [search, activeCategory, jobs]);

  return (
    <div className="min-h-screen bg-gray-50 pt-20 pb-12">
      <div className="eco-gradient py-12 px-4">
        <div className="max-w-7xl mx-auto text-white">
          <div className="flex items-center gap-3 mb-3">
            <Briefcase className="w-8 h-8" />
            <h1 className="text-4xl font-bold">Green Job Board</h1>
          </div>
          <p className="text-eco-100 max-w-xl">Find meaningful work in India&apos;s circular economy. Opportunities for youth and working adults aged 40–55.</p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col sm:flex-row gap-4 mb-8">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <Input placeholder="Search jobs or companies…" className="pl-10 bg-white" value={search} onChange={(e) => setSearch(e.target.value)} />
          </div>
          <div className="flex gap-2 flex-wrap">
            {categories.map((c) => (
              <button key={c} onClick={() => setActiveCategory(c)}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${activeCategory === c ? "bg-eco-600 text-white shadow-sm" : "bg-white text-gray-600 border hover:border-eco-300"}`}>
                {c === "all" ? "All Categories" : categoryLabels[c]}
              </button>
            ))}
          </div>
        </div>

        <p className="text-sm text-gray-500 mb-6">{loading ? "Loading…" : `${filtered.length} job${filtered.length !== 1 ? "s" : ""} found`}</p>

        {loading ? (
          <div className="space-y-4">{[...Array(5)].map((_, i) => <div key={i} className="bg-white rounded-2xl h-28 animate-pulse" />)}</div>
        ) : filtered.length === 0 ? (
          <div className="text-center py-20 text-gray-400">No jobs found.</div>
        ) : (
          <div className="space-y-4">
            {filtered.map((job) => (
              <Link key={job.id} href={`/jobs/${job.id}`}>
                <Card className="card-hover cursor-pointer hover:border-eco-200">
                  <CardContent className="p-5 flex flex-col sm:flex-row items-start sm:items-center gap-4">
                    <div className="w-12 h-12 bg-eco-100 rounded-xl flex items-center justify-center text-2xl flex-shrink-0">
                      {job.category === "crafting" ? "✂️" : job.category === "collection" ? "🚛" : job.category === "design" ? "🎨" : "📦"}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex flex-wrap items-center gap-2 mb-1">
                        <h3 className="font-bold text-eco-900">{job.title}</h3>
                        <Badge className={`text-xs ${categoryColors[job.category]}`} variant="outline">{categoryLabels[job.category]}</Badge>
                      </div>
                      <p className="text-sm text-gray-600 font-medium">{job.company}</p>
                      <div className="flex flex-wrap gap-3 mt-2 text-xs text-gray-500">
                        <span className="flex items-center gap-1"><MapPin className="w-3.5 h-3.5" />{job.location}</span>
                        <span className="flex items-center gap-1"><Clock className="w-3.5 h-3.5" />{jobTypeLabel[job.job_type]}</span>
                        {job.age_preference && <span>👤 {job.age_preference}</span>}
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="font-bold text-eco-600 text-sm">{job.salary_range}</div>
                      <Button size="sm" className="mt-2">Apply Now</Button>
                    </div>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

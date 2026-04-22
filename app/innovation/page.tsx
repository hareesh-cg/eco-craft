"use client";
import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Lightbulb, Plus, Search, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { createClient } from "@/lib/supabase/client";
import { formatDate } from "@/lib/utils";
import type { Innovation } from "@/types";

export default function InnovationPage() {
  const [innovations, setInnovations] = useState<Innovation[]>([]);
  const [filtered, setFiltered] = useState<Innovation[]>([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState<Innovation | null>(null);

  useEffect(() => {
    createClient().from("innovations").select("*, author:profiles(full_name)").eq("status", "approved").order("created_at", { ascending: false })
      .then(({ data }) => { setInnovations(data || []); setFiltered(data || []); setLoading(false); });
  }, []);

  useEffect(() => {
    if (!search) { setFiltered(innovations); return; }
    setFiltered(innovations.filter((i) => i.title.toLowerCase().includes(search.toLowerCase()) || i.tags.some((t) => t.toLowerCase().includes(search.toLowerCase()))));
  }, [search, innovations]);

  return (
    <div className="min-h-screen bg-gray-50 pt-20 pb-12">
      <div className="eco-gradient py-12 px-4">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4 text-white">
          <div className="flex items-center gap-3">
            <Lightbulb className="w-8 h-8" />
            <div>
              <h1 className="text-4xl font-bold">Innovation Hub</h1>
              <p className="text-eco-100">Creative ideas born from plastic waste</p>
            </div>
          </div>
          <Link href="/innovation/submit">
            <Button size="lg" variant="amber" className="gap-2"><Plus className="w-5 h-5" /> Share Your Idea</Button>
          </Link>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="relative max-w-md mb-8">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <Input placeholder="Search by title or tag…" className="pl-10 bg-white" value={search} onChange={(e) => setSearch(e.target.value)} />
        </div>

        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(6)].map((_, i) => <div key={i} className="bg-white rounded-2xl h-80 animate-pulse" />)}
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filtered.map((inn) => (
              <Card key={inn.id} className="overflow-hidden card-hover cursor-pointer" onClick={() => setSelected(inn)}>
                <div className="relative h-52">
                  <Image src={inn.image_url || "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400&q=80"}
                    alt={inn.title} fill className="object-cover" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                  <div className="absolute bottom-3 left-3 right-3 flex flex-wrap gap-1">
                    {inn.tags.slice(0, 3).map((tag) => (
                      <span key={tag} className="text-xs bg-white/20 text-white backdrop-blur-sm px-2 py-0.5 rounded-full">{tag}</span>
                    ))}
                  </div>
                </div>
                <CardContent className="p-4">
                  <h3 className="font-bold text-eco-900 mb-1">{inn.title}</h3>
                  <p className="text-sm text-gray-500 line-clamp-2 mb-2">{inn.description}</p>
                  <div className="flex items-center justify-between text-xs text-gray-400">
                    <span>{(inn.author as { full_name: string } | undefined)?.full_name || "EcoCraft Community"}</span>
                    <span>{formatDate(inn.created_at)}</span>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>

      {/* Detail Modal */}
      {selected && (
        <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4" onClick={() => setSelected(null)}>
          <div className="bg-white rounded-2xl max-w-lg w-full shadow-2xl overflow-hidden" onClick={(e) => e.stopPropagation()}>
            <div className="relative h-56">
              <Image src={selected.image_url || "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=600&q=80"}
                alt={selected.title} fill className="object-cover" />
              <button onClick={() => setSelected(null)} className="absolute top-3 right-3 w-8 h-8 bg-black/40 rounded-full flex items-center justify-center text-white hover:bg-black/60">
                <X className="w-4 h-4" />
              </button>
            </div>
            <div className="p-6">
              <div className="flex flex-wrap gap-1 mb-3">
                {selected.tags.map((tag) => (
                  <span key={tag} className="text-xs bg-eco-100 text-eco-700 px-2 py-0.5 rounded-full">{tag}</span>
                ))}
              </div>
              <h2 className="text-xl font-bold text-eco-900 mb-3">{selected.title}</h2>
              <p className="text-gray-600 leading-relaxed text-sm mb-4">{selected.description}</p>
              <div className="flex items-center justify-between text-sm text-gray-400">
                <span>By {(selected.author as { full_name: string } | undefined)?.full_name || "EcoCraft Community"}</span>
                <span>{formatDate(selected.created_at)}</span>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

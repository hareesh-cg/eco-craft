import Image from "next/image";
import Link from "next/link";
import { Leaf, Target, Eye, Heart, Award, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

const team = [
  { name: "Anika Reddy", role: "Co-Founder & CEO", bio: "Environmental engineer passionate about circular economies. 8 years in waste management.", avatar: "A", color: "bg-eco-600" },
  { name: "Rohan Desai", role: "Co-Founder & CTO", bio: "Full-stack developer and sustainability advocate. Built the EcoCraft platform from the ground up.", avatar: "R", color: "bg-blue-600" },
  { name: "Meera Krishnan", role: "Head of Artisan Relations", bio: "Connects artisans with materials and buyers. Former NGO worker with 12 years of field experience.", avatar: "M", color: "bg-purple-600" },
  { name: "Suresh Babu", role: "Head of Operations", bio: "Manages waste collection networks across 6 cities. Logistics expert with green supply chain focus.", avatar: "S", color: "bg-amber-600" },
];

const timeline = [
  { year: "2021", title: "The Spark", desc: "EcoCraft was born out of a college project to reduce plastic waste in Bengaluru." },
  { year: "2022", title: "First Artisans", desc: "Partnered with 15 local artisans who began crafting products from collected waste." },
  { year: "2023", title: "Going Digital", desc: "Launched the digital marketplace, connecting sellers and buyers across India." },
  { year: "2024", title: "Job Portal", desc: "Introduced the Green Job Board, creating employment for 180+ individuals." },
  { year: "2025", title: "Innovation Hub", desc: "Opened the Innovation Hub to crowdsource recycling ideas from the community." },
];

const impacts = [
  { value: "5.8T", label: "Plastic Diverted from Landfills" },
  { value: "240+", label: "Upcycled Products Listed" },
  { value: "180+", label: "Green Jobs Created" },
  { value: "6", label: "Cities Covered" },
];

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-gray-50 pt-16">
      {/* Hero */}
      <section className="eco-gradient py-20 px-4 text-white">
        <div className="max-w-4xl mx-auto text-center">
          <Badge className="mb-4 bg-white/20 text-white border-white/30">Our Story</Badge>
          <h1 className="text-5xl font-bold mb-5 leading-tight">We Believe Plastic Waste<br />is a Misplaced Resource</h1>
          <p className="text-eco-100 text-xl max-w-2xl mx-auto leading-relaxed">
            EcoCraft was founded on a simple idea: every piece of plastic thrown away is raw material for something beautiful. We built a platform to make that possible at scale.
          </p>
        </div>
      </section>

      {/* Mission & Vision */}
      <section className="py-20 bg-white">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 grid md:grid-cols-2 gap-8">
          <Card className="p-8 border-eco-200">
            <div className="w-12 h-12 bg-eco-100 rounded-xl flex items-center justify-center mb-5">
              <Target className="w-6 h-6 text-eco-600" />
            </div>
            <h2 className="text-2xl font-bold text-eco-900 mb-3">Our Mission</h2>
            <p className="text-gray-600 leading-relaxed">
              To reduce plastic waste reaching landfills and oceans by creating a circular economy — where waste sellers, artisan crafters, eco-conscious buyers, and green employers are all connected in one platform.
            </p>
          </Card>
          <Card className="p-8 border-eco-200">
            <div className="w-12 h-12 bg-amber-100 rounded-xl flex items-center justify-center mb-5">
              <Eye className="w-6 h-6 text-amber-600" />
            </div>
            <h2 className="text-2xl font-bold text-eco-900 mb-3">Our Vision</h2>
            <p className="text-gray-600 leading-relaxed">
              A future where no plastic goes to waste, where artisans in every Indian city earn a living from upcycling, and where sustainability is not a luxury but a community-wide way of life.
            </p>
          </Card>
        </div>
      </section>

      {/* Impact */}
      <section className="py-16 eco-gradient-light">
        <div className="max-w-5xl mx-auto px-4 text-center">
          <Badge variant="secondary" className="mb-4">Our Impact</Badge>
          <h2 className="text-3xl font-bold text-eco-900 mb-10">Numbers That Speak</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {impacts.map((imp) => (
              <div key={imp.label} className="bg-white rounded-2xl p-6 shadow-sm">
                <div className="text-3xl font-bold text-eco-600 mb-1">{imp.value}</div>
                <div className="text-sm text-gray-500">{imp.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Timeline */}
      <section className="py-20 bg-white">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <Badge variant="secondary" className="mb-3">Our Journey</Badge>
            <h2 className="text-3xl font-bold text-eco-900">How EcoCraft Grew</h2>
          </div>
          <div className="relative">
            <div className="absolute left-8 top-0 bottom-0 w-0.5 bg-eco-100" />
            <div className="space-y-8">
              {timeline.map((t, i) => (
                <div key={t.year} className="relative flex gap-6 pl-20">
                  <div className="absolute left-5 w-6 h-6 bg-eco-600 rounded-full flex items-center justify-center">
                    <div className="w-2 h-2 bg-white rounded-full" />
                  </div>
                  <div>
                    <div className="text-sm font-bold text-eco-600 mb-0.5">{t.year}</div>
                    <h3 className="font-bold text-eco-900">{t.title}</h3>
                    <p className="text-gray-500 text-sm mt-1">{t.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Team */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <Badge variant="secondary" className="mb-3">The Team</Badge>
            <h2 className="text-3xl font-bold text-eco-900">People Behind EcoCraft</h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {team.map((member) => (
              <Card key={member.name} className="p-6 text-center card-hover">
                <div className={`w-16 h-16 ${member.color} rounded-2xl flex items-center justify-center text-white text-2xl font-bold mx-auto mb-4`}>
                  {member.avatar}
                </div>
                <h3 className="font-bold text-eco-900">{member.name}</h3>
                <p className="text-eco-600 text-sm font-medium mb-2">{member.role}</p>
                <p className="text-gray-500 text-xs leading-relaxed">{member.bio}</p>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 eco-gradient text-white text-center px-4">
        <Heart className="w-12 h-12 mx-auto mb-4 text-eco-200" />
        <h2 className="text-3xl font-bold mb-3">Join Our Movement</h2>
        <p className="text-eco-100 mb-8 max-w-lg mx-auto">Every product you buy, every kilogram of waste you sell, every job you fill — it all adds up to a cleaner, greener India.</p>
        <Link href="/auth/signup">
          <Button size="lg" variant="amber" className="gap-2">Get Started <ArrowRight className="w-5 h-5" /></Button>
        </Link>
      </section>
    </div>
  );
}

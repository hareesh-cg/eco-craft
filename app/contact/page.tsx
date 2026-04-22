"use client";
import { useState } from "react";
import { Mail, Phone, MapPin, Clock, CheckCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { toast } from "sonner";

const contactInfo = [
  { icon: Mail, label: "Email", value: "hello@ecocraft.in", sub: "Reply within 24 hours" },
  { icon: Phone, label: "Phone", value: "+91 98765 43210", sub: "Mon–Sat, 9am–6pm" },
  { icon: MapPin, label: "Address", value: "12, MG Road, Bengaluru, Karnataka 560001", sub: "Head Office" },
  { icon: Clock, label: "Working Hours", value: "Mon–Sat: 9am – 6pm", sub: "Closed on Sundays" },
];

export default function ContactPage() {
  const [form, setForm] = useState({ name: "", email: "", subject: "", message: "" });
  const [sent, setSent] = useState(false);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSent(true);
    toast.success("Message sent! We'll reply within 24 hours.");
    setForm({ name: "", email: "", subject: "", message: "" });
  }

  return (
    <div className="min-h-screen bg-gray-50 pt-16">
      {/* Header */}
      <div className="eco-gradient py-16 px-4 text-white text-center">
        <Badge className="mb-4 bg-white/20 text-white border-white/30">Get in Touch</Badge>
        <h1 className="text-4xl font-bold mb-3">Contact Us</h1>
        <p className="text-eco-100 max-w-xl mx-auto">Have a question, partnership idea, or just want to say hello? We&apos;d love to hear from you.</p>
      </div>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid lg:grid-cols-2 gap-12">
          {/* Form */}
          <div>
            <h2 className="text-2xl font-bold text-eco-900 mb-6">Send a Message</h2>
            {sent ? (
              <div className="flex flex-col items-center justify-center py-16 text-center">
                <div className="w-16 h-16 bg-eco-100 rounded-full flex items-center justify-center mb-4">
                  <CheckCircle className="w-9 h-9 text-eco-600" />
                </div>
                <h3 className="text-xl font-bold text-eco-900 mb-2">Message Sent!</h3>
                <p className="text-gray-500 mb-6">Thank you for reaching out. We&apos;ll get back to you within 24 hours.</p>
                <Button onClick={() => setSent(false)}>Send Another</Button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-5">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <Label htmlFor="name">Full Name</Label>
                    <Input id="name" placeholder="Priya Sharma" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} required />
                  </div>
                  <div className="space-y-1.5">
                    <Label htmlFor="email">Email</Label>
                    <Input id="email" type="email" placeholder="you@example.com" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} required />
                  </div>
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="subject">Subject</Label>
                  <Input id="subject" placeholder="How can we help?" value={form.subject} onChange={(e) => setForm({ ...form, subject: e.target.value })} required />
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="message">Message</Label>
                  <Textarea id="message" rows={6} placeholder="Write your message here…" value={form.message} onChange={(e) => setForm({ ...form, message: e.target.value })} required />
                </div>
                <Button type="submit" size="lg" className="w-full">Send Message</Button>
                <p className="text-xs text-gray-400 text-center">No email is actually sent — demo only.</p>
              </form>
            )}
          </div>

          {/* Info */}
          <div className="space-y-5">
            <h2 className="text-2xl font-bold text-eco-900 mb-6">Contact Information</h2>
            {contactInfo.map(({ icon: Icon, label, value, sub }) => (
              <Card key={label} className="p-5 flex items-start gap-4">
                <div className="w-10 h-10 bg-eco-100 rounded-xl flex items-center justify-center flex-shrink-0">
                  <Icon className="w-5 h-5 text-eco-600" />
                </div>
                <div>
                  <div className="text-xs text-gray-400 font-medium uppercase tracking-wide">{label}</div>
                  <div className="font-semibold text-eco-900 mt-0.5">{value}</div>
                  <div className="text-xs text-gray-500 mt-0.5">{sub}</div>
                </div>
              </Card>
            ))}

            {/* Map Placeholder */}
            <div className="relative h-52 rounded-2xl overflow-hidden bg-eco-50 border border-eco-100 flex items-center justify-center">
              <div className="text-center text-eco-400">
                <MapPin className="w-10 h-10 mx-auto mb-2" />
                <p className="text-sm font-medium">Bengaluru, Karnataka</p>
                <p className="text-xs">Google Maps placeholder</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

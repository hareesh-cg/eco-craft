import Link from "next/link";
import { Leaf, Facebook, Twitter, Instagram, Youtube, Mail, Phone, MapPin } from "lucide-react";

const links = {
  Platform: [
    { href: "/shop", label: "Shop Products" },
    { href: "/waste", label: "Sell Waste" },
    { href: "/jobs", label: "Find Jobs" },
    { href: "/innovation", label: "Innovation" },
  ],
  Company: [
    { href: "/about", label: "About Us" },
    { href: "/contact", label: "Contact" },
    { href: "/admin", label: "Admin Panel" },
  ],
};

const socials = [
  { icon: Facebook, href: "#", label: "Facebook" },
  { icon: Twitter, href: "#", label: "Twitter" },
  { icon: Instagram, href: "#", label: "Instagram" },
  { icon: Youtube, href: "#", label: "YouTube" },
];

export default function Footer() {
  return (
    <footer className="bg-eco-900 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-16 pb-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 mb-12">
          {/* Brand */}
          <div className="lg:col-span-2">
            <Link href="/" className="flex items-center gap-2 mb-4">
              <div className="w-9 h-9 bg-eco-500 rounded-lg flex items-center justify-center">
                <Leaf className="w-5 h-5 text-white" />
              </div>
              <span className="text-2xl font-bold">EcoCraft</span>
            </Link>
            <p className="text-eco-200 text-sm leading-relaxed mb-6 max-w-sm">
              Turning plastic waste into beautiful futures. We connect waste sellers, buyers,
              job seekers, and innovators to create a circular economy.
            </p>
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-eco-300 text-sm">
                <Mail className="w-4 h-4" />
                <span>hello@ecocraft.in</span>
              </div>
              <div className="flex items-center gap-2 text-eco-300 text-sm">
                <Phone className="w-4 h-4" />
                <span>+91 98765 43210</span>
              </div>
              <div className="flex items-center gap-2 text-eco-300 text-sm">
                <MapPin className="w-4 h-4" />
                <span>Bengaluru, Karnataka, India</span>
              </div>
            </div>
          </div>

          {/* Links */}
          {Object.entries(links).map(([section, items]) => (
            <div key={section}>
              <h4 className="font-semibold text-white mb-4">{section}</h4>
              <ul className="space-y-2">
                {items.map((item) => (
                  <li key={item.href}>
                    <Link href={item.href} className="text-eco-300 hover:text-white text-sm transition-colors">
                      {item.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="border-t border-eco-700 pt-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-eco-400 text-sm">
            © {new Date().getFullYear()} EcoCraft. All rights reserved. Built for a greener planet.
          </p>
          <div className="flex items-center gap-3">
            {socials.map(({ icon: Icon, href, label }) => (
              <a
                key={label}
                href={href}
                aria-label={label}
                className="w-8 h-8 bg-eco-700 hover:bg-eco-500 rounded-lg flex items-center justify-center transition-colors"
              >
                <Icon className="w-4 h-4" />
              </a>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}

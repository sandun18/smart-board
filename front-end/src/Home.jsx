import React from 'react';
import { 
  Search, Shield, TrendingUp, Star, 
  MessageSquare, Headphones, Zap,
  Facebook, Twitter, Instagram, Linkedin, 
  MapPin, Phone, Mail 
} from 'lucide-react';


// ================= FEATURES =================
const Features = () => {
  const features = [
    { icon: <Search className="w-8 h-8" />, title: "Smart Search", desc: "Advanced filters to find what you need.", badge: "Instant Results" },
    { icon: <Shield className="w-8 h-8" />, title: "Secure Payments", desc: "Encrypted and safe transactions.", badge: "100% Secure" },
    { icon: <TrendingUp className="w-8 h-8" />, title: "Owner Dashboard", desc: "Manage bookings and payments easily.", badge: "Real-time Analytics" },
    { icon: <Star className="w-8 h-8" />, title: "Verified Reviews", desc: "Real feedback from real students.", badge: "Authentic Feedback" },
    { icon: <MessageSquare className="w-8 h-8" />, title: "Direct Messaging", desc: "Chat securely with owners.", badge: "Live Chat" },
    { icon: <Headphones className="w-8 h-8" />, title: "24/7 Support", desc: "We are always here for you.", badge: "Always Available" },
  ];

  return (
    <section className="py-24 bg-orange-50">
      <div className="max-w-7xl mx-auto px-8">
        <h2 className="text-4xl font-bold text-center mb-12">
          Everything You Need for Perfect Boarding
        </h2>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <div key={index} className="bg-white p-8 rounded-3xl shadow-lg">
              <div className="w-20 h-20 bg-gradient-to-br from-red-500 to-orange-500 rounded-2xl flex items-center justify-center text-white mx-auto mb-6">
                {feature.icon}
              </div>
              <h3 className="text-xl font-bold text-center mb-4">{feature.title}</h3>
              <p className="text-gray-600 text-center mb-6">{feature.desc}</p>
              <div className="flex justify-center gap-2 bg-orange-50 px-4 py-2 rounded-full text-sm text-red-500 font-medium">
                <Zap className="w-4 h-4" />
                {feature.badge}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};


// ================= FOOTER =================
const Footer = () => {
  return (
    <footer className="bg-gray-900 text-white py-16">
      <div className="max-w-7xl mx-auto px-8 grid md:grid-cols-4 gap-12">

        <div>
          <h3 className="text-xl font-bold mb-4">SmartBoAD</h3>
          <p className="text-white/70">
            Smart solution for university boarding management.
          </p>
        </div>

        <div>
          <h4 className="font-bold mb-4">Quick Links</h4>
          <ul className="space-y-2 text-white/70">
            <li>Home</li>
            <li>Features</li>
            <li>Contact</li>
          </ul>
        </div>

        <div>
          <h4 className="font-bold mb-4">Contact</h4>
          <p className="flex items-center gap-2 text-white/70">
            <MapPin size={16}/> Colombo
          </p>
          <p className="flex items-center gap-2 text-white/70">
            <Phone size={16}/> +94 11 234 5678
          </p>
          <p className="flex items-center gap-2 text-white/70">
            <Mail size={16}/> info@smartboad.com
          </p>
        </div>

        <div className="flex gap-4 items-start">
          <Facebook />
          <Twitter />
          <Instagram />
          <Linkedin />
        </div>

      </div>

      <div className="text-center mt-10 text-white/60">
        © 2024 SmartBoAD. All rights reserved.
      </div>
    </footer>
  );
};


// ✅ Named Export
export { Features, Footer };
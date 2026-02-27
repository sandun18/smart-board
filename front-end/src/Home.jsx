import React from 'react';
import { Search, Shield, TrendingUp, Star, MessageSquare, Headphones, Zap } from 'lucide-react';

// Features Section
const Features = () => {
  const features = [
    { icon: <Search className="w-8 h-8" />, title: "Smart Search", desc: "Advanced filters by location, gender, price range, and amenities to find exactly what you need.", badge: "Instant Results" },
    { icon: <Shield className="w-8 h-8" />, title: "Secure Payments", desc: "End-to-end encrypted payments with escrow protection for both students and owners.", badge: "100% Secure" },
    { icon: <TrendingUp className="w-8 h-8" />, title: "Owner Dashboard", desc: "Complete management suite for owners with booking, payments, and analytics tools.", badge: "Real-time Analytics" },
    { icon: <Star className="w-8 h-8" />, title: "Verified Reviews", desc: "Real reviews from verified students to help you make informed decisions.", badge: "Authentic Feedback" },
    { icon: <MessageSquare className="w-8 h-8" />, title: "Direct Messaging", desc: "Communicate securely with owners or tenants through our encrypted messaging system.", badge: "Live Chat" },
    { icon: <Headphones className="w-8 h-8" />, title: "24/7 Support", desc: "Round-the-clock customer support for all your boarding-related queries and issues.", badge: "Always Available" },
  ];

  return (
    <section id="features" className="py-24 bg-orange-50">
      <div className="max-w-7xl mx-auto px-8">
        <div className="text-center mb-16">
          <div className="inline-block bg-gradient-to-r from-red-500 to-red-600 text-white px-6 py-2 rounded-full text-sm font-semibold mb-4">
            Why Choose Us
          </div>
          <h2 className="text-5xl font-extrabold text-gray-900 mb-4">Everything You Need for Perfect Boarding</h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">Smart tools designed for students, boarding owners, and university administrators</p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <div key={index} className="bg-white p-8 rounded-3xl shadow-lg border border-gray-200 hover:shadow-2xl hover:-translate-y-2 transition-all duration-300 relative overflow-hidden group">
              <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-red-500 to-orange-500"></div>
              <div className="w-20 h-20 bg-gradient-to-br from-red-500 to-orange-500 rounded-2xl flex items-center justify-center text-white mx-auto mb-6 shadow-lg group-hover:scale-110 transition-transform">
                {feature.icon}
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-4 text-center">{feature.title}</h3>
              <p className="text-gray-600 mb-6 text-center leading-relaxed">{feature.desc}</p>
              <div className="flex items-center justify-center gap-2 bg-orange-50 px-4 py-2 rounded-full text-sm text-red-500 font-medium">
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

export default Features;
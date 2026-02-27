import React, { useState } from 'react';
import { 
  Search, Shield, TrendingUp, Star, 
  MessageSquare, Headphones, Zap,
  Facebook, Twitter, Instagram, Linkedin, 
  MapPin, Phone, Mail, Megaphone, Menu, X 
} from 'lucide-react';


const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <nav className="fixed top-5 left-1/2 -translate-x-1/2 z-50 w-[92%] max-w-[1300px]">
      <div className="bg-white/88 backdrop-blur-xl rounded-3xl shadow-lg border border-white/25 px-10 py-6">
        <div className="flex justify-between items-center">
          <a href="/" className="flex items-center gap-3">
            <div className="w-12 h-12 bg-gradient-to-br from-red-500 to-orange-500 rounded-xl flex items-center justify-center text-white font-bold text-xl">
              SB
            </div>
            <span className="text-2xl font-extrabold bg-gradient-to-r from-red-500 to-orange-500 bg-clip-text text-transparent">
              SmartBoAD
            </span>
          </a>

          <div className="hidden lg:flex items-center gap-10">
            <a href="#" className="text-gray-800 hover:text-red-500 font-medium transition-colors">Home</a>
            <a href="#features" className="text-gray-800 hover:text-red-500 font-medium transition-colors">Features</a>
            <a href="#contact" className="text-gray-800 hover:text-red-500 font-medium transition-colors">Contact</a>
          </div>

          <div className="hidden lg:flex items-center gap-4">
            <button className="px-6 py-3 border-2 border-red-500 text-red-500 rounded-2xl font-semibold hover:bg-red-500 hover:text-white transition-all">
              Login
            </button>
            <button className="px-6 py-3 bg-gradient-to-r from-red-500 to-red-600 text-white rounded-2xl font-semibold hover:shadow-lg hover:-translate-y-0.5 transition-all">
              Sign Up
            </button>
          </div>

          <button onClick={() => setIsOpen(!isOpen)} className="lg:hidden">
            {isOpen ? <X size={28} /> : <Menu size={28} />}
          </button>
        </div>

        {isOpen && (
          <div className="lg:hidden mt-6 pt-6 border-t border-gray-200 flex flex-col gap-4">
            <a href="#" className="text-gray-800">Home</a>
            <a href="#features" className="text-gray-800">Features</a>
            <button className="w-full px-6 py-3 border-2 border-red-500 text-red-500 rounded-2xl">Login</button>
          </div>
        )}
      </div>
    </nav>
  );
};


const Hero = () => {
  return (
    <section className="pt-56 pb-24 bg-gradient-to-br from-orange-50 to-orange-100 relative overflow-hidden">
      <div className="absolute top-0 right-0 w-2/5 h-full bg-gradient-to-bl from-red-500/10 to-transparent"></div>
      <div className="max-w-7xl mx-auto px-8">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          <div className="space-y-8">
            <div className="inline-block bg-gradient-to-r from-red-500 to-red-600 text-white px-6 py-2 rounded-full text-sm font-semibold shadow-md">
              <Star className="inline w-4 h-4 mr-2" /> #1 Boarding Platform
            </div>
            <h1 className="text-5xl lg:text-6xl font-extrabold leading-tight text-gray-900">
              Find Your Perfect Boarding <br />
              <span className="bg-gradient-to-r from-red-500 to-orange-500 bg-clip-text text-transparent">Near Your University</span>
            </h1>
            <p className="text-xl text-gray-600 max-w-lg">
              Join thousands of students who found their ideal boarding through our verified platform.
            </p>
            <div className="flex flex-wrap gap-4">
              <button className="px-8 py-4 bg-gradient-to-r from-red-500 to-red-600 text-white rounded-2xl font-semibold flex items-center gap-2">
                <Search className="w-5 h-5" /> Find Boarding Now
              </button>
              <button className="px-8 py-4 bg-gradient-to-r from-orange-500 to-orange-600 text-white rounded-2xl font-semibold flex items-center gap-2">
                <Megaphone className="w-5 h-5" /> Advertise Here
              </button>
            </div>
          </div>
          <div className="relative">
            <img 
              src="https://images.unsplash.com/photo-1562774053-701939374585?auto=format&fit=crop&w=1000&q=80"
              alt="Student accommodation"
              className="rounded-3xl shadow-2xl border-8 border-white"
            />
          </div>
        </div>
      </div>
    </section>
  );
};

const SearchSection = () => {
  return (
    <section className="relative -mt-16 z-10 mb-20">
      <div className="max-w-5xl mx-auto px-8">
        <div className="bg-white rounded-3xl shadow-2xl p-12 border border-gray-200">
          <div className="text-center mb-10">
            <h2 className="text-4xl font-bold text-gray-900 mb-3">Find Your Perfect Boarding</h2>
            <p className="text-xl text-gray-600">Discover verified, safe, and affordable boarding options near campus</p>
          </div>

          <div className="space-y-6">
            <div className="flex flex-col lg:flex-row gap-4">
              <div className="flex-1 relative">
                <MapPin className="absolute left-6 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="text"
                  placeholder="Enter university or location..."
                  className="w-full pl-14 pr-6 py-4 border-2 border-gray-200 rounded-2xl focus:border-red-500 focus:outline-none focus:ring-4 focus:ring-red-500/20 transition-all"
                />
              </div>
              <button className="px-10 py-4 bg-gradient-to-r from-red-500 to-red-600 text-white rounded-2xl font-semibold hover:shadow-xl hover:-translate-y-1 transition-all flex items-center justify-center gap-2">
                <Search className="w-5 h-5" />
                Search Boardings
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-2">
                  <Tag className="w-4 h-4" /> Price Range
                </label>
                <select className="w-full px-4 py-3 border-2 border-gray-200 rounded-2xl focus:border-red-500 focus:outline-none">
                  <option>Any Price</option>
                  <option>$100 - $300/month</option>
                  <option>$300 - $600/month</option>
                  <option>$600+/month</option>
                </select>
              </div>
              <div>
                <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-2">
                  <Bed className="w-4 h-4" /> Room Type
                </label>
                <select className="w-full px-4 py-3 border-2 border-gray-200 rounded-2xl focus:border-red-500 focus:outline-none">
                  <option>Any Type</option>
                  <option>Single Room</option>
                  <option>Shared Room</option>
                  <option>Apartment</option>
                </select>
              </div>
              <div>
                <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-2">
                  <Wifi className="w-4 h-4" /> Amenities
                </label>
                <select className="w-full px-4 py-3 border-2 border-gray-200 rounded-2xl focus:border-red-500 focus:outline-none">
                  <option>Any Amenities</option>
                  <option>WiFi Included</option>
                  <option>Laundry</option>
                  <option>Kitchen Access</option>
                </select>
              </div>
            </div>

            <div className="text-center pt-4">
              <p className="text-gray-600 mb-3">Popular Searches:</p>
              <div className="flex flex-wrap justify-center gap-3">
                {['University of Colombo', 'Kandy', 'Galle', 'Near Campus', 'Girls Only'].map((tag) => (
                  <span key={tag} className="px-5 py-2 bg-orange-50 text-gray-700 rounded-full text-sm hover:bg-red-500 hover:text-white cursor-pointer transition-all">
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default SearchSection;


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
    <section id="features" className="py-24 bg-orange-50">
      <div className="max-w-7xl mx-auto px-8">
        <h2 className="text-4xl font-bold text-center mb-12">Everything You Need for Perfect Boarding</h2>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((f, i) => (
            <div key={i} className="bg-white p-8 rounded-3xl shadow-lg hover:shadow-xl transition-shadow">
              <div className="w-16 h-16 bg-gradient-to-br from-red-500 to-orange-500 rounded-2xl flex items-center justify-center text-white mb-6">
                {f.icon}
              </div>
              <h3 className="text-xl font-bold mb-4">{f.title}</h3>
              <p className="text-gray-600 mb-6">{f.desc}</p>
              <div className="inline-flex items-center gap-2 bg-orange-50 px-4 py-2 rounded-full text-sm text-red-500 font-medium">
                <Zap className="w-4 h-4" /> {f.badge}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};


const Footer = () => {
  return (
    <footer id="contact" className="bg-gray-900 text-white py-16">
      <div className="max-w-7xl mx-auto px-8 grid md:grid-cols-4 gap-12">
        <div>
          <h3 className="text-xl font-bold mb-4 text-orange-500">SmartBoAD</h3>
          <p className="text-white/70">Smart solution for university boarding management.</p>
        </div>
        <div>
          <h4 className="font-bold mb-4">Quick Links</h4>
          <ul className="space-y-2 text-white/70">
            <li><a href="#" className="hover:text-orange-500">Home</a></li>
            <li><a href="#features" className="hover:text-orange-500">Features</a></li>
          </ul>
        </div>
        <div>
          <h4 className="font-bold mb-4">Contact</h4>
          <p className="flex items-center gap-2 text-white/70 mb-2"><MapPin size={16}/> Colombo</p>
          <p className="flex items-center gap-2 text-white/70 mb-2"><Phone size={16}/> +94 11 234 5678</p>
          <p className="flex items-center gap-2 text-white/70"><Mail size={16}/> info@smartboad.com</p>
        </div>
        <div className="flex gap-4">
          <Facebook className="hover:text-orange-500 cursor-pointer" />
          <Twitter className="hover:text-orange-500 cursor-pointer" />
          <Instagram className="hover:text-orange-500 cursor-pointer" />
          <Linkedin className="hover:text-orange-500 cursor-pointer" />
        </div>
      </div>
      <div className="text-center mt-10 text-white/60 border-t border-white/10 pt-8">
        © 2024 SmartBoAD. All rights reserved.
      </div>
    </footer>
  );
};


const Home = () => {
  return (
    <div className="min-h-screen">
      <Navbar />
      <Hero />
      <Features />
      <Footer />
    </div>
  );
};

export default Home;
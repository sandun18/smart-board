import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import logo from './assets/logo.png';
import backgroundImage from './assets/s5.jpg';
import BoardingCard from './components/student/search/BoardingCard';

import StudentService from './api/student/StudentService';
import AdminService from './api/admin/AdminService';
import { sampleBoardings } from './data/student/searchBoardingsData';

const Home = () => {
  const navigate = useNavigate();
  
  // Search State
  const [searchQuery, setSearchQuery] = useState('');
  
  // Boarding States
  const [boardings, setBoardings] = useState([]);
  const [loadingBoardings, setLoadingBoardings] = useState(false);
  const [page, setPage] = useState(0);
  const [pageSize] = useState(6);
  const [totalPages, setTotalPages] = useState(0);
  const [filters, setFilters] = useState({
    minPrice: 0, maxPrice: 50000, gender: 'any', roomType: 'any'
  });
  
  // Ad States
  const [approvedAds, setApprovedAds] = useState([]);
  const [loadingAds, setLoadingAds] = useState(false);


  const fetchBoardings = async (p = page, size = pageSize) => {
    setLoadingBoardings(true);
    try {
      const searchFilters = {
        searchQuery: searchQuery || '',
        minPrice: filters.minPrice,
        maxPrice: filters.maxPrice,
        gender: filters.gender,
        roomTypes: filters.roomType === 'any' ? [] : [filters.roomType]
      };
      const data = await StudentService.searchBoardings(searchFilters, p, size);
      const list = Array.isArray(data) ? data : (data.content || []);
      
      if (!list || list.length === 0) {
        setBoardings(sampleBoardings.slice(0, size));
        setTotalPages(1);
      } else {
        setBoardings(list);
        setTotalPages(data.totalPages || 1);
      }
    } catch (e) {
      setBoardings(sampleBoardings.slice(0, size));
      setTotalPages(1);
    } finally {
      setLoadingBoardings(false);
    }
  };

  const fetchApprovedAds = async () => {
    setLoadingAds(true);
    try {
      const campaigns = await AdminService.getCampaigns();
      const now = new Date();
      const filteredAds = (campaigns || []).filter(ad => {
        if (ad.status !== 'ACTIVE') return false;
        if (!ad.targetPanels || !ad.targetPanels.includes('PUBLIC_DASHBOARD')) return false;
        if (ad.expiryDate) {
          const expiryDate = new Date(ad.expiryDate);
          if (expiryDate < now) return false;
        }
        return true;
      });
      setApprovedAds(filteredAds);
    } catch (error) {
      console.error('Failed to fetch approved ads:', error);
      setApprovedAds([]);
    } finally {
      setLoadingAds(false);
    }
  };



  useEffect(() => {
    fetchBoardings();
    fetchApprovedAds();
    
    const interval = setInterval(() => {
      fetchApprovedAds();
    }, 2 * 60 * 1000);
    
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="min-h-screen relative overflow-hidden font-sans">
      {/* Background */}
      <div
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{
          backgroundImage: `url(${backgroundImage})`,
          filter: "blur(8px)",
          transform: "scale(1.1)",
        }}
      />
      <div className="absolute inset-0 bg-gradient-to-br from-primary/30 via-accent/20 to-primary/30 backdrop-blur-sm" />

      {/* Content */}
      <div className="relative z-10 min-h-screen flex flex-col">
        {/* Header */}
        <motion.header
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="w-full p-4 md:p-8"
        >
          <div className="max-w-6xl mx-auto bg-white/95 backdrop-blur-md border border-white/20 py-4 px-6 rounded-2xl shadow-2xl flex items-center justify-between">
            <div className="flex items-center gap-3">
              <img src={logo} alt="SmartBoAD" className="h-10 w-10 rounded-lg shadow-inner" />
              <h1 className="text-2xl font-black bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent tracking-tight">
                SmartBoAD
              </h1>
            </div>
            <div className="flex items-center gap-3">
              <button
                onClick={() => navigate('/signup')}
                className="px-6 py-2 bg-gradient-to-r from-primary to-accent hover:opacity-90 text-white rounded-xl transition-all font-bold text-sm"
              >
                Sign Up
              </button>
              <button
                onClick={() => navigate('/login')}
                className="px-6 py-2 bg-gradient-to-r from-primary to-accent hover:opacity-90 text-white rounded-xl transition-all font-bold text-sm"
              >
                Login
              </button>
            </div>
          </div>
        </motion.header>

        {/* Hero */}
        <section className="text-center py-12 px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <h2 className="text-5xl md:text-7xl font-extrabold text-white mb-6 leading-tight drop-shadow-lg">
              Welcome To <span className="text-white">SmartBoAD</span>
            </h2>
            <p className="text-xl text-white/90 max-w-2xl mx-auto font-medium">
              The premier destination for student boarding and property advertising.
            </p>
          </motion.div>
        </section>

        {/* Main */}
        <main className="flex-1 px-4 md:px-8 pb-8">
          <div className="max-w-7xl mx-auto space-y-8">
            {/* Search Section */}
            <motion.section
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
            >
              <div className="bg-white/95 backdrop-blur-md rounded-3xl shadow-2xl p-8 border border-white/20">
                <h3 className="text-2xl font-bold text-text-dark mb-6">Find Your Boarding</h3>
                
                <div className="flex flex-col md:flex-row gap-4 mb-8">
                  <input
                    type="text"
                    placeholder="Where do you want to stay?"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="flex-1 px-5 py-4 bg-white border border-gray-300 rounded-2xl focus:outline-none focus:ring-2 focus:ring-primary text-text-dark placeholder:text-gray-400"
                  />
                  <button
                    onClick={() => fetchBoardings()}
                    className="px-8 py-4 bg-gradient-to-r from-primary to-accent hover:opacity-90 text-white rounded-2xl font-bold transition-all shadow-lg transform hover:-translate-y-1"
                  >
                    Search Now
                  </button>
                </div>

                <div className="flex flex-wrap gap-6 items-end border-t border-gray-200 pt-8 text-text-dark">
                  <div className="space-y-2">
                    <label className="text-xs font-bold uppercase tracking-wider text-gray-600">Price Range (LKR)</label>
                    <div className="flex gap-2">
                      <input type="number" placeholder="Min" value={filters.minPrice} onChange={(e)=>setFilters(prev=>({...prev, minPrice: Number(e.target.value)}))} className="w-28 px-3 py-2 bg-white border border-gray-300 rounded-xl text-sm" />
                      <input type="number" placeholder="Max" value={filters.maxPrice} onChange={(e)=>setFilters(prev=>({...prev, maxPrice: Number(e.target.value)}))} className="w-28 px-3 py-2 bg-white border border-gray-300 rounded-xl text-sm" />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="text-xs font-bold uppercase tracking-wider text-gray-600">Gender</label>
                    <select value={filters.gender} onChange={(e)=>setFilters(prev=>({...prev, gender: e.target.value}))} className="w-32 px-3 py-2 bg-white border border-gray-300 rounded-xl text-sm appearance-none cursor-pointer">
                      <option value="any">Any</option>
                      <option value="male">Male</option>
                      <option value="female">Female</option>
                    </select>
                  </div>

                  <div className="space-y-2">
                    <label className="text-xs font-bold uppercase tracking-wider text-gray-600">Room Type</label>
                    <select value={filters.roomType} onChange={(e)=>setFilters(prev=>({...prev, roomType: e.target.value}))} className="w-32 px-3 py-2 bg-white border border-gray-300 rounded-xl text-sm appearance-none cursor-pointer">
                      <option value="any">Any</option>
                      <option value="single">Single</option>
                      <option value="shared">Shared</option>
                      <option value="apartment">Apartment</option>
                    </select>
                  </div>

                  <button onClick={() => { setPage(0); fetchBoardings(0, pageSize); }} className="ml-auto px-4 h-9 text-sm bg-gradient-to-r from-primary to-accent text-white rounded-xl font-bold hover:opacity-90 transition-all flex items-center justify-center self-end">
                    Apply
                  </button>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mt-12">
                  {loadingBoardings ? (
                    <div className="col-span-full text-center py-20 text-gray-600 font-medium animate-pulse">Loading listings...</div>
                  ) : (
                    boardings.map((b) => (
                      <div key={b.id} className="transform hover:scale-[1.02] transition-transform">
                        <BoardingCard boarding={{
                          ...b,
                          name: b.name || b.title || 'Boarding',
                          price: b.price || b.monthlyRent || b.pricePerMonth || 0,
                          image: b.image || (b.images && b.images[0]) || (b.imageUrls && b.imageUrls[0]) || '',
                          location: b.location || b.address || '',
                          amenities: b.amenities || b.features || [],
                          badge: b.badge || (b.isBoosted ? 'Featured' : null),
                        }} />
                      </div>
                    ))
                  )}
                </div>

                <div className="flex items-center justify-between mt-12 pt-8 border-t border-gray-200">
                  <div className="flex gap-4">
                    <button
                      onClick={() => { if (page > 0) { setPage(p => p - 1); fetchBoardings(page - 1, pageSize); } }}
                      disabled={page <= 0}
                      className="px-5 py-2 bg-white text-text-dark rounded-xl disabled:opacity-30 border border-gray-300 hover:bg-gray-50"
                    >Previous</button>
                    <button
                      onClick={() => { if (page + 1 < totalPages) { setPage(p => p + 1); fetchBoardings(page + 1, pageSize); } }}
                      disabled={page + 1 >= (totalPages || 1)}
                      className="px-5 py-2 bg-white text-text-dark rounded-xl disabled:opacity-30 border border-gray-300 hover:bg-gray-50"
                    >Next</button>
                  </div>
                  <span className="text-gray-600 text-sm font-bold uppercase tracking-widest">Page {page + 1} / {totalPages || 1}</span>
                </div>
              </div>
            </motion.section>



            {/* Sponsors */}
            {!loadingAds && approvedAds && approvedAds.length > 0 && (
              <motion.section initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }}>
                <h3 className="text-3xl font-black text-white mb-8 text-center">Featured Sponsors</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {approvedAds.slice(0, 6).map((ad) => (
                    <motion.a key={ad.id} href={ad.redirectUrl || '#'} target={ad.redirectUrl ? '_blank' : undefined} rel={ad.redirectUrl ? 'noopener noreferrer' : undefined} whileHover={{ scale: 1.05, y: -5 }} className="bg-white/10 backdrop-blur-2xl rounded-3xl shadow-2xl border border-white/20 overflow-hidden hover:bg-white/15 transition-all group">
                      {ad.bannerImageUrl && (
                        <div className="w-full h-40 overflow-hidden bg-gradient-to-br from-accent/30 to-primary/30 flex items-center justify-center">
                          <img src={ad.bannerImageUrl} alt={ad.title} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300" />
                        </div>
                      )}
                      <div className="p-6">
                        <h4 className="text-lg font-bold text-white mb-2 line-clamp-2">{ad.title}</h4>
                        <p className="text-white/60 text-sm mb-4 line-clamp-2">{ad.description}</p>
                        <div className="flex items-center justify-between">
                          <span className="text-accent text-xs font-bold uppercase tracking-wider">{ad.companyName || 'Sponsor'}</span>
                          <i className="fas fa-arrow-right text-white/40 group-hover:text-accent transition-colors"></i>
                        </div>
                      </div>
                    </motion.a>
                  ))}
                </div>
              </motion.section>
            )}

            {loadingAds && (
              <div className="text-center py-12">
                <div className="inline-block">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white mb-4"></div>
                  <p className="text-white/60 text-sm font-medium">Loading featured sponsors...</p>
                </div>
              </div>
            )}

            {/* Features */}
            <motion.section initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.6 }} className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
              {[
                { icon: 'fa-search', title: 'Smart Filters', desc: 'Find exactly what you need in seconds.' },
                { icon: 'fa-shield-alt', title: 'Verified Hosts', desc: 'We vet every owner for your safety.' },
                { icon: 'fa-clock', title: 'Real-time', desc: 'Instant bookings and availability updates.' },
              ].map((feature, idx) => (
                <article key={idx} className="bg-white/95 backdrop-blur-md border border-white/20 rounded-3xl p-8 text-center text-text-dark hover:shadow-xl transition-all shadow-lg">
                  <div className="w-16 h-16 bg-gradient-to-br from-primary/20 to-accent/20 rounded-2xl flex items-center justify-center mx-auto mb-6 text-primary">
                    <i className={`fas ${feature.icon} text-2xl`}></i>
                  </div>
                  <h4 className="text-xl font-bold mb-3">{feature.title}</h4>
                  <p className="text-gray-600 leading-relaxed">{feature.desc}</p>
                </article>
              ))}
            </motion.section>
          </div>
        </main>

        {/* Footer */}
        <footer className="w-full bg-[#05080f]/90 backdrop-blur-md text-white/90 pt-20 pb-10 border-t border-white/5">
          <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-4 gap-12">
            <div className="space-y-4">
              <h4 className="text-2xl font-black text-white">SmartBoAD</h4>
              <p className="text-white/50 text-sm leading-relaxed">The island's most trusted platform for student housing. Connecting dreams with locations.</p>
            </div>
            <div>
              <h5 className="font-bold mb-6 text-white uppercase tracking-widest text-xs">Navigation</h5>
              <ul className="text-sm text-white/50 space-y-3">
                <li className="hover:text-accent transition-colors cursor-pointer">Search Listings</li>
                <li className="hover:text-accent transition-colors cursor-pointer">My Appointments</li>
                <li className="hover:text-accent transition-colors cursor-pointer">Help Center</li>
              </ul>
            </div>
            <div>
              <h5 className="font-bold mb-6 text-white uppercase tracking-widest text-xs">For Partners</h5>
              <ul className="text-sm text-white/50 space-y-3">
                <li className="hover:text-accent transition-colors cursor-pointer">Add Property</li>
                <li className="hover:text-accent transition-colors cursor-pointer">Business Solutions</li>
                <li className="hover:text-accent transition-colors cursor-pointer">API Docs</li>
              </ul>
            </div>
            <div>
              <h5 className="font-bold mb-6 text-white uppercase tracking-widest text-xs">Connect</h5>
              <div className="flex gap-4 mb-6">
                {[1,2,3].map(i => <div key={i} className="w-10 h-10 bg-white/5 rounded-full flex items-center justify-center border border-white/10 hover:bg-accent transition-all cursor-pointer"></div>)}
              </div>
              <p className="text-white/40 text-xs tracking-tight">© 2026 SmartBoAD Digital. All Rights Reserved.</p>
            </div>
          </div>
        </footer>
      </div>
    </div>
  );
};

export default Home;

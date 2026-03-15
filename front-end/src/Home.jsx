import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import logo from './assets/logo.png';
import backgroundImage from './assets/s5.jpg';
import PublicAdsSidebar from './components/common/PublicAdsSidebar';
import AdvertiseModal from './components/home/AdvertiseModal';
import BoardingDetailsModal from './components/home/BoardingDetailsModal';
import BoardingSearchPanel from './components/home/BoardingSearchPanel';
import StudentService from './api/student/StudentService';
import AdminService from './api/admin/AdminService';
import { sampleBoardings } from './data/student/searchBoardingsData';

const Home = () => {
  const navigate = useNavigate();
  const [isSubmittingAd, setIsSubmittingAd] = useState(false);
  const [formData, setFormData] = useState({
    companyName: '',
    email: '',
    phone: '',
    adTitle: '',
    adDescription: '',
    website: '',
    planId: '',
    image: null,
    searchQuery: ''
  });
  
  const [boardings, setBoardings] = useState([]);
  const [loadingBoardings, setLoadingBoardings] = useState(false);
  const [page, setPage] = useState(0);
  const [pageSize, setPageSize] = useState(12);
  const [totalPages, setTotalPages] = useState(0);
  const [filters, setFilters] = useState({
    minPrice: 0,
    maxPrice: 50000,
    gender: 'any',
    roomType: 'any'
  });
  
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [plans, setPlans] = useState([]);
  const [loadingPlans, setLoadingPlans] = useState(false);
  const [showAdvertiseForm, setShowAdvertiseForm] = useState(false);
  const [showBoardingDetails, setShowBoardingDetails] = useState(false);
  const [selectedBoarding, setSelectedBoarding] = useState(null);
  const [loadingBoardingDetails, setLoadingBoardingDetails] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [maintenanceMode, setMaintenanceMode] = useState(() => {
    const cached = localStorage.getItem('sbms_maintenance_mode');
    return cached === 'true';
  });
  const [loadingSystemStatus, setLoadingSystemStatus] = useState(true);

  const handleOpenAdvertiseForm = () => {
    setShowAdvertiseForm(true);
  };

  const handleCloseAdvertiseForm = () => {
    setShowAdvertiseForm(false);
  };

  const handleOpenBoardingDetails = async (boarding) => {
    if (!boarding) return;

    setSelectedBoarding(boarding);
    setShowBoardingDetails(true);
    setCurrentImageIndex(0);

    if (!boarding.id) return;

    setLoadingBoardingDetails(true);
    try {
      const fullDetails = await StudentService.getBoardingDetails(boarding.id);
      if (fullDetails) {
        setSelectedBoarding((prev) => ({
          ...prev,
          ...fullDetails,
          amenities: fullDetails.amenities || prev?.amenities || [],
        }));
      }
    } catch (error) {
      console.error('Failed to fetch boarding details for modal', error);
    } finally {
      setLoadingBoardingDetails(false);
    }
  };

  const handleCloseBoardingDetails = () => {
    setShowBoardingDetails(false);
    setSelectedBoarding(null);
    setLoadingBoardingDetails(false);
    setCurrentImageIndex(0);
  };

  const normalizedModalBoarding = selectedBoarding
    ? {
        ...selectedBoarding,
        images: [
          ...(Array.isArray(selectedBoarding.imageUrls) ? selectedBoarding.imageUrls : []),
          ...(Array.isArray(selectedBoarding.images) ? selectedBoarding.images : []),
          ...(selectedBoarding.image ? [selectedBoarding.image] : []),
        ].filter(Boolean).filter((value, index, array) => array.indexOf(value) === index),
      }
    : null;

  const handlePrevBoardingImage = () => {
    const total = normalizedModalBoarding?.images?.length || 0;
    if (total <= 1) return;
    setCurrentImageIndex((prev) => (prev - 1 + total) % total);
  };

  const handleNextBoardingImage = () => {
    const total = normalizedModalBoarding?.images?.length || 0;
    if (total <= 1) return;
    setCurrentImageIndex((prev) => (prev + 1) % total);
  };

  const handleOpenFullBoardingDetails = () => {
    if (!selectedBoarding?.id) return;
    navigate(`/student/boarding-details/${selectedBoarding.id}`, { state: { boarding: selectedBoarding } });
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleImageChange = (e) => {
    setFormData(prev => ({ ...prev, image: e.target.files[0] }));
  };

  const handleSubmitAd = async (e) => {
    e.preventDefault();
    
    // Validate plan selection
    if (!formData.planId) {
      setErrorMessage('✗ Please select a plan before submitting');
      return;
    }

    setIsSubmittingAd(true);
    setErrorMessage('');
    setSuccessMessage('');

    try {
      const formDataToSend = new FormData();
      
      // Add required fields
      formDataToSend.append('companyName', formData.companyName);
      formDataToSend.append('email', formData.email);
      formDataToSend.append('phone', formData.phone);
      formDataToSend.append('adTitle', formData.adTitle);
      formDataToSend.append('adDescription', formData.adDescription);
      formDataToSend.append('planId', formData.planId);
      
      // Add optional fields only if they have values
      if (formData.website && formData.website.trim()) {
        formDataToSend.append('website', formData.website.trim());
      }
      if (formData.image) {
        formDataToSend.append('image', formData.image);
      }

      await AdminService.submitThirdPartyAd(formDataToSend);

      setSuccessMessage('✓ Your ad has been submitted successfully! Awaiting admin review.');
      setFormData({
        companyName: '', email: '', phone: '', adTitle: '',
        adDescription: '', website: '', planId: '', image: null, searchQuery: ''
      });
      setTimeout(() => setSuccessMessage(''), 5000);
    } catch (error) {
      setErrorMessage(`✗ Failed to submit ad: ${error.message}`);
    } finally {
      setIsSubmittingAd(false);
    }
  };

  const fetchPlans = async () => {
    setLoadingPlans(true);
    try {
      const activePlans = await AdminService.getPublicPlans();
      setPlans(activePlans || []);
    } catch (error) {
      console.error('Failed to fetch plans:', error);
      setPlans([]);
    } finally {
      setLoadingPlans(false);
    }
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.1, delayChildren: 0.2 } },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
  };

  const fetchBoardings = async (p = page, size = pageSize) => {
    setLoadingBoardings(true);
    try {
      const searchFilters = {
        searchQuery: formData.searchQuery || '',
        minPrice: filters.minPrice,
        maxPrice: filters.maxPrice,
        gender: filters.gender,
        roomTypes: filters.roomType === 'any' ? [] : [filters.roomType]
      };
      const data = await StudentService.searchBoardings(searchFilters, p, size);
      const list = Array.isArray(data) ? data : (data.content || []);
      
      if (!list || list.length === 0) {
        const fallbackStart = p * size;
        const fallbackEnd = fallbackStart + size;
        const fallbackPageItems = sampleBoardings.slice(fallbackStart, fallbackEnd);
        setBoardings(fallbackPageItems);
        setTotalPages(Math.max(1, Math.ceil(sampleBoardings.length / size)));
      } else {
        if (Array.isArray(data)) {
          const start = p * size;
          const end = start + size;
          setBoardings(data.slice(start, end));
          setTotalPages(Math.max(1, Math.ceil(data.length / size)));
        } else {
          setBoardings(list);
          setTotalPages(data.totalPages || 1);
        }
      }
    } catch (e) {
      const fallbackStart = p * size;
      const fallbackEnd = fallbackStart + size;
      setBoardings(sampleBoardings.slice(fallbackStart, fallbackEnd));
      setTotalPages(Math.max(1, Math.ceil(sampleBoardings.length / size)));
    } finally {
      setLoadingBoardings(false);
    }
  };

  useEffect(() => {
    const initHome = async () => {
      setLoadingSystemStatus(true);
      try {
        const status = await AdminService.getPublicSystemStatus();
        const maintenance = Boolean(status?.maintenanceMode);
        setMaintenanceMode(maintenance);
        localStorage.setItem('sbms_maintenance_mode', String(maintenance));

        if (!maintenance) {
          fetchBoardings();
          fetchPlans();
        }
      } catch (error) {
        console.error('Failed to load system status', error);
        const cachedMaintenance = localStorage.getItem('sbms_maintenance_mode') === 'true';
        setMaintenanceMode(cachedMaintenance);
        if (!cachedMaintenance) {
          fetchBoardings();
          fetchPlans();
        }
      } finally {
        setLoadingSystemStatus(false);
      }
    };

    initHome();
  }, [maintenanceMode]);

  useEffect(() => {
    // Prevent background page scroll while modal overlays are open.
    if (showAdvertiseForm || showBoardingDetails) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }

    return () => {
      document.body.style.overflow = '';
    };
  }, [showAdvertiseForm, showBoardingDetails]);

  return (
    <div className="min-h-screen relative overflow-hidden font-sans">
      {/* Background Image Layer */}
      <div
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{
          backgroundImage: `url(${backgroundImage})`,
          filter: "blur(4px)",
          transform: "scale(1.05)",
        }}
      />
      {/* Dark Overlay for contrast */}
      <div className="absolute inset-0 bg-black/40 backdrop-blur-[2px]" />

      <div className="relative z-10 min-h-screen flex flex-col">
        <div className="flex-1 flex flex-col items-stretch justify-start p-4 md:p-8">
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="w-full"
          >
            {/* Header / Navbar */}
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              className="w-full max-w-6xl mx-auto bg-white/10 backdrop-blur-xl border border-white/20 py-4 px-6 rounded-2xl mb-12 shadow-2xl flex items-center justify-between"
            >
              <div className="flex items-center gap-3">
                <img src={logo} alt="SmartBoAD" className="h-10 w-10 rounded-lg shadow-inner" />
                <h1 className="text-2xl font-black text-white tracking-tight">SmartBoAD</h1>
              </div>
              <button
                onClick={() => navigate('/login')}
                className="px-6 py-2 bg-white/20 hover:bg-white/30 text-white border border-white/30 rounded-xl transition-all font-bold text-sm backdrop-blur-sm"
              >
                Login
              </button>
            </motion.div>

            {/* Hero Section */}
            <motion.div variants={itemVariants} className="text-center mb-12">
              <h2 className="text-5xl md:text-7xl font-extrabold text-white mb-6 leading-tight drop-shadow-lg">
                Welcome To <span className="text-accent">SmartBoAD</span>
              </h2>
              <p className="text-xl text-white/90 max-w-2xl mx-auto font-medium">
                The premier destination for student boarding and property advertising.
              </p>
            </motion.div>

            {!loadingSystemStatus && maintenanceMode && (
              <motion.div variants={itemVariants} className="mb-12">
                <div className="max-w-4xl mx-auto bg-red-600/20 border border-red-400/40 rounded-3xl p-8 text-white backdrop-blur-xl">
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 rounded-full bg-red-500/30 flex items-center justify-center shrink-0">
                      <i className="fas fa-tools text-xl"></i>
                    </div>
                    <div>
                      <h3 className="text-2xl font-black mb-2">System is on maintenance mode</h3>
                      <p className="text-white/90 leading-relaxed">
                        System is on maintenance mode. Public access is currently restricted.
                        Only administrators can login and manage the system during this period.
                      </p>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}
            
            {/* Main Layout: Left Ads Sidebar + Right Boarding Search */}
            {!maintenanceMode && (
            <div className="flex flex-col lg:flex-row gap-6 mb-12 items-start w-full">
              {/* Left: Public Ads Sidebar */}
              <div className="w-full lg:w-56 xl:w-60 flex-shrink-0 lg:sticky lg:top-6">
                <PublicAdsSidebar />
              </div>

              {/* Right: Boarding Search Panel */}
              <BoardingSearchPanel
                itemVariants={itemVariants}
                formData={formData}
                setFormData={setFormData}
                fetchBoardings={fetchBoardings}
                filters={filters}
                setFilters={setFilters}
                setPage={setPage}
                pageSize={pageSize}
                loadingBoardings={loadingBoardings}
                boardings={boardings}
                handleOpenBoardingDetails={handleOpenBoardingDetails}
                page={page}
                totalPages={totalPages}
              />
            </div>
            )}

            {!maintenanceMode && (
            <motion.div variants={itemVariants} className="mb-10">
              <div className="bg-white/10 backdrop-blur-2xl rounded-3xl shadow-2xl p-8 md:p-10 border border-white/20">
                <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
                  <div>
                    <h3 className="text-3xl font-black text-white mb-2">Promote Your Business on SmartBoAD</h3>
                    <p className="text-white/70 max-w-2xl">
                      Reach students actively searching for boarding and services. Publish your campaign quickly with a plan that matches your budget.
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={handleOpenAdvertiseForm}
                    className="px-8 py-4 bg-gradient-to-r from-primary to-accent text-white font-black rounded-2xl shadow-xl hover:scale-[1.02] transition-all whitespace-nowrap"
                  >
                    Advertise Your Business
                  </button>
                </div>
              </div>
            </motion.div>
            )}

            {!maintenanceMode && (
              <AdvertiseModal
                show={showAdvertiseForm}
                onClose={handleCloseAdvertiseForm}
                successMessage={successMessage}
                errorMessage={errorMessage}
                onSubmit={handleSubmitAd}
                loadingPlans={loadingPlans}
                plans={plans}
                formData={formData}
                onInputChange={handleInputChange}
                onImageChange={handleImageChange}
                isSubmittingAd={isSubmittingAd}
              />
            )}

            {!maintenanceMode && (
              <BoardingDetailsModal
                show={showBoardingDetails}
                onClose={handleCloseBoardingDetails}
                loading={loadingBoardingDetails}
                boarding={normalizedModalBoarding}
                currentImageIndex={currentImageIndex}
                onPrevImage={handlePrevBoardingImage}
                onNextImage={handleNextBoardingImage}
                onSelectImage={setCurrentImageIndex}
                onOpenFullDetails={handleOpenFullBoardingDetails}
              />
            )}

            {/* Features Grid */}
            <motion.div variants={itemVariants} className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
              {[
                { icon: 'fa-search', title: 'Smart Filters', desc: 'Find exactly what you need in seconds.' },
                { icon: 'fa-shield-alt', title: 'Verified Hosts', desc: 'We vet every owner for your safety.' },
                { icon: 'fa-clock', title: 'Real-time', desc: 'Instant bookings and availability updates.' },
              ].map((feature, idx) => (
                <div key={idx} className="bg-white/5 backdrop-blur-lg border border-white/10 rounded-3xl p-8 text-center text-white hover:bg-white/10 transition-all shadow-xl">
                  <div className="w-16 h-16 bg-accent/20 rounded-2xl flex items-center justify-center mx-auto mb-6 text-accent">
                    <i className={`fas ${feature.icon} text-2xl`}></i>
                  </div>
                  <h4 className="text-xl font-bold mb-3">{feature.title}</h4>
                  <p className="text-white/60 leading-relaxed">{feature.desc}</p>
                </div>
              ))}
            </motion.div>
          </motion.div>
        </div>

        {/* Footer */}
        <motion.footer className="w-full relative overflow-hidden bg-gradient-to-b from-[#0a101c]/95 to-[#04070f]/95 backdrop-blur-md text-white/90 pt-16 pb-8 border-t border-white/10">
          <div className="absolute inset-0 pointer-events-none opacity-40">
            <div className="absolute -top-24 left-1/4 w-72 h-72 rounded-full bg-accent/10 blur-3xl" />
            <div className="absolute -bottom-28 right-1/4 w-80 h-80 rounded-full bg-primary/10 blur-3xl" />
          </div>

          <div className="relative max-w-7xl mx-auto px-6">
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-10 pb-10 border-b border-white/10">
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <img src={logo} alt="SmartBoAD" className="h-10 w-10 rounded-lg border border-white/20" />
                  <h4 className="text-2xl font-black text-white tracking-tight">SmartBoAD</h4>
                </div>
                <p className="text-white/65 text-sm leading-relaxed max-w-sm">
                  The island's trusted platform for student housing, with smarter search and safer decisions.
                </p>
              </div>

              <div>
                <h5 className="font-bold mb-5 text-white uppercase tracking-widest text-xs">Navigation</h5>
                <ul className="text-sm text-white/60 space-y-3">
                  <li className="hover:text-accent transition-colors cursor-pointer">Search Listings</li>
                  <li className="hover:text-accent transition-colors cursor-pointer">My Appointments</li>
                  <li className="hover:text-accent transition-colors cursor-pointer">Help Center</li>
                </ul>
              </div>

              <div>
                <h5 className="font-bold mb-5 text-white uppercase tracking-widest text-xs">For Partners</h5>
                <ul className="text-sm text-white/60 space-y-3">
                  <li className="hover:text-accent transition-colors cursor-pointer">Add Property</li>
                  <li className="hover:text-accent transition-colors cursor-pointer">Business Solutions</li>
                  <li className="hover:text-accent transition-colors cursor-pointer">API Docs</li>
                </ul>
              </div>

              <div>
                <h5 className="font-bold mb-5 text-white uppercase tracking-widest text-xs">Connect</h5>
                <div className="flex gap-3 mb-5">
                  {[
                    { icon: 'fa-facebook-f', label: 'Facebook' },
                    { icon: 'fa-instagram', label: 'Instagram' },
                    { icon: 'fa-linkedin-in', label: 'LinkedIn' },
                    { icon: 'fa-x-twitter', label: 'X' },
                  ].map((item) => (
                    <button
                      key={item.label}
                      type="button"
                      aria-label={item.label}
                      className="w-10 h-10 bg-white/5 rounded-xl flex items-center justify-center border border-white/15 hover:bg-accent hover:border-accent transition-all"
                    >
                      <i className={`fab ${item.icon} text-sm`}></i>
                    </button>
                  ))}
                </div>
                <p className="text-white/45 text-xs">support@smartboad.lk</p>
              </div>
            </div>

            <div className="pt-6 flex flex-col md:flex-row items-center justify-between gap-3 text-xs text-white/45">
              <p>© 2026 SmartBoAD Digital. All rights reserved.</p>
              <div className="flex items-center gap-5">
                <span className="hover:text-white/70 cursor-pointer transition-colors">Privacy</span>
                <span className="hover:text-white/70 cursor-pointer transition-colors">Terms</span>
                <span className="hover:text-white/70 cursor-pointer transition-colors">Contact</span>
              </div>
            </div>
          </div>
        </motion.footer>
      </div>
    </div>
  );
};

export default Home;
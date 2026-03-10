import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import logo from './assets/logo.png';
import backgroundImage from './assets/s5.jpg';

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
    image: null,
  });
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleImageChange = (e) => {
    setFormData(prev => ({
      ...prev,
      image: e.target.files[0]
    }));
  };

  const handleSubmitAd = async (e) => {
    e.preventDefault();
    setIsSubmittingAd(true);
    setErrorMessage('');
    setSuccessMessage('');

    try {
      const formDataToSend = new FormData();
      formDataToSend.append('companyName', formData.companyName);
      formDataToSend.append('email', formData.email);
      formDataToSend.append('phone', formData.phone);
      formDataToSend.append('adTitle', formData.adTitle);
      formDataToSend.append('adDescription', formData.adDescription);
      formDataToSend.append('website', formData.website);
      if (formData.image) {
        formDataToSend.append('image', formData.image);
      }

      // Import and use AdminService
      const AdminService = (await import('./api/admin/AdminService')).default;
      await AdminService.submitThirdPartyAd(formDataToSend);

      setSuccessMessage('✓ Your ad has been submitted successfully! Our team will review it shortly.');
      setFormData({
        companyName: '',
        email: '',
        phone: '',
        adTitle: '',
        adDescription: '',
        website: '',
        image: null,
      });
      setTimeout(() => setSuccessMessage(''), 5000);
    } catch (error) {
      setErrorMessage('✗ Failed to submit ad. Please try again or contact support.');
      console.error('Submission error:', error);
    } finally {
      setIsSubmittingAd(false);
    }
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.5 },
    },
  };

  return (
    <div className="min-h-screen relative overflow-hidden">
      {/* Background */}
      <div
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{
          backgroundImage: `url(${backgroundImage})`,
          filter: "blur(8px)",
          transform: "scale(1.1)",
        }}
      />
      <div className="absolute inset-0 bg-gradient-to-br from-primary/40 via-accent/30 to-primary/40 backdrop-blur-sm" />

      {/* Content */}
      <div className="relative z-10 min-h-screen flex flex-col">
        {/* Navigation Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="w-full bg-white/10 backdrop-blur-md border-b border-white/20 py-4 px-6"
        >
          <div className="max-w-7xl mx-auto flex items-center justify-between">
            <div className="flex items-center gap-3">
              <img src={logo} alt="SmartBoAD" className="h-10 w-10 rounded-lg" />
              <h1 className="text-2xl font-bold text-white">SmartBoAD</h1>
            </div>
            <div className="flex gap-4">
              <button
                onClick={() => navigate('/login')}
                className="px-6 py-2 text-white hover:text-accent transition-colors font-semibold"
              >
                Login
              </button>
              <button
                onClick={() => navigate('/signup')}
                className="px-6 py-2 bg-accent text-white rounded-lg hover:shadow-lg transition-all font-semibold"
              >
                Sign Up
              </button>
            </div>
          </div>
        </motion.div>

        {/* Main Content */}
        <div className="flex-1 flex items-center justify-center p-4 py-12">
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="w-full max-w-6xl"
          >
            {/* Hero Section */}
            <motion.div variants={itemVariants} className="text-center mb-16">
              <h2 className="text-5xl md:text-6xl font-bold text-white mb-4 leading-tight">
                Welcome to SmartBoAD
              </h2>
              <p className="text-xl text-white/80 mb-8">
                Find Your Perfect Boarding Place or Advertise Your Property
              </p>
            </motion.div>

            {/* Main Content Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
              {/* User Login Section */}
              <motion.div
                variants={itemVariants}
                className="bg-white/95 backdrop-blur-md rounded-2xl shadow-2xl p-8 border border-white/20"
              >
                <div className="mb-8">
                  <h3 className="text-3xl font-bold text-text-dark mb-2">Welcome Back!</h3>
                  <p className="text-text-muted">Select your role to continue</p>
                </div>

                <div className="space-y-4">
                  <button
                    onClick={() => navigate('/login')}
                    className="w-full py-3 px-4 bg-gradient-to-r from-blue-500 to-blue-600 hover:shadow-lg text-white font-semibold rounded-lg transition-all duration-200 flex items-center justify-center gap-3"
                  >
                    <i className="fas fa-graduation-cap"></i> Student Login
                  </button>

                  <button
                    onClick={() => navigate('/login')}
                    className="w-full py-3 px-4 bg-gradient-to-r from-emerald-500 to-emerald-600 hover:shadow-lg text-white font-semibold rounded-lg transition-all duration-200 flex items-center justify-center gap-3"
                  >
                    <i className="fas fa-building"></i> Owner Login
                  </button>

                  <button
                    onClick={() => navigate('/login')}
                    className="w-full py-3 px-4 bg-gradient-to-r from-purple-500 to-purple-600 hover:shadow-lg text-white font-semibold rounded-lg transition-all duration-200 flex items-center justify-center gap-3"
                  >
                    <i className="fas fa-crown"></i> Admin Login
                  </button>

                  <div className="mt-6 pt-6 border-t border-gray-200">
                    <p className="text-text-muted text-sm mb-4">New to SmartBoAD?</p>
                    <button
                      onClick={() => navigate('/signup')}
                      className="w-full py-2 px-4 border-2 border-primary text-primary font-semibold rounded-lg hover:bg-primary/10 transition-all"
                    >
                      Create an Account
                    </button>
                  </div>
                </div>
              </motion.div>

              {/* Third-Party Ad Submission */}
              <motion.div
                variants={itemVariants}
                className="bg-white/95 backdrop-blur-md rounded-2xl shadow-2xl p-8 border border-white/20 max-h-[600px] overflow-y-auto"
              >
                <div className="mb-6">
                  <h3 className="text-3xl font-bold text-text-dark mb-2">Post an Advertisement</h3>
                  <p className="text-text-muted text-sm">Promote your business to boarding seekers</p>
                </div>

                {successMessage && (
                  <div className="mb-4 p-4 bg-green-50 border border-green-200 rounded-lg text-green-700 text-sm font-medium">
                    {successMessage}
                  </div>
                )}

                {errorMessage && (
                  <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm font-medium">
                    {errorMessage}
                  </div>
                )}

                <form onSubmit={handleSubmitAd} className="space-y-4">
                  <input
                    type="text"
                    name="companyName"
                    placeholder="Company Name"
                    value={formData.companyName}
                    onChange={handleInputChange}
                    required
                    className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:border-primary text-sm"
                  />

                  <input
                    type="email"
                    name="email"
                    placeholder="Email Address"
                    value={formData.email}
                    onChange={handleInputChange}
                    required
                    className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:border-primary text-sm"
                  />

                  <input
                    type="tel"
                    name="phone"
                    placeholder="Phone Number"
                    value={formData.phone}
                    onChange={handleInputChange}
                    required
                    className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:border-primary text-sm"
                  />

                  <input
                    type="text"
                    name="adTitle"
                    placeholder="Ad Title"
                    value={formData.adTitle}
                    onChange={handleInputChange}
                    required
                    className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:border-primary text-sm"
                  />

                  <textarea
                    name="adDescription"
                    placeholder="Ad Description"
                    value={formData.adDescription}
                    onChange={handleInputChange}
                    required
                    rows="3"
                    className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:border-primary text-sm resize-none"
                  />

                  <input
                    type="url"
                    name="website"
                    placeholder="Website (optional)"
                    value={formData.website}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:border-primary text-sm"
                  />

                  <div className="border-2 border-dashed border-gray-300 rounded-lg p-4">
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleImageChange}
                      className="w-full text-sm"
                    />
                    <p className="text-xs text-text-muted mt-2">JPG, PNG up to 5MB</p>
                  </div>

                  <button
                    type="submit"
                    disabled={isSubmittingAd}
                    className="w-full py-3 bg-gradient-to-r from-primary to-accent text-white font-bold rounded-lg hover:shadow-lg transition-all disabled:opacity-50 flex items-center justify-center gap-2"
                  >
                    {isSubmittingAd ? (
                      <>
                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                        Submitting...
                      </>
                    ) : (
                      <>
                        <i className="fas fa-paper-plane"></i> Submit Advertisement
                      </>
                    )}
                  </button>
                </form>
              </motion.div>
            </div>

            {/* Features Section */}
            <motion.div variants={itemVariants} className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {[
                { icon: 'fa-search', title: 'Easy Search', desc: 'Find boarding places matching your needs' },
                { icon: 'fa-shield-alt', title: 'Secure', desc: 'Your information is safe with us' },
                { icon: 'fa-headset', title: '24/7 Support', desc: 'We are here to help you anytime' },
              ].map((feature, idx) => (
                <div
                  key={idx}
                  className="bg-white/10 backdrop-blur-md border border-white/20 rounded-xl p-6 text-center text-white hover:bg-white/20 transition-all"
                >
                  <i className={`fas ${feature.icon} text-3xl mb-4`}></i>
                  <h4 className="text-lg font-bold mb-2">{feature.title}</h4>
                  <p className="text-sm text-white/80">{feature.desc}</p>
                </div>
              ))}
            </motion.div>
          </motion.div>
        </div>

        {/* Footer */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="text-center py-6 text-white/60 text-sm border-t border-white/10"
        >
          <p>&copy; 2026 SmartBoAD. All rights reserved.</p>
        </motion.div>
      </div>
    </div>
  );
};

export default Home;

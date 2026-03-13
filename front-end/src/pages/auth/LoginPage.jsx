// import React, { useState, useEffect } from "react";
// import { Link, useNavigate } from "react-router-dom";
// import { motion } from "framer-motion";

// // --- CONTEXT IMPORTS ---
// // Adjust paths if your folder structure is different
// import { useAuth as useStudentAuth } from "../../context/student/StudentAuthContext";
// import { useOwnerAuth } from "../../context/owner/OwnerAuthContext";

// // --- COMPONENT IMPORTS ---
// import StudentLoginForm from "../../components/student/auth/StudentLoginForm";
// import OwnerLoginForm from "../../components/Owner/auth/OwnerLoginForm";

// // --- ASSETS ---
// import backgroundImage from "../../assets/s5.jpg";
// import logo from "../../assets/logo.png";

// const LoginPage = () => {
//   const navigate = useNavigate();

//   // STATE: Controls which form is visible ('student' or 'owner')
//   const [role, setRole] = useState("student");
//   const [error, setError] = useState("");
//   const [isLoading, setIsLoading] = useState(false);

//   // AUTH HOOKS
//   const { login: studentLogin, isAuthenticated: isStudentAuth } =
//     useStudentAuth();
//   const { login: ownerLogin, isAuthenticated: isOwnerAuth } = useOwnerAuth();

//   // REDIRECT: If already logged in, send to appropriate dashboard
//   //   useEffect(() => {
//   //     if (isStudentAuth) navigate("/student", { replace: true });
//   //     if (isOwnerAuth) navigate("/owner/dashboard", { replace: true });
//   //   }, [isStudentAuth, isOwnerAuth, navigate]);

//   // HANDLER: Switch logic based on active Role
//   const handleLogin = async (formData) => {
//     setIsLoading(true);
//     setError("");
//     let result;

//     try {
//       if (role === "student") {
//         // Call Student Context (Synchronous/Mock)
//         result = await studentLogin(formData.email, formData.password);
//       } else {
//         // Call Owner Context (Async/Real API)
//         result = await ownerLogin(formData.email, formData.password);
//       }

//       if (result && result.success) {
//         const path = role === "student" ? "/student" : "/owner/dashboard";
//         navigate(path, { replace: true });
//       } else {
//         setError(
//           result?.message || "Login failed. Please check your credentials."
//         );
//       }
//     } catch (err) {
//       setError("An unexpected error occurred.");
//       console.error(err);
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   return (
//     <div className="min-h-screen relative flex items-center justify-center p-4 overflow-hidden">
//       {/* Background Image */}
//       <div
//         className="absolute inset-0 bg-cover bg-center bg-no-repeat"
//         style={{
//           backgroundImage: `url(${backgroundImage})`,
//           filter: "blur(8px)",
//           transform: "scale(1.1)",
//         }}
//       />
//       <div className="absolute inset-0 bg-gradient-to-br from-primary/30 via-accent/20 to-primary/30 backdrop-blur-sm" />

//       {/* Main Card */}
//       <div className="relative z-10 w-full max-w-md">
//         <motion.div
//           initial={{ opacity: 0, y: 20 }}
//           animate={{ opacity: 1, y: 0 }}
//           className="bg-white/95 backdrop-blur-md rounded-large shadow-2xl p-8 border border-white/20"
//         >
//           {/* Header */}
//           <div className="text-center mb-6">
//             <div className="flex items-center justify-center gap-3 mb-2">
//               <img
//                 src={logo}
//                 alt="SmartBoAD Logo"
//                 className="w-[60px] h-[60px]"
//               />
//               <h1 className="text-3xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
//                 SmartBoAD
//               </h1>
//             </div>
//             <h2 className="text-xl font-bold text-text-dark">Welcome Back!</h2>
//           </div>

//           {/* ROLE TOGGLE TABS */}
//           <div className="flex p-1 bg-gray-100 rounded-lg mb-6 shadow-inner">
//             <button
//               onClick={() => {
//                 setRole("student");
//                 setError("");
//               }}
//               className={`flex-1 py-2 text-sm font-semibold rounded-md transition-all duration-200 ${
//                 role === "student"
//                   ? "bg-white text-primary shadow-sm"
//                   : "text-gray-500 hover:text-gray-700"
//               }`}
//             >
//               Student
//             </button>
//             <button
//               onClick={() => {
//                 setRole("owner");
//                 setError("");
//               }}
//               className={`flex-1 py-2 text-sm font-semibold rounded-md transition-all duration-200 ${
//                 role === "owner"
//                   ? "bg-white text-primary shadow-sm"
//                   : "text-gray-500 hover:text-gray-700"
//               }`}
//             >
//               Owner
//             </button>
//           </div>

//           {/* FORM RENDERER */}
//           <motion.div
//             key={role}
//             initial={{ opacity: 0, x: role === "student" ? -20 : 20 }}
//             animate={{ opacity: 1, x: 0 }}
//             transition={{ duration: 0.2 }}
//           >
//             {role === "student" ? (
//               <StudentLoginForm
//                 onSubmit={handleLogin}
//                 isLoading={isLoading}
//                 error={error}
//               />
//             ) : (
//               <OwnerLoginForm
//                 onSubmit={handleLogin}
//                 isLoading={isLoading}
//                 error={error}
//               />
//             )}
//           </motion.div>

//           {/* Footer Links */}
//           <div className="mt-6 text-center">
//             <p className="text-text-muted text-sm">
//               Don't have an account?{" "}
//               <Link
//                 to="/signup"
//                 className="text-accent hover:text-primary font-semibold transition-colors"
//               >
//                 Sign Up as {role === "student" ? "Student" : "Owner"}
//               </Link>
//             </p>
//           </div>
//         </motion.div>
//       </div>
//     </div>
//   );
// };

// export default LoginPage;

import React, { useState, useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { motion } from "framer-motion";

// --- CONTEXT IMPORTS ---
import { useAuth as useStudentAuth } from "../../context/student/StudentAuthContext";
import { useOwnerAuth } from "../../context/owner/OwnerAuthContext";
import { useTechAuth } from "../../context/technician/TechnicianAuthContext"; // ✅ Added
import { useAuth as useAdminAuth } from "../../context/admin/AdminAuthContext";

// --- COMPONENT IMPORTS ---
import StudentLoginForm from "../../components/student/auth/StudentLoginForm";
import OwnerLoginForm from "../../components/Owner/auth/OwnerLoginForm";
// We reuse OwnerLoginForm for Tech because fields (Email/Pass) are identical
// If you want a specific one, duplicate the OwnerLoginForm file.
import AdminLoginForm from "../../components/admin/auth/AdminLoginForm";

// --- ASSETS ---
import backgroundImage from "../../assets/s5.jpg";
import logo from "../../assets/logo.png";

const LoginPage = () => {
  const navigate = useNavigate();
  const location = useLocation();

  // STATE: Default to passed state or 'student'
  const [role, setRole] = useState(location.state?.defaultRole || "student");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  // AUTH HOOKS
  const { login: studentLogin, isAuthenticated: isStudentAuth } =
    useStudentAuth();
  const { login: ownerLogin, isAuthenticated: isOwnerAuth } = useOwnerAuth();
  const { login: adminLogin, isAuthenticated: isAdminAuth } = useAdminAuth();
  const { login: techLogin } = useTechAuth();

  // REDIRECT: If already logged in, send to appropriate dashboard
  //   useEffect(() => {
  //     if (isStudentAuth) navigate("/student", { replace: true });
  //     if (isOwnerAuth) navigate("/owner/dashboard", { replace: true });
  //   }, [isStudentAuth, isOwnerAuth, navigate]);

  // HANDLER: Switch logic based on active Role
  const handleLogin = async (formData) => {
    setIsLoading(true);
    setError("");
    let result;

    try {
      if (role === "student") {
        result = await studentLogin(formData.email, formData.password);
      } else if (role === "owner") {
        result = await ownerLogin(formData.email, formData.password);
      } else if (role === "technician") {
        // ✅ Added Tech Logic
        result = await techLogin(formData.email, formData.password);
      } else if (role === "admin") {
        // Call Admin Context
        result = await adminLogin(formData.email, formData.password);
      }

      if (result && result.success) {
        const pathMap = {
          student: "/student",
          owner: "/owner/dashboard",
          admin: "/admin/dashboard",
          technician: "/technician/dashboard",
        };
        navigate(pathMap[role], { replace: true });
      } else {
        setError(
          result?.message || "Login failed. Please check your credentials.",
        );
      }
    } catch (err) {
      setError("An unexpected error occurred.");
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen relative flex items-center justify-center p-4 overflow-hidden">
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

      {/* Main Card */}
      <div className="relative z-10 w-full max-w-md">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white/95 backdrop-blur-md rounded-large shadow-2xl p-8 border border-white/20"
        >
          <div className="text-center mb-6">
            <div className="flex items-center justify-center gap-3 mb-2">
              <img src={logo} alt="Logo" className="w-[60px] h-[60px]" />
              <h1 className="text-3xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
                SmartBoAD
              </h1>
            </div>
            <h2 className="text-xl font-bold text-text-dark">Welcome Back!</h2>
          </div>

          {/* ROLE TOGGLE TABS (Updated for 3 Roles) */}
          <div className="flex p-1 bg-gray-100 rounded-lg mb-6 shadow-inner">
            {["student", "owner", "technician", "admin"].map((r) => (
              <button
                key={r}
                onClick={() => {
                  setRole(r);
                  setError("");
                }}
                className={`flex-1 py-2 text-sm font-semibold rounded-md transition-all duration-200 capitalize ${
                  role === r
                    ? "bg-white text-primary shadow-sm"
                    : "text-gray-500 hover:text-gray-700"
                }`}
              >
                {r}
              </button>
            ))}
          </div>

          {/* FORM RENDERER */}
          <motion.div
            key={role}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.2 }}
          >
            {role === "student" && (
              <StudentLoginForm
                onSubmit={handleLogin}
                isLoading={isLoading}
                error={error}
              />
            )}

            {role === "owner" && (
              <OwnerLoginForm
                onSubmit={handleLogin}
                isLoading={isLoading}
                error={error}
              />
            )}

            {role === "technician" && (
              <OwnerLoginForm
                onSubmit={handleLogin}
                isLoading={isLoading}
                error={error}
              />
            )}

            {role === "admin" && (
              <AdminLoginForm
                onSubmit={handleLogin}
                isLoading={isLoading}
                error={error}
              />
            )}
          </motion.div>

          <div className="mt-6 text-center">
            <p className="text-text-muted text-sm">
              Don't have an account?{" "}
              <Link
                to="/signup"
                state={{ defaultRole: role }}
                className="text-accent hover:text-primary font-semibold transition-colors"
              >
                Sign Up
              </Link>
            </p>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default LoginPage;

import { useState, useEffect } from "react";
import { useOwnerAuth } from "../../context/owner/OwnerAuthContext"; 
import {
  getDashboardStats,
  getRevenueChartData,
  getDashboardTransactions,
  getRecentAppointments, // ✅ Using the specific endpoint we created
  getOwnerProfile
} from "../../api/owner/service";

export const useDashboardLogic = () => {
  const { currentOwner, isLoading: authLoading } = useOwnerAuth(); 

  const [loading, setLoading] = useState(true);
  
  // State for dashboard widgets
  const [stats, setStats] = useState({ 
    totalEarnings: 0, 
    monthlyEarnings: 0, 
    walletBalance: 0,
    totalPlatformFees: 0
  });
  
  const [chartData, setChartData] = useState([]);
  const [transactions, setTransactions] = useState([]);
  const [appointments, setAppointments] = useState([]);
  
  // Initialize user with context data (fallback)
  const [user, setUser] = useState({ 
    firstName: currentOwner?.fullName?.split(" ")[0] || "Owner", 
    fullName: currentOwner?.fullName || "Owner", 
    avatar: currentOwner?.profileImageUrl || "" 
  });

  useEffect(() => {
    if (authLoading || !currentOwner?.id) return;

    const fetchData = async () => {
      try {
        setLoading(true);
        const ownerId = currentOwner.id; 

        // =================================================================
        // 🚀 INDEPENDENT FETCHING STRATEGY
        // =================================================================

        // 1. Stats
        const statsPromise = getDashboardStats()
            .then(data => setStats(data))
            .catch(err => console.error("Stats Failed:", err));

        // 2. Chart (Returns empty array on fail)
        const chartPromise = getRevenueChartData()
            .then(data => setChartData(data))
            .catch(err => {
                console.error("Chart Failed:", err);
                setChartData([]); // Safe Fallback
            });

        // 3. Transactions (Returns empty array on fail)
        const txPromise = getDashboardTransactions()
            .then(data => setTransactions(data))
            .catch(err => {
                console.error("Transactions Failed:", err);
                setTransactions([]);
            });

        // 4. Appointments (Top 5 Recent)
        const appPromise = getRecentAppointments(ownerId)
            .then(data => {
                // Sort just in case backend didn't
                const sorted = data.sort((a, b) => 
                   new Date(b.requestedStartTime) - new Date(a.requestedStartTime)
                );
                setAppointments(sorted);
            })
            .catch(err => {
                console.error("Appointments Failed:", err);
                setAppointments([]);
            });

        // 5. Profile
        const profilePromise = getOwnerProfile()
            .then(data => {
                if (data) {
                    setUser({
                        fullName: data.fullName,
                        firstName: data.fullName ? data.fullName.split(" ")[0] : "Owner",
                        avatar: data.profileImageUrl || ""
                    });
                }
            })
            .catch(err => console.error("Profile Failed:", err));

        // ✅ Wait for all of them to "settle" (finish success or fail)
        // We use Promise.all here only to know when to turn off 'loading'
        await Promise.all([
            statsPromise, 
            chartPromise, 
            txPromise, 
            appPromise, 
            profilePromise
        ]);

      } catch (error) {
        console.error("Critical Dashboard Error:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [currentOwner, authLoading]); 

  return { 
    loading: loading || authLoading, 
    stats, 
    chartData, 
    transactions, 
    appointments, 
    user 
  };
};
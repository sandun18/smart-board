import React, { useEffect, useMemo, useState } from "react";
import HeaderBar from "../../components/Owner/common/HeaderBar";
import api from "../../api/api";
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
} from "recharts";

export default function PaymentPage() {
  const [summary, setSummary] = useState(null);
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadEarnings();
  }, []);

  const loadEarnings = async () => {
    try {
      const [summaryRes, txRes] = await Promise.all([
        api.get("/owner/earnings/summary"),
        api.get("/owner/earnings/transactions"),
      ]);

      setSummary(summaryRes.data);
      setTransactions(txRes.data || []);
    } catch (err) {
      console.error("❌ Failed to load earnings", err);
    } finally {
      setLoading(false);
    }
  };

  /* =========================
     📊 MONTHLY CHART DATA
     ========================= */

  const monthlyChartData = useMemo(() => {
    const map = {};

    transactions.forEach((t) => {
      if (t.type !== "CREDIT") return;

      const date = new Date(t.date);
      const key = date.toLocaleString("default", {
        month: "short",
        year: "numeric",
      });

      map[key] = (map[key] || 0) + t.amount;
    });

    return Object.entries(map).map(([month, amount]) => ({
      month,
      amount,
    }));
  }, [transactions]);

  return (
    <div className="pt-4 min-h-screen pb-10 bg-light space-y-10">
      <HeaderBar
        title="Earnings & Wallet"
        subtitle="Track your income, wallet balance, and monthly performance"
      />

      {loading ? (
        <div className="text-center text-muted">Loading earnings...</div>
      ) : (
        <>
          {/* ================= WALLET ================= */}
          <div className="px-4">
            <div className="bg-card-bg border border-light rounded-2xl p-6 shadow-sm">
              <p className="text-xs font-bold text-muted uppercase tracking-widest">
                Wallet Balance
              </p>
              <p className="text-3xl font-black text-success mt-2">
                LKR {summary?.walletBalance ?? 0}
              </p>
            </div>
          </div>

          {/* ================= SUMMARY ================= */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 px-4">
            <SummaryCard
              label="Total Earnings"
              value={summary?.totalEarnings}
              color="text-success"
            />
            <SummaryCard
              label="This Month"
              value={summary?.monthlyEarnings}
              color="text-accent"
            />
            <SummaryCard
              label="Platform Fees"
              value={summary?.totalPlatformFees}
              color="text-warning"
            />
            <SummaryCard
              label="Gateway Fees"
              value={summary?.totalGatewayFees}
              color="text-danger"
            />
          </div>

          {/* ================= CHART ================= */}
          <div className="px-4">
            <div className="bg-card-bg border border-light rounded-2xl p-6 shadow-sm">
              <h3 className="text-lg font-black text-text mb-4">
                Monthly Earnings
              </h3>

              {monthlyChartData.length === 0 ? (
                <p className="text-muted text-sm">
                  No earnings data available
                </p>
              ) : (
                <ResponsiveContainer width="100%" height={300}>
                  <AreaChart data={monthlyChartData}>
                    <defs>
                      <linearGradient id="colorEarnings" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#22c55e" stopOpacity={0.8} />
                        <stop offset="95%" stopColor="#22c55e" stopOpacity={0.1} />
                      </linearGradient>
                    </defs>

                    <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                    <XAxis dataKey="month" />
                    <YAxis />
                    <Tooltip
                      formatter={(value) => [`LKR ${value}`, "Earnings"]}
                    />

                    <Area
                      type="monotone"
                      dataKey="amount"
                      stroke="#22c55e"
                      fillOpacity={1}
                      fill="url(#colorEarnings)"
                    />
                  </AreaChart>
                </ResponsiveContainer>
              )}
            </div>
          </div>

          {/* ================= TRANSACTIONS ================= */}
          <div className="px-4">
            <h3 className="text-lg font-black text-text mb-4">
              Recent Transactions
            </h3>

            {transactions.length === 0 ? (
              <p className="text-muted text-sm">
                No transactions yet
              </p>
            ) : (
              <div className="space-y-3">
                {transactions.map((tx, idx) => (
                  <div
                    key={idx}
                    className="bg-card-bg border border-light rounded-xl p-4 flex justify-between items-center"
                  >
                    <div>
                      <p className="font-bold text-text text-sm">
                        {tx.reference}
                      </p>
                      <p className="text-xs text-muted mt-1">
                        {new Date(tx.date).toLocaleDateString()}
                      </p>
                    </div>

                    <div className="text-right">
                      <p
                        className={`text-sm font-black ${
                          tx.type === "CREDIT"
                            ? "text-success"
                            : "text-danger"
                        }`}
                      >
                        {tx.type === "CREDIT" ? "+" : "-"} LKR {tx.amount}
                      </p>
                      <p className="text-xs text-muted mt-1">
                        {tx.type}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </>
      )}
    </div>
  );
}

/* ================= SMALL COMPONENT ================= */

function SummaryCard({ label, value, color }) {
  return (
    <div className="bg-card-bg border border-light rounded-xl p-4 shadow-sm">
      <p className="text-xs font-bold text-muted uppercase tracking-widest">
        {label}
      </p>
      <p className={`text-xl font-black mt-2 ${color}`}>
        LKR {value ?? 0}
      </p>
    </div>
  );
}

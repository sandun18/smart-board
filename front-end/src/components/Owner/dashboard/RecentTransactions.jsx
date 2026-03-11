import React from "react";

const RecentTransactions = ({ transactions = [] }) => {
  return (
    <div className="flex flex-col overflow-hidden border shadow-sm bg-card-bg rounded-xl border-light">
      <div className="flex items-center justify-between p-6 border-b border-light">
        <h3 className="text-lg font-bold text-text">Recent Transactions</h3>
        <button className="text-sm font-bold text-primary hover:underline">
          View All
        </button>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-sm text-left text-muted">
          <thead className="text-xs font-bold tracking-wider uppercase bg-light/50 text-muted/70">
            <tr>
              <th className="px-6 py-4">Tenant</th>
              <th className="px-6 py-4">Property</th>
              <th className="px-6 py-4">Date</th>
              <th className="px-6 py-4 text-right">Amount</th>
              <th className="px-6 py-4 text-center">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-light">
            {transactions.length === 0 ? (
              <tr>
                <td colSpan="5" className="px-6 py-8 text-center text-muted">
                  No recent transactions found.
                </td>
              </tr>
            ) : (
              transactions.map((tx, index) => (
                <tr
                  key={index}
                  className="transition-colors hover:bg-light/30 group"
                >
                  <td className="px-6 py-4 font-bold text-text">
                    {tx.tenantName || "Unknown"}
                  </td>
                  <td className="px-6 py-4">{tx.propertyTitle || "N/A"}</td>
                  <td className="px-6 py-4 font-mono text-xs">
                    {new Date(tx.date).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4 font-bold text-right text-text">
                    ${tx.amount}
                  </td>
                  <td className="px-6 py-4 text-center">
                    <span
                      className={`inline-block px-2 py-1 rounded-full text-[10px] font-black uppercase tracking-widest 
                      ${
                        tx.status === "SUCCESS" || tx.status === "PAID"
                          ? "bg-green-100 text-green-700"
                          : tx.status === "PENDING"
                            ? "bg-orange-100 text-orange-700"
                            : "bg-red-100 text-red-700"
                      }`}
                    >
                      {tx.status}
                    </span>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default RecentTransactions;

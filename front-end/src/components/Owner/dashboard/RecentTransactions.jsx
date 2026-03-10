import React from "react";

const RecentTransactions = () => {
  // Mock Data
  const transactions = [
    {
      id: 1,
      tenant: "Sarah Jenkins",
      property: "Sunset Villa",
      date: "Oct 24",
      amount: "$450",
      status: "Paid",
    },
    {
      id: 2,
      tenant: "Mike Ross",
      property: "Urban Loft",
      date: "Oct 23",
      amount: "$450",
      status: "Pending",
    },
    {
      id: 3,
      tenant: "Jenny Wilson",
      property: "Sunset Villa",
      date: "Oct 22",
      amount: "$450",
      status: "Paid",
    },
    {
      id: 4,
      tenant: "Robert Fox",
      property: "Green House",
      date: "Oct 21",
      amount: "$500",
      status: "Failed",
    },
    {
      id: 5,
      tenant: "Alex Smith",
      property: "City Point",
      date: "Oct 20",
      amount: "$320",
      status: "Paid",
    },
  ];

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
            {transactions.map((tx) => (
              <tr
                key={tx.id}
                className="transition-colors hover:bg-light/30 group"
              >
                <td className="px-6 py-4 font-bold text-text">{tx.tenant}</td>
                <td className="px-6 py-4">{tx.property}</td>
                <td className="px-6 py-4 font-mono text-xs">{tx.date}</td>
                <td className="px-6 py-4 font-bold text-right text-text">
                  {tx.amount}
                </td>
                <td className="px-6 py-4 text-center">
                  <span
                    className={`inline-block px-2 py-1 rounded-full text-[10px] font-black uppercase tracking-widest 
                    ${
                      tx.status === "Paid"
                        ? "bg-green-100 text-green-700"
                        : tx.status === "Pending"
                          ? "bg-orange-100 text-orange-700"
                          : "bg-red-100 text-red-700"
                    }`}
                  >
                    {tx.status}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default RecentTransactions;

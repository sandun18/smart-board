import React, { useEffect, useState } from 'react';
import StudentLayout from '../../components/student/common/StudentLayout';
import api from '../../api/api';
import Notification from '../../components/student/maintenance/Notification';

const BillingPage = () => {
  const [bills, setBills] = useState([]);
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [notification, setNotification] = useState(null);

  /* =========================
     NOTIFICATION
  ========================= */
  const showNotification = (message, type = 'info') => {
    setNotification({ message, type });
    setTimeout(() => setNotification(null), 4000);
  };

  /* =========================
     LOAD DATA
  ========================= */
  const loadBillingData = async () => {
    try {
      setLoading(true);

      const billsRes = await api.get('/bills/student');
      const historyRes = await api.get('/payments/history');

      setBills(billsRes.data);
      setHistory(historyRes.data);

    } catch (err) {
      console.error(err);
      showNotification('Failed to load billing data', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadBillingData();
  }, []);

  /* =========================
     PAY BILL (SAME AS MOBILE)
  ========================= */
  const handlePayBill = async (bill) => {
    try {
      const res = await api.post('/payments/intent', {
        ownerId: bill.ownerId,
        boardingId: bill.boardingId,
        type: 'MONTHLY_RENT',
        monthlyBillId: bill.id,
        amount: bill.totalAmount,
        description: `Monthly Bill - ${bill.month}`,
      });

      window.location.href =
        `/student/payments/pay/select-method/${res.data.id}?boardingId=${bill.boardingId}`;

    } catch (err) {
      console.error(err);
      showNotification('Unable to start payment', 'error');
    }
  };

  return (
    <StudentLayout
      title="Billing & Payments"
      subtitle="Manage your monthly rent payments"
    >
      {loading ? (
        <div className="text-center py-20">Loading bills...</div>
      ) : (
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">

          {/* ================= BILLS ================= */}
          <div>
            <h2 className="text-xl font-semibold mb-4">My Bills</h2>

            {bills.length === 0 ? (
              <p>No bills available 🎉</p>
            ) : (
              bills.map((b) => (
                <div
                  key={b.id}
                  className="border rounded-xl p-5 mb-4 shadow-sm bg-white"
                >
                  <div className="flex justify-between mb-2">
                    <h3 className="font-semibold">{b.month}</h3>
                    <span className={`px-3 py-1 rounded-full text-sm ${
                      b.status === 'PAID'
                        ? 'bg-green-100 text-green-700'
                        : 'bg-red-100 text-red-700'
                    }`}>
                      {b.status}
                    </span>
                  </div>

                  <p className="text-gray-600">{b.boardingTitle}</p>
                  <p className="text-lg font-bold mt-2">
                    Rs. {b.totalAmount}
                  </p>

                  <div className="text-sm text-gray-500 mt-2">
                    Rent: Rs. {b.boardingFee} <br />
                    Electricity: Rs. {b.electricityFee} <br />
                    Water: Rs. {b.waterFee}
                  </div>

                  <p className="text-sm text-gray-500 mt-2">
                    Due in {b.dueInDays} day(s) • {b.dueDate}
                  </p>

                  {b.status === 'UNPAID' && (
                    <button
                      onClick={() => handlePayBill(b)}
                      className="mt-4 w-full bg-blue-600 hover:bg-blue-700 text-white py-2 rounded-lg"
                    >
                      Pay Now
                    </button>
                  )}
                </div>
              ))
            )}
          </div>

          {/* ================= PAYMENT HISTORY ================= */}
          <div>
            <h2 className="text-xl font-semibold mb-4">Payment History</h2>

            {history.length === 0 ? (
              <p>No payments yet</p>
            ) : (
              history.map((p) => (
                <div
                  key={p.id}
                  className="border rounded-xl p-4 mb-3 bg-white"
                >
                  <p className="font-semibold">Rs. {p.amount}</p>
                  <p className="text-sm text-gray-600">
                    {p.method} • {p.status}
                  </p>

                  {p.receiptUrl && (
                    <button
                      onClick={() => window.open(p.receiptUrl, '_blank')}
                      className="text-blue-600 text-sm mt-2 underline"
                    >
                      View Receipt (PDF)
                    </button>
                  )}
                </div>
              ))
            )}
          </div>
        </div>
      )}

      <Notification notification={notification} />
    </StudentLayout>
  );
};

export default BillingPage;

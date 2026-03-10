import { useEffect, useState } from "react";
import api from "../../api/api";

const useBillingLogic = () => {

  const studentId = getStudentId();

  function getStudentId() {
    const raw = localStorage.getItem("user_data");
    if (!raw) return null;
    try {
      const user = JSON.parse(raw);
      return user?.id || null;
    } catch {
      return null;
    }
  }

  const [overview, setOverview] = useState({
    currentBalance: { amount: 0, dueDate: "-" },
  });

  const [billingDetails, setBillingDetails] = useState([]);
  const [billingHistory, setBillingHistory] = useState([]);
  const [unpaidBill, setUnpaidBill] = useState(null);

  const paymentMethods = [
    { id: "CARD", name: "Card Payment" },
    { id: "CASH", name: "Cash Payment" },
    { id: "BANK_SLIP", name: "Bank Slip" },
  ];

  const [activePaymentMethod, setActivePaymentMethod] = useState("CARD");

  /* =========================
     LOAD BILLS (JWT BASED)
  ========================= */
  const loadBills = async () => {
    const res = await api.get("/bills/student");
    const bills = res.data || [];

    const unpaid = bills.find((b) => b.status !== "PAID");
    setUnpaidBill(unpaid || null);

    setOverview({
      currentBalance: {
        amount: unpaid ? Number(unpaid.totalAmount) : 0,
        dueDate: unpaid?.dueDate || "-",
      },
    });

    if (unpaid) {
      setBillingDetails([
        { label: "Boarding", value: unpaid.boardingTitle },
        { label: "Month", value: unpaid.month },
        { label: "Total", value: `LKR ${unpaid.totalAmount}` },
        { label: "Due Date", value: unpaid.dueDate },
        { label: "Status", value: unpaid.dueStatus },
      ]);
    }
  };

  /* =========================
     LOAD PAYMENT HISTORY
  ========================= */
  const loadHistory = async () => {
    const res = await api.get("/payments/history");

    setBillingHistory(
      res.data.map((p) => ({
        id: p.id,
        amount: Number(p.amount),
        title: p.method.replace("_", " "),
        boarding: p.transactionRef,
        date: p.paidAt
          ? new Date(p.paidAt).toLocaleDateString()
          : "Pending",
        status: p.status === "SUCCESS" ? "paid" : "pending",
        receiptUrl: p.receiptUrl,
      }))
    );
  };

  useEffect(() => {
    loadBills();
    loadHistory();
  }, []);

  /* =========================
     PROCESS PAYMENT
  ========================= */
  const processPayment = async ({ amount, file }) => {
  if (!unpaidBill) {
    throw new Error("No unpaid bill");
  }

  // 1️⃣ CREATE PAYMENT INTENT (SAVE RESULT!)
  const intentRes = await api.post("/payments/intent", {
    ownerId: unpaidBill.ownerId,
    boardingId: unpaidBill.boardingId,
    monthlyBillId: unpaidBill.id,
    type: "MONTHLY_RENT",
    amount: unpaidBill.totalAmount,
    description: `Rent for ${unpaidBill.month}`,
  });

  const intentId = intentRes.data.id; // ✅ NOW SAFE

  // 2️⃣ PAY BASED ON METHOD
  if (activePaymentMethod === "CARD") {
    await api.post(`/payments/pay/${intentId}?method=CARD`);
  }

  if (activePaymentMethod === "CASH") {
    await api.post(`/payments/cash/${intentId}`);
  }

  if (activePaymentMethod === "BANK_SLIP") {
    if (!file) throw new Error("Bank slip required");

    const formData = new FormData();
    formData.append("file", file);

    const upload = await api.post(
      "/files/upload/bank-slips",
      formData,
      { headers: { "Content-Type": "multipart/form-data" } }
    );

    await api.post(
      `/payments/bank-slip/${intentId}?slipUrl=${encodeURIComponent(upload.data)}`
    );
  }

  // 3️⃣ REFRESH UI
  await loadBills();
  await loadHistory();
};



  return {
    overview,
    billingDetails,
    billingHistory,
    paymentMethods,
    activePaymentMethod,
    setActivePaymentMethod,
    processPayment,
  };
};

export default useBillingLogic;

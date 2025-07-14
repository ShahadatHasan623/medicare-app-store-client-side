import { useEffect, useState } from "react";
import axios from "axios";

function PaymentHistory({ userEmail }) {
  const [payments, setPayments] = useState([]);

  useEffect(() => {
    if (!userEmail) return;

    axios.get(`/payments/${userEmail}`)
      .then(res => {
        setPayments(res.data);
      })
      .catch(err => console.error(err));
  }, [userEmail]);

  return (
    <div>
      <h2>Payment History</h2>
      {payments.length === 0 ? (
        <p>No payment records found.</p>
      ) : (
        <table className="table-auto border-collapse border border-gray-300">
          <thead>
            <tr>
              <th className="border border-gray-300 p-2">Transaction ID</th>
              <th className="border border-gray-300 p-2">Amount</th>
              <th className="border border-gray-300 p-2">Status</th>
              <th className="border border-gray-300 p-2">Date</th>
            </tr>
          </thead>
          <tbody>
            {payments.map(payment => (
              <tr key={payment._id}>
                <td className="border border-gray-300 p-2">{payment.transactionId || "N/A"}</td>
                <td className="border border-gray-300 p-2">{payment.amount}</td>
                <td className="border border-gray-300 p-2">{payment.payment_status}</td>
                <td className="border border-gray-300 p-2">{new Date(payment.date).toLocaleString()}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}

export default PaymentHistory;

import { useQuery } from "@tanstack/react-query";
import {
  FaMoneyCheckAlt,
  FaRegClock,
  FaCheckCircle,
  FaTimesCircle,
} from "react-icons/fa";
import useAxioseSecure from "../../../hooks/useAxioseSecure";
import useAuth from "../../../hooks/useAuth";
import Loader from "../../../components/Loader";

const MyPaymentHistory = () => {
  const axiosSecure = useAxioseSecure();
  const { user } = useAuth();

  const { data: payments = [], isLoading } = useQuery({
    queryKey: ["userPayments", user?.email],
    queryFn: async () => {
      const res = await axiosSecure.get(`/payments/user/${user?.email}`);
      return res.data;
    },
    enabled: !!user?.email,
  });

  if (isLoading) {
    return <Loader />;
  }

  return (
    <div className="max-w-6xl mx-auto p-4 md:p-6">
      {/* Title */}
      <h1 className="text-2xl md:text-4xl font-extrabold text-center mb-6 text-[var(--color-primary)] flex items-center justify-center gap-2">
        <FaMoneyCheckAlt className="text-[var(--color-secondary)]" />
        My Payment History
      </h1>

      {payments.length === 0 ? (
        <div className="text-center text-[var(--color-muted)] text-lg">
          <FaRegClock className="mx-auto text-5xl text-gray-400 mb-2" />
          No payment history found.
        </div>
      ) : (
        <div className="overflow-x-auto rounded-xl shadow-lg border border-[var(--color-border)]">
          <table className="w-full text-left">
            {/* Table Head */}
            <thead className="bg-[var(--color-primary)] text-[var(--navbar-text)]">
              <tr>
                <th className="py-3 px-4 text-sm md:text-base font-semibold">
                  Date
                </th>
                <th className="py-3 px-4 text-sm md:text-base font-semibold">
                  Transaction ID
                </th>
                <th className="py-3 px-4 text-sm md:text-base font-semibold">
                  Amount
                </th>
                <th className="py-3 px-4 text-sm md:text-base font-semibold text-center">
                  Status
                </th>
              </tr>
            </thead>

            {/* Table Body */}
            <tbody>
              {payments.map((p, index) => (
                <tr
                  key={p._id}
                  className={`transition-colors ${
                    index % 2 === 0
                      ? "bg-[var(--color-surface)]"
                      : "bg-[var(--color-bg)]"
                  } hover:bg-[var(--navbar-hover)]/20`}
                >
                  <td className="py-3 px-4 text-[var(--color-text)] text-sm md:text-base">
                    {new Date(p.date).toLocaleString()}
                  </td>
                  <td className="py-3 px-4 text-[var(--color-text)] text-sm md:text-base break-words">
                    {p.transactionId || "N/A"}
                  </td>
                  <td className="py-3 px-4 font-semibold text-[var(--color-secondary)] text-sm md:text-base">
                    ${p.amount.toFixed(2)}
                  </td>
                  <td className="py-3 px-4 text-center">
                    {p.status === "paid" ? (
                      <span className="inline-flex items-center gap-1 text-[var(--color-success)] font-semibold">
                        <FaCheckCircle /> Paid
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 text-[var(--color-error)] font-semibold capitalize">
                        <FaTimesCircle /> {p.status}
                      </span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default MyPaymentHistory;

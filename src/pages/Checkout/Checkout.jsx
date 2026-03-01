import React, { useState, useEffect } from "react";
import { 
  FaUser, FaMapMarkerAlt, FaShoppingCart, FaPhoneAlt, 
  FaCalendarAlt, FaCity, FaMap, FaHashtag, FaArrowRight, FaCreditCard 
} from "react-icons/fa";
import { loadStripe } from "@stripe/stripe-js";
import { Elements } from "@stripe/react-stripe-js";
import Swal from "sweetalert2";
import PaymentForm from "./PaymentForm";
import useAuth from "../../hooks/useAuth";
import { useNavigate } from "react-router";
import useAxioseSecure from "../../hooks/useAxioseSecure";

const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY);

export default function Checkout() {
  const axiosSecure = useAxioseSecure();
  const { user } = useAuth();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    fullName: "",
    email: user?.email,
    phone: "",
    dob: "",
    address: "",
    city: "",
    state: "",
    zip: "",
  });

  const [cart, setCart] = useState([]);
  const [showPayment, setShowPayment] = useState(false);

  useEffect(() => {
    const savedCart = localStorage.getItem("cartData");
    if (savedCart) setCart(JSON.parse(savedCart));
  }, []);

  const subtotal = cart.reduce((sum, item) => sum + (item.quantity ?? 0) * (item.price ?? 0), 0);
  const totalDiscount = cart.reduce(
    (sum, item) => sum + (item.quantity ?? 0) * ((item.originalPrice ?? 0) - (item.price ?? 0)),
    0
  );
  const totalAmount = subtotal * 100;

  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleContinueToPayment = (e) => {
    e.preventDefault();
    setShowPayment(true);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handlePaymentSuccess = async (paymentIntentId) => {
    try {
      const paymentInfo = {
        buyerEmail: user.email.toLowerCase(),
        transactionId: paymentIntentId,
        totalPrice: subtotal,
        status: "unpaid",
        date: new Date(),
        cartItems: cart.map((item) => ({
          medicineId: item._id,
          name: item.name,
          quantity: item.quantity,
          unitPrice: item.price,
          sellerEmail: item.sellerEmail,
        })),
      };

      const res = await axiosSecure.post("/payments", paymentInfo);
      if (res.data.insertedId || res.data.acknowledged) {
        Swal.fire({ 
            icon: "success", 
            title: "Order Confirmed!", 
            background: document.documentElement.classList.contains('dark') ? '#1f2937' : '#fff',
            color: document.documentElement.classList.contains('dark') ? '#fff' : '#000'
        });
        localStorage.removeItem("cartData");
        navigate(`/invoice/${res.data.insertedId}`);
      }
    } catch {
      Swal.fire("Error", "Failed to save payment info", "error");
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-10 px-4 md:px-8 transition-colors duration-300">
      <div className="max-w-7xl mx-auto">
        
        {/* Header */}
        <div className="text-center mb-10">
          <h2 className="text-3xl md:text-4xl font-black text-gray-800 dark:text-white flex justify-center items-center gap-3">
             <span className="p-3 bg-blue-600 text-white rounded-2xl shadow-lg shadow-blue-200 dark:shadow-none">
                <FaShoppingCart size={24}/>
             </span>
             Secure Checkout
          </h2>
          <p className="text-gray-500 dark:text-gray-400 mt-3">Finish your order by providing delivery details</p>
        </div>

        {!showPayment ? (
          <form onSubmit={handleContinueToPayment} className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            
            {/* Left Column: Form */}
            <div className="lg:col-span-8 space-y-6">
              
              {/* Personal Info */}
              <div className="bg-white dark:bg-gray-800 p-6 md:p-8 rounded-3xl shadow-sm border border-gray-100 dark:border-gray-700">
                <h3 className="text-xl font-bold mb-6 text-gray-800 dark:text-white flex items-center gap-3">
                  <FaUser className="text-blue-600" /> Personal Details
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-sm font-semibold text-gray-600 dark:text-gray-300 ml-1">Full Name</label>
                    <div className="relative">
                      <FaUser className="absolute left-4 top-3.5 text-gray-400" />
                      <input name="fullName" value={formData.fullName} onChange={handleChange} placeholder="John Doe" 
                        className="w-full pl-11 pr-4 py-3 rounded-xl border border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-4 focus:ring-blue-100 dark:focus:ring-blue-900 outline-none transition-all" required />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-semibold text-gray-600 dark:text-gray-300 ml-1">Email (Fixed)</label>
                    <input value={formData.email} disabled className="w-full px-4 py-3 rounded-xl border border-gray-100 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-gray-400 cursor-not-allowed" />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-semibold text-gray-600 dark:text-gray-300 ml-1">Phone Number</label>
                    <div className="relative">
                      <FaPhoneAlt className="absolute left-4 top-3.5 text-gray-400" />
                      <input name="phone" value={formData.phone} onChange={handleChange} placeholder="+880" 
                        className="w-full pl-11 pr-4 py-3 rounded-xl border border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-700 dark:text-white focus:ring-4 focus:ring-blue-100 dark:focus:ring-blue-900 outline-none" required />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-semibold text-gray-600 dark:text-gray-300 ml-1">Birth Date</label>
                    <div className="relative">
                      <FaCalendarAlt className="absolute left-4 top-3.5 text-gray-400" />
                      <input name="dob" type="date" value={formData.dob} onChange={handleChange} 
                        className="w-full pl-11 pr-4 py-3 rounded-xl border border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-700 dark:text-white outline-none" required />
                    </div>
                  </div>
                </div>
              </div>

              {/* Address */}
              <div className="bg-white dark:bg-gray-800 p-6 md:p-8 rounded-3xl shadow-sm border border-gray-100 dark:border-gray-700">
                <h3 className="text-xl font-bold mb-6 text-gray-800 dark:text-white flex items-center gap-3">
                  <FaMapMarkerAlt className="text-red-500" /> Shipping Address
                </h3>
                <div className="space-y-4">
                  <input name="address" value={formData.address} onChange={handleChange} placeholder="Street Address" 
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-700 dark:text-white outline-none focus:ring-4 focus:ring-blue-100 dark:focus:ring-blue-900" required />
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <input name="city" value={formData.city} onChange={handleChange} placeholder="City" className="w-full px-4 py-3 rounded-xl border dark:border-gray-600 dark:bg-gray-700 dark:text-white outline-none" required />
                    <input name="state" value={formData.state} onChange={handleChange} placeholder="State" className="w-full px-4 py-3 rounded-xl border dark:border-gray-600 dark:bg-gray-700 dark:text-white outline-none" required />
                    <input name="zip" value={formData.zip} onChange={handleChange} placeholder="Zip" className="w-full px-4 py-3 rounded-xl border dark:border-gray-600 dark:bg-gray-700 dark:text-white outline-none" required />
                  </div>
                </div>
              </div>

              <button type="submit" className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-4 rounded-2xl shadow-lg transition-all flex justify-center items-center gap-2 transform active:scale-95">
                Go to Payment <FaArrowRight />
              </button>
            </div>

            {/* Right Column: Summary */}
            <div className="lg:col-span-4">
              <div className="bg-white dark:bg-gray-800 p-6 rounded-3xl shadow-sm border border-gray-100 dark:border-gray-700 sticky top-24">
                <h3 className="text-lg font-bold mb-6 text-gray-800 dark:text-white border-b dark:border-gray-700 pb-4">Cart Summary</h3>
                <div className="space-y-4 mb-6 max-h-60 overflow-y-auto pr-2 custom-scrollbar">
                  {cart.map((item) => (
                    <div key={item._id} className="flex gap-3">
                      <img src={item.image} className="w-12 h-12 rounded-lg bg-gray-50 dark:bg-gray-700 object-contain p-1" />
                      <div className="flex-1">
                        <h4 className="text-sm font-bold dark:text-white truncate">{item.name}</h4>
                        <div className="flex justify-between text-xs mt-1">
                          <span className="text-gray-500 dark:text-gray-400">Qty: {item.quantity}</span>
                          <span className="font-bold text-blue-600 dark:text-blue-400">৳{item.price}</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="space-y-3 pt-4 border-t border-dashed dark:border-gray-600">
                  <div className="flex justify-between text-gray-500 dark:text-gray-400">
                    <span>Subtotal</span>
                    <span>৳{subtotal.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-green-600 dark:text-green-400 font-medium">
                    <span>Discount</span>
                    <span>- ৳{totalDiscount.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-xl font-black text-gray-900 dark:text-white pt-3 border-t dark:border-gray-700">
                    <span>Total</span>
                    <span>৳{subtotal.toFixed(2)}</span>
                  </div>
                </div>
              </div>
            </div>
          </form>
        ) : (
          /* Payment Section */
          <div className="max-w-4xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="bg-white dark:bg-gray-800 p-8 rounded-3xl shadow-sm border dark:border-gray-700">
              <h3 className="text-xl font-bold mb-6 dark:text-white">Review Info</h3>
              <div className="space-y-3 bg-gray-50 dark:bg-gray-900/50 p-5 rounded-2xl border dark:border-gray-700">
                <p className="text-sm text-gray-500 dark:text-gray-400 uppercase text-[10px] font-bold">Shipping To</p>
                <p className="font-bold dark:text-white">{formData.fullName}</p>
                <p className="text-sm text-gray-600 dark:text-gray-400">{formData.address}, {formData.city}</p>
                <p className="text-sm text-gray-600 dark:text-gray-400">{formData.phone}</p>
                <div className="pt-4 border-t dark:border-gray-700 mt-4 flex justify-between items-center">
                    <span className="font-bold dark:text-white text-lg">Total</span>
                    <span className="text-2xl font-black text-blue-600 dark:text-blue-400">৳{subtotal.toFixed(2)}</span>
                </div>
              </div>
              <button onClick={() => setShowPayment(false)} className="mt-4 text-blue-600 dark:text-blue-400 font-semibold text-sm hover:underline">← Change Address</button>
            </div>

            <div className="bg-white dark:bg-gray-800 p-8 rounded-3xl shadow-xl border-2 border-blue-500 ring-8 ring-blue-500/5">
              <h3 className="text-xl font-bold mb-6 flex items-center gap-2 dark:text-white">
                <FaCreditCard className="text-blue-600"/> Secure Payment
              </h3>
              {/* Stripe Elements */}
              <div className="p-4 bg-gray-50 dark:bg-gray-900 rounded-xl mb-6 border dark:border-gray-700">
                <Elements stripe={stripePromise}>
                    <PaymentForm amount={totalAmount} onPaymentSuccess={handlePaymentSuccess} />
                </Elements>
              </div>
              <p className="text-[10px] text-center text-gray-400 uppercase tracking-widest">Encrypted by Stripe & SSL</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
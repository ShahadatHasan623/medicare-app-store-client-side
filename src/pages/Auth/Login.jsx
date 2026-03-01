import { useRef, useState } from "react";
import Swal from "sweetalert2";
import { useNavigate, useLocation, NavLink } from "react-router";
import useAuth from "../../hooks/useAuth";
import Lottie from "lottie-react";
import loginAnimation from "../../assets/Login.json";
import { FaEye, FaEyeSlash, FaEnvelope, FaLock } from "react-icons/fa";
import GoogleLogin from "./soicalLogin/GoogleLogin";
import { ReTitle } from "re-title";

const Login = () => {
  const { signIn, resetPass } = useAuth();
  const emailRef = useRef();
  const passwordRef = useRef();
  const navigate = useNavigate();
  const location = useLocation();
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false); // লোডিং স্টেট
  const from = location.state?.from?.pathname || "/";

  const onSubmit = async (e) => {
    e.preventDefault();
    const email = emailRef.current.value;
    const password = passwordRef.current.value;

    if (!email || !password) {
      Swal.fire("Warning!", "Please fill in all fields", "warning");
      return;
    }

    setLoading(true);
    try {
      await signIn(email, password);
      Swal.fire({
        icon: "success",
        title: "Welcome Back!",
        text: "Logged in successfully",
        showConfirmButton: false,
        timer: 1500,
      });
      navigate(from);
    } catch (err) {
      console.error(err);
      Swal.fire("Login Failed", err.message || "Something went wrong", "error");
    } finally {
      setLoading(false);
    }
  };

  const handleForgot = async () => {
    const email = emailRef.current.value;
    if (!email) {
      Swal.fire("Wait!", "Please enter your email first", "info");
      return;
    }
    try {
      await resetPass(email);
      Swal.fire("Sent!", "Check your email for reset instructions", "success");
    } catch (err) {
      Swal.fire("Error", err.message, "error");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-6">
      <ReTitle title="Medicare | Login" />
      
      <div className="bg-white rounded-3xl shadow-2xl flex flex-col md:flex-row max-w-5xl w-full overflow-hidden border border-emerald-100">
        
        {/* Left Side: Visual Branding */}
        <div className="md:w-1/2 bg-emerald-50 p-10 flex flex-col justify-center items-center">
          <div className="text-center mb-8">
            <h1 className="text-4xl font-black text-emerald-600 tracking-tight">
              Medi<span className="text-slate-800">Care</span>
            </h1>
            <p className="text-slate-500 mt-2 font-medium">Your Trusted Pharmacy Partner</p>
          </div>
          <Lottie
            loop={true}
            animationData={loginAnimation}
            className="w-full max-w-sm drop-shadow-xl"
          />
        </div>

        {/* Right Side: Login Form */}
        <div className="md:w-1/2 p-8 md:p-14">
          <div className="text-center md:text-left mb-10">
            <h2 className="text-3xl font-bold text-slate-800">Welcome Back</h2>
            <p className="text-slate-500 mt-2">Login to manage your medicines & orders</p>
          </div>

          <form onSubmit={onSubmit} className="space-y-5">
            {/* Email Field */}
            <div className="space-y-1">
              <label className="text-sm font-semibold text-slate-700 ml-1">Email Address</label>
              <div className="relative">
                <FaEnvelope className="absolute left-4 top-1/2 -translate-y-1/2 text-emerald-500" />
                <input
                  ref={emailRef}
                  type="email"
                  placeholder="name@example.com"
                  className="w-full pl-11 dark:text-black pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all"
                  required
                />
              </div>
            </div>

            {/* Password Field */}
            <div className="space-y-1">
              <label className="text-sm font-semibold text-slate-700 ml-1">Password</label>
              <div className="relative">
                <FaLock className="absolute left-4 top-1/2 -translate-y-1/2 text-emerald-500" />
                <input
                  ref={passwordRef}
                  type={showPassword ? "text" : "password"}
                  placeholder="••••••••"
                  className="w-full pl-11 pr-12 py-3 bg-slate-50 border border-slate-200 dark:text-black rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-emerald-600 transition-colors"
                >
                  {showPassword ? <FaEyeSlash size={20} /> : <FaEye size={20} />}
                </button>
              </div>
            </div>

            {/* Forgot Password */}
            <div className="flex justify-end">
              <button
                type="button"
                onClick={handleForgot}
                className="text-sm font-medium text-emerald-600 hover:text-emerald-700 hover:underline transition-all"
              >
                Forgot password?
              </button>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-3.5 rounded-xl shadow-lg shadow-emerald-200 transition-all active:scale-[0.98] flex justify-center items-center"
            >
              {loading ? (
                <span className="loading loading-spinner loading-md"></span>
              ) : (
                "Sign In"
              )}
            </button>

            <div className="divider text-slate-400 text-xs uppercase tracking-widest font-bold">OR</div>
            
            <GoogleLogin />

            <p className="text-center text-slate-600 pt-4">
              New to Medicare?{" "}
              <NavLink to="/signup" className="text-emerald-600 font-bold hover:underline">
                Create Account
              </NavLink>
            </p>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Login;
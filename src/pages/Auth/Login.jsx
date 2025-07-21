import { useRef, useState } from "react";
import Swal from "sweetalert2";
import { useNavigate, useLocation, NavLink } from "react-router";
import useAuth from "../../hooks/useAuth";
import Lottie from "lottie-react";
import loginAnimation from "../../assets/Login.json";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import GoogleLogin from "./soicalLogin/GoogleLogin";
import { ReTitle } from "re-title";

const Login = () => {
  const { signIn, resetPass } = useAuth();
  const emailRef = useRef();
  const passwordRef = useRef();
  const navigate = useNavigate();
  const location = useLocation();
  const [showPassword, setShowPassword] = useState(false);
  const from = location.state?.from?.pathname || "/";

  const onSubmit = async (e) => {
    e.preventDefault();
    const email = emailRef.current.value;
    const password = passwordRef.current.value;

    if (!email || !password) {
      Swal.fire("Warning!", "Please fill in all fields", "warning");
      return;
    }

    try {
      await signIn(email, password);
      Swal.fire("Success!", "Logged in successfully", "success");
      navigate(from);
    } catch (err) {
      console.error(err);
      Swal.fire("Login Failed", err.message || "Something went wrong", "error");
    }
  };

  const handleForgot = async () => {
    const email = emailRef.current.value;
    if (!email) {
      Swal.fire("Warning!", "Please enter your email address", "warning");
      return;
    }
    try {
      await resetPass(email);
      Swal.fire("Success!", "Password reset email sent successfully", "success");
    } catch (err) {
      console.error(err);
      Swal.fire("Failed", err.message || "Something went wrong", "error");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#E0F7FA] to-[#F3E5F5] p-4 rounded-3xl max-w-7xl mx-auto my-12">
      <ReTitle title="Medicare | Login"></ReTitle>
      <div className="bg-white rounded-2xl shadow-2xl grid md:grid-cols-2 items-center p-6 md:p-10 max-w-4xl w-full">
        {/* Left Side: Animation */}
        <div className="hidden md:block">
          <Lottie
            loop={true}
            animationData={loginAnimation}
            className="w-full h-80"
          />
        </div>

        {/* Right Side: Form */}
        <div className="space-y-6">
          <h2 className="text-3xl font-bold text-center text-[#4A148C]">
            Login to Medicine Shop
          </h2>
          <p className="text-center text-sm text-gray-500">
            Enter your credentials to continue
          </p>

          <form onSubmit={onSubmit} className="space-y-4">
            {/* Email */}
            <input
              ref={emailRef}
              placeholder="Email"
              type="email"
              className="input input-bordered w-full"
              required
            />

            {/* Password with show/hide */}
            <div className="relative">
              <input
                ref={passwordRef}
                type={showPassword ? "text" : "password"}
                placeholder="Password"
                className="input input-bordered w-full pr-10"
                required
              />
              <span
                className="absolute right-3 top-3 text-gray-500 cursor-pointer"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? <FaEyeSlash size={20} /> : <FaEye size={20} />}
              </span>
            </div>

            <div
              type="button"
              onClick={handleForgot}
              className="flex justify-between text-sm"
            >
              <a className="link link-hover text-blue-500">Forgot password?</a>
            </div>

            <button
              type="submit"
              className="btn bg-[#5A4FCF] hover:bg-[#4A3BB5] text-white w-full"
            >
              Login
            </button>
            <GoogleLogin></GoogleLogin>
            <p className="text-center text-sm text-gray-600">
              Don't have an account?{" "}
              <NavLink to="/signup">
                <span className="hover:underline text-blue-500">Sign Up</span>
              </NavLink>
            </p>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Login;

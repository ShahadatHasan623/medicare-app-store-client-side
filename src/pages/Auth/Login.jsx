import { useForm } from "react-hook-form";
import Swal from "sweetalert2";
import { useNavigate, useLocation, NavLink } from "react-router";
import useAuth from "../../hooks/useAuth";
import Lottie from "lottie-react";
import loginAnimation from "../../assets/Login.json";


const Login = () => {
  const { signIn } = useAuth();
  const { register, handleSubmit } = useForm();
  const navigate = useNavigate();
  const location = useLocation();
  const from = location.state?.from?.pathname || "/";

  const onSubmit = async (data) => {
    try {
      const { email, password } = data;
      await signIn(email, password);
      Swal.fire("Success!", "Logged in successfully", "success");
      navigate(from)
    } catch (err) {
      console.error(err);
      Swal.fire("Login Failed", err.message || "Something went wrong", "error");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#E0F7FA] to-[#F3E5F5] p-4 rounded-3xl">
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

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <input
              {...register("email")}
              placeholder="Email"
              type="email"
              className="input input-bordered w-full"
              required
            />
            <input
              {...register("password")}
              type="password"
              placeholder="Password"
              className="input input-bordered w-full"
              required
            />
            <div>
              <a className="link link-hover">Forgot password?</a>
            </div>
            <button type="submit" className="btn btn-primary w-full">
              Login
            </button>
          </form>
          <p>
            Don't have an account?{" "}
            <NavLink to="/signup">
              <span className="hover:underline text-blue-500">SignUp</span>
            </NavLink>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;

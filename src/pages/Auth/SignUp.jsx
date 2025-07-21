import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { Link, useNavigate } from "react-router";
import axios from "axios";
import useAxios from "../../hooks/useAxios";
import useAuth from "../../hooks/useAuth";
import GoogleLogin from "./soicalLogin/GoogleLogin";
import signUpLottie from "../../assets/register.json";
import Lottie from "lottie-react";
import Swal from "sweetalert2";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import { ReTitle } from "re-title";

const SignUp = () => {
  const { createUser, updateProfileUser } = useAuth();
  const [photourl, setPhotoUrl] = useState("");
  const axiosUser = useAxios();
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const onSubmit = async (data) => {
    const { email, password, name, role } = data;

    try {
      const result = await createUser(email, password);

      // upload user info to db
      const userInfo = {
        email,
        name: name,
        role,
        created_at: new Date().toISOString(),
        last_log_in: new Date().toISOString(),
      };
      await axiosUser.post("/users", userInfo);

      // update firebase profile
      const userProfile = {
        displayName: name,
        photoURL: photourl || "https://i.ibb.co/0y7VvYb/default-avatar.png",
      };
      await updateProfileUser(userProfile);
      Swal.fire({
        title: "Signup successfully",
        icon: "success",
        draggable: true,
      });
      navigate("/");
    } catch (err) {
      console.error(err);
      Swal.fire("Error", err.message, "error");
    }
  };

  const handleImageChange = async (e) => {
    const image = e.target.files[0];
    const formData = new FormData();
    formData.append("image", image);

    const imageUrl = `https://api.imgbb.com/1/upload?key=${
      import.meta.env.VITE_image_key
    }`;

    try {
      const res = await axios.post(imageUrl, formData);
      if (res.data?.success) {
        setPhotoUrl(res.data.data.url);
      }
    } catch (error) {
      console.error("Image upload error:", error);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#FCE4EC] to-[#E8EAF6] px-4 max-w-7xl py-16 mx-auto rounded-2xl">
      <ReTitle title="Medicare | SignUp"></ReTitle>
      <div className="bg-white rounded-2xl shadow-xl grid md:grid-cols-2 gap-10 p-8 max-w-5xl w-full">
        {/* Left Side: Lottie */}
        <div className="hidden md:flex items-center justify-center">
          <Lottie
            animationData={signUpLottie}
            loop={true}
            className="w-full h-96"
          />
        </div>

        {/* Right Side: Form */}
        <div className="w-full">
          <h2 className="text-3xl font-bold text-center text-purple-800 mb-4">
            Create a New Account
          </h2>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            {/* Name */}
            <div>
              <label className="label">Your Name</label>
              <input
                type="text"
                {...register("name", { required: true })}
                className="input input-bordered w-full"
                placeholder="Your Name"
              />
              {errors.name && (
                <p className="text-red-500 text-sm">Name is required</p>
              )}
            </div>

            {/* Photo Upload */}
            <div>
              <label className="label">Upload Photo</label>
              <input
                type="file"
                onChange={handleImageChange}
                className="file-input file-input-bordered w-full"
              />
            </div>

            {/* Email */}
            <div>
              <label className="label">Email</label>
              <input
                type="email"
                {...register("email", { required: true })}
                className="input input-bordered w-full"
                placeholder="Email"
              />
              {errors.email && (
                <p className="text-red-500 text-sm">Email is required</p>
              )}
            </div>

            {/* Password */}
            <div className="relative">
              <label className="label">Password</label>
              <input
                type={showPassword ? "text" : "password"}
                {...register("password", {
                  required: true,
                  pattern: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).{8,}$/,
                })}
                className="input input-bordered w-full pr-10"
                placeholder="Password"
              />
              <button
                type="button"
                onClick={() => setShowPassword((prev) => !prev)}
                className="absolute top-9 right-3 text-gray-600 hover:text-gray-900 focus:outline-none"
                tabIndex={-1}
                aria-label={showPassword ? "Hide password" : "Show password"}
              >
                {showPassword ? <FaEyeSlash size={20} /> : <FaEye size={20} />}
              </button>

              {errors.password?.type === "required" && (
                <p className="text-red-500 text-sm">Password is required</p>
              )}
              {errors.password?.type === "pattern" && (
                <p className="text-red-500 text-sm">
                  Password must be at least 8 characters and include uppercase,
                  lowercase, number, and special character.
                </p>
              )}
            </div>

            {/* Role */}
            <div>
              <label className="label">Register As</label>
              <select
                {...register("role", { required: true })}
                defaultValue="user"
                className="select select-bordered w-full"
              >
                <option value="user">User</option>
                <option value="seller">Seller</option>
              </select>
            </div>

            {/* Submit Button */}
            <button type="submit" className="btn btn-primary w-full">
              Register
            </button>

            {/* Login Link */}
            <p className="text-center text-sm">
              Already have an account?{" "}
              <Link to="/login" className="text-blue-600 hover:underline">
                Login
              </Link>
            </p>

            {/* Google Login */}
            <GoogleLogin />
          </form>
        </div>
      </div>
    </div>
  );
};

export default SignUp;

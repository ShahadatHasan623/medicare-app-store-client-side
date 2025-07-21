import React, { useState, useEffect } from "react";
import {
  FaUser,
  FaEnvelope,
  FaImage,
  FaSave,
  FaCrown,
  FaStore,
  FaEdit,
} from "react-icons/fa";
import useAuth from "../../hooks/useAuth";
import { useRole } from "../../hooks/useRool";
import Swal from "sweetalert2";

const UpdateProfile = () => {
  const { user } = useAuth();
  const { role, isLoadingRole } = useRole();

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    profilePic: "",
  });

  const [isModalOpen, setIsModalOpen] = useState(false);

  // ইউজারের ডিফল্ট ডাটা সেট করা
  useEffect(() => {
    if (user) {
      setFormData({
        name: user.displayName || "",
        email: user.email || "",
        profilePic: user.photoURL || "",
      });
    }
  }, [user]);

  // ইনপুট চেঞ্জ হ্যান্ডলার
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // প্রোফাইল আপডেট হ্যান্ডলার
  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Updated Data:", { ...formData, role });
    setIsModalOpen(false);
    Swal.fire("✅ Success", "Profile updated successfully!", "success");
    // এখানে backend/Firebase এর updateProfile API কল করতে হবে
  };

  // Role Badge
  const getRoleBadge = () => {
    if (role === "admin")
      return (
        <span className="flex items-center gap-2 text-white bg-red-500 px-3 py-1 rounded-full">
          <FaCrown /> Admin
        </span>
      );
    if (role === "seller")
      return (
        <span className="flex items-center gap-2 text-white bg-green-500 px-3 py-1 rounded-full">
          <FaStore /> Seller
        </span>
      );
    return (
      <span className="flex items-center gap-2 text-white bg-blue-500 px-3 py-1 rounded-full">
        <FaUser /> User
      </span>
    );
  };

  if (isLoadingRole) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-lg font-semibold text-gray-600">Loading...</p>
      </div>
    );
  }

  return (
    <div className="bg-[var(--color-bg)] min-h-screen my-12 p-6 px-4 flex justify-center items-center">
      <div className="bg-white shadow-xl rounded-xl p-8 w-full max-w-lg text-center">
        {/* Profile Picture */}
        <div className="w-24 h-24 mx-auto rounded-full border-4 border-[var(--color-primary)] overflow-hidden">
          {formData.profilePic ? (
            <img
              src={formData.profilePic}
              alt="Profile"
              className="w-full h-full object-cover"
            />
          ) : (
            <FaUser className="text-[var(--color-primary)] text-5xl mt-6" />
          )}
        </div>

        {/* Name and Email */}
        <h1 className="text-2xl font-bold mt-4 text-[var(--color-primary)]">
          {formData.name || "User Name"}
        </h1>
        <p className="text-gray-600">{formData.email || "user@example.com"}</p>
        <div className="mt-2">{getRoleBadge()}</div>

        {/* Edit Profile Button */}
        <button
          onClick={() => setIsModalOpen(true)}
          className="mt-4 bg-[var(--color-secondary)] text-white px-4 py-2 rounded-lg flex items-center justify-center gap-2 mx-auto hover:bg-opacity-90"
        >
          <FaEdit /> Edit Profile
        </button>
      </div>

      {/* Edit Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-opacity-40 flex justify-center items-center z-50">
          <div className="bg-white rounded-lg shadow-lg p-6 w-96">
            <h3 className="text-xl font-bold text-[var(--color-primary)] mb-4 text-center">
              Update Profile
            </h3>
            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Name */}
              <div className="flex items-center border rounded-lg px-3 py-2">
                <FaUser className="text-gray-500 mr-3" />
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  className="w-full outline-none"
                  placeholder="Your Name"
                />
              </div>

              {/* Profile Picture */}
              <div className="flex items-center border rounded-lg px-3 py-2">
                <FaImage className="text-gray-500 mr-3" />
                <input
                  type="text"
                  name="profilePic"
                  value={formData.profilePic}
                  onChange={handleChange}
                  className="w-full outline-none"
                  placeholder="Profile Picture URL"
                />
              </div>

              {/* Buttons */}
              <div className="flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 bg-gray-400 text-white rounded-lg hover:bg-gray-500"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-[var(--color-primary)] text-white rounded-lg hover:bg-opacity-90 flex items-center gap-2"
                >
                  <FaSave /> Save
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default UpdateProfile;

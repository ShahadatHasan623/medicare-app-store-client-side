import React from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import Swal from "sweetalert2";
import useAxioseSecure from "../../../hooks/useAxioseSecure";
import Loader from "../../../components/Loader";

export default function ManageUsers() {
  const axiosSecure = useAxioseSecure();
  const queryClient = useQueryClient();

  // Fetch users
  const {
    data: users = [],
    isLoading,
    error,
  } = useQuery({
    queryKey: ["users"],
    queryFn: async () => {
      const res = await axiosSecure.get("/users");
      return res.data;
    },
  });

  // Update role mutation
  const updateRoleMutation = useMutation({
    mutationFn: ({ id, role }) =>
      axiosSecure.patch(`/users/role/${id}`, { role }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["users"] });
      Swal.fire("Updated!", "User role updated successfully.", "success");
    },
    onError: () => {
      Swal.fire("Error!", "Failed to update user role.", "error");
    },
  });

  // Delete user mutation
  const deleteUserMutation = useMutation({
    mutationFn: (id) => axiosSecure.delete(`/users/${id}`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["users"] });
      Swal.fire("Deleted!", "User has been deleted.", "success");
    },
    onError: () => {
      Swal.fire("Error!", "Failed to delete user.", "error");
    },
  });

  const handleDelete = (id) => {
    Swal.fire({
      title: "Are you sure?",
      text: "You won't be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "var(--color-secondary)",
      cancelButtonColor: "var(--color-primary)",
      confirmButtonText: "Yes, delete it!",
    }).then((result) => {
      if (result.isConfirmed) {
        deleteUserMutation.mutate(id);
      }
    });
  };

  if (isLoading) return <Loader />;
  if (error)
    return (
      <p className="text-center text-[var(--color-secondary)] font-bold mt-5">
        Error loading users
      </p>
    );

  return (
    <div className="my-10 px-2 sm:px-4 max-w-7xl mx-auto">
      <div
        className="p-4 rounded-lg shadow-lg"
        style={{
          backgroundColor: "var(--color-bg)",
          boxShadow: "0 0 15px rgba(90, 79, 207, 0.2)",
        }}
      >
        <h2 className="text-center text-2xl sm:text-3xl font-bold text-[var(--color-primary)] mb-6">
          Manage Users
        </h2>

        <div className="overflow-x-auto">
          <table className="min-w-full border border-gray-200 bg-white rounded-lg whitespace-nowrap">
            <thead className="bg-[var(--color-primary)] text-white text-left">
              <tr>
                <th className="px-3 sm:px-5 py-3 text-sm sm:text-base">Name</th>
                <th className="px-3 sm:px-5 py-3 text-sm sm:text-base">Email</th>
                <th className="px-3 sm:px-5 py-3 text-sm sm:text-base">Role</th>
                <th className="px-3 sm:px-5 py-3 text-sm sm:text-base">
                  Change Role
                </th>
                <th className="px-3 sm:px-5 py-3 text-sm sm:text-base">Delete</th>
              </tr>
            </thead>
            <tbody className="text-[var(--color-text)] text-sm sm:text-base">
              {users.length === 0 && (
                <tr>
                  <td colSpan={5} className="text-center py-5 italic">
                    No users found.
                  </td>
                </tr>
              )}
              {users.map(({ _id, name, email, role }) => (
                <tr
                  key={_id}
                  className="border-b hover:bg-gray-100 transition"
                >
                  <td className="px-3 sm:px-5 py-3">{name || "-"}</td>
                  <td className="px-3 sm:px-5 py-3">{email}</td>
                  <td className="px-3 sm:px-5 py-3 capitalize">{role}</td>
                  <td className="px-3 sm:px-5 py-3">
                    <select
                      value={role}
                      onChange={(e) =>
                        updateRoleMutation.mutate({
                          id: _id,
                          role: e.target.value,
                        })
                      }
                      disabled={updateRoleMutation.isLoading}
                      className="px-2 py-1 rounded border border-[var(--color-primary)] bg-white text-[var(--color-text)] font-semibold text-sm sm:text-base"
                    >
                      <option value="user">User</option>
                      <option value="seller">Seller</option>
                      <option value="admin">Admin</option>
                    </select>
                  </td>
                  <td className="px-3 sm:px-5 py-3">
                    <button
                      onClick={() => handleDelete(_id)}
                      disabled={deleteUserMutation.isLoading}
                      className="bg-[var(--color-secondary)] hover:bg-[#dc6a17] text-white font-bold px-3 py-1 rounded transition text-sm sm:text-base"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

import React from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import Swal from "sweetalert2";
import useAxioseSecure from "../../../hooks/useAxioseSecure";

export default function ManageUsers() {
  const axiosSecure = useAxioseSecure();
  const queryClient = useQueryClient();

  // Fetch users
  const { data: users = [], isLoading, error } = useQuery(
    ["users"],
    async () => {
      const res = await axiosSecure.get("/users");
      return res.data;
    }
  );

  // Update role mutation
  const updateRoleMutation = useMutation(
    ({ id, role }) => axiosSecure.patch(`/users/role/${id}`, { role }),
    {
      onSuccess: () => {
        queryClient.invalidateQueries(["users"]);
        Swal.fire("Updated!", "User role updated successfully.", "success");
      },
      onError: () => {
        Swal.fire("Error!", "Failed to update user role.", "error");
      },
    }
  );

  // Delete user mutation
  const deleteUserMutation = useMutation(
    (id) => axiosSecure.delete(`/users/${id}`),
    {
      onSuccess: () => {
        queryClient.invalidateQueries(["users"]);
        Swal.fire("Deleted!", "User has been deleted.", "success");
      },
      onError: () => {
        Swal.fire("Error!", "Failed to delete user.", "error");
      },
    }
  );

  if (isLoading) return <p>Loading users...</p>;
  if (error) return <p>Error loading users</p>;

  const handleDelete = (id) => {
    Swal.fire({
      title: "Are you sure?",
      text: "You won't be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Yes, delete it!",
    }).then((result) => {
      if (result.isConfirmed) {
        deleteUserMutation.mutate(id);
      }
    });
  };

  return (
    <div>
      <h2>Manage Users</h2>
      <table border="1" cellPadding="8" cellSpacing="0" style={{ width: "100%" }}>
        <thead>
          <tr>
            <th>Name</th>
            <th>Email</th>
            <th>Role</th>
            <th>Change Role</th>
            <th>Delete</th>
          </tr>
        </thead>
        <tbody>
          {users.length === 0 && (
            <tr>
              <td colSpan={5} style={{ textAlign: "center" }}>
                No users found.
              </td>
            </tr>
          )}
          {users.map(({ _id, name, email, role }) => (
            <tr key={_id}>
              <td>{name || "-"}</td>
              <td>{email}</td>
              <td>{role}</td>
              <td>
                <select
                  value={role}
                  onChange={(e) =>
                    updateRoleMutation.mutate({ id: _id, role: e.target.value })
                  }
                  disabled={updateRoleMutation.isLoading}
                >
                  <option value="user">User</option>
                  <option value="seller">Seller</option>
                  <option value="admin">Admin</option>
                </select>
              </td>
              <td>
                <button
                  onClick={() => handleDelete(_id)}
                  disabled={deleteUserMutation.isLoading}
                  style={{
                    backgroundColor: "#e74c3c",
                    color: "white",
                    border: "none",
                    padding: "5px 10px",
                    borderRadius: "4px",
                    cursor: "pointer",
                  }}
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

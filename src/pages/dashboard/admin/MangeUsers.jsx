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

  if (isLoading)
    return <Loader></Loader>;
  if (error)
    return (
      <p
        style={{
          color: "var(--color-secondary)",
          textAlign: "center",
          marginTop: "20px",
          fontWeight: "bold",
        }}
      >
        Error loading users
      </p>
    );

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

  return (
    <div className="my-10 max-w-7xl mx-auto">
      <div
        className=""
        style={{
          backgroundColor: "var(--color-bg)",
          borderRadius: "8px",
          boxShadow: "0 0 15px rgba(90, 79, 207, 0.2)",
        }}
      >
        <h2
          style={{
            color: "var(--color-primary)",
            fontSize: "2rem",
            marginBottom: "1.5rem",
            fontWeight: "bold",
            textAlign: "center",
          }}
        >
          Manage Users
        </h2>

        <table
          style={{
            width: "100%",
            borderCollapse: "collapse",
            backgroundColor: "#fff",
            boxShadow: "0 2px 10px rgba(0,0,0,0.05)",
            borderRadius: "8px",
            overflow: "hidden",
          }}
        >
          <thead
            style={{
              backgroundColor: "var(--color-primary)",
              color: "#fff",
              textAlign: "left",
              fontWeight: "bold",
            }}
          >
            <tr>
              <th style={{ padding: "12px 15px" }}>Name</th>
              <th style={{ padding: "12px 15px" }}>Email</th>
              <th style={{ padding: "12px 15px" }}>Role</th>
              <th style={{ padding: "12px 15px" }}>Change Role</th>
              <th style={{ padding: "12px 15px" }}>Delete</th>
            </tr>
          </thead>
          <tbody style={{ color: "var(--color-text)" }}>
            {users.length === 0 && (
              <tr>
                <td
                  colSpan={5}
                  style={{
                    textAlign: "center",
                    padding: "20px",
                    fontStyle: "italic",
                  }}
                >
                  No users found.
                </td>
              </tr>
            )}
            {users.map(({ _id, name, email, role }) => (
              <tr
                key={_id}
                style={{
                  borderBottom: "1px solid #ddd",
                  transition: "background-color 0.3s ease",
                }}
                onMouseEnter={(e) =>
                  (e.currentTarget.style.backgroundColor = "#f0f0f0")
                }
                onMouseLeave={(e) =>
                  (e.currentTarget.style.backgroundColor = "transparent")
                }
              >
                <td style={{ padding: "12px 15px" }}>{name || "-"}</td>
                <td style={{ padding: "12px 15px" }}>{email}</td>
                <td
                  style={{ padding: "12px 15px", textTransform: "capitalize" }}
                >
                  {role}
                </td>
                <td style={{ padding: "12px 15px" }}>
                  <select
                    value={role}
                    onChange={(e) =>
                      updateRoleMutation.mutate({
                        id: _id,
                        role: e.target.value,
                      })
                    }
                    disabled={updateRoleMutation.isLoading}
                    style={{
                      padding: "6px 10px",
                      borderRadius: "4px",
                      border: "1px solid var(--color-primary)",
                      color: "var(--color-text)",
                      fontWeight: "600",
                      cursor: "pointer",
                      backgroundColor: "#fff",
                    }}
                  >
                    <option value="user">User</option>
                    <option value="seller">Seller</option>
                    <option value="admin">Admin</option>
                  </select>
                </td>
                <td style={{ padding: "12px 15px" }}>
                  <button
                    onClick={() => handleDelete(_id)}
                    disabled={deleteUserMutation.isLoading}
                    style={{
                      backgroundColor: "var(--color-secondary)",
                      color: "#fff",
                      border: "none",
                      padding: "8px 14px",
                      borderRadius: "6px",
                      fontWeight: "bold",
                      cursor: "pointer",
                      transition: "background-color 0.3s ease",
                    }}
                    onMouseEnter={(e) =>
                      (e.currentTarget.style.backgroundColor = "#dc6a17")
                    }
                    onMouseLeave={(e) =>
                      (e.currentTarget.style.backgroundColor =
                        "var(--color-secondary)")
                    }
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
  );
}

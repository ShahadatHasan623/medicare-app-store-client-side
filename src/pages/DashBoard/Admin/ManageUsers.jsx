import React from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import useAxioseSecure from "../../../hooks/useAxioseSecure";



export default function ManageUsers() {
  const queryClient = useQueryClient();
  const axioseSecure=useAxioseSecure()

  const { data: users = [], isLoading } = useQuery(["users"], async () => {
    const res = await axioseSecure.get("/users");
    return res.data;
  });

  const updateUserRoleMutation = useMutation(
    ({ id, role }) =>
      axioseSecure.patch(`/users/role/${id}`, { role }),
    {
      onSuccess: () => queryClient.invalidateQueries(["users"]),
    }
  );

  if (isLoading) return <p>Loading users...</p>;

  const handleRoleChange = (id, newRole) => {
    updateUserRoleMutation.mutate({ id, role: newRole });
  };

  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">Manage Users</h1>
      <table className="table-auto w-full border">
        <thead>
          <tr>
            <th className="border p-2">Name</th>
            <th className="border p-2">Email</th>
            <th className="border p-2">Role</th>
          </tr>
        </thead>
        <tbody>
          {users.map((u) => (
            <tr key={u._id}>
              <td className="border p-2">{u.displayName || "N/A"}</td>
              <td className="border p-2">{u.email}</td>
              <td className="border p-2">
                <select
                  value={u.role}
                  onChange={(e) => handleRoleChange(u._id, e.target.value)}
                  className="select select-bordered"
                >
                  <option value="user">User</option>
                  <option value="seller">Seller</option>
                  <option value="admin">Admin</option>
                </select>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

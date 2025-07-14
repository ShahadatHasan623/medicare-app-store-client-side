import React from "react";
import axios from "axios";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import Swal from "sweetalert2";

const fetchCart = async (email) => {
  const res = await axios.get(`/cart/${email}`);
  return res.data;
};

const clearAllCartItems = async (email) => {
  const res = await axios.delete(`/cart/clear/${email}`);
  return res.data;
};

const CartPage = ({ userEmail }) => {
  const queryClient = useQueryClient();

  // Fetch cart data
  const { data: cartItems, isLoading, isError } = useQuery(
    ["cart", userEmail],
    () => fetchCart(userEmail),
    { enabled: !!userEmail }
  );

  // Mutation to clear cart
  const clearCartMutation = useMutation(clearAllCartItems, {
    onSuccess: () => {
      queryClient.invalidateQueries(["cart", userEmail]);
      Swal.fire("Cleared!", "All items removed from cart.", "success");
    },
    onError: () => {
      Swal.fire("Error!", "Failed to clear cart.", "error");
    },
  });

  const handleClearCart = () => {
    Swal.fire({
      title: "Are you sure?",
      text: "This will remove all items from your cart!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Yes, clear cart!",
    }).then((result) => {
      if (result.isConfirmed) {
        clearCartMutation.mutate(userEmail);
      }
    });
  };

  if (isLoading) return <p>Loading cart...</p>;
  if (isError) return <p>Error loading cart.</p>;

  return (
    <div className="p-4">
      <h2 className="text-2xl font-bold mb-4">Your Cart</h2>
      {cartItems.length === 0 ? (
        <p>Your cart is empty.</p>
      ) : (
        <>
          <table className="table-auto border-collapse border border-gray-300 w-full mb-4">
            <thead>
              <tr>
                <th className="border border-gray-300 p-2">Medicine</th>
                <th className="border border-gray-300 p-2">Company</th>
                <th className="border border-gray-300 p-2">Price</th>
                <th className="border border-gray-300 p-2">Quantity</th>
              </tr>
            </thead>
            <tbody>
              {cartItems.map((item) => (
                <tr key={item._id}>
                  <td className="border border-gray-300 p-2">{item.itemName}</td>
                  <td className="border border-gray-300 p-2">{item.company}</td>
                  <td className="border border-gray-300 p-2">${item.pricePerUnit}</td>
                  <td className="border border-gray-300 p-2">{item.quantity}</td>
                </tr>
              ))}
            </tbody>
          </table>
          <button
            onClick={handleClearCart}
            className="btn btn-error"
            disabled={clearCartMutation.isLoading}
          >
            {clearCartMutation.isLoading ? "Clearing..." : "Clear Cart"}
          </button>
        </>
      )}
    </div>
  );
};

export default CartPage;

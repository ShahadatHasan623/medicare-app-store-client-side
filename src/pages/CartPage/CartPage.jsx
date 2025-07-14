import { FaTrash, FaPlus, FaMinus } from "react-icons/fa";
import { useLocalStorageCart } from "../../utils/useLocalStorageCart";

export default function ShoppingCartPage() {
  const { cart, addToCart, removeItem, clearCart, updateQuantity } =
    useLocalStorageCart();

  const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
  const totalPrice = cart.reduce(
    (sum, item) => sum + item.quantity * item.price,
    0
  );
  const totalDiscount = cart.reduce(
    (sum, item) =>
      sum + item.quantity * (item.originalPrice - item.price || 0),
    0
  );
  const subtotal = totalPrice;
  const tax = parseFloat((subtotal * 0.08).toFixed(2));
  const total = parseFloat((subtotal + tax).toFixed(2));

  return (
    <div className="max-w-7xl mx-auto px-4 my-10">
      <h2 className="text-4xl font-extrabold mb-3 text-slate-800">🛒 Shopping Cart</h2>
      <p className="mb-8 text-gray-500 text-lg">Review your selected medicines before checkout</p>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Cart Items */}
        <div className="lg:col-span-2 space-y-5">
          {cart.length === 0 ? (
            <p className="text-gray-500 text-lg">Your cart is empty.</p>
          ) : (
            cart.map((item) => (
              <div
                key={item._id}
                className="flex items-center justify-between p-5 bg-white rounded-2xl shadow-md transition hover:shadow-lg"
              >
                {/* Left Part */}
                <div className="flex items-start gap-4">
                  <img
                    src={item.image}
                    alt={item.name}
                    className="w-20 h-20 object-contain rounded-lg border"
                  />
                  <div>
                    <h3 className="font-semibold text-xl text-slate-800">{item.name}</h3>
                    <p className="text-sm text-gray-500">{item.generic}</p>
                    <p className="text-sm text-gray-400">
                      {item.company} | {item.type} | {item.strength}
                    </p>
                    <span className="text-xs mt-1 inline-block bg-blue-100 text-blue-700 px-2 py-0.5 rounded-full capitalize">
                      {item.type}
                    </span>
                  </div>
                </div>

                {/* Right Part */}
                <div className="text-right space-y-1">
                  <div>
                    <p className="line-through text-sm text-gray-400">${item.originalPrice}</p>
                    <p className="text-green-600 text-lg font-bold">${item.price}</p>
                    <p className="text-xs text-red-500 font-medium">
                      {Math.round(
                        ((item.originalPrice - item.price) / item.originalPrice) * 100
                      )}
                      % OFF
                    </p>
                  </div>

                  {/* Quantity */}
                  <div className="flex items-center justify-end mt-2">
                    <button
                      onClick={() => updateQuantity(item._id, -1)}
                      className="bg-gray-200 hover:bg-gray-300 px-2 py-1 rounded-l text-sm"
                    >
                      <FaMinus />
                    </button>
                    <span className="px-4 border-y text-sm">{item.quantity}</span>
                    <button
                      onClick={() => updateQuantity(item._id, 1)}
                      className="bg-gray-200 hover:bg-gray-300 px-2 py-1 rounded-r text-sm"
                    >
                      <FaPlus />
                    </button>
                  </div>
                  <p className="text-sm text-gray-500">Stock: {item.stock}</p>

                  <p className="mt-2 font-semibold text-slate-700">
                    Total: ${(item.quantity * item.price).toFixed(2)}
                  </p>

                  <button
                    className="text-red-500 hover:text-red-700 text-xl mt-2"
                    onClick={() => removeItem(item._id)}
                  >
                    <FaTrash />
                  </button>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Order Summary */}
        <div className="bg-white rounded-2xl shadow-md p-6 space-y-4 h-fit">
          <h3 className="text-2xl font-bold text-slate-700 flex items-center gap-2">
            🧾 Order Summary
          </h3>
          <div className="flex justify-between text-gray-700">
            <span>Items ({totalItems})</span>
            <span>${totalPrice.toFixed(2)}</span>
          </div>
          <div className="flex justify-between text-green-600 font-medium">
            <span>Discount</span>
            <span>-${totalDiscount.toFixed(2)}</span>
          </div>
          <div className="flex justify-between border-t pt-2 text-gray-700">
            <span>Subtotal</span>
            <span>${subtotal.toFixed(2)}</span>
          </div>
          <div className="flex justify-between">
            <span>Tax (8%)</span>
            <span>${tax.toFixed(2)}</span>
          </div>
          <div className="flex justify-between text-lg font-bold text-slate-900 border-t pt-3">
            <span>Total</span>
            <span>${total.toFixed(2)}</span>
          </div>

          <button className="bg-blue-600 hover:bg-blue-700 transition text-white w-full py-2 rounded-lg text-lg font-medium">
            🛒 Proceed to Checkout
          </button>
          <button
            onClick={clearCart}
            className="bg-red-600 hover:bg-red-700 transition text-white w-full py-2 rounded-lg text-lg font-medium"
          >
            🗑️ Clear Cart
          </button>
        </div>
      </div>
    </div>
  );
}

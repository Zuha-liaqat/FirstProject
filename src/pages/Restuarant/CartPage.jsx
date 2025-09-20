import { useSelector, useDispatch } from "react-redux";
import {
  
  clearCart,
  removeFromCart,
  increaseQuantity,
  decreaseQuantity
} from "../../redux/cartSlice";
import { useState } from "react";
import { useNavigate } from "react-router-dom"; 


const CartPage = () => {
  const cartItems = useSelector((state) => state.cart?.items || []);
  const token = useSelector((state) => state.auth.token);
  const dispatch = useDispatch();
  const [orderPlaced, setOrderPlaced] = useState(false);
  const navigate = useNavigate(); 
  const API_URL = import.meta.env.VITE_API_URL;
  
 
const totalPrice = cartItems.reduce(
  (total, item) => total + item.price * item.quantity,
  0
);
  const handlePlaceOrder = async () => {
  try {
    const user = JSON.parse(localStorage.getItem("user"));
    

    const res = await fetch(`${API_URL}/food/placeorder`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        cart: cartItems.map((item) => item.id),
        payment:totalPrice,
        id: user?._id,
        email: user?.email, // ✅ email bhejna
      }),
    });

    const data = await res.json();
    if (data.success) {
      setOrderPlaced(true); // UI update
      dispatch(clearCart()); // cart empty
    } else {
      alert(data.message);
    }
  } catch (error) {
    console.error("Order error", error);
  }
};

  // ✅ Agar order placed ho gaya
  if (orderPlaced) {
    return (
      <div className="flex flex-col items-center justify-center h-[60vh] text-center">
       
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-20 w-20 text-green-500 mb-4"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth={2}
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M5 13l4 4L19 7"
          />
        </svg>
        
        <h1 className="text-2xl font-bold text-green-600">
           Order Placed Successfully!
        </h1>
        <p className="text-gray-600 mt-2">
          Thank you for your order. You will receive your food soon.
        </p>
        <button
          onClick={() => navigate("/app/home")} // 👈 direct home navigate
          className="mt-6 text-white px-4 py-2 rounded bg-[#37A9C8]"
        >
          Back to Home
        </button>
      </div>
    );
  }

  // ✅ Agar cart khali hai
  if (cartItems.length === 0) {
    return <p className="text-center mt-10">Your cart is empty</p>;
  }

  return (
    <div className="p-6 max-w-5xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">Your Cart</h1>
      {cartItems.map((item) => (
        <div key={item.id} className="flex items-center gap-4 border-b py-4">
          <img
            src={item.imageurl}
            alt={item.title}
            className="w-20 h-20 object-cover rounded"
          />
          <div className="flex-1">
            <h2 className="font-semibold">{item.title}</h2>
            <p className="text-gray-600">Price: Rs.{item.price}</p>
            <p className="text-gray-600">
              Subtotal: Rs.{item.price * item.quantity}
            </p>
          </div>

          {/* Quantity Controls */}
          <div className="flex items-center gap-2">
            <button
              onClick={() => dispatch(decreaseQuantity(item.id))}
              className="px-3 py-1 bg-gray-300 rounded"
            >
              -
            </button>
            <span className="font-bold">{item.quantity}</span>
            <button
              onClick={() => dispatch(increaseQuantity(item.id))}
              className="px-3 py-1 bg-gray-300 rounded"
            >
              +
            </button>
          </div>

          <button
            onClick={() => dispatch(removeFromCart(item.id))}
            className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600 ml-4"
          >
            Remove
          </button>
        </div>
      ))}

      {/* Total & Clear Cart */}
      <div className="mt-6 flex justify-between items-center">
        <h2 className="text-xl font-bold">Total: Rs.{totalPrice} </h2>
        <button
          onClick={() => dispatch(clearCart())}
          className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600"
        >
          Clear Cart
        </button>
      </div>

      <button
        onClick={handlePlaceOrder}
        className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 mt-6"
      >
        Place Order
      </button>
    </div>
  );
};

export default CartPage;

import React, { useEffect, useState } from "react";
import { Heart } from "lucide-react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast"
const API_URL = import.meta.env.VITE_API_URL;

export default function Wishlist() {
  const [wishlist, setWishlist] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate()

  // ✅ Fetch wishlist from backend
  useEffect(() => {
    const fetchWishlist = async () => {
      try {
        const token = localStorage.getItem("accessToken");
        const res = await fetch(`${API_URL}/user/wishlist/get`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (!res.ok) throw new Error("Failed to fetch wishlist");

        const data = await res.json();
        setWishlist(data.items || []); // backend se jo items array aye usko set karo
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchWishlist();
  }, []);

  // ✅ Remove from wishlist
  const handleRemove = async (id) => {
    try {
      const token = localStorage.getItem("accessToken");
      const res = await fetch(`${API_URL}/user/wishlist/remove/${id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
       
      if (!res.ok) throw new Error("Failed to remove item");

      // frontend se bhi remove kar do
      setWishlist((prev) => prev.filter((item) => item._id !== id));
       toast.success("Removed from wishlist");
    } catch (err) {
      console.error(err);
    }
  };

  if (loading) return <p className="text-center mt-10">Loading...</p>;

  if (wishlist.length === 0)
    return <p className="text-center mt-10">No items in wishlist</p>;

  return (
    <div className="p-6 min-h-screen ">
      <h2 className="text-2xl font-bold mb-6">My Wishlist</h2>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4"  >
        {wishlist.map((item) => (
          <div
            key={item._id}
            className="bg-white p-4 rounded-lg shadow-md relative"
            onClick={() => navigate(`/app/restaurant/${item._id}`)}
          >
            <img
              src={item.imageurl}
              alt={item.name}
              className="w-full h-40 object-cover rounded-md mb-3"
            />
            <h3 className="text-lg font-semibold">{item.title}</h3>
           
            <button
              onClick={() => handleRemove(item._id)}
              className="absolute top-3 right-3 p-2 rounded-full bg-red-100 hover:bg-red-200 transition"
            >
              <Heart className="w-5 h-5 text-red-500 fill-red-500" />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}

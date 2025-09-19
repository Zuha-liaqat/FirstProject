import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Edit, Trash2, Plus, Search, Heart, Star } from "lucide-react";
import { useSelector } from "react-redux";
import toast from "react-hot-toast";
const FoodList = () => {
  const [restaurants, setRestaurants] = useState([]);
  const [wishlist, setWishlist] = useState([]); // ✅ wishlist state
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [debouncedSearch, setDebouncedSearch] = useState(search);
  const token = useSelector((state) => state.auth.token);
  const API_URL = import.meta.env.VITE_API_URL;
  const navigate = useNavigate();

  const user = JSON.parse(localStorage.getItem("user"));
  const isAdmin = user?.role === "admin";

  // debounce for search
  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedSearch(search);
    }, 500);

    return () => clearTimeout(handler);
  }, [search]);

  // ✅ Fetch restaurants
  const fetchRestaurants = async (page, searchText = "") => {
    try {
      setLoading(true);
      const res = await fetch(
        `${API_URL}/food/list?page=${page}&limit=4&search=${searchText}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      const data = await res.json();
      if (data.success) {
        setRestaurants(data.food);
        setTotalPages(data.totalPages);
      } else {
        setError(data.message || "Failed to fetch restaurants");
      }
    } catch (err) {
      setError("Something went wrong!");
    } finally {
      setLoading(false);
    }
  };

  // ✅ Fetch wishlist
  const fetchWishlist = async () => {
    try {
      const res = await fetch(`${API_URL}/user/wishlist/get`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const data = await res.json();
      if (data.success) {
        setWishlist(data.items.map((item) => item._id)); // sirf IDs rakho
      }
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchRestaurants(page, debouncedSearch);
    fetchWishlist();
  }, [page, debouncedSearch]);

  // ✅ Wishlist toggle
  const handleAddToWishlist = async (id) => {
    try {
      let res;
      if (wishlist.includes(id)) {
        // remove
        res = await fetch(`${API_URL}/user/wishlist/remove/${id}`, {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
      } else {
        // add
        res = await fetch(`${API_URL}/user/wishlist/add/${id}`, {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
      }

      if (!res.ok) throw new Error("Wishlist update failed");

      // ✅ frontend state toggle
      setWishlist((prev) =>
        prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
      );
      if (wishlist.includes(id)) {
        toast.success("Removed from wishlist");
      } else {
        toast.success("Added to wishlist");
      }
    } catch (err) {
      console.error(err);
    }
  };

  // ✅ Delete handler
  const handleDelete = async (id) => {
    try {
      const res = await fetch(`${API_URL}/food/delete/${id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await res.json();
      if (data.success) {
        alert("Food deleted successfully!");
        setRestaurants((prev) => prev.filter((item) => item._id !== id));
      } else {
        alert(data.message);
      }
    } catch (error) {
      console.error("Delete error:", error);
    }
  };

  // ✅ UI
  if (error) return <p className="text-center mt-10 text-red-500">{error}</p>;

  return (
    <>
      <div className="min-h-screen bg-gray-100 rounded-tl-3xl rounded-tr-3xl p-5">
        <div className="bg-[#37A9C8] text-white py-12 text-center rounded-tl-3xl rounded-tr-3xl">
          <h1 className="text-5xl font-bold mb-2 font-dancing">Food Heaven</h1>
          <p className="text-lg max-w-xl mx-auto">
            Taste the finest dishes in town. Discover your favorite meals and
            enjoy every bite!
          </p>
        </div>

        {/* Search + Add Food */}
        <div className="flex flex-col sm:flex-row justify-between items-center p-6 gap-4">
          <div className="flex items-center bg-white px-3 py-2 rounded-full shadow w-full sm:w-80">
            <Search className="text-gray-400 mr-2" size={18} />
            <input
              type="text"
              placeholder="Search by name..."
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
                setPage(1);
              }}
              className="flex-1 outline-none text-gray-700"
            />
          </div>
          {isAdmin && (
            <button
              onClick={() => navigate("/app/create-food")}
              className="flex items-center gap-2 bg-white text-[#37A9C8] font-medium px-4 py-2 rounded-full shadow hover:bg-gray-100 transition"
            >
              <Plus size={18} /> Add Food
            </button>
          )}
        </div>

        {/* Grid */}
        <div className="p-6 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
          {loading ? (
            <p className="col-span-full text-center text-gray-500">
              Loading...
            </p>
          ) : restaurants.length > 0 ? (
            restaurants.map((rest) => (
              <div
                key={rest._id}
                className="relative bg-white rounded-xl shadow hover:shadow-lg transition-shadow duration-300 overflow-hidden"
              >
                {rest.imageurl ? (
                  <img
                    src={rest.imageurl}
                    alt={rest.title}
                    className="w-full h-48 object-cover"
                  />
                ) : (
                  <div className="w-full h-48 bg-gray-200 flex items-center justify-center text-gray-400">
                    No Image
                  </div>
                )}
                <div className="p-4">
                  {/* Title + Actions */}
                  <div className="flex justify-between items-center">
                    <h3 className="text-xl font-semibold">{rest.title}</h3>
                    <div className="flex gap-2">
                      {isAdmin && (
                        <>
                          <button
                            onClick={() => navigate(`/app/update/${rest._id}`)}
                            className="p-2 bg-yellow-400 text-white rounded-full transition"
                            title="Update"
                          >
                            <Edit size={16} />
                          </button>
                          <button
                            onClick={() => handleDelete(rest._id)}
                            className="p-2 bg-red-500 text-white rounded-full hover:bg-red-600 transition"
                            title="Delete"
                          >
                            <Trash2 size={16} />
                          </button>
                        </>
                      )}
                    </div>
                  </div>

                  {/* Rating */}
                  <p className="text-gray-700 font-medium flex items-center gap-2 mt-1">
                    Rating:
                    <span className="flex items-center gap-1">
                      {Array.from({ length: rest.rating || 0 }, (_, i) => (
                        <Star
                          key={i}
                          className="w-4 h-4 text-yellow-300 fill-yellow-300"
                        />
                      ))}
                    </span>
                  </p>

                  {/* Wishlist + Details */}
                  <div className="mt-4 flex justify-between items-center">
                    <button
                      onClick={() => navigate(`/app/restaurant/${rest._id}`)}
                      className="px-3 py-1 bg-[#37A9C8] text-white rounded transition"
                    >
                      View Details
                    </button>
                    <button
                      onClick={() => handleAddToWishlist(rest._id)}
                      className="absolute top-5 right-1 px-1 py-1 rounded transition"
                    >
                      <Heart
                        className={`w-6 h-6 ${
                          wishlist.includes(rest._id)
                            ? "fill-red-500 text-red-500"
                            : "fill-black text-black"
                        }`}
                      />
                    </button>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <p className="col-span-full text-center text-gray-500">
              No matching foods found.
            </p>
          )}
        </div>
      </div>

      {/* Pagination */}
      <div className="flex justify-end items-center gap-4 mt-6 py-3">
        <button
          disabled={page === 1}
          onClick={() => setPage(page - 1)}
          className="px-4 py-2 bg-gray-300 rounded disabled:opacity-50"
        >
          Prev
        </button>
        <span>
          Page {page} of {totalPages}
        </span>
        <button
          disabled={page === totalPages}
          onClick={() => setPage(page + 1)}
          className="px-4 py-2 bg-gray-300 rounded disabled:opacity-50"
        >
          Next
        </button>
      </div>
    </>
  );
};

export default FoodList;

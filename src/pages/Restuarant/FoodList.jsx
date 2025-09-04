import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Edit, Trash2, Plus, Search } from "lucide-react";

const FoodList = () => {
  const [restaurants, setRestaurants] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [search, setSearch] = useState(""); 
  const [page, setPage] = useState(1);          
  const [totalPages, setTotalPages] = useState(1); 

  const user = JSON.parse(localStorage.getItem("user"));
  const isAdmin = user?.role === "admin";
  const navigate = useNavigate();

  // 🔹 Fetch foods with pagination
  const fetchRestaurants = async (page) => {
    try {
      setLoading(true);
      const response = await fetch(
        `${API_URL}/food/list?page=${page}&limit=5`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      const data = await response.json();
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

  useEffect(() => {
    fetchRestaurants(page);
  }, [page]);

  // 🔹 Delete handler
  const handleDelete = async (id) => {
    try {
      const token = localStorage.getItem("token");
      const res = await fetch(
        `${API_URL}/food/delete/${id}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

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

  if (loading) return <p className="text-center mt-10">Loading...</p>;
  if (error) return <p className="text-center mt-10 text-red-500">{error}</p>;

  // 🔹 Filter restaurants by search (frontend side)
  const filteredRestaurants = restaurants.filter((rest) =>
    rest.title?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <>
    <div className="min-h-screen bg-gray-100 rounded-tl-3xl rounded-tr-3xl">
      {/* Header */}
      <div className="bg-[#37A9C8] text-white py-12 text-center rounded-tl-3xl rounded-tr-3xl">
        <h1 className="text-4xl font-bold mb-2">Food Heaven</h1>
        <p className="text-lg max-w-xl mx-auto">
          Taste the finest dishes in town. Discover your favorite meals and
          enjoy every bite!
        </p>
      </div>

      {/* Add + Search Bar */}
      <div className="flex flex-col sm:flex-row justify-between items-center p-6 gap-4">
        {/* 🔹 Search Input */}
        <div className="flex items-center bg-white px-3 py-2 rounded-full shadow w-full sm:w-80">
          <Search className="text-gray-400 mr-2" size={18} />
          <input
            type="text"
            placeholder="Search by name..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
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

      {/* Restaurant Grid */}
      <div className="p-6 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6">
        {filteredRestaurants.length > 0 ? (
          filteredRestaurants.map((rest) => (
            <div
              key={rest._id}
              className="bg-white rounded-xl shadow hover:shadow-lg transition-shadow duration-300 overflow-hidden"
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
                <h3 className="text-xl font-semibold mb-1">{rest.title}</h3>
                <p className="text-gray-700 text-sm mb-2">
                  Price: {rest.price || "N/A"} Rs
                </p>
                <p className="text-gray-700 font-medium">
                  Rating: {rest.rating || 0} ⭐
                </p>

                {/* Action Buttons */}
                <div className="mt-4 flex flex-wrap gap-3">
                  <button
                    onClick={() => navigate(`/app/restaurant/${rest._id}`)}
                    className="px-3 py-1 bg-green-500 text-white rounded hover:bg-green-600 transition"
                  >
                    View Details
                  </button>
                  {isAdmin && (
                    <>
                      <button
                        onClick={() => navigate(`/app/update/${rest._id}`)}
                        className="p-2 bg-[#37A9C8] text-white rounded-full transition"
                        title="Update"
                      >
                        <Edit size={18} />
                      </button>

                      <button
                        onClick={() => handleDelete(rest._id)}
                        className="p-2 bg-red-500 text-white rounded-full hover:bg-red-600 transition"
                        title="Delete"
                      >
                        <Trash2 size={18} />
                      </button>
                    </>
                  )}
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
     {/* 🔹 Pagination Controls */}
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

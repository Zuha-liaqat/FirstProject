import { useState } from "react";

const CreateRestaurant = () => {
  const [title, setTitle] = useState("");
  const [imageurl, setImageurl] = useState("");
  const [rating, setRating] = useState("");
  const [message, setMessage] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    const data = { title, imageurl,rating };

    try {
      const token = localStorage.getItem("token");
      const response = await fetch(
        `${API_URL}/food/create`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(data),
        }
      );

      const result = await response.json();
      if (result.success) {
        setMessage(result.message);
        setTitle("");
        setImageurl("");
       
        setRating("");
      } else {
        setMessage(result.message);
      }
    } catch (error) {
      setMessage("Something went wrong!");
    }
  };

  return (
    <div className=" flex  justify-center  py-8 bg-gray-50">
      <div className="bg-white p-10 rounded-2xl shadow-2xl w-full max-w-md">
        <h2 className="text-3xl font-extrabold mb-4 text-center text-gray-800">
          Add New Food
        </h2>
        <p className="text-center text-gray-500 mb-6">
          Fill in the details below to add a new dish.
        </p>

        {message && (
          <p className="mb-4 text-center text-sm font-medium text-green-600 animate-pulse">
            {message}
          </p>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          <input
            type="text"
            placeholder="Title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
          />
          <input
            type="text"
            placeholder="Image URL"
            value={imageurl}
            onChange={(e) => setImageurl(e.target.value)}
            className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
          />
          
          <input
            type="number"
            placeholder="Rating"
            value={rating}
            onChange={(e) => setRating(e.target.value)}
            className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
          />

          {/* Image Preview */}
          {imageurl && (
            <div className="flex justify-center my-3">
              <img
                src={imageurl}
                alt="Preview"
                className="w-44 h-44 object-cover rounded-xl border-2 border-gray-200 shadow"
                onError={(e) =>
                  (e.target.src =
                    "https://via.placeholder.com/150?text=No+Image")
                }
              />
            </div>
          )}

          <button
            type="submit"
            className="w-full bg-[#37A9C8]  text-white py-3 rounded-xl font-semibold text-lg transition-colors shadow-lg"
          >
            Add
          </button>
        </form>
      </div>
    </div>
  );
};

export default CreateRestaurant;

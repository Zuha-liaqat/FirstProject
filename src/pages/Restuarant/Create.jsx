import { useState, useRef } from "react";
import { useSelector } from "react-redux";

const CreateRestaurant = () => {
  const [title, setTitle] = useState("");
  const [price, setPrice] = useState("");
  const [rating, setRating] = useState("");
  const [description, setDescription] = useState("");
  const [image, setImage] = useState(null);
  const [message, setMessage] = useState("");
  const API_URL = import.meta.env.VITE_API_URL;
  const token = useSelector((state) => state.auth.token);

  // ✅ file input ref
  const fileInputRef = useRef(null);

  const handleSubmit = async (e) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append("title", title);
    formData.append("price", price);
    formData.append("rating", rating);
    formData.append("description", description);
    if (image) formData.append("image", image);

    try {
      const response = await fetch(`${API_URL}/food/create`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formData,
      });

      const result = await response.json();
      if (result.success) {
        setMessage(result.message);

        // ✅ form reset
        setTitle("");
        setPrice("");
        setRating("");
        setDescription("");
        setImage(null);

        // ✅ file input bhi reset
        if (fileInputRef.current) {
          fileInputRef.current.value = "";
        }
      } else {
        setMessage(result.message);
      }
    } catch (error) {
      setMessage("Something went wrong!");
    }
  };

  return (
    <div className="flex justify-center py-8 bg-gray-50">
      <div className="bg-white p-10 rounded-2xl shadow-2xl w-full max-w-md">
        <h2 className="text-3xl font-extrabold mb-4 text-center text-gray-800">
          Add New Food
        </h2>

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
            className="w-full px-4 py-3 rounded-xl bg-gray-50 border border-gray-300"
          />
          <input
            type="number"
            placeholder="Price"
            value={price}
            onChange={(e) => setPrice(e.target.value)}
            className="w-full px-4 py-3 bg-gray-50 border border-gray-300 rounded-xl"
          />
          <input
            type="number"
            placeholder="Rating"
            value={rating}
            onChange={(e) => setRating(e.target.value)}
            className="w-full px-4 py-3 bg-gray-50 border border-gray-300 rounded-xl"
          />
          <textarea
            placeholder="Description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="w-full px-4 py-3 bg-gray-50 border border-gray-300 rounded-xl"
            rows="4"
          ></textarea>

          {/* File upload */}
          <input
            type="file"
            accept="image/*"
            ref={fileInputRef}   // ✅ ref attach
            onChange={(e) => setImage(e.target.files[0])}
            className="w-full"
          />

          {/* Image Preview */}
          {image && (
            <div className="flex justify-center my-3">
              <img
                src={URL.createObjectURL(image)}
                alt="Preview"
                className="w-44 h-44 object-cover rounded-xl border border-gray-300 shadow"
              />
            </div>
          )}

          <button
            type="submit"
            className="w-full bg-[#37A9C8] text-white py-3 rounded-xl font-semibold text-lg shadow-lg"
          >
            Add
          </button>
        </form>
      </div>
    </div>
  );
};

export default CreateRestaurant;

import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { addToCart } from "../../redux/cartSlice";

const FoodDetails = () => {
  const { id } = useParams();
  const [restaurant, setRestaurant] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const API_URL = import.meta.env.VITE_API_URL;
  useEffect(() => {
    const fetchRestaurantById = async () => {
      try {
        const response = await fetch(
          `${API_URL}/food/get/${id}`
        );
        const data = await response.json();

        if (data.success) {
          setRestaurant(data.food);
        } else {
          setError(data.message || "Restaurant not found");
        }
      } catch (err) {
        setError("Something went wrong!");
      } finally {
        setLoading(false);
      }
    };

    fetchRestaurantById();
  }, [id]);

  const handleAddToCart = () => {
    dispatch(
      addToCart({
        id: restaurant._id,
        title: restaurant.title,
        imageurl: restaurant.imageurl,
        price: restaurant.price,
      })
    );
    navigate("/app/cart"); // ✅ cart page pr bhej do
  };

  if (loading) return <p className="text-center mt-10">Loading...</p>;
  if (error) return <p className="text-center mt-10 text-red-500">{error}</p>;

  return (
    <div className="p-6 flex justify-center">
      {restaurant && (
        <div className="w-full max-w-4xl bg-white rounded-xl shadow py-6 px-8">
          <h1 className="text-3xl font-bold mb-4">{restaurant.title}</h1>
          <img
            src={restaurant.imageurl}
            alt={restaurant.title}
            className="w-full h-96 object-cover rounded-md mb-4"
          />
          <p className="mb-2">Price: Rs.{restaurant.price}</p>
          <p className="mb-4">{restaurant.description}</p>

          <button
            onClick={handleAddToCart}
            className="mt-4 text-white px-4 py-2 rounded bg-[#37A9C8]"
          >
            Add to Cart
          </button>
        </div>
      )}
    </div>
  );
};

export default FoodDetails;

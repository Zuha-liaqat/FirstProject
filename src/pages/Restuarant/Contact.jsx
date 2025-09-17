import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { addnumber, subtarctnumber } from "../../redux/counterSlice";
import { add, remove } from "../../redux/todolistSlice";

export default function ContactForm() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    message: "",
  });
  const [loading, setLoading] = useState(false);
  const number = useSelector((state) => state.counter.value);
  const [value, setValue] = useState("");
  const data = useSelector((state) => state.todo.items) || [];
  const token = useSelector((state) => state.auth.token);

  const dispatch = useDispatch();

  const handleAdd = () => {
    if (value.trim() !== "") {
      dispatch(add(value)); // Redux me value save hogi
      setValue(""); // input clear
    }
  };

  const API_URL = import.meta.env.VITE_API_URL;

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
     

      const res = await fetch(`${API_URL}/contact/create`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(formData),
      });

      const data = await res.json();

      if (data.success) {
        alert("Message sent successfully!");
        setFormData({ name: "", email: "", message: "" });
      } else {
        alert(data.message || "Failed to send message");
      }
    } catch (err) {
      console.error("Contact API Error:", err);
      alert("Something went wrong while sending message!");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <div className="min-h-screen bg-gray-50 flex justify-center items-center py-20 px-4 rounded-tl-3xl rounded-tr-3xl">
        <form
          onSubmit={handleSubmit}
          className="bg-white p-10 rounded-xl shadow-lg w-full max-w-lg"
        >
          <h2 className="text-3xl font-bold text-[#37A9C8] mb-6 text-center">
            Contact Us
          </h2>

          <label className="block mb-4">
            <span className="text-gray-700 font-medium">Name</span>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
              className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#37A9C8]"
            />
          </label>

          <label className="block mb-4">
            <span className="text-gray-700 font-medium">Email</span>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
              className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#37A9C8]"
            />
          </label>

          <label className="block mb-6">
            <span className="text-gray-700 font-medium">Message</span>
            <textarea
              name="message"
              value={formData.message}
              onChange={handleChange}
              required
              rows="5"
              className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#37A9C8]"
            />
          </label>

          <button
            type="submit"
            disabled={loading}
            className={`w-full text-white font-semibold py-2.5 rounded-lg transition duration-200 ${
              loading ? "bg-gray-400" : "bg-[#37A9C8] hover:bg-[#2d8aa3]"
            }`}
          >
            {loading ? "Sending..." : "Send Message"}
          </button>
        </form>
      </div>
{/*
      <div className="flex gap-4">
        <button onClick={() => dispatch(addnumber())}>add number</button>
        <p>{number}</p>
        <button onClick={() => dispatch(subtarctnumber())}>
          subtract number
        </button>
      </div>

      <div className="flex gap-2 mb-6">
        <input
          type="text"
          placeholder="Enter a task..."
          className="flex-1 border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
          value={value}
          onChange={(e) => setValue(e.target.value)}
        />
        <button
          className="px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg transition"
          onClick={handleAdd}
        >
          Add
        </button>
      </div>

      {/* Todo List */}
      {/*
      <ul className="space-y-3">
        {data.length === 0 ? (
          <p className="text-gray-500 text-center">No tasks yet</p>
        ) : (
          data.map((item, index) => (
            <li
              key={index}
              className="flex justify-between items-center bg-gray-100 px-4 py-2 rounded-lg shadow-sm"
            >
              <span className="text-gray-700">{item}</span>
              <button
                className="text-red-500 hover:text-red-700 font-semibold"
                onClick={() => dispatch(remove(index))}
              >
                ✕
              </button>
            </li>
          ))
        )}
      </ul>
*/}
    </>
  );
}

import React, { useState } from "react";

export default function ContactForm() {
  const [formData, setFormData] = useState({ name: "", email: "", message: "" });
  const [loading, setLoading] = useState(false);
  const API_URL = import.meta.env.VITE_API_URL;
  
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
        const token = localStorage.getItem("token");

        const res = await fetch(`${API_URL}/contact/create`, {
        method: "POST",
        headers: { "Content-Type": "application/json" ,
            Authorization: `Bearer ${token}`
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
    <div className="min-h-screen bg-gray-50 flex justify-center items-center py-20 px-4 rounded-tl-3xl rounded-tr-3xl">
      <form 
        onSubmit={handleSubmit} 
        className="bg-white p-10 rounded-xl shadow-lg w-full max-w-lg"
      >
        <h2 className="text-3xl font-bold text-[#37A9C8] mb-6 text-center">Contact Us</h2>

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
  );
}

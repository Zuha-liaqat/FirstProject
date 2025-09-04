import React, { useEffect, useState } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import { useNavigate } from "react-router-dom";
import { User } from "lucide-react";

const API_URL = import.meta.env.VITE_API_URL;

export default function EditProfilePage() {
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const formik = useFormik({
    initialValues: { name: "" },
    validationSchema: Yup.object({
      name: Yup.string().min(2, "Too short!").required("Name is required"),
    }),
    onSubmit: async (values) => {
      try {
        const token = localStorage.getItem("token");
        const res = await fetch(`${API_URL}/user/update-user`, {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ name: values.name }),
        });

        if (!res.ok) throw new Error("Failed to update profile");
        await res.json();

        alert("Profile updated successfully!");
        navigate("/app/profile");
      } catch (err) {
        console.error(err);
        alert("Error updating profile!");
      }
    },
  });

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await fetch(`${API_URL}/user/get-user`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        });

        if (!res.ok) throw new Error("Failed to fetch profile");
        const data = await res.json();
        formik.setValues({ name: data.user.name });
      } catch (err) {
        console.error(err);
        alert("Error fetching profile!");
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, []);

  if (loading) return <p className="text-center mt-20">Loading...</p>;

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-50 rounded-tl-3xl rounded-tr-3xl">
      <div className="bg-white p-8 rounded-2xl shadow-xl w-full max-w-md">
        <h2 className="text-2xl font-bold text-center mb-6 text-[#37A9C8]">
          Edit Profile
        </h2>

        <form onSubmit={formik.handleSubmit} className="space-y-6">
          {/* Name Field */}
          <div>
            <label
              htmlFor="name"
              className="block text-gray-700 text-sm font-medium mb-2"
            >
              Full Name
            </label>
            <div className="relative">
              <User className="absolute left-3 top-3 text-gray-400" size={20} />
              <input
                id="name"
                name="name"
                type="text"
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                value={formik.values.name}
                className={`w-full pl-10 pr-4 py-2 border ${
                  formik.touched.name && formik.errors.name
                    ? "border-red-500"
                    : "border-gray-300"
                } rounded-lg focus:ring-2 focus:ring-[#37A9C8] focus:outline-none`}
              />
            </div>
            {formik.touched.name && formik.errors.name && (
              <p className="text-red-500 text-sm mt-1">
                {formik.errors.name}
              </p>
            )}
          </div>

          {/* Buttons */}
          <div className="space-y-3">
            <button
              type="submit"
              className="w-full bg-[#37A9C8] text-white font-semibold py-2.5 rounded-lg hover:bg-[#2b89a3] transition"
            >
              Save Changes
            </button>
            <button
              type="button"
              onClick={() => navigate("/app/profile")}
              className="w-full bg-gray-400 text-white font-semibold py-2.5 rounded-lg hover:bg-gray-500 transition"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

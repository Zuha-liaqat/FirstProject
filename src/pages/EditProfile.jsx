import React, { useEffect, useState } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import { useNavigate } from "react-router-dom";

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
        navigate("/app/profile"); // redirect back
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
    <div className="flex items-center justify-center min-h-screen">
      <div className="bg-gray-100 p-8 rounded-lg shadow-md w-full max-w-md">
        <h2 className="text-2xl font-bold text-center mb-6">Edit Profile</h2>

        <form onSubmit={formik.handleSubmit}>
          <div className="flex justify-between items-center mb-8">
            <h1>Name</h1>
            <input
              id="name"
              name="name"
              type="text"
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              value={formik.values.name}
              className="text-end px-4 py-2  border-b border-gray-500  text-gray-900"
            />
            {formik.touched.name && formik.errors.name ? (
              <p className="text-red-500 text-sm mt-1">{formik.errors.name}</p>
            ) : null}
          </div>

          <button
            type="submit"
            className="w-full bg-[#37A9C8] text-white font-semibold py-2.5 rounded-lg transition duration-200"
          >
            Save Changes
          </button>
          <button
            type="button"
            onClick={() => navigate("/app/profile")}
            className="w-full bg-gray-400 text-white font-semibold py-2.5 rounded-lg transition duration-200 mt-2"
          >
            Cancel
          </button>
        </form>
      </div>
    </div>
  );
}

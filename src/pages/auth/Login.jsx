import React from "react";
import { useDispatch,useSelector } from "react-redux";
import { useFormik } from "formik";
import * as Yup from "yup";
import { useNavigate } from "react-router-dom";
import { useEffect } from "react";
import { setUser } from "../../redux/authSlice";

const API_URL = import.meta.env.VITE_API_URL;

export default function LoginForm() {
  const navigate= useNavigate()
  const dispatch = useDispatch()

useEffect(() => {
  const token = localStorage.getItem("accessToken");
  if (token) {
    navigate("/app/home");
  }
}, [navigate]);

  const formik = useFormik({
    initialValues: {
      email: "",
      password: "",
    },
    validationSchema: Yup.object({
      email: Yup.string().email("Invalid email").required("Email is required"),
      password: Yup.string()
        .min(6, "At least 6 characters")
        .required("Password is required"),
    }),
    onSubmit: async (values, { resetForm }) => {
      try {
        const res = await fetch(`http://localhost:3000/api/v1/auth/login`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          
          body: JSON.stringify(values),
        });

        if (!res.ok) throw new Error("Failed to login");
        const data = await res.json();
        console.log("Registered:", data);
        localStorage.setItem("accessToken", data.accessToken);
        localStorage.setItem("refreshToken", data.refreshToken);
        localStorage.setItem("user", JSON.stringify(data.user));
        dispatch(setUser({token:data.accessToken,user:data.user}))
        alert("login successfully!");

        resetForm();
       navigate("/app/home");
      } catch (err) {
        console.error(err);
        alert("Something went wrong!");
      }
    },
  });

  return (
    <div className="flex items-center justify-center min-h-screen bg-[#37A9C8]">
      <form
        onSubmit={formik.handleSubmit}
        className="bg-white p-8 rounded-sm shadow-xl w-full max-w-md"
      >
        <div className="items-center flex justify-center mb-5">
        <img src="logo.png" alt="" className="w-8 h-8"/>
        </div>

        <div className="mb-4">
          <label
            htmlFor="email"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            Email
          </label>
          <input
            id="email"
            name="email"
            type="email"
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            value={formik.values.email}
            className="w-full px-4 py-2 rounded-lg bg-gray-50 border border-gray-300 text-gray-900 focus:outline-none"
          />
          {formik.touched.email && formik.errors.email ? (
            <p className="text-red-500 text-sm mt-1">{formik.errors.email}</p>
          ) : null}
        </div>

        {/* Password */}
        <div className="mb-6">
          <label
            htmlFor="password"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            Password
          </label>
          <input
            id="password"
            name="password"
            type="password"
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            value={formik.values.password}
            className="w-full px-4 py-2 rounded-lg bg-gray-50 border border-gray-300 text-gray-900 focus:outline-none"
          />
          {formik.touched.password && formik.errors.password ? (
            <p className="text-red-500 text-sm mt-1">
              {formik.errors.password}
            </p>
          ) : null}
        </div>

        <button
          type="submit"
          className="w-full bg-[#37A9C8] text-white font-semibold py-2.5 rounded-lg transition duration-200"
        >
          Login
        </button>
      </form>
    </div>
  );
}

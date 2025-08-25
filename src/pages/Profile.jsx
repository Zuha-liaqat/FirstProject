import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const API_URL = import.meta.env.VITE_API_URL;

export default function ProfilePage() {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

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
        setProfile(data);
      } catch (err) {
        console.error(err);
        alert("Error fetching profile!");
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, []);

  if (loading) return <p className="text-center">Loading...</p>;
  if (!profile) return <p className="text-center">No profile found</p>;

  return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="bg-gray-100 p-8 rounded-lg shadow-md w-full max-w-md">
        <h2 className="text-2xl font-bold text-center mb-6">Profile</h2>

        <div className="flex justify-between mb-4">
          <p className="text-gray-600 text-sm">Name</p>
          <p className="font-medium">{profile.user.name}</p>
        </div>
        <div className="flex justify-between mb-4">
          <p className="text-gray-600 text-sm">Email</p>
          <p className="font-medium">{profile.user.email}</p>
        </div>
        <div className="flex justify-between mb-4">
          <p className="text-gray-600 text-sm">Role</p>
          <p className="font-medium">{profile.user.role}</p>
        </div>

        <button
          onClick={() => navigate("/app/edit-profile")}
          className="w-full bg-[#37A9C8] text-white font-semibold py-2.5 rounded-lg mt-4"
        >
          Edit Profile
        </button>
      </div>
    </div>
  );
}

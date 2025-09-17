import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom"; // ✅ useParams added
import { User, Mail, Shield } from "lucide-react";

export default function ProfilePage() {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const { id } = useParams();

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const token = localStorage.getItem("accessToken");
        const res = await fetch(
          `${API_URL}/user/get-user/${id}`,
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (!res.ok) throw new Error("Failed to fetch profile");
        const data = await res.json();

        if (data.success) {
          setProfile(data.user); // ✅ set only user object
        } else {
          setProfile(null);
        }
      } catch (err) {
        console.error(err);
        alert("Error fetching profile!");
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, [id]);

  if (loading) return <p className="text-center">Loading...</p>;
  if (!profile) return <p className="text-center">No profile found</p>;

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-50 rounded-tl-3xl rounded-tr-3xl">
      <div className="bg-white p-8 rounded-xl shadow-xl w-full max-w-md">
        {/* Avatar */}
        <div className="flex flex-col items-center mb-6">
          <div className="w-24 h-24 rounded-full bg-[#37A9C8] text-white flex items-center justify-center text-3xl font-bold shadow-md">
            {profile.name?.charAt(0).toUpperCase()}
          </div>
          <h2 className="text-2xl font-bold mt-3">{profile.name}</h2>
          <p className="text-gray-500 text-sm">{profile.email}</p>
        </div>

        {/* Info Section */}
        <div className="space-y-4">
          <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
            <User className="text-[#37A9C8]" size={20} />
            <div className="flex justify-between w-full">
              <p className="text-gray-600 text-sm">Name</p>
              <p className="font-medium">{profile.name}</p>
            </div>
          </div>

          <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
            <Mail className="text-[#37A9C8]" size={20} />
            <div className="flex justify-between w-full">
              <p className="text-gray-600 text-sm">Email</p>
              <p className="font-medium">{profile.email}</p>
            </div>
          </div>

          <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
            <Shield className="text-[#37A9C8]" size={20} />
            <div className="flex justify-between w-full">
              <p className="text-gray-600 text-sm">Role</p>
              <p className="font-medium capitalize">{profile.role}</p>
            </div>
          </div>
        </div>

        {/* Button */}
        <button
          onClick={() => navigate(`/app/edit-profile/${id}`)} 
          className="w-full bg-[#37A9C8] text-white font-semibold py-2.5 rounded-lg mt-6 hover:bg-[#2b89a3] transition"
        >
          Edit Profile
        </button>
      </div>
    </div>
  );
}

import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Trash2, Edit } from "lucide-react"; 

export default function UserList() {
  const [users, setUsers] = useState([]);
  const API_URL = import.meta.env.VITE_API_URL;
  const navigate = useNavigate()
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const res = await fetch(`${API_URL}/user/getallusers`);
        if (!res.ok) throw new Error("Failed to fetch users");
        const data = await res.json();

        if (data.success) {
          setUsers(data.users);
        } else {
          setUsers([]);
        }
      } catch (err) {
        console.error(err);
      }
    };

    fetchUsers();
  }, []);

  const handleDelete = async (id) => {
    try {
      const res = await fetch(`${API_URL}/user/delete/${id}`, {
        method: "DELETE",
      });
      const data = await res.json();
      if (data) {
        alert("User deleted successfully");
        setUsers((prev) => prev.filter((item) => item._id !== id)); // ✅ fix id reference
      } else {
        alert(data.message);
      }
    } catch (error) {
      console.error("Delete error:", error);
    }
  };

  const handleUpdate = (id) => {
     navigate(`/app/profile/${id}`);
  };

  return (
    <div className="p-6 min-h-screen">
      <h1 className="text-2xl font-bold mb-6">User List</h1>

      <div className="overflow-x-auto bg-white">
        <table className="w-full ">
          <thead>
            <tr className="bg-gray-100 text-left text-gray-700 text-sm uppercase tracking-wider">
              <th className="p-3">Name</th>
              <th className="p-3">Email</th>
              <th className="p-3">Role</th>
              <th className="p-3 text-center">Actions</th>
            </tr>
          </thead>
          <tbody>
            {users.length > 0 ? (
              users.map((u) => (
                <tr
                  key={u._id}
                  className="hover:bg-gray-50 transition duration-200 border-b border-gray-200"
                >
                  <td className="p-3 font-medium text-gray-800">{u.name}</td>
                  <td className="p-3 text-gray-600">{u.email}</td>
                  <td className="p-3">
                    <span
                      className={`px-4 py-2 text-sm font-semibold rounded-full ${
                        u.role === "admin"
                          ? "bg-green-100 text-black"
                          : "bg-gray-100 text-black"
                      }`}
                    >
                      {u.role}
                    </span>
                  </td>
                  <td className="p-3 text-center flex justify-center gap-2">
                    <button
                      onClick={() => handleUpdate(u._id)}
                      className="inline-flex items-center gap-1 px-3 py-1.5  text-[#37A9C8] text-sm  transition"
                    >
                      <Edit className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleDelete(u._id)}
                      className="inline-flex items-center gap-1 px-3 py-1.5 text-[#37A9C8] text-sm  transition"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td
                  colSpan="4"
                  className="p-4 text-center text-gray-500 italic"
                >
                  No users found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

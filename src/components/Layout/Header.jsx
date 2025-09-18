import { useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { User, LogOut } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export default function Header() {
  const [showMenu, setShowMenu] = useState(false);
  const navigate = useNavigate();
  
  const user = JSON.parse(localStorage.getItem("user"));
  const isAdmin = user?.role === "admin";

  function logout() {
    localStorage.removeItem("accessToken");
    navigate("/login");
  }

  return (
    <div className="bg-[#32A4C3] text-white py-4 px-4 md:px-[60px] rounded-full shadow-lg">
      <div className="flex items-center justify-between">
        {/* Mobile Menu Button */}
        <button
          className="md:hidden text-white text-2xl"
          onClick={() => setShowMenu(!showMenu)}
        >
          ☰
        </button>

        {/* Navigation Links (Desktop) */}
        <div className="hidden md:flex gap-6 font-semibold">
          <NavLink to="/app/home">Home</NavLink>
          <NavLink to="/app/about">About</NavLink>
          <NavLink to="/app/contact">Contact</NavLink>
          {!user && (
            <NavLink to="/app/users">Users</NavLink>
          )}
         
          <NavLink to="/app/wishlist">Wishlist</NavLink>
          
        </div>

        {/* Right Side: Profile + Logout */}
        <div className="flex items-center gap-4">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <div className="flex items-center gap-2 border border-white rounded-full p-2 cursor-pointer">
                <User size={18} />
              </div>
            </DropdownMenuTrigger>

            <DropdownMenuContent className="w-32 bg-white border-none">
              {/* Profile */}
              <DropdownMenuItem
                onClick={() => navigate("app/profile/:id")}
                className="cursor-pointer"
              >
                Profile
              </DropdownMenuItem>

              {/* Logout */}
              <DropdownMenuItem
                onClick={logout}
                className="cursor-pointer"
              >
                 Logout
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      {/* Mobile Navigation Menu */}
      <div
        className={`fixed top-0 left-0 w-full h-full bg-black bg-opacity-50 transition-all duration-500 z-50 ${
          showMenu ? "opacity-100 visible" : "opacity-0 invisible"
        }`}
        onClick={() => setShowMenu(false)}
      >
        <div
          className="relative bg-white text-[#81869B] w-64 p-6 shadow-lg h-full flex flex-col gap-3 md:hidden"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Close Button */}
          <button
            className="absolute top-2 right-2 text-xl font-bold text-black"
            onClick={() => setShowMenu(false)}
          >
            ✕
          </button>

          <NavLink to="/admin/home" onClick={() => setShowMenu(false)}>
            Home
          </NavLink>
          <NavLink to="/admin/users" onClick={() => setShowMenu(false)}>
            Contact
          </NavLink>

          {/* Profile (inside mobile menu too) */}
          <NavLink to="/app/profile" onClick={() => setShowMenu(false)}>
            Profile
          </NavLink>

          {/* Logout (inside mobile menu too) */}
          <button
            onClick={() => {
              logout();
              setShowMenu(false);
            }}
            className="flex items-center gap-2 mt-4"
          >
             Logout
          </button>
        </div>
      </div>
    </div>
  );
}

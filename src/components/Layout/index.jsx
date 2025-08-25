import { Outlet } from "react-router-dom";
import Header from "./header";

export default function Layout() {
  return (
    <div
      className="bg-cover bg-center min-h-screen"
      style={{ backgroundImage: "url('/background.png')" }}
    >
      <div className="p-4 md:p-6 ">
        <Header />
      </div>
      <div className="min-h-[100vh] px-4 md:px-8">
        <Outlet />
      </div>
    </div>
  );
}

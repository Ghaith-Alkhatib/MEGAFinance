import React from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import { LogOut } from "lucide-react"; // إزالة BookOpen
import logo from '../images/MEGALogodark.png';


const Layout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user, logout } = useAuth();

  return (
    <div className="min-h-screen bg-gray-100">
      <header className="bg-[#3f3f3f] text-white shadow-md">
        <div className="container mx-auto px-4 py-3 flex justify-between items-center">
        <div className="flex items-center space-x-2">
  <img src={logo} alt="MEGA Logo" className="w-8 h-8" />
  <h1 className="text-lg font-bold">MEGAverse Platform</h1> {/* تم تقليل حجم الخط إلى 18px */}
</div>

          <div className="flex items-center space-x-4">
            <span className="text-sm">Welcome, {user?.name || "User"}</span>

            <Link
              to="/"
              className="px-4 py-2 rounded-md text-white transition bg-[#3CD2F9] hover:bg-[#32bfe2] shadow-md"
            >
              Dashboard
            </Link>

            <Link
              to="/expenses"
              className="px-4 py-2 rounded-md text-white transition bg-[#3CD2F9] hover:bg-[#32bfe2] shadow-md"
            >
              Expenses
            </Link>

            <Link
              to="/revenues"
              className="px-4 py-2 rounded-md text-white transition bg-[#3CD2F9] hover:bg-[#32bfe2] shadow-md"
            >
              Revenues
            </Link>

            <Link
              to="/payments"
              className="px-4 py-2 rounded-md text-white transition bg-[#3CD2F9] hover:bg-[#32bfe2] shadow-md"
            >
              Payments
            </Link>

            <Link
              to="/students"
              className="px-4 py-2 rounded-md text-white transition bg-[#3CD2F9] hover:bg-[#32bfe2] shadow-md"
            >
              Students
            </Link>
            
            <Link
              to="/instructors"
              className="px-4 py-2 rounded-md text-white transition bg-[#3CD2F9] hover:bg-[#32bfe2] shadow-md"
            >
              Instructors
            </Link>

            <Link
              to="/courses"
              className="px-4 py-2 rounded-md text-white transition bg-[#3CD2F9] hover:bg-[#32bfe2] shadow-md"
            >
              Courses
            </Link>

            {/* 🔹 زر تسجيل الخروج */}
            <button
              onClick={logout}
              className="flex items-center space-x-1 px-4 py-2 rounded-md text-white bg-[#3CD2F9] hover:bg-[#32bfe2] transition shadow-md"
            >
              <LogOut size={16} />
              <span>Logout</span>
            </button>
          </div>
        </div>
      </header>

      <main>{children}</main>
    </div>
  );
};

export default Layout;

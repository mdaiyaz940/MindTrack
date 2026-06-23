// src/components/layout/Sidebar.jsx
import { NavLink } from "react-router-dom";
import { useState } from "react";
import { Menu, X } from "lucide-react";

const links = [
  { name: "Dashboard", to: "/dashboard" },
  { name: "Mood", to: "/mood" },
  { name: "Journal", to: "/journal" },
  { name: "Analytics", to: "/analytics" },
  { name: "Resources", to: "/resources" },
];

export default function Sidebar() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      {/* Mobile toggle button */}
      <button
        className="md:hidden fixed top-4 left-4 z-50 bg-purple-600 text-white p-2 rounded-lg"
        onClick={() => setIsOpen(!isOpen)}
      >
        {isOpen ? <X size={24} /> : <Menu size={24} />}
      </button>

      {/* Sidebar */}
      <aside
        className={`${isOpen ? "translate-x-0" : "-translate-x-full"} 
        md:translate-x-0 fixed md:static w-64 min-h-screen bg-purple-100 shadow-md p-4 
        transition-transform duration-300 ease-in-out z-40`}
      >
        <h2 className="text-xl font-bold text-purple-800 mb-6">MentalHealth+</h2>
        <nav className="flex flex-col gap-2">
          {links.map((link) => (
            <NavLink
              key={link.to}
              to={link.to}
              onClick={() => setIsOpen(false)}
              className={({ isActive }) =>
                `px-4 py-2 rounded-lg ${
                  isActive ? "bg-purple-600 text-white" : "text-purple-700 hover:bg-purple-200"
                }`
              }
            >
              {link.name}
            </NavLink>
          ))}
        </nav>
      </aside>
    </>
  );
}
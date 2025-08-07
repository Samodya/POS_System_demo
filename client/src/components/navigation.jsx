import { Home, User, Settings, LogOut, BadgeDollarSign,Wrench  } from "lucide-react";
import { Link } from "react-router-dom";

export default function Sidebar() {
  return (
    <div className="h-screen w-80 bg-gradient-to-b from-black via-[#0a0f2c] to-[#071833] text-white flex flex-col shadow-2xl">
      {/* Brand */}
      <div className="text-2xl font-bold px-6 py-6 border-b border-white/10 flex flex-col items-center justify-center">
        <div>
          <span className="text-white">Master</span>
          <span className="text-blue-400">Tech</span>
        </div>
        <div className="text-xs text-gray-400">Computer Solutions</div>
      </div>

      {/* Navigation Links */}
      <nav className="flex-1 px-4 py-6 space-y-3">
        <NavItem icon={<Home size={20}/> } link={"/"}  label="Dashboard" />
        <NavItem icon={<BadgeDollarSign size={20} />} link={"../pos_sys/sales"} label={"Sales"}/>
        <NavItem icon={<Wrench  size={20} />} link={"../pos_sys/products"} label={"Repairs"}/>
        <NavItem icon={<User size={20} />} label="Users" link={"../pos_sys/sales"}/>
        <NavItem icon={<Settings size={20} />} label="Settings" link={"../pos_sys/sales"}/>
      </nav>

      {/* Footer / Logout */}
      <div className="px-4 py-6 border-t border-white/10">
        <NavItem icon={<LogOut size={20} />} label="Logout" />
      </div>
    </div>
  );
}

function NavItem({ icon, label, link }) {
  return (
    <Link
      to={link}
      className="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-white/10 cursor-pointer transition-colors"
    >
      {icon}
      <span className="text-sm font-medium">{label}</span>
    </Link>
  );
}

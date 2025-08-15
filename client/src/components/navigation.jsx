import { Home, User, Settings, LogOut, BadgeDollarSign,Wrench, Package, Users,FileSpreadsheet, Loader  } from "lucide-react";
import { Link } from "react-router-dom";
import { useLogout } from "../hooks/useLogout";
import logo from "../assets/logo.png"

export default function Sidebar() {
  const { logout, isLoading } = useLogout()

  const handleLogout = () => {
    logout();
  };

  return (
    <div className="h-screen overflow-auto w-80 bg-gradient-to-b from-black via-[#0a0f2c] to-[#071833] text-white flex flex-col shadow-2xl">
      { isLoading ? <Loader/>:""}
      {/* Brand */}
      <div className="text-2xl font-bold px-6 py-6 border-b border-white/10 flex flex-col items-center justify-center">
      <div className="flex items-center justify-center"><img src={logo} className="h-20 w-20"/></div>
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
        <NavItem icon={<Wrench  size={20} />} link={"../pos_sys/repairs"} label={"Repairs"}/>
        <NavItem icon={<Package  size={20} />} link={"../pos_sys/inventory"} label={"Inventory"}/>
        {/* <NavItem icon={<Users size={20} />} link={"../pos_sys/customer"} label={"Customers"}/> */}
        <NavItem icon={<FileSpreadsheet size={20}/>} link={"../pos_sys/reports"} label={"Reports"} />
        <NavItem icon={<User size={20} />} label="Users" link={"../pos_sys/users"}/>
        <NavItem icon={<Settings size={20} />} label="Settings" link={"../pos_sys/sales"}/>
      </nav>

      {/* Footer / Logout */}
      <div className="px-4 py-6 border-t border-white/10" >
        <button className="flex w-full items-center gap-3 px-3 py-2 rounded-lg hover:bg-white/10 cursor-pointer transition-colors"
          onClick={handleLogout}
          disabled={isLoading}
        > <LogOut size={20}  /> LogOut</button>
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


import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { 
  Users, 
  Calendar, 
  Home, 
  Heart, 
  ScrollText, 
  Package, 
  Settings,
  MenuIcon,
  X
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

type SidebarItemProps = {
  icon: React.ReactNode;
  label: string;
  to: string;
  active: boolean;
};

const SidebarItem = ({ icon, label, to, active }: SidebarItemProps) => {
  return (
    <Link
      to={to}
      className={cn(
        "flex items-center gap-3 px-3 py-2 rounded-md text-sm font-medium transition-colors",
        active
          ? "bg-hospital-500 text-white"
          : "text-gray-600 hover:bg-hospital-100"
      )}
    >
      {icon}
      <span>{label}</span>
    </Link>
  );
};

export const Sidebar = () => {
  const location = useLocation();
  const [isOpen, setIsOpen] = useState(false);

  const navItems = [
    { icon: <Home size={18} />, label: "Dashboard", path: "/" },
    { icon: <Users size={18} />, label: "Patients", path: "/patients" },
    { icon: <Heart size={18} />, label: "Doctors", path: "/doctors" },
    { icon: <Calendar size={18} />, label: "Appointments", path: "/appointments" },
    { icon: <ScrollText size={18} />, label: "Billing", path: "/billing" },
    { icon: <Package size={18} />, label: "Inventory", path: "/inventory" },
    { icon: <Settings size={18} />, label: "Settings", path: "/settings" },
  ];

  const toggleSidebar = () => {
    setIsOpen(!isOpen);
  };
  
  return (
    <>
      <Button
        variant="ghost"
        size="icon"
        className="md:hidden fixed top-4 left-4 z-50"
        onClick={toggleSidebar}
      >
        <MenuIcon size={24} />
      </Button>
      
      <aside
        className={cn(
          "bg-white border-r border-gray-200 fixed h-full transition-all duration-300 z-40",
          isOpen ? "left-0" : "-left-64 md:left-0",
          "w-64 md:w-64"
        )}
      >
        <div className="p-4 border-b flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Heart className="text-hospital-500" size={24} />
            <h1 className="font-bold text-xl text-hospital-700">MediCare</h1>
          </div>
          <Button
            variant="ghost"
            size="icon"
            className="md:hidden"
            onClick={toggleSidebar}
          >
            <X size={18} />
          </Button>
        </div>
        
        <nav className="p-4 space-y-2">
          {navItems.map((item) => (
            <SidebarItem
              key={item.path}
              icon={item.icon}
              label={item.label}
              to={item.path}
              active={location.pathname === item.path}
            />
          ))}
        </nav>
      </aside>
    </>
  );
};

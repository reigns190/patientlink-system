import { useState } from "react";
import { 
  Bell, 
  Search, 
  User,
  ChevronDown,
  Settings
} from "lucide-react";
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem,
  DropdownMenuTrigger
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

export const Header = () => {
  const [searchQuery, setSearchQuery] = useState("");
  
  return (
    <header className="bg-white border-b border-gray-200 py-3 px-6 flex justify-between items-center sticky top-0 z-30">
      <div className="relative w-64 max-w-xs">
        <Search className="absolute left-2 top-1/2 transform -translate-y-1/2 text-gray-400" size={16} />
        <Input
          type="text"
          placeholder="Search..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="pl-8 bg-gray-50 border-gray-200 w-full"
        />
      </div>
      
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" className="relative">
          <Bell size={20} />
          <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
        </Button>
        
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="flex items-center gap-2">
              <Avatar className="h-8 w-8">
                <AvatarImage src="" />
                <AvatarFallback className="bg-hospital-300 text-white">AD</AvatarFallback>
              </Avatar>
              <div className="flex items-center text-sm">
                <span className="mr-1">Admin</span>
                <ChevronDown size={14} />
              </div>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem className="cursor-pointer">
              <User className="mr-2" size={14} />
              Profile
            </DropdownMenuItem>
            <DropdownMenuItem className="cursor-pointer">
              <Settings className="mr-2" size={14} />
              Settings
            </DropdownMenuItem>
            <DropdownMenuItem className="cursor-pointer text-red-600">
              Logout
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
};

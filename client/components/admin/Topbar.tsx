// Topbar.tsx
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Bell, Search } from "lucide-react";

export const Topbar = () => {
  return (
    <header className="sticky top-0 z-10 bg-white shadow-sm px-6 py-4 flex items-center justify-between">
      <div className="flex items-center gap-2">
        <Search className="w-5 h-5 text-gray-500" />
        <input
          placeholder="Search..."
          className="border-none outline-none bg-transparent placeholder-gray-400 text-sm"
        />
      </div>
      <div className="flex items-center gap-4">
        <Bell className="w-5 h-5 text-gray-500 cursor-pointer" />
        <Avatar>
          <AvatarFallback>AD</AvatarFallback>
        </Avatar>
      </div>
    </header>
  );
};

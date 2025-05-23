
import React from "react";
import { Link, Outlet, useLocation } from "react-router-dom";
import { 
  Bell, 
  ChevronDown, 
  Home, 
  LogOut, 
  Settings, 
  User,
  Egg,
} from "lucide-react";
import {
  SidebarProvider,
  Sidebar,
  SidebarContent,
  SidebarTrigger,
  SidebarHeader,
  SidebarGroup,
  SidebarGroupLabel,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarInset
} from "@/components/ui/sidebar";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Logo } from "@/components/ui/logo";

interface NavLinkProps {
  to: string;
  icon: React.ReactNode;
  children: React.ReactNode;
}

const NavLink: React.FC<NavLinkProps> = ({ to, icon, children }) => {
  const location = useLocation();
  const isActive = location.pathname === to;

  return (
    <SidebarMenuItem>
      <SidebarMenuButton asChild>
        <Link
          to={to}
          className={`flex items-center gap-3 py-2 px-3 rounded-md w-full ${
            isActive 
            ? "bg-green-100 text-green-800 font-medium" 
            : "text-gray-700 hover:bg-green-50 hover:text-green-800"
          }`}
        >
          {icon}
          <span>{children}</span>
        </Link>
      </SidebarMenuButton>
    </SidebarMenuItem>
  );
};

const DashboardLayout = () => {
  const location = useLocation();
  
  // Helper to check if a path is active
  const isActive = (path: string) => {
    return location.pathname.startsWith(path);
  };

  return (
    <SidebarProvider>
      <div className="flex min-h-screen w-full">
        <Sidebar className="border-r border-gray-200">
          <SidebarHeader className="p-4 border-b border-gray-200">
            <Logo />
          </SidebarHeader>

          <SidebarContent>
            <SidebarGroup>
              <SidebarGroupLabel>Main</SidebarGroupLabel>
              <SidebarGroupContent>
                <SidebarMenu>
                  <NavLink to="/dashboard" icon={<Home className="h-5 w-5" />}>
                    Dashboard
                  </NavLink>
                  <NavLink to="/dashboard/pens" icon={<Egg className="h-5 w-5" />}>
                    Pens & Chicks
                  </NavLink>
                  <NavLink to="/dashboard/records" icon={<Settings className="h-5 w-5" />}>
                    Feed & Medicine
                  </NavLink>
                  <NavLink to="/dashboard/reports" icon={<User className="h-5 w-5" />}>
                    Reports
                  </NavLink>
                </SidebarMenu>
              </SidebarGroupContent>
            </SidebarGroup>
          </SidebarContent>
        </Sidebar>

        <SidebarInset className="flex flex-col">
          {/* Header */}
          <header className="h-16 border-b border-gray-200 px-4 flex items-center justify-between bg-white">
            <div className="flex items-center gap-2">
              <SidebarTrigger />
            </div>
            <div className="flex items-center gap-4">
              <Button variant="ghost" size="icon" className="text-gray-600">
                <Bell className="h-5 w-5" />
              </Button>

              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="flex items-center gap-2">
                    <Avatar className="h-8 w-8 rounded-full overflow-hidden bg-green-100">
                      <AvatarImage src="" />
                      <AvatarFallback className="text-green-800 font-medium">JD</AvatarFallback>
                    </Avatar>
                    <span className="text-gray-800">John Doe</span>
                    <ChevronDown className="h-4 w-4 text-gray-600" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-56 mr-2 bg-white shadow-md rounded-md border border-gray-200 p-1">
                  <DropdownMenuLabel className="px-2 py-1.5 text-gray-500 font-normal text-sm">
                    My Account
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator className="bg-gray-100 h-px my-1" />
                  <DropdownMenuItem className="flex items-center gap-2 px-2 py-1.5 cursor-pointer rounded-sm hover:bg-gray-100 text-gray-700">
                    <User className="h-4 w-4" />
                    <span>Profile</span>
                  </DropdownMenuItem>
                  <DropdownMenuItem className="flex items-center gap-2 px-2 py-1.5 cursor-pointer rounded-sm hover:bg-gray-100 text-gray-700">
                    <Settings className="h-4 w-4" />
                    <span>Settings</span>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator className="bg-gray-100 h-px my-1" />
                  <DropdownMenuItem className="flex items-center gap-2 px-2 py-1.5 cursor-pointer rounded-sm hover:bg-red-50 text-red-600">
                    <LogOut className="h-4 w-4" />
                    <span>Log Out</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </header>

          {/* Main Content */}
          <main className="flex-1 p-6 bg-gray-50 overflow-auto">
            <Outlet />
          </main>
        </SidebarInset>
      </div>
    </SidebarProvider>
  );
};

export default DashboardLayout;

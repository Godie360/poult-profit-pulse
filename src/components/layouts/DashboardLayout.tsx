
import React from "react";
import { Link, Outlet, useLocation, useNavigate } from "react-router-dom";
import { 
  Bell, 
  ChevronDown, 
  Home, 
  LogOut, 
  Settings, 
  User,
  Egg,
  FileText,
  LineChart,
  Stethoscope,
  Users,
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
import { toast } from "@/hooks/use-toast";

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
  const navigate = useNavigate();
  
  // Helper to check if a path is active
  const isActive = (path: string) => {
    return location.pathname.startsWith(path);
  };

  // Determine user role based on current path
  const getUserRole = () => {
    if (location.pathname.startsWith("/worker")) {
      return "worker";
    } else if (location.pathname.startsWith("/vet")) {
      return "vet";
    } else {
      return "farmer";
    }
  };

  const userRole = getUserRole();

  // Get user info based on role
  const getUserInfo = () => {
    switch (userRole) {
      case "worker":
        return { name: "James Worker", initials: "JW" };
      case "vet":
        return { name: "Dr. Sarah Vet", initials: "SV" };
      default:
        return { name: "John Farmer", initials: "JF" };
    }
  };

  const userInfo = getUserInfo();

  const handleLogout = () => {
    toast({
      title: "Logged out successfully",
      description: "You have been logged out of your account.",
    });
    navigate("/login");
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
                  {userRole === "farmer" && (
                    <>
                      <NavLink to="/dashboard" icon={<Home className="h-5 w-5" />}>
                        Dashboard
                      </NavLink>
                      <NavLink to="/dashboard/pens" icon={<Egg className="h-5 w-5" />}>
                        Pens & Chicks
                      </NavLink>
                      <NavLink to="/dashboard/records" icon={<FileText className="h-5 w-5" />}>
                        Feed & Medicine
                      </NavLink>
                      <NavLink to="/dashboard/reports" icon={<LineChart className="h-5 w-5" />}>
                        Reports
                      </NavLink>
                    </>
                  )}
                  
                  {userRole === "worker" && (
                    <>
                      <NavLink to="/worker" icon={<Home className="h-5 w-5" />}>
                        Worker Dashboard
                      </NavLink>
                      <NavLink to="/dashboard/pens" icon={<Egg className="h-5 w-5" />}>
                        View Pens
                      </NavLink>
                    </>
                  )}
                  
                  {userRole === "vet" && (
                    <>
                      <NavLink to="/vet" icon={<Home className="h-5 w-5" />}>
                        Vet Dashboard
                      </NavLink>
                      <NavLink to="/dashboard/pens" icon={<Egg className="h-5 w-5" />}>
                        View Pens
                      </NavLink>
                    </>
                  )}
                </SidebarMenu>
              </SidebarGroupContent>
            </SidebarGroup>

            <SidebarGroup>
              <SidebarGroupLabel>User</SidebarGroupLabel>
              <SidebarGroupContent>
                <SidebarMenu>
                  <NavLink to="/profile" icon={<User className="h-5 w-5" />}>
                    Profile
                  </NavLink>
                  <NavLink to="/settings" icon={<Settings className="h-5 w-5" />}>
                    Settings
                  </NavLink>
                  {userRole === "farmer" && (
                    <NavLink to="/team" icon={<Users className="h-5 w-5" />}>
                      Team Members
                    </NavLink>
                  )}
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
              <div className="ml-2">
                <div className="text-sm font-medium">{userRole === "vet" ? "Veterinarian" : userRole === "worker" ? "Poultry Worker" : "Farm Owner"}</div>
                <div className="text-xs text-gray-500">
                  {new Date().toLocaleDateString()}
                </div>
              </div>
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
                      <AvatarFallback className="text-green-800 font-medium">{userInfo.initials}</AvatarFallback>
                    </Avatar>
                    <span className="text-gray-800">{userInfo.name}</span>
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
                  <DropdownMenuItem 
                    onClick={handleLogout}
                    className="flex items-center gap-2 px-2 py-1.5 cursor-pointer rounded-sm hover:bg-red-50 text-red-600"
                  >
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

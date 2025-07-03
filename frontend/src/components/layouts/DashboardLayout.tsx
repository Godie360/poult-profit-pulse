
import React, { useEffect, useState } from "react";
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
import { authService } from "@/api";
import LanguageSwitcher from "@/components/LanguageSwitcher";
import { useLanguage } from "@/contexts/LanguageContext";
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
  const [userData, setUserData] = useState<any>(null);
  const { t } = useLanguage();

  // Helper to check if a path is active
  const isActive = (path: string) => {
    return location.pathname.startsWith(path);
  };

  // Fetch user data on component mount
  useEffect(() => {
    const currentUser = authService.getCurrentUser();
    if (!currentUser) {
      // If no user is logged in, redirect to login page
      navigate("/login");
      return;
    }
    setUserData(currentUser);
  }, [navigate]);

  // Determine user role based on current path or user data
  const getUserRole = () => {
    if (userData) {
      if (userData.isWorker) {
        return "worker";
      } else if (userData.isVet) {
        return "vet";
      } else {
        return "farmer";
      }
    }

    // Fallback to path-based role determination
    if (location.pathname.startsWith("/worker")) {
      return "worker";
    } else if (location.pathname.startsWith("/vet")) {
      return "vet";
    } else {
      return "farmer";
    }
  };

  const userRole = getUserRole();

  // Check if user is trying to access a restricted area
  useEffect(() => {
    // If user data is not loaded yet, skip this check
    if (!userData) return;

    const isWorker = userData.isWorker;
    const isVet = userData.isVet;

    // Redirect users based on their role if they're trying to access unauthorized areas
    if (!isWorker && !isVet && (location.pathname.startsWith('/worker') || location.pathname.startsWith('/vet'))) {
      toast({
        title: t('general.accessRestricted'),
        description: t('general.farmerRestriction'),
        variant: "destructive",
      });
      navigate('/dashboard');
    } else if (isWorker && (location.pathname.startsWith('/dashboard') || location.pathname.startsWith('/vet'))) {
      toast({
        title: t('general.accessRestricted'),
        description: t('general.workerRestriction'),
        variant: "destructive",
      });
      navigate('/worker');
    } else if (isVet && (location.pathname.startsWith('/dashboard') || location.pathname.startsWith('/worker'))) {
      toast({
        title: t('general.accessRestricted'),
        description: t('general.vetRestriction'),
        variant: "destructive",
      });
      navigate('/vet');
    }
  }, [userData, location.pathname, navigate]);

  // Get user info from actual user data
  const getUserInfo = () => {
    if (userData) {
      const fullName = userData.fullName || userData.name || "User";
      const nameParts = fullName.split(" ");
      const initials = nameParts.length > 1 
        ? `${nameParts[0][0]}${nameParts[1][0]}` 
        : fullName.substring(0, 2);

      return { 
        name: fullName,
        initials: initials.toUpperCase()
      };
    }

    // Fallback to role-based defaults if no user data
    switch (userRole) {
      case "worker":
        return { name: "Poultry Worker", initials: "PW" };
      case "vet":
        return { name: "Veterinarian", initials: "VT" };
      default:
        return { name: "Farm Owner", initials: "FO" };
    }
  };

  const userInfo = getUserInfo();

  const handleLogout = () => {
    // Use authService to logout
    authService.logout();

    toast({
      title: t('general.loggedOut'),
      description: t('general.logoutMessage'),
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
              <SidebarGroupLabel>{t('nav.main')}</SidebarGroupLabel>
              <SidebarGroupContent>
                <SidebarMenu>
                  {userRole === "farmer" && (
                    <>
                      <NavLink to="/dashboard" icon={<Home className="h-5 w-5" />}>
                        {t('nav.dashboard')}
                      </NavLink>
                      <NavLink to="/dashboard/pens" icon={<Egg className="h-5 w-5" />}>
                        {t('nav.pens')}
                      </NavLink>
                      <NavLink to="/dashboard/records" icon={<FileText className="h-5 w-5" />}>
                        {t('nav.records')}
                      </NavLink>
                      <NavLink to="/dashboard/reports" icon={<LineChart className="h-5 w-5" />}>
                        {t('nav.reports')}
                      </NavLink>
                    </>
                  )}

                  {userRole === "worker" && (
                    <>
                      <NavLink to="/worker" icon={<Home className="h-5 w-5" />}>
                        {t('nav.dashboard')}
                      </NavLink>
                      <NavLink to="/dashboard/pens" icon={<Egg className="h-5 w-5" />}>
                        {t('nav.pens')}
                      </NavLink>
                      <NavLink to="/worker/vets" icon={<Stethoscope className="h-5 w-5" />}>
                        {t('nav.team')}
                      </NavLink>
                    </>
                  )}

                  {userRole === "vet" && (
                    <>
                      <NavLink to="/vet" icon={<Home className="h-5 w-5" />}>
                        {t('nav.dashboard')}
                      </NavLink>
                      <NavLink to="/dashboard/pens" icon={<Egg className="h-5 w-5" />}>
                        {t('nav.pens')}
                      </NavLink>
                    </>
                  )}
                </SidebarMenu>
              </SidebarGroupContent>
            </SidebarGroup>

            <SidebarGroup>
              <SidebarGroupLabel>{t('nav.user')}</SidebarGroupLabel>
              <SidebarGroupContent>
                <SidebarMenu>

                  {userRole === "farmer" && (
                    <NavLink to="/team" icon={<Users className="h-5 w-5" />}>
                      {t('nav.team')}
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
                <div className="text-sm font-medium">
                  {userRole === "vet" 
                    ? t('general.veterinarian') 
                    : userRole === "worker" 
                      ? t('general.poultryWorker') 
                      : t('general.farmOwner')
                  }
                </div>
                <div className="text-xs text-gray-500">
                  {new Date().toLocaleDateString()}
                </div>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <LanguageSwitcher />

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
                    {t('auth.myAccount')}
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator className="bg-gray-100 h-px my-1" />
                  <DropdownMenuItem className="flex items-center gap-2 px-2 py-1.5 cursor-pointer rounded-sm hover:bg-gray-100 text-gray-700">
                    <User className="h-4 w-4" />
                    <span>{t('auth.profile')}</span>
                  </DropdownMenuItem>
                  <DropdownMenuItem className="flex items-center gap-2 px-2 py-1.5 cursor-pointer rounded-sm hover:bg-gray-100 text-gray-700">
                    <Settings className="h-4 w-4" />
                    <span>{t('auth.settings')}</span>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator className="bg-gray-100 h-px my-1" />
                  <DropdownMenuItem 
                    onClick={handleLogout}
                    className="flex items-center gap-2 px-2 py-1.5 cursor-pointer rounded-sm hover:bg-red-50 text-red-600"
                  >
                    <LogOut className="h-4 w-4" />
                    <span>{t('auth.logout')}</span>
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

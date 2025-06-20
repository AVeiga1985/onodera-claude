
import { Calendar, Home, Users, Stethoscope, DollarSign, User, UserCheck } from "lucide-react";
import { useNavigate, useLocation } from "react-router-dom";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarHeader,
} from "@/components/ui/sidebar";

const menuItems = [
  {
    title: "Dashboard",
    url: "/dashboard",
    icon: Home,
  },
  {
    title: "Calendário",
    url: "/calendar",
    icon: Calendar,
  },
  {
    title: "Clientes",
    url: "/clients",
    icon: UserCheck,
  },
  {
    title: "Tratamentos",
    url: "/treatments",
    icon: Stethoscope,
  },
  {
    title: "Funcionários",
    url: "/employees",
    icon: Users,
  },
  {
    title: "Faturamento",
    url: "/billing",
    icon: DollarSign,
  },
  {
    title: "Perfil",
    url: "/profile",
    icon: User,
  },
];

export function AppSidebar() {
  const navigate = useNavigate();
  const location = useLocation();

  return (
    <Sidebar className="border-r border-gray-200">
      <SidebarHeader className="p-6">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-gradient-to-r from-onodera-pink to-onodera-dark-pink rounded-lg flex items-center justify-center">
            <span className="text-white font-bold text-lg">O</span>
          </div>
          <div>
            <h2 className="font-semibold text-gray-900">Onodera</h2>
            <p className="text-sm text-gray-500">estética</p>
          </div>
        </div>
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel className="text-gray-500 font-medium">Menu Principal</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu className="space-y-2">
              {menuItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton 
                    onClick={() => navigate(item.url)}
                    className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg transition-colors ${
                      location.pathname === item.url 
                        ? 'bg-onodera-pink text-white' 
                        : 'text-gray-700 hover:bg-onodera-light-pink hover:text-onodera-pink'
                    }`}
                  >
                    <item.icon className="w-5 h-5" />
                    <span>{item.title}</span>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
}

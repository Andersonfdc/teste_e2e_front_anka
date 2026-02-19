"use client";

import { usePathname, useRouter } from "next/navigation";
import { cn } from "@/lib/utils";
import {
  useSidebar,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import { LogOut, Home, Users } from "lucide-react";
import { deleteCookie } from "cookies-next";

import {
  SidebarHeader,
  SidebarMenu,
  SidebarFooter,
} from "@/components/ui/sidebar";
import { Button } from "@/components/ui/button";
import { AppSidebarItem } from "@/components/ui/custom/sidebar/app-sidebar-item";

const homePath = "/home";
const usersPath = "/users";

export function AppSidebar() {
  const router = useRouter();
  const pathname = usePathname();
  const { state, toggleSidebar } = useSidebar();
  const collapsed = state === "collapsed";

  const logout = () => {
    deleteCookie("token");
    deleteCookie("refreshToken");
    deleteCookie("userId");

    router.push("/auth/login");
  };

  return (
    <>
      <aside
        className={cn(
          "h-screen bg-foreground text-background p-2 rounded-r-lg fixed top-0 left-0 flex flex-col transition-all duration-500",
          collapsed ? "w-[70px]" : "w-[230px]",
        )}
      >
        {/* Botão para colapsar/expandir usa a função do contexto */}
        <Button
          variant="ghost"
          onClick={toggleSidebar}
          className="absolute right-0 top-0 px-2 py-1"
        >
          {collapsed ? (
            <img
              src="/icons/sidebar.svg"
              alt="Expandir"
              width={16}
              height={8}
            />
          ) : (
            <img
              src="/icons/sidebar.svg"
              alt="Colapsar"
              width={16}
              height={8}
            />
          )}
        </Button>

        {/* Cabeçalho */}
        <SidebarHeader className="mt-4">
          <div className="mt-2 mb-8 flex items-center justify-center">
            {!collapsed ? (
              <img
                src="/logos/PNG/Laranja/horizontal-laranja.png"
                alt="Logo"
                width={140}
                height={100}
              />
            ) : (
              <img
                src="/logos/PNG/Laranja/símbolo-laranja.png"
                alt="Logo"
                width={40}
                height={40}
              />
            )}
          </div>
        </SidebarHeader>

        {/* Menu principal */}
        <SidebarMenu className="space-y-2 list-none">
          <SidebarMenuItem>
            <AppSidebarItem
              onClick={() => router.push(homePath)}
              isActive={pathname === homePath}
              tooltip="Home"
            >
              <Home />
              <span>Home</span>
            </AppSidebarItem>
          </SidebarMenuItem>

          <SidebarMenuItem>
            <AppSidebarItem
              onClick={() => router.push(usersPath)}
              isActive={pathname?.startsWith(usersPath)}
              tooltip="Usuários"
            >
              <Users />
              <span>Usuários</span>
            </AppSidebarItem>
          </SidebarMenuItem>
        </SidebarMenu>
        <SidebarFooter>
          <Button
            variant="ghost"
            onClick={logout}
            className="text-background hover:bg-background/10 hover:text-background"
          >
            <LogOut />
            Sair
          </Button>
        </SidebarFooter>
      </aside>
    </>
  );
}

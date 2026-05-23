import { createRootRouteWithContext, Outlet } from '@tanstack/react-router'
import { TanStackRouterDevtools } from "@tanstack/react-router-devtools";
import { useUserStore, type UserStore } from '@stores/user/UserStore';
import type { AdminStore } from '@stores/admin/useAdminStore';
import type { QueryClient } from '@tanstack/react-query';
import { useEffect } from 'react';

export interface RouterContext {
  user: UserStore;
  admin: AdminStore;
  queryClient: QueryClient;
}

const RootLayout = () => {
  const logout = useUserStore((s) => s.logout);

  useEffect(() => {
    const handler = () => logout();
    window.addEventListener("auth:logout", handler);
    return () => window.removeEventListener("auth:logout", handler);
  }, [logout]);
  return (
    <div className="min-h-screen flex flex-col">
      <Outlet />
      <TanStackRouterDevtools position='bottom-right' />
    </div>
  )
}

export const Route = createRootRouteWithContext<RouterContext>()({
  component: RootLayout,
})

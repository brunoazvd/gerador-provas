import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuList,
  NavigationMenuRouterLink,
} from "@shadcn/navigation-menu";
import { useAuth } from "@context/auth-context";

export const Navbar = () => {
  const { user } = useAuth();
  return (
    <NavigationMenu>
      <NavigationMenuList className="w-screen py-3 gap-6 px-4 bg-white">
        <div className="flex gap-4 w-4xl">
          <NavigationMenuItem>
            <NavigationMenuRouterLink to="/" className="px-6">
              Homepage
            </NavigationMenuRouterLink>
          </NavigationMenuItem>
          <NavigationMenuItem>
            <NavigationMenuRouterLink to="/dashboard" className="px-6">
              Dashboard
            </NavigationMenuRouterLink>
          </NavigationMenuItem>
          <NavigationMenuItem className="ml-auto">
            {user == null ? (
              <NavigationMenuRouterLink to="/login" className="px-6">
                Login
              </NavigationMenuRouterLink>
            ) : (
              <p>Bem Vindo, {user.nome || "unknown"}</p>
            )}
          </NavigationMenuItem>
        </div>
      </NavigationMenuList>
    </NavigationMenu>
  );
};

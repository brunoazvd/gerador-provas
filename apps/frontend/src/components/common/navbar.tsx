import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuList,
} from "@shadcn/navigation-menu";
import { useAuth } from "@context/auth-context";
import { Link } from "react-router-dom";

export const Navbar = () => {
  const { user } = useAuth();
  return (
    <NavigationMenu>
      <NavigationMenuList className="w-screen py-3 gap-6 px-4 bg-white">
        <div className="flex gap-4 w-4xl">
          <NavigationMenuItem>
            <Link to="/" className="px-6">
              Homepage
            </Link>
          </NavigationMenuItem>
          <NavigationMenuItem>
            <Link to="/dashboard" className="px-6">
              Dashboard
            </Link>
          </NavigationMenuItem>
          <NavigationMenuItem className="ml-auto">
            {user == null ? (
              <Link to="/login" className="px-6">
                Login
              </Link>
            ) : (
              <p>Bem Vindo, {user.nome || "unknown"}</p>
            )}
          </NavigationMenuItem>
        </div>
      </NavigationMenuList>
    </NavigationMenu>
  );
};

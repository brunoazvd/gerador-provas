import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuList,
  NavigationMenuRouterLink,
} from "@shadcn/navigation-menu";
import { Button } from "@shadcn/button";
import { Link } from "react-router-dom";
import { useAuth } from "@context/auth-context";
import { logout } from "@api/auth";
import { toast } from "sonner";
import { AxiosError } from "axios";

export const Navbar = () => {
  const { user, clearAuth } = useAuth();
  const handleLogout = async (): Promise<void> => {
    try {
      await logout();
      clearAuth();
    } catch (error) {
      const errorMessage: string = (
        (error as AxiosError).response!.data! as { message: string }
      ).message;
      toast.error(errorMessage);
    }
  };
  return (
    <NavigationMenu>
      <NavigationMenuList className="w-screen py-3 gap-6 px-4 bg-white border-b-2 border-primary">
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
              <Button className="px-6">
                <Link to="/login">Entrar</Link>
              </Button>
            ) : (
              <Button className="px-6" onClick={handleLogout}>
                Sair
              </Button>
            )}
          </NavigationMenuItem>
        </div>
      </NavigationMenuList>
    </NavigationMenu>
  );
};

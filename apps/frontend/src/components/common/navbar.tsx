import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
} from "@shadcn/navigation-menu";

export const Navbar = () => {
  return (
    <NavigationMenu>
      <NavigationMenuList className="w-screen py-3 gap-6 shadow-lg px-4 bg-white">
        <div className="flex gap-4 w-4xl">
          <NavigationMenuItem>
            <NavigationMenuLink href="/" className="px-6">
              Item 1
            </NavigationMenuLink>
          </NavigationMenuItem>
          <NavigationMenuItem>
            <NavigationMenuLink href="/" className="px-6">
              Item 2
            </NavigationMenuLink>
          </NavigationMenuItem>
          <NavigationMenuItem>
            <NavigationMenuLink href="/" className="px-6">
              Item 3
            </NavigationMenuLink>
          </NavigationMenuItem>
          <NavigationMenuItem>
            <NavigationMenuLink href="/" className="px-6">
              Item 4
            </NavigationMenuLink>
          </NavigationMenuItem>
          <NavigationMenuItem className="ml-auto">
            <NavigationMenuLink href="/login" className="px-6">
              Login
            </NavigationMenuLink>
          </NavigationMenuItem>
        </div>
      </NavigationMenuList>
    </NavigationMenu>
  );
};

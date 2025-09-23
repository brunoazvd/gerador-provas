import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuIndicator,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
  NavigationMenuViewport,
} from "@shadcn/navigation-menu"

const Navbar = () => {
  return (
      <NavigationMenu>
        <NavigationMenuList className="w-screen py-3 gap-6 shadow-xl px-4">
          <div className="flex gap-4 w-6xl">
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
  )
}

export {
  Navbar
}
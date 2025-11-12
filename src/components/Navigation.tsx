import { useState, useEffect } from "react";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import {
  Sheet,
  SheetContent,
  SheetTrigger,
  SheetHeader,
  SheetTitle,
  SheetDescription,
} from "./ui/sheet";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";
import {
  Menu,
  ShoppingCart,
  Coffee,
  Wrench,
  Calendar,
  Tag,
  Gift,
  User,
  FileText,
  HelpCircle,
  Phone,
  Shield,
  ScrollText,
  X,
  LogOut,
  Settings,
  UserCog,
} from "lucide-react";
import { AuthModal } from "./AuthModal";
import { useCart, useAuth } from "../App";
import type { Page } from "../App";

interface NavigationProps {
  currentPage: Page;
  onPageChange: (page: Page) => void;
}

const navigationItems = [
  {
    page: "home" as Page,
    label: "Home",
    icon: Coffee,
    description: "Welcome to Bean Boutique",
  },
  {
    page: "coffee" as Page,
    label: "Coffee Selection",
    icon: Coffee,
    description: "Premium coffee beans from around the world",
  },
  {
    page: "equipment" as Page,
    label: "Brewing Equipment",
    icon: Wrench,
    description: "Professional brewing tools & accessories",
  },
  {
    page: "events" as Page,
    label: "Events & Workshops",
    icon: Calendar,
    description: "Learn brewing techniques from experts",
  },
  {
    page: "offers" as Page,
    label: "Special Offers",
    icon: Tag,
    description: "Exclusive deals and promotions",
  },
  {
    page: "subscription" as Page,
    label: "Subscriptions",
    icon: Gift,
    description: "Fresh coffee delivered monthly",
  },
  {
    page: "about" as Page,
    label: "About Us",
    icon: User,
    description: "Our story and commitment to quality",
  },
  {
    page: "blog" as Page,
    label: "Blog",
    icon: FileText,
    description: "Coffee tips, recipes, and stories",
  },
  {
    page: "faq" as Page,
    label: "FAQ",
    icon: HelpCircle,
    description: "Frequently asked questions",
  },
  {
    page: "contact" as Page,
    label: "Contact",
    icon: Phone,
    description: "Get in touch with our team",
  },
  {
    page: "privacy" as Page,
    label: "Privacy Policy",
    icon: Shield,
    description: "How we protect your data",
  },
  {
    page: "terms" as Page,
    label: "Terms of Service",
    icon: ScrollText,
    description: "Our terms and conditions",
  },
];

// Auth Component for Navigation
function AuthComponent({
  onPageChange,
}: {
  onPageChange?: (page: Page) => void;
}) {
  const { user, signOut } = useAuth();

  if (user) {
    return (
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" size="sm" className="gap-2">
            <User className="h-4 w-4" />
            <span className="hidden md:inline">
              {user.user_metadata?.name ||
                user.email?.split("@")[0] ||
                "Account"}
            </span>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-48">
          <DropdownMenuLabel>My Account</DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuItem onClick={() => onPageChange?.("profile")}>
            <User className="h-4 w-4 mr-2" />
            Profile
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => onPageChange?.("admin")}>
            <UserCog className="h-4 w-4 mr-2" />
            Admin Dashboard
          </DropdownMenuItem>
          <DropdownMenuItem>
            <Settings className="h-4 w-4 mr-2" />
            Settings
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem onClick={signOut}>
            <LogOut className="h-4 w-4 mr-2" />
            Sign Out
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    );
  }

  return (
    <AuthModal
      trigger={
        <Button variant="outline" size="sm">
          <User className="h-4 w-4 mr-2" />
          Sign In
        </Button>
      }
    />
  );
}

export function Navigation({ currentPage, onPageChange }: NavigationProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const { cartItemCount } = useCart();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handlePageChange = (page: Page) => {
    onPageChange(page);
    setIsOpen(false);
    // Scroll to top smoothly
    setTimeout(() => {
      window.scrollTo({ top: 0, behavior: "smooth" });
    }, 100);
  };

  const mainNavItems = navigationItems.slice(0, 6);
  const secondaryNavItems = navigationItems.slice(6);

  return (
    <nav
      className={`sticky top-0 z-50 transition-all duration-300 ${
        isScrolled
          ? "bg-background/95 backdrop-blur-sm shadow-sm"
          : "bg-background"
      }`}
    >
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <button
            onClick={() => handlePageChange("home")}
            className="flex items-center gap-2 font-medium text-xl"
          >
            <Coffee className="h-6 w-6 text-primary" />
            <span>Bean Boutique</span>
          </button>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center gap-8">
            {mainNavItems.map((item) => (
              <button
                key={item.page}
                onClick={() => handlePageChange(item.page)}
                className={`text-sm font-medium transition-colors hover:text-primary ${
                  currentPage === item.page
                    ? "text-primary"
                    : "text-muted-foreground"
                }`}
              >
                {item.label}
              </button>
            ))}
          </div>

          {/* Cart, Auth, and Mobile Menu */}
          <div className="hidden lg:flex items-center gap-4">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => handlePageChange("cart")}
              className="relative"
            >
              <ShoppingCart className="h-5 w-5" />
              {cartItemCount > 0 && (
                <Badge
                  variant="destructive"
                  className="absolute -top-2 -right-2 h-5 w-5 p-0 flex items-center justify-center text-xs"
                >
                  {cartItemCount}
                </Badge>
              )}
            </Button>

            {/* Auth Section */}
            <AuthComponent onPageChange={handlePageChange} />
          </div>

          {/* Mobile Controls */}
          <div className="flex lg:hidden items-center gap-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => handlePageChange("cart")}
              className="relative"
            >
              <ShoppingCart className="h-5 w-5" />
              {cartItemCount > 0 && (
                <Badge
                  variant="destructive"
                  className="absolute -top-2 -right-2 h-5 w-5 p-0 flex items-center justify-center text-xs"
                >
                  {cartItemCount}
                </Badge>
              )}
            </Button>

            {/* Mobile Menu */}
            <Sheet open={isOpen} onOpenChange={setIsOpen}>
              <SheetTrigger asChild>
                <Button variant="ghost" size="sm" className="lg:hidden">
                  <Menu size={32} className="h-10 w-10 text-red-500" />
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="w-full sm:w-[400px] p-0">
                <div className="h-full flex flex-col">
                  {/* Header */}
                  <SheetHeader className="p-6 border-b">
                    <div className="flex items-center justify-between">
                      <SheetTitle className="flex items-center gap-2">
                        <Coffee className="h-5 w-5 text-primary" />
                        Bean Boutique
                      </SheetTitle>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => setIsOpen(false)}
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                    <SheetDescription>
                      Navigate through our premium coffee and brewing equipment
                      collection
                    </SheetDescription>
                  </SheetHeader>

                  {/* Navigation Items - Taking half screen vertically */}
                  <div className="flex-1 overflow-y-auto p-4">
                    <div className="space-y-1">
                      <div className="pb-4">
                        <h3 className="text-sm font-medium text-muted-foreground mb-3">
                          Main Menu
                        </h3>
                        <div className="space-y-1">
                          {mainNavItems.map((item) => {
                            const Icon = item.icon;
                            return (
                              <button
                                key={item.page}
                                onClick={() => handlePageChange(item.page)}
                                className={`w-full flex items-start gap-3 p-3 rounded-lg text-left transition-colors ${
                                  currentPage === item.page
                                    ? "bg-primary/10 text-primary"
                                    : "hover:bg-muted text-foreground"
                                }`}
                              >
                                <Icon className="h-5 w-5 mt-0.5 flex-shrink-0" />
                                <div className="flex-1 min-w-0">
                                  <div className="font-medium">
                                    {item.label}
                                  </div>
                                  <div className="text-sm text-muted-foreground mt-1">
                                    {item.description}
                                  </div>
                                </div>
                              </button>
                            );
                          })}
                        </div>
                      </div>

                      <div className="pt-4 border-t">
                        <h3 className="text-sm font-medium text-muted-foreground mb-3">
                          More
                        </h3>
                        <div className="space-y-1">
                          {secondaryNavItems.map((item) => {
                            const Icon = item.icon;
                            return (
                              <button
                                key={item.page}
                                onClick={() => handlePageChange(item.page)}
                                className={`w-full flex items-start gap-3 p-3 rounded-lg text-left transition-colors ${
                                  currentPage === item.page
                                    ? "bg-primary/10 text-primary"
                                    : "hover:bg-muted text-foreground"
                                }`}
                              >
                                <Icon className="h-4 w-4 mt-1 flex-shrink-0" />
                                <div className="flex-1 min-w-0">
                                  <div className="text-sm font-medium">
                                    {item.label}
                                  </div>
                                  <div className="text-xs text-muted-foreground mt-1">
                                    {item.description}
                                  </div>
                                </div>
                              </button>
                            );
                          })}
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Auth and Footer Info */}
                  <div className="p-4 border-t bg-muted/30">
                    {/* Mobile Auth */}
                    <div className="mb-4">
                      <AuthComponent onPageChange={handlePageChange} />
                    </div>

                    <div className="text-center">
                      <div className="text-sm font-medium mb-1">
                        Bean Boutique
                      </div>
                      <div className="text-xs text-muted-foreground">
                        Premium coffee & brewing equipment
                      </div>
                      <div className="text-xs text-muted-foreground mt-2">
                        📍 123 Coffee Street, Bean City
                      </div>
                      <div className="text-xs text-muted-foreground">
                        📞 (555) 123-BEAN
                      </div>
                      <div className="text-xs text-muted-foreground">
                        ✉️ hello@beanboutique.com
                      </div>
                    </div>
                  </div>
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>
    </nav>
  );
}

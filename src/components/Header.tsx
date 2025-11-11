import { Coffee, Menu, ShoppingCart, User } from 'lucide-react';
import { Button } from './ui/button';

export function Header() {
  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center justify-between px-4 mx-auto">
        <div className="flex items-center gap-2">
          <Coffee className="h-6 w-6 text-primary" />
          <span className="text-lg font-medium">Brew & Bean</span>
        </div>
        
        <nav className="hidden md:flex items-center gap-8">
          <a href="#home" className="text-sm font-medium hover:text-primary transition-colors">Home</a>
          <a href="#offerings" className="text-sm font-medium hover:text-primary transition-colors">Our Offerings</a>
          <a href="#special" className="text-sm font-medium hover:text-primary transition-colors">Special Offers</a>
          <a href="#contact" className="text-sm font-medium hover:text-primary transition-colors">Contact</a>
        </nav>

        <div className="flex items-center gap-2">
          <Button variant="ghost" size="icon" aria-label="Shopping cart">
            <ShoppingCart className="h-5 w-5" />
          </Button>
          <Button variant="ghost" size="icon" aria-label="User account">
            <User className="h-5 w-5" />
          </Button>
          <Button variant="ghost" size="icon" className="md:hidden" aria-label="Menu">
            <Menu className="h-5 w-5" />
          </Button>
        </div>
      </div>
    </header>
  );
}
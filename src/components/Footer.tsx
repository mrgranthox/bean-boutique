import { Coffee, MapPin, Phone, Mail, Instagram, Facebook, Twitter } from 'lucide-react';
import type { Page } from '../App';

interface FooterProps {
  onPageChange: (page: Page) => void;
}

export function Footer({ onPageChange }: FooterProps) {
  const handleLinkClick = (page: Page) => {
    onPageChange(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="bg-coffee-dark text-cream py-16">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          <div>
            <div className="flex items-center gap-2 mb-4">
              <Coffee className="h-6 w-6 text-coffee-light" />
              <span className="text-lg font-medium">Bean Boutique</span>
            </div>
            <p className="text-cream/80 mb-4 leading-relaxed">
              Your neighborhood coffee destination, serving exceptional coffee and building community connections since 2018.
            </p>
            <div className="flex gap-3">
              <button className="p-2 bg-coffee-medium/20 hover:bg-coffee-medium/30 rounded-full transition-colors">
                <Instagram className="h-4 w-4" />
              </button>
              <button className="p-2 bg-coffee-medium/20 hover:bg-coffee-medium/30 rounded-full transition-colors">
                <Facebook className="h-4 w-4" />
              </button>
              <button className="p-2 bg-coffee-medium/20 hover:bg-coffee-medium/30 rounded-full transition-colors">
                <Twitter className="h-4 w-4" />
              </button>
            </div>
          </div>
          
          <div>
            <h3 className="mb-4 font-medium text-coffee-light">Shop</h3>
            <nav className="space-y-3">
              <button 
                onClick={() => handleLinkClick('coffee')}
                className="block text-cream/80 hover:text-cream transition-colors text-left"
              >
                Coffee Selection
              </button>
              <button 
                onClick={() => handleLinkClick('equipment')}
                className="block text-cream/80 hover:text-cream transition-colors text-left"
              >
                Brewing Equipment
              </button>
              <button 
                onClick={() => handleLinkClick('subscription')}
                className="block text-cream/80 hover:text-cream transition-colors text-left"
              >
                Subscriptions
              </button>
              <button 
                onClick={() => handleLinkClick('offers')}
                className="block text-cream/80 hover:text-cream transition-colors text-left"
              >
                Special Offers
              </button>
              <button 
                onClick={() => handleLinkClick('cart')}
                className="block text-cream/80 hover:text-cream transition-colors text-left"
              >
                Shopping Cart
              </button>
            </nav>
          </div>
          
          <div>
            <h3 className="mb-4 font-medium text-coffee-light">Learn & Connect</h3>
            <nav className="space-y-3">
              <button 
                onClick={() => handleLinkClick('about')}
                className="block text-cream/80 hover:text-cream transition-colors text-left"
              >
                Our Story
              </button>
              <button 
                onClick={() => handleLinkClick('blog')}
                className="block text-cream/80 hover:text-cream transition-colors text-left"
              >
                Coffee Blog
              </button>
              <button 
                onClick={() => handleLinkClick('events')}
                className="block text-cream/80 hover:text-cream transition-colors text-left"
              >
                Events & Workshops
              </button>
              <button 
                onClick={() => handleLinkClick('faq')}
                className="block text-cream/80 hover:text-cream transition-colors text-left"
              >
                FAQ
              </button>
              <button 
                onClick={() => handleLinkClick('contact')}
                className="block text-cream/80 hover:text-cream transition-colors text-left"
              >
                Contact Us
              </button>
            </nav>
          </div>
          
          <div>
            <h3 className="mb-4 font-medium text-coffee-light">Visit Us</h3>
            <div className="space-y-3">
              <div className="flex items-start gap-3 text-cream/80">
                <MapPin className="h-4 w-4 mt-1 flex-shrink-0 text-coffee-light" />
                <span>123 Coffee Street<br />Downtown District<br />City, State 12345</span>
              </div>
              <div className="flex items-center gap-3 text-cream/80">
                <Phone className="h-4 w-4 flex-shrink-0 text-coffee-light" />
                <span>(555) 123-BEAN</span>
              </div>
              <div className="flex items-center gap-3 text-cream/80">
                <Mail className="h-4 w-4 flex-shrink-0 text-coffee-light" />
                <span>hello@beanboutique.com</span>
              </div>
            </div>
            
            <div className="mt-6">
              <h4 className="font-medium text-coffee-light mb-2">Store Hours</h4>
              <div className="space-y-1 text-sm text-cream/80">
                <p>Mon-Fri: 6:00 AM - 8:00 PM</p>
                <p>Saturday: 7:00 AM - 9:00 PM</p>
                <p>Sunday: 7:00 AM - 7:00 PM</p>
              </div>
            </div>
          </div>
        </div>
        
        <div className="border-t border-coffee-medium/20 mt-12 pt-8 text-center text-cream/60">
          <p>&copy; 2024 Bean Boutique. All rights reserved. | 
            <button 
              onClick={() => handleLinkClick('privacy')}
              className="hover:text-cream transition-colors ml-1"
            >
              Privacy Policy
            </button> | 
            <button 
              onClick={() => handleLinkClick('terms')}
              className="hover:text-cream transition-colors ml-1"
            >
              Terms of Service
            </button>
          </p>
        </div>
      </div>
    </footer>
  );
}
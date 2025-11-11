import { Badge } from './ui/badge';
import { Button } from './ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Clock, Star } from 'lucide-react';
import { ImageWithFallback } from './figma/ImageWithFallback';

export function SpecialOffer() {
  return (
    <section id="special" className="py-24">
      <div className="container px-4 mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-medium mb-4">Today's Special</h2>
          <p className="text-xl text-muted-foreground font-normal">
            Don't miss out on our featured offer
          </p>
        </div>
        
        <Card className="max-w-4xl mx-auto overflow-hidden">
          <div className="grid md:grid-cols-2 items-center">
            <div className="relative">
              <ImageWithFallback
                src="https://images.unsplash.com/photo-1531441802565-2948024f1b22?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxsYXR0ZSUyMGFydHxlbnwxfHx8fDE3NTU4NjgzODF8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral"
                alt="Artisanal latte with beautiful foam art"
                className="w-full h-full object-cover min-h-[300px]"
              />
              <Badge className="absolute top-4 left-4 bg-primary text-primary-foreground font-medium">
                Limited Time
              </Badge>
            </div>
            
            <div className="p-8">
              <div className="flex items-center gap-2 mb-4">
                <div className="flex items-center">
                  <Star className="h-5 w-5 text-yellow-500 fill-current" />
                  <Star className="h-5 w-5 text-yellow-500 fill-current" />
                  <Star className="h-5 w-5 text-yellow-500 fill-current" />
                  <Star className="h-5 w-5 text-yellow-500 fill-current" />
                  <Star className="h-5 w-5 text-yellow-500 fill-current" />
                </div>
                <span className="text-sm text-muted-foreground ml-2 font-normal">Customer Favorite</span>
              </div>
              
              <CardTitle className="text-2xl font-medium mb-4">
                Signature Blend Bundle
              </CardTitle>
              
              <CardDescription className="text-base font-normal leading-relaxed mb-6">
                Get our premium house blend coffee beans (1lb) plus a handcrafted latte of your choice.
              </CardDescription>
              
              <div className="flex items-center gap-4 mb-6">
                <div className="flex items-baseline">
                  <span className="text-3xl font-medium text-primary">$24.99</span>
                  <span className="text-lg text-muted-foreground line-through ml-2 font-normal">$32.99</span>
                </div>
                <Badge variant="secondary" className="flex items-center gap-1 font-medium">
                  <Clock className="h-3 w-3" />
                  Today Only
                </Badge>
              </div>
              
              <Button size="lg" className="w-full font-medium">
                Claim This Offer
              </Button>
            </div>
          </div>
        </Card>
      </div>
    </section>
  );
}
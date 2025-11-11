import { Button } from './ui/button';
import { ImageWithFallback } from './figma/ImageWithFallback';

export function Hero() {
  return (
    <section id="home" className="relative min-h-[80vh] flex items-center">
      <div className="absolute inset-0 z-0">
        <ImageWithFallback
          src="https://images.unsplash.com/photo-1521017432531-fbd92d768814?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjb2ZmZWUlMjBzaG9wJTIwaW50ZXJpb3J8ZW58MXx8fHwxNzU1ODMzMDI2fDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral"
          alt="Cozy coffee shop interior with warm lighting and comfortable seating"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-black/40"></div>
      </div>
      
      <div className="container relative z-10 px-4 mx-auto">
        <div className="max-w-2xl text-white">
          <h1 className="text-5xl md:text-6xl font-medium mb-6 text-white leading-tight">
            Welcome to Brew & Bean
          </h1>
          <p className="text-xl font-normal mb-8 text-white/90 leading-relaxed">
            Experience the perfect blend of premium coffee, cozy atmosphere, and exceptional service. 
            From handcrafted lattes to freshly roasted beans, we bring you the finest coffee experience.
          </p>
          <div className="flex flex-col sm:flex-row gap-4">
            <Button size="lg" className="bg-primary text-primary-foreground hover:bg-primary/90 font-medium">
              Explore Our Menu
            </Button>
            <Button size="lg" variant="outline" className="bg-white/10 text-white border-white hover:bg-white/20 font-medium">
              Visit Our Shop
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}
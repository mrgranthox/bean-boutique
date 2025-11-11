import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Badge } from '../ui/badge';
import { Button } from '../ui/button';
import { Progress } from '../ui/progress';
import { RatingDisplay } from '../ui/rating-display';
import { ImageWithFallback } from '../figma/ImageWithFallback';
import { 
  Coffee, 
  Users, 
  Award, 
  Heart, 
  Globe, 
  Leaf, 
  MapPin, 
  Calendar,
  TrendingUp,
  Handshake,
  Target,
  Star,
  CheckCircle
} from 'lucide-react';

export function AboutPage() {
  const teamMembers = [
    {
      name: 'Sarah Williams',
      role: 'Founder & Head Roaster',
      bio: 'Sarah founded Bean Boutique with a passion for sustainable coffee sourcing. With 15 years of experience in the coffee industry, she travels to origin countries to build direct relationships with farmers.',
      image: "https://images.unsplash.com/photo-1494790108755-2616b612b093?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx3b21hbiUyMGNvZmZlZSUyMHNob3B8ZW58MXx8fHwxNzU1OTYyNDAyfDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
      specialties: ['Coffee Sourcing', 'Roasting', 'Sustainability'],
      certifications: ['Q Grader', 'SCA Certified', 'Fair Trade Certified']
    },
    {
      name: 'Marco Rodriguez',
      role: 'Head Barista & Training Manager',
      bio: 'Marco brings world-class barista skills and training expertise to Bean Boutique. He has competed in national championships and now focuses on training our team and customers.',
      image: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtYW4lMjBjb2ZmZWUlMjBiYXJpc3RhfGVufDF8fHx8MTc1NTk2MjQwMnww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
      specialties: ['Latte Art', 'Espresso', 'Training'],
      certifications: ['SCA Master Barista', 'Competition Judge', 'Trainer Certified']
    },
    {
      name: 'Emma Chen',
      role: 'Sustainability Director',
      bio: 'Emma leads our environmental and social responsibility initiatives. She works with farming communities to implement sustainable practices and ensure fair compensation.',
      image: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx3b21hbiUyMGJ1c2luZXNzfGVufDF8fHx8MTc1NTk2MjQwMnww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
      specialties: ['Environmental Impact', 'Fair Trade', 'Community Development'],
      certifications: ['B Corp Certified', 'Rainforest Alliance', 'Environmental Science PhD']
    },
    {
      name: 'David Park',
      role: 'Equipment Specialist',
      bio: 'David is our resident equipment expert, helping customers find the perfect brewing setup. His technical knowledge and passion for innovation drive our equipment selection.',
      image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtYW4lMjB0ZWNobm9sb2d5fGVufDF8fHx8MTc1NTk2MjQwMnww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
      specialties: ['Brewing Equipment', 'Product Testing', 'Customer Education'],
      certifications: ['SCA Brewing', 'Equipment Technician', 'Product Specialist']
    }
  ];

  const timeline = [
    {
      year: '2015',
      title: 'The Beginning',
      description: 'Sarah opened the first Bean Boutique location with a vision to source the finest coffee beans directly from farmers.',
      milestone: 'First Store Opened'
    },
    {
      year: '2017',
      title: 'Direct Trade Partnerships',
      description: 'Established direct relationships with coffee farms in Ethiopia, Colombia, and Guatemala.',
      milestone: '12 Farm Partners'
    },
    {
      year: '2019',
      title: 'Roastery Expansion',
      description: 'Opened our own roastery facility, allowing us to have complete control over the roasting process.',
      milestone: 'In-house Roasting'
    },
    {
      year: '2021',
      title: 'Sustainability Certification',
      description: 'Achieved B Corp certification, demonstrating our commitment to social and environmental responsibility.',
      milestone: 'B Corp Certified'
    },
    {
      year: '2022',
      title: 'Online Platform Launch',
      description: 'Launched our e-commerce platform, making our premium coffee accessible nationwide.',
      milestone: 'National Shipping'
    },
    {
      year: '2024',
      title: 'Community Impact',
      description: 'Reached $500K in direct payments to coffee farmers, supporting over 200 farming families.',
      milestone: '$500K to Farmers'
    }
  ];

  const awards = [
    {
      title: 'Best Coffee Roaster',
      organization: 'National Coffee Association',
      year: '2023',
      description: 'Recognized for excellence in coffee roasting and quality consistency.'
    },
    {
      title: 'Sustainability Leader',
      organization: 'Green Business Council',
      year: '2023',
      description: 'Honored for our environmental initiatives and sustainable business practices.'
    },
    {
      title: 'Community Impact Award',
      organization: 'Local Chamber of Commerce',
      year: '2022',
      description: 'Celebrated for our contributions to local community development.'
    },
    {
      title: 'Best Specialty Coffee Shop',
      organization: 'Coffee Review Magazine',
      year: '2022',
      description: 'Voted best specialty coffee shop in the region by industry experts.'
    }
  ];

  const communityStats = [
    { label: 'Coffee Farmers Supported', value: '250+', icon: Users },
    { label: 'Trees Planted', value: '15,000+', icon: Leaf },
    { label: 'Local Jobs Created', value: '45', icon: Handshake },
    { label: 'Community Events Hosted', value: '150+', icon: Calendar }
  ];

  const sustainabilityMetrics = [
    { label: 'Carbon Neutral Operations', progress: 100, target: '100%' },
    { label: 'Direct Trade Coffee', progress: 85, target: '85%' },
    { label: 'Recyclable Packaging', progress: 92, target: '95%' },
    { label: 'Renewable Energy Usage', progress: 78, target: '80%' }
  ];

  return (
    <div className="min-h-screen py-8">
      <div className="container mx-auto px-4">
        {/* Hero Section */}
        <section className="text-center mb-16">
          <h1 className="text-4xl md:text-6xl mb-6">About Bean Boutique</h1>
          <p className="text-xl text-muted-foreground max-w-4xl mx-auto leading-relaxed">
            Founded in 2015 with a simple mission: to connect coffee lovers with the world's finest beans 
            while supporting the farmers who grow them. We believe great coffee starts with great relationships, 
            sustainable practices, and an unwavering commitment to quality.
          </p>
        </section>

        {/* Mission & Values */}
        <section className="mb-16">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl mb-6">Our Mission</h2>
              <p className="text-lg text-muted-foreground mb-6 leading-relaxed">
                To create a more sustainable and equitable coffee industry by building direct relationships 
                with farmers, educating our community about quality coffee, and operating with environmental 
                responsibility at our core.
              </p>
              
              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <CheckCircle className="h-6 w-6 text-primary mt-1 flex-shrink-0" />
                  <div>
                    <h4 className="font-medium mb-1">Direct Trade Sourcing</h4>
                    <p className="text-sm text-muted-foreground">
                      We work directly with farmers to ensure fair prices and sustainable practices.
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <CheckCircle className="h-6 w-6 text-primary mt-1 flex-shrink-0" />
                  <div>
                    <h4 className="font-medium mb-1">Quality First</h4>
                    <p className="text-sm text-muted-foreground">
                      Every bean is carefully selected, roasted, and tested to meet our high standards.
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <CheckCircle className="h-6 w-6 text-primary mt-1 flex-shrink-0" />
                  <div>
                    <h4 className="font-medium mb-1">Community Education</h4>
                    <p className="text-sm text-muted-foreground">
                      We share knowledge through workshops, tastings, and educational content.
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <CheckCircle className="h-6 w-6 text-primary mt-1 flex-shrink-0" />
                  <div>
                    <h4 className="font-medium mb-1">Environmental Stewardship</h4>
                    <p className="text-sm text-muted-foreground">
                      Carbon-neutral operations and sustainable packaging are just the beginning.
                    </p>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="relative">
              <ImageWithFallback
                src="https://images.unsplash.com/photo-1447933601403-0c6688de566e?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjb2ZmZWUlMjBjdXBwaW5nJTIwc2V0fGVufDF8fHx8MTc1NTk2MjQwMnww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral"
                alt="Coffee cupping session"
                className="w-full h-96 object-cover rounded-lg"
              />
              <div className="absolute inset-0 bg-black/20 rounded-lg flex items-center justify-center">
                <Badge className="bg-white/90 text-primary-foreground text-sm px-4 py-2">
                  Quality Control in Action
                </Badge>
              </div>
            </div>
          </div>
        </section>

        {/* Community Impact Stats */}
        <section className="mb-16">
          <div className="text-center mb-12">
            <h2 className="text-3xl mb-4">Our Community Impact</h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              Numbers that matter: how we're making a difference in coffee communities worldwide.
            </p>
          </div>
          
          <div className="grid md:grid-cols-4 gap-6">
            {communityStats.map((stat, index) => {
              const Icon = stat.icon;
              return (
                <Card key={index} className="text-center">
                  <CardContent className="p-6">
                    <Icon className="h-10 w-10 text-primary mx-auto mb-4" />
                    <div className="text-3xl font-bold text-primary mb-2">{stat.value}</div>
                    <p className="text-sm text-muted-foreground">{stat.label}</p>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </section>

        {/* Team Section */}
        <section className="mb-16">
          <div className="text-center mb-12">
            <h2 className="text-3xl mb-4">Meet Our Team</h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              The passionate people behind Bean Boutique who make exceptional coffee experiences possible.
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {teamMembers.map((member, index) => (
              <Card key={index} className="overflow-hidden">
                <div className="aspect-square relative">
                  <ImageWithFallback
                    src={member.image}
                    alt={member.name}
                    className="w-full h-full object-cover"
                  />
                </div>
                <CardContent className="p-6">
                  <h4 className="font-medium mb-1">{member.name}</h4>
                  <p className="text-sm text-primary mb-3">{member.role}</p>
                  <p className="text-sm text-muted-foreground mb-4 leading-relaxed">
                    {member.bio}
                  </p>
                  
                  <div className="space-y-3">
                    <div>
                      <h5 className="text-xs font-medium mb-2">Specialties</h5>
                      <div className="flex flex-wrap gap-1">
                        {member.specialties.map((specialty) => (
                          <Badge key={specialty} variant="outline" className="text-xs">
                            {specialty}
                          </Badge>
                        ))}
                      </div>
                    </div>
                    
                    <div>
                      <h5 className="text-xs font-medium mb-2">Certifications</h5>
                      <div className="flex flex-wrap gap-1">
                        {member.certifications.map((cert) => (
                          <Badge key={cert} variant="secondary" className="text-xs">
                            {cert}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        {/* Company Timeline */}
        <section className="mb-16">
          <div className="text-center mb-12">
            <h2 className="text-3xl mb-4">Our Journey</h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              From a single location to a community-focused coffee company making a global impact.
            </p>
          </div>
          
          <div className="relative">
            {/* Timeline line */}
            <div className="absolute left-1/2 transform -translate-x-1/2 w-1 bg-primary/20 h-full"></div>
            
            <div className="space-y-12">
              {timeline.map((item, index) => (
                <div key={index} className={`flex items-center gap-8 ${index % 2 === 0 ? 'flex-row' : 'flex-row-reverse'}`}>
                  <div className={`flex-1 ${index % 2 === 0 ? 'text-right' : 'text-left'}`}>
                    <Card>
                      <CardContent className="p-6">
                        <div className="flex items-center gap-2 mb-3">
                          <Badge variant="default">{item.year}</Badge>
                          <Badge variant="outline">{item.milestone}</Badge>
                        </div>
                        <h4 className="font-medium mb-2">{item.title}</h4>
                        <p className="text-sm text-muted-foreground">{item.description}</p>
                      </CardContent>
                    </Card>
                  </div>
                  
                  {/* Timeline node */}
                  <div className="relative z-10">
                    <div className="w-4 h-4 bg-primary rounded-full border-4 border-background"></div>
                  </div>
                  
                  <div className="flex-1"></div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Sustainability Metrics */}
        <section className="mb-16">
          <div className="text-center mb-12">
            <h2 className="text-3xl mb-4">Sustainability Progress</h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              Our commitment to environmental responsibility, measured and transparent.
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 gap-8">
            {sustainabilityMetrics.map((metric, index) => (
              <Card key={index}>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between mb-4">
                    <h4 className="font-medium">{metric.label}</h4>
                    <div className="flex items-center gap-2">
                      <span className="text-sm text-muted-foreground">Target: {metric.target}</span>
                      <Badge variant={metric.progress >= 90 ? 'default' : metric.progress >= 70 ? 'secondary' : 'outline'}>
                        {metric.progress}%
                      </Badge>
                    </div>
                  </div>
                  <Progress value={metric.progress} className="h-3" />
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        {/* Awards & Recognition */}
        <section className="mb-16">
          <div className="text-center mb-12">
            <h2 className="text-3xl mb-4">Awards & Recognition</h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              Industry recognition for our commitment to quality, sustainability, and community impact.
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 gap-6">
            {awards.map((award, index) => (
              <Card key={index}>
                <CardContent className="p-6">
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center flex-shrink-0">
                      <Award className="h-6 w-6 text-primary" />
                    </div>
                    <div className="flex-1">
                      <h4 className="font-medium mb-1">{award.title}</h4>
                      <p className="text-sm text-primary mb-2">{award.organization} • {award.year}</p>
                      <p className="text-sm text-muted-foreground">{award.description}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        {/* Call to Action */}
        <section className="text-center bg-muted/30 rounded-lg p-12">
          <h2 className="text-3xl mb-4">Join Our Coffee Community</h2>
          <p className="text-xl text-muted-foreground mb-8 max-w-3xl mx-auto">
            Become part of a movement that values quality, sustainability, and community. 
            Together, we're brewing a better future for coffee lovers and farmers alike.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg">
              <Coffee className="h-5 w-5 mr-2" />
              Shop Coffee
            </Button>
            <Button size="lg" variant="outline">
              <Heart className="h-5 w-5 mr-2" />
              Join Our Subscription
            </Button>
          </div>
        </section>
      </div>
    </div>
  );
}
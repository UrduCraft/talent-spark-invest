import Header from "@/components/Header";
import CreatePost from "@/components/CreatePost";
import PostCard from "@/components/PostCard";
import InvestmentModal from "@/components/InvestmentModal";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { TrendingUp, Users, Heart, DollarSign, Star, ArrowRight } from "lucide-react";
import heroImage from "@/assets/hero-image.jpg";

const Index = () => {
  // Sample data for posts
  const samplePosts = [
    {
      id: "1",
      author: {
        name: "Sarah Chen",
        avatar: "/placeholder-avatar.jpg",
        title: "Software Engineer & Entrepreneur",
        verified: true
      },
      content: "I'm developing an AI-powered mental health app that provides 24/7 support through personalized chatbots. Looking for investors who believe in accessible mental healthcare. We've already validated the concept with 500+ beta users and seen 40% improvement in user wellbeing scores.",
      type: "investment" as const,
      timestamp: "2 hours ago",
      likes: 124,
      comments: 28,
      shares: 15,
      goal: 150000,
      raised: 75000,
      investors: 25,
      tags: ["HealthTech", "AI", "MentalHealth", "Startup"]
    },
    {
      id: "2",
      author: {
        name: "Marcus Rodriguez",
        avatar: "/placeholder-avatar.jpg",
        title: "Graphic Designer",
        verified: false
      },
      content: "Hey everyone! I need help covering my art school tuition for the final semester. I'm $3,000 short and really close to graduating with my BFA in Visual Communications. Any support would mean the world to me. I promise to pay it forward to other struggling artists!",
      type: "need" as const,
      timestamp: "4 hours ago",
      likes: 89,
      comments: 42,
      shares: 23,
      goal: 3000,
      raised: 1250,
      investors: 18,
      tags: ["Education", "Art", "Students", "Community"]
    },
    {
      id: "3",
      author: {
        name: "Dr. Elena Vasquez",
        avatar: "/placeholder-avatar.jpg",
        title: "Research Scientist at BioTech Solutions",
        verified: true
      },
      content: "Excited to share that our team just published groundbreaking research on sustainable protein alternatives! 🧬 The implications for food security and environmental impact are huge. Looking forward to collaborating with industry partners to bring this to market.",
      type: "regular" as const,
      timestamp: "6 hours ago",
      likes: 203,
      comments: 56,
      shares: 34,
      tags: ["Research", "Sustainability", "BioTech", "Innovation"]
    }
  ];

  const trendingOpportunities = [
    {
      title: "EcoWear Sustainable Fashion",
      description: "Revolutionary eco-friendly clothing line",
      target: 200000,
      current: 125000,
      investors: 43,
      category: "Fashion"
    },
    {
      title: "Smart Agriculture IoT Platform",
      description: "IoT sensors for precision farming",
      target: 500000,
      current: 180000,
      investors: 67,
      category: "AgTech"
    },
    {
      title: "VR Education for Kids",
      description: "Immersive learning experiences",
      target: 100000,
      current: 45000,
      investors: 22,
      category: "EdTech"
    }
  ];

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      {/* Hero Section */}
      <div className="relative overflow-hidden">
        <div 
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{ backgroundImage: `url(${heroImage})` }}
        >
          <div className="absolute inset-0 bg-black/40" />
        </div>
        <div className="relative container mx-auto px-4 py-12 md:py-20 text-center">
          <h1 className="text-3xl md:text-5xl font-bold text-white mb-4 md:mb-6">
            Connect. Support. Invest.
          </h1>
          <p className="text-base md:text-xl text-white/90 mb-6 md:mb-8 max-w-2xl mx-auto">
            The professional network where talent meets opportunity. Share your needs, 
            find support, and invest in the next generation of innovators.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 md:gap-4">
            <Button variant="hero" size="lg" className="w-full sm:w-auto">
              Join TalentIn
            </Button>
            <Button variant="outline" size="lg" className="w-full sm:w-auto bg-white/10 border-white text-white hover:bg-white hover:text-primary">
              Learn More
            </Button>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 gap-8 md:gap-6">
          {/* Main Feed */}
          <div className="space-y-6 order-2 md:order-1">
            <CreatePost />
            
            <div className="space-y-6">
              {samplePosts.map((post) => (
                <PostCard key={post.id} {...post} />
              ))}
            </div>
          </div>

          {/* Sidebar - Mobile: Appears at top, Desktop: Appears on right */}
          <div className="space-y-6 order-1 md:order-2">
            {/* Trending Investments */}
            <Card className="shadow-card">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <TrendingUp className="w-5 h-5 text-investment" />
                  Trending Opportunities
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {trendingOpportunities.map((opportunity, index) => (
                  <div key={index} className="p-4 border rounded-lg hover:shadow-md transition-shadow cursor-pointer">
                    <div className="flex justify-between items-start mb-2">
                      <h4 className="font-semibold text-sm">{opportunity.title}</h4>
                      <Badge variant="outline" className="text-xs">{opportunity.category}</Badge>
                    </div>
                    <p className="text-xs text-muted-foreground mb-3">{opportunity.description}</p>
                    <div className="space-y-2">
                      <div className="flex justify-between text-xs">
                        <span>${opportunity.current.toLocaleString()}</span>
                        <span>${opportunity.target.toLocaleString()}</span>
                      </div>
                      <div className="w-full bg-muted rounded-full h-1.5">
                        <div 
                          className="bg-investment h-1.5 rounded-full transition-all duration-300"
                          style={{ width: `${(opportunity.current / opportunity.target) * 100}%` }}
                        />
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-xs text-muted-foreground">
                          {opportunity.investors} investors
                        </span>
                        <InvestmentModal
                          trigger={
                            <Button variant="investment" size="sm">
                              <TrendingUp className="w-3 h-3 mr-1" />
                              Invest
                            </Button>
                          }
                          projectTitle={opportunity.title}
                          projectDescription={opportunity.description}
                          targetAmount={opportunity.target}
                          currentAmount={opportunity.current}
                          investorCount={opportunity.investors}
                          minimumInvestment={1000}
                          expectedReturn="20-25%"
                          timeframe="12-18 months"
                          riskLevel="Medium"
                        />
                      </div>
                    </div>
                  </div>
                ))}
                <Button variant="outline" className="w-full">
                  View All Opportunities
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              </CardContent>
            </Card>

            {/* Community Stats */}
            <Card className="shadow-card">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Users className="w-5 h-5 text-primary" />
                  Community Impact
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="text-center p-3 bg-primary/5 rounded-lg">
                    <div className="text-2xl font-bold text-primary">$2.4M</div>
                    <div className="text-xs text-muted-foreground">Total Invested</div>
                  </div>
                  <div className="text-center p-3 bg-donation/5 rounded-lg">
                    <div className="text-2xl font-bold text-donation">$890K</div>
                    <div className="text-xs text-muted-foreground">Total Donated</div>
                  </div>
                  <div className="text-center p-3 bg-investment/5 rounded-lg">
                    <div className="text-2xl font-bold text-investment">1,247</div>
                    <div className="text-xs text-muted-foreground">Active Investors</div>
                  </div>
                  <div className="text-center p-3 bg-muted rounded-lg">
                    <div className="text-2xl font-bold text-foreground">89%</div>
                    <div className="text-xs text-muted-foreground">Success Rate</div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Recent Activities - Hidden on mobile to simplify the UI */}
            <Card className="shadow-card hidden md:block">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Heart className="w-5 h-5 text-red-500" />
                  Recent Support
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-center gap-3 text-sm">
                  <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center">
                    <DollarSign className="w-4 h-4 text-white" />
                  </div>
                  <div>
                    <p><strong>Alex Chen</strong> invested $5,000 in <strong>EcoWear</strong></p>
                    <p className="text-xs text-muted-foreground">2 minutes ago</p>
                  </div>
                </div>
                <div className="flex items-center gap-3 text-sm">
                  <div className="w-8 h-8 bg-donation rounded-full flex items-center justify-center">
                    <Heart className="w-4 h-4 text-white" />
                  </div>
                  <div>
                    <p><strong>Maria Silva</strong> donated $200 to help <strong>Marcus</strong></p>
                    <p className="text-xs text-muted-foreground">15 minutes ago</p>
                  </div>
                </div>
                <div className="flex items-center gap-3 text-sm">
                  <div className="w-8 h-8 bg-investment rounded-full flex items-center justify-center">
                    <Star className="w-4 h-4 text-white" />
                  </div>
                  <div>
                    <p><strong>Smart Agriculture</strong> reached 50% funding</p>
                    <p className="text-xs text-muted-foreground">1 hour ago</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Index;

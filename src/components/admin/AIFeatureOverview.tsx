"use client";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  Brain, 
  MessageSquare, 
  DollarSign, 
  Search, 
  Users, 
  Star, 
  Image, 
  Globe,
  CheckCircle,
  Zap
} from 'lucide-react';
interface AIFeatureCardProps {
  title: string;
  description: string;
  icon: React.ComponentType<any>;
  features: string[];
  status: 'active' | 'enhanced' | 'new';
  color: string;
}
const AIFeatureCard = ({ title, description, icon: Icon, features, status, color }: AIFeatureCardProps) => (
  <Card className="relative overflow-hidden">
    <CardHeader className="pb-3">
      <CardTitle className="flex items-center gap-2 text-lg">
        <Icon className={`h-5 w-5 ${color}`} />
        {title}
        <Badge variant={status === 'new' ? 'secondary' : 'default'} className="ml-auto">
          {status === 'new' && <Zap className="h-3 w-3 mr-1" />}
          {status === 'enhanced' && <CheckCircle className="h-3 w-3 mr-1" />}
          GPT-5 {status}
        </Badge>
      </CardTitle>
      <CardDescription>{description}</CardDescription>
    </CardHeader>
    <CardContent>
      <div className="space-y-2">
        {features.map((feature, index) => (
          <div key={index} className="flex items-center gap-2 text-sm">
            <CheckCircle className="h-3 w-3 text-green-600" />
            <span>{feature}</span>
          </div>
        ))}
      </div>
    </CardContent>
  </Card>
);
export default function AIFeatureOverview() {
  const aiFeatures = [
    {
      title: "Guest Response Intelligence",
      description: "AI-powered guest inquiry analysis and personalized responses",
      icon: MessageSquare,
      features: [
        "Intelligent inquiry categorization",
        "Personalized response generation",
        "Sentiment analysis and escalation",
        "Multi-language support",
        "Confidence scoring"
      ],
      status: "enhanced" as const,
      color: "text-blue-600"
    },
    {
      title: "Smart Pricing Strategy",
      description: "Dynamic pricing optimization based on market intelligence",
      icon: DollarSign,
      features: [
        "Market-based pricing recommendations",
        "Seasonal adjustment factors",
        "Competitive analysis integration",
        "Revenue optimization suggestions",
        "Risk factor assessment"
      ],
      status: "new" as const,
      color: "text-purple-600"
    },
    {
      title: "SEO Content Optimization",
      description: "Advanced content optimization for maximum search visibility",
      icon: Search,
      features: [
        "Keyword density optimization",
        "Meta tag generation",
        "Semantic keyword suggestions",
        "Content gap analysis",
        "Readability scoring"
      ],
      status: "new" as const,
      color: "text-orange-600"
    },
    {
      title: "Guest Intelligence Analytics",
      description: "Deep behavioral analysis for personalized guest experiences",
      icon: Users,
      features: [
        "Guest profile categorization",
        "Preference pattern recognition",
        "Upsell opportunity identification",
        "Retention strategy recommendations",
        "Service priority optimization"
      ],
      status: "new" as const,
      color: "text-cyan-600"
    },
    {
      title: "Review Analysis Engine",
      description: "Comprehensive review sentiment and insight extraction",
      icon: Star,
      features: [
        "Multi-platform review aggregation",
        "Sentiment trend analysis",
        "Competitive benchmarking",
        "Improvement opportunity identification",
        "Response strategy recommendations"
      ],
      status: "new" as const,
      color: "text-yellow-600"
    },
    {
      title: "Gallery Media Intelligence",
      description: "AI-powered image analysis and SEO optimization",
      icon: Image,
      features: [
        "Automated alt text generation",
        "SEO description creation",
        "Keyword extraction",
        "Batch processing capabilities",
        "Accessibility optimization"
      ],
      status: "enhanced" as const,
      color: "text-indigo-600"
    },
    {
      title: "Multilingual Content Creation",
      description: "Dynamic content generation for global audiences",
      icon: Globe,
      features: [
        "Multi-language content adaptation",
        "Cultural sensitivity optimization",
        "Seasonal content variations",
        "Audience-specific messaging",
        "Brand voice consistency"
      ],
      status: "enhanced" as const,
      color: "text-green-600"
    },
    {
      title: "Predictive Analytics",
      description: "Advanced booking prediction and trend analysis",
      icon: Brain,
      features: [
        "Booking likelihood scoring",
        "Demand forecasting",
        "Guest behavior prediction",
        "Revenue optimization modeling",
        "Market trend analysis"
      ],
      status: "new" as const,
      color: "text-rose-600"
    }
  ];
  return (
    <div className="space-y-6">
      <div className="text-center space-y-2">
        <h2 className="text-2xl font-bold flex items-center justify-center gap-2">
          <Brain className="h-6 w-6 text-blue-600" />
          GPT-5 AI Features Overview
        </h2>
        <p className="text-muted-foreground">
          Comprehensive AI-powered features enhancing Ko Lake Villa's operational intelligence
        </p>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {aiFeatures.map((feature, index) => (
          <AIFeatureCard key={index} {...feature} />
        ))}
      </div>
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Zap className="h-5 w-5 text-yellow-600" />
            System Performance
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
            <div>
              <div className="text-2xl font-bold text-blue-600">GPT-5</div>
              <div className="text-sm text-muted-foreground">AI Model</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-green-600">8</div>
              <div className="text-sm text-muted-foreground">Core Features</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-purple-600">24/7</div>
              <div className="text-sm text-muted-foreground">Availability</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-orange-600">Multi</div>
              <div className="text-sm text-muted-foreground">Language</div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
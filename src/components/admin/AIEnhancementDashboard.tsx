"use client";
import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Brain, 
  MessageSquare, 
  Globe, 
  TrendingUp, 
  Bot, 
  Languages, 
  BarChart3,
  Sparkles,
  Users,
  Calendar,
  DollarSign
} from 'lucide-react';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
interface GuestInquiry {
  guestName: string;
  guestEmail: string;
  message: string;
  context: {
    checkIn?: string;
    checkOut?: string;
    guests?: number;
    previousStay?: boolean;
    inquiryType: string;
  };
}
interface ContentRequest {
  type: string;
  language: string;
  season?: string;
  audienceType?: string;
}
export default function AIEnhancementDashboard() {
  const showToast = (title: string, description: string, variant?: "default" | "destructive") => {
    // Add toast functionality here when needed
  };
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState('guest-response');
  // Guest Response State
  const [guestInquiry, setGuestInquiry] = useState<GuestInquiry>({
    guestName: '',
    guestEmail: '',
    message: '',
    context: {
      inquiryType: 'booking'
    }
  });
  const [aiResponse, setAiResponse] = useState<any>(null);
  // Content Generation State
  const [contentRequest, setContentRequest] = useState<ContentRequest>({
    type: 'villa_description',
    language: 'en'
  });
  const [baseContent, setBaseContent] = useState('');
  const [generatedContent, setGeneratedContent] = useState('');
  // Booking Prediction State
  const [guestData, setGuestData] = useState({
    guestCount: 4,
    priceQuoted: 149,
    checkInDate: '',
    checkOutDate: '',
    source: 'direct',
    previousInteractions: 0,
    inquiryHistory: [] as string[]
  });
  const [prediction, setPrediction] = useState<any>(null);
  const handleGuestResponse = async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/admin/ai-enhancement/guest-response', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...guestInquiry,
          id: Date.now().toString(),
          timestamp: new Date().toISOString()
        })
      });
      const data = await response.json();
      if (data.success) {
        setAiResponse(data.aiResponse);
        showToast(
          "AI Response Generated",
          `Confidence: ${Math.round(data.aiResponse.confidence * 100)}%`
        );
      } else {
        throw new Error(data.error);
      }
    } catch (error) {
      showToast(
        "Error",
        error instanceof Error ? error.message : "Failed to generate response",
        "destructive"
      );
    } finally {
      setLoading(false);
    }
  };
  const handleContentGeneration = async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/admin/ai-enhancement/content-generation', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contentRequest,
          baseContent: baseContent || undefined
        })
      });
      const data = await response.json();
      if (data.success) {
        setGeneratedContent(data.content);
        showToast(
          "Content Generated",
          `${data.metadata.language.toUpperCase()} content for ${data.metadata.type.replace('_', ' ')}`
        );
      } else {
        throw new Error(data.error);
      }
    } catch (error) {
      showToast(
        "Error",
        error instanceof Error ? error.message : "Failed to generate content",
        "destructive"
      );
    } finally {
      setLoading(false);
    }
  };
  const handleBookingPrediction = async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/admin/ai-enhancement/booking-prediction', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(guestData)
      });
      const data = await response.json();
      if (data.success) {
        setPrediction(data.prediction);
        showToast(
          "Prediction Generated",
          `Booking probability: ${Math.round(data.prediction.bookingProbability * 100)}%`
        );
      } else {
        throw new Error(data.error);
      }
    } catch (error) {
      showToast(
        "Error",
        error instanceof Error ? error.message : "Failed to generate prediction",
        "destructive"
      );
    } finally {
      setLoading(false);
    }
  };
  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <div className="flex items-center gap-2">
          <Brain className="h-8 w-8 text-blue-600" />
          <div>
            <h1 className="text-3xl font-bold">AI Enhancement Dashboard</h1>
            <p className="text-muted-foreground">Phase 3: GPT-5 powered intelligent guest services</p>
          </div>
        </div>
        <Badge variant="secondary" className="ml-auto">
          <Sparkles className="h-4 w-4 mr-1" />
          GPT-5 Powered
        </Badge>
      </div>
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="guest-response" className="flex items-center gap-2">
            <MessageSquare className="h-4 w-4" />
            Guest Intelligence
          </TabsTrigger>
          <TabsTrigger value="content-generation" className="flex items-center gap-2">
            <Globe className="h-4 w-4" />
            Content Generation
          </TabsTrigger>
          <TabsTrigger value="booking-prediction" className="flex items-center gap-2">
            <TrendingUp className="h-4 w-4" />
            Booking Analytics
          </TabsTrigger>
          <TabsTrigger value="overview" className="flex items-center gap-2">
            <BarChart3 className="h-4 w-4" />
            AI Overview
          </TabsTrigger>
        </TabsList>
        <TabsContent value="guest-response" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Bot className="h-5 w-5" />
                Intelligent Guest Response System
              </CardTitle>
              <CardDescription>
                GPT-5 powered responses to guest inquiries with sentiment analysis and escalation logic
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="guestName">Guest Name</Label>
                  <Input
                    id="guestName"
                    value={guestInquiry.guestName}
                    onChange={(e) => setGuestInquiry(prev => ({ ...prev, guestName: e.target.value }))}
                    placeholder="John Smith"
                  />
                </div>
                <div>
                  <Label htmlFor="guestEmail">Guest Email</Label>
                  <Input
                    id="guestEmail"
                    type="email"
                    value={guestInquiry.guestEmail}
                    onChange={(e) => setGuestInquiry(prev => ({ ...prev, guestEmail: e.target.value }))}
                    placeholder="john@example.com"
                  />
                </div>
              </div>
              <div className="grid grid-cols-3 gap-4">
                <div>
                  <Label htmlFor="inquiryType">Inquiry Type</Label>
                  <Select 
                    value={guestInquiry.context.inquiryType} 
                    onValueChange={(value) => setGuestInquiry(prev => ({ 
                      ...prev, 
                      context: { ...prev.context, inquiryType: value }
                    }))}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="booking">Booking Inquiry</SelectItem>
                      <SelectItem value="amenities">Villa Amenities</SelectItem>
                      <SelectItem value="location">Location & Activities</SelectItem>
                      <SelectItem value="dining">Dining Services</SelectItem>
                      <SelectItem value="activities">Experiences</SelectItem>
                      <SelectItem value="support">Guest Support</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="guests">Guest Count</Label>
                  <Input
                    id="guests"
                    type="number"
                    min="1"
                    max="12"
                    value={guestInquiry.context.guests || ''}
                    onChange={(e) => setGuestInquiry(prev => ({ 
                      ...prev, 
                      context: { ...prev.context, guests: parseInt(e.target.value) || undefined }
                    }))}
                    placeholder="4"
                  />
                </div>
                <div className="flex items-center space-x-2 pt-6">
                  <input
                    type="checkbox"
                    id="previousStay"
                    checked={guestInquiry.context.previousStay || false}
                    onChange={(e) => setGuestInquiry(prev => ({ 
                      ...prev, 
                      context: { ...prev.context, previousStay: e.target.checked }
                    }))}
                  />
                  <Label htmlFor="previousStay">Previous Guest</Label>
                </div>
              </div>
              <div>
                <Label htmlFor="message">Guest Message</Label>
                <Textarea
                  id="message"
                  value={guestInquiry.message}
                  onChange={(e) => setGuestInquiry(prev => ({ ...prev, message: e.target.value }))}
                  placeholder="Hi, I'm interested in booking Ko Lake Villa for 6 guests from December 15-20. Could you provide availability and pricing details?"
                  rows={4}
                />
              </div>
              <Button onClick={handleGuestResponse} disabled={loading} className="w-full">
                {loading ? 'Generating AI Response...' : 'Generate Intelligent Response'}
              </Button>
              {aiResponse && (
                <Card className="mt-4">
                  <CardHeader>
                    <CardTitle className="flex items-center justify-between">
                      AI Generated Response
                      <div className="flex gap-2">
                        <Badge variant={aiResponse.confidence > 0.8 ? "default" : "secondary"}>
                          Confidence: {Math.round(aiResponse.confidence * 100)}%
                        </Badge>
                        <Badge variant={aiResponse.escalateToHuman ? "destructive" : "default"}>
                          {aiResponse.escalateToHuman ? "Human Review Required" : "AI Handled"}
                        </Badge>
                      </div>
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div>
                        <Label>Response</Label>
                        <div className="p-3 bg-muted rounded-md">
                          {aiResponse.response}
                        </div>
                      </div>
                      {aiResponse.suggestedActions?.length > 0 && (
                        <div>
                          <Label>Suggested Actions</Label>
                          <div className="flex flex-wrap gap-2 mt-1">
                            {aiResponse.suggestedActions.map((action: string, index: number) => (
                              <Badge key={index} variant="outline">{action}</Badge>
                            ))}
                          </div>
                        </div>
                      )}
                      <div className="grid grid-cols-2 gap-4 text-sm">
                        <div>Sentiment Score: {Math.round(aiResponse.sentimentScore * 100)}%</div>
                        <div>Language: {aiResponse.language.toUpperCase()}</div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )}
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="content-generation" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Languages className="h-5 w-5" />
                Multilingual Content Generation
              </CardTitle>
              <CardDescription>
                Generate culturally authentic content in multiple languages for Ko Lake Villa
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="contentType">Content Type</Label>
                  <Select 
                    value={contentRequest.type} 
                    onValueChange={(value) => setContentRequest(prev => ({ ...prev, type: value }))}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="villa_description">Villa Description</SelectItem>
                      <SelectItem value="seasonal_content">Seasonal Content</SelectItem>
                      <SelectItem value="experience_guide">Experience Guide</SelectItem>
                      <SelectItem value="local_insights">Local Insights</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="language">Target Language</Label>
                  <Select 
                    value={contentRequest.language} 
                    onValueChange={(value) => setContentRequest(prev => ({ ...prev, language: value }))}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="en">English</SelectItem>
                      <SelectItem value="si">Sinhala (සිංහල)</SelectItem>
                      <SelectItem value="ta">Tamil (தமிழ்)</SelectItem>
                      <SelectItem value="de">German (Deutsch)</SelectItem>
                      <SelectItem value="fr">French (Français)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="season">Season (Optional)</Label>
                  <Select 
                    value={contentRequest.season || ''} 
                    onValueChange={(value) => setContentRequest(prev => ({ ...prev, season: value || undefined }))}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select season" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="">Any Season</SelectItem>
                      <SelectItem value="peak">Peak (Dec-Mar)</SelectItem>
                      <SelectItem value="medium">Medium (Apr-Jun, Sep-Nov)</SelectItem>
                      <SelectItem value="low">Low (Jul-Aug)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="audience">Audience Type (Optional)</Label>
                  <Select 
                    value={contentRequest.audienceType || ''} 
                    onValueChange={(value) => setContentRequest(prev => ({ ...prev, audienceType: value || undefined }))}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select audience" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="">General</SelectItem>
                      <SelectItem value="couples">Couples</SelectItem>
                      <SelectItem value="families">Families</SelectItem>
                      <SelectItem value="groups">Groups</SelectItem>
                      <SelectItem value="business">Business</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div>
                <Label htmlFor="baseContent">Base Content (Optional)</Label>
                <Textarea
                  id="baseContent"
                  value={baseContent}
                  onChange={(e) => setBaseContent(e.target.value)}
                  placeholder="Provide existing content to enhance or leave empty for new generation"
                  rows={3}
                />
              </div>
              <Button onClick={handleContentGeneration} disabled={loading} className="w-full">
                {loading ? 'Generating Content...' : 'Generate Multilingual Content'}
              </Button>
              {generatedContent && (
                <Card className="mt-4">
                  <CardHeader>
                    <CardTitle>Generated Content</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="p-3 bg-muted rounded-md max-h-60 overflow-y-auto whitespace-pre-wrap">
                      {generatedContent}
                    </div>
                  </CardContent>
                </Card>
              )}
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="booking-prediction" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TrendingUp className="h-5 w-5" />
                Predictive Booking Analytics
              </CardTitle>
              <CardDescription>
                AI-powered booking probability and revenue optimization predictions
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-3 gap-4">
                <div>
                  <Label htmlFor="guestCount">Guest Count</Label>
                  <Input
                    id="guestCount"
                    type="number"
                    min="1"
                    max="12"
                    value={guestData.guestCount}
                    onChange={(e) => setGuestData(prev => ({ ...prev, guestCount: parseInt(e.target.value) || 1 }))}
                  />
                </div>
                <div>
                  <Label htmlFor="priceQuoted">Price Quoted ($)</Label>
                  <Input
                    id="priceQuoted"
                    type="number"
                    min="119"
                    value={guestData.priceQuoted}
                    onChange={(e) => setGuestData(prev => ({ ...prev, priceQuoted: parseFloat(e.target.value) || 149 }))}
                  />
                </div>
                <div>
                  <Label htmlFor="source">Booking Source</Label>
                  <Select 
                    value={guestData.source} 
                    onValueChange={(value) => setGuestData(prev => ({ ...prev, source: value }))}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="direct">Direct</SelectItem>
                      <SelectItem value="airbnb">Airbnb</SelectItem>
                      <SelectItem value="booking">Booking.com</SelectItem>
                      <SelectItem value="google">Google</SelectItem>
                      <SelectItem value="social">Social Media</SelectItem>
                      <SelectItem value="referral">Referral</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="grid grid-cols-3 gap-4">
                <div>
                  <Label htmlFor="checkIn">Check-in Date</Label>
                  <Input
                    id="checkIn"
                    type="date"
                    value={guestData.checkInDate}
                    onChange={(e) => setGuestData(prev => ({ ...prev, checkInDate: e.target.value }))}
                  />
                </div>
                <div>
                  <Label htmlFor="checkOut">Check-out Date</Label>
                  <Input
                    id="checkOut"
                    type="date"
                    value={guestData.checkOutDate}
                    onChange={(e) => setGuestData(prev => ({ ...prev, checkOutDate: e.target.value }))}
                  />
                </div>
                <div>
                  <Label htmlFor="interactions">Previous Interactions</Label>
                  <Input
                    id="interactions"
                    type="number"
                    min="0"
                    value={guestData.previousInteractions}
                    onChange={(e) => setGuestData(prev => ({ ...prev, previousInteractions: parseInt(e.target.value) || 0 }))}
                  />
                </div>
              </div>
              <Button onClick={handleBookingPrediction} disabled={loading} className="w-full">
                {loading ? 'Analyzing...' : 'Generate Booking Prediction'}
              </Button>
              {prediction && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <Users className="h-4 w-4" />
                        Booking Probability
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="text-3xl font-bold text-green-600">
                        {Math.round(prediction.bookingProbability * 100)}%
                      </div>
                      <p className="text-sm text-muted-foreground">
                        Likelihood of confirmed booking
                      </p>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <DollarSign className="h-4 w-4" />
                        Optimized Pricing
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="text-3xl font-bold text-blue-600">
                        ${prediction.priceOptimization.recommendedPrice}
                      </div>
                      <p className="text-sm text-muted-foreground">
                        Confidence: {Math.round(prediction.priceOptimization.confidence * 100)}%
                      </p>
                    </CardContent>
                  </Card>
                  <Card className="md:col-span-2">
                    <CardHeader>
                      <CardTitle>Optimization Insights</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-2">
                        <div className="flex justify-between">
                          <span>Guest Satisfaction Prediction:</span>
                          <Badge variant="default">
                            {Math.round(prediction.guestSatisfactionPrediction * 100)}%
                          </Badge>
                        </div>
                        <div>
                          <Label>Pricing Reasoning:</Label>
                          <div className="flex flex-wrap gap-1 mt-1">
                            {prediction.priceOptimization.reasoning.map((reason: string, index: number) => (
                              <Badge key={index} variant="outline" className="text-xs">
                                {reason}
                              </Badge>
                            ))}
                          </div>
                        </div>
                        <div className="flex justify-between">
                          <span>Optimal Period:</span>
                          <span className="text-sm">
                            {prediction.optimalBookingPeriod.start} to {prediction.optimalBookingPeriod.end}
                          </span>
                        </div>
                        <p className="text-sm text-muted-foreground">
                          {prediction.optimalBookingPeriod.reason}
                        </p>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="overview" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <MessageSquare className="h-5 w-5 text-blue-600" />
                  Guest Intelligence
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground mb-3">
                  GPT-5 powered responses with sentiment analysis and escalation logic
                </p>
                <ul className="text-sm space-y-1">
                  <li>• Intelligent inquiry categorization</li>
                  <li>• Multilingual guest support</li>
                  <li>• Sentiment-based escalation</li>
                  <li>• Personalized responses</li>
                </ul>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Globe className="h-5 w-5 text-green-600" />
                  Content Generation
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground mb-3">
                  Culturally authentic content in 5 languages with seasonal optimization
                </p>
                <ul className="text-sm space-y-1">
                  <li>• English, Sinhala, Tamil, German, French</li>
                  <li>• Seasonal content adaptation</li>
                  <li>• Audience-specific messaging</li>
                  <li>• Cultural authenticity</li>
                </ul>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <TrendingUp className="h-5 w-5 text-purple-600" />
                  Predictive Analytics
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground mb-3">
                  AI-driven booking predictions and revenue optimization
                </p>
                <ul className="text-sm space-y-1">
                  <li>• Booking probability scoring</li>
                  <li>• Dynamic pricing recommendations</li>
                  <li>• Guest satisfaction prediction</li>
                  <li>• Optimal booking periods</li>
                </ul>
              </CardContent>
            </Card>
          </div>
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Sparkles className="h-5 w-5" />
                Phase 3: AI Enhancement Status
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span>GPT-5 Integration</span>
                  <Badge variant="default">Active</Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span>Guest Intelligence System</span>
                  <Badge variant="default">Operational</Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span>Multilingual Content Generation</span>
                  <Badge variant="default">Ready</Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span>Predictive Booking Analytics</span>
                  <Badge variant="default">Live</Badge>
                </div>
                <div className="text-sm text-muted-foreground mt-4 p-3 bg-muted rounded-md">
                  <strong>Phase 3 Complete:</strong> Ko Lake Villa now features enterprise-grade AI enhancement with GPT-5 
                  powered guest intelligence, multilingual content generation, and predictive booking analytics. 
                  Ready to advance to Phase 4: Tropical Serenity Experience.
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
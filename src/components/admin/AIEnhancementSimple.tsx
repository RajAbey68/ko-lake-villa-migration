"use client";
import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Brain, MessageSquare, Globe, TrendingUp, Sparkles } from 'lucide-react';
export default function AIEnhancementSimple() {
  const [loading, setLoading] = useState(false);
  const [guestName, setGuestName] = useState('');
  const [guestEmail, setGuestEmail] = useState('');
  const [message, setMessage] = useState('');
  const [aiResponse, setAiResponse] = useState('');
  const handleGuestResponse = async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/admin/ai-enhancement/guest-response', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          guestName,
          guestEmail,
          message,
          id: Date.now().toString(),
          timestamp: new Date().toISOString(),
          context: {
            inquiryType: 'booking'
          }
        })
      });
      const data = await response.json();
      if (data.success) {
        setAiResponse(data.aiResponse.response);
      } else {
        setAiResponse('Error: ' + data.error);
      }
    } catch (error) {
      setAiResponse('Error: Failed to generate response');
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
            <p className="text-gray-600">Phase 3: GPT-5 powered intelligent guest services</p>
          </div>
        </div>
        <Badge className="ml-auto">
          <Sparkles className="h-4 w-4 mr-1" />
          GPT-5 Active
        </Badge>
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <MessageSquare className="h-5 w-5" />
              Guest Intelligence System
            </CardTitle>
            <CardDescription>
              GPT-5 powered responses to guest inquiries
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <label htmlFor="guestName" className="block text-sm font-medium mb-1">Guest Name</label>
              <Input
                id="guestName"
                value={guestName}
                onChange={(e) => setGuestName(e.target.value)}
                placeholder="John Smith"
              />
            </div>
            <div>
              <label htmlFor="guestEmail" className="block text-sm font-medium mb-1">Guest Email</label>
              <Input
                id="guestEmail"
                type="email"
                value={guestEmail}
                onChange={(e) => setGuestEmail(e.target.value)}
                placeholder="john@example.com"
              />
            </div>
            <div>
              <label htmlFor="message" className="block text-sm font-medium mb-1">Guest Message</label>
              <Textarea
                id="message"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Hi, I'm interested in booking Ko Lake Villa..."
                rows={4}
              />
            </div>
            <Button onClick={handleGuestResponse} disabled={loading} className="w-full">
              {loading ? 'Generating AI Response...' : 'Generate GPT-5 Response'}
            </Button>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>AI Response</CardTitle>
          </CardHeader>
          <CardContent>
            {aiResponse ? (
              <div className="p-3 bg-gray-50 rounded-md whitespace-pre-wrap">
                {aiResponse}
              </div>
            ) : (
              <p className="text-gray-500">AI response will appear here after generation</p>
            )}
          </CardContent>
        </Card>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <MessageSquare className="h-5 w-5 text-blue-600" />
              Guest Intelligence
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-gray-600 mb-3">
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
            <p className="text-sm text-gray-600 mb-3">
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
            <p className="text-sm text-gray-600 mb-3">
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
              <Badge>Active</Badge>
            </div>
            <div className="flex items-center justify-between">
              <span>Guest Intelligence System</span>
              <Badge>Operational</Badge>
            </div>
            <div className="flex items-center justify-between">
              <span>Multilingual Content Generation</span>
              <Badge>Ready</Badge>
            </div>
            <div className="flex items-center justify-between">
              <span>Predictive Booking Analytics</span>
              <Badge>Live</Badge>
            </div>
            <div className="text-sm text-gray-600 mt-4 p-3 bg-gray-50 rounded-md">
              <strong>Phase 3 Complete:</strong> Ko Lake Villa now features enterprise-grade AI enhancement with GPT-5 
              powered guest intelligence, multilingual content generation, and predictive booking analytics. 
              Ready to advance to Phase 4: Tropical Serenity Experience.
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
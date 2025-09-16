'use client'
import { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Switch } from '@/components/ui/switch'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Calendar, DollarSign, Settings, RefreshCw as Sync, TrendingUp, Wifi } from 'lucide-react'
interface BookingSource {
  id: string
  name: string
  type: string
  active: boolean
  lastSync?: string
  bookingsCount?: number
  revenue?: number
}
interface PricingRule {
  id: string
  name: string
  type: string
  multiplier: number
  active: boolean
}
export default function PMSIntegrationDashboard() {
  const [sources, setSources] = useState<BookingSource[]>([
    {
      id: 'direct',
      name: 'Ko Lake Villa Direct',
      type: 'direct',
      active: true,
      bookingsCount: 12,
      revenue: 8400
    },
    {
      id: 'airbnb-eklv',
      name: 'Airbnb - E Ko Lake Villa',
      type: 'airbnb',
      active: true,
      lastSync: '2024-01-15T10:30:00Z',
      bookingsCount: 18,
      revenue: 12600
    },
    {
      id: 'airbnb-klv6',
      name: 'Airbnb - Ko Lake Villa 6BR',
      type: 'airbnb',
      active: true,
      lastSync: '2024-01-15T10:30:00Z',
      bookingsCount: 15,
      revenue: 10500
    },
    {
      id: 'airbnb-klv2or3',
      name: 'Airbnb - Ko Lake Villa 2-3BR',
      type: 'airbnb',
      active: true,
      lastSync: '2024-01-15T10:30:00Z',
      bookingsCount: 8,
      revenue: 4800
    }
  ])
  const [pricingRules, setPricingRules] = useState<PricingRule[]>([
    {
      id: '1',
      name: 'Weekend Premium',
      type: 'weekend',
      multiplier: 1.2,
      active: true
    },
    {
      id: '2',
      name: 'Peak Season',
      type: 'seasonal',
      multiplier: 1.3,
      active: true
    },
    {
      id: '3',
      name: 'Last Minute Discount',
      type: 'last_minute',
      multiplier: 0.75,
      active: true
    }
  ])
  const [syncStatus, setSyncStatus] = useState<'idle' | 'syncing' | 'success' | 'error'>('idle')
  const [availabilityData, setAvailabilityData] = useState<any[]>([])
  const handleSourceToggle = (sourceId: string, active: boolean) => {
    setSources(prev => prev.map(source => 
      source.id === sourceId ? { ...source, active } : source
    ))
  }
  const handlePricingRuleToggle = (ruleId: string, active: boolean) => {
    setPricingRules(prev => prev.map(rule => 
      rule.id === ruleId ? { ...rule, active } : rule
    ))
  }
  const handleSyncAvailability = async () => {
    setSyncStatus('syncing')
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000))
      setSyncStatus('success')
      setTimeout(() => setSyncStatus('idle'), 3000)
    } catch (error) {
      setSyncStatus('error')
      setTimeout(() => setSyncStatus('idle'), 3000)
    }
  }
  const totalRevenue = sources.reduce((sum, source) => sum + (source.revenue || 0), 0)
  const totalBookings = sources.reduce((sum, source) => sum + (source.bookingsCount || 0), 0)
  const directBookingRevenue = sources.find(s => s.type === 'direct')?.revenue || 0
  const directBookingPercentage = Math.round((directBookingRevenue / totalRevenue) * 100)
  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">PMS Integration</h1>
          <p className="text-muted-foreground">
            Manage Ko Lake Villa booking channels and pricing
          </p>
        </div>
        <Button onClick={handleSyncAvailability} disabled={syncStatus === 'syncing'}>
          <Sync className={`mr-2 h-4 w-4 ${syncStatus === 'syncing' ? 'animate-spin' : ''}`} />
          Sync All Channels
        </Button>
      </div>
      {syncStatus !== 'idle' && (
        <Alert>
          <AlertDescription>
            {syncStatus === 'syncing' && 'Syncing availability across all booking platforms...'}
            {syncStatus === 'success' && 'Successfully synced availability with all channels'}
            {syncStatus === 'error' && 'Error syncing availability. Please try again.'}
          </AlertDescription>
        </Alert>
      )}
      {/* Revenue Overview Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${totalRevenue.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">
              +12% from last month
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Bookings</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalBookings}</div>
            <p className="text-xs text-muted-foreground">
              +8% from last month
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Direct Bookings</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{directBookingPercentage}%</div>
            <p className="text-xs text-muted-foreground">
              ${directBookingRevenue.toLocaleString()} in direct revenue
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Commission Saved</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${Math.round(directBookingRevenue * 0.15).toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">
              15% savings from direct bookings
            </p>
          </CardContent>
        </Card>
      </div>
      <Tabs defaultValue="channels" className="space-y-4">
        <TabsList>
          <TabsTrigger value="channels">Booking Channels</TabsTrigger>
          <TabsTrigger value="pricing">Dynamic Pricing</TabsTrigger>
          <TabsTrigger value="availability">Availability Sync</TabsTrigger>
          <TabsTrigger value="settings">API Settings</TabsTrigger>
        </TabsList>
        <TabsContent value="channels" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Ko Lake Villa Booking Sources</CardTitle>
              <CardDescription>
                Manage your villa listing across different platforms
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {sources.map(source => (
                  <div key={source.id} className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex items-center space-x-4">
                      <Wifi className="h-5 w-5 text-muted-foreground" />
                      <div>
                        <div className="font-medium">{source.name}</div>
                        <div className="text-sm text-muted-foreground">
                          {source.bookingsCount} bookings • ${source.revenue?.toLocaleString()} revenue
                        </div>
                        {source.lastSync && (
                          <div className="text-xs text-muted-foreground">
                            Last sync: {new Date(source.lastSync).toLocaleString()}
                          </div>
                        )}
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Badge variant={source.active ? 'default' : 'secondary'}>
                        {source.active ? 'Active' : 'Inactive'}
                      </Badge>
                      <Switch
                        checked={source.active}
                        onCheckedChange={(checked) => handleSourceToggle(source.id, checked)}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="pricing" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Dynamic Pricing Rules</CardTitle>
              <CardDescription>
                Automated pricing adjustments for Ko Lake Villa
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {pricingRules.map(rule => (
                  <div key={rule.id} className="flex items-center justify-between p-4 border rounded-lg">
                    <div>
                      <div className="font-medium">{rule.name}</div>
                      <div className="text-sm text-muted-foreground">
                        {rule.multiplier > 1 ? 'Premium' : 'Discount'}: {Math.round((rule.multiplier - 1) * 100)}%
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Badge variant={rule.active ? 'default' : 'secondary'}>
                        {rule.active ? 'Active' : 'Inactive'}
                      </Badge>
                      <Switch
                        checked={rule.active}
                        onCheckedChange={(checked) => handlePricingRuleToggle(rule.id, checked)}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>Ko Lake Villa Base Pricing</CardTitle>
              <CardDescription>
                Current pricing structure across guest configurations
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4 md:grid-cols-3">
                <div className="p-4 border rounded-lg">
                  <div className="text-lg font-semibold">2-3 Guests</div>
                  <div className="text-2xl font-bold text-green-600">$119/night</div>
                  <div className="text-sm text-muted-foreground">Intimate villa experience</div>
                </div>
                <div className="p-4 border rounded-lg">
                  <div className="text-lg font-semibold">4-6 Guests</div>
                  <div className="text-2xl font-bold text-blue-600">$149/night</div>
                  <div className="text-sm text-muted-foreground">Standard villa rate</div>
                </div>
                <div className="p-4 border rounded-lg">
                  <div className="text-lg font-semibold">7-12 Guests</div>
                  <div className="text-2xl font-bold text-purple-600">$179/night</div>
                  <div className="text-sm text-muted-foreground">Full villa capacity</div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="availability" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Availability Synchronization</CardTitle>
              <CardDescription>
                Keep Ko Lake Villa calendar in sync across all platforms
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <Alert>
                  <AlertDescription>
                    Availability is automatically synced every 15 minutes. Last sync: {new Date().toLocaleString()}
                  </AlertDescription>
                </Alert>
                <div className="grid gap-4 md:grid-cols-2">
                  <div className="p-4 border rounded-lg">
                    <h3 className="font-medium mb-2">Sync Status</h3>
                    <div className="space-y-2">
                      {sources.filter(s => s.active).map(source => (
                        <div key={source.id} className="flex justify-between items-center">
                          <span className="text-sm">{source.name}</span>
                          <Badge variant="default">Synced</Badge>
                        </div>
                      ))}
                    </div>
                  </div>
                  <div className="p-4 border rounded-lg">
                    <h3 className="font-medium mb-2">Quick Actions</h3>
                    <div className="space-y-2">
                      <Button variant="outline" size="sm" className="w-full">
                        Block Maintenance Dates
                      </Button>
                      <Button variant="outline" size="sm" className="w-full">
                        Update Pricing Rules
                      </Button>
                      <Button variant="outline" size="sm" className="w-full">
                        Export Calendar
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="settings" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>API Configuration</CardTitle>
              <CardDescription>
                Configure API keys and webhooks for booking platforms
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div className="space-y-4">
                  <h3 className="text-lg font-medium">Airbnb Integration</h3>
                  <div className="grid gap-4 md:grid-cols-2">
                    <div>
                      <Label htmlFor="airbnb-client-id">Client ID</Label>
                      <Input id="airbnb-client-id" type="password" placeholder="Enter Airbnb Client ID" />
                    </div>
                    <div>
                      <Label htmlFor="airbnb-client-secret">Client Secret</Label>
                      <Input id="airbnb-client-secret" type="password" placeholder="Enter Airbnb Client Secret" />
                    </div>
                  </div>
                  <div>
                    <Label htmlFor="airbnb-webhook">Webhook URL</Label>
                    <Input 
                      id="airbnb-webhook" 
                      value="https://ko-lake-villa-website.vercel.app/api/pms/webhook" 
                      readOnly 
                    />
                  </div>
                </div>
                <div className="space-y-4">
                  <h3 className="text-lg font-medium">Booking.com Integration</h3>
                  <div className="grid gap-4 md:grid-cols-2">
                    <div>
                      <Label htmlFor="booking-username">Username</Label>
                      <Input id="booking-username" placeholder="Booking.com Username" />
                    </div>
                    <div>
                      <Label htmlFor="booking-password">Password</Label>
                      <Input id="booking-password" type="password" placeholder="Booking.com Password" />
                    </div>
                  </div>
                </div>
                <div className="pt-4 border-t">
                  <Button className="w-full md:w-auto">
                    <Settings className="mr-2 h-4 w-4" />
                    Save API Configuration
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
'use client';
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { 
  Shield, 
  Lock, 
  AlertTriangle, 
  CheckCircle, 
  XCircle,
  Activity,
  Users,
  Globe,
  FileX,
  Ban,
  Eye,
  RefreshCw
} from 'lucide-react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
interface SecurityEvent {
  id: string;
  type: 'rate_limit' | 'suspicious_activity' | 'auth_failure' | 'access_denied';
  ip: string;
  userAgent: string;
  path: string;
  timestamp: Date;
  severity: 'low' | 'medium' | 'high';
  blocked: boolean;
}
interface SecurityMetrics {
  totalRequests: number;
  blockedRequests: number;
  suspiciousActivity: number;
  rateLimitHits: number;
  uniqueIPs: number;
  lastUpdated: Date;
}
export default function SecurityDashboard() {
  const [metrics, setMetrics] = useState<SecurityMetrics>({
    totalRequests: 1247,
    blockedRequests: 23,
    suspiciousActivity: 8,
    rateLimitHits: 15,
    uniqueIPs: 342,
    lastUpdated: new Date(),
  });
  const [events, setEvents] = useState<SecurityEvent[]>([
    {
      id: '1',
      type: 'suspicious_activity',
      ip: '192.168.1.100',
      userAgent: 'sqlmap/1.6.12',
      path: '/wp-admin',
      timestamp: new Date(Date.now() - 30000),
      severity: 'high',
      blocked: true,
    },
    {
      id: '2',
      type: 'rate_limit',
      ip: '10.0.0.15',
      userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
      path: '/api/contact',
      timestamp: new Date(Date.now() - 120000),
      severity: 'medium',
      blocked: true,
    },
    {
      id: '3',
      type: 'access_denied',
      ip: '192.168.1.200',
      userAgent: 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36',
      path: '/admin/users',
      timestamp: new Date(Date.now() - 300000),
      severity: 'medium',
      blocked: true,
    },
  ]);
  const [loading, setLoading] = useState(false);
  const refreshData = async () => {
    setLoading(true);
    // Simulate API call
    setTimeout(() => {
      setMetrics(prev => ({
        ...prev,
        lastUpdated: new Date(),
      }));
      setLoading(false);
    }, 1000);
  };
  const getSeverityBadge = (severity: SecurityEvent['severity']) => {
    switch (severity) {
      case 'high':
        return <Badge className="bg-red-100 text-red-800">High</Badge>;
      case 'medium':
        return <Badge className="bg-yellow-100 text-yellow-800">Medium</Badge>;
      case 'low':
        return <Badge className="bg-green-100 text-green-800">Low</Badge>;
      default:
        return <Badge className="bg-gray-100 text-gray-800">Unknown</Badge>;
    }
  };
  const getEventTypeIcon = (type: SecurityEvent['type']) => {
    switch (type) {
      case 'suspicious_activity':
        return <AlertTriangle className="h-4 w-4 text-red-600" />;
      case 'rate_limit':
        return <Ban className="h-4 w-4 text-yellow-600" />;
      case 'auth_failure':
        return <Lock className="h-4 w-4 text-orange-600" />;
      case 'access_denied':
        return <XCircle className="h-4 w-4 text-red-600" />;
      default:
        return <Activity className="h-4 w-4 text-gray-600" />;
    }
  };
  const getEventTypeLabel = (type: SecurityEvent['type']) => {
    switch (type) {
      case 'suspicious_activity':
        return 'Suspicious Activity';
      case 'rate_limit':
        return 'Rate Limit';
      case 'auth_failure':
        return 'Auth Failure';
      case 'access_denied':
        return 'Access Denied';
      default:
        return 'Unknown';
    }
  };
  const threatLevel = metrics.blockedRequests > 50 ? 'high' : 
                    metrics.blockedRequests > 20 ? 'medium' : 'low';
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Security Dashboard</h1>
          <p className="text-gray-600">Ko Lake Villa security monitoring and threat detection</p>
        </div>
        <Button 
          onClick={refreshData} 
          disabled={loading}
          className="bg-blue-600 hover:bg-blue-700"
        >
          <RefreshCw className={`h-4 w-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
          Refresh
        </Button>
      </div>
      {/* Security Status */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Shield className="h-6 w-6 text-green-600" />
            Security Status
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <CheckCircle className="h-5 w-5 text-green-600" />
              <span className="text-sm font-medium">Systems Protected</span>
            </div>
            <div className="flex items-center gap-2">
              <div className={`w-3 h-3 rounded-full ${
                threatLevel === 'high' ? 'bg-red-500' :
                threatLevel === 'medium' ? 'bg-yellow-500' : 'bg-green-500'
              }`} />
              <span className="text-sm capitalize">Threat Level: {threatLevel}</span>
            </div>
            <div className="text-sm text-gray-500">
              Last updated: {metrics.lastUpdated.toLocaleTimeString()}
            </div>
          </div>
        </CardContent>
      </Card>
      {/* Security Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-blue-100 rounded-lg">
                <Activity className="h-5 w-5 text-blue-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Total Requests</p>
                <p className="text-2xl font-bold">{metrics.totalRequests.toLocaleString()}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-red-100 rounded-lg">
                <Ban className="h-5 w-5 text-red-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Blocked Requests</p>
                <p className="text-2xl font-bold">{metrics.blockedRequests}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-orange-100 rounded-lg">
                <AlertTriangle className="h-5 w-5 text-orange-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Suspicious Activity</p>
                <p className="text-2xl font-bold">{metrics.suspiciousActivity}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-yellow-100 rounded-lg">
                <FileX className="h-5 w-5 text-yellow-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Rate Limit Hits</p>
                <p className="text-2xl font-bold">{metrics.rateLimitHits}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-purple-100 rounded-lg">
                <Globe className="h-5 w-5 text-purple-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Unique IPs</p>
                <p className="text-2xl font-bold">{metrics.uniqueIPs}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
      {/* Recent Security Events */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Eye className="h-6 w-6 text-gray-700" />
            Recent Security Events
          </CardTitle>
          <CardDescription>
            Real-time monitoring of security threats and blocked activities
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Event Type</TableHead>
                <TableHead>IP Address</TableHead>
                <TableHead>Path</TableHead>
                <TableHead>Severity</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Time</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {events.map((event) => (
                <TableRow key={event.id}>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      {getEventTypeIcon(event.type)}
                      <span className="text-sm">{getEventTypeLabel(event.type)}</span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <code className="text-sm bg-gray-100 px-2 py-1 rounded">
                      {event.ip}
                    </code>
                  </TableCell>
                  <TableCell>
                    <code className="text-sm">{event.path}</code>
                  </TableCell>
                  <TableCell>{getSeverityBadge(event.severity)}</TableCell>
                  <TableCell>
                    {event.blocked ? (
                      <Badge className="bg-red-100 text-red-800">Blocked</Badge>
                    ) : (
                      <Badge className="bg-green-100 text-green-800">Allowed</Badge>
                    )}
                  </TableCell>
                  <TableCell>
                    <div className="text-sm text-gray-500">
                      {event.timestamp.toLocaleTimeString()}
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
          {events.length === 0 && (
            <div className="text-center py-8">
              <Shield className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-500">No security events detected. Your site is secure!</p>
            </div>
          )}
        </CardContent>
      </Card>
      {/* Security Features */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Lock className="h-6 w-6 text-green-600" />
              Active Security Features
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex items-center gap-2">
              <CheckCircle className="h-4 w-4 text-green-500" />
              <span className="text-sm">Rate Limiting Protection</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle className="h-4 w-4 text-green-500" />
              <span className="text-sm">XSS Protection Headers</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle className="h-4 w-4 text-green-500" />
              <span className="text-sm">Content Security Policy</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle className="h-4 w-4 text-green-500" />
              <span className="text-sm">CSRF Protection</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle className="h-4 w-4 text-green-500" />
              <span className="text-sm">Suspicious Activity Detection</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle className="h-4 w-4 text-green-500" />
              <span className="text-sm">HTTPS Enforcement</span>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Users className="h-6 w-6 text-blue-600" />
              User Authentication
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex items-center gap-2">
              <CheckCircle className="h-4 w-4 text-green-500" />
              <span className="text-sm">Google Sign-In Integration</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle className="h-4 w-4 text-green-500" />
              <span className="text-sm">Role-Based Access Control</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle className="h-4 w-4 text-green-500" />
              <span className="text-sm">Session Management</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle className="h-4 w-4 text-green-500" />
              <span className="text-sm">Admin Panel Protection</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle className="h-4 w-4 text-green-500" />
              <span className="text-sm">Authorized Email Whitelist</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle className="h-4 w-4 text-green-500" />
              <span className="text-sm">Audit Logging</span>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
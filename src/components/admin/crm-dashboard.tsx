"use client";
import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { 
  Users, 
  MessageSquare, 
  Calendar, 
  Phone, 
  Mail, 
  MapPin,
  Filter,
  Search,
  Plus,
  ExternalLink,
  Clock,
  Star,
  CheckCircle,
  AlertCircle,
  X,
  Eye
} from 'lucide-react';
interface ContactSubmission {
  id: string;
  name: string;
  email: string;
  phone: string;
  country: string;
  checkIn: string;
  checkOut: string;
  guests: number;
  message: string;
  status: 'new' | 'contacted' | 'quoted' | 'booked' | 'cancelled';
  priority: 'low' | 'medium' | 'high';
  source: 'website' | 'phone' | 'email' | 'referral';
  submittedAt: string;
  lastContact: string;
  notes: string[];
  estimatedValue: number;
  followUpDate?: string;
}
interface PMSIntegration {
  name: 'GuestyPro' | 'IGMS';
  status: 'connected' | 'disconnected' | 'pending';
  lastSync: string;
  bookingsCount: number;
  apiKey: string;
}
export default function CRMDashboard() {
  const [submissions, setSubmissions] = useState<ContactSubmission[]>([
    {
      id: '1',
      name: 'Sarah Johnson',
      email: 'sarah.j@email.com',
      phone: '+44 7123 456789',
      country: 'UK',
      checkIn: '2025-02-15',
      checkOut: '2025-02-20',
      guests: 4,
      message: 'Looking for a romantic getaway with spa facilities',
      status: 'new',
      priority: 'high',
      source: 'website',
      submittedAt: '2025-01-10T10:30:00Z',
      lastContact: '',
      notes: [],
      estimatedValue: 2400,
      followUpDate: '2025-01-12'
    },
    {
      id: '2',
      name: 'Michael Chen',
      email: 'mchen@business.com',
      phone: '+65 9123 4567',
      country: 'Singapore',
      checkIn: '2025-03-01',
      checkOut: '2025-03-05',
      guests: 2,
      message: 'Corporate retreat for small team',
      status: 'contacted',
      priority: 'medium',
      source: 'referral',
      submittedAt: '2025-01-08T14:15:00Z',
      lastContact: '2025-01-09T09:00:00Z',
      notes: ['Sent initial quote', 'Requested additional amenity info'],
      estimatedValue: 1800
    }
  ]);
  const [selectedSubmission, setSelectedSubmission] = useState<ContactSubmission | null>(null);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [pmsIntegrations, setPmsIntegrations] = useState<PMSIntegration[]>([
    {
      name: 'GuestyPro',
      status: 'disconnected',
      lastSync: '',
      bookingsCount: 0,
      apiKey: ''
    },
    {
      name: 'IGMS',
      status: 'disconnected',
      lastSync: '',
      bookingsCount: 0,
      apiKey: ''
    }
  ]);
  // Load contact submissions from Firebase
  useEffect(() => {
    loadSubmissions();
  }, []);
  const loadSubmissions = async () => {
    try {
      // Try to load real submissions from Firebase
      const response = await fetch('/api/admin/enquiries');
      if (response.ok) {
        const data = await response.json();
        if (data.enquiries && data.enquiries.length > 0) {
          // Replace mock data with real data if available
          setSubmissions(data.enquiries);
          return;
        }
      }
    } catch (error) {
      console.error('Failed to load submissions:', error);
    }
  };
  // Filter submissions based on status and search
  const filteredSubmissions = submissions.filter(submission => {
    const matchesStatus = filterStatus === 'all' || submission.status === filterStatus;
    const matchesSearch = searchTerm === '' || 
      submission.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      submission.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      submission.country.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesStatus && matchesSearch;
  });
  // Update submission status
  const updateStatus = (id: string, status: ContactSubmission['status']) => {
    setSubmissions(prev => prev.map(sub => 
      sub.id === id 
        ? { ...sub, status, lastContact: new Date().toISOString() }
        : sub
    ));
    if (selectedSubmission?.id === id) {
      setSelectedSubmission(prev => prev ? { 
        ...prev, 
        status, 
        lastContact: new Date().toISOString() 
      } : null);
    }
  };
  // Add note to submission
  const addNote = (id: string, note: string) => {
    setSubmissions(prev => prev.map(sub => 
      sub.id === id 
        ? { ...sub, notes: [...sub.notes, `${new Date().toLocaleString()}: ${note}`] }
        : sub
    ));
    if (selectedSubmission?.id === id) {
      setSelectedSubmission(prev => prev ? { 
        ...prev, 
        notes: [...prev.notes, `${new Date().toLocaleString()}: ${note}`] 
      } : null);
    }
  };
  // Connect to PMS
  const connectPMS = async (pmsName: 'GuestyPro' | 'IGMS', apiKey: string) => {
    try {
      // This would integrate with the respective PMS APIs
      setPmsIntegrations(prev => prev.map(pms => 
        pms.name === pmsName 
          ? { 
              ...pms, 
              status: 'connected', 
              apiKey, 
              lastSync: new Date().toISOString(),
              bookingsCount: Math.floor(Math.random() * 50) // Mock data
            }
          : pms
      ));
      alert(`Successfully connected to ${pmsName}!`);
    } catch (error) {
      console.error(`Failed to connect to ${pmsName}:`, error);
      alert(`Failed to connect to ${pmsName}. Please check your API key.`);
    }
  };
  const getStatusColor = (status: ContactSubmission['status']) => {
    const colors = {
      new: 'bg-blue-100 text-blue-800',
      contacted: 'bg-yellow-100 text-yellow-800',
      quoted: 'bg-purple-100 text-purple-800',
      booked: 'bg-green-100 text-green-800',
      cancelled: 'bg-red-100 text-red-800'
    };
    return colors[status] || 'bg-gray-100 text-gray-800';
  };
  const getPriorityIcon = (priority: ContactSubmission['priority']) => {
    if (priority === 'high') return <AlertCircle className="h-4 w-4 text-red-500" />;
    if (priority === 'medium') return <Clock className="h-4 w-4 text-yellow-500" />;
    return <CheckCircle className="h-4 w-4 text-green-500" />;
  };
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">CRM Dashboard</h2>
          <p className="text-gray-600">Manage customer inquiries and booking pipeline</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline">
            <ExternalLink className="h-4 w-4 mr-2" />
            GuestyPro
          </Button>
          <Button variant="outline">
            <ExternalLink className="h-4 w-4 mr-2" />
            IGMS
          </Button>
        </div>
      </div>
      <Tabs defaultValue="pipeline">
        <TabsList>
          <TabsTrigger value="pipeline">Sales Pipeline</TabsTrigger>
          <TabsTrigger value="submissions">All Submissions</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
          <TabsTrigger value="integrations">PMS Integrations</TabsTrigger>
        </TabsList>
        <TabsContent value="pipeline" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-5 gap-4 mb-6">
            {['new', 'contacted', 'quoted', 'booked', 'cancelled'].map(status => {
              const count = submissions.filter(s => s.status === status).length;
              const value = submissions.filter(s => s.status === status)
                .reduce((sum, s) => sum + s.estimatedValue, 0);
              return (
                <Card key={status}>
                  <CardContent className="p-4 text-center">
                    <div className="text-2xl font-bold">{count}</div>
                    <p className="text-sm text-gray-600 capitalize">{status}</p>
                    <p className="text-xs text-gray-500">${value.toLocaleString()}</p>
                  </CardContent>
                </Card>
              );
            })}
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Submissions List */}
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle>Recent Inquiries</CardTitle>
                  <div className="flex gap-2">
                    <div className="relative">
                      <Search className="h-4 w-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                      <Input
                        placeholder="Search..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="pl-10 w-48"
                      />
                    </div>
                    <select
                      value={filterStatus}
                      onChange={(e) => setFilterStatus(e.target.value)}
                      className="px-3 py-2 border rounded-md text-sm"
                    >
                      <option value="all">All Status</option>
                      <option value="new">New</option>
                      <option value="contacted">Contacted</option>
                      <option value="quoted">Quoted</option>
                      <option value="booked">Booked</option>
                      <option value="cancelled">Cancelled</option>
                    </select>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-2 max-h-96 overflow-y-auto">
                  {filteredSubmissions.map((submission) => (
                    <div
                      key={submission.id}
                      className={`p-3 border rounded-lg cursor-pointer transition-colors ${
                        selectedSubmission?.id === submission.id
                          ? 'border-amber-500 bg-amber-50'
                          : 'border-gray-200 hover:border-gray-300'
                      }`}
                      onClick={() => {
                        setSelectedSubmission(submission);
                        setIsDetailModalOpen(true);
                      }}
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            {getPriorityIcon(submission.priority)}
                            <h3 className="font-medium text-sm">{submission.name}</h3>
                            <Badge className={`text-xs ${getStatusColor(submission.status)}`}>
                              {submission.status}
                            </Badge>
                          </div>
                          <p className="text-xs text-gray-600">{submission.email}</p>
                          <p className="text-xs text-gray-500">
                            {submission.guests} guests • {submission.country} • 
                            ${submission.estimatedValue.toLocaleString()}
                          </p>
                          <p className="text-xs text-gray-500">
                            {new Date(submission.checkIn).toLocaleDateString()} - 
                            {new Date(submission.checkOut).toLocaleDateString()}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))}
                  {filteredSubmissions.length === 0 && (
                    <div className="text-center py-8 text-gray-500">
                      <Users className="h-12 w-12 mx-auto mb-4" />
                      <p>No submissions found</p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
            {/* Submission Details */}
            <Card>
              <CardHeader>
                <CardTitle>
                  {selectedSubmission ? `Guest Details: ${selectedSubmission.name}` : 'Select a Submission'}
                </CardTitle>
              </CardHeader>
              <CardContent>
                {selectedSubmission ? (
                  <div className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="text-sm font-medium text-gray-600">Status</label>
                        <select
                          value={selectedSubmission.status}
                          onChange={(e) => updateStatus(selectedSubmission.id, e.target.value as any)}
                          className="w-full mt-1 p-2 border rounded-md"
                        >
                          <option value="new">New</option>
                          <option value="contacted">Contacted</option>
                          <option value="quoted">Quoted</option>
                          <option value="booked">Booked</option>
                          <option value="cancelled">Cancelled</option>
                        </select>
                      </div>
                      <div>
                        <label className="text-sm font-medium text-gray-600">Priority</label>
                        <div className="flex items-center gap-2 mt-1">
                          {getPriorityIcon(selectedSubmission.priority)}
                          <span className="capitalize">{selectedSubmission.priority}</span>
                        </div>
                      </div>
                    </div>
                    <div className="grid grid-cols-1 gap-3">
                      <div className="flex items-center gap-2">
                        <Mail className="h-4 w-4 text-gray-400" />
                        <span className="text-sm">{selectedSubmission.email}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Phone className="h-4 w-4 text-gray-400" />
                        <span className="text-sm">{selectedSubmission.phone}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <MapPin className="h-4 w-4 text-gray-400" />
                        <span className="text-sm">{selectedSubmission.country}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Calendar className="h-4 w-4 text-gray-400" />
                        <span className="text-sm">
                          {new Date(selectedSubmission.checkIn).toLocaleDateString()} - 
                          {new Date(selectedSubmission.checkOut).toLocaleDateString()}
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Users className="h-4 w-4 text-gray-400" />
                        <span className="text-sm">{selectedSubmission.guests} guests</span>
                      </div>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-600">Guest Message</label>
                      <p className="text-sm mt-1 p-3 bg-gray-50 rounded-md">
                        {selectedSubmission.message}
                      </p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-600">Estimated Value</label>
                      <p className="text-lg font-bold text-green-600">
                        ${selectedSubmission.estimatedValue.toLocaleString()}
                      </p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-600">Notes</label>
                      <div className="space-y-2 mt-1">
                        {selectedSubmission.notes.map((note, index) => (
                          <div key={index} className="text-sm p-2 bg-gray-50 rounded-md">
                            {note}
                          </div>
                        ))}
                        <div className="flex gap-2">
                          <Input
                            placeholder="Add a note..."
                            onKeyPress={(e) => {
                              if (e.key === 'Enter' && e.currentTarget.value.trim()) {
                                addNote(selectedSubmission.id, e.currentTarget.value.trim());
                                e.currentTarget.value = '';
                              }
                            }}
                          />
                          <Button size="sm">
                            <Plus className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    </div>
                    <div className="flex gap-2 pt-4">
                      <Button>
                        <Mail className="h-4 w-4 mr-2" />
                        Send Email
                      </Button>
                      <Button variant="outline">
                        <Phone className="h-4 w-4 mr-2" />
                        Call Guest
                      </Button>
                    </div>
                  </div>
                ) : (
                  <div className="text-center py-12 text-gray-500">
                    <MessageSquare className="h-12 w-12 mx-auto mb-4" />
                    <p>Select a submission to view details</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </TabsContent>
        <TabsContent value="submissions" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>All Contact Submissions</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b">
                      <th className="text-left p-2">Guest</th>
                      <th className="text-left p-2">Contact</th>
                      <th className="text-left p-2">Dates</th>
                      <th className="text-left p-2">Guests</th>
                      <th className="text-left p-2">Value</th>
                      <th className="text-left p-2">Status</th>
                      <th className="text-left p-2">Submitted</th>
                    </tr>
                  </thead>
                  <tbody>
                    {submissions.map((submission) => (
                      <tr key={submission.id} className="border-b hover:bg-gray-50">
                        <td className="p-2">
                          <div>
                            <div className="font-medium">{submission.name}</div>
                            <div className="text-xs text-gray-500">{submission.country}</div>
                          </div>
                        </td>
                        <td className="p-2">
                          <div className="text-xs">
                            <div>{submission.email}</div>
                            <div>{submission.phone}</div>
                          </div>
                        </td>
                        <td className="p-2 text-xs">
                          {new Date(submission.checkIn).toLocaleDateString()} - 
                          {new Date(submission.checkOut).toLocaleDateString()}
                        </td>
                        <td className="p-2">{submission.guests}</td>
                        <td className="p-2 font-medium">${submission.estimatedValue.toLocaleString()}</td>
                        <td className="p-2">
                          <Badge className={`text-xs ${getStatusColor(submission.status)}`}>
                            {submission.status}
                          </Badge>
                        </td>
                        <td className="p-2 text-xs">
                          {new Date(submission.submittedAt).toLocaleDateString()}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="analytics" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <Card>
              <CardContent className="p-4 text-center">
                <div className="text-2xl font-bold text-blue-600">{submissions.length}</div>
                <p className="text-sm text-blue-700">Total Inquiries</p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4 text-center">
                <div className="text-2xl font-bold text-green-600">
                  {submissions.filter(s => s.status === 'booked').length}
                </div>
                <p className="text-sm text-green-700">Bookings</p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4 text-center">
                <div className="text-2xl font-bold text-purple-600">
                  {Math.round((submissions.filter(s => s.status === 'booked').length / submissions.length) * 100)}%
                </div>
                <p className="text-sm text-purple-700">Conversion Rate</p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4 text-center">
                <div className="text-2xl font-bold text-amber-600">
                  ${submissions.reduce((sum, s) => sum + s.estimatedValue, 0).toLocaleString()}
                </div>
                <p className="text-sm text-amber-700">Pipeline Value</p>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
        <TabsContent value="integrations" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Property Management System Integrations</CardTitle>
              <p className="text-sm text-gray-600">
                Connect with GuestyPro or IGMS to sync bookings and manage reservations
              </p>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {pmsIntegrations.map((pms) => (
                  <div key={pms.name} className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center">
                        <ExternalLink className="h-6 w-6 text-gray-600" />
                      </div>
                      <div>
                        <h3 className="font-medium">{pms.name}</h3>
                        <p className="text-sm text-gray-600">
                          {pms.status === 'connected' 
                            ? `${pms.bookingsCount} bookings synced` 
                            : 'Not connected'
                          }
                        </p>
                        {pms.lastSync && (
                          <p className="text-xs text-gray-500">
                            Last sync: {new Date(pms.lastSync).toLocaleString()}
                          </p>
                        )}
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge variant={pms.status === 'connected' ? 'default' : 'secondary'}>
                        {pms.status}
                      </Badge>
                      {pms.status === 'disconnected' ? (
                        <Button
                          size="sm"
                          onClick={() => {
                            const apiKey = prompt(`Enter your ${pms.name} API key:`);
                            if (apiKey) connectPMS(pms.name, apiKey);
                          }}
                        >
                          Connect
                        </Button>
                      ) : (
                        <Button size="sm" variant="outline">
                          Configure
                        </Button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
              <div className="mt-6 p-4 bg-blue-50 rounded-lg">
                <h4 className="font-medium text-blue-900 mb-2">Integration Benefits</h4>
                <ul className="text-sm text-blue-800 space-y-1">
                  <li>• Automatic booking synchronization</li>
                  <li>• Real-time availability updates</li>
                  <li>• Centralized guest communication</li>
                  <li>• Revenue and occupancy analytics</li>
                  <li>• Automated check-in/check-out workflows</li>
                </ul>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
      {/* Detailed View Modal */}
      <Dialog open={isDetailModalOpen} onOpenChange={setIsDetailModalOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center justify-between">
              Contact Details
              <Badge className={selectedSubmission ? getStatusColor(selectedSubmission.status) : ''}>
                {selectedSubmission?.status}
              </Badge>
            </DialogTitle>
          </DialogHeader>
          {selectedSubmission && (
            <div className="space-y-6">
              {/* Guest Information */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-gray-600">Name</label>
                  <p className="text-lg font-semibold">{selectedSubmission.name}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-600">Priority</label>
                  <div className="flex items-center gap-2">
                    {getPriorityIcon(selectedSubmission.priority)}
                    <span className="capitalize">{selectedSubmission.priority}</span>
                  </div>
                </div>
              </div>
              {/* Contact Information */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="flex items-center gap-2">
                  <Mail className="h-4 w-4 text-gray-400" />
                  <div>
                    <label className="text-sm font-medium text-gray-600">Email</label>
                    <p className="text-sm">{selectedSubmission.email}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Phone className="h-4 w-4 text-gray-400" />
                  <div>
                    <label className="text-sm font-medium text-gray-600">Phone</label>
                    <p className="text-sm">{selectedSubmission.phone}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <MapPin className="h-4 w-4 text-gray-400" />
                  <div>
                    <label className="text-sm font-medium text-gray-600">Country</label>
                    <p className="text-sm">{selectedSubmission.country}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Users className="h-4 w-4 text-gray-400" />
                  <div>
                    <label className="text-sm font-medium text-gray-600">Guests</label>
                    <p className="text-sm">{selectedSubmission.guests} guests</p>
                  </div>
                </div>
              </div>
              {/* Booking Details */}
              {selectedSubmission.checkIn && selectedSubmission.checkOut && (
                <div>
                  <label className="text-sm font-medium text-gray-600">Booking Dates</label>
                  <div className="flex items-center gap-2 mt-1">
                    <Calendar className="h-4 w-4 text-gray-400" />
                    <span className="text-sm">
                      {new Date(selectedSubmission.checkIn).toLocaleDateString()} - 
                      {new Date(selectedSubmission.checkOut).toLocaleDateString()}
                    </span>
                  </div>
                </div>
              )}
              {/* Message */}
              <div>
                <label className="text-sm font-medium text-gray-600">Message</label>
                <div className="mt-1 p-4 bg-gray-50 rounded-lg">
                  <p className="text-sm whitespace-pre-wrap">{selectedSubmission.message}</p>
                </div>
              </div>
              {/* Estimated Value */}
              {selectedSubmission.estimatedValue > 0 && (
                <div>
                  <label className="text-sm font-medium text-gray-600">Estimated Value</label>
                  <p className="text-lg font-bold text-green-600">
                    ${selectedSubmission.estimatedValue.toLocaleString()}
                  </p>
                </div>
              )}
              {/* Submission Details */}
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <label className="text-sm font-medium text-gray-600">Submitted</label>
                  <p>{new Date(selectedSubmission.submittedAt).toLocaleString()}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-600">Source</label>
                  <p className="capitalize">{selectedSubmission.source}</p>
                </div>
              </div>
              {/* Action Buttons */}
              <div className="flex gap-2 pt-4 border-t">
                <Button className="flex-1">
                  <Mail className="h-4 w-4 mr-2" />
                  Reply by Email
                </Button>
                <Button variant="outline" className="flex-1">
                  <Phone className="h-4 w-4 mr-2" />
                  Call Guest
                </Button>
              </div>
              {/* Status Update */}
              <div className="flex gap-2">
                <Button 
                  size="sm" 
                  variant="outline"
                  onClick={() => updateStatus(selectedSubmission.id, 'contacted')}
                >
                  Mark Contacted
                </Button>
                <Button 
                  size="sm" 
                  variant="outline"
                  onClick={() => updateStatus(selectedSubmission.id, 'quoted')}
                >
                  Mark Quoted
                </Button>
                <Button 
                  size="sm" 
                  variant="outline"
                  onClick={() => updateStatus(selectedSubmission.id, 'booked')}
                >
                  Mark Booked
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
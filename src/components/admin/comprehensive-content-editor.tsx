'use client';
import { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
// Label component not available, using span instead
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
// Switch component not available, using checkbox instead
import { Save, Eye, X, Settings, Star, MapPin, Phone, Mail, Globe, Users, Bed, Sparkles, Loader2, Upload, Image, Video } from 'lucide-react';
import { ObjectUploader } from "@/components/ObjectUploader";
import type { UploadResult } from '@uppy/core';
export interface ContentItem {
  id: string;
  title: string;
  type: 'hero' | 'page' | 'accommodation' | 'experience' | 'dining' | 'benefit' | 'contact' | 'testimonial' | 'gallery' | 'policy';
  status: 'draft' | 'published';
  lastModified: string;
  content: string;
  subtitle?: string;
  description?: string;
  metaTitle?: string;
  metaDescription?: string;
  keywords?: string[];
  featuredImage?: string;
  videoUrl?: string;
  gallery?: string[];
  priority?: number;
  featured?: boolean;
  category?: string;
  tags?: string[];
  maxGuests?: number;
  bedrooms?: number;
  bathrooms?: number;
  pricePerNight?: number;
  amenities?: string[];
  coordinates?: { lat: number; lng: number };
  phone?: string;
  email?: string;
  website?: string;
  rating?: number;
  totalReviews?: number;
  duration?: string;
  difficulty?: string;
  createdBy?: string;
}
const CONTENT_TYPES = [
  { value: 'hero', label: 'Hero Content' },
  { value: 'page', label: 'Page Content' },
  { value: 'accommodation', label: 'Accommodation' },
  { value: 'experience', label: 'Experience' },
  { value: 'dining', label: 'Dining' },
  { value: 'benefit', label: 'Benefit' },
  { value: 'contact', label: 'Contact' },
  { value: 'testimonial', label: 'Testimonial' },
  { value: 'gallery', label: 'Gallery' },
  { value: 'policy', label: 'Policy' }
];
interface ComprehensiveContentEditorProps {
  isOpen: boolean;
  onClose: () => void;
  item: ContentItem;
  onSave: (item: ContentItem) => Promise<void>;
}
export default function ComprehensiveContentEditor({
  isOpen,
  onClose,
  item,
  onSave
}: ComprehensiveContentEditorProps) {
  const [activeTab, setActiveTab] = useState('basic');
  const [editForm, setEditForm] = useState<ContentItem>(item);
  const [saving, setSaving] = useState(false);
  const [aiGenerating, setAiGenerating] = useState(false);
  const [aiType, setAiType] = useState<'seo' | 'content' | null>(null);
  const [uploading, setUploading] = useState(false);
  useEffect(() => {
    setEditForm(item);
  }, [item]);
  const handleSave = async () => {
    setSaving(true);
    try {
      // Add lastModified as required by interface but let API handle updatedAt
      await onSave({
        ...editForm,
        lastModified: new Date().toISOString().split('T')[0]
      });
      onClose(); // Close editor after successful save
    } finally {
      setSaving(false);
    }
  };
  const handlePreview = () => {
    // Create a preview URL based on content type
    let previewUrl = '/';
    switch (editForm.type) {
      case 'hero':
        previewUrl = '/';
        break;
      case 'page':
        if (editForm.title.toLowerCase().includes('gallery')) {
          previewUrl = '/gallery';
        } else if (editForm.title.toLowerCase().includes('accommodations')) {
          previewUrl = '/accommodations';
        } else if (editForm.title.toLowerCase().includes('contact')) {
          previewUrl = '/contact';
        } else {
          previewUrl = '/';
        }
        break;
      case 'accommodation':
        previewUrl = '/accommodations';
        break;
      case 'gallery':
        previewUrl = '/gallery';
        break;
      case 'contact':
        previewUrl = '/contact';
        break;
      case 'testimonial':
        previewUrl = '/#testimonials';
        break;
      case 'experience':
        previewUrl = '/#experiences';
        break;
      case 'dining':
        previewUrl = '/#dining';
        break;
      default:
        previewUrl = '/';
    }
    // Open preview in new tab
    const newWindow = window.open(previewUrl, '_blank');
    if (!newWindow) {
      alert('Please allow popups to preview content');
    }
  };
  const updateField = (field: keyof ContentItem, value: any) => {
    setEditForm(prev => ({
      ...prev,
      [field]: value
    }));
  };
  const toggleAmenity = (amenity: string) => {
    const current = editForm.amenities || [];
    const updated = current.includes(amenity)
      ? current.filter(a => a !== amenity)
      : [...current, amenity];
    updateField('amenities', updated);
  };
  const addKeyword = (keyword: string) => {
    if (!keyword.trim()) return;
    const current = editForm.keywords || [];
    if (!current.includes(keyword.trim())) {
      updateField('keywords', [...current, keyword.trim()]);
    }
  };
  const removeKeyword = (keyword: string) => {
    const current = editForm.keywords || [];
    updateField('keywords', current.filter(k => k !== keyword));
  };
  const generateAiContent = async (type: 'seo' | 'content') => {
    setAiGenerating(true);
    setAiType(type);
    try {
      const response = await fetch('/api/admin/ai-content-assist', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          type,
          contentType: editForm.type,
          title: editForm.title,
          content: editForm.content,
          description: editForm.description,
          currentSeo: {
            metaTitle: editForm.metaTitle,
            metaDescription: editForm.metaDescription,
            keywords: editForm.keywords
          }
        }),
      });
      if (!response.ok) {
        throw new Error('Failed to generate AI content');
      }
      const result = await response.json();
      if (type === 'seo') {
        updateField('metaTitle', result.metaTitle || editForm.metaTitle);
        updateField('metaDescription', result.metaDescription || editForm.metaDescription);
        updateField('keywords', result.keywords || editForm.keywords);
      } else if (type === 'content') {
        if (result.improvedContent) {
          updateField('content', result.improvedContent);
        }
        if (result.subtitle) {
          updateField('subtitle', result.subtitle);
        }
        if (result.description) {
          updateField('description', result.description);
        }
      }
    } catch (error) {
      console.error('AI generation error:', error);
      alert('Failed to generate AI content. Please try again.');
    } finally {
      setAiGenerating(false);
      setAiType(null);
    }
  };
  const handleGetUploadParameters = async () => {
    try {
      const response = await fetch('/api/objects/upload', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
      });
      if (!response.ok) {
        throw new Error('Failed to get upload URL');
      }
      const data = await response.json();
      return {
        method: 'PUT' as const,
        url: data.uploadURL,
      };
    } catch (error) {
      console.error('Error getting upload parameters:', error);
      throw error;
    }
  };
  const handleUploadComplete = (result: UploadResult<Record<string, unknown>, Record<string, unknown>>, type: 'featured' | 'gallery') => {
    setUploading(false);
    if (result.successful && result.successful.length > 0) {
      const uploadedFile = result.successful[0];
      const uploadURL = uploadedFile.uploadURL;
      if (uploadURL) {
        // Convert the upload URL to the object path format
        const urlParts = uploadURL.split('/');
        const objectId = urlParts[urlParts.length - 1].split('?')[0]; // Remove query params
        const objectPath = `/objects/uploads/${objectId}`;
        if (type === 'featured') {
          updateField('featuredImage', objectPath);
        } else if (type === 'gallery') {
          const currentGallery = editForm.gallery || [];
          updateField('gallery', [...currentGallery, objectPath]);
        }
      }
    }
  };
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] bg-white border border-gray-200 shadow-xl flex flex-col">
        <DialogHeader className="bg-white pb-4 border-b border-gray-200 flex-shrink-0">
          <DialogTitle className="flex items-center gap-2">
            <Settings className="h-5 w-5" />
            Edit Content - {editForm.type.charAt(0).toUpperCase() + editForm.type.slice(1)}
          </DialogTitle>
          <DialogDescription>
            Comprehensive content editing with all available fields and options
          </DialogDescription>
        </DialogHeader>
        <div className="flex-1 flex flex-col overflow-hidden">
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full flex-1 flex flex-col">
            <TabsList className="grid grid-cols-5 w-full bg-gray-100 border border-gray-200 flex-shrink-0">
              <TabsTrigger value="basic" className="data-[state=active]:bg-green-50 data-[state=active]:text-green-700">Basic</TabsTrigger>
              <TabsTrigger value="seo" className="data-[state=active]:bg-green-50 data-[state=active]:text-green-700">SEO</TabsTrigger>
              <TabsTrigger value="media" className="data-[state=active]:bg-green-50 data-[state=active]:text-green-700">Media</TabsTrigger>
              <TabsTrigger value="specific" className="data-[state=active]:bg-green-50 data-[state=active]:text-green-700">Specific</TabsTrigger>
              <TabsTrigger value="advanced" className="data-[state=active]:bg-green-50 data-[state=active]:text-green-700">Advanced</TabsTrigger>
            </TabsList>
            <div className="flex-1 overflow-y-auto bg-white p-4">
              {/* Basic Content Tab */}
              <TabsContent value="basic" className="space-y-4 mt-0">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="title" className="text-sm font-medium">Title *</label>
                    <Input
                      id="title"
                      value={editForm.title}
                      onChange={(e) => updateField('title', e.target.value)}
                      placeholder="Enter content title"
                    />
                  </div>
                  <div>
                    <label htmlFor="type" className="text-sm font-medium">Content Type</label>
                    <Select value={editForm.type} onValueChange={(value) => updateField('type', value)}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {CONTENT_TYPES.map(type => (
                          <SelectItem key={type.value} value={type.value}>
                            {type.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <div>
                  <label htmlFor="subtitle" className="text-sm font-medium">Subtitle</label>
                  <Input
                    id="subtitle"
                    value={editForm.subtitle || ''}
                    onChange={(e) => updateField('subtitle', e.target.value)}
                    placeholder="Optional subtitle"
                  />
                </div>
                <div>
                  <label htmlFor="description" className="text-sm font-medium">Description</label>
                  <Textarea
                    id="description"
                    value={editForm.description || ''}
                    onChange={(e) => updateField('description', e.target.value)}
                    placeholder="Brief description of the content"
                    rows={3}
                  />
                </div>
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <label htmlFor="content" className="text-sm font-medium">Content *</label>
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => generateAiContent('content')}
                      disabled={aiGenerating || !editForm.title}
                      className="text-xs text-green-600 border-green-200 hover:bg-green-50 hover:text-green-700"
                    >
                      {aiGenerating && aiType === 'content' ? (
                        <>
                          <Loader2 className="h-3 w-3 mr-1 animate-spin" />
                          Enhancing...
                        </>
                      ) : (
                        <>
                          <Sparkles className="h-3 w-3 mr-1" />
                          AI Enhance
                        </>
                      )}
                    </Button>
                  </div>
                  <Textarea
                    id="content"
                    value={editForm.content}
                    onChange={(e) => updateField('content', e.target.value)}
                    placeholder="Main content text"
                    rows={6}
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="status">Status</label>
                    <Select value={editForm.status} onValueChange={(value) => updateField('status', value)}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="draft">Draft</SelectItem>
                        <SelectItem value="published">Published</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <label htmlFor="priority">Priority</label>
                    <Input
                      id="priority"
                      type="number"
                      value={editForm.priority || 0}
                      onChange={(e) => updateField('priority', parseInt(e.target.value) || 0)}
                      placeholder="1-10"
                    />
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <input type="checkbox"
                    id="featured"
                    defaultChecked={editForm.featured || false}
                    onChange={(checked) => updateField('featured', checked)}
                  />
                  <label htmlFor="featured">Featured Content</label>
                </div>
              </TabsContent>
              {/* SEO Tab */}
              <TabsContent value="seo" className="space-y-4 mt-0">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <h3 className="text-lg font-medium">SEO Optimization</h3>
                    <p className="text-sm text-gray-600">Optimize your content for search engines</p>
                  </div>
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => generateAiContent('seo')}
                    disabled={aiGenerating || !editForm.title || !editForm.content}
                    className="text-sm text-green-600 border-green-200 hover:bg-green-50 hover:text-green-700"
                  >
                    {aiGenerating && aiType === 'seo' ? (
                      <>
                        <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                        Generating SEO...
                      </>
                    ) : (
                      <>
                        <Sparkles className="h-4 w-4 mr-2" />
                        AI Generate SEO
                      </>
                    )}
                  </Button>
                </div>
                <div>
                  <label htmlFor="metaTitle" className="text-sm font-medium">Meta Title</label>
                  <Input
                    id="metaTitle"
                    value={editForm.metaTitle || ''}
                    onChange={(e) => updateField('metaTitle', e.target.value)}
                    placeholder="SEO optimized title"
                  />
                </div>
                <div>
                  <label htmlFor="metaDescription">Meta Description</label>
                  <Textarea
                    id="metaDescription"
                    value={editForm.metaDescription || ''}
                    onChange={(e) => updateField('metaDescription', e.target.value)}
                    placeholder="SEO meta description (150-160 characters)"
                    rows={3}
                  />
                </div>
                <div>
                  <label className="text-sm font-medium">Keywords</label>
                  <div className="space-y-2">
                    <div className="flex flex-wrap gap-2">
                      {(editForm.keywords || []).map((keyword, index) => (
                        <Badge key={index} variant="secondary" className="cursor-pointer"
                          onClick={() => removeKeyword(keyword)}
                        >
                          {keyword} ×
                        </Badge>
                      ))}
                    </div>
                    <Input
                      placeholder="Add keyword and press Enter"
                      onKeyPress={(e) => {
                        if (e.key === 'Enter') {
                          addKeyword(e.currentTarget.value);
                          e.currentTarget.value = '';
                        }
                      }}
                    />
                  </div>
                </div>
              </TabsContent>
              {/* Media Tab */}
              <TabsContent value="media" className="space-y-6 mt-0">
                {/* Featured Image Section */}
                <div className="border border-gray-200 rounded-lg p-4 bg-gray-50">
                  <div className="flex items-center justify-between mb-3">
                    <label className="text-sm font-medium flex items-center gap-2">
                      <Image className="w-4 h-4" />
                      Featured Image
                    </label>
                    <ObjectUploader
                      maxNumberOfFiles={1}
                      maxFileSize={10485760} // 10MB
                      onGetUploadParameters={handleGetUploadParameters}
                      onComplete={(result) => handleUploadComplete(result, 'featured')}
                      buttonClassName="text-xs px-3 py-1 bg-blue-600 text-white hover:bg-blue-700"
                    >
                      <Upload className="w-3 h-3 mr-1" />
                      Upload Image
                    </ObjectUploader>
                  </div>
                  {editForm.featuredImage && (
                    <div className="mb-3">
                      <img
                        src={editForm.featuredImage}
                        alt="Featured"
                        className="w-32 h-24 object-cover rounded border"
                        onError={(e) => {
                          e.currentTarget.style.display = 'none';
                        }}
                      />
                    </div>
                  )}
                  <Input
                    value={editForm.featuredImage || ''}
                    onChange={(e) => updateField('featuredImage', e.target.value)}
                    placeholder="Or paste image URL directly"
                    className="text-xs"
                  />
                </div>
                {/* Gallery Section */}
                <div className="border border-gray-200 rounded-lg p-4 bg-gray-50">
                  <div className="flex items-center justify-between mb-3">
                    <label className="text-sm font-medium flex items-center gap-2">
                      <Video className="w-4 h-4" />
                      Gallery Images & Videos
                    </label>
                    <ObjectUploader
                      maxNumberOfFiles={5}
                      maxFileSize={50485760} // 50MB for videos
                      onGetUploadParameters={handleGetUploadParameters}
                      onComplete={(result) => handleUploadComplete(result, 'gallery')}
                      buttonClassName="text-xs px-3 py-1 bg-green-600 text-white hover:bg-green-700"
                    >
                      <Upload className="w-3 h-3 mr-1" />
                      Upload Media
                    </ObjectUploader>
                  </div>
                  {/* Gallery Preview */}
                  {editForm.gallery && editForm.gallery.length > 0 && (
                    <div className="grid grid-cols-4 gap-2 mb-3">
                      {editForm.gallery.map((url, index) => (
                        <div key={index} className="relative group">
                          <img
                            src={url}
                            alt={`Gallery ${index + 1}`}
                            className="w-full h-16 object-cover rounded border"
                            onError={(e) => {
                              // If image fails, show as video or generic file
                              e.currentTarget.outerHTML = `<div class="w-full h-16 bg-gray-200 rounded border flex items-center justify-center"><Video class="w-6 h-6 text-gray-400" /></div>`;
                            }}
                          />
                          <button
                            onClick={() => {
                              const newGallery = editForm.gallery?.filter((_, i) => i !== index);
                              updateField('gallery', newGallery || []);
                            }}
                            className="absolute -top-1 -right-1 bg-red-500 text-white rounded-full w-4 h-4 flex items-center justify-center text-xs opacity-0 group-hover:opacity-100 transition-opacity"
                          >
                            ×
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                  <Textarea
                    value={(editForm.gallery || []).join('\n')}
                    onChange={(e) => updateField('gallery', e.target.value.split('\n').filter(url => url.trim()))}
                    placeholder="Or paste media URLs, one per line"
                    rows={3}
                    className="text-xs"
                  />
                </div>
                {/* Video URL Section */}
                <div>
                  <label htmlFor="videoUrl" className="text-sm font-medium flex items-center gap-2 mb-2">
                    <Video className="w-4 h-4" />
                    Featured Video URL
                  </label>
                  <Input
                    id="videoUrl"
                    value={editForm.videoUrl || ''}
                    onChange={(e) => updateField('videoUrl', e.target.value)}
                    placeholder="YouTube, Vimeo, or direct video URL"
                  />
                </div>
              </TabsContent>
              {/* Specific Tab (content type specific fields) */}
              <TabsContent value="specific" className="space-y-4 mt-0">
                {/* Accommodation specific fields */}
                {editForm.type === 'accommodation' && (
                  <>
                    <div className="grid grid-cols-3 gap-4">
                      <div>
                        <label htmlFor="maxGuests">Max Guests</label>
                        <Input
                          id="maxGuests"
                          type="number"
                          value={editForm.maxGuests || ''}
                          onChange={(e) => updateField('maxGuests', parseInt(e.target.value) || 0)}
                        />
                      </div>
                      <div>
                        <label htmlFor="bedrooms">Bedrooms</label>
                        <Input
                          id="bedrooms"
                          type="number"
                          value={editForm.bedrooms || ''}
                          onChange={(e) => updateField('bedrooms', parseInt(e.target.value) || 0)}
                        />
                      </div>
                      <div>
                        <label htmlFor="bathrooms">Bathrooms</label>
                        <Input
                          id="bathrooms"
                          type="number"
                          value={editForm.bathrooms || ''}
                          onChange={(e) => updateField('bathrooms', parseInt(e.target.value) || 0)}
                        />
                      </div>
                    </div>
                    <div>
                      <label htmlFor="pricePerNight">Price per Night ($)</label>
                      <Input
                        id="pricePerNight"
                        type="number"
                        value={editForm.pricePerNight || ''}
                        onChange={(e) => updateField('pricePerNight', parseFloat(e.target.value) || 0)}
                      />
                    </div>
                    <div>
                      <label>Amenities</label>
                      <div className="grid grid-cols-3 gap-2 mt-2">
                        {['WiFi', 'Pool', 'Kitchen', 'Air Conditioning', 'Parking', 'Lake View', 'Garden', 'Security', 'Housekeeping'].map(amenity => (
                          <div key={amenity} className="flex items-center space-x-2">
                            <input type="checkbox"
                              id={amenity}
                              defaultChecked={(editForm.amenities || []).includes(amenity)}
                              onChange={() => toggleAmenity(amenity)}
                            />
                            <label htmlFor={amenity} className="text-sm">{amenity}</label>
                          </div>
                        ))}
                      </div>
                    </div>
                  </>
                )}
                {/* Contact specific fields */}
                {editForm.type === 'contact' && (
                  <>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label htmlFor="phone">Phone</label>
                        <Input
                          id="phone"
                          value={editForm.phone || ''}
                          onChange={(e) => updateField('phone', e.target.value)}
                          placeholder="+94 XX XXX XXXX"
                        />
                      </div>
                      <div>
                        <label htmlFor="email">Email</label>
                        <Input
                          id="email"
                          type="email"
                          value={editForm.email || ''}
                          onChange={(e) => updateField('email', e.target.value)}
                          placeholder="contact@example.com"
                        />
                      </div>
                    </div>
                    <div>
                      <label htmlFor="website">Website</label>
                      <Input
                        id="website"
                        value={editForm.website || ''}
                        onChange={(e) => updateField('website', e.target.value)}
                        placeholder="https://example.com"
                      />
                    </div>
                  </>
                )}
                {/* Testimonial specific fields */}
                {editForm.type === 'testimonial' && (
                  <>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label htmlFor="rating">Rating (1-5)</label>
                        <Input
                          id="rating"
                          type="number"
                          min="1"
                          max="5"
                          value={editForm.rating || ''}
                          onChange={(e) => updateField('rating', parseInt(e.target.value) || 5)}
                        />
                      </div>
                      <div>
                        <label htmlFor="totalReviews">Total Reviews</label>
                        <Input
                          id="totalReviews"
                          type="number"
                          value={editForm.totalReviews || ''}
                          onChange={(e) => updateField('totalReviews', parseInt(e.target.value) || 0)}
                        />
                      </div>
                    </div>
                  </>
                )}
                {/* Experience specific fields */}
                {editForm.type === 'experience' && (
                  <>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label htmlFor="duration">Duration</label>
                        <Input
                          id="duration"
                          value={editForm.duration || ''}
                          onChange={(e) => updateField('duration', e.target.value)}
                          placeholder="e.g., Half day, Full day"
                        />
                      </div>
                      <div>
                        <label htmlFor="difficulty">Difficulty</label>
                        <Select value={editForm.difficulty || ''} onValueChange={(value) => updateField('difficulty', value)}>
                          <SelectTrigger>
                            <SelectValue placeholder="Select difficulty" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="easy">Easy</SelectItem>
                            <SelectItem value="moderate">Moderate</SelectItem>
                            <SelectItem value="challenging">Challenging</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                    <div>
                      <label htmlFor="category">Category</label>
                      <Select value={editForm.category || ''} onValueChange={(value) => updateField('category', value)}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select category" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="cultural">Cultural</SelectItem>
                          <SelectItem value="adventure">Adventure</SelectItem>
                          <SelectItem value="nature">Nature</SelectItem>
                          <SelectItem value="wellness">Wellness</SelectItem>
                          <SelectItem value="dining">Dining</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </>
                )}
              </TabsContent>
              {/* Advanced Tab */}
              <TabsContent value="advanced" className="space-y-4 mt-0">
                <div>
                  <label>Tags (one per line)</label>
                  <Textarea
                    value={(editForm.tags || []).join('\n')}
                    onChange={(e) => updateField('tags', e.target.value.split('\n').filter(tag => tag.trim()))}
                    placeholder="Enter tags, one per line"
                    rows={3}
                  />
                </div>
                <div>
                  <label htmlFor="createdBy">Created By</label>
                  <Input
                    id="createdBy"
                    value={editForm.createdBy || ''}
                    onChange={(e) => updateField('createdBy', e.target.value)}
                    placeholder="Content creator"
                  />
                </div>
                <div>
                  <label htmlFor="coordinates">Coordinates</label>
                  <div className="grid grid-cols-2 gap-2">
                    <Input
                      placeholder="Latitude"
                      type="number"
                      step="any"
                      value={editForm.coordinates?.lat || ''}
                      onChange={(e) => updateField('coordinates', {
                        ...editForm.coordinates,
                        lat: parseFloat(e.target.value) || 0
                      })}
                    />
                    <Input
                      placeholder="Longitude"
                      type="number"
                      step="any"
                      value={editForm.coordinates?.lng || ''}
                      onChange={(e) => updateField('coordinates', {
                        ...editForm.coordinates,
                        lng: parseFloat(e.target.value) || 0
                      })}
                    />
                  </div>
                </div>
              </TabsContent>
            </div>
          </Tabs>
        </div>
        <DialogFooter className="flex justify-between flex-shrink-0 bg-white border-t border-gray-200 p-4">
          <Button variant="outline" onClick={onClose}>
            <X className="h-4 w-4 mr-2" />
            Cancel
          </Button>
          <div className="space-x-2">
            <Button variant="outline" onClick={handlePreview}>
              <Eye className="h-4 w-4 mr-2" />
              Preview
            </Button>
            <Button 
              onClick={handleSave} 
              disabled={saving || !editForm.title || !editForm.content}
              className="bg-green-600 hover:bg-green-700 text-white border-green-600"
            >
              {saving ? (
                <>
                  <div className="animate-spin h-4 w-4 mr-2 border-2 border-current border-t-transparent rounded-full" />
                  Saving...
                </>
              ) : (
                <>
                  <Save className="h-4 w-4 mr-2" />
                  Save Changes
                </>
              )}
            </Button>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
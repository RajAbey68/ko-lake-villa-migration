"use client";
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Wand2, 
  Loader2, 
  Copy, 
  Save, 
  RefreshCw,
  Search,
  Eye,
  FileText
} from 'lucide-react';
import { SEOMetaData } from '@/lib/openai-admin';
interface SEOMetaGeneratorProps {
  onMetaUpdate?: (meta: SEOMetaData[]) => void;
}
interface PageSEOData {
  id: string;
  pageName: string;
  pageType: string;
  content: string;
  seoMeta: SEOMetaData;
  lastUpdated: string;
  isOptimized: boolean;
}
export default function SEOMetaGenerator({ onMetaUpdate }: SEOMetaGeneratorProps) {
  const [pages, setPages] = useState<PageSEOData[]>([
    {
      id: '1',
      pageName: 'Home Page',
      pageType: 'homepage',
      content: 'Ko Lake Villa luxury lakeside accommodation in Sri Lanka offering premium rooms, dining, and experiences',
      seoMeta: {
        title: '',
        description: '',
        keywords: [],
        focusKeyword: '',
        ogTitle: '',
        ogDescription: ''
      },
      lastUpdated: '',
      isOptimized: false
    },
    {
      id: '2',
      pageName: 'Accommodation',
      pageType: 'accommodation',
      content: 'Luxury rooms and suites at Ko Lake Villa including Master Suite, Group Room, and premium amenities',
      seoMeta: {
        title: '',
        description: '',
        keywords: [],
        focusKeyword: '',
        ogTitle: '',
        ogDescription: ''
      },
      lastUpdated: '',
      isOptimized: false
    },
    {
      id: '3',
      pageName: 'Gallery',
      pageType: 'gallery',
      content: 'Photo gallery showcasing Ko Lake Villa rooms, amenities, dining, and scenic lakeside views',
      seoMeta: {
        title: '',
        description: '',
        keywords: [],
        focusKeyword: '',
        ogTitle: '',
        ogDescription: ''
      },
      lastUpdated: '',
      isOptimized: false
    },
    {
      id: '4',
      pageName: 'Experiences',
      pageType: 'experiences',
      content: 'Unique experiences at Ko Lake Villa including water sports, cultural tours, and relaxation activities',
      seoMeta: {
        title: '',
        description: '',
        keywords: [],
        focusKeyword: '',
        ogTitle: '',
        ogDescription: ''
      },
      lastUpdated: '',
      isOptimized: false
    }
  ]);
  const [selectedPage, setSelectedPage] = useState<PageSEOData | null>(pages[0]);
  const [isGenerating, setIsGenerating] = useState(false);
  const [batchGenerating, setBatchGenerating] = useState(false);
  // Generate SEO meta for single page
  const generateSEOMeta = async (pageId: string) => {
    const page = pages.find(p => p.id === pageId);
    if (!page) return;
    setIsGenerating(true);
    try {
      const response = await fetch('/api/admin/generate-seo', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          content: page.content,
          pageType: page.pageType
        })
      });
      if (!response.ok) throw new Error('SEO generation failed');
      const { seoMeta } = await response.json();
      // Update the page
      const updatedPages = pages.map(p => 
        p.id === pageId 
          ? { 
              ...p, 
              seoMeta,
              lastUpdated: new Date().toISOString(),
              isOptimized: true
            }
          : p
      );
      setPages(updatedPages);
      if (selectedPage?.id === pageId) {
        setSelectedPage({
          ...selectedPage,
          seoMeta,
          lastUpdated: new Date().toISOString(),
          isOptimized: true
        });
      }
      onMetaUpdate?.(updatedPages.map(p => p.seoMeta));
    } catch (error) {
      console.error('SEO generation error:', error);
      alert('Failed to generate SEO metadata. Please try again.');
    } finally {
      setIsGenerating(false);
    }
  };
  // Batch generate SEO for all pages
  const batchGenerateSEO = async () => {
    setBatchGenerating(true);
    try {
      const updatedPages = [...pages];
      for (const page of updatedPages) {
        const response = await fetch('/api/admin/generate-seo', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            content: page.content,
            pageType: page.pageType
          })
        });
        if (response.ok) {
          const { seoMeta } = await response.json();
          const pageIndex = updatedPages.findIndex(p => p.id === page.id);
          updatedPages[pageIndex] = {
            ...page,
            seoMeta,
            lastUpdated: new Date().toISOString(),
            isOptimized: true
          };
        }
        // Small delay between requests
        await new Promise(resolve => setTimeout(resolve, 500));
      }
      setPages(updatedPages);
      if (selectedPage) {
        const updatedSelected = updatedPages.find(p => p.id === selectedPage.id);
        if (updatedSelected) setSelectedPage(updatedSelected);
      }
      onMetaUpdate?.(updatedPages.map(p => p.seoMeta));
      alert('Successfully generated SEO metadata for all pages!');
    } catch (error) {
      console.error('Batch SEO generation error:', error);
      alert('Failed to batch generate SEO metadata. Please try again.');
    } finally {
      setBatchGenerating(false);
    }
  };
  // Update page content
  const updatePageContent = (pageId: string, field: keyof PageSEOData, value: any) => {
    const updatedPages = pages.map(p => 
      p.id === pageId ? { ...p, [field]: value } : p
    );
    setPages(updatedPages);
    if (selectedPage?.id === pageId) {
      setSelectedPage({ ...selectedPage, [field]: value });
    }
  };
  // Update SEO meta directly
  const updateSEOMeta = (field: keyof SEOMetaData, value: any) => {
    if (!selectedPage) return;
    const updatedSeoMeta = { ...selectedPage.seoMeta, [field]: value };
    const updatedPage = { ...selectedPage, seoMeta: updatedSeoMeta };
    setSelectedPage(updatedPage);
    setPages(prev => prev.map(p => 
      p.id === selectedPage.id ? updatedPage : p
    ));
  };
  // Copy to clipboard
  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    alert('Copied to clipboard!');
  };
  // Get meta tag HTML
  const getMetaTagHTML = (page: PageSEOData) => {
    const { seoMeta } = page;
    return `<!-- SEO Meta Tags for ${page.pageName} -->
<title>${seoMeta.title}</title>
<meta name="description" content="${seoMeta.description}" />
<meta name="keywords" content="${seoMeta.keywords.join(', ')}" />
<!-- Open Graph -->
<meta property="og:title" content="${seoMeta.ogTitle}" />
<meta property="og:description" content="${seoMeta.ogDescription}" />
<meta property="og:type" content="website" />
<!-- Focus Keyword: ${seoMeta.focusKeyword} -->`;
  };
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">SEO Meta Generator</h2>
          <p className="text-gray-600">AI-powered SEO optimization for all website pages</p>
        </div>
        <div className="flex gap-2">
          <Button 
            onClick={batchGenerateSEO}
            disabled={batchGenerating}
            variant="outline"
          >
            {batchGenerating ? (
              <Loader2 className="h-4 w-4 mr-2 animate-spin" />
            ) : (
              <Wand2 className="h-4 w-4 mr-2" />
            )}
            Batch Generate
          </Button>
        </div>
      </div>
      <Tabs defaultValue="generator">
        <TabsList>
          <TabsTrigger value="generator">SEO Generator</TabsTrigger>
          <TabsTrigger value="overview">Page Overview</TabsTrigger>
          <TabsTrigger value="export">Export Meta Tags</TabsTrigger>
        </TabsList>
        <TabsContent value="generator" className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Page List */}
            <Card>
              <CardHeader>
                <CardTitle>Website Pages</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {pages.map((page) => (
                    <div
                      key={page.id}
                      className={`p-3 border rounded-lg cursor-pointer transition-colors ${
                        selectedPage?.id === page.id
                          ? 'border-amber-500 bg-amber-50'
                          : 'border-gray-200 hover:border-gray-300'
                      }`}
                      onClick={() => setSelectedPage(page)}
                    >
                      <div className="flex items-center justify-between">
                        <div>
                          <h3 className="font-medium">{page.pageName}</h3>
                          <p className="text-sm text-gray-500">{page.pageType}</p>
                        </div>
                        <div className="flex items-center gap-2">
                          <Badge variant={page.isOptimized ? 'default' : 'secondary'}>
                            {page.isOptimized ? 'Optimized' : 'Pending'}
                          </Badge>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={(e) => {
                              e.stopPropagation();
                              generateSEOMeta(page.id);
                            }}
                            disabled={isGenerating}
                          >
                            {isGenerating ? (
                              <Loader2 className="h-3 w-3" />
                            ) : (
                              <Wand2 className="h-3 w-3" />
                            )}
                          </Button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
            {/* SEO Editor */}
            <Card>
              <CardHeader>
                <CardTitle>
                  {selectedPage ? `SEO: ${selectedPage.pageName}` : 'Select a Page'}
                </CardTitle>
              </CardHeader>
              <CardContent>
                {selectedPage ? (
                  <div className="space-y-4">
                    <div>
                      <label className="text-sm font-medium">Page Content</label>
                      <Textarea
                        value={selectedPage.content}
                        onChange={(e) => updatePageContent(selectedPage.id, 'content', e.target.value)}
                        placeholder="Describe the page content for AI analysis"
                        rows={3}
                      />
                    </div>
                    <div className="border-t pt-4">
                      <div className="flex items-center justify-between mb-3">
                        <h4 className="font-medium">SEO Metadata</h4>
                        <Button
                          size="sm"
                          onClick={() => generateSEOMeta(selectedPage.id)}
                          disabled={isGenerating}
                        >
                          {isGenerating ? (
                            <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                          ) : (
                            <Wand2 className="h-4 w-4 mr-2" />
                          )}
                          Generate
                        </Button>
                      </div>
                      <div className="space-y-3">
                        <div>
                          <label className="text-sm font-medium">Title (60 chars max)</label>
                          <div className="flex gap-2">
                            <Input
                              value={selectedPage.seoMeta.title}
                              onChange={(e) => updateSEOMeta('title', e.target.value)}
                              placeholder="SEO-optimized page title"
                              maxLength={60}
                            />
                            <Button 
                              size="sm" 
                              variant="outline"
                              onClick={() => copyToClipboard(selectedPage.seoMeta.title)}
                            >
                              <Copy className="h-4 w-4" />
                            </Button>
                          </div>
                          <p className="text-xs text-gray-500 mt-1">
                            {selectedPage.seoMeta.title.length}/60 characters
                          </p>
                        </div>
                        <div>
                          <label className="text-sm font-medium">Description (160 chars max)</label>
                          <div className="flex gap-2">
                            <Textarea
                              value={selectedPage.seoMeta.description}
                              onChange={(e) => updateSEOMeta('description', e.target.value)}
                              placeholder="Compelling meta description"
                              rows={2}
                              maxLength={160}
                            />
                            <Button 
                              size="sm" 
                              variant="outline"
                              onClick={() => copyToClipboard(selectedPage.seoMeta.description)}
                            >
                              <Copy className="h-4 w-4" />
                            </Button>
                          </div>
                          <p className="text-xs text-gray-500 mt-1">
                            {selectedPage.seoMeta.description.length}/160 characters
                          </p>
                        </div>
                        <div>
                          <label className="text-sm font-medium">Keywords</label>
                          <Input
                            value={selectedPage.seoMeta.keywords.join(', ')}
                            onChange={(e) => updateSEOMeta('keywords', 
                              e.target.value.split(',').map(k => k.trim()).filter(k => k)
                            )}
                            placeholder="keyword1, keyword2, keyword3"
                          />
                        </div>
                        <div>
                          <label className="text-sm font-medium">Focus Keyword</label>
                          <Input
                            value={selectedPage.seoMeta.focusKeyword}
                            onChange={(e) => updateSEOMeta('focusKeyword', e.target.value)}
                            placeholder="Primary keyword to target"
                          />
                        </div>
                        <div className="grid grid-cols-1 gap-3">
                          <div>
                            <label className="text-sm font-medium">Open Graph Title</label>
                            <Input
                              value={selectedPage.seoMeta.ogTitle}
                              onChange={(e) => updateSEOMeta('ogTitle', e.target.value)}
                              placeholder="Social media title"
                            />
                          </div>
                          <div>
                            <label className="text-sm font-medium">Open Graph Description</label>
                            <Textarea
                              value={selectedPage.seoMeta.ogDescription}
                              onChange={(e) => updateSEOMeta('ogDescription', e.target.value)}
                              placeholder="Social media description"
                              rows={2}
                            />
                          </div>
                        </div>
                      </div>
                    </div>
                    {selectedPage.lastUpdated && (
                      <div className="text-xs text-gray-500 border-t pt-3">
                        Last updated: {new Date(selectedPage.lastUpdated).toLocaleString()}
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="text-center py-12 text-gray-500">
                    <Search className="h-12 w-12 mx-auto mb-4" />
                    <p>Select a page to edit its SEO metadata</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </TabsContent>
        <TabsContent value="overview" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
            <Card>
              <CardContent className="p-4 text-center">
                <div className="text-2xl font-bold text-blue-600">{pages.length}</div>
                <p className="text-sm text-blue-700">Total Pages</p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4 text-center">
                <div className="text-2xl font-bold text-green-600">
                  {pages.filter(p => p.isOptimized).length}
                </div>
                <p className="text-sm text-green-700">Optimized</p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4 text-center">
                <div className="text-2xl font-bold text-amber-600">
                  {pages.filter(p => !p.isOptimized).length}
                </div>
                <p className="text-sm text-amber-700">Pending</p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4 text-center">
                <div className="text-2xl font-bold text-purple-600">
                  {Array.from(new Set(pages.flatMap(p => p.seoMeta.keywords))).length}
                </div>
                <p className="text-sm text-purple-700">Unique Keywords</p>
              </CardContent>
            </Card>
          </div>
          <Card>
            <CardHeader>
              <CardTitle>Page SEO Status</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {pages.map((page) => (
                  <div key={page.id} className="flex items-center justify-between p-3 border rounded-lg">
                    <div>
                      <h3 className="font-medium">{page.pageName}</h3>
                      <p className="text-sm text-gray-500">
                        Focus: {page.seoMeta.focusKeyword || 'Not set'} • 
                        Keywords: {page.seoMeta.keywords.length}
                      </p>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge variant={page.isOptimized ? 'default' : 'secondary'}>
                        {page.isOptimized ? 'Optimized' : 'Pending'}
                      </Badge>
                      <Button size="sm" variant="outline">
                        <Eye className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="export" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Export Meta Tags</CardTitle>
              <p className="text-sm text-gray-600">
                Copy HTML meta tags for implementation in your website
              </p>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {pages.filter(p => p.isOptimized).map((page) => (
                  <div key={page.id} className="border rounded-lg">
                    <div className="flex items-center justify-between p-3 border-b">
                      <h3 className="font-medium">{page.pageName}</h3>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => copyToClipboard(getMetaTagHTML(page))}
                      >
                        <Copy className="h-4 w-4 mr-2" />
                        Copy HTML
                      </Button>
                    </div>
                    <div className="p-3">
                      <pre className="text-xs bg-gray-50 p-3 rounded overflow-x-auto">
                        {getMetaTagHTML(page)}
                      </pre>
                    </div>
                  </div>
                ))}
                {pages.filter(p => p.isOptimized).length === 0 && (
                  <div className="text-center py-8 text-gray-500">
                    <FileText className="h-12 w-12 mx-auto mb-4" />
                    <p>No optimized pages to export yet</p>
                    <p className="text-sm">Generate SEO metadata first</p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
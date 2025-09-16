'use client';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Edit, Save, X } from 'lucide-react';
interface EditableSectionProps {
  sectionId: string;
  sectionType: 'text' | 'heading' | 'image' | 'contact' | 'pricing' | 'card';
  content: any;
  children: React.ReactNode;
  onSave?: (sectionId: string, content: any) => void;
  adminMode?: boolean;
}
export function EditableSection({ 
  sectionId, 
  sectionType, 
  content, 
  children, 
  onSave,
  adminMode = false 
}: EditableSectionProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [editContent, setEditContent] = useState(content);
  if (!adminMode) {
    return <>{children}</>;
  }
  const handleSave = () => {
    onSave?.(sectionId, editContent);
    setIsEditing(false);
  };
  return (
    <div className="relative group">
      {/* Edit overlay - only visible in admin mode */}
      <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity z-10">
        <Button
          size="sm"
          variant="outline"
          onClick={() => setIsEditing(true)}
          className="h-8 w-8 p-0 bg-blue-600 text-white border-blue-600 hover:bg-blue-700"
        >
          <Edit className="h-4 w-4" />
        </Button>
      </div>
      {/* Content */}
      <div className={adminMode ? 'border-2 border-transparent hover:border-blue-300 rounded-lg p-2' : ''}>
        {children}
      </div>
      {/* Edit Dialog */}
      <Dialog open={isEditing} onOpenChange={setIsEditing}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Edit {sectionType} - {sectionId}</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            {sectionType === 'text' && (
              <div>
                <Label htmlFor="text-content">Content</Label>
                <Textarea
                  id="text-content"
                  value={editContent.text || ''}
                  onChange={(e) => setEditContent({ ...editContent, text: e.target.value })}
                  rows={4}
                />
              </div>
            )}
            {sectionType === 'heading' && (
              <>
                <div>
                  <Label htmlFor="heading-title">Title</Label>
                  <Input
                    id="heading-title"
                    value={editContent.title || ''}
                    onChange={(e) => setEditContent({ ...editContent, title: e.target.value })}
                  />
                </div>
                <div>
                  <Label htmlFor="heading-subtitle">Subtitle</Label>
                  <Input
                    id="heading-subtitle"
                    value={editContent.subtitle || ''}
                    onChange={(e) => setEditContent({ ...editContent, subtitle: e.target.value })}
                  />
                </div>
              </>
            )}
            {sectionType === 'contact' && (
              <>
                <div>
                  <Label htmlFor="contact-phone">Phone</Label>
                  <Input
                    id="contact-phone"
                    value={editContent.phone || ''}
                    onChange={(e) => setEditContent({ ...editContent, phone: e.target.value })}
                  />
                </div>
                <div>
                  <Label htmlFor="contact-whatsapp">WhatsApp URL</Label>
                  <Input
                    id="contact-whatsapp"
                    value={editContent.whatsapp || ''}
                    onChange={(e) => setEditContent({ ...editContent, whatsapp: e.target.value })}
                  />
                </div>
              </>
            )}
            {sectionType === 'pricing' && (
              <>
                <div>
                  <Label htmlFor="pricing-title">Section Title</Label>
                  <Input
                    id="pricing-title"
                    value={editContent.title || ''}
                    onChange={(e) => setEditContent({ ...editContent, title: e.target.value })}
                  />
                </div>
                <div>
                  <Label htmlFor="pricing-description">Description</Label>
                  <Textarea
                    id="pricing-description"
                    value={editContent.description || ''}
                    onChange={(e) => setEditContent({ ...editContent, description: e.target.value })}
                  />
                </div>
                <div>
                  <Label htmlFor="standard-discount">Standard Discount %</Label>
                  <Input
                    id="standard-discount"
                    type="number"
                    value={editContent.standardDiscount || 10}
                    onChange={(e) => setEditContent({ ...editContent, standardDiscount: parseInt(e.target.value) })}
                  />
                </div>
                <div>
                  <Label htmlFor="lastminute-discount">Last-minute Discount %</Label>
                  <Input
                    id="lastminute-discount"
                    type="number"
                    value={editContent.lastMinuteDiscount || 25}
                    onChange={(e) => setEditContent({ ...editContent, lastMinuteDiscount: parseInt(e.target.value) })}
                  />
                </div>
              </>
            )}
            {sectionType === 'image' && (
              <>
                <div>
                  <Label htmlFor="image-src">Image URL</Label>
                  <Input
                    id="image-src"
                    value={editContent.src || ''}
                    onChange={(e) => setEditContent({ ...editContent, src: e.target.value })}
                  />
                </div>
                <div>
                  <Label htmlFor="image-alt">Alt Text</Label>
                  <Input
                    id="image-alt"
                    value={editContent.alt || ''}
                    onChange={(e) => setEditContent({ ...editContent, alt: e.target.value })}
                  />
                </div>
              </>
            )}
          </div>
          <div className="flex justify-end gap-2 mt-6">
            <Button variant="outline" onClick={() => setIsEditing(false)}>
              <X className="h-4 w-4 mr-2" />
              Cancel
            </Button>
            <Button onClick={handleSave}>
              <Save className="h-4 w-4 mr-2" />
              Save Changes
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
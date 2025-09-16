'use client';
import { useState, useEffect } from "react";
import type { ReactNode } from "react";
import Uppy from "@uppy/core";
import { DashboardModal } from "@uppy/react";
import "@uppy/core/dist/style.min.css";
import "@uppy/dashboard/dist/style.min.css";
import AwsS3 from "@uppy/aws-s3";
import type { UploadResult } from "@uppy/core";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  Upload, 
  Image as ImageIcon, 
  Video, 
  File as FileIcon,
  X,
  Eye
} from "lucide-react";
interface MediaFile {
  id: string;
  name: string;
  url: string;
  type: 'image' | 'video' | 'document';
  mimeType?: string;
  size: number;
  uploadedAt: string;
}
interface MediaUploaderProps {
  contentType?: 'cms' | 'campaign';
  contentId?: string;
  existingFiles?: MediaFile[];
  maxNumberOfFiles?: number;
  maxFileSize?: number;
  allowedTypes?: string[];
  onFilesChange?: (files: MediaFile[]) => void;
  buttonClassName?: string;
  children?: ReactNode;
}
/**
 * Media uploader component for CMS and Campaign content
 * Supports images, videos, and documents with preview functionality
 */
export function MediaUploader({
  contentType = 'cms',
  contentId,
  existingFiles = [],
  maxNumberOfFiles = 100,
  maxFileSize = 52428800, // 50MB default
  allowedTypes = ['.jpg', '.jpeg', '.png', '.gif', '.webp', '.mp4', '.mov', '.avi', '.pdf', '.doc', '.docx'],
  onFilesChange,
  buttonClassName,
  children
}: MediaUploaderProps) {
  const [showModal, setShowModal] = useState(false);
  const [uploadedFiles, setUploadedFiles] = useState<MediaFile[]>(existingFiles);
  const [previewFile, setPreviewFile] = useState<MediaFile | null>(null);
  // Update uploaded files when existingFiles prop changes
  useEffect(() => {
    setUploadedFiles(existingFiles);
  }, [existingFiles]);
  const [uppy] = useState(() =>
    new Uppy({
      restrictions: {
        maxNumberOfFiles: 100,
        maxFileSize,
        allowedFileTypes: allowedTypes,
      },
      autoProceed: false,
    })
      .use(AwsS3, {
        shouldUseMultipart: false,
        getUploadParameters: async (file) => {
          // Get upload URL for specific content folder
          const folder = contentType === 'cms' ? `cms/${contentId || 'general'}` : `campaigns/${contentId || 'general'}`;
          const response = await fetch('/api/admin/media/upload', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ 
              folder,
              fileName: file.name,
              contentType: file.type 
            })
          });
          if (!response.ok) {
            throw new Error('Failed to get upload URL');
          }
          const { uploadURL } = await response.json();
          return {
            method: 'PUT',
            url: uploadURL,
            headers: {
              'Content-Type': file.type,
            }
          };
        },
      })
      .on("complete", (result) => {
        if (result.successful && result.successful.length > 0) {
          const newFiles: MediaFile[] = result.successful.map((file) => ({
            id: Date.now().toString() + Math.random().toString(36).substr(2, 9),
            name: file.name || 'Untitled',
            url: file.uploadURL || '',
            type: getFileType(file.type || ''),
            mimeType: file.type || 'image/jpeg',
            size: file.size || 0,
            uploadedAt: new Date().toISOString()
          }));
          const updatedFiles = [...uploadedFiles, ...newFiles];
          setUploadedFiles(updatedFiles);
          onFilesChange?.(updatedFiles);
          // Save file association to database
          saveFileAssociation(newFiles);
        }
        setShowModal(false);
      })
  );
  const getFileType = (mimeType: string): 'image' | 'video' | 'document' => {
    if (mimeType.startsWith('image/')) return 'image';
    if (mimeType.startsWith('video/')) return 'video';
    return 'document';
  };
  const saveFileAssociation = async (files: MediaFile[]) => {
    try {
      await fetch('/api/admin/media/associate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contentType,
          contentId,
          files
        })
      });
    } catch (error) {
      console.error('Failed to save file association:', error);
    }
  };
  const removeFile = async (fileId: string) => {
    const updatedFiles = uploadedFiles.filter(f => f.id !== fileId);
    setUploadedFiles(updatedFiles);
    onFilesChange?.(updatedFiles);
    // Remove from database
    try {
      await fetch('/api/admin/media/remove', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ fileId, contentType, contentId })
      });
    } catch (error) {
      console.error('Failed to remove file:', error);
    }
  };
  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };
  const getFileIcon = (type: string) => {
    switch (type) {
      case 'image': return <ImageIcon className="h-4 w-4" />;
      case 'video': return <Video className="h-4 w-4" />;
      default: return <FileIcon className="h-4 w-4" />;
    }
  };
  const getFileTypeColor = (type: string) => {
    switch (type) {
      case 'image': return 'bg-blue-100 text-blue-700 border-blue-200';
      case 'video': return 'bg-purple-100 text-purple-700 border-purple-200';
      default: return 'bg-gray-100 text-gray-700 border-gray-200';
    }
  };
  return (
    <div className="space-y-4">
      {/* Upload Button */}
      <div className="flex gap-2">
        <Button 
          onClick={() => setShowModal(true)} 
          className={buttonClassName}
          variant="outline"
        >
          <Upload className="h-4 w-4 mr-2" />
          {children || 'Upload Media'}
        </Button>
        <div className="flex items-center text-sm text-gray-600">
          <span>{uploadedFiles.length} files uploaded</span>
          {maxNumberOfFiles && (
            <span className="text-gray-400 ml-1">/ {maxNumberOfFiles} max</span>
          )}
        </div>
      </div>
      {/* Uploaded Files Grid */}
      {uploadedFiles.length > 0 && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {uploadedFiles.map((file) => (
            <Card key={file.id} className="relative group hover:shadow-md transition-shadow">
              <CardContent className="p-3">
                <div className="flex items-start justify-between mb-2">
                  <div className="flex items-center gap-2 flex-1 min-w-0">
                    {getFileIcon(file.type)}
                    <span className="text-sm font-medium truncate" title={file.name}>
                      {file.name}
                    </span>
                  </div>
                  <button
                    onClick={() => removeFile(file.id)}
                    className="opacity-0 group-hover:opacity-100 transition-opacity p-1 hover:bg-red-100 rounded"
                    title="Remove file"
                  >
                    <X className="h-3 w-3 text-red-600" />
                  </button>
                </div>
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-xs text-gray-600">
                    <Badge variant="outline" className={getFileTypeColor(file.type)}>
                      {file.type}
                    </Badge>
                    <span>{formatFileSize(file.size)}</span>
                  </div>
                  {/* Preview for images */}
                  {file.type === 'image' && file.url && (
                    <div className="relative">
                      <img 
                        src={file.url} 
                        alt={file.name}
                        className="w-full h-20 object-cover rounded border cursor-pointer"
                        onClick={() => setPreviewFile(file)}
                      />
                      <button
                        onClick={() => setPreviewFile(file)}
                        className="absolute inset-0 bg-black bg-opacity-0 hover:bg-opacity-30 transition-all rounded flex items-center justify-center"
                      >
                        <Eye className="h-4 w-4 text-white opacity-0 hover:opacity-100 transition-opacity" />
                      </button>
                    </div>
                  )}
                  <div className="text-xs text-gray-500">
                    Uploaded: {new Date(file.uploadedAt).toLocaleDateString()}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
      {/* Upload Modal */}
      <DashboardModal
        uppy={uppy}
        open={showModal}
        onRequestClose={() => setShowModal(false)}
        proudlyDisplayPoweredByUppy={false}
        note={`Max file size: ${formatFileSize(maxFileSize)}. Allowed: ${allowedTypes.join(', ')}`}
      />
      {/* Preview Modal */}
      {previewFile && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4"
          onClick={() => setPreviewFile(null)}
        >
          <div className="relative max-w-4xl max-h-full">
            <button
              onClick={() => setPreviewFile(null)}
              className="absolute -top-10 right-0 text-white hover:text-gray-300"
            >
              <X className="h-6 w-6" />
            </button>
            {previewFile.type === 'image' ? (
              <img 
                src={previewFile.url} 
                alt={previewFile.name}
                className="max-w-full max-h-full object-contain"
              />
            ) : (
              <div className="bg-white p-8 rounded-lg text-center">
                <p className="text-lg font-medium">{previewFile.name}</p>
                <p className="text-gray-600 mt-2">Preview not available for this file type</p>
                <Button 
                  className="mt-4"
                  onClick={() => window.open(previewFile.url, '_blank')}
                >
                  Open File
                </Button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
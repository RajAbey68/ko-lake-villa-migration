'use client';
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Upload, Folder, Image as ImageIcon } from "lucide-react";
interface PublicMediaUploaderProps {
  targetFolder: string; // e.g., "images/gallery", "images/rooms"
  onUploadComplete?: (files: string[]) => void;
}
export function PublicMediaUploader({ targetFolder, onUploadComplete }: PublicMediaUploaderProps) {
  const [uploading, setUploading] = useState(false);
  const [uploadedFiles, setUploadedFiles] = useState<string[]>([]);
  const handleFileUpload = async (files: FileList) => {
    if (!files.length) return;
    setUploading(true);
    const uploadedPaths: string[] = [];
    try {
      for (const file of Array.from(files)) {
        const formData = new FormData();
        formData.append('file', file);
        formData.append('folder', targetFolder);
        const response = await fetch('/api/admin/upload-public', {
          method: 'POST',
          body: formData
        });
        if (response.ok) {
          const { filePath } = await response.json();
          uploadedPaths.push(filePath);
        }
      }
      setUploadedFiles(prev => [...prev, ...uploadedPaths]);
      onUploadComplete?.(uploadedPaths);
    } catch (error) {
      console.error('Upload failed:', error);
      alert('Some uploads failed. Please try again.');
    } finally {
      setUploading(false);
    }
  };
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Folder className="h-5 w-5" />
          Upload to Public Folder: {targetFolder}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
          <ImageIcon className="h-12 w-12 mx-auto text-gray-400 mb-4" />
          <p className="text-lg font-medium">Drop images here or click to upload</p>
          <p className="text-gray-500">Select up to 30 images</p>
          <input
            type="file"
            multiple
            accept="image/*"
            className="hidden"
            id="file-input"
            onChange={(e) => e.target.files && handleFileUpload(e.target.files)}
          />
          <Button
            className="mt-4"
            onClick={() => document.getElementById('file-input')?.click()}
            disabled={uploading}
          >
            <Upload className="h-4 w-4 mr-2" />
            {uploading ? 'Uploading...' : 'Select Images'}
          </Button>
        </div>
        {uploadedFiles.length > 0 && (
          <div className="mt-4">
            <p className="font-medium">Uploaded {uploadedFiles.length} files:</p>
            <div className="max-h-32 overflow-y-auto bg-gray-50 rounded p-2 text-sm">
              {uploadedFiles.map((file, index) => (
                <div key={index} className="text-gray-700">{file}</div>
              ))}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

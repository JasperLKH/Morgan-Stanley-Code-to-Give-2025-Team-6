import React, { useState, useRef, useCallback } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Progress } from '../ui/progress';
import { Badge } from '../ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '../ui/dialog';
import { useParentContext, FileUpload } from '../contexts/ParentContext';
import { 
  Upload,
  X,
  File,
  Image,
  FileText,
  Video,
  Eye,
  Trash2,
  Camera,
  Paperclip,
  CheckCircle,
  AlertCircle
} from 'lucide-react';

interface MultiFileUploadProps {
  assignmentId: string;
  onFilesChange: (files: FileUpload[]) => void;
  maxFiles?: number;
  maxSizePerFile?: number; // in MB
  allowedTypes?: string[];
}

export function MultiFileUpload({ 
  assignmentId, 
  onFilesChange, 
  maxFiles = 5,
  maxSizePerFile = 10,
  allowedTypes = ['image/*', 'application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document', 'video/*']
}: MultiFileUploadProps) {
  const { t } = useParentContext();
  const [files, setFiles] = useState<FileUpload[]>([]);
  const [dragActive, setDragActive] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState<{ [key: string]: number }>({});
  const [previewFile, setPreviewFile] = useState<FileUpload | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const getFileIcon = (type: string) => {
    if (type.startsWith('image/')) return Image;
    if (type.startsWith('video/')) return Video;
    if (type.includes('pdf')) return FileText;
    if (type.includes('word') || type.includes('document')) return FileText;
    return File;
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const validateFile = (file: File): string | null => {
    // Check file size
    if (file.size > maxSizePerFile * 1024 * 1024) {
      return t('upload.errorSize', `File size must be less than ${maxSizePerFile}MB`);
    }

    // Check file type
    const isAllowedType = allowedTypes.some(type => {
      if (type.endsWith('/*')) {
        return file.type.startsWith(type.slice(0, -1));
      }
      return file.type === type;
    });

    if (!isAllowedType) {
      return t('upload.errorType', 'File type not supported');
    }

    return null;
  };

  const processFiles = useCallback(async (fileList: File[]) => {
    if (files.length + fileList.length > maxFiles) {
      alert(t('upload.errorMaxFiles', `Maximum ${maxFiles} files allowed`));
      return;
    }

    setUploading(true);
    const newFiles: FileUpload[] = [];

    for (const file of fileList) {
      const error = validateFile(file);
      if (error) {
        alert(`${file.name}: ${error}`);
        continue;
      }

      const fileId = `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
      
      // Create file preview/thumbnail
      let thumbnail: string | undefined;
      if (file.type.startsWith('image/')) {
        thumbnail = URL.createObjectURL(file);
      }

      const fileUpload: FileUpload = {
        id: fileId,
        name: file.name,
        type: file.type,
        size: file.size,
        url: URL.createObjectURL(file), // Temporary URL for preview
        thumbnail,
      };

      newFiles.push(fileUpload);

      // Simulate upload progress
      setUploadProgress(prev => ({ ...prev, [fileId]: 0 }));
      
      // Mock upload simulation
      for (let progress = 0; progress <= 100; progress += 10) {
        await new Promise(resolve => setTimeout(resolve, 100));
        setUploadProgress(prev => ({ ...prev, [fileId]: progress }));
      }
    }

    const updatedFiles = [...files, ...newFiles];
    setFiles(updatedFiles);
    onFilesChange(updatedFiles);
    setUploading(false);
  }, [files, maxFiles, maxSizePerFile, onFilesChange, t]);

  const handleDrag = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const fileList = Array.from(e.dataTransfer.files);
      processFiles(fileList);
    }
  }, [processFiles]);

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const fileList = Array.from(e.target.files);
      processFiles(fileList);
    }
  };

  const removeFile = (fileId: string) => {
    const updatedFiles = files.filter(f => f.id !== fileId);
    setFiles(updatedFiles);
    onFilesChange(updatedFiles);
    
    // Clean up progress tracking
    setUploadProgress(prev => {
      const { [fileId]: removed, ...rest } = prev;
      return rest;
    });
  };

  const openFileSelector = () => {
    fileInputRef.current?.click();
  };

  const FilePreviewDialog = ({ file }: { file: FileUpload }) => (
    <DialogContent className="max-w-4xl max-h-[90vh] overflow-auto">
      <DialogHeader>
        <DialogTitle className="flex items-center space-x-2">
          <File className="w-5 h-5" />
          <span>{file.name}</span>
        </DialogTitle>
      </DialogHeader>
      <div className="flex flex-col items-center space-y-4">
        {file.type.startsWith('image/') && (
          <img 
            src={file.url} 
            alt={file.name}
            className="max-w-full max-h-96 object-contain rounded-lg"
          />
        )}
        {file.type.startsWith('video/') && (
          <video 
            src={file.url} 
            controls 
            className="max-w-full max-h-96 rounded-lg"
          />
        )}
        {!file.type.startsWith('image/') && !file.type.startsWith('video/') && (
          <div className="flex flex-col items-center space-y-4 p-8">
            <File className="w-16 h-16 text-gray-400" />
            <p className="text-gray-600">{t('upload.previewNotAvailable', 'Preview not available for this file type')}</p>
          </div>
        )}
        <div className="text-sm text-gray-500">
          <p>{t('upload.fileSize', 'Size')}: {formatFileSize(file.size)}</p>
          <p>{t('upload.fileType', 'Type')}: {file.type}</p>
        </div>
      </div>
    </DialogContent>
  );

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <Paperclip className="w-5 h-5" />
          <span>{t('upload.attachFiles', 'Attach Files')}</span>
          <Badge variant="secondary">{files.length}/{maxFiles}</Badge>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Upload Area */}
        <div
          onDragEnter={handleDrag}
          onDragLeave={handleDrag}
          onDragOver={handleDrag}
          onDrop={handleDrop}
          className={`relative border-2 border-dashed rounded-lg p-6 text-center transition-colors ${
            dragActive 
              ? 'border-blue-500 bg-blue-50' 
              : 'border-gray-300 hover:border-gray-400'
          }`}
        >
          <input
            ref={fileInputRef}
            type="file"
            multiple
            accept={allowedTypes.join(',')}
            onChange={handleFileInput}
            className="hidden"
          />
          
          <div className="space-y-4">
            <div className="flex justify-center space-x-4">
              <Upload className="w-8 h-8 text-gray-400" />
            </div>
            
            <div>
              <p className="text-gray-700 mb-2">
                {t('upload.dragDrop', 'Drag and drop files here')}
              </p>
              <p className="text-sm text-gray-500 mb-4">
                {t('upload.or', 'or')}
              </p>
              
              <div className="flex flex-wrap justify-center gap-2">
                <Button 
                  type="button"
                  variant="outline" 
                  onClick={openFileSelector}
                  className="flex-1 max-w-40"
                >
                  <Upload className="w-4 h-4 mr-2" />
                  {t('upload.selectFiles', 'Select Files')}
                </Button>
                
                <Button 
                  type="button"
                  variant="outline"
                  onClick={() => {
                    // In a real app, this would open camera
                    console.log('Open camera');
                  }}
                  className="flex-1 max-w-40"
                >
                  <Camera className="w-4 h-4 mr-2" />
                  {t('upload.takePhoto', 'Take Photo')}
                </Button>
              </div>
            </div>
            
            <div className="text-xs text-gray-500 space-y-1">
              <p>{t('upload.supportedFormats', 'Supported formats: Images, PDF, Word, Video')}</p>
              <p>{t('upload.maxSize', `Max file size: ${maxSizePerFile}MB`)}</p>
            </div>
          </div>
        </div>

        {/* File List */}
        {files.length > 0 && (
          <div className="space-y-2">
            <h4 className="text-sm text-gray-700">{t('upload.attachedFiles', 'Attached Files')}</h4>
            {files.map((file) => {
              const Icon = getFileIcon(file.type);
              const progress = uploadProgress[file.id];
              const isUploading = progress !== undefined && progress < 100;
              
              return (
                <div key={file.id} className="flex items-center space-x-3 p-3 border rounded-lg bg-gray-50">
                  {/* File Icon/Thumbnail */}
                  <div className="flex-shrink-0 w-10 h-10 relative">
                    {file.thumbnail ? (
                      <img 
                        src={file.thumbnail} 
                        alt={file.name}
                        className="w-10 h-10 object-cover rounded"
                      />
                    ) : (
                      <div className="w-10 h-10 bg-gray-200 rounded flex items-center justify-center">
                        <Icon className="w-5 h-5 text-gray-500" />
                      </div>
                    )}
                    
                    {isUploading && (
                      <div className="absolute inset-0 bg-black/50 rounded flex items-center justify-center">
                        <div className="text-white text-xs">{progress}%</div>
                      </div>
                    )}
                  </div>

                  {/* File Info */}
                  <div className="flex-1 min-w-0">
                    <p className="text-sm text-gray-900 truncate">{file.name}</p>
                    <div className="flex items-center space-x-2 text-xs text-gray-500">
                      <span>{formatFileSize(file.size)}</span>
                      {isUploading ? (
                        <Badge variant="secondary" className="bg-blue-100 text-blue-800">
                          {t('upload.uploading', 'Uploading...')}
                        </Badge>
                      ) : (
                        <Badge variant="secondary" className="bg-green-100 text-green-800">
                          <CheckCircle className="w-3 h-3 mr-1" />
                          {t('upload.uploaded', 'Uploaded')}
                        </Badge>
                      )}
                    </div>
                    
                    {isUploading && (
                      <Progress value={progress} className="h-1 mt-1" />
                    )}
                  </div>

                  {/* Actions */}
                  <div className="flex space-x-1">
                    <Dialog>
                      <DialogTrigger asChild>
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          onClick={() => setPreviewFile(file)}
                        >
                          <Eye className="w-4 h-4" />
                        </Button>
                      </DialogTrigger>
                      <FilePreviewDialog file={file} />
                    </Dialog>
                    
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={() => removeFile(file.id)}
                      className="text-red-600 hover:text-red-700"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* Upload Status */}
        {uploading && (
          <div className="flex items-center space-x-2 text-sm text-blue-600">
            <div className="animate-spin w-4 h-4 border-2 border-blue-600 border-t-transparent rounded-full" />
            <span>{t('upload.processing', 'Processing files...')}</span>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
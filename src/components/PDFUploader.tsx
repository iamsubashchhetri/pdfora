
import React, { useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FileUp, File, X, Check } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';

interface PDFUploaderProps {
  onFileUpload: (file: File) => void;
}

const PDFUploader: React.FC<PDFUploaderProps> = ({ onFileUpload }) => {
  const [isDragging, setIsDragging] = useState(false);
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const { toast } = useToast();

  const handleDragEnter = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  }, []);

  const handleDragOver = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
  }, []);

  const handleDrop = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
    
    const files = e.dataTransfer.files;
    handleFiles(files);
  }, []);

  const handleFileInput = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      handleFiles(e.target.files);
    }
  }, []);

  const handleFiles = (files: FileList) => {
    if (files.length === 0) return;

    const file = files[0];
    if (file.type !== 'application/pdf') {
      toast({
        title: "Invalid file type",
        description: "Please upload a PDF file",
        variant: "destructive",
      });
      return;
    }

    setUploadedFile(file);
    onFileUpload(file);

    toast({
      title: "PDF uploaded successfully",
      description: `${file.name} is ready for editing`,
    });
  };

  const clearFile = () => {
    setUploadedFile(null);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.1, duration: 0.5 }}
      className="w-full max-w-xl mx-auto mb-8"
    >
      <AnimatePresence mode="wait">
        {!uploadedFile ? (
          <motion.div 
            key="dropzone"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className={`drop-zone border-2 border-dashed rounded-xl p-8 flex flex-col items-center justify-center gap-4 text-center transition-all cursor-pointer ${
              isDragging ? 'border-black bg-gray-50' : 'border-gray-300'
            }`}
            onDragEnter={handleDragEnter}
            onDragLeave={handleDragLeave}
            onDragOver={handleDragOver}
            onDrop={handleDrop}
            onClick={() => document.getElementById('file-input')?.click()}
          >
            <motion.div 
              className="w-16 h-16 rounded-full bg-gray-50 flex items-center justify-center"
              animate={{ scale: isDragging ? 1.1 : 1 }}
              transition={{ duration: 0.2 }}
            >
              <FileUp size={28} className="text-gray-400" />
            </motion.div>
            
            <div>
              <h3 className="text-lg font-medium mb-2">Upload a PDF file</h3>
              <p className="text-gray-500 text-sm mb-4">
                Drag and drop your file here, or click to browse
              </p>
              <p className="text-xs text-gray-400">
                Files should be in PDF format
              </p>
            </div>
            
            <input 
              id="file-input" 
              type="file" 
              accept="application/pdf" 
              onChange={handleFileInput} 
              className="hidden" 
            />
          </motion.div>
        ) : (
          <motion.div 
            key="file-preview"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="glass p-6 rounded-xl flex items-center justify-between"
          >
            <div className="flex items-center">
              <div className="w-12 h-12 rounded-lg bg-gray-100 flex items-center justify-center mr-4">
                <File size={24} className="text-gray-700" />
              </div>
              <div>
                <h3 className="text-sm font-medium text-gray-900 mb-1 truncate max-w-[180px] sm:max-w-xs">
                  {uploadedFile.name}
                </h3>
                <p className="text-xs text-gray-500">
                  {(uploadedFile.size / 1024 / 1024).toFixed(2)} MB
                </p>
              </div>
            </div>
            
            <div className="flex items-center gap-2">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center text-gray-600 hover:bg-gray-200 transition-colors"
                onClick={(e) => {
                  e.stopPropagation();
                  clearFile();
                }}
              >
                <X size={16} />
              </motion.button>
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="w-8 h-8 rounded-full bg-black flex items-center justify-center text-white"
              >
                <Check size={16} />
              </motion.div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

export default PDFUploader;

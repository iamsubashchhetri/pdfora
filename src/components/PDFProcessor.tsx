
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Sparkles } from 'lucide-react';
import PDFUploader from './PDFUploader';
import PromptInput from './PromptInput';
import PDFPreview from './PDFPreview';
import { createPdfUrl, revokePdfUrl, processPdf } from '@/lib/pdfUtils';

const PDFProcessor: React.FC = () => {
  const [file, setFile] = useState<File | null>(null);
  const [pdfUrl, setPdfUrl] = useState<string | null>(null);
  const [processedPdfUrl, setProcessedPdfUrl] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  
  // Clean up URLs when component unmounts
  useEffect(() => {
    return () => {
      if (pdfUrl) revokePdfUrl(pdfUrl);
      if (processedPdfUrl) revokePdfUrl(processedPdfUrl);
    };
  }, [pdfUrl, processedPdfUrl]);
  
  const handleFileUpload = (file: File) => {
    // Revoke previous URLs
    if (pdfUrl) revokePdfUrl(pdfUrl);
    if (processedPdfUrl) revokePdfUrl(processedPdfUrl);
    
    setFile(file);
    setPdfUrl(createPdfUrl(file));
    setProcessedPdfUrl(null);
  };
  
  const handlePromptSubmit = async (prompt: string) => {
    if (!file) return;
    
    await processPdf(
      file,
      prompt,
      setIsProcessing,
      setProcessedPdfUrl
    );
  };
  
  return (
    <div className="w-full max-w-6xl mx-auto px-4 py-8">
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="text-center mb-12"
      >
        <motion.div 
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 0.2, duration: 0.5 }}
          className="inline-flex items-center gap-2 px-4 py-1 rounded-full bg-gray-100 text-gray-700 text-sm font-medium mb-4"
        >
          <Sparkles size={14} className="text-gray-600" />
          <span>AI-Powered PDF Editor</span>
        </motion.div>
        
        <motion.h1 
          className="text-4xl font-bold mb-4"
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.3, duration: 0.5 }}
        >
          Edit PDFs with Natural Language
        </motion.h1>
        
        <motion.p 
          className="text-gray-600 max-w-2xl mx-auto"
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.4, duration: 0.5 }}
        >
          Upload a PDF, describe what you want to change in plain language, 
          and our AI will instantly update your document.
        </motion.p>
      </motion.div>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="space-y-8">
          <PDFUploader onFileUpload={handleFileUpload} />
          
          <PromptInput 
            onSubmit={handlePromptSubmit} 
            isProcessing={isProcessing}
            disabled={!file}
          />
        </div>
        
        <div>
          {file && (
            <PDFPreview 
              pdfUrl={pdfUrl} 
              processedPdfUrl={processedPdfUrl}
              fileName={file.name}
              isProcessing={isProcessing}
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default PDFProcessor;

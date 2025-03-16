
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Download, Maximize2, Minimize2, ArrowLeft, ArrowRight } from 'lucide-react';

interface PDFPreviewProps {
  pdfUrl: string | null;
  processedPdfUrl: string | null;
  fileName: string;
  isProcessing: boolean;
}

const PDFPreview: React.FC<PDFPreviewProps> = ({ 
  pdfUrl, 
  processedPdfUrl, 
  fileName,
  isProcessing 
}) => {
  const [fullScreen, setFullScreen] = useState(false);
  const [showProcessed, setShowProcessed] = useState(false);
  const [pageTransition, setPageTransition] = useState(false);
  
  // When processed PDF is available, trigger animation and show it
  useEffect(() => {
    if (processedPdfUrl && !showProcessed) {
      setPageTransition(true);
      const timer = setTimeout(() => {
        setShowProcessed(true);
        setPageTransition(false);
      }, 500);
      
      return () => clearTimeout(timer);
    }
  }, [processedPdfUrl]);
  
  const toggleFullScreen = () => {
    setFullScreen(!fullScreen);
  };
  
  const toggleView = () => {
    setPageTransition(true);
    setTimeout(() => {
      setShowProcessed(!showProcessed);
      setPageTransition(false);
    }, 500);
  };
  
  if (!pdfUrl) return null;
  
  const displayUrl = showProcessed && processedPdfUrl ? processedPdfUrl : pdfUrl;
  const displayName = showProcessed && processedPdfUrl 
    ? `${fileName.replace('.pdf', '')} (Edited).pdf` 
    : fileName;
  
  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ 
          opacity: 1, 
          scale: 1,
          height: fullScreen ? 'calc(100vh - 80px)' : '500px',
          width: fullScreen ? '100%' : '100%',
          position: fullScreen ? 'fixed' : 'relative',
          top: fullScreen ? '60px' : 'auto',
          left: fullScreen ? 0 : 'auto',
          zIndex: fullScreen ? 50 : 'auto',
        }}
        exit={{ opacity: 0, scale: 0.9 }}
        transition={{ duration: 0.3 }}
        className="w-full max-w-4xl mx-auto rounded-xl overflow-hidden shadow-lg bg-white"
      >
        <div className="border-b border-gray-100 p-3 flex justify-between items-center bg-gray-50">
          <h3 className="text-sm font-medium truncate max-w-[200px] sm:max-w-md">
            {displayName}
          </h3>
          <div className="flex items-center gap-2">
            {processedPdfUrl && (
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={toggleView}
                className="text-xs py-1 px-3 bg-gray-200 text-gray-700 rounded-full hover:bg-gray-300 transition-colors flex items-center gap-1"
                disabled={isProcessing}
              >
                {showProcessed ? (
                  <>
                    <ArrowLeft size={12} />
                    <span>Original</span>
                  </>
                ) : (
                  <>
                    <span>Edited</span>
                    <ArrowRight size={12} />
                  </>
                )}
              </motion.button>
            )}
            
            {showProcessed && processedPdfUrl && (
              <motion.a
                href={processedPdfUrl}
                download={`${fileName.replace('.pdf', '')}_edited.pdf`}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center text-gray-700 hover:bg-gray-300 transition-colors"
              >
                <Download size={14} />
              </motion.a>
            )}
            
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={toggleFullScreen}
              className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center text-gray-700 hover:bg-gray-300 transition-colors"
            >
              {fullScreen ? <Minimize2 size={14} /> : <Maximize2 size={14} />}
            </motion.button>
          </div>
        </div>
        
        <div className="relative overflow-hidden" style={{ height: 'calc(100% - 49px)' }}>
          <motion.iframe
            src={displayUrl}
            className={`w-full h-full border-0 ${pageTransition ? 'page-turn' : ''}`}
            title="PDF Preview"
          />
          
          {isProcessing && (
            <div className="absolute inset-0 bg-white/80 backdrop-blur-sm flex flex-col items-center justify-center">
              <div className="flex space-x-2 mb-4">
                <div className="w-3 h-3 bg-gray-400 rounded-full animate-pulse"></div>
                <div className="w-3 h-3 bg-gray-400 rounded-full animate-pulse" style={{ animationDelay: '0.2s' }}></div>
                <div className="w-3 h-3 bg-gray-400 rounded-full animate-pulse" style={{ animationDelay: '0.4s' }}></div>
              </div>
              <p className="text-sm text-gray-600">Processing your changes...</p>
            </div>
          )}
        </div>
      </motion.div>
    </AnimatePresence>
  );
};

export default PDFPreview;

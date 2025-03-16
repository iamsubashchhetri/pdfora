
import React from 'react';
import { motion } from 'framer-motion';
import Header from '@/components/Header';
import PDFProcessor from '@/components/PDFProcessor';

const Index: React.FC = () => {
  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100">
      <Header />
      
      <main className="container px-4 py-8">
        <PDFProcessor />
        
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8, duration: 0.5 }}
          className="mt-16 max-w-2xl mx-auto p-4 bg-yellow-50 border border-yellow-100 rounded-lg"
        >
          <h3 className="text-sm font-medium text-yellow-800 mb-2">📝 How This Demo Works</h3>
          <p className="text-xs text-yellow-700">
            This is a demonstration of AI-powered PDF editing. When you process a PDF, 
            the system will analyze your prompt, identify the requested changes, and apply them to create a new PDF. 
            For this demo, we simulate the text extraction and modifications without actually changing the PDF content.
            Try prompts like "Change my name to John Doe" or "Update my email to john@example.com".
          </p>
        </motion.div>
      </main>
      
      <footer className="py-8 mt-16 border-t border-gray-200">
        <div className="container px-4">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5, duration: 0.5 }}
            className="text-center text-gray-500 text-sm"
          >
            © {new Date().getFullYear()} PDF Magic · All rights reserved
          </motion.div>
        </div>
      </footer>
    </div>
  );
};

export default Index;

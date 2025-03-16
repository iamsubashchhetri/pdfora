
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
          <h3 className="text-sm font-medium text-yellow-800 mb-2">📝 How to Use This App</h3>
          <p className="text-xs text-yellow-700 space-y-2">
            <span className="block">
              This app allows you to edit PDFs using simple text prompts. Upload your PDF, then enter instructions like:
            </span>
            
            <ul className="list-disc ml-4 mt-2 space-y-1">
              <li><strong>"Change my name to John Doe"</strong> - Replaces names with a new one</li>
              <li><strong>"Update my email to john@example.com"</strong> - Changes email addresses</li>
              <li><strong>"Add job responsibility: Led a team of 5 developers"</strong> - Adds new text</li>
              <li><strong>"Remove the education section"</strong> - Removes specific content</li>
            </ul>
            
            <span className="block mt-2">
              Note: Currently, the app demonstrates the concept of AI-powered PDF editing by modifying the document with visible changes. 
              For full text replacement with preserved formatting, a more advanced PDF manipulation library would be needed.
            </span>
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

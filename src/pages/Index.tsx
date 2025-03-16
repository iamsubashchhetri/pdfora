
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

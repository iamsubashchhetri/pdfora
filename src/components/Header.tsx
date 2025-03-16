
import React from 'react';
import { motion } from 'framer-motion';

const Header: React.FC = () => {
  return (
    <motion.header 
      className="w-full py-6 px-8 flex justify-between items-center glass z-10"
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <motion.div 
        className="flex items-center space-x-2"
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
      >
        <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-gray-800 to-gray-900 flex items-center justify-center">
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z" />
            <polyline points="14 2 14 8 20 8" />
            <path d="M9 15v-6" />
            <path d="M12 12v3" />
            <path d="M15 9v6" />
          </svg>
        </div>
        <h1 className="text-xl font-medium">PDF Magic</h1>
      </motion.div>
      
      <motion.nav 
        className="hidden md:flex items-center space-x-8"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2, duration: 0.5 }}
      >
        <a href="#" className="text-sm font-medium text-gray-500 hover:text-black transition-colors">Home</a>
        <a href="#" className="text-sm font-medium text-gray-500 hover:text-black transition-colors">About</a>
        <a href="#" className="text-sm font-medium text-gray-500 hover:text-black transition-colors">Contact</a>
      </motion.nav>
      
      <motion.div 
        className="hidden md:block"
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
      >
        <button className="px-4 py-2 rounded-lg bg-black text-white text-sm font-medium hover:bg-gray-800 transition-colors">
          Get Started
        </button>
      </motion.div>
    </motion.header>
  );
};

export default Header;

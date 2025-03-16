
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { MessageSquare, Send, Sparkles } from 'lucide-react';

interface PromptInputProps {
  onSubmit: (prompt: string) => void;
  isProcessing: boolean;
  disabled: boolean;
}

const PromptInput: React.FC<PromptInputProps> = ({ onSubmit, isProcessing, disabled }) => {
  const [prompt, setPrompt] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (prompt.trim() && !isProcessing && !disabled) {
      onSubmit(prompt.trim());
      setPrompt('');
    }
  };

  const examplePrompts = [
    "Change my name to John Doe",
    "Update my email to john@example.com",
    "Add job responsibility: Led a team of 5 developers"
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.2, duration: 0.5 }}
      className="w-full max-w-xl mx-auto"
    >
      <div className="mb-6">
        <label className="flex items-center gap-2 text-sm font-medium mb-2 text-gray-700">
          <MessageSquare size={16} />
          What would you like to change?
        </label>
        <motion.div 
          className="bg-white rounded-xl overflow-hidden shadow-sm border border-gray-100"
          whileHover={{ boxShadow: '0 4px 20px rgba(0,0,0,0.05)' }}
        >
          <form onSubmit={handleSubmit} className="relative">
            <textarea
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              placeholder="Type a command like 'Change my name to John Doe'"
              className="w-full p-4 pr-12 text-sm bg-transparent outline-none resize-none h-24"
              disabled={disabled || isProcessing}
            />
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className={`absolute right-4 bottom-4 p-2 rounded-lg ${
                !prompt.trim() || isProcessing || disabled
                  ? 'bg-gray-100 text-gray-400'
                  : 'bg-black text-white'
              }`}
              type="submit"
              disabled={!prompt.trim() || isProcessing || disabled}
            >
              {isProcessing ? (
                <div className="flex space-x-1">
                  <div className="loading-dot w-1.5 h-1.5 bg-gray-400 rounded-full"></div>
                  <div className="loading-dot w-1.5 h-1.5 bg-gray-400 rounded-full"></div>
                  <div className="loading-dot w-1.5 h-1.5 bg-gray-400 rounded-full"></div>
                </div>
              ) : (
                <Send size={16} />
              )}
            </motion.button>
          </form>
        </motion.div>
      </div>

      {!disabled && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4, duration: 0.5 }}
          className="flex flex-col sm:flex-row gap-2 items-start sm:items-center mb-6"
        >
          <div className="flex items-center gap-1 text-xs text-gray-500">
            <Sparkles size={12} />
            <span>Try these examples:</span>
          </div>
          
          <div className="flex flex-wrap gap-2">
            {examplePrompts.map((examplePrompt, index) => (
              <motion.button
                key={index}
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
                onClick={() => setPrompt(examplePrompt)}
                className="text-xs py-1 px-3 bg-gray-100 text-gray-700 rounded-full hover:bg-gray-200 transition-colors"
              >
                {examplePrompt}
              </motion.button>
            ))}
          </div>
        </motion.div>
      )}
    </motion.div>
  );
};

export default PromptInput;

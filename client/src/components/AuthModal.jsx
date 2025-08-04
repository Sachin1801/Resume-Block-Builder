import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Chrome } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

export default function AuthModal({ isOpen, onClose }) {
  const { signInWithGoogle } = useAuth();

  const handleGoogleSignIn = async () => {
    const { error } = await signInWithGoogle();
    if (!error) {
      onClose();
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
          onClick={onClose}
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            onClick={(e) => e.stopPropagation()}
            className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl max-w-md w-full p-6"
          >
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                Sign in to save your resume
              </h2>
              <button
                onClick={onClose}
                className="p-1 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
              >
                <X className="w-5 h-5 text-gray-500 dark:text-gray-400" />
              </button>
            </div>

            <p className="text-gray-600 dark:text-gray-300 mb-6">
              Sign in to save your resume sections, manage multiple resumes, and access your work from anywhere.
            </p>

            <button
              onClick={handleGoogleSignIn}
              className="w-full flex items-center justify-center gap-3 px-4 py-3 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-600 transition-colors"
            >
              <Chrome className="w-5 h-5" />
              <span className="font-medium">Continue with Google</span>
            </button>

            <p className="text-xs text-gray-500 dark:text-gray-400 mt-4 text-center">
              By signing in, you agree to our Terms of Service and Privacy Policy.
            </p>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
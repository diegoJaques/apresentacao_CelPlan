import { motion, AnimatePresence } from 'framer-motion';
import { Layers, X, Check } from 'lucide-react';
import { useState } from 'react';
import { presentationProfiles } from '../config/slideConfig';

interface ProfileSelectorProps {
  currentProfile: string;
  onProfileChange: (profileName: string) => void;
}

export const ProfileSelector = ({ currentProfile, onProfileChange }: ProfileSelectorProps) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      {/* Profile Toggle Button */}
      <motion.button
        initial={{ opacity: 0, x: -50 }}
        animate={{ opacity: 1, x: 0 }}
        onClick={() => setIsOpen(!isOpen)}
        className="fixed top-8 left-8 z-50 glass-effect px-4 py-2 rounded-full 
                 hover:bg-white/10 transition-colors flex items-center gap-2"
      >
        <Layers className="w-5 h-5 text-accent-500" />
        <span className="text-sm font-medium text-white">{currentProfile}</span>
      </motion.button>

      {/* Profile Menu */}
      <AnimatePresence>
        {isOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsOpen(false)}
              className="fixed inset-0 bg-black/50 z-40"
            />

            {/* Menu Panel */}
            <motion.div
              initial={{ opacity: 0, scale: 0.9, x: -20, y: -20 }}
              animate={{ opacity: 1, scale: 1, x: 0, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, x: -20, y: -20 }}
              className="fixed top-20 left-8 z-50 glass-effect p-6 rounded-xl w-80"
            >
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-bold gradient-text">Perfis de Apresentação</h3>
                <button
                  onClick={() => setIsOpen(false)}
                  className="p-1 rounded-full hover:bg-white/10 transition-colors"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <div className="space-y-2">
                {presentationProfiles.map((profile) => (
                  <button
                    key={profile.name}
                    onClick={() => {
                      onProfileChange(profile.name);
                      setIsOpen(false);
                    }}
                    className={`w-full text-left p-3 rounded-lg transition-all
                              ${currentProfile === profile.name 
                                ? 'bg-accent-500/20 border border-accent-500/50' 
                                : 'hover:bg-white/5'}`}
                  >
                    <div className="flex items-center justify-between">
                      <div>
                        <div className="font-medium text-white flex items-center gap-2">
                          {profile.name}
                          {currentProfile === profile.name && (
                            <Check className="w-4 h-4 text-accent-500" />
                          )}
                        </div>
                        <div className="text-xs text-neutral-400 mt-1">
                          {profile.description}
                        </div>
                      </div>
                    </div>
                    <div className="text-xs text-neutral-500 mt-2">
                      {profile.enabledSlides.length} slides
                    </div>
                  </button>
                ))}
              </div>

              <div className="mt-4 pt-4 border-t border-neutral-700">
                <p className="text-xs text-neutral-400">
                  Pressione <kbd className="px-2 py-1 bg-neutral-700 rounded text-white">P</kbd> para 
                  alternar rapidamente entre perfis
                </p>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
};
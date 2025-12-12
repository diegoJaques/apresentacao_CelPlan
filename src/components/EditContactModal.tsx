import { useState } from 'react';
import type { FormEvent } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Save, Loader2 } from 'lucide-react';
import type { VendorInfo } from '../types/api';

interface EditContactModalProps {
  isOpen: boolean;
  onClose: () => void;
  vendorInfo: VendorInfo;
  onSave: (updatedInfo: VendorInfo) => Promise<void>;
}

export const EditContactModal = ({ isOpen, onClose, vendorInfo, onSave }: EditContactModalProps) => {
  const [formData, setFormData] = useState<VendorInfo>(vendorInfo);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      await onSave(formData);
      onClose();
    } catch (err: any) {
      setError(err.response?.data?.error || 'Erro ao salvar dados');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50"
          />

          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4"
          >
            <div className="glass-effect rounded-2xl p-6 max-w-md w-full shadow-2xl">
              {/* Header */}
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-xl font-bold gradient-text">
                  Editar Informações de Contato
                </h3>
                <button
                  onClick={onClose}
                  className="p-2 hover:bg-white/10 rounded-lg transition-colors"
                  disabled={isLoading}
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Form */}
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-1.5">
                    Nome Completo *
                  </label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full px-4 py-2.5 bg-white/5 border border-white/10 rounded-lg
                             focus:outline-none focus:border-primary-500 transition-colors"
                    required
                    disabled={isLoading}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1.5">
                    Email *
                  </label>
                  <input
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="w-full px-4 py-2.5 bg-white/5 border border-white/10 rounded-lg
                             focus:outline-none focus:border-primary-500 transition-colors"
                    required
                    disabled={isLoading}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1.5">
                    Telefone
                  </label>
                  <input
                    type="tel"
                    value={formData.phone || ''}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    placeholder="+55 19 98376-0039"
                    className="w-full px-4 py-2.5 bg-white/5 border border-white/10 rounded-lg
                             focus:outline-none focus:border-primary-500 transition-colors"
                    disabled={isLoading}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1.5">
                    WhatsApp
                  </label>
                  <input
                    type="tel"
                    value={formData.whatsapp || ''}
                    onChange={(e) => setFormData({ ...formData, whatsapp: e.target.value })}
                    placeholder="5519983760039"
                    className="w-full px-4 py-2.5 bg-white/5 border border-white/10 rounded-lg
                             focus:outline-none focus:border-primary-500 transition-colors"
                    disabled={isLoading}
                  />
                  <p className="text-xs text-neutral-400 mt-1">
                    Apenas números com código do país (ex: 5519983760039)
                  </p>
                </div>

                {error && (
                  <div className="p-3 bg-red-500/10 border border-red-500/20 rounded-lg">
                    <p className="text-sm text-red-300">{error}</p>
                  </div>
                )}

                {/* Actions */}
                <div className="flex gap-3 pt-2">
                  <button
                    type="button"
                    onClick={onClose}
                    className="flex-1 px-4 py-2.5 bg-white/5 hover:bg-white/10 rounded-lg
                             transition-colors disabled:opacity-50"
                    disabled={isLoading}
                  >
                    Cancelar
                  </button>
                  <button
                    type="submit"
                    className="flex-1 px-4 py-2.5 bg-primary-500 hover:bg-primary-600 rounded-lg
                             transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
                    disabled={isLoading}
                  >
                    {isLoading ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin" />
                        Salvando...
                      </>
                    ) : (
                      <>
                        <Save className="w-4 h-4" />
                        Salvar
                      </>
                    )}
                  </button>
                </div>
              </form>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

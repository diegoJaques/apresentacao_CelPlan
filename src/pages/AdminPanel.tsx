import { useState, FormEvent } from 'react';
import { motion } from 'framer-motion';
import { LogOut, User, Mail, Phone, MessageCircle, Loader2, Check, Copy, Plus } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { presentationService } from '../services/api';
import { slidesConfig } from '../config/slideConfig';
import type { VendorInfo } from '../types/api';

export default function AdminPanel() {
  const { user, logout } = useAuth();

  // Estado do formulário
  const [vendorInfo, setVendorInfo] = useState<VendorInfo>({
    name: '',
    email: '',
    phone: '',
    whatsapp: '',
  });

  // Estado dos slides selecionados (todos por padrão)
  const [selectedSlides, setSelectedSlides] = useState<string[]>(
    slidesConfig.filter(s => s.enabled).map(s => s.id)
  );

  // Estado da geração
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedUrl, setGeneratedUrl] = useState('');
  const [isCopied, setIsCopied] = useState(false);
  const [error, setError] = useState('');

  // Toggle de seleção de slide
  const toggleSlide = (slideId: string) => {
    setSelectedSlides(prev =>
      prev.includes(slideId)
        ? prev.filter(id => id !== slideId)
        : [...prev, slideId]
    );
  };

  // Selecionar/Desselecionar todos
  const toggleAll = () => {
    if (selectedSlides.length === slidesConfig.filter(s => s.enabled).length) {
      setSelectedSlides([]);
    } else {
      setSelectedSlides(slidesConfig.filter(s => s.enabled).map(s => s.id));
    }
  };

  // Gerar apresentação
  const handleGenerate = async (e: FormEvent) => {
    e.preventDefault();
    setError('');
    setGeneratedUrl('');
    setIsCopied(false);

    // Validação
    if (!vendorInfo.name || !vendorInfo.email) {
      setError('Por favor, preencha nome e e-mail');
      return;
    }

    if (selectedSlides.length === 0) {
      setError('Selecione pelo menos um slide');
      return;
    }

    setIsGenerating(true);

    try {
      const response = await presentationService.create({
        vendorInfo,
        selectedSlides,
      });

      setGeneratedUrl(response.url);
    } catch (err: any) {
      setError(err.response?.data?.error || 'Erro ao gerar apresentação');
    } finally {
      setIsGenerating(false);
    }
  };

  // Copiar URL
  const copyUrl = () => {
    navigator.clipboard.writeText(generatedUrl);
    setIsCopied(true);
    setTimeout(() => setIsCopied(false), 2000);
  };

  // Agrupar slides por categoria
  const slidesByCategory = {
    core: slidesConfig.filter(s => s.category === 'core' && s.enabled),
    cases: slidesConfig.filter(s => s.category === 'cases' && s.enabled),
    technical: slidesConfig.filter(s => s.category === 'technical' && s.enabled),
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 p-4 md:p-8">
      {/* Header */}
      <div className="max-w-6xl mx-auto mb-8">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold gradient-text mb-2">
              Painel Administrativo
            </h1>
            <p className="text-slate-300">
              Olá, <span className="font-semibold">{user?.name}</span>
            </p>
          </div>
          <button
            onClick={logout}
            className="flex items-center gap-2 px-4 py-2 bg-slate-800 hover:bg-slate-700 text-white rounded-lg transition"
          >
            <LogOut size={18} />
            Sair
          </button>
        </div>
      </div>

      {/* Conteúdo Principal */}
      <div className="max-w-6xl mx-auto">
        <form onSubmit={handleGenerate} className="space-y-6">
          {/* Card: Informações do Vendedor */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="glass-effect rounded-2xl p-6"
          >
            <h2 className="text-xl font-semibold text-white mb-4 flex items-center gap-2">
              <User size={24} />
              Informações do Vendedor
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Nome */}
              <div>
                <label className="block text-sm font-medium text-slate-200 mb-2">
                  Nome Completo *
                </label>
                <input
                  type="text"
                  value={vendorInfo.name}
                  onChange={(e) => setVendorInfo({ ...vendorInfo, name: e.target.value })}
                  className="w-full px-4 py-2 bg-slate-800/50 border border-slate-700 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Seu nome completo"
                  required
                />
              </div>

              {/* Email */}
              <div>
                <label className="block text-sm font-medium text-slate-200 mb-2">
                  E-mail *
                </label>
                <input
                  type="email"
                  value={vendorInfo.email}
                  onChange={(e) => setVendorInfo({ ...vendorInfo, email: e.target.value })}
                  className="w-full px-4 py-2 bg-slate-800/50 border border-slate-700 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="seu@email.com"
                  required
                />
              </div>

              {/* Telefone */}
              <div>
                <label className="block text-sm font-medium text-slate-200 mb-2">
                  Telefone
                </label>
                <input
                  type="tel"
                  value={vendorInfo.phone}
                  onChange={(e) => setVendorInfo({ ...vendorInfo, phone: e.target.value })}
                  className="w-full px-4 py-2 bg-slate-800/50 border border-slate-700 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="(11) 98765-4321"
                />
              </div>

              {/* WhatsApp */}
              <div>
                <label className="block text-sm font-medium text-slate-200 mb-2">
                  WhatsApp
                </label>
                <input
                  type="tel"
                  value={vendorInfo.whatsapp}
                  onChange={(e) => setVendorInfo({ ...vendorInfo, whatsapp: e.target.value })}
                  className="w-full px-4 py-2 bg-slate-800/50 border border-slate-700 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="5511987654321"
                />
              </div>
            </div>
          </motion.div>

          {/* Card: Seleção de Slides */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="glass-effect rounded-2xl p-6"
          >
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold text-white flex items-center gap-2">
                <Plus size={24} />
                Seleção de Slides ({selectedSlides.length}/{slidesConfig.filter(s => s.enabled).length})
              </h2>
              <button
                type="button"
                onClick={toggleAll}
                className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm rounded-lg transition"
              >
                {selectedSlides.length === slidesConfig.filter(s => s.enabled).length ? 'Desselecionar Todos' : 'Selecionar Todos'}
              </button>
            </div>

            <div className="space-y-6">
              {/* Slides Principais */}
              {slidesByCategory.core.length > 0 && (
                <div>
                  <h3 className="text-sm font-semibold text-blue-300 mb-3 uppercase tracking-wider">
                    Slides Principais
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                    {slidesByCategory.core.map(slide => (
                      <label
                        key={slide.id}
                        className="flex items-center gap-3 p-3 bg-slate-800/50 border border-slate-700 rounded-lg cursor-pointer hover:bg-slate-800 transition"
                      >
                        <input
                          type="checkbox"
                          checked={selectedSlides.includes(slide.id)}
                          onChange={() => toggleSlide(slide.id)}
                          className="w-5 h-5 rounded border-slate-600 text-blue-600 focus:ring-2 focus:ring-blue-500"
                        />
                        <span className="text-white text-sm">{slide.name}</span>
                      </label>
                    ))}
                  </div>
                </div>
              )}

              {/* Cases de Sucesso */}
              {slidesByCategory.cases.length > 0 && (
                <div>
                  <h3 className="text-sm font-semibold text-green-300 mb-3 uppercase tracking-wider">
                    Cases de Sucesso
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                    {slidesByCategory.cases.map(slide => (
                      <label
                        key={slide.id}
                        className="flex items-center gap-3 p-3 bg-slate-800/50 border border-slate-700 rounded-lg cursor-pointer hover:bg-slate-800 transition"
                      >
                        <input
                          type="checkbox"
                          checked={selectedSlides.includes(slide.id)}
                          onChange={() => toggleSlide(slide.id)}
                          className="w-5 h-5 rounded border-slate-600 text-green-600 focus:ring-2 focus:ring-green-500"
                        />
                        <span className="text-white text-sm">{slide.name}</span>
                      </label>
                    ))}
                  </div>
                </div>
              )}

              {/* Slides Técnicos */}
              {slidesByCategory.technical.length > 0 && (
                <div>
                  <h3 className="text-sm font-semibold text-purple-300 mb-3 uppercase tracking-wider">
                    Slides Técnicos
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                    {slidesByCategory.technical.map(slide => (
                      <label
                        key={slide.id}
                        className="flex items-center gap-3 p-3 bg-slate-800/50 border border-slate-700 rounded-lg cursor-pointer hover:bg-slate-800 transition"
                      >
                        <input
                          type="checkbox"
                          checked={selectedSlides.includes(slide.id)}
                          onChange={() => toggleSlide(slide.id)}
                          className="w-5 h-5 rounded border-slate-600 text-purple-600 focus:ring-2 focus:ring-purple-500"
                        />
                        <span className="text-white text-sm">{slide.name}</span>
                      </label>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </motion.div>

          {/* Mensagem de Erro */}
          {error && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="glass-effect rounded-lg p-4 bg-red-500/10 border border-red-500/50"
            >
              <p className="text-red-300">{error}</p>
            </motion.div>
          )}

          {/* Botão Gerar */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
          >
            <button
              type="submit"
              disabled={isGenerating}
              className="w-full py-4 px-6 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white font-semibold text-lg rounded-lg shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none flex items-center justify-center gap-2"
            >
              {isGenerating ? (
                <>
                  <Loader2 className="animate-spin" size={24} />
                  Gerando Apresentação...
                </>
              ) : (
                <>
                  <Plus size={24} />
                  Gerar Apresentação Customizada
                </>
              )}
            </button>
          </motion.div>

          {/* URL Gerada */}
          {generatedUrl && (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="glass-effect rounded-2xl p-6 bg-green-500/10 border-2 border-green-500"
            >
              <div className="flex items-start gap-3 mb-4">
                <Check className="text-green-400 flex-shrink-0 mt-1" size={24} />
                <div>
                  <h3 className="text-xl font-semibold text-green-300 mb-1">
                    Apresentação Criada com Sucesso!
                  </h3>
                  <p className="text-slate-300 text-sm">
                    Compartilhe este link com seu cliente:
                  </p>
                </div>
              </div>

              <div className="flex gap-2">
                <input
                  type="text"
                  value={generatedUrl}
                  readOnly
                  className="flex-1 px-4 py-3 bg-slate-800/50 border border-slate-700 rounded-lg text-white font-mono text-sm"
                />
                <button
                  type="button"
                  onClick={copyUrl}
                  className="px-6 py-3 bg-green-600 hover:bg-green-700 text-white rounded-lg transition flex items-center gap-2"
                >
                  {isCopied ? (
                    <>
                      <Check size={20} />
                      Copiado!
                    </>
                  ) : (
                    <>
                      <Copy size={20} />
                      Copiar
                    </>
                  )}
                </button>
              </div>

              <p className="mt-4 text-xs text-slate-400">
                O cliente precisará da palavra de segurança: <span className="text-slate-300 font-mono font-semibold">celplan</span>
              </p>
            </motion.div>
          )}
        </form>
      </div>
    </div>
  );
}

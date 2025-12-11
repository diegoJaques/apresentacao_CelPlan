import { useState, FormEvent } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Key, AlertCircle, Loader2 } from 'lucide-react';
import { clientService } from '../services/api';
import AnimatedLogo from '../components/AnimatedLogo';

export default function ClientAccessPage() {
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      const response = await clientService.validatePassword(password);

      if (response.valid) {
        // Salvar validação em sessão
        sessionStorage.setItem('client_validated', 'true');
        sessionStorage.setItem('presentation_id', id || '');

        // Redirecionar para apresentação
        navigate(`/apresentacao/${id}/view`);
      } else {
        setError('Palavra de segurança incorreta');
      }
    } catch (err: any) {
      setError(err.response?.data?.error || 'Erro ao validar acesso. Tente novamente.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="w-full max-w-md"
      >
        {/* Logo */}
        <div className="flex justify-center mb-8">
          <AnimatedLogo size={120} />
        </div>

        {/* Card */}
        <div className="glass-effect rounded-2xl p-8 shadow-2xl">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold gradient-text mb-2">
              Apresentação Exclusiva
            </h1>
            <p className="text-slate-300">
              Digite a palavra de segurança para continuar
            </p>
          </div>

          {/* Formulário */}
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-slate-200 mb-2">
                Palavra de Segurança
              </label>
              <div className="relative">
                <Key className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 bg-slate-800/50 border border-slate-700 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition"
                  placeholder="Digite a palavra de segurança"
                  required
                  disabled={isLoading}
                  autoFocus
                />
              </div>
            </div>

            {/* Mensagem de Erro */}
            {error && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex items-start gap-2 p-4 bg-red-500/10 border border-red-500/50 rounded-lg"
              >
                <AlertCircle className="text-red-400 flex-shrink-0 mt-0.5" size={20} />
                <p className="text-sm text-red-300">{error}</p>
              </motion.div>
            )}

            {/* Botão Acessar */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-3 px-4 bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-700 hover:to-purple-800 text-white font-semibold rounded-lg shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none flex items-center justify-center gap-2"
            >
              {isLoading ? (
                <>
                  <Loader2 className="animate-spin" size={20} />
                  Validando...
                </>
              ) : (
                'Acessar Apresentação'
              )}
            </button>
          </form>

          {/* Informações */}
          <div className="mt-6 pt-6 border-t border-slate-700">
            <p className="text-xs text-center text-slate-400">
              Apresentação ID: <span className="text-slate-300 font-mono">{id}</span>
            </p>
          </div>
        </div>
      </motion.div>
    </div>
  );
}

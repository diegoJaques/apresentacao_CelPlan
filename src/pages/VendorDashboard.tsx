import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useAuth } from '../contexts/AuthContext';
import { presentationsApi } from '../lib/api';
import {
  Plus,
  Eye,
  Copy,
  Check,
  ExternalLink,
  Calendar,
  User,
  LogOut,
  Trash2,
  Edit3
} from 'lucide-react';

interface Presentation {
  id: string;
  title: string;
  description?: string;
  status: 'draft' | 'published' | 'archived';
  published_at?: string;
  created_at: string;
  updated_at: string;
}

export const VendorDashboard = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [presentations, setPresentations] = useState<Presentation[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  useEffect(() => {
    loadPresentations();
  }, []);

  const loadPresentations = async () => {
    try {
      setIsLoading(true);
      const response = await presentationsApi.list();

      if (response.success) {
        setPresentations(response.presentations || []);
      }
    } catch (error: any) {
      console.error('Erro ao carregar apresentações:', error);

      // Se o erro for de vendor_id ausente, força logout
      if (error.data?.error === 'MISSING_VENDOR_ID') {
        alert('Sua sessão precisa ser atualizada. Por favor, faça login novamente.');
        await logout();
        navigate('/login');
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleCreatePresentation = async () => {
    try {
      const response = await presentationsApi.create({
        title: `Apresentação ${new Date().toLocaleDateString()}`,
        description: 'Nova apresentação',
        copy_from_template: true
      });

      if (response.success) {
        await loadPresentations();
      }
    } catch (error) {
      console.error('Erro ao criar apresentação:', error);
      alert('Erro ao criar apresentação. Tente novamente.');
    }
  };

  const handlePublish = async (id: string) => {
    try {
      await presentationsApi.update(id, {
        // @ts-ignore
        status: 'published',
        published_at: new Date().toISOString()
      });

      await loadPresentations();
      alert('Apresentação publicada com sucesso! Copie o link para compartilhar.');
    } catch (error) {
      console.error('Erro ao publicar:', error);
      alert('Erro ao publicar apresentação.');
    }
  };

  const handleCopyLink = (id: string) => {
    const link = `${window.location.origin}/v3/${id}`;
    navigator.clipboard.writeText(link);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Tem certeza que deseja excluir esta apresentação?')) {
      return;
    }

    try {
      await presentationsApi.delete(id);
      await loadPresentations();
    } catch (error) {
      console.error('Erro ao excluir:', error);
      alert('Erro ao excluir apresentação.');
    }
  };

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800">
      {/* Header */}
      <header className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm border-b border-slate-200 dark:border-slate-700 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-slate-900 dark:text-white">
                Dashboard CelPlan
              </h1>
              <div className="flex items-center gap-2 mt-1 text-sm text-slate-600 dark:text-slate-400">
                <User className="w-4 h-4" />
                <span>{user?.full_name || user?.username}</span>
                <span className="text-xs px-2 py-0.5 bg-brand-100 dark:bg-brand-900/30 text-brand-700 dark:text-brand-300 rounded-full">
                  {user?.role}
                </span>
              </div>
            </div>

            <button
              onClick={handleLogout}
              className="flex items-center gap-2 px-4 py-2 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-lg transition-colors"
            >
              <LogOut className="w-4 h-4" />
              Sair
            </button>
          </div>
        </div>
      </header>

      {/* Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Actions */}
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-xl font-semibold text-slate-900 dark:text-white">
            Minhas Apresentações
          </h2>

          <button
            onClick={handleCreatePresentation}
            className="flex items-center gap-2 px-4 py-2 bg-brand-600 hover:bg-brand-700 text-white rounded-lg transition-colors shadow-lg hover:shadow-xl"
          >
            <Plus className="w-5 h-5" />
            Nova Apresentação
          </button>
        </div>

        {/* Loading */}
        {isLoading && (
          <div className="text-center py-12">
            <div className="inline-block w-8 h-8 border-4 border-brand-500 border-t-transparent rounded-full animate-spin"></div>
            <p className="mt-4 text-slate-600 dark:text-slate-400">Carregando...</p>
          </div>
        )}

        {/* Empty State */}
        {!isLoading && presentations.length === 0 && (
          <div className="text-center py-12 bg-white dark:bg-slate-800 rounded-xl border-2 border-dashed border-slate-300 dark:border-slate-600">
            <p className="text-slate-600 dark:text-slate-400 mb-4">
              Nenhuma apresentação criada ainda
            </p>
            <button
              onClick={handleCreatePresentation}
              className="inline-flex items-center gap-2 px-6 py-3 bg-brand-600 hover:bg-brand-700 text-white rounded-lg transition-colors"
            >
              <Plus className="w-5 h-5" />
              Criar Primeira Apresentação
            </button>
          </div>
        )}

        {/* Presentations Grid */}
        {!isLoading && presentations.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {presentations.map((presentation, index) => (
              <motion.div
                key={presentation.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="bg-white dark:bg-slate-800 rounded-xl shadow-lg hover:shadow-xl transition-shadow border border-slate-200 dark:border-slate-700"
              >
                <div className="p-6">
                  {/* Status Badge */}
                  <div className="flex items-center justify-between mb-4">
                    <span
                      className={`text-xs px-3 py-1 rounded-full font-medium ${
                        presentation.status === 'published'
                          ? 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300'
                          : presentation.status === 'draft'
                          ? 'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-300'
                          : 'bg-gray-100 dark:bg-gray-900/30 text-gray-700 dark:text-gray-300'
                      }`}
                    >
                      {presentation.status === 'published'
                        ? 'Publicada'
                        : presentation.status === 'draft'
                        ? 'Rascunho'
                        : 'Arquivada'}
                    </span>

                    <button
                      onClick={() => handleDelete(presentation.id)}
                      className="text-red-500 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>

                  {/* Title & Description */}
                  <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-2 line-clamp-2">
                    {presentation.title}
                  </h3>

                  {presentation.description && (
                    <p className="text-sm text-slate-600 dark:text-slate-400 mb-4 line-clamp-2">
                      {presentation.description}
                    </p>
                  )}

                  {/* Date */}
                  <div className="flex items-center gap-2 text-xs text-slate-500 dark:text-slate-500 mb-4">
                    <Calendar className="w-3 h-3" />
                    <span>
                      {new Date(presentation.created_at).toLocaleDateString('pt-BR')}
                    </span>
                  </div>

                  {/* Actions */}
                  <div className="space-y-2">
                    {presentation.status === 'draft' && (
                      <button
                        onClick={() => handlePublish(presentation.id)}
                        className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg transition-colors text-sm font-medium"
                      >
                        <ExternalLink className="w-4 h-4" />
                        Publicar
                      </button>
                    )}

                    {presentation.status === 'published' && (
                      <button
                        onClick={() => handleCopyLink(presentation.id)}
                        className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-brand-600 hover:bg-brand-700 text-white rounded-lg transition-colors text-sm font-medium"
                      >
                        {copiedId === presentation.id ? (
                          <>
                            <Check className="w-4 h-4" />
                            Copiado!
                          </>
                        ) : (
                          <>
                            <Copy className="w-4 h-4" />
                            Copiar Link
                          </>
                        )}
                      </button>
                    )}

                    <button
                      onClick={() => navigate(`/v3/${presentation.id}`)}
                      className="w-full flex items-center justify-center gap-2 px-4 py-2 border-2 border-slate-300 dark:border-slate-600 text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700 rounded-lg transition-colors text-sm font-medium"
                    >
                      <Eye className="w-4 h-4" />
                      Visualizar
                    </button>

                    <button
                      onClick={() => navigate(`/admin/v3?presentationId=${presentation.id}`)}
                      className="w-full flex items-center justify-center gap-2 px-4 py-2 border-2 border-slate-300 dark:border-slate-600 text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700 rounded-lg transition-colors text-sm font-medium"
                    >
                      <Edit3 className="w-4 h-4" />
                      Editar
                    </button>
                  </div>

                  {/* Public Link Display */}
                  {presentation.status === 'published' && (
                    <div className="mt-4 pt-4 border-t border-slate-200 dark:border-slate-700">
                      <p className="text-xs text-slate-500 dark:text-slate-500 mb-1">
                        Link público:
                      </p>
                      <code className="text-xs bg-slate-100 dark:bg-slate-900 text-brand-600 dark:text-brand-400 px-2 py-1 rounded block overflow-hidden text-ellipsis whitespace-nowrap">
                        {window.location.origin}/v3/{presentation.id}
                      </code>
                    </div>
                  )}
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
};

export default VendorDashboard;

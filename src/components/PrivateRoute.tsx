import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useState, useEffect } from 'react';
import LoginModal from './LoginModal';
import { Loader2 } from 'lucide-react';

interface PrivateRouteProps {
  children: React.ReactNode;
  requiredRole?: string;
  redirectTo?: string;
}

export default function PrivateRoute({
  children,
  requiredRole,
  redirectTo = '/'
}: PrivateRouteProps) {
  const { user, isAuthenticated, isLoading, refreshAuth } = useAuth();
  const [showLoginModal, setShowLoginModal] = useState(false);
  const location = useLocation();

  useEffect(() => {
    // Show login modal if not authenticated and not loading
    if (!isLoading && !isAuthenticated) {
      setShowLoginModal(true);
    }
  }, [isLoading, isAuthenticated]);

  // Loading state
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-50 to-blue-50 dark:from-gray-900 dark:to-gray-800">
        <div className="text-center">
          <Loader2 className="w-12 h-12 animate-spin text-purple-600 mx-auto mb-4" />
          <p className="text-gray-600 dark:text-gray-400">Verificando autenticação...</p>
        </div>
      </div>
    );
  }

  // Not authenticated - show login modal
  if (!isAuthenticated) {
    return (
      <>
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-50 to-blue-50 dark:from-gray-900 dark:to-gray-800">
          <div className="text-center bg-white dark:bg-gray-800 p-8 rounded-2xl shadow-xl">
            <div className="mb-6">
              <div className="w-20 h-20 bg-purple-100 dark:bg-purple-900/30 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-10 h-10 text-purple-600 dark:text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                </svg>
              </div>
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                Acesso Restrito
              </h2>
              <p className="text-gray-600 dark:text-gray-400">
                Você precisa fazer login para acessar esta página
              </p>
            </div>
          </div>
        </div>

        <LoginModal
          isOpen={showLoginModal}
          onClose={() => {
            setShowLoginModal(false);
            // Redirect to home if user closes modal without login
            window.location.pathname = redirectTo;
          }}
          onSuccess={async (user) => {
            setShowLoginModal(false);
            // Refresh authentication state - this will update isAuthenticated
            await refreshAuth();
            // Component will re-render and show admin panel
          }}
          redirectTo={location.pathname}
        />
      </>
    );
  }

  // Check role requirement
  if (requiredRole && user?.role !== requiredRole) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-red-50 to-orange-50 dark:from-gray-900 dark:to-gray-800">
        <div className="text-center bg-white dark:bg-gray-800 p-8 rounded-2xl shadow-xl">
          <div className="mb-6">
            <div className="w-20 h-20 bg-red-100 dark:bg-red-900/30 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-10 h-10 text-red-600 dark:text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18.364 5.636a9 9 0 010 12.728m0 0l-2.829-2.829m2.829 2.829L21 21M15.536 8.464a5 5 0 010 7.072m0 0l-2.829-2.829m-4.243 2.829a4.978 4.978 0 01-1.414-2.83m-1.414 5.658a9 9 0 01-2.167-9.238m7.824 2.167a1 1 0 111.414 1.414m-1.414-1.414L3 3m8.293 8.293l1.414 1.414" />
              </svg>
            </div>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
              Acesso Negado
            </h2>
            <p className="text-gray-600 dark:text-gray-400 mb-6">
              Você não tem permissão para acessar esta página.
            </p>
          </div>
          <button
            onClick={() => window.location.pathname = redirectTo}
            className="px-6 py-3 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors font-medium"
          >
            Voltar ao Início
          </button>
        </div>
      </div>
    );
  }

  // Authenticated and authorized - render children
  return <>{children}</>;
}

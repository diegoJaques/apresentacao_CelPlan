import React, { useState, useEffect } from 'react';
import { X, Lock, User, Eye, EyeOff, Loader2 } from 'lucide-react';
import { authApi, ApiError } from '../lib/api';

interface LoginModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: (user: { username: string; role: string }) => void;
  redirectTo?: string;
}

export default function LoginModal({
  isOpen,
  onClose,
  onSuccess,
  redirectTo = '/admin/v3',
}: LoginModalProps) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [rememberMe, setRememberMe] = useState(false);

  // Clear form when modal opens
  useEffect(() => {
    if (isOpen) {
      setUsername('');
      setPassword('');
      setError('');
      setShowPassword(false);
    }
  }, [isOpen]);

  // Check if already authenticated
  useEffect(() => {
    if (isOpen && authApi.isAuthenticated()) {
      // Verify token is still valid
      authApi
        .verify()
        .then((response) => {
          if (response.valid && response.user) {
            handleSuccessfulLogin(response.user);
          }
        })
        .catch(() => {
          // Token is invalid, continue with login
        });
    }
  }, [isOpen]);

  const handleSuccessfulLogin = (user: { username: string; role: string }) => {
    if (onSuccess) {
      onSuccess(user);
      // Don't call onClose here - let onSuccess handle it
      return;
    }

    // Redirect to admin or specified page using relative path
    if (redirectTo) {
      // Use pathname to avoid port issues
      window.location.pathname = redirectTo;
    }

    onClose();
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      const response = await authApi.login(username, password);

      if (response.success && response.user) {
        // Store remember me preference
        if (rememberMe) {
          localStorage.setItem('celplan_remember_me', 'true');
        }

        handleSuccessfulLogin(response.user);
      }
    } catch (err) {
      if (err instanceof ApiError) {
        setError(err.message || 'Erro ao fazer login');
      } else {
        setError('Erro de conexão. Verifique se o servidor está rodando.');
      }
      console.error('Login error:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Escape') {
      onClose();
    }
  };

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fadeIn"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
      onKeyDown={handleKeyDown}
    >
      <div className="relative w-full max-w-md bg-white dark:bg-gray-900 rounded-2xl shadow-2xl animate-slideUp">
        {/* Header */}
        <div className="relative p-6 pb-4 border-b border-gray-200 dark:border-gray-700">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
            aria-label="Fechar"
          >
            <X className="w-5 h-5 text-gray-500" />
          </button>

          <div className="flex items-center gap-3">
            <div className="p-3 bg-purple-100 dark:bg-purple-900/30 rounded-xl">
              <Lock className="w-6 h-6 text-purple-600 dark:text-purple-400" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                Login Admin
              </h2>
              <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                Acesse o painel administrativo
              </p>
            </div>
          </div>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6">
          {/* Error Message */}
          {error && (
            <div className="mb-4 p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
              <p className="text-sm text-red-600 dark:text-red-400">{error}</p>
            </div>
          )}

          {/* Username Field */}
          <div className="mb-4">
            <label
              htmlFor="username"
              className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
            >
              Usuário
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <User className="h-5 w-5 text-gray-400" />
              </div>
              <input
                id="username"
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="block w-full pl-10 pr-3 py-2.5 border border-gray-300 dark:border-gray-600 rounded-lg
                         bg-white dark:bg-gray-800 text-gray-900 dark:text-white
                         focus:ring-2 focus:ring-purple-500 focus:border-transparent
                         placeholder-gray-400 dark:placeholder-gray-500"
                placeholder="Digite seu usuário"
                required
                disabled={isLoading}
                autoFocus
              />
            </div>
          </div>

          {/* Password Field */}
          <div className="mb-4">
            <label
              htmlFor="password"
              className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
            >
              Senha
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Lock className="h-5 w-5 text-gray-400" />
              </div>
              <input
                id="password"
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="block w-full pl-10 pr-10 py-2.5 border border-gray-300 dark:border-gray-600 rounded-lg
                         bg-white dark:bg-gray-800 text-gray-900 dark:text-white
                         focus:ring-2 focus:ring-purple-500 focus:border-transparent
                         placeholder-gray-400 dark:placeholder-gray-500"
                placeholder="Digite sua senha"
                required
                disabled={isLoading}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute inset-y-0 right-0 pr-3 flex items-center"
                tabIndex={-1}
              >
                {showPassword ? (
                  <EyeOff className="h-5 w-5 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300" />
                ) : (
                  <Eye className="h-5 w-5 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300" />
                )}
              </button>
            </div>
          </div>

          {/* Remember Me */}
          <div className="flex items-center mb-6">
            <input
              id="remember-me"
              type="checkbox"
              checked={rememberMe}
              onChange={(e) => setRememberMe(e.target.checked)}
              className="h-4 w-4 text-purple-600 focus:ring-purple-500 border-gray-300 dark:border-gray-600 rounded"
            />
            <label
              htmlFor="remember-me"
              className="ml-2 block text-sm text-gray-700 dark:text-gray-300"
            >
              Lembrar de mim
            </label>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={isLoading}
            className="w-full flex justify-center items-center gap-2 py-2.5 px-4
                     bg-purple-600 hover:bg-purple-700 disabled:bg-purple-400
                     text-white font-medium rounded-lg
                     focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2
                     transition-colors duration-200"
          >
            {isLoading ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" />
                Entrando...
              </>
            ) : (
              'Entrar'
            )}
          </button>
        </form>

        {/* Footer */}
        <div className="px-6 pb-6">
          <div className="text-center">
            <p className="text-xs text-gray-500 dark:text-gray-400">
              Credenciais padrão: admin / celplan2024
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

// Add animations to global CSS or tailwind config
const animationStyles = `
@keyframes fadeIn {
  from { opacity: 0; }
  to { opacity: 1; }
}

@keyframes slideUp {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.animate-fadeIn {
  animation: fadeIn 0.2s ease-out;
}

.animate-slideUp {
  animation: slideUp 0.3s ease-out;
}
`;

// Export animation styles to be added to global CSS
export { animationStyles };
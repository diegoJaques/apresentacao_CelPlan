import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import LoginPage from './pages/LoginPage';
import AdminPanel from './pages/AdminPanel';
import ClientAccessPage from './pages/ClientAccessPage';
import PresentationView from './pages/PresentationView';
import PresentationApp from './components/PresentationApp';
import PrivateRoute from './components/PrivateRoute';

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          {/* Rota raiz - Apresentação padrão (mantém funcionamento original) */}
          <Route path="/" element={<PresentationApp />} />

          {/* Rotas de autenticação */}
          <Route path="/login" element={<LoginPage />} />

          {/* Painel administrativo (protegido) */}
          <Route
            path="/admin"
            element={
              <PrivateRoute>
                <AdminPanel />
              </PrivateRoute>
            }
          />

          {/* Rotas de apresentação customizada para clientes */}
          <Route path="/apresentacao/:id" element={<ClientAccessPage />} />
          <Route path="/apresentacao/:id/view" element={<PresentationView />} />

          {/* Rota 404 - Redireciona para home */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;

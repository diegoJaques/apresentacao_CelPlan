import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import { ThemeProvider } from './contexts/ThemeContext';
import LoginPage from './pages/LoginPage';
import ClientAccessPage from './pages/ClientAccessPage';
import PresentationView from './pages/PresentationView';
import PresentationApp from './components/PresentationApp';
import { PresentationAppV3Hybrid } from './components/v3/PresentationAppV3Hybrid';
import { AdminPanelSimplified } from './components/admin/AdminPanelSimplified';
import VendorDashboard from './pages/VendorDashboard';
import PrivateRoute from './components/PrivateRoute';

function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <BrowserRouter>
        <Routes>
          {/* Rota raiz - Apresentação padrão (mantém funcionamento original) */}
          <Route path="/" element={<PresentationApp />} />

          {/* Apresentação V3 Institucional - Versão Híbrida (Preserva Layouts Originais) */}
          <Route path="/v3" element={<PresentationAppV3Hybrid />} />

          {/* Visualização pública de apresentação por UUID - SEM AUTENTICAÇÃO */}
          <Route path="/v3/:presentationId" element={<PresentationAppV3Hybrid />} />

          {/* Painel Administrativo V3 - Controle Simplificado - REQUER AUTENTICAÇÃO */}
          <Route
            path="/admin/v3"
            element={
              <PrivateRoute requiredRole="admin">
                <AdminPanelSimplified />
              </PrivateRoute>
            }
          />

          {/* Dashboard do Vendedor - REQUER AUTENTICAÇÃO */}
          <Route
            path="/dashboard"
            element={
              <PrivateRoute>
                <VendorDashboard />
              </PrivateRoute>
            }
          />

          {/* Rotas de autenticação */}
          <Route path="/login" element={<LoginPage />} />

          {/* Painel administrativo (DESABILITADO - não usar mais) */}
          {/* <Route path="/admin" element={<PrivateRoute><AdminPanel /></PrivateRoute>} /> */}

          {/* Rotas de apresentação customizada para clientes */}
          <Route path="/apresentacao/:id" element={<ClientAccessPage />} />
          <Route path="/apresentacao/:id/view" element={<PresentationView />} />

          {/* Rota 404 - Redireciona para home */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </BrowserRouter>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;

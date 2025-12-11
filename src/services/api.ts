import axios from 'axios';
import type { AxiosInstance } from 'axios';
import type {
  LoginRequest,
  LoginResponse,
  CreatePresentationRequest,
  CreatePresentationResponse,
  PresentationData,
  ClientValidationResponse,
} from '../types/api';

// URL base da API (pode ser configurada via variável de ambiente)
const API_BASE_URL = import.meta.env.VITE_API_URL || 'https://apresentacao-api.celintelligence.com';

// Criar instância do axios
const api: AxiosInstance = axios.create({
  baseURL: `${API_BASE_URL}/api`,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 10000,
});

// Interceptor para adicionar token JWT em todas as requisições
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('auth_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Interceptor para tratar erros de resposta
api.interceptors.response.use(
  (response) => response,
  (error) => {
    // Se token expirou ou inválido, redirecionar para login
    if (error.response?.status === 401) {
      localStorage.removeItem('auth_token');
      localStorage.removeItem('user_data');
      // Só redireciona se não estiver na página de login
      if (!window.location.pathname.includes('/login')) {
        window.location.href = '/login';
      }
    }
    return Promise.reject(error);
  }
);

// Serviços da API

export const authService = {
  /**
   * Login do vendedor
   */
  async login(credentials: LoginRequest): Promise<LoginResponse> {
    const response = await api.post<LoginResponse>('/auth/login', credentials);

    // Salvar token e dados do usuário no localStorage
    localStorage.setItem('auth_token', response.data.token);
    localStorage.setItem('user_data', JSON.stringify(response.data.user));

    return response.data;
  },

  /**
   * Logout (limpar dados locais)
   */
  logout(): void {
    localStorage.removeItem('auth_token');
    localStorage.removeItem('user_data');
  },

  /**
   * Verificar se está autenticado
   */
  isAuthenticated(): boolean {
    return !!localStorage.getItem('auth_token');
  },

  /**
   * Obter dados do usuário logado
   */
  getCurrentUser(): LoginResponse['user'] | null {
    const userData = localStorage.getItem('user_data');
    return userData ? JSON.parse(userData) : null;
  },
};

export const presentationService = {
  /**
   * Criar nova apresentação customizada
   */
  async create(data: CreatePresentationRequest): Promise<CreatePresentationResponse> {
    const response = await api.post<CreatePresentationResponse>('/presentations', data);
    return response.data;
  },

  /**
   * Buscar apresentação por ID
   */
  async getById(id: string): Promise<PresentationData> {
    const response = await api.get<PresentationData>(`/presentations/${id}`);
    return response.data;
  },

  /**
   * Listar todas apresentações (apenas para vendedores autenticados)
   */
  async list(): Promise<any[]> {
    const response = await api.get('/presentations');
    return response.data;
  },
};

export const clientService = {
  /**
   * Validar palavra de segurança do cliente
   */
  async validatePassword(password: string): Promise<ClientValidationResponse> {
    const response = await api.post<ClientValidationResponse>('/client/validate', {
      password,
    });
    return response.data;
  },
};

export default api;

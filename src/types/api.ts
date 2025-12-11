// Tipos para requisições e respostas da API

export interface VendorInfo {
  name: string;
  email: string;
  phone: string;
  whatsapp: string;
}

export interface LoginRequest {
  username: string;
  password: string;
}

export interface LoginResponse {
  token: string;
  user: {
    id: number;
    username: string;
    name: string;
  };
}

export interface CreatePresentationRequest {
  vendorInfo: VendorInfo;
  selectedSlides: string[];
}

export interface CreatePresentationResponse {
  id: string;
  url: string;
  createdAt: string;
}

export interface PresentationData {
  id: string;
  vendorInfo: VendorInfo;
  selectedSlides: string[];
  createdAt: string;
}

export interface ClientValidationRequest {
  password: string;
}

export interface ClientValidationResponse {
  valid: boolean;
  message?: string;
  error?: string;
}

export interface ApiError {
  error: string;
  message?: string;
}

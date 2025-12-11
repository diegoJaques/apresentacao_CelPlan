import { Request } from 'express';

export interface VendorInfo {
  name: string;
  email: string;
  phone: string;
  whatsapp: string;
}

export interface Presentation {
  id: string;
  vendor_name: string;
  vendor_email: string;
  vendor_phone: string;
  vendor_whatsapp: string;
  selected_slides: string[];
  created_at: Date;
}

export interface CreatePresentationRequest {
  vendorInfo: VendorInfo;
  selectedSlides: string[];
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

export interface ClientValidationRequest {
  password: string;
}

export interface AuthRequest extends Request {
  userId?: number;
  username?: string;
}

export interface User {
  id: number;
  username: string;
  password_hash: string;
  name: string;
}

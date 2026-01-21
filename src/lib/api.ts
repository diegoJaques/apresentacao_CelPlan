// API Service for Backend Communication

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001/api';

// Token management
class TokenManager {
  private static readonly TOKEN_KEY = 'celplan_auth_token';

  static setToken(token: string): void {
    localStorage.setItem(this.TOKEN_KEY, token);
  }

  static getToken(): string | null {
    return localStorage.getItem(this.TOKEN_KEY);
  }

  static removeToken(): void {
    localStorage.removeItem(this.TOKEN_KEY);
  }

  static isAuthenticated(): boolean {
    return !!this.getToken();
  }
}

// API Error class
class ApiError extends Error {
  constructor(
    message: string,
    public status?: number,
    public data?: any
  ) {
    super(message);
    this.name = 'ApiError';
  }
}

// Base API request function
async function apiRequest<T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<T> {
  const token = TokenManager.getToken();

  const headers: HeadersInit = {
    'Content-Type': 'application/json',
    ...options.headers,
  };

  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  const response = await fetch(`${API_URL}${endpoint}`, {
    ...options,
    headers,
  });

  const data = await response.json();

  if (!response.ok) {
    throw new ApiError(
      data.error?.message || data.message || 'API request failed',
      response.status,
      data
    );
  }

  return data;
}

// Authentication API
export const authApi = {
  async login(username: string, password: string) {
    const response = await apiRequest<{
      success: boolean;
      token: string;
      user: { username: string; role: string; vendor_id?: string };
      expiresIn: string;
    }>('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ username, password }),
    });

    if (response.token) {
      TokenManager.setToken(response.token);
    }

    return response;
  },

  async verify() {
    return apiRequest<{
      success: boolean;
      valid: boolean;
      user: { username: string; role: string };
    }>('/auth/verify', {
      method: 'POST',
    });
  },

  async refresh() {
    const response = await apiRequest<{
      success: boolean;
      token: string;
      expiresIn: string;
    }>('/auth/refresh', {
      method: 'POST',
    });

    if (response.token) {
      TokenManager.setToken(response.token);
    }

    return response;
  },

  async logout() {
    const response = await apiRequest<{
      success: boolean;
      message: string;
    }>('/auth/logout', {
      method: 'POST',
    });

    TokenManager.removeToken();
    return response;
  },

  async getMe() {
    return apiRequest<{
      success: boolean;
      user: { username: string; role: string; vendor_id?: string };
    }>('/auth/me');
  },

  isAuthenticated() {
    return TokenManager.isAuthenticated();
  },

  getToken() {
    return TokenManager.getToken();
  },
};

// Presentations API
export const presentationsApi = {
  async list() {
    return apiRequest<{
      success: boolean;
      presentations: Array<{
        id: string;
        vendor_id: string;
        title: string;
        description: string;
        is_template: boolean;
        is_active: boolean;
        created_at: string;
        updated_at: string;
      }>;
    }>('/presentations');
  },

  async get(id: string) {
    return apiRequest<{
      success: boolean;
      presentation: {
        id: string;
        vendor_id: string;
        title: string;
        description: string;
        is_template: boolean;
        is_active: boolean;
        slides: Array<any>;
        cases: Array<any>;
        edits: Array<any>;
        created_at: string;
        updated_at: string;
      };
    }>(`/presentations/${id}`);
  },

  async create(data: {
    title?: string;
    description?: string;
    copy_from_template?: boolean;
  }) {
    return apiRequest<{
      success: boolean;
      presentation: any;
    }>('/presentations', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },

  async update(
    id: string,
    data: {
      title?: string;
      description?: string;
      status?: 'draft' | 'published' | 'archived';
      published_at?: string;
      metadata?: any;
    }
  ) {
    return apiRequest<{
      success: boolean;
      presentation: any;
    }>(`/presentations/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  },

  async delete(id: string) {
    return apiRequest<{
      success: boolean;
      message: string;
    }>(`/presentations/${id}`, {
      method: 'DELETE',
    });
  },

  async updateSlide(
    presentationId: string,
    slideId: string,
    data: {
      name?: string;
      content?: any;
      template?: string;
      order_index?: number;
      is_active?: boolean;
      metadata?: any;
    }
  ) {
    return apiRequest<{
      success: boolean;
      slide: any;
    }>(`/presentations/${presentationId}/slides/${slideId}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  },

  async saveInlineEdit(
    presentationId: string,
    data: {
      element_id: string;
      content: string;
      element_type?: string;
      metadata?: any;
    }
  ) {
    return apiRequest<{
      success: boolean;
      edit: any;
    }>(`/presentations/${presentationId}/inline-edits`, {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },

  async updateCases(presentationId: string, caseIds: string[]) {
    return apiRequest<{
      success: boolean;
      presentation: any;
    }>(`/presentations/${presentationId}/cases`, {
      method: 'PUT',
      body: JSON.stringify({ case_ids: caseIds }),
    });
  },
};

// Cases API
export const casesApi = {
  async list(params?: {
    segment?: string;
    is_active?: boolean;
    limit?: number;
    offset?: number;
    search?: string;
  }) {
    const queryParams = new URLSearchParams();
    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined) {
          queryParams.append(key, String(value));
        }
      });
    }

    return apiRequest<{
      success: boolean;
      cases: Array<{
        id: string;
        client: string;
        segment: string;
        title: string;
        description?: string;
        results: string[];
        technologies: string[];
        image_url?: string;
        logo_url?: string;
        year: number;
        is_active: boolean;
        order_index: number;
        metrics?: any;
        tags: string[];
      }>;
      total: number;
      pagination: {
        limit: number;
        offset: number;
        totalPages: number;
        currentPage: number;
      };
    }>(`/cases?${queryParams.toString()}`);
  },

  async get(id: string) {
    return apiRequest<{
      success: boolean;
      case: {
        id: string;
        client: string;
        segment: string;
        title: string;
        description?: string;
        results: string[];
        technologies: string[];
        image_url?: string;
        logo_url?: string;
        year: number;
        is_active: boolean;
        order_index: number;
        metrics?: any;
        tags: string[];
        media: Array<any>;
      };
    }>(`/cases/${id}`);
  },

  async create(data: {
    client: string;
    segment: string;
    title: string;
    description?: string;
    results?: string[];
    technologies?: string[];
    image_url?: string;
    logo_url?: string;
    year?: number;
    is_active?: boolean;
    metrics?: any;
    tags?: string[];
  }) {
    return apiRequest<{
      success: boolean;
      case: any;
    }>('/cases', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },

  async update(id: string, data: Partial<{
    client: string;
    segment: string;
    title: string;
    description?: string;
    results?: string[];
    technologies?: string[];
    image_url?: string;
    logo_url?: string;
    year?: number;
    is_active?: boolean;
    order_index?: number;
    metrics?: any;
    tags?: string[];
  }>) {
    return apiRequest<{
      success: boolean;
      case: any;
    }>(`/cases/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  },

  async delete(id: string) {
    return apiRequest<{
      success: boolean;
      message: string;
    }>(`/cases/${id}`, {
      method: 'DELETE',
    });
  },

  async reorder(cases: Array<{ id: string; order_index: number }>) {
    return apiRequest<{
      success: boolean;
      cases: Array<any>;
    }>('/cases/reorder', {
      method: 'PUT',
      body: JSON.stringify({ cases }),
    });
  },

  async getSegments() {
    return apiRequest<{
      success: boolean;
      segments: Array<{
        name: string;
        count: number;
      }>;
    }>('/cases/segments/list');
  },
};

// Media/Upload API
export const mediaApi = {
  async list(params?: {
    entity_type?: string;
    entity_id?: string;
    uploaded_by?: string;
    limit?: number;
    offset?: number;
  }) {
    const queryParams = new URLSearchParams();
    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined) {
          queryParams.append(key, String(value));
        }
      });
    }

    return apiRequest<{
      success: boolean;
      total: number;
      media: Array<{
        id: string;
        filename: string;
        original_name: string;
        public_url: string;
        thumbnail_url?: string;
        mime_type: string;
        size_bytes: number;
        width?: number;
        height?: number;
        uploaded_by: string;
        entity_type?: string;
        entity_id?: string;
      }>;
      pagination: any;
    }>(`/media?${queryParams.toString()}`);
  },

  async uploadImage(
    file: File,
    options?: {
      folder?: string;
      entity_type?: string;
      entity_id?: string;
      max_width?: number;
      max_height?: number;
      quality?: number;
      generate_thumbnail?: boolean;
    }
  ) {
    const formData = new FormData();
    formData.append('file', file);

    if (options) {
      Object.entries(options).forEach(([key, value]) => {
        if (value !== undefined) {
          formData.append(key, String(value));
        }
      });
    }

    const token = TokenManager.getToken();
    const response = await fetch(`${API_URL}/media/upload/image`, {
      method: 'POST',
      headers: token ? { Authorization: `Bearer ${token}` } : {},
      body: formData,
    });

    const data = await response.json();

    if (!response.ok) {
      throw new ApiError(
        data.message || 'Upload failed',
        response.status,
        data
      );
    }

    return data as {
      success: boolean;
      media: {
        id: string;
        url: string;
        thumbnailUrl?: string;
        size: number;
        dimensions?: {
          width: number;
          height: number;
        };
      };
    };
  },

  async uploadFile(
    file: File,
    options?: {
      folder?: string;
      entity_type?: string;
      entity_id?: string;
    }
  ) {
    const formData = new FormData();
    formData.append('file', file);

    if (options) {
      Object.entries(options).forEach(([key, value]) => {
        if (value !== undefined) {
          formData.append(key, String(value));
        }
      });
    }

    const token = TokenManager.getToken();
    const response = await fetch(`${API_URL}/media/upload/file`, {
      method: 'POST',
      headers: token ? { Authorization: `Bearer ${token}` } : {},
      body: formData,
    });

    const data = await response.json();

    if (!response.ok) {
      throw new ApiError(
        data.message || 'Upload failed',
        response.status,
        data
      );
    }

    return data as {
      success: boolean;
      media: {
        id: string;
        url: string;
        size: number;
      };
    };
  },

  async uploadMultiple(
    files: File[],
    options?: {
      folder?: string;
      entity_type?: string;
      entity_id?: string;
    }
  ) {
    const formData = new FormData();
    files.forEach((file) => {
      formData.append('files', file);
    });

    if (options) {
      Object.entries(options).forEach(([key, value]) => {
        if (value !== undefined) {
          formData.append(key, String(value));
        }
      });
    }

    const token = TokenManager.getToken();
    const response = await fetch(`${API_URL}/media/upload/multiple`, {
      method: 'POST',
      headers: token ? { Authorization: `Bearer ${token}` } : {},
      body: formData,
    });

    const data = await response.json();

    if (!response.ok) {
      throw new ApiError(
        data.message || 'Upload failed',
        response.status,
        data
      );
    }

    return data as {
      success: boolean;
      uploaded: Array<any>;
      errors?: Array<{
        filename: string;
        error: string;
      }>;
    };
  },

  async delete(id: string) {
    return apiRequest<{
      success: boolean;
      message: string;
    }>(`/media/${id}`, {
      method: 'DELETE',
    });
  },

  async getSignedUrl(id: string, expiresIn?: number) {
    const params = expiresIn ? `?expires=${expiresIn}` : '';
    return apiRequest<{
      success: boolean;
      url: string;
      expiresIn: number;
    }>(`/media/${id}/signed-url${params}`);
  },

  async associateWithEntity(
    mediaId: string,
    entityType: string,
    entityId: string
  ) {
    return apiRequest<{
      success: boolean;
      media: any;
    }>(`/media/${mediaId}/associate`, {
      method: 'PUT',
      body: JSON.stringify({
        entity_type: entityType,
        entity_id: entityId,
      }),
    });
  },
};

// Export default API object
export default {
  auth: authApi,
  presentations: presentationsApi,
  cases: casesApi,
  media: mediaApi,
};

// Export token manager
export { TokenManager, ApiError };
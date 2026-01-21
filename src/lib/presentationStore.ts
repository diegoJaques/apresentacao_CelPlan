// Sistema de Armazenamento de Dados da Apresentação
// Usa localStorage para dados JSON e IndexedDB para imagens

interface SlideContent {
  id: string;
  type: string;
  title?: string;
  subtitle?: string;
  description?: string;
  items?: any[];
  image?: string;
  backgroundColor?: string;
  textColor?: string;
  customCSS?: string;
  components?: any[];
}

interface Slide {
  id: string;
  name: string;
  template: string;
  isVisible: boolean;
  order: number;
  content: SlideContent;
  animations?: {
    entry?: string;
    exit?: string;
    duration?: number;
  };
}

interface PresentationTheme {
  primaryColor: string;
  secondaryColor: string;
  accentColor: string;
  backgroundColor: string;
  textColor: string;
  fontFamily: string;
  fontSize: {
    small: string;
    medium: string;
    large: string;
    xlarge: string;
  };
}

interface PresentationData {
  id: string;
  title: string;
  description: string;
  version: number;
  theme: PresentationTheme;
  slides: Slide[];
  settings: {
    autoPlay?: boolean;
    autoPlayInterval?: number;
    enableKeyboardNav?: boolean;
    enableSwipeNav?: boolean;
    showNavigation?: boolean;
    showProgress?: boolean;
  };
  metadata: {
    createdAt: string;
    updatedAt: string;
    author?: string;
    company?: string;
  };
}

class PresentationStore {
  private readonly STORAGE_KEY = 'celplan_presentation_v3';
  private readonly DB_NAME = 'CelPlanPresentationDB';
  private readonly DB_VERSION = 1;
  private db: IDBDatabase | null = null;

  constructor() {
    this.initializeDB();
  }

  // Inicializa o IndexedDB para armazenar imagens
  private async initializeDB(): Promise<void> {
    return new Promise((resolve, reject) => {
      const request = indexedDB.open(this.DB_NAME, this.DB_VERSION);

      request.onerror = () => {
        console.error('Erro ao abrir IndexedDB:', request.error);
        reject(request.error);
      };

      request.onsuccess = () => {
        this.db = request.result;
        resolve();
      };

      request.onupgradeneeded = (event) => {
        const db = (event.target as IDBOpenDBRequest).result;

        // Store para imagens
        if (!db.objectStoreNames.contains('images')) {
          db.createObjectStore('images', { keyPath: 'id' });
        }

        // Store para backups
        if (!db.objectStoreNames.contains('backups')) {
          db.createObjectStore('backups', { keyPath: 'id' });
        }
      };
    });
  }

  // Obtém os dados da apresentação
  async getPresentation(): Promise<PresentationData | null> {
    try {
      const data = localStorage.getItem(this.STORAGE_KEY);
      if (!data) {
        return this.getDefaultPresentation();
      }
      return JSON.parse(data);
    } catch (error) {
      console.error('Erro ao carregar apresentação:', error);
      return this.getDefaultPresentation();
    }
  }

  // Salva os dados da apresentação
  async savePresentation(data: PresentationData): Promise<boolean> {
    try {
      data.metadata.updatedAt = new Date().toISOString();
      data.version = (data.version || 0) + 1;

      localStorage.setItem(this.STORAGE_KEY, JSON.stringify(data));

      // Criar backup automático
      await this.createBackup(data);

      return true;
    } catch (error) {
      console.error('Erro ao salvar apresentação:', error);
      return false;
    }
  }

  // Atualiza um slide específico
  async updateSlide(slideId: string, updates: Partial<Slide>): Promise<boolean> {
    try {
      const presentation = await this.getPresentation();
      if (!presentation) return false;

      const slideIndex = presentation.slides.findIndex(s => s.id === slideId);
      if (slideIndex === -1) return false;

      presentation.slides[slideIndex] = {
        ...presentation.slides[slideIndex],
        ...updates
      };

      return await this.savePresentation(presentation);
    } catch (error) {
      console.error('Erro ao atualizar slide:', error);
      return false;
    }
  }

  // Adiciona um novo slide
  async addSlide(slide: Slide): Promise<boolean> {
    try {
      const presentation = await this.getPresentation();
      if (!presentation) return false;

      presentation.slides.push(slide);
      return await this.savePresentation(presentation);
    } catch (error) {
      console.error('Erro ao adicionar slide:', error);
      return false;
    }
  }

  // Remove um slide
  async removeSlide(slideId: string): Promise<boolean> {
    try {
      const presentation = await this.getPresentation();
      if (!presentation) return false;

      presentation.slides = presentation.slides.filter(s => s.id !== slideId);

      // Reordenar slides
      presentation.slides.forEach((slide, index) => {
        slide.order = index;
      });

      return await this.savePresentation(presentation);
    } catch (error) {
      console.error('Erro ao remover slide:', error);
      return false;
    }
  }

  // Reordena slides
  async reorderSlides(slideIds: string[]): Promise<boolean> {
    try {
      const presentation = await this.getPresentation();
      if (!presentation) return false;

      const reorderedSlides: Slide[] = [];
      slideIds.forEach((id, index) => {
        const slide = presentation.slides.find(s => s.id === id);
        if (slide) {
          slide.order = index;
          reorderedSlides.push(slide);
        }
      });

      presentation.slides = reorderedSlides;
      return await this.savePresentation(presentation);
    } catch (error) {
      console.error('Erro ao reordenar slides:', error);
      return false;
    }
  }

  // Atualiza o tema
  async updateTheme(theme: Partial<PresentationTheme>): Promise<boolean> {
    try {
      const presentation = await this.getPresentation();
      if (!presentation) return false;

      presentation.theme = {
        ...presentation.theme,
        ...theme
      };

      return await this.savePresentation(presentation);
    } catch (error) {
      console.error('Erro ao atualizar tema:', error);
      return false;
    }
  }

  // Salva uma imagem no IndexedDB
  async saveImage(id: string, blob: Blob): Promise<string> {
    if (!this.db) await this.initializeDB();

    return new Promise((resolve, reject) => {
      const transaction = this.db!.transaction(['images'], 'readwrite');
      const store = transaction.objectStore('images');

      const reader = new FileReader();
      reader.onloadend = () => {
        const base64 = reader.result as string;
        const request = store.put({ id, data: base64, timestamp: Date.now() });

        request.onsuccess = () => resolve(base64);
        request.onerror = () => reject(request.error);
      };

      reader.readAsDataURL(blob);
    });
  }

  // Obtém uma imagem do IndexedDB
  async getImage(id: string): Promise<string | null> {
    if (!this.db) await this.initializeDB();

    return new Promise((resolve, reject) => {
      const transaction = this.db!.transaction(['images'], 'readonly');
      const store = transaction.objectStore('images');
      const request = store.get(id);

      request.onsuccess = () => {
        const result = request.result;
        resolve(result ? result.data : null);
      };
      request.onerror = () => reject(request.error);
    });
  }

  // Cria um backup
  async createBackup(data?: PresentationData): Promise<string> {
    if (!this.db) await this.initializeDB();

    const presentation = data || await this.getPresentation();
    if (!presentation) throw new Error('Nenhuma apresentação para backup');

    const backupId = `backup_${Date.now()}`;

    return new Promise((resolve, reject) => {
      const transaction = this.db!.transaction(['backups'], 'readwrite');
      const store = transaction.objectStore('backups');

      const request = store.put({
        id: backupId,
        data: presentation,
        timestamp: Date.now()
      });

      request.onsuccess = () => resolve(backupId);
      request.onerror = () => reject(request.error);
    });
  }

  // Restaura um backup
  async restoreBackup(backupId: string): Promise<boolean> {
    if (!this.db) await this.initializeDB();

    return new Promise((resolve, reject) => {
      const transaction = this.db!.transaction(['backups'], 'readonly');
      const store = transaction.objectStore('backups');
      const request = store.get(backupId);

      request.onsuccess = async () => {
        const backup = request.result;
        if (backup && backup.data) {
          const success = await this.savePresentation(backup.data);
          resolve(success);
        } else {
          resolve(false);
        }
      };
      request.onerror = () => reject(request.error);
    });
  }

  // Lista todos os backups
  async listBackups(): Promise<Array<{id: string, timestamp: number}>> {
    if (!this.db) await this.initializeDB();

    return new Promise((resolve, reject) => {
      const transaction = this.db!.transaction(['backups'], 'readonly');
      const store = transaction.objectStore('backups');
      const request = store.getAll();

      request.onsuccess = () => {
        const backups = request.result.map(b => ({
          id: b.id,
          timestamp: b.timestamp
        }));
        resolve(backups.sort((a, b) => b.timestamp - a.timestamp));
      };
      request.onerror = () => reject(request.error);
    });
  }

  // Exporta dados para JSON
  async exportToJSON(): Promise<string> {
    const presentation = await this.getPresentation();
    return JSON.stringify(presentation, null, 2);
  }

  // Importa dados de JSON
  async importFromJSON(jsonString: string): Promise<boolean> {
    try {
      const data = JSON.parse(jsonString) as PresentationData;
      return await this.savePresentation(data);
    } catch (error) {
      console.error('Erro ao importar JSON:', error);
      return false;
    }
  }

  // Reseta para configurações padrão
  async resetToDefault(): Promise<boolean> {
    const defaultPresentation = this.getDefaultPresentation();
    return await this.savePresentation(defaultPresentation);
  }

  // Obtém apresentação padrão
  private getDefaultPresentation(): PresentationData {
    return {
      id: 'default',
      title: 'CelPlan - Apresentação Corporativa',
      description: 'Tecnologia e Inovação em Telecomunicações',
      version: 1,
      theme: {
        primaryColor: '#7c3aed',
        secondaryColor: '#3b82f6',
        accentColor: '#f97316',
        backgroundColor: '#ffffff',
        textColor: '#1f2937',
        fontFamily: 'Inter, system-ui, sans-serif',
        fontSize: {
          small: '0.875rem',
          medium: '1rem',
          large: '1.5rem',
          xlarge: '3rem'
        }
      },
      slides: this.getDefaultSlides(),
      settings: {
        autoPlay: false,
        autoPlayInterval: 5000,
        enableKeyboardNav: true,
        enableSwipeNav: true,
        showNavigation: true,
        showProgress: true
      },
      metadata: {
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        author: 'CelPlan Team',
        company: 'CelPlan Technologies'
      }
    };
  }

  // Obtém slides padrão
  private getDefaultSlides(): Slide[] {
    // Aqui vamos mapear os slides existentes para o novo formato
    const slideNames = [
      'Capa',
      'Quem Somos',
      'Capital Intelectual',
      'Desafios',
      'Proposta de Valor',
      '7 Pilares',
      'Conectividade',
      'IA e Dados',
      'IoT Low Power',
      'Video Analytics',
      'Serviços',
      'Contato'
    ];

    return slideNames.map((name, index) => ({
      id: `slide_${index + 1}`,
      name,
      template: 'default',
      isVisible: true,
      order: index,
      content: {
        id: `content_${index + 1}`,
        type: 'standard',
        title: name,
        subtitle: '',
        description: '',
        items: [],
        backgroundColor: '',
        textColor: '',
        customCSS: '',
        components: []
      },
      animations: {
        entry: 'fadeIn',
        exit: 'fadeOut',
        duration: 500
      }
    }));
  }
}

// Exporta uma instância única (Singleton)
export const presentationStore = new PresentationStore();

// Exporta tipos para uso em outros componentes
export type { Slide, SlideContent, PresentationTheme, PresentationData };
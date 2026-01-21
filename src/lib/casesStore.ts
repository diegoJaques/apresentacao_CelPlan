// Store para gerenciar Cases de Sucesso
interface CaseItem {
  id: string;
  client: string;
  segment: string; // Telecom, Energia, Governo, etc.
  title: string;
  description: string;
  results: string[];
  imageUrl?: string;
  logoUrl?: string;
  year: number;
  technologies: string[];
  isActive: boolean;
  order: number;
}

interface CasesData {
  cases: CaseItem[];
  selectedCases: string[]; // IDs dos cases selecionados para apresentação
}

const STORAGE_KEY = 'celplan_cases_data';

// Cases padrão de exemplo
const defaultCases: CaseItem[] = [
  {
    id: 'case-1',
    client: 'Vivo',
    segment: 'Telecom',
    title: 'Otimização de Rede 5G',
    description: 'Implementação completa de planejamento e otimização de rede 5G em São Paulo',
    results: [
      '40% de melhoria em cobertura',
      'Redução de 25% em interferências',
      'ROI em 8 meses'
    ],
    imageUrl: '/images/cases/vivo-5g.jpg',
    logoUrl: '/images/logos/vivo.png',
    year: 2024,
    technologies: ['5G NR', 'AI/ML', 'Cloud RAN'],
    isActive: true,
    order: 1
  },
  {
    id: 'case-2',
    client: 'TIM Brasil',
    segment: 'Telecom',
    title: 'Expansão Rural 4G',
    description: 'Projeto de expansão de cobertura 4G em áreas rurais do interior',
    results: [
      '500+ sites planejados',
      '95% de acurácia de predição',
      '30% redução de custos'
    ],
    imageUrl: '/images/cases/tim-rural.jpg',
    logoUrl: '/images/logos/tim.png',
    year: 2023,
    technologies: ['LTE', 'Propagação', 'Drive Test'],
    isActive: true,
    order: 2
  },
  {
    id: 'case-3',
    client: 'Claro',
    segment: 'Telecom',
    title: 'Smart Cities IoT',
    description: 'Implementação de infraestrutura IoT para cidades inteligentes',
    results: [
      '10.000+ sensores instalados',
      'Cobertura 99% área urbana',
      'Economia de 35% em energia'
    ],
    imageUrl: '/images/cases/claro-iot.jpg',
    logoUrl: '/images/logos/claro.png',
    year: 2024,
    technologies: ['NB-IoT', 'LoRaWAN', 'Smart Meters'],
    isActive: true,
    order: 3
  },
  {
    id: 'case-4',
    client: 'Petrobras',
    segment: 'Energia',
    title: 'Conectividade Offshore',
    description: 'Solução de conectividade para plataformas de petróleo em alto mar',
    results: [
      '100% uptime garantido',
      'Latência < 20ms',
      'Backup satelital integrado'
    ],
    imageUrl: '/images/cases/petrobras-offshore.jpg',
    logoUrl: '/images/logos/petrobras.png',
    year: 2023,
    technologies: ['Microondas', 'Satélite', 'LTE Privado'],
    isActive: true,
    order: 4
  },
  {
    id: 'case-5',
    client: 'Governo Federal',
    segment: 'Governo',
    title: 'Rede Segura Nacional',
    description: 'Implementação de rede privada segura para comunicações governamentais',
    results: [
      'Criptografia end-to-end',
      '15 estados conectados',
      'Zero incidentes segurança'
    ],
    imageUrl: '/images/cases/gov-secure.jpg',
    logoUrl: '/images/logos/brasil.png',
    year: 2024,
    technologies: ['VPN', 'Criptografia', 'Firewall'],
    isActive: true,
    order: 5
  },
  {
    id: 'case-6',
    client: 'Vale',
    segment: 'Mineração',
    title: 'Automação de Minas',
    description: 'Rede privada LTE para operação de equipamentos autônomos em minas',
    results: [
      'Zero acidentes',
      '45% aumento produtividade',
      'Operação 24/7'
    ],
    imageUrl: '/images/cases/vale-automation.jpg',
    logoUrl: '/images/logos/vale.png',
    year: 2023,
    technologies: ['LTE Privado', 'Edge Computing', 'AI'],
    isActive: true,
    order: 6
  },
  {
    id: 'case-7',
    client: 'Oi',
    segment: 'Telecom',
    title: 'Modernização Core Network',
    description: 'Migração completa do core para arquitetura cloud-native',
    results: [
      '60% redução OPEX',
      'Escalabilidade ilimitada',
      'Deploy em minutos'
    ],
    imageUrl: '/images/cases/oi-core.jpg',
    logoUrl: '/images/logos/oi.png',
    year: 2024,
    technologies: ['5G Core', 'Kubernetes', 'NFV'],
    isActive: false,
    order: 7
  },
  {
    id: 'case-8',
    client: 'Correios',
    segment: 'Logística',
    title: 'Rastreamento IoT',
    description: 'Sistema de rastreamento em tempo real para encomendas',
    results: [
      '99.9% precisão tracking',
      'Redução 50% extravios',
      'Satisfação cliente 92%'
    ],
    imageUrl: '/images/cases/correios-iot.jpg',
    logoUrl: '/images/logos/correios.png',
    year: 2023,
    technologies: ['RFID', 'GPS', 'Analytics'],
    isActive: false,
    order: 8
  }
];

class CasesStore {
  private readonly STORAGE_KEY = STORAGE_KEY;

  async getCases(): Promise<CasesData> {
    try {
      const stored = localStorage.getItem(this.STORAGE_KEY);
      if (stored) {
        return JSON.parse(stored);
      }
    } catch (error) {
      console.error('Erro ao carregar cases:', error);
    }

    // Retorna dados padrão se não houver nada salvo
    const defaultData: CasesData = {
      cases: defaultCases,
      selectedCases: defaultCases
        .filter(c => c.isActive)
        .slice(0, 6) // Seleciona os primeiros 6 ativos por padrão
        .map(c => c.id)
    };

    // Salva os dados padrão
    await this.saveCases(defaultData);
    return defaultData;
  }

  async saveCases(data: CasesData): Promise<boolean> {
    try {
      localStorage.setItem(this.STORAGE_KEY, JSON.stringify(data));
      return true;
    } catch (error) {
      console.error('Erro ao salvar cases:', error);
      return false;
    }
  }

  async addCase(caseItem: Omit<CaseItem, 'id' | 'order'>): Promise<CaseItem> {
    const data = await this.getCases();
    const newCase: CaseItem = {
      ...caseItem,
      id: `case-${Date.now()}`,
      order: data.cases.length + 1
    };

    data.cases.push(newCase);
    await this.saveCases(data);
    return newCase;
  }

  async updateCase(id: string, updates: Partial<CaseItem>): Promise<boolean> {
    const data = await this.getCases();
    const index = data.cases.findIndex(c => c.id === id);

    if (index === -1) return false;

    data.cases[index] = {
      ...data.cases[index],
      ...updates
    };

    return await this.saveCases(data);
  }

  async deleteCase(id: string): Promise<boolean> {
    const data = await this.getCases();
    data.cases = data.cases.filter(c => c.id !== id);
    data.selectedCases = data.selectedCases.filter(cId => cId !== id);
    return await this.saveCases(data);
  }

  async selectCasesForPresentation(caseIds: string[]): Promise<boolean> {
    const data = await this.getCases();
    data.selectedCases = caseIds;
    return await this.saveCases(data);
  }

  async getSelectedCases(): Promise<CaseItem[]> {
    const data = await this.getCases();
    return data.cases
      .filter(c => data.selectedCases.includes(c.id))
      .sort((a, b) => a.order - b.order);
  }

  async reorderCases(caseIds: string[]): Promise<boolean> {
    const data = await this.getCases();

    // Atualiza a ordem baseado na nova sequência
    caseIds.forEach((id, index) => {
      const caseItem = data.cases.find(c => c.id === id);
      if (caseItem) {
        caseItem.order = index + 1;
      }
    });

    return await this.saveCases(data);
  }

  // Método para resetar aos cases padrão
  async resetToDefault(): Promise<boolean> {
    const defaultData: CasesData = {
      cases: defaultCases,
      selectedCases: defaultCases
        .filter(c => c.isActive)
        .slice(0, 6)
        .map(c => c.id)
    };
    return await this.saveCases(defaultData);
  }
}

export const casesStore = new CasesStore();
export type { CaseItem, CasesData };
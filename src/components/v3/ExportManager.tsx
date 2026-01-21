import React, { useState } from 'react';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
import PptxGenJS from 'pptxgenjs';
import { Download, FileText, Presentation, Loader2 } from 'lucide-react';

interface ExportManagerProps {
  slides: React.ComponentType[];
  slideNames: string[];
  currentSlide: number;
}

export const ExportManager: React.FC<ExportManagerProps> = ({
  slides,
  slideNames,
  currentSlide
}) => {
  const [isExporting, setIsExporting] = useState(false);
  const [exportProgress, setExportProgress] = useState(0);
  const [exportMessage, setExportMessage] = useState('');

  // Função auxiliar para pausar animações
  const pauseAnimations = () => {
    // Pausar todas as animações CSS
    const style = document.createElement('style');
    style.id = 'pause-animations-style';
    style.innerHTML = `
      * {
        animation-play-state: paused !important;
        transition: none !important;
        animation: none !important;
      }
      .animate, .transition, .motion-safe\\:animate-* {
        animation: none !important;
        transition: none !important;
      }
    `;
    document.head.appendChild(style);
  };

  // Função auxiliar para restaurar animações
  const resumeAnimations = () => {
    const style = document.getElementById('pause-animations-style');
    if (style) {
      style.remove();
    }
  };

  // Função para aguardar recursos carregarem
  const waitForResources = async () => {
    // Aguardar fontes
    await document.fonts.ready;

    // Aguardar imagens
    const images = document.querySelectorAll('img');
    await Promise.all(
      Array.from(images).map(img =>
        img.complete ? Promise.resolve() : new Promise(resolve => {
          img.onload = resolve;
          img.onerror = resolve;
        })
      )
    );

    // Aguardar um frame de renderização
    await new Promise(resolve => requestAnimationFrame(resolve));
    // Aguardar um pouco mais para garantir que tudo está renderizado
    await new Promise(resolve => setTimeout(resolve, 500));
  };

  // Função para capturar um slide específico
  const captureSlide = async (slideIndex: number): Promise<string> => {
    // Navegar para o slide
    const slideButtons = document.querySelectorAll('[data-slide-index]');
    const targetButton = Array.from(slideButtons).find(
      btn => btn.getAttribute('data-slide-index') === slideIndex.toString()
    ) as HTMLElement;

    if (targetButton) {
      targetButton.click();
    }

    // Aguardar a transição completar
    await new Promise(resolve => setTimeout(resolve, 800));
    await waitForResources();

    // Capturar o slide atual
    const slideElement = document.querySelector('.slide-container');
    if (!slideElement) {
      throw new Error('Slide container not found');
    }

    const canvas = await html2canvas(slideElement as HTMLElement, {
      useCORS: true,
      scale: 2, // Alta qualidade
      logging: false,
      backgroundColor: '#ffffff',
      windowWidth: 1920,
      windowHeight: 1080,
      width: 1920,
      height: 1080,
      onclone: (clonedDoc) => {
        // Garantir que o slide clonado está visível
        const clonedSlide = clonedDoc.querySelector('.slide-container') as HTMLElement;
        if (clonedSlide) {
          clonedSlide.style.opacity = '1';
          clonedSlide.style.transform = 'none';
        }
      }
    });

    return canvas.toDataURL('image/png', 1.0);
  };

  // Exportar para PDF
  const exportToPDF = async () => {
    try {
      setIsExporting(true);
      setExportMessage('Preparando exportação para PDF...');
      setExportProgress(0);

      // Pausar animações
      pauseAnimations();

      // Criar novo documento PDF (formato widescreen)
      const pdf = new jsPDF({
        orientation: 'landscape',
        unit: 'px',
        format: [1920, 1080]
      });

      const totalSlides = slides.length;

      for (let i = 0; i < totalSlides; i++) {
        setExportMessage(`Capturando slide ${i + 1} de ${totalSlides}...`);
        setExportProgress(Math.round((i / totalSlides) * 100));

        try {
          // Capturar o slide
          const imgData = await captureSlide(i);

          // Adicionar ao PDF
          if (i > 0) {
            pdf.addPage();
          }

          // Adicionar imagem mantendo proporções
          pdf.addImage(imgData, 'PNG', 0, 0, 1920, 1080, undefined, 'FAST');

          // Adicionar metadados
          if (i === 0) {
            pdf.setProperties({
              title: 'CelPlan - Apresentação Corporativa',
              subject: 'Tecnologia e Inovação em Telecomunicações',
              author: 'CelPlan Technologies',
              keywords: 'telecom, 5G, AI, IoT',
              creator: 'CelPlan V3 Presentation System'
            });
          }
        } catch (error) {
          console.error(`Erro ao capturar slide ${i + 1}:`, error);
          // Continuar com os próximos slides mesmo se um falhar
        }
      }

      setExportMessage('Salvando PDF...');
      setExportProgress(95);

      // Salvar o PDF
      const fileName = `CelPlan_Apresentacao_${new Date().toISOString().split('T')[0]}.pdf`;
      pdf.save(fileName);

      setExportProgress(100);
      setExportMessage('PDF exportado com sucesso!');

      // Voltar ao slide original
      setTimeout(() => {
        const originalButton = document.querySelector(
          `[data-slide-index="${currentSlide}"]`
        ) as HTMLElement;
        if (originalButton) {
          originalButton.click();
        }
      }, 500);

    } catch (error) {
      console.error('Erro ao exportar PDF:', error);
      setExportMessage('Erro ao exportar PDF. Tente novamente.');
    } finally {
      // Restaurar animações
      resumeAnimations();

      setTimeout(() => {
        setIsExporting(false);
        setExportProgress(0);
        setExportMessage('');
      }, 2000);
    }
  };

  // Exportar para PowerPoint
  const exportToPPT = async () => {
    try {
      setIsExporting(true);
      setExportMessage('Preparando exportação para PowerPoint...');
      setExportProgress(0);

      // Pausar animações
      pauseAnimations();

      // Criar nova apresentação
      const pptx = new PptxGenJS();

      // Configurar propriedades da apresentação
      pptx.author = 'CelPlan Technologies';
      pptx.company = 'CelPlan';
      pptx.title = 'CelPlan - Apresentação Corporativa';
      pptx.subject = 'Tecnologia e Inovação em Telecomunicações';

      // Definir layout widescreen (16:9)
      pptx.defineLayout({ name: 'LAYOUT_16x9', width: 10, height: 5.625 });
      pptx.layout = 'LAYOUT_16x9';

      const totalSlides = slides.length;

      for (let i = 0; i < totalSlides; i++) {
        setExportMessage(`Capturando slide ${i + 1} de ${totalSlides}...`);
        setExportProgress(Math.round((i / totalSlides) * 100));

        try {
          // Capturar o slide
          const imgData = await captureSlide(i);

          // Adicionar slide ao PowerPoint
          const slide = pptx.addSlide();

          // Adicionar título do slide (opcional, pode ser comentado se não quiser)
          slide.addText(slideNames[i] || `Slide ${i + 1}`, {
            x: 0.5,
            y: 0.3,
            w: 9,
            h: 0.5,
            fontSize: 24,
            bold: true,
            color: '363636',
            align: 'left'
          });

          // Adicionar imagem do slide
          slide.addImage({
            data: imgData,
            x: 0,
            y: 0,
            w: '100%',
            h: '100%',
            sizing: { type: 'contain', w: '100%', h: '100%' }
          });

          // Adicionar notas do apresentador (opcional)
          slide.addNotes(`Slide ${i + 1}: ${slideNames[i] || 'CelPlan Presentation'}`);

        } catch (error) {
          console.error(`Erro ao capturar slide ${i + 1}:`, error);
          // Adicionar slide em branco em caso de erro
          const slide = pptx.addSlide();
          slide.addText(`Erro ao carregar slide ${i + 1}`, {
            x: 1,
            y: 2,
            w: 8,
            h: 1,
            fontSize: 18,
            color: 'FF0000',
            align: 'center'
          });
        }
      }

      setExportMessage('Salvando PowerPoint...');
      setExportProgress(95);

      // Salvar o arquivo PPTX
      const fileName = `CelPlan_Apresentacao_${new Date().toISOString().split('T')[0]}.pptx`;
      await pptx.writeFile({ fileName });

      setExportProgress(100);
      setExportMessage('PowerPoint exportado com sucesso!');

      // Voltar ao slide original
      setTimeout(() => {
        const originalButton = document.querySelector(
          `[data-slide-index="${currentSlide}"]`
        ) as HTMLElement;
        if (originalButton) {
          originalButton.click();
        }
      }, 500);

    } catch (error) {
      console.error('Erro ao exportar PowerPoint:', error);
      setExportMessage('Erro ao exportar PowerPoint. Tente novamente.');
    } finally {
      // Restaurar animações
      resumeAnimations();

      setTimeout(() => {
        setIsExporting(false);
        setExportProgress(0);
        setExportMessage('');
      }, 2000);
    }
  };

  return (
    <>
      {/* Botões de exportação */}
      <div className="fixed top-20 right-4 z-50 flex flex-col gap-2">
        <button
          onClick={exportToPDF}
          disabled={isExporting}
          className="flex items-center gap-2 px-4 py-2 bg-red-600 hover:bg-red-700 disabled:bg-gray-400 text-white rounded-lg shadow-lg transition-all duration-200 transform hover:scale-105 disabled:scale-100"
          title="Exportar para PDF"
        >
          <FileText className="w-4 h-4" />
          <span className="text-sm font-medium">PDF</span>
        </button>

        <button
          onClick={exportToPPT}
          disabled={isExporting}
          className="flex items-center gap-2 px-4 py-2 bg-orange-600 hover:bg-orange-700 disabled:bg-gray-400 text-white rounded-lg shadow-lg transition-all duration-200 transform hover:scale-105 disabled:scale-100"
          title="Exportar para PowerPoint"
        >
          <Presentation className="w-4 h-4" />
          <span className="text-sm font-medium">PPT</span>
        </button>
      </div>

      {/* Modal de progresso */}
      {isExporting && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/70 backdrop-blur-sm">
          <div className="bg-white dark:bg-slate-800 rounded-xl shadow-2xl p-8 max-w-md w-full mx-4">
            <div className="flex items-center justify-center mb-4">
              <Loader2 className="w-8 h-8 text-brand-500 animate-spin" />
            </div>

            <h3 className="text-xl font-bold text-center mb-2 text-gray-900 dark:text-white">
              Exportando Apresentação
            </h3>

            <p className="text-sm text-center text-gray-600 dark:text-gray-300 mb-4">
              {exportMessage}
            </p>

            {/* Barra de progresso */}
            <div className="w-full bg-gray-200 dark:bg-slate-700 rounded-full h-2.5 overflow-hidden">
              <div
                className="bg-brand-500 h-2.5 rounded-full transition-all duration-300 ease-out"
                style={{ width: `${exportProgress}%` }}
              />
            </div>

            <p className="text-xs text-center text-gray-500 dark:text-gray-400 mt-2">
              {exportProgress}% concluído
            </p>
          </div>
        </div>
      )}
    </>
  );
};
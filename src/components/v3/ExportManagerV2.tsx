import React, { useState, useRef } from 'react';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
import PptxGenJS from 'pptxgenjs';
import { Download, FileText, Presentation, Loader2, AlertCircle } from 'lucide-react';
import ReactDOM from 'react-dom/client';

interface ExportManagerV2Props {
  slides: React.ComponentType[];
  slideNames: string[];
  currentSlide: number;
  goToSlide: (index: number) => void;
}

export const ExportManagerV2: React.FC<ExportManagerV2Props> = ({
  slides,
  slideNames,
  currentSlide,
  goToSlide
}) => {
  const [isExporting, setIsExporting] = useState(false);
  const [exportProgress, setExportProgress] = useState(0);
  const [exportMessage, setExportMessage] = useState('');
  const [exportError, setExportError] = useState('');
  const hiddenContainerRef = useRef<HTMLDivElement | null>(null);

  // Função para criar um container oculto para renderização
  const createHiddenContainer = () => {
    if (!hiddenContainerRef.current) {
      const container = document.createElement('div');
      container.id = 'export-container';
      container.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        width: 1920px;
        height: 1080px;
        z-index: -9999;
        opacity: 0;
        pointer-events: none;
        overflow: hidden;
      `;
      document.body.appendChild(container);
      hiddenContainerRef.current = container;
    }
    return hiddenContainerRef.current;
  };

  // Função para remover o container oculto
  const removeHiddenContainer = () => {
    if (hiddenContainerRef.current) {
      hiddenContainerRef.current.remove();
      hiddenContainerRef.current = null;
    }
  };

  // Função melhorada para renderizar e capturar um slide
  const renderAndCaptureSlide = async (slideIndex: number): Promise<string> => {
    return new Promise(async (resolve, reject) => {
      try {
        const container = createHiddenContainer();

        // Limpar o container
        container.innerHTML = '';

        // Criar um wrapper para o slide com estilos necessários
        const slideWrapper = document.createElement('div');
        slideWrapper.className = 'slide-export-wrapper';
        slideWrapper.style.cssText = `
          width: 1920px;
          height: 1080px;
          position: relative;
          background: white;
          overflow: hidden;
        `;

        container.appendChild(slideWrapper);

        // Renderizar o componente do slide
        const SlideComponent = slides[slideIndex];
        const root = ReactDOM.createRoot(slideWrapper);

        // Renderizar o slide
        root.render(
          <div className="w-full h-full">
            <SlideComponent />
          </div>
        );

        // Aguardar renderização completa
        await new Promise(resolve => setTimeout(resolve, 2000));

        // Aguardar imagens carregarem
        const images = slideWrapper.querySelectorAll('img');
        await Promise.all(
          Array.from(images).map(img =>
            img.complete ? Promise.resolve() : new Promise(resolve => {
              img.onload = resolve;
              img.onerror = resolve;
            })
          )
        );

        // Aguardar fontes
        await document.fonts.ready;

        // Forçar reflow
        slideWrapper.offsetHeight;

        // Fazer o container visível temporariamente para captura
        container.style.opacity = '1';
        container.style.zIndex = '999999';

        // Capturar com html2canvas
        const canvas = await html2canvas(slideWrapper, {
          useCORS: true,
          scale: 2,
          logging: false,
          backgroundColor: '#ffffff',
          width: 1920,
          height: 1080,
          windowWidth: 1920,
          windowHeight: 1080,
          allowTaint: true,
          foreignObjectRendering: false
        });

        // Esconder novamente
        container.style.opacity = '0';
        container.style.zIndex = '-9999';

        // Limpar o React root
        setTimeout(() => root.unmount(), 100);

        // Converter para data URL
        const dataUrl = canvas.toDataURL('image/png', 1.0);
        resolve(dataUrl);

      } catch (error) {
        console.error(`Erro ao capturar slide ${slideIndex}:`, error);
        reject(error);
      }
    });
  };

  // Exportar para PDF com nova abordagem
  const exportToPDF = async () => {
    try {
      setIsExporting(true);
      setExportError('');
      setExportMessage('Iniciando exportação para PDF...');
      setExportProgress(0);

      // Criar PDF em formato landscape
      const pdf = new jsPDF({
        orientation: 'landscape',
        unit: 'mm',
        format: 'a4' // Usar A4 landscape que é similar a 16:9
      });

      const pageWidth = pdf.internal.pageSize.getWidth();
      const pageHeight = pdf.internal.pageSize.getHeight();

      const totalSlides = slides.length;
      const capturedSlides: string[] = [];

      // Capturar todos os slides
      for (let i = 0; i < totalSlides; i++) {
        setExportMessage(`Processando slide ${i + 1} de ${totalSlides}: ${slideNames[i]}...`);
        setExportProgress(Math.round(((i + 1) / (totalSlides + 1)) * 100));

        try {
          const imgData = await renderAndCaptureSlide(i);
          capturedSlides.push(imgData);
        } catch (error) {
          console.error(`Falha ao capturar slide ${i + 1}`, error);
          // Adicionar uma página em branco se falhar
          capturedSlides.push('');
        }
      }

      // Adicionar slides ao PDF
      for (let i = 0; i < capturedSlides.length; i++) {
        if (i > 0) {
          pdf.addPage();
        }

        if (capturedSlides[i]) {
          // Adicionar imagem mantendo proporção 16:9
          const imgWidth = pageWidth;
          const imgHeight = (pageWidth * 9) / 16;
          const yOffset = (pageHeight - imgHeight) / 2;

          pdf.addImage(capturedSlides[i], 'PNG', 0, yOffset, imgWidth, imgHeight, undefined, 'FAST');
        } else {
          // Adicionar texto de erro se o slide falhou
          pdf.setFontSize(16);
          pdf.text(`Slide ${i + 1}: ${slideNames[i]} - Erro ao carregar`, pageWidth / 2, pageHeight / 2, {
            align: 'center'
          });
        }
      }

      // Adicionar metadados
      pdf.setProperties({
        title: 'CelPlan - Apresentação Corporativa V3',
        subject: 'Tecnologia e Inovação em Telecomunicações',
        author: 'CelPlan Technologies',
        keywords: 'telecom, 5G, AI, IoT, analytics',
        creator: 'CelPlan V3 Export System'
      });

      setExportMessage('Finalizando PDF...');
      setExportProgress(95);

      // Salvar o PDF
      const fileName = `CelPlan_Apresentacao_${new Date().toISOString().split('T')[0]}.pdf`;
      pdf.save(fileName);

      setExportProgress(100);
      setExportMessage('PDF exportado com sucesso!');

    } catch (error) {
      console.error('Erro ao exportar PDF:', error);
      setExportError('Erro ao exportar PDF. Por favor, tente novamente.');
      setExportMessage('');
    } finally {
      // Limpar
      removeHiddenContainer();

      setTimeout(() => {
        setIsExporting(false);
        setExportProgress(0);
        setExportMessage('');
        setExportError('');
      }, 3000);
    }
  };

  // Exportar para PowerPoint com nova abordagem
  const exportToPPT = async () => {
    try {
      setIsExporting(true);
      setExportError('');
      setExportMessage('Iniciando exportação para PowerPoint...');
      setExportProgress(0);

      // Criar apresentação
      const pptx = new PptxGenJS();

      // Configurar propriedades
      pptx.author = 'CelPlan Technologies';
      pptx.company = 'CelPlan International Inc.';
      pptx.revision = '1';
      pptx.subject = 'Tecnologia e Inovação em Telecomunicações';
      pptx.title = 'CelPlan - Apresentação Corporativa V3';

      // Definir layout 16:9
      pptx.defineLayout({ name: 'LAYOUT_16x9', width: 10, height: 5.625 });
      pptx.layout = 'LAYOUT_16x9';

      const totalSlides = slides.length;
      const capturedSlides: string[] = [];

      // Capturar todos os slides
      for (let i = 0; i < totalSlides; i++) {
        setExportMessage(`Processando slide ${i + 1} de ${totalSlides}: ${slideNames[i]}...`);
        setExportProgress(Math.round(((i + 1) / (totalSlides + 1)) * 100));

        try {
          const imgData = await renderAndCaptureSlide(i);
          capturedSlides.push(imgData);
        } catch (error) {
          console.error(`Falha ao capturar slide ${i + 1}`, error);
          capturedSlides.push('');
        }
      }

      // Adicionar slides ao PowerPoint
      for (let i = 0; i < capturedSlides.length; i++) {
        const slide = pptx.addSlide();

        // Configurar background
        slide.background = { color: 'FFFFFF' };

        if (capturedSlides[i]) {
          // Adicionar imagem do slide
          slide.addImage({
            data: capturedSlides[i],
            x: 0,
            y: 0,
            w: '100%',
            h: '100%'
          });
        } else {
          // Adicionar slide de erro
          slide.addText(`Erro ao carregar slide ${i + 1}: ${slideNames[i]}`, {
            x: 1,
            y: 2.5,
            w: 8,
            h: 1,
            fontSize: 24,
            color: 'FF0000',
            align: 'center',
            bold: true
          });
        }

        // Adicionar notas do apresentador
        slide.addNotes(`${slideNames[i]}\n\nSlide ${i + 1} de ${totalSlides}\nCelPlan Technologies - Apresentação Corporativa`);
      }

      setExportMessage('Finalizando PowerPoint...');
      setExportProgress(95);

      // Salvar arquivo
      const fileName = `CelPlan_Apresentacao_${new Date().toISOString().split('T')[0]}`;
      await pptx.writeFile({ fileName });

      setExportProgress(100);
      setExportMessage('PowerPoint exportado com sucesso!');

    } catch (error) {
      console.error('Erro ao exportar PowerPoint:', error);
      setExportError('Erro ao exportar PowerPoint. Por favor, tente novamente.');
      setExportMessage('');
    } finally {
      // Limpar
      removeHiddenContainer();

      setTimeout(() => {
        setIsExporting(false);
        setExportProgress(0);
        setExportMessage('');
        setExportError('');
      }, 3000);
    }
  };

  return (
    <>
      {/* Botões de exportação */}
      <div className="fixed top-20 right-4 z-50 flex flex-col gap-2">
        <button
          onClick={exportToPDF}
          disabled={isExporting}
          className="group flex items-center gap-2 px-4 py-2 bg-red-600 hover:bg-red-700 disabled:bg-gray-400 disabled:cursor-not-allowed text-white rounded-lg shadow-lg transition-all duration-200 transform hover:scale-105 disabled:scale-100"
          title="Exportar apresentação completa para PDF"
        >
          <FileText className="w-4 h-4" />
          <span className="text-sm font-medium">PDF</span>
          <span className="absolute -bottom-8 right-0 text-xs bg-gray-800 text-white px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
            Exportar para PDF
          </span>
        </button>

        <button
          onClick={exportToPPT}
          disabled={isExporting}
          className="group flex items-center gap-2 px-4 py-2 bg-orange-600 hover:bg-orange-700 disabled:bg-gray-400 disabled:cursor-not-allowed text-white rounded-lg shadow-lg transition-all duration-200 transform hover:scale-105 disabled:scale-100"
          title="Exportar apresentação completa para PowerPoint"
        >
          <Presentation className="w-4 h-4" />
          <span className="text-sm font-medium">PPT</span>
          <span className="absolute -bottom-8 right-0 text-xs bg-gray-800 text-white px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
            Exportar para PowerPoint
          </span>
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

            {exportMessage && (
              <p className="text-sm text-center text-gray-600 dark:text-gray-300 mb-4">
                {exportMessage}
              </p>
            )}

            {exportError && (
              <div className="flex items-center gap-2 p-3 mb-4 bg-red-100 dark:bg-red-900/30 rounded-lg">
                <AlertCircle className="w-5 h-5 text-red-600 dark:text-red-400" />
                <p className="text-sm text-red-600 dark:text-red-400">
                  {exportError}
                </p>
              </div>
            )}

            {/* Barra de progresso */}
            <div className="w-full bg-gray-200 dark:bg-slate-700 rounded-full h-2.5 overflow-hidden">
              <div
                className="bg-gradient-to-r from-brand-500 to-brand-600 h-2.5 rounded-full transition-all duration-500 ease-out"
                style={{ width: `${exportProgress}%` }}
              />
            </div>

            <p className="text-xs text-center text-gray-500 dark:text-gray-400 mt-2">
              {exportProgress}% concluído
            </p>

            {exportProgress === 100 && (
              <div className="mt-4 text-center">
                <p className="text-green-600 dark:text-green-400 font-medium">
                  ✓ Exportação concluída com sucesso!
                </p>
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );
};
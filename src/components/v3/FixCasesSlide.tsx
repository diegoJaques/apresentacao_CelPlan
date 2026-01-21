import { useEffect } from 'react';
import { presentationStore } from '../../lib/presentationStore';

export const FixCasesSlide = () => {
  useEffect(() => {
    const fixSlides = async () => {
      // Força limpeza e recarga com slide de Cases
      console.log('🔧 Iniciando correção do slide de Cases...');

      // Limpa dados antigos
      localStorage.removeItem('celplan_presentation');
      localStorage.removeItem('celplan_presentation_v3');
      localStorage.removeItem('presentation_data');

      // Força recarga dos dados migrados (que agora incluem o slide de Cases)
      const { getCurrentPresentationData } = await import('../../lib/presentationDataMigration');
      const freshData = getCurrentPresentationData();

      // Verifica se tem o slide de Cases
      const hasCase = freshData.slides.some(s => s.id === 'slide_cases');
      console.log('✅ Slide de Cases presente:', hasCase);
      console.log('📊 Total de slides:', freshData.slides.length);

      // Salva os dados atualizados
      await presentationStore.savePresentation(freshData);

      console.log('✅ Correção aplicada! Recarregando...');

      // Recarrega após 1 segundo
      setTimeout(() => {
        window.location.reload();
      }, 1000);
    };

    // Executa apenas se não tiver o slide de Cases
    const checkAndFix = async () => {
      const data = await presentationStore.getPresentation();
      if (!data || !data.slides.some(s => s.id === 'slide_cases')) {
        fixSlides();
      } else {
        console.log('✅ Slide de Cases já está presente!');
      }
    };

    checkAndFix();
  }, []);

  return (
    <div className="fixed bottom-4 left-4 z-50 bg-yellow-500 text-black px-4 py-2 rounded-lg shadow-lg">
      🔧 Corrigindo slides...
    </div>
  );
};
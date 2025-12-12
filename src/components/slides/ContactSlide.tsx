import { motion } from 'framer-motion';
import { useEffect, useRef, useState } from 'react';
import { Slide } from '../Slide';
import { contactInfo } from '../../data/content';
import { Mail, Phone, Globe, MapPin, Linkedin, Github, MessageCircle, Edit2 } from 'lucide-react';
import QRCode from 'qrcode';
import type { VendorInfo } from '../../types/api';
import { EditContactModal } from '../EditContactModal';
import { presentationService, authService } from '../../services/api';
import { useParams } from 'react-router-dom';

interface ContactSlideProps {
  vendorInfo?: VendorInfo;
  presentationId?: string; // ID da apresentação (opcional, usa useParams se não fornecido)
}

export const ContactSlide = ({ vendorInfo, presentationId }: ContactSlideProps = {}) => {
  const qrRef = useRef<HTMLCanvasElement>(null);
  const { id: urlId } = useParams<{ id: string }>();
  const id = presentationId || urlId; // Usa prop se fornecida, senão usa da URL
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [currentVendorInfo, setCurrentVendorInfo] = useState<VendorInfo | undefined>(vendorInfo);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  // Atualizar currentVendorInfo quando vendorInfo mudar
  useEffect(() => {
    setCurrentVendorInfo(vendorInfo);
  }, [vendorInfo]);

  // Verificar autenticação ao carregar
  useEffect(() => {
    setIsAuthenticated(authService.isAuthenticated());
  }, []);

  // Usar dados do vendedor se fornecidos, senão usar dados padrão
  const displayName = currentVendorInfo?.name || 'Diego Jaques';
  const displayEmail = currentVendorInfo?.email || contactInfo.email;
  const displayPhone = currentVendorInfo?.phone || contactInfo.phone;
  const displayWhatsApp = currentVendorInfo?.whatsapp || '+5519983760039';

  const whatsappMessage = `Olá ${displayName.split(' ')[0]}! Vi a apresentação da CelPlan e gostaria de saber mais sobre as soluções de IA.`;
  const whatsappUrl = `https://wa.me/${displayWhatsApp.replace(/\D/g, '')}?text=${encodeURIComponent(whatsappMessage)}`;

  // Função para salvar informações atualizadas
  const handleSaveVendorInfo = async (updatedInfo: VendorInfo) => {
    if (!id) {
      throw new Error('ID da apresentação não encontrado');
    }

    const result = await presentationService.updateVendorInfo(id, updatedInfo);
    setCurrentVendorInfo(result.vendorInfo);
  };

  useEffect(() => {
    if (qrRef.current) {
      // Gerar QR Code no canvas
      QRCode.toCanvas(qrRef.current, whatsappUrl, {
        width: 140,
        margin: 0,
        color: {
          dark: '#1e293b',
          light: '#ffffff',
        },
        errorCorrectionLevel: 'H'
      }, (error: Error | null | undefined) => {
        if (error) console.error('Erro ao gerar QR Code:', error);
      });
    }
  }, [whatsappUrl]);

  return (
    <Slide background="dark">
      {/* Botão de edição (apenas para usuários autenticados) */}
      {isAuthenticated && id && (
        <motion.button
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          onClick={() => setIsEditModalOpen(true)}
          className="absolute top-4 right-4 z-20 flex items-center gap-2 px-4 py-2
                     glass-effect hover:bg-white/10 rounded-lg transition-colors"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <Edit2 className="w-4 h-4" />
          <span className="text-sm">Editar Contato</span>
        </motion.button>
      )}

      <div className="text-center">
        <motion.h2
          initial={{ opacity: 0, y: -30 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-3xl font-display font-bold mb-2"
        >
          <span className="gradient-text">Vamos Transformar Juntos</span>
        </motion.h2>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="text-base text-neutral-300 mb-4 max-w-2xl mx-auto"
        >
          Entre em contato e descubra como podemos acelerar a transformação digital do seu negócio
        </motion.p>

        <div className="grid md:grid-cols-2 gap-3 max-w-4xl mx-auto mb-4">
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.5 }}
            className="space-y-3"
          >
            <motion.a
              href={`mailto:${displayEmail}`}
              whileHover={{ scale: 1.05 }}
              className="glass-effect p-2 rounded-xl flex items-center gap-2
                       hover:bg-white/10 transition-all duration-300"
            >
              <Mail className="w-5 h-5 text-brand-500" />
              <span className="text-sm">{displayEmail}</span>
            </motion.a>

            <motion.a
              href={`tel:${displayPhone}`}
              whileHover={{ scale: 1.05 }}
              className="glass-effect p-2 rounded-xl flex items-center gap-2
                       hover:bg-white/10 transition-all duration-300"
            >
              <Phone className="w-5 h-5 text-primary-500" />
              <span className="text-sm">{displayPhone}</span>
            </motion.a>

            <motion.a
              href={`https://${contactInfo.website}`}
              target="_blank"
              rel="noopener noreferrer"
              whileHover={{ scale: 1.05 }}
              className="glass-effect p-2 rounded-xl flex items-center gap-2 
                       hover:bg-white/10 transition-all duration-300"
            >
              <Globe className="w-5 h-5 text-accent-500" />
              <span className="text-sm">{contactInfo.website}</span>
            </motion.a>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.6 }}
            className="space-y-3"
          >
            <div className="glass-effect p-2 rounded-xl">
              <div className="flex items-center gap-2 mb-1">
                <MapPin className="w-5 h-5 text-brand-500" />
                <span className="font-semibold">Escritórios</span>
              </div>
              <div className="text-xs text-neutral-300 space-y-1 ml-8">
                <p>{contactInfo.address.brazil}</p>
                <p>{contactInfo.address.usa}</p>
              </div>
            </div>

            <div className="flex gap-3 justify-center">
              <motion.a
                href="https://www.linkedin.com/company/celplan/posts/?feedView=all"
                target="_blank"
                rel="noopener noreferrer"
                whileHover={{ scale: 1.2, rotate: 360 }}
                transition={{ duration: 0.5 }}
                className="glass-effect p-2 rounded-full hover:bg-white/10"
              >
                <Linkedin className="w-5 h-5 text-primary-500" />
              </motion.a>
              <motion.a
                href={`https://github.com/${contactInfo.social.github}`}
                target="_blank"
                rel="noopener noreferrer"
                whileHover={{ scale: 1.2, rotate: -360 }}
                transition={{ duration: 0.5 }}
                className="glass-effect p-2 rounded-full hover:bg-white/10"
              >
                <Github className="w-5 h-5 text-neutral-400" />
              </motion.a>
            </div>
          </motion.div>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8 }}
        >
          <button className="button-accent text-sm px-5 py-2 shadow-xl hover:shadow-accent-500/30">
            Vamos Transformar Seu Negócio com IA
          </button>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1 }}
          className="mt-4"
        >
          <div className="glass-effect p-3 rounded-2xl inline-block">
            <div className="flex items-center gap-2 mb-3">
              <MessageCircle className="w-6 h-6 text-green-500" />
              <span className="text-base font-semibold">WhatsApp Direto - {displayName.split(' ')[0]}</span>
            </div>
            <canvas ref={qrRef} className="bg-white p-2 rounded-xl" />
            <p className="text-xs text-neutral-300 mt-2">
              Escaneie para iniciar conversa
            </p>
            <p className="text-xs text-neutral-400 mt-1">
              {displayWhatsApp}
            </p>
          </div>
        </motion.div>

        {/* Exit Fullscreen Notice */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.5 }}
          className="mt-4"
        >
          <p className="text-xs text-neutral-400 text-center">
            Pressione <kbd className="px-2 py-1 bg-white/10 rounded text-accent-500 font-bold">F11</kbd> para sair da tela cheia
          </p>
        </motion.div>
      </div>

      {/* Modal de edição */}
      {currentVendorInfo && (
        <EditContactModal
          isOpen={isEditModalOpen}
          onClose={() => setIsEditModalOpen(false)}
          vendorInfo={currentVendorInfo}
          onSave={handleSaveVendorInfo}
        />
      )}
    </Slide>
  );
};
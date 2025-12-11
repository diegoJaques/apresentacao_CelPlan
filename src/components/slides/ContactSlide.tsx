import { motion } from 'framer-motion';
import { useEffect, useRef } from 'react';
import { Slide } from '../Slide';
import { contactInfo } from '../../data/content';
import { Mail, Phone, Globe, MapPin, Linkedin, Github, MessageCircle } from 'lucide-react';
import QRCode from 'qrcode';
import type { VendorInfo } from '../../types/api';

interface ContactSlideProps {
  vendorInfo?: VendorInfo;
}

export const ContactSlide = ({ vendorInfo }: ContactSlideProps = {}) => {
  const qrRef = useRef<HTMLCanvasElement>(null);

  // Usar dados do vendedor se fornecidos, senão usar dados padrão
  const displayName = vendorInfo?.name || 'Diego Jaques';
  const displayEmail = vendorInfo?.email || contactInfo.email;
  const displayPhone = vendorInfo?.phone || contactInfo.phone;
  const displayWhatsApp = vendorInfo?.whatsapp || '+5519983760039';

  const whatsappMessage = `Olá ${displayName.split(' ')[0]}! Vi a apresentação da CelPlan e gostaria de saber mais sobre as soluções de IA.`;
  const whatsappUrl = `https://wa.me/${displayWhatsApp.replace(/\D/g, '')}?text=${encodeURIComponent(whatsappMessage)}`;

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
    </Slide>
  );
};
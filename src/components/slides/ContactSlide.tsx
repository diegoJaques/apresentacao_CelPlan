import { motion } from 'framer-motion';
import { useEffect, useRef } from 'react';
import { Slide } from '../Slide';
import { contactInfo } from '../../data/content';
import { Mail, Phone, Globe, MapPin, Linkedin, Github, MessageCircle } from 'lucide-react';
import QRCode from 'qrcode';

export const ContactSlide = () => {
  const qrRef = useRef<HTMLCanvasElement>(null);
  const whatsappNumber = '+5519983760039'; // Diego Jaques - CelPlan
  const whatsappMessage = 'Olá Diego! Vi a apresentação da CelPlan e gostaria de saber mais sobre as soluções de IA.';
  const whatsappUrl = `https://wa.me/${whatsappNumber.replace(/\D/g, '')}?text=${encodeURIComponent(whatsappMessage)}`;

  useEffect(() => {
    if (qrRef.current) {
      // Gerar QR Code no canvas
      QRCode.toCanvas(qrRef.current, whatsappUrl, {
        width: 192,
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
  }, []);

  return (
    <Slide background="dark">
      <div className="text-center">
        <motion.h2
          initial={{ opacity: 0, y: -30 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-5xl font-display font-bold mb-4"
        >
          <span className="gradient-text">Vamos Transformar Juntos</span>
        </motion.h2>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="text-xl text-neutral-300 mb-12 max-w-2xl mx-auto"
        >
          Entre em contato e descubra como podemos acelerar a transformação digital do seu negócio
        </motion.p>

        <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto mb-12">
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.5 }}
            className="space-y-4"
          >
            <motion.a
              href={`mailto:${contactInfo.email}`}
              whileHover={{ scale: 1.05 }}
              className="glass-effect p-4 rounded-xl flex items-center gap-4 
                       hover:bg-white/10 transition-all duration-300"
            >
              <Mail className="w-6 h-6 text-brand-500" />
              <span>{contactInfo.email}</span>
            </motion.a>

            <motion.a
              href={`tel:${contactInfo.phone}`}
              whileHover={{ scale: 1.05 }}
              className="glass-effect p-4 rounded-xl flex items-center gap-4 
                       hover:bg-white/10 transition-all duration-300"
            >
              <Phone className="w-6 h-6 text-primary-500" />
              <span>{contactInfo.phone}</span>
            </motion.a>

            <motion.a
              href={`https://${contactInfo.website}`}
              target="_blank"
              rel="noopener noreferrer"
              whileHover={{ scale: 1.05 }}
              className="glass-effect p-4 rounded-xl flex items-center gap-4 
                       hover:bg-white/10 transition-all duration-300"
            >
              <Globe className="w-6 h-6 text-accent-500" />
              <span>{contactInfo.website}</span>
            </motion.a>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.6 }}
            className="space-y-4"
          >
            <div className="glass-effect p-4 rounded-xl">
              <div className="flex items-center gap-4 mb-2">
                <MapPin className="w-6 h-6 text-brand-500" />
                <span className="font-semibold">Escritórios</span>
              </div>
              <div className="text-sm text-neutral-300 space-y-1 ml-10">
                <p>{contactInfo.address.brazil}</p>
                <p>{contactInfo.address.usa}</p>
              </div>
            </div>

            <div className="flex gap-4 justify-center">
              <motion.a
                href="https://www.linkedin.com/company/celplan/posts/?feedView=all"
                target="_blank"
                rel="noopener noreferrer"
                whileHover={{ scale: 1.2, rotate: 360 }}
                transition={{ duration: 0.5 }}
                className="glass-effect p-4 rounded-full hover:bg-white/10"
              >
                <Linkedin className="w-6 h-6 text-primary-500" />
              </motion.a>
              <motion.a
                href={`https://github.com/${contactInfo.social.github}`}
                target="_blank"
                rel="noopener noreferrer"
                whileHover={{ scale: 1.2, rotate: -360 }}
                transition={{ duration: 0.5 }}
                className="glass-effect p-4 rounded-full hover:bg-white/10"
              >
                <Github className="w-6 h-6 text-neutral-400" />
              </motion.a>
            </div>
          </motion.div>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8 }}
        >
          <button className="button-accent text-lg px-8 py-4 shadow-xl hover:shadow-accent-500/30">
            Vamos Transformar Seu Negócio com IA
          </button>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1 }}
          className="mt-12"
        >
          <div className="glass-effect p-6 rounded-2xl inline-block">
            <div className="flex items-center gap-3 mb-4">
              <MessageCircle className="w-6 h-6 text-green-500" />
              <span className="text-lg font-semibold">WhatsApp Direto - Diego</span>
            </div>
            <canvas ref={qrRef} className="bg-white p-2 rounded-xl" />
            <p className="text-sm text-neutral-300 mt-3">
              Escaneie para iniciar conversa
            </p>
            <p className="text-xs text-neutral-400 mt-1">
              {whatsappNumber}
            </p>
          </div>
        </motion.div>

        {/* Exit Fullscreen Notice */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.5 }}
          className="mt-8"
        >
          <p className="text-xs text-neutral-400 text-center">
            Pressione <kbd className="px-2 py-1 bg-white/10 rounded text-accent-500 font-bold">F11</kbd> para sair da tela cheia
          </p>
        </motion.div>
      </div>
    </Slide>
  );
};
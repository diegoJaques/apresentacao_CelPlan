import { motion } from 'framer-motion';
import { Mail, Phone, Globe, MapPin, Linkedin, MessageCircle } from 'lucide-react';
import { GlassCard } from '../GlassCard';
import { Slide } from '../../Slide';
import { ParticleBackground } from '../ParticleBackground';
import { EditableText } from '../../EditableText';

export const ContactSlideV3 = () => {
  const contactInfo = [
    {
      icon: Mail,
      label: 'Email',
      value: 'contato@celplan.com',
      link: 'mailto:contato@celplan.com',
      color: 'brand'
    },
    {
      icon: Phone,
      label: 'Telefone',
      value: '+55 11 3032-3032',
      link: 'tel:+551130323032',
      color: 'primary'
    },
    {
      icon: Globe,
      label: 'Website',
      value: 'www.celplan.com',
      link: 'https://www.celplan.com',
      color: 'accent'
    },
    {
      icon: MapPin,
      label: 'Localização',
      value: 'São Paulo, Brasil',
      link: null,
      color: 'brand'
    }
  ];

  return (
    <Slide background="dark">
      <div className="h-screen bg-gradient-to-br from-white via-brand-50 to-slate-50 dark:from-slate-900 dark:via-brand-900/40 dark:to-slate-900 relative overflow-hidden flex items-center justify-center transition-colors duration-300">
        {/* Particle Background */}
        <div className="absolute inset-0 z-0">
          <ParticleBackground density={60} color="#7c3aed" connectDots={true} />
        </div>

        {/* Content */}
        <div className="relative z-10 max-w-5xl mx-auto px-8 text-center">
          {/* Logo/Brand Section */}
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: 'spring', stiffness: 150, damping: 20 }}
            className="mb-10"
          >
            <EditableText
              id="contact-title"
              defaultText="Vamos Conversar?"
              className="text-6xl font-display font-bold mb-4 bg-gradient-to-r from-brand-400 via-primary-400 to-brand-400 bg-clip-text text-transparent"
              tag="h1"
            />

            <EditableText
              id="contact-subtitle"
              defaultText="Transforme seus desafios em soluções inovadoras"
              className="text-2xl text-slate-600 dark:text-neutral-300 max-w-2xl mx-auto leading-relaxed"
              tag="p"
            />
          </motion.div>

          {/* Contact Cards */}
          <div className="grid grid-cols-4 gap-6 mb-10">
            {contactInfo.map((contact, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 50 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 + index * 0.1, duration: 0.6 }}
              >
                {contact.link ? (
                  <a
                    href={contact.link}
                    target={contact.link.startsWith('http') ? '_blank' : undefined}
                    rel={contact.link.startsWith('http') ? 'noopener noreferrer' : undefined}
                    className="block"
                  >
                    <GlassCard className="h-full" hover>
                      <div className={`p-6 text-center bg-gradient-to-br from-${contact.color}-500/10 to-transparent`}>
                        <h3 className={`text-sm font-semibold uppercase tracking-wider text-${contact.color}-600 dark:text-${contact.color}-400 mb-2`}>
                          {contact.label}
                        </h3>

                        <EditableText
                          id={`contact-value-${index}`}
                          defaultText={contact.value}
                          className="text-slate-800 dark:text-white font-medium text-base"
                          tag="p"
                        />
                      </div>
                    </GlassCard>
                  </a>
                ) : (
                  <GlassCard className="h-full" hover={false}>
                    <div className={`p-6 text-center bg-gradient-to-br from-${contact.color}-500/10 to-transparent`}>
                      <div className={`inline-flex items-center justify-center w-12 h-12 rounded-xl bg-${contact.color}-500/20 mb-4`}>
                        <contact.icon className={`w-6 h-6 text-${contact.color}-600 dark:text-${contact.color}-400`} />
                      </div>

                      <h3 className={`text-sm font-semibold uppercase tracking-wider text-${contact.color}-600 dark:text-${contact.color}-400 mb-2`}>
                        {contact.label}
                      </h3>

                      <EditableText
                        id={`contact-value-${index}`}
                        defaultText={contact.value}
                        className="text-slate-800 dark:text-white font-medium text-base"
                        tag="p"
                      />
                    </div>
                  </GlassCard>
                )}
              </motion.div>
            ))}
          </div>

          {/* Social Links */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8 }}
            className="mb-8"
          >
            <GlassCard hover={false}>
              <div className="p-6 bg-gradient-to-r from-brand-500/10 via-primary-500/10 to-brand-500/10">
                <div className="flex items-center justify-center gap-6">
                  <Linkedin className="w-8 h-8 text-primary-600 dark:text-primary-400 hover:text-primary-500 dark:hover:text-primary-300 transition-colors cursor-pointer hover:scale-110 transform duration-200" />
                  <span className="text-slate-400 dark:text-neutral-400">|</span>
                  <a
                    href="https://www.linkedin.com/company/celplan"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-slate-700 dark:text-neutral-300 hover:text-primary-600 dark:hover:text-primary-400 transition-colors font-medium"
                  >
                    Siga-nos no LinkedIn
                  </a>
                </div>
              </div>
            </GlassCard>
          </motion.div>

          {/* Footer Message */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1 }}
          >
            <p className="text-slate-500 dark:text-neutral-500 text-sm">
              <span className="text-brand-500">©</span> 2025 CelPlan Technologies. Todos os direitos reservados.
            </p>
          </motion.div>
        </div>
      </div>
    </Slide>
  );
};

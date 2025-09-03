import { motion } from 'framer-motion';
import { Slide } from '../Slide';
import { Train, Network, Radio, TrendingUp, Shield, Zap } from 'lucide-react';

export const ProjectsSlide = () => {
  const projects = [
    {
      icon: Train,
      title: "Modernização do Transporte sobre Trilhos",
      client: "ANPTrilhos/USTDA",
      problem: "Custos energéticos comprometendo sustentabilidade operacional",
      solution: "Roadmaps de gestão de ativos e eficiência energética",
      results: [
        { label: "Eficiência", value: "+40%", color: "text-green-400" },
        { label: "Falhas", value: "-25%", color: "text-red-400" }
      ],
      gradient: "from-brand-600 to-primary-600"
    },
    {
      icon: Network,
      title: "Smart Grid com LTE Privado",
      client: "EDP Vila Velha/ES",
      problem: "Conectar 42.700+ medidores em área urbana de 15km²",
      solution: "Rede LTE autônoma com 26km de fibra óptica",
      results: [
        { label: "Disponibilidade", value: "99,99%", color: "text-green-400" },
        { label: "Autonomia", value: "12h", color: "text-blue-400" }
      ],
      gradient: "from-primary-600 to-accent-600"
    },
    {
      icon: Radio,
      title: "Ferrovia 4.0 Vitória-Minas",
      client: "Vale S.A.",
      problem: "900km de ferrovia com comunicação obsoleta",
      solution: "Rede LTE 250MHz com cobertura otimizada",
      results: [
        { label: "Cobertura/Torre", value: "100km", color: "text-purple-400" },
        { label: "Automação", value: "Habilitada", color: "text-green-400" }
      ],
      gradient: "from-accent-600 to-brand-600"
    }
  ];

  return (
    <Slide>
      <div>
        <motion.h2
          initial={{ opacity: 0, y: -30 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-5xl font-display font-bold text-center mb-3"
        >
          <span className="gradient-text">Projetos de Transformação Digital</span>
        </motion.h2>
        
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="text-center text-neutral-300 mb-10 text-lg"
        >
          Casos reais de sucesso em infraestrutura crítica
        </motion.p>

        <div className="grid lg:grid-cols-3 gap-6 max-w-7xl mx-auto">
          {projects.map((project, index) => {
            const Icon = project.icon;
            return (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 50 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.2 + 0.3 }}
                whileHover={{ scale: 1.02, transition: { duration: 0.2 } }}
                className="group"
              >
                <div className="glass-effect rounded-xl p-6 h-full flex flex-col
                           hover:shadow-2xl hover:shadow-brand-500/20 transition-all duration-300">
                  
                  {/* Header com ícone e gradiente */}
                  <div className={`bg-gradient-to-r ${project.gradient} p-4 rounded-lg mb-4
                                  group-hover:shadow-lg transition-all duration-300`}>
                    <Icon className="w-10 h-10 text-white mx-auto" />
                  </div>

                  {/* Título e Cliente */}
                  <h3 className="text-xl font-bold mb-2 text-white">
                    {project.title}
                  </h3>
                  <p className="text-sm text-brand-400 font-semibold mb-4">
                    {project.client}
                  </p>

                  {/* Problema */}
                  <div className="mb-4">
                    <div className="flex items-center gap-2 mb-2">
                      <Shield className="w-4 h-4 text-red-400" />
                      <span className="text-xs font-semibold text-red-400 uppercase">Desafio</span>
                    </div>
                    <p className="text-sm text-neutral-200">
                      {project.problem}
                    </p>
                  </div>

                  {/* Solução */}
                  <div className="mb-4 flex-grow">
                    <div className="flex items-center gap-2 mb-2">
                      <Zap className="w-4 h-4 text-green-400" />
                      <span className="text-xs font-semibold text-green-400 uppercase">Nossa Solução</span>
                    </div>
                    <p className="text-sm text-neutral-200">
                      {project.solution}
                    </p>
                  </div>

                  {/* Resultados */}
                  <div className="border-t border-neutral-700 pt-4 mt-auto">
                    <div className="flex items-center gap-2 mb-3">
                      <TrendingUp className="w-4 h-4 text-accent-400" />
                      <span className="text-xs font-semibold text-accent-400 uppercase">Impacto</span>
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                      {project.results.map((result, rIndex) => (
                        <div key={rIndex} className="text-center">
                          <div className={`text-2xl font-bold ${result.color}`}>
                            {result.value}
                          </div>
                          <div className="text-xs text-neutral-400">
                            {result.label}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.2 }}
          className="text-center mt-8"
        >
          <div className="flex items-center justify-center gap-6 mb-4">
            <div className="bg-yellow-500 text-black px-4 py-2 rounded-full text-sm font-bold">
              🏆 Golden Cooperation Award 2023
            </div>
            <div className="bg-blue-500 text-white px-4 py-2 rounded-full text-sm font-bold">
              ⭐ ISO 9001 & 45001
            </div>
          </div>
          <p className="text-sm text-neutral-400 italic">
            "A CelPlan foi uma importante parceira em nosso processo de transformação e modernização" - EDP Brasil
          </p>
        </motion.div>
      </div>
    </Slide>
  );
};
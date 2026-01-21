import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

type Theme = 'dark' | 'light';

interface ThemeContextType {
  theme: Theme;
  toggleTheme: () => void;
  setTheme: (theme: Theme) => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

interface ThemeProviderProps {
  children: ReactNode;
}

export const ThemeProvider: React.FC<ThemeProviderProps> = ({ children }) => {
  // Carregar tema do localStorage ou usar 'dark' como padrão
  const [theme, setThemeState] = useState<Theme>(() => {
    const savedTheme = localStorage.getItem('celplan-theme');
    return (savedTheme === 'light' || savedTheme === 'dark') ? savedTheme : 'dark';
  });

  // Aplicar tema no documento e salvar no localStorage
  useEffect(() => {
    const root = document.documentElement;
    root.setAttribute('data-theme', theme);

    // Adicionar/remover classe dark do Tailwind
    if (theme === 'dark') {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }

    // Salvar preferência
    localStorage.setItem('celplan-theme', theme);
  }, [theme]);

  const toggleTheme = () => {
    setThemeState(prevTheme => prevTheme === 'dark' ? 'light' : 'dark');
  };

  const setTheme = (newTheme: Theme) => {
    setThemeState(newTheme);
  };

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme, setTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};

// Hook personalizado para usar o tema
export const useTheme = (): ThemeContextType => {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error('useTheme deve ser usado dentro de um ThemeProvider');
  }
  return context;
};

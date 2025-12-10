import React from 'react';
import { BookOpen, GraduationCap, Layout as LayoutIcon } from 'lucide-react';

interface LayoutProps {
  children: React.ReactNode;
  onGoHome: () => void;
}

const Layout: React.FC<LayoutProps> = ({ children, onGoHome }) => {
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <header className="bg-white border-b border-gray-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div 
            className="flex items-center gap-2 cursor-pointer hover:opacity-80 transition-opacity"
            onClick={onGoHome}
          >
            <div className="w-8 h-8 bg-brand-600 rounded-lg flex items-center justify-center text-white">
              <LayoutIcon size={20} />
            </div>
            <span className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-brand-600 to-indigo-600">
              GeniusCreator
            </span>
          </div>
          <nav className="flex items-center gap-4 text-sm font-medium text-gray-500">
            <div className="hidden md:flex items-center gap-6">
              <span className="flex items-center gap-1 hover:text-brand-600 cursor-pointer">
                <BookOpen size={16} /> E-books
              </span>
              <span className="flex items-center gap-1 hover:text-brand-600 cursor-pointer">
                <GraduationCap size={16} /> Cursos
              </span>
            </div>
          </nav>
        </div>
      </header>
      <main className="flex-grow flex flex-col">
        {children}
      </main>
      <footer className="bg-white border-t border-gray-200 py-8">
        <div className="max-w-7xl mx-auto px-4 text-center text-gray-400 text-sm">
          &copy; {new Date().getFullYear()} GeniusCreator. Desenvolvido com Google Gemini.
        </div>
      </footer>
    </div>
  );
};

export default Layout;
import React, { useState } from 'react';
import { ProjectData } from '../types';
import Button from './Button';
import { Download, ChevronLeft, ChevronRight, BookOpen, Menu, X } from 'lucide-react';

interface FinalResultProps {
  project: ProjectData;
  onRestart: () => void;
}

const FinalResult: React.FC<FinalResultProps> = ({ project, onRestart }) => {
  const [activeChapterIndex, setActiveChapterIndex] = useState(0);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const activeChapter = project.chapters[activeChapterIndex];

  const handleDownload = () => {
    // Simple text download for MVP
    let content = `# ${project.title}\n\n`;
    project.chapters.forEach(c => {
      content += `## ${c.title}\n\n${c.content}\n\n---\n\n`;
    });
    
    const blob = new Blob([content], { type: 'text/markdown' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${project.title.replace(/\s+/g, '_')}.md`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="flex flex-col h-[calc(100vh-64px)] overflow-hidden bg-gray-100">
      
      {/* Top Bar */}
      <div className="bg-white border-b border-gray-200 px-4 md:px-6 py-3 flex items-center justify-between shadow-sm z-10">
        <div className="flex items-center gap-3">
          <button 
            className="md:hidden p-2 text-gray-600 hover:bg-gray-100 rounded-lg"
            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
          >
            {isSidebarOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
          <div>
            <h1 className="text-sm md:text-lg font-bold text-gray-900 truncate max-w-[200px] md:max-w-md">{project.title}</h1>
            <p className="text-xs text-gray-500 uppercase tracking-wide hidden md:block">{project.type === 'EBOOK' ? 'E-book Completo' : 'Curso Completo'}</p>
          </div>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={onRestart} className="text-sm py-2 px-3 hidden md:flex">
            Novo
          </Button>
          <Button onClick={handleDownload} className="text-sm py-2 px-3">
            <Download size={16} className="mr-2" /> <span className="hidden md:inline">Baixar</span>
          </Button>
        </div>
      </div>

      <div className="flex flex-grow overflow-hidden relative">
        
        {/* Sidebar Navigation */}
        <div className={`
          absolute md:static inset-y-0 left-0 z-20 w-80 bg-white border-r border-gray-200 flex flex-col transform transition-transform duration-300 ease-in-out
          ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}
        `}>
          <div className="p-4 border-b border-gray-100 bg-gray-50 text-center">
            {project.coverImage ? (
               <div className="relative group mx-auto w-32 shadow-xl rounded overflow-hidden transform hover:scale-105 transition-transform duration-300">
                  <img src={project.coverImage} alt="Cover" className="w-full h-auto object-cover" />
               </div>
            ) : (
              <div className="w-32 h-44 mx-auto bg-gray-200 rounded flex items-center justify-center text-gray-400">Sem Capa</div>
            )}
            <p className="mt-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Sumário</p>
          </div>
          <div className="flex-grow overflow-y-auto p-2 space-y-1">
            {project.chapters.map((chapter, idx) => (
              <button
                key={idx}
                onClick={() => {
                  setActiveChapterIndex(idx);
                  setIsSidebarOpen(false);
                }}
                className={`w-full text-left px-3 py-3 rounded-md text-sm transition-colors border-l-4 ${
                  idx === activeChapterIndex 
                    ? 'bg-brand-50 border-brand-600 text-brand-700 font-medium' 
                    : 'border-transparent text-gray-600 hover:bg-gray-100'
                }`}
              >
                <div className="flex gap-3">
                  <span className="opacity-50 font-mono text-xs pt-0.5">{String(idx + 1).padStart(2, '0')}</span>
                  <span className="truncate leading-tight">{chapter.title}</span>
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Overlay for mobile sidebar */}
        {isSidebarOpen && (
          <div 
            className="absolute inset-0 bg-black bg-opacity-50 z-10 md:hidden"
            onClick={() => setIsSidebarOpen(false)}
          ></div>
        )}

        {/* Content Area */}
        <div className="flex-grow overflow-y-auto p-4 md:p-8 bg-gray-100 flex justify-center">
          <div className="max-w-3xl w-full bg-white shadow-xl min-h-[800px] rounded-lg p-8 md:p-12 relative animate-fade-in-up">
            <div className="absolute top-0 right-0 p-4 opacity-5 pointer-events-none">
              <BookOpen size={150} />
            </div>
            
            <span className="inline-block px-3 py-1 bg-gray-100 text-gray-600 rounded-full text-xs font-medium mb-6">
               {project.type === 'EBOOK' ? 'Capítulo' : 'Módulo'} {activeChapterIndex + 1} de {project.chapters.length}
            </span>
            
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-8 pb-6 border-b border-gray-100 leading-tight">
              {activeChapter.title}
            </h2>
            
            <div className="prose prose-lg prose-indigo max-w-none text-gray-700 font-serif leading-relaxed whitespace-pre-wrap">
              {activeChapter.content}
            </div>

            <div className="flex justify-between mt-16 pt-8 border-t border-gray-100">
              <button 
                onClick={() => setActiveChapterIndex(Math.max(0, activeChapterIndex - 1))}
                disabled={activeChapterIndex === 0}
                className="flex items-center text-gray-500 hover:text-brand-600 disabled:opacity-30 disabled:hover:text-gray-500 transition-colors px-4 py-2 rounded-lg hover:bg-gray-50"
              >
                <ChevronLeft size={20} className="mr-1" /> Anterior
              </button>
              <button 
                onClick={() => setActiveChapterIndex(Math.min(project.chapters.length - 1, activeChapterIndex + 1))}
                disabled={activeChapterIndex === project.chapters.length - 1}
                className="flex items-center text-brand-600 hover:text-brand-700 disabled:opacity-30 disabled:hover:text-gray-500 transition-colors font-medium px-4 py-2 rounded-lg hover:bg-brand-50"
              >
                Próximo <ChevronRight size={20} className="ml-1" />
              </button>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};

export default FinalResult;
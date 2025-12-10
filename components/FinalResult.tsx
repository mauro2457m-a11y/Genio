import React, { useState } from 'react';
import { ProjectData } from '../types';
import Button from './Button';
import { Download, ChevronLeft, ChevronRight, BookOpen, Share2 } from 'lucide-react';

interface FinalResultProps {
  project: ProjectData;
  onRestart: () => void;
}

const FinalResult: React.FC<FinalResultProps> = ({ project, onRestart }) => {
  const [activeChapterIndex, setActiveChapterIndex] = useState(0);

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
      <div className="bg-white border-b border-gray-200 px-6 py-3 flex items-center justify-between shadow-sm z-10">
        <div>
          <h1 className="text-lg font-bold text-gray-900 truncate max-w-md">{project.title}</h1>
          <p className="text-xs text-gray-500 uppercase tracking-wide">{project.type === 'EBOOK' ? 'E-book Completo' : 'Curso Completo'}</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={onRestart} className="text-sm py-2 px-3">
            Novo Projeto
          </Button>
          <Button onClick={handleDownload} className="text-sm py-2 px-3">
            <Download size={16} className="mr-2" /> Baixar
          </Button>
        </div>
      </div>

      <div className="flex flex-grow overflow-hidden">
        
        {/* Sidebar Navigation */}
        <div className="w-80 bg-white border-r border-gray-200 flex flex-col hidden md:flex">
          <div className="p-4 border-b border-gray-100 bg-gray-50">
            {project.coverImage ? (
               <img src={project.coverImage} alt="Cover" className="w-full rounded shadow-md aspect-[3/4] object-cover" />
            ) : (
              <div className="w-full aspect-[3/4] bg-gray-200 rounded flex items-center justify-center text-gray-400">Sem Capa</div>
            )}
          </div>
          <div className="flex-grow overflow-y-auto p-2 space-y-1">
            {project.chapters.map((chapter, idx) => (
              <button
                key={idx}
                onClick={() => setActiveChapterIndex(idx)}
                className={`w-full text-left px-3 py-2 rounded-md text-sm transition-colors ${
                  idx === activeChapterIndex 
                    ? 'bg-brand-50 text-brand-700 font-medium' 
                    : 'text-gray-600 hover:bg-gray-100'
                }`}
              >
                <div className="flex gap-2">
                  <span className="opacity-50 w-5">{idx + 1}.</span>
                  <span className="truncate">{chapter.title}</span>
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Content Area */}
        <div className="flex-grow overflow-y-auto p-8 md:p-12 bg-gray-100 flex justify-center">
          <div className="max-w-3xl w-full bg-white shadow-lg min-h-[800px] rounded-lg p-12 relative animate-fade-in-up">
            <span className="absolute top-6 right-6 text-gray-300 font-serif italic">
               {project.type === 'EBOOK' ? 'Capítulo' : 'Módulo'} {activeChapterIndex + 1}
            </span>
            
            <h2 className="text-3xl font-bold text-gray-900 mb-8 pb-4 border-b border-gray-100">
              {activeChapter.title}
            </h2>
            
            <div className="prose prose-lg prose-indigo max-w-none text-gray-700 font-serif leading-relaxed whitespace-pre-wrap">
              {activeChapter.content}
            </div>

            <div className="flex justify-between mt-12 pt-8 border-t border-gray-100">
              <button 
                onClick={() => setActiveChapterIndex(Math.max(0, activeChapterIndex - 1))}
                disabled={activeChapterIndex === 0}
                className="flex items-center text-gray-500 hover:text-brand-600 disabled:opacity-30 disabled:hover:text-gray-500 transition-colors"
              >
                <ChevronLeft size={20} /> Anterior
              </button>
              <button 
                onClick={() => setActiveChapterIndex(Math.min(project.chapters.length - 1, activeChapterIndex + 1))}
                disabled={activeChapterIndex === project.chapters.length - 1}
                className="flex items-center text-gray-500 hover:text-brand-600 disabled:opacity-30 disabled:hover:text-gray-500 transition-colors"
              >
                Próximo <ChevronRight size={20} />
              </button>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};

export default FinalResult;
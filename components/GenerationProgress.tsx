import React from 'react';
import { Chapter } from '../types';
import { Loader2, CheckCircle, Circle } from 'lucide-react';

interface GenerationProgressProps {
  chapters: Chapter[];
  isGeneratingCover: boolean;
  coverUrl?: string;
}

const GenerationProgress: React.FC<GenerationProgressProps> = ({ chapters, isGeneratingCover, coverUrl }) => {
  const completedChapters = chapters.filter(c => c.content).length;
  const progress = Math.round((completedChapters / chapters.length) * 100);

  return (
    <div className="max-w-4xl mx-auto w-full px-4 grid grid-cols-1 md:grid-cols-3 gap-8">
      
      {/* Status Column */}
      <div className="md:col-span-2 space-y-6">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-3">
            <Loader2 className="animate-spin text-brand-600" />
            Criando sua obra prima...
          </h2>
          <p className="text-gray-600 mt-2">A IA está escrevendo os capítulos e desenhando a capa.</p>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex justify-between text-sm font-medium text-gray-700 mb-2">
            <span>Progresso da Escrita</span>
            <span>{progress}%</span>
          </div>
          <div className="w-full bg-gray-100 rounded-full h-2.5 mb-6">
            <div className="bg-brand-600 h-2.5 rounded-full transition-all duration-500" style={{ width: `${progress}%` }}></div>
          </div>

          <div className="space-y-3 max-h-64 overflow-y-auto pr-2">
            {chapters.map((chapter, idx) => (
              <div key={idx} className="flex items-center gap-3 text-sm">
                {chapter.content ? (
                  <CheckCircle className="text-green-500 flex-shrink-0" size={18} />
                ) : chapter.isGenerating ? (
                  <Loader2 className="animate-spin text-brand-500 flex-shrink-0" size={18} />
                ) : (
                  <Circle className="text-gray-300 flex-shrink-0" size={18} />
                )}
                <span className={`${chapter.content ? 'text-gray-900' : 'text-gray-500'} truncate`}>
                  {chapter.title}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Cover Preview Column */}
      <div className="md:col-span-1">
        <h3 className="font-semibold text-gray-900 mb-4">Gerando Capa...</h3>
        <div className="aspect-[3/4] rounded-lg border-2 border-dashed border-gray-300 bg-gray-50 flex flex-col items-center justify-center p-4 relative overflow-hidden group">
          {coverUrl ? (
            <img 
              src={coverUrl} 
              alt="Generated Cover" 
              className="absolute inset-0 w-full h-full object-cover transition-opacity duration-500"
            />
          ) : isGeneratingCover ? (
            <div className="text-center">
              <Loader2 className="animate-spin text-brand-500 mx-auto mb-2" size={32} />
              <span className="text-xs text-gray-500">Pintando pixels...</span>
            </div>
          ) : (
            <div className="text-gray-400 text-center">
              <span className="text-xs">Aguardando início...</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default GenerationProgress;
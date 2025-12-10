import React from 'react';
import { ProjectData, Chapter } from '../types';
import Button from './Button';
import { CheckCircle2, ChevronRight, FileText, Pencil } from 'lucide-react';

interface OutlineReviewProps {
  project: ProjectData;
  onConfirm: () => void;
  isLoading: boolean;
}

const OutlineReview: React.FC<OutlineReviewProps> = ({ project, onConfirm, isLoading }) => {
  return (
    <div className="max-w-4xl mx-auto w-full px-4">
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-gray-900">Estrutura Sugerida</h2>
        <p className="text-gray-600">Revise o planejamento criado pela IA antes de gerarmos o conteúdo completo.</p>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden mb-8">
        <div className="p-6 bg-brand-50 border-b border-brand-100">
          <h3 className="text-xl font-bold text-brand-900">{project.title}</h3>
          <div className="flex gap-4 mt-2 text-sm text-brand-700">
             <span className="flex items-center gap-1"><CheckCircle2 size={14}/> {project.chapters.length} {project.type === 'EBOOK' ? 'Capítulos' : 'Módulos'}</span>
             <span>•</span>
             <span>Tom: {project.tone}</span>
          </div>
        </div>
        
        <div className="divide-y divide-gray-100">
          {project.chapters.map((chapter, index) => (
            <div key={index} className="p-4 hover:bg-gray-50 transition-colors flex gap-4 items-start group">
              <div className="flex-shrink-0 w-8 h-8 rounded-full bg-gray-100 text-gray-500 flex items-center justify-center font-bold text-sm">
                {index + 1}
              </div>
              <div className="flex-grow">
                <h4 className="font-semibold text-gray-900">{chapter.title}</h4>
                <p className="text-sm text-gray-500 mt-1">{chapter.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="flex justify-end gap-4">
        {/* Future feature: Edit outline */}
        {/* <Button variant="outline" disabled={isLoading}>Editar Estrutura</Button> */}
        
        <Button onClick={onConfirm} isLoading={isLoading} className="w-full md:w-auto">
          <FileText size={18} className="mr-2" />
          Aprovar e Gerar Conteúdo
        </Button>
      </div>
    </div>
  );
};

export default OutlineReview;
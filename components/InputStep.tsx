import React, { useState } from 'react';
import { ContentType } from '../types';
import Button from './Button';
import { BookText, MonitorPlay, Sparkles } from 'lucide-react';

interface InputStepProps {
  type: ContentType;
  onSubmit: (data: { topic: string; audience: string; tone: string }) => void;
  isLoading: boolean;
}

const InputStep: React.FC<InputStepProps> = ({ type, onSubmit, isLoading }) => {
  const [topic, setTopic] = useState('');
  const [audience, setAudience] = useState('');
  const [tone, setTone] = useState('Inspirador e Prático');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (topic && audience) {
      onSubmit({ topic, audience, tone });
    }
  };

  return (
    <div className="max-w-2xl mx-auto w-full px-4 animate-fade-in">
      <div className="text-center mb-10">
        <div className="inline-flex items-center justify-center p-3 bg-brand-50 rounded-full text-brand-600 mb-4">
          {type === ContentType.EBOOK ? <BookText size={32} /> : <MonitorPlay size={32} />}
        </div>
        <h2 className="text-3xl font-bold text-gray-900">
          Vamos criar seu {type === ContentType.EBOOK ? 'E-book' : 'Curso'}
        </h2>
        <p className="mt-2 text-gray-600">
          A inteligência artificial irá estruturar, escrever e ilustrar seu projeto.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="bg-white rounded-2xl shadow-xl p-8 border border-gray-100 space-y-6">
        <div>
          <label htmlFor="topic" className="block text-sm font-medium text-gray-700 mb-1">
            Qual é o tema principal?
          </label>
          <textarea
            id="topic"
            required
            rows={2}
            className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-brand-500 focus:border-transparent resize-none"
            placeholder={type === ContentType.EBOOK ? "Ex: Guia de jardinagem para apartamentos pequenos" : "Ex: Masterclass de Marketing Digital para Iniciantes"}
            value={topic}
            onChange={(e) => setTopic(e.target.value)}
          />
        </div>

        <div>
          <label htmlFor="audience" className="block text-sm font-medium text-gray-700 mb-1">
            Quem é o público-alvo?
          </label>
          <input
            type="text"
            id="audience"
            required
            className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-brand-500 focus:border-transparent"
            placeholder="Ex: Jovens adultos, profissionais de RH, mães de primeira viagem..."
            value={audience}
            onChange={(e) => setAudience(e.target.value)}
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Tom de voz
          </label>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {['Profissional', 'Descontraído', 'Acadêmico', 'Inspirador'].map((t) => (
              <button
                key={t}
                type="button"
                onClick={() => setTone(t)}
                className={`px-3 py-2 text-sm rounded-md border transition-colors ${
                  tone === t 
                    ? 'bg-brand-50 border-brand-500 text-brand-700 font-medium' 
                    : 'border-gray-200 text-gray-600 hover:bg-gray-50'
                }`}
              >
                {t}
              </button>
            ))}
          </div>
        </div>

        <div className="pt-4">
          <Button 
            type="submit" 
            className="w-full" 
            isLoading={isLoading}
            disabled={!topic || !audience}
          >
            <Sparkles size={18} className="mr-2" />
            Gerar Estrutura
          </Button>
        </div>
      </form>
    </div>
  );
};

export default InputStep;
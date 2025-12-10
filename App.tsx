import React, { useState } from 'react';
import Layout from './components/Layout';
import Button from './components/Button';
import InputStep from './components/InputStep';
import OutlineReview from './components/OutlineReview';
import GenerationProgress from './components/GenerationProgress';
import FinalResult from './components/FinalResult';
import { AppStep, ContentType, ProjectData, WizardState } from './types';
import { generateStructure, generateChapterContent, generateCoverImage } from './services/geminiService';
import { BookOpen, MonitorPlay, Wand2, Star, AlertTriangle } from 'lucide-react';

export default function App() {
  const [wizardState, setWizardState] = useState<WizardState>({
    step: AppStep.HOME,
    isLoading: false,
    error: null,
  });

  const [projectData, setProjectData] = useState<ProjectData | null>(null);

  // Helper to handle API errors
  const handleError = (error: any) => {
    console.error(error);
    setWizardState(prev => ({ 
      ...prev, 
      isLoading: false, 
      error: "Ocorreu um erro ao comunicar com a IA. Verifique sua chave API ou tente novamente." 
    }));
  };

  // Helper to check/request API Key
  const checkApiKey = async (): Promise<boolean> => {
    if (window.aistudio && window.aistudio.openSelectKey) {
      try {
        const hasKey = await window.aistudio.hasSelectedApiKey();
        if (!hasKey) {
          await window.aistudio.openSelectKey();
          // We assume success if openSelectKey resolves without throwing
          return true;
        }
        return true;
      } catch (e) {
        console.error("Error checking API key:", e);
        // If selection failed or was cancelled, we might still try, 
        // but high quality models will likely fail.
        return false;
      }
    }
    // If not in the specific AI Studio environment, assume env vars are set
    return true;
  };

  // Step 1: Start Project
  const startProject = (type: ContentType) => {
    setProjectData({
      type,
      topic: '',
      targetAudience: '',
      tone: '',
      title: '',
      chapters: [],
    });
    setWizardState({ step: AppStep.INPUT, isLoading: false, error: null });
  };

  // Step 2: Generate Outline
  const handleInputSubmit = async (data: { topic: string; audience: string; tone: string }) => {
    if (!projectData) return;
    
    setWizardState({ ...wizardState, isLoading: true, error: null });
    
    try {
      // Ensure we have a key before calling any model
      await checkApiKey();

      const result = await generateStructure(data.topic, data.audience, data.tone, projectData.type);
      
      setProjectData({
        ...projectData,
        ...data,
        title: result.title,
        chapters: result.chapters.map(c => ({ ...c, isGenerating: false }))
      });
      
      setWizardState({ step: AppStep.OUTLINE, isLoading: false, error: null });
    } catch (e) {
      handleError(e);
    }
  };

  // Step 3: Confirm Outline & Start Full Generation
  const handleOutlineConfirm = async () => {
    if (!projectData) return;
    
    // Ensure API key is selected specifically for the high-quality image model
    const keyReady = await checkApiKey();
    if (!keyReady) {
      setWizardState(prev => ({ ...prev, error: "É necessário selecionar uma chave API para gerar imagens de alta qualidade." }));
      return;
    }

    setWizardState({ step: AppStep.GENERATION, isLoading: true, error: null });

    // 1. Trigger Cover Generation (Async, don't await immediately)
    const coverPromise = generateCoverImage(projectData.title, projectData.topic, projectData.type)
      .then(url => {
        if (url) {
          setProjectData(prev => prev ? ({ ...prev, coverImage: url }) : null);
        }
      });

    // 2. Iterate Chapters
    const chapters = [...projectData.chapters];
    
    for (let i = 0; i < chapters.length; i++) {
      // Mark current as generating
      setProjectData(prev => {
        if (!prev) return null;
        const newChapters = [...prev.chapters];
        newChapters[i].isGenerating = true;
        return { ...prev, chapters: newChapters };
      });

      // Generate content
      const content = await generateChapterContent(
        projectData.title,
        chapters[i].title,
        chapters[i].description,
        projectData.tone,
        projectData.type
      );

      // Update chapter with content
      setProjectData(prev => {
        if (!prev) return null;
        const newChapters = [...prev.chapters];
        newChapters[i].content = content;
        newChapters[i].isGenerating = false;
        return { ...prev, chapters: newChapters };
      });
    }

    // Await cover if it's not done yet (optional, or just show result)
    await coverPromise;

    setWizardState({ step: AppStep.RESULT, isLoading: false, error: null });
  };

  const handleRestart = () => {
    setWizardState({ step: AppStep.HOME, isLoading: false, error: null });
    setProjectData(null);
  };

  // --- Render Views ---

  if (wizardState.step === AppStep.RESULT && projectData) {
    return <FinalResult project={projectData} onRestart={handleRestart} />;
  }

  return (
    <Layout onGoHome={handleRestart}>
      <div className="flex-grow flex flex-col justify-center py-12">
        
        {/* Error Notification */}
        {wizardState.error && (
          <div className="max-w-md mx-auto mb-8 p-4 bg-red-50 text-red-700 border border-red-200 rounded-lg flex items-center gap-3">
            <AlertTriangle size={20} />
            {wizardState.error}
          </div>
        )}

        {/* HOME View */}
        {wizardState.step === AppStep.HOME && (
          <div className="max-w-5xl mx-auto px-4 w-full">
            <div className="text-center mb-16 space-y-4">
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-indigo-50 text-indigo-700 rounded-full text-sm font-medium animate-fade-in-up">
                <Star size={16} className="fill-indigo-700" /> Tecnologia Gemini 3 Pro
              </div>
              <h1 className="text-4xl md:text-6xl font-bold text-gray-900 tracking-tight leading-tight">
                Crie Conteúdo Educacional <br/>
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-600 to-purple-600">
                  Em Nível Profissional
                </span>
              </h1>
              <p className="text-xl text-gray-600 max-w-2xl mx-auto">
                Transforme suas ideias em E-books completos ou Cursos estruturados em minutos. 
                Com capas geradas por IA, sumários inteligentes e conteúdo aprofundado.
              </p>
            </div>

            <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
              {/* E-book Card */}
              <div 
                onClick={() => startProject(ContentType.EBOOK)}
                className="group relative bg-white rounded-2xl p-8 shadow-sm hover:shadow-xl border border-gray-200 hover:border-brand-300 transition-all duration-300 cursor-pointer overflow-hidden"
              >
                <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                  <BookOpen size={120} className="text-brand-600" />
                </div>
                <div className="w-14 h-14 bg-brand-100 rounded-xl flex items-center justify-center text-brand-600 mb-6 group-hover:scale-110 transition-transform">
                  <BookOpen size={28} />
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-2">Criar E-book</h3>
                <p className="text-gray-600 mb-6">
                  Perfeito para guias, narrativas ou manuais. Gera capítulos fluídos, formatação markdown e capa vertical.
                </p>
                <span className="text-brand-600 font-medium flex items-center group-hover:translate-x-1 transition-transform">
                  Começar agora <Wand2 size={16} className="ml-2" />
                </span>
              </div>

              {/* Course Card */}
              <div 
                onClick={() => startProject(ContentType.COURSE)}
                className="group relative bg-white rounded-2xl p-8 shadow-sm hover:shadow-xl border border-gray-200 hover:border-purple-300 transition-all duration-300 cursor-pointer overflow-hidden"
              >
                <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                  <MonitorPlay size={120} className="text-purple-600" />
                </div>
                <div className="w-14 h-14 bg-purple-100 rounded-xl flex items-center justify-center text-purple-600 mb-6 group-hover:scale-110 transition-transform">
                  <MonitorPlay size={28} />
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-2">Criar Curso</h3>
                <p className="text-gray-600 mb-6">
                  Ideal para aulas estruturadas. Organiza em módulos e lições com tom didático e explicativo.
                </p>
                <span className="text-purple-600 font-medium flex items-center group-hover:translate-x-1 transition-transform">
                  Começar agora <Wand2 size={16} className="ml-2" />
                </span>
              </div>
            </div>
          </div>
        )}

        {/* INPUT View */}
        {wizardState.step === AppStep.INPUT && projectData && (
          <InputStep 
            type={projectData.type} 
            onSubmit={handleInputSubmit} 
            isLoading={wizardState.isLoading} 
          />
        )}

        {/* OUTLINE View */}
        {wizardState.step === AppStep.OUTLINE && projectData && (
          <OutlineReview 
            project={projectData} 
            onConfirm={handleOutlineConfirm} 
            isLoading={wizardState.isLoading} 
          />
        )}

        {/* GENERATION View */}
        {wizardState.step === AppStep.GENERATION && projectData && (
          <GenerationProgress 
            chapters={projectData.chapters}
            isGeneratingCover={!projectData.coverImage}
            coverUrl={projectData.coverImage}
          />
        )}

      </div>
    </Layout>
  );
}
export enum ContentType {
  EBOOK = 'EBOOK',
  COURSE = 'COURSE'
}

export interface Chapter {
  title: string;
  description: string;
  content?: string; // Markdown or HTML content
  isGenerating?: boolean;
}

export interface ProjectData {
  topic: string;
  targetAudience: string;
  tone: string;
  type: ContentType;
  title: string;
  chapters: Chapter[];
  coverImage?: string; // Base64 string
}

export enum AppStep {
  HOME = 'HOME',
  INPUT = 'INPUT',
  OUTLINE = 'OUTLINE',
  GENERATION = 'GENERATION',
  RESULT = 'RESULT'
}

export interface WizardState {
  step: AppStep;
  isLoading: boolean;
  error: string | null;
}

// Global type augmentation for AI Studio
declare global {
  interface AIStudio {
    hasSelectedApiKey: () => Promise<boolean>;
    openSelectKey: () => Promise<void>;
  }

  interface Window {
    aistudio?: AIStudio;
  }
}
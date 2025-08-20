import { useContentCtx } from '../context/ContentContext';
export const useStories = () => useContentCtx().stories;
export const useQuizzes = () => useContentCtx().quizzes;
export const useTips = () => useContentCtx().tips;
export const useWorlds = () => useContentCtx().worlds;
export const useObservations = () => useContentCtx().observations;
export const useMusic = () => useContentCtx().music;
export const useWellness = () => useContentCtx().wellness;

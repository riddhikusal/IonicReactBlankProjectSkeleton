import { create, StateCreator } from 'zustand';
import { IChapterResources, IGetChapterResponse, IResourceItem } from '../../api/contentApi/contentApi.interface';
import { persist, createJSONStorage, PersistOptions } from 'zustand/middleware';

// Type for persisted state
type PersistedChapterStore = Omit<IChapterStore, 'setSubjectAndBookName' | 'setChapterInfo' | 'setChapterResources' | 'resetChapterStore' | 'setSelectedChapterResources' | 'setAudioIsPlaying' | 'setContentLoading' | 'setContentLoaded'>;

export interface IFullChapterInfo extends IGetChapterResponse {
    subjectName: string;
    bookName: string;
    audioIsPlaying: boolean;
    contentLoading: boolean;
    contentLoaded: boolean;
}
export type IChapterStore = {
    chapterInfo: IFullChapterInfo;
    chapterResources: IChapterResources;
    selectedChapterResources: IResourceItem | null;
    resetChapterStore?: () => void;
    setSubjectAndBookName?: (subjectName: string, bookName: string) => void;
    setChapterInfo?: (chapterInfo: IFullChapterInfo) => void;
    setChapterResources?: (chapterResources: IChapterResources) => void;
    setSelectedChapterResources?: (selectedChapterResources: IResourceItem) => void;
    setAudioIsPlaying?: (audioIsPlaying: boolean) => void;
    setContentLoading?: (contentLoading: boolean) => void;
    setContentLoaded?: (contentLoaded: boolean) => void;
}

const initialState: Omit<IChapterStore, 'setSubjectAndBookName' | 'setChapterInfo' | 'setChapterResources' | 'resetChapterStore' | 'setSelectedChapterResources'> = {
    chapterInfo: {
        chapterId: 0,
        subjectId: 0,
        subjectName: '',
        bookName: '',
        chapterNo: 0,
        title: '',
        languageCode: '',
        isActive: false,
        image: '',
        audioIsPlaying: false,
        contentLoading: false,
        contentLoaded: false,
    },

    chapterResources: {
        "BOOK READER": [],
        "FLASHCARDS": [],
        "NOTES & REFERENCES": [],
        "QUESTION ANSWERS": [],
        "QUIZ": [],
        "VIDEO EXPLAINERS": [],
    },
    selectedChapterResources: null,

}

type ChapterStoreState = StateCreator<IChapterStore, [], [["zustand/persist", unknown]]>;

export const useChapterStore = create<IChapterStore>()(
    persist(
        (set) => ({
            ...initialState,
            setSubjectAndBookName: (subjectName: string, bookName: string) => set((state) => ({ 
                chapterInfo: { ...state.chapterInfo, subjectName, bookName } 
            })),
            setAudioIsPlaying: (audioIsPlaying: boolean) => set((state) => ({ 
                chapterInfo: { ...state.chapterInfo, audioIsPlaying: audioIsPlaying } 
            })),
            setContentLoading: (contentLoading: boolean) => set((state) => ({ 
                chapterInfo: { ...state.chapterInfo, contentLoading: contentLoading } 
            })),
            setContentLoaded: (contentLoaded: boolean) => set((state) => ({ 
                chapterInfo: { ...state.chapterInfo, contentLoaded: contentLoaded} 
            })),
            setChapterInfo: (chapterInfo: IFullChapterInfo) => set((state) => ({ 
                chapterInfo: { ...state.chapterInfo, ...chapterInfo } 
            })),
            setChapterResources: (chapterResources: IChapterResources) => set({ chapterResources }),
            resetChapterStore: () => set(initialState),
            setSelectedChapterResources: (selectedChapterResources: IResourceItem) => set({ selectedChapterResources }),
        }),
        {
            name: 'chapter-store',
            storage: createJSONStorage(() => localStorage),
            partialize: (state) => ({
                // Only persist these specific properties, exclude loading states
                chapterInfo: {
                    ...state.chapterInfo,
                    contentLoading: false, // Always reset to false on persist
                    audioIsPlaying: false, // Always reset to false on persist
                    contentLoaded: false, // Always reset to false on persist
                },
                chapterResources: state.chapterResources, // Always reset to false on persist
                selectedChapterResources: state.selectedChapterResources, // Always reset to false on persist   
            }),
        }
    )
)

import { create, StateCreator } from 'zustand';
import { IChapterResources, IGetChapterResponse, IResourceItem } from '../../api/contentApi/contentApi.interface';
import { persist, createJSONStorage, PersistOptions } from 'zustand/middleware'

export interface IFullChapterInfo extends IGetChapterResponse {
    subjectName: string;
    bookName: string;
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
        }
    )
)

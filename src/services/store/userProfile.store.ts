import { create, StateCreator } from 'zustand';
import { persist, createJSONStorage, PersistOptions } from 'zustand/middleware';
import { UserProfile } from '../../utils/profileStorage';

interface UserProfileStore {
    userProfile: UserProfile;
    setUserProfileInStore: (userProfile: UserProfile) => void;
    resetUserProfile: () => void;
}

const initialState: UserProfileStore = {
    userProfile: {},
    setUserProfileInStore: () => {},
    resetUserProfile: () => {},
}

export const useUserProfileStore = create<UserProfileStore>()(
    persist(
        (set) => ({
            ...initialState,
            setUserProfileInStore: (userProfile: UserProfile) => set({ userProfile }),
            resetUserProfile: () => set(initialState),
        }),
        {
            name: 'userProfile-store',
            storage: createJSONStorage(() => localStorage),
            partialize: (state) => ({
                // don't persist anything
                userProfile: {
                    ...state.userProfile,
                },
            }),
        }
    )
)
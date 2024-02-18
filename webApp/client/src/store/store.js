// https://www.npmjs.com/package/zustand

import { create } from 'zustand';

export const useAuthStore = create((set) => ({
    auth : {
        username : '',
        active : false
    },
    setUsername : (name) => set((state) => ({ auth : { ...state.auth, username : name }})) 
}))

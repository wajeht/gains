import { defineStore } from 'pinia';

const useAppStore = defineStore({
  id: 'app',
  state: () => {
    return {
      loading: false,
    };
  },
  getters: {},
  actions: {},
});

export default useAppStore;

import { defineStore } from 'pinia';

const useAppStore = defineStore({
  id: 'app',
  state: () => {
    return {
      loading: false,
      toast: {
        toggle: false,
        message: '',
      },
    };
  },
  getters: {},
  actions: {
    clearToast() {
      this.toast.toggle = false;
      this.toast.message = '';
    },
    showToast(message) {
      this.toast.toggle = true;
      this.toast.message = message;

      // clear after 5 sec
      setTimeout(() => {
        this.clearToast();
      }, 5000);
    },
  },
});

export default useAppStore;

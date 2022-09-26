import { defineStore } from 'pinia';

const useAppStore = defineStore({
  id: 'app',
  state: () => {
    return {
      loading: false,
      numberOfSessionsPerWeek: 4,
      toast: {
        toggle: false,
        message: '',
      },
      community: false,
      unit: {
        toggle: true,
        label: 'lbs',
      },
      appVersion: null,
    };
  },
  getters: {
    unitLabel() {
      return this.unit.toggle === true ? 'lbs.' : 'kg.';
    },
  },
  actions: {
    changeUnit() {
      this.unit.toggle = !this.unit.toggle;
    },
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
  persist: {
    id: 'app',
    storage: window.localStorage,
    paths: ['numberOfSessionsPerWeek', 'unit', 'appVersion', 'community'],
  },
});

export default useAppStore;

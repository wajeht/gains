import useUserStore from '../apps/ui/store/user.store.js';

export default class Api {
  static buildOptions(body, method) {
    return {
      method,
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body),
    };
  }

  static logout() {
    const userStore = useUserStore();
    userStore.isLoggedIn = false;
    userStore.clearUserInfo();
    userStore.logout();
  }

  static async fetchAndHandleUnauthorized(url, options) {
    const res = await window.fetch(url, options);
    if (res.status === 403 || res.status === 401) {
      this.logout();
    }
    return res;
  }

  static async post(url, body) {
    const options = this.buildOptions(body, 'POST');
    return this.fetchAndHandleUnauthorized(url, options);
  }

  static async get(url) {
    const options = {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    };
    return this.fetchAndHandleUnauthorized(url, options);
  }

  static async patch(url, body) {
    const options = this.buildOptions(body, 'PATCH');
    return this.fetchAndHandleUnauthorized(url, options);
  }

  static async delete(url, body) {
    const options = this.buildOptions(body, 'DELETE');
    return this.fetchAndHandleUnauthorized(url, options);
  }
}

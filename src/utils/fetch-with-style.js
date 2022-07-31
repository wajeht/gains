import useUserStore from '../apps/ui/store/user.store.js';

// TODO! Refactor this code below

export default class Api {
  /**
   * It takes a body and a method, and returns an object with the method and headers set
   * @param body - The body of the request.
   * @param method - The HTTP method to use.
   * @returns A function that takes two arguments, body and method.
   */
  static #buildOptions(body, method) {
    return {
      method: method,
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body),
    };
  }

  /**
   * It sets the `isLoggedIn` property of the `userStore` to `false` and then calls the `clearUserInfo`
   * method of the `userStore`
   */
  static #logout() {
    const userStore = useUserStore();
    userStore.isLoggedIn = false;
    userStore.clearUserInfo();
    userStore.logout();
  }

  /**
   * It sends a POST request to the server, and if the server responds with a 403 or 401 status code, it
   * logs the user out
   * @param url - The url to make the request to.
   * @param body - The body of the request.
   * @returns The response from the fetch call.
   */
  static async post(url, body) {
    const options = this.#buildOptions(body, 'POST');
    const res = await window.fetch(url, options);
    if (res.status === 403 || res.status === 401) {
      this.#logout();
      return res;
    }
    return res;
  }

  /**
   * It makes a GET request to the given url, and if the response is a 403 or 401, it logs the user out
   * @param url - The url to send the request to.
   * @returns The response from the fetch request.
   */
  static async get(url) {
    const res = await window.fetch(url, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });
    if (res.status === 403 || res.status === 401) {
      this.#logout();
      return res;
    }
    return res;
  }

  /**
   * It sends a PATCH request to the server, and if the server responds with a 403 or 401 status code, it
   * logs the user out
   * @param url - The url to make the request to.
   * @param body - The body of the request.
   * @returns The response from the server.
   */
  static async patch(url, body) {
    const options = this.#buildOptions(body, 'PATCH');
    const res = await window.fetch(url, options);
    if (res.status === 403 || res.status === 401) {
      this.#logout();
      return res;
    }
    return res;
  }

  /**
   * It takes a URL and a body, builds an options object, and then makes a DELETE request to the URL with
   * the options
   * @param url - The url to make the request to.
   * @param body - The body of the request.
   * @returns The response from the fetch call.
   */
  static async delete(url, body) {
    const options = this.#buildOptions(body, 'DELETE');
    const res = await window.fetch(url, options);
    if (res.status === 403 || res.status === 401) {
      this.#logout();
      return res;
    }
    return res;
  }
}

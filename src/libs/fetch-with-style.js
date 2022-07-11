import useUserStore from '../apps/ui/store/user.store.js';

/* It's a class that makes it easy to make API calls */
export default class Api {
  /**
   * It takes a method and a body, and returns an object with the method, a header, and the body
   * @param method - The HTTP method to use.
   * @param body - The body of the request.
   * @returns an object with the method, headers, and body.
   */
  static #_buildOptions(body, method) {
    const options = {
      method: method,
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body),
    };
    return options;
  }

  /**
   * If the user is not authenticated, log them out
   */
  static async #_logOutIfNotAuthenticated() {
    const userStore = useUserStore();
    const res = await userStore.checkAuthentication();
    if (res.status === 'success') {
      return true;
    } else {
      return false;
    }
  }

  /**
   * It sends a POST request to the server, and returns the response as a JSON object
   * @param url - The url to make the request to.
   * @param body - The body of the request.
   * @returns The response from the server.
   */
  static async post(url, body) {
    const isStillLoggedIn = await this.#_logOutIfNotAuthenticated();
    let res;
    if (isStillLoggedIn) {
      const data = this.#_buildOptions(body, 'POST');
      res = await window.fetch(url, data);
    }
    return res;
  }

  /**
   * If the user is not authenticated, log them out. If they are authenticated, make a request to the
   * given url and return the response as JSON
   * @param url - The url to fetch from.
   * @returns The response from the server.
   */
  static async get(url) {
    const isStillLoggedIn = await this.#_logOutIfNotAuthenticated();
    let res;
    if (isStillLoggedIn) {
      res = await window.fetch(url);
    }
    return res;
  }

  /**
   * It takes a URL and a body, builds an options object, and then makes a PATCH request to the URL with
   * the options object
   * @param url - The url to make the request to.
   * @param body - The body of the request.
   * @returns The response from the server.
   */
  static async patch(url, body) {
    const isStillLoggedIn = await this.#_logOutIfNotAuthenticated();
    let res;
    if (isStillLoggedIn) {
      const data = this.#_buildOptions(body, 'PATCH');
      res = await window.fetch(url, data);
    }
    return res;
  }

  /**
   * It logs out the user if they're not authenticated, builds the options for the request, makes the
   * request, and returns the response
   * @param url - The url to make the request to.
   * @param body - The body of the request.
   * @returns The response from the server.
   */
  static async delete(url, body) {
    const isStillLoggedIn = await this.#_logOutIfNotAuthenticated();
    let res;
    if (isStillLoggedIn) {
      const data = this.#_buildOptions(body, 'DELETE');
      res = await window.fetch(url, data);
    }
    return res;
  }
}

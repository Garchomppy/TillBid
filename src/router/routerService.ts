import type { View, RouterState } from '../types';

class Router {
  private currentView: View = "home";
  private currentParams: Record<string, string> = {};
  private snapshot: RouterState = { view: "home", params: {} };
  private listeners: (() => void)[] = [];

  constructor() {
    if (typeof window !== "undefined") {
      window.addEventListener("hashchange", () => this.handleHashChange());
      this.handleHashChange();
    }
  }

  private handleHashChange() {
    const hash = window.location.hash.substring(1);
    const [path, queryString] = hash.split("?");

    const nextView = (path as View) || "home";
    const nextParams: Record<string, string> = {};

    if (queryString) {
      queryString.split("&").forEach((param) => {
        const [key, value] = param.split("=");
        nextParams[key] = value;
      });
    }

    this.currentView = nextView;
    this.currentParams = nextParams;

    this.snapshot = { view: this.currentView, params: this.currentParams };
    this.notify();
  }

  private notify() {
    this.listeners.forEach((l) => l());
  }

  subscribe = (listener: () => void) => {
    this.listeners.push(listener);
    return () => {
      this.listeners = this.listeners.filter((l) => l !== listener);
    };
  };

  navigate(view: View, params: Record<string, string> = {}) {
    let hash = `#${view}`;
    const query = Object.entries(params)
      .map(([k, v]) => `${k}=${v}`)
      .join("&");

    if (query) hash += `?${query}`;
    window.location.hash = hash;
  }

  getView = () => {
    return this.snapshot;
  };
}

export const router = new Router();

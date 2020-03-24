import { EventListener, Events } from "./interface";

export default class ConfigEvents implements Events {
  constructor() {
    this.listeners = {};
  }

  private listeners: { [type: string]: Array<EventListener> };

  public on(type: string, listener: EventListener) {
    let listeners = this.listeners[type];
    if (!listeners) {
      listeners = [];
      this.listeners[type] = listeners;
    }
    listeners.push(listener);
  }

  public emit<T>(type: string, ...args) {
    const listeners = this.listeners[type];
    if (listeners) {
      listeners.forEach((listener) => {
        listener(...args);
      });
    }
  }
}

import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root' // This ensures a singleton instance is used across the app
})
export class WindRefService {
  constructor() {}

  getNativeWindow(): Window {
    return window;
  }
}

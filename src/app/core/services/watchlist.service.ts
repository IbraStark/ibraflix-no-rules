import { Injectable, signal } from '@angular/core';
import { WatchlistItem, MediaItem } from '../models';

@Injectable({
  providedIn: 'root'
})
export class WatchlistService {
  private readonly STORAGE_KEY = 'ibraflix_watchlist';
  private watchlistSignal = signal<WatchlistItem[]>(this.loadFromStorage());

  watchlist = this.watchlistSignal.asReadonly();

  constructor() {
    // Load from storage on initialization
    this.loadFromStorage();
  }

  private loadFromStorage(): WatchlistItem[] {
    try {
      const stored = localStorage.getItem(this.STORAGE_KEY);
      if (stored) {
        return JSON.parse(stored);
      }
    } catch (error) {
      console.error('Error loading watchlist from storage:', error);
    }
    return [];
  }

  private saveToStorage(items: WatchlistItem[]): void {
    try {
      localStorage.setItem(this.STORAGE_KEY, JSON.stringify(items));
      this.watchlistSignal.set(items);
    } catch (error) {
      console.error('Error saving watchlist to storage:', error);
    }
  }

  addToWatchlist(item: MediaItem): void {
    const current = this.watchlistSignal();
    
    // Check if already in watchlist
    if (this.isInWatchlist(item.id)) {
      return;
    }

    const watchlistItem: WatchlistItem = {
      ...item,
      added_at: Date.now()
    };

    const updated = [...current, watchlistItem];
    this.saveToStorage(updated);
  }

  removeFromWatchlist(id: number): void {
    const current = this.watchlistSignal();
    const updated = current.filter(item => item.id !== id);
    this.saveToStorage(updated);
  }

  isInWatchlist(id: number): boolean {
    return this.watchlistSignal().some(item => item.id === id);
  }

  getWatchlist(): WatchlistItem[] {
    return this.watchlistSignal();
  }

  clearWatchlist(): void {
    this.saveToStorage([]);
  }

  getWatchlistCount(): number {
    return this.watchlistSignal().length;
  }
}

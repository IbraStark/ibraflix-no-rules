import { Component, OnInit, inject, signal, effect } from '@angular/core';
import { CommonModule } from '@angular/common';
import { WatchlistService } from '../../core/services/watchlist.service';
import { WatchlistItem } from '../../core/models';
import { MediaCardComponent } from '../../shared/components/media-card/media-card.component';

@Component({
  selector: 'app-watchlist',
  standalone: true,
  imports: [CommonModule, MediaCardComponent],
  template: `
    <div class="watchlist-page">
      <div class="watchlist-container">
        <h1 class="page-title">My List</h1>
        
        @if (watchlist().length === 0) {
          <div class="empty-state">
            <svg width="64" height="64" viewBox="0 0 24 24" fill="currentColor">
              <path d="M19 13h-6v6h-2v-6H5v-2h6V5h2v6h6v2z"/>
            </svg>
            <h2>Your watchlist is empty</h2>
            <p>Start adding movies and TV shows to your list!</p>
            <a routerLink="/browse" class="btn">Browse Content</a>
          </div>
        } @else {
          <div class="watchlist-header">
            <p>{{ watchlist().length }} {{ watchlist().length === 1 ? 'item' : 'items' }} in your list</p>
          </div>
          <div class="grid">
            @for (item of watchlist(); track item.id) {
              <div class="grid-item">
                <app-media-card [media]="item"></app-media-card>
              </div>
            }
          </div>
        }
      </div>
    </div>
  `,
  styles: [`
    .watchlist-page {
      min-height: 100vh;
      padding: 2rem;
    }

    .watchlist-container {
      max-width: 1400px;
      margin: 0 auto;
    }

    .page-title {
      color: #fff;
      font-size: 2rem;
      margin: 0 0 2rem 0;
    }

    .watchlist-header {
      color: #b3b3b3;
      margin-bottom: 1.5rem;
    }

    .grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
      gap: 1rem;
    }

    .empty-state {
      text-align: center;
      padding: 4rem 2rem;
      color: #b3b3b3;
    }

    .empty-state svg {
      color: #666;
      margin-bottom: 1rem;
    }

    .empty-state h2 {
      color: #fff;
      font-size: 1.5rem;
      margin: 0 0 0.5rem 0;
    }

    .empty-state p {
      margin: 0 0 2rem 0;
      font-size: 1rem;
    }

    .btn {
      display: inline-block;
      padding: 0.75rem 2rem;
      background: #e50914;
      color: #fff;
      text-decoration: none;
      border-radius: 4px;
      font-weight: 600;
      transition: background 0.3s ease;
    }

    .btn:hover {
      background: #f40612;
    }

    @media (max-width: 768px) {
      .watchlist-page {
        padding: 1rem;
      }

      .grid {
        grid-template-columns: repeat(auto-fill, minmax(150px, 1fr));
      }
    }
  `]
})
export class WatchlistComponent implements OnInit {
  private watchlistService = inject(WatchlistService);
  watchlist = signal<WatchlistItem[]>([]);

  ngOnInit() {
    // React to watchlist changes
    effect(() => {
      const items = this.watchlistService.watchlist();
      this.watchlist.set(items);
    });
  }
}

import { Component, Input, Output, EventEmitter, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { MediaItem } from '../../../core/models';
import { TmdbApiService } from '../../../core/services/tmdb-api.service';
import { WatchlistService } from '../../../core/services/watchlist.service';

@Component({
  selector: 'app-media-card',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <div class="media-card" (mouseenter)="onHover()" (mouseleave)="onLeave()">
      <div class="card-image-container">
        <img
          [src]="getPosterUrl()"
          [alt]="getTitle()"
          loading="lazy"
          (error)="onImageError($event)"
          class="card-image"
        />
        <div class="card-overlay" [class.active]="isHovered">
          <div class="card-actions">
            <button
              class="action-btn play-btn"
              (click)="navigateToDetails()"
              aria-label="View details"
            >
              <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
                <path d="M8 5v14l11-7z"/>
              </svg>
            </button>
            <button
              class="action-btn watchlist-btn"
              [class.active]="isInWatchlist"
              (click)="toggleWatchlist()"
              [attr.aria-label]="isInWatchlist ? 'Remove from watchlist' : 'Add to watchlist'"
            >
              @if (isInWatchlist) {
                <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z"/>
                </svg>
              } @else {
                <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M19 13h-6v6h-2v-6H5v-2h6V5h2v6h6v2z"/>
                </svg>
              }
            </button>
          </div>
        </div>
      </div>
      <div class="card-info">
        <div class="card-rating">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
            <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
          </svg>
          <span>{{ media.vote_average.toFixed(1) }}</span>
        </div>
        <h3 class="card-title">{{ getTitle() }}</h3>
      </div>
    </div>
  `,
  styles: [`
    .media-card {
      position: relative;
      cursor: pointer;
      transition: transform 0.3s ease;
    }

    .media-card:hover {
      transform: scale(1.05);
      z-index: 10;
    }

    .card-image-container {
      position: relative;
      width: 100%;
      aspect-ratio: 2/3;
      border-radius: 4px;
      overflow: hidden;
      background: #1f1f1f;
    }

    .card-image {
      width: 100%;
      height: 100%;
      object-fit: cover;
      display: block;
    }

    .card-overlay {
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      background: rgba(0, 0, 0, 0.7);
      display: flex;
      align-items: center;
      justify-content: center;
      opacity: 0;
      transition: opacity 0.3s ease;
    }

    .card-overlay.active {
      opacity: 1;
    }

    .card-actions {
      display: flex;
      gap: 1rem;
    }

    .action-btn {
      width: 40px;
      height: 40px;
      border-radius: 50%;
      border: 2px solid #fff;
      background: rgba(255, 255, 255, 0.2);
      color: #fff;
      display: flex;
      align-items: center;
      justify-content: center;
      cursor: pointer;
      transition: all 0.3s ease;
    }

    .action-btn:hover {
      background: #fff;
      color: #000;
      transform: scale(1.1);
    }

    .watchlist-btn.active {
      background: #e50914;
      border-color: #e50914;
    }

    .card-info {
      padding: 0.5rem 0;
    }

    .card-rating {
      display: flex;
      align-items: center;
      gap: 0.25rem;
      color: #ffd700;
      font-size: 0.875rem;
      font-weight: 600;
      margin-bottom: 0.25rem;
    }

    .card-title {
      font-size: 0.875rem;
      font-weight: 500;
      color: #fff;
      margin: 0;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    }
  `]
})
export class MediaCardComponent {
  @Input() media!: MediaItem;
  @Output() play = new EventEmitter<MediaItem>();
  
  private tmdbApi = inject(TmdbApiService);
  private watchlistService = inject(WatchlistService);
  
  isHovered = false;
  isInWatchlist = false;

  ngOnInit() {
    this.isInWatchlist = this.watchlistService.isInWatchlist(this.media.id);
  }

  getPosterUrl(): string {
    return this.tmdbApi.getPosterUrl(this.media.poster_path);
  }

  getTitle(): string {
    return this.media.title || this.media.name || 'Unknown';
  }

  onHover() {
    this.isHovered = true;
  }

  onLeave() {
    this.isHovered = false;
  }

  onImageError(event: Event) {
    const img = event.target as HTMLImageElement;
    img.src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMzAwIiBoZWlnaHQ9IjQ1MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMzAwIiBoZWlnaHQ9IjQ1MCIgZmlsbD0iIzJhMmEyYSIvPjx0ZXh0IHg9IjUwJSIgeT0iNTAlIiBmb250LWZhbWlseT0iQXJpYWwiIGZvbnQtc2l6ZT0iMTgiIGZpbGw9IiM4ODg4ODgiIHRleHQtYW5jaG9yPSJtaWRkbGUiIGR5PSIuM2VtIj5ObyBJbWFnZTwvdGV4dD48L3N2Zz4=';
  }

  navigateToDetails() {
    const type = this.media.media_type || (this.media.title ? 'movie' : 'tv');
    window.location.href = `/details/${type}/${this.media.id}`;
  }

  toggleWatchlist() {
    if (this.isInWatchlist) {
      this.watchlistService.removeFromWatchlist(this.media.id);
    } else {
      this.watchlistService.addToWatchlist(this.media);
    }
    this.isInWatchlist = !this.isInWatchlist;
  }
}

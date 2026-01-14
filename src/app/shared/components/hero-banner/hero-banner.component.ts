import { Component, Input, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { MediaItem } from '../../../core/models';
import { TmdbApiService } from '../../../core/services/tmdb-api.service';

@Component({
  selector: 'app-hero-banner',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    @if (featured) {
      <div class="hero-banner" [style.background-image]="'url(' + getBackdropUrl() + ')'">
        <div class="hero-overlay"></div>
        <div class="hero-content">
          <h1 class="hero-title">{{ getTitle() }}</h1>
          <div class="hero-meta">
            <span class="hero-rating">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
              </svg>
              {{ featured.vote_average.toFixed(1) }}
            </span>
            <span class="hero-year">{{ getYear() }}</span>
            @if (getGenres()) {
              <span class="hero-genres">
                {{ getGenres() }}
              </span>
            }
          </div>
          <p class="hero-overview">{{ truncateOverview() }}</p>
          <div class="hero-actions">
            <a
              [routerLink]="['/details', getMediaType(), featured.id]"
              class="btn btn-primary"
            >
              <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
                <path d="M8 5v14l11-7z"/>
              </svg>
              Play
            </a>
            <a
              [routerLink]="['/details', getMediaType(), featured.id]"
              class="btn btn-secondary"
            >
              More Info
            </a>
          </div>
        </div>
      </div>
    }
  `,
  styles: [`
    .hero-banner {
      position: relative;
      width: 100%;
      height: 80vh;
      min-height: 500px;
      background-size: cover;
      background-position: center;
      background-repeat: no-repeat;
      display: flex;
      align-items: center;
      margin-bottom: 2rem;
    }

    .hero-overlay {
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      background: linear-gradient(
        to right,
        rgba(0, 0, 0, 0.9) 0%,
        rgba(0, 0, 0, 0.7) 50%,
        transparent 100%
      );
    }

    .hero-content {
      position: relative;
      z-index: 1;
      max-width: 600px;
      padding: 2rem;
      margin-left: 4rem;
    }

    .hero-title {
      font-size: 3.5rem;
      font-weight: 700;
      color: #fff;
      margin: 0 0 1rem 0;
      line-height: 1.2;
    }

    .hero-meta {
      display: flex;
      align-items: center;
      gap: 1rem;
      margin-bottom: 1rem;
      flex-wrap: wrap;
    }

    .hero-rating {
      display: flex;
      align-items: center;
      gap: 0.5rem;
      color: #ffd700;
      font-weight: 600;
    }

    .hero-year,
    .hero-genres {
      color: #b3b3b3;
      font-size: 0.9rem;
    }

    .hero-overview {
      font-size: 1.1rem;
      color: #fff;
      line-height: 1.6;
      margin-bottom: 2rem;
    }

    .hero-actions {
      display: flex;
      gap: 1rem;
    }

    .btn {
      padding: 0.75rem 2rem;
      border-radius: 4px;
      font-size: 1rem;
      font-weight: 600;
      text-decoration: none;
      display: inline-flex;
      align-items: center;
      gap: 0.5rem;
      transition: all 0.3s ease;
      border: none;
      cursor: pointer;
    }

    .btn-primary {
      background: #fff;
      color: #000;
    }

    .btn-primary:hover {
      background: rgba(255, 255, 255, 0.8);
    }

    .btn-secondary {
      background: rgba(109, 109, 110, 0.7);
      color: #fff;
    }

    .btn-secondary:hover {
      background: rgba(109, 109, 110, 0.9);
    }

    @media (max-width: 768px) {
      .hero-banner {
        height: 60vh;
        min-height: 400px;
      }

      .hero-content {
        margin-left: 1rem;
        padding: 1rem;
      }

      .hero-title {
        font-size: 2rem;
      }

      .hero-overview {
        font-size: 0.9rem;
      }

      .hero-actions {
        flex-direction: column;
      }

      .btn {
        width: 100%;
        justify-content: center;
      }
    }
  `]
})
export class HeroBannerComponent {
  @Input() featured!: MediaItem;
  
  private tmdbApi = inject(TmdbApiService);

  getBackdropUrl(): string {
    return this.tmdbApi.getBackdropUrl(this.featured.backdrop_path, 'w1280');
  }

  getTitle(): string {
    return this.featured.title || this.featured.name || 'Unknown';
  }

  getYear(): string {
    const date = this.featured.release_date || this.featured.first_air_date;
    return date ? new Date(date).getFullYear().toString() : '';
  }

  getGenres(): string {
    if (!this.featured.genres || this.featured.genres.length === 0) {
      return '';
    }
    return this.featured.genres.slice(0, 2).map((g: { name: string }) => g.name).join(', ');
  }

  getMediaType(): 'movie' | 'tv' {
    return this.featured.media_type || (this.featured.title ? 'movie' : 'tv');
  }

  truncateOverview(): string {
    const overview = this.featured.overview || '';
    return overview.length > 200 ? overview.substring(0, 200) + '...' : overview;
  }
}

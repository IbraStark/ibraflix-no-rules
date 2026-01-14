import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { Observable } from 'rxjs';
import { TmdbApiService } from '../../core/services/tmdb-api.service';
import { WatchlistService } from '../../core/services/watchlist.service';
import {
  Movie,
  TVShow,
  MediaItem,
  CastMember,
  Video,
  MovieResponse,
  TVResponse,
} from '../../core/models';
import { CastListComponent } from '../../shared/components/cast-list/cast-list.component';
import { VideoPlayerComponent } from '../../shared/components/video-player/video-player.component';
import { ContentSliderComponent } from '../../shared/components/content-slider/content-slider.component';

@Component({
  selector: 'app-details',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    CastListComponent,
    VideoPlayerComponent,
    ContentSliderComponent,
  ],
  template: `
    <div class="details-page">
      @if (loading()) {
      <div class="loading">Loading...</div>
      } @else if (error()) {
      <div class="error">
        <p>{{ error() }}</p>
        <button (click)="goBack()">Go Back</button>
      </div>
      } @else if (media()) {
      <div class="details-hero" [style.background-image]="'url(' + getBackdropUrl() + ')'">
        <div class="hero-overlay"></div>
        <div class="hero-content">
          <button class="back-btn" (click)="goBack()">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
              <path d="M20 11H7.83l5.59-5.59L12 4l-8 8 8 8 1.41-1.41L7.83 13H20v-2z" />
            </svg>
            Back
          </button>
          <h1 class="details-title">{{ getTitle() }}</h1>
          <div class="details-meta">
            <span class="rating">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                <path
                  d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"
                />
              </svg>
              {{ getRating() }}
            </span>
            <span class="year">{{ getYear() }}</span>
            @if (getRuntime()) {
            <span class="runtime">{{ getRuntime() }}</span>
            } @if (getGenres()) {
            <span class="genres">{{ getGenres() }}</span>
            }
          </div>
          <p class="details-overview">{{ media()?.overview }}</p>
          <div class="details-actions">
            <button class="btn btn-primary" (click)="toggleWatchlist()">
              {{ isInWatchlist() ? 'Remove from' : 'Add to' }} My List
            </button>
          </div>
        </div>
      </div>

      <div class="details-content">
        @if (trailer()) {
        <app-video-player [video]="trailer()"></app-video-player>
        } @if (cast().length > 0) {
        <app-cast-list [cast]="cast()"></app-cast-list>
        } @if (similar().length > 0) {
        <app-content-slider
          title="Similar {{ getMediaType() === 'movie' ? 'Movies' : 'TV Shows' }}"
          [items]="similar()"
          [loading]="false"
        ></app-content-slider>
        }
      </div>
      }
    </div>
  `,
  styles: [
    `
      .details-page {
        min-height: 100vh;
      }

      .loading,
      .error {
        padding: 4rem 2rem;
        text-align: center;
        color: #fff;
      }

      .details-hero {
        position: relative;
        width: 100%;
        min-height: 80vh;
        background-size: cover;
        background-position: center;
        display: flex;
        align-items: flex-end;
      }

      .hero-overlay {
        position: absolute;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        background: linear-gradient(to top, rgba(0, 0, 0, 0.9) 0%, transparent 100%);
      }

      .hero-content {
        position: relative;
        z-index: 1;
        max-width: 1400px;
        width: 100%;
        margin: 0 auto;
        padding: 4rem 2rem;
      }

      .back-btn {
        display: flex;
        align-items: center;
        gap: 0.5rem;
        background: rgba(0, 0, 0, 0.5);
        border: 1px solid rgba(255, 255, 255, 0.3);
        color: #fff;
        padding: 0.5rem 1rem;
        border-radius: 4px;
        cursor: pointer;
        margin-bottom: 2rem;
        transition: all 0.3s ease;
      }

      .back-btn:hover {
        background: rgba(0, 0, 0, 0.7);
      }

      .details-title {
        font-size: 3rem;
        font-weight: 700;
        color: #fff;
        margin: 0 0 1rem 0;
      }

      .details-meta {
        display: flex;
        align-items: center;
        gap: 1rem;
        margin-bottom: 1.5rem;
        flex-wrap: wrap;
      }

      .rating {
        display: flex;
        align-items: center;
        gap: 0.5rem;
        color: #ffd700;
        font-weight: 600;
      }

      .year,
      .runtime,
      .genres {
        color: #b3b3b3;
      }

      .details-overview {
        font-size: 1.1rem;
        line-height: 1.6;
        color: #fff;
        max-width: 800px;
        margin-bottom: 2rem;
      }

      .details-actions {
        display: flex;
        gap: 1rem;
      }

      .btn {
        padding: 0.75rem 2rem;
        border-radius: 4px;
        font-size: 1rem;
        font-weight: 600;
        border: none;
        cursor: pointer;
        transition: all 0.3s ease;
      }

      .btn-primary {
        background: #e50914;
        color: #fff;
      }

      .btn-primary:hover {
        background: #f40612;
      }

      .details-content {
        max-width: 1400px;
        margin: 0 auto;
        padding: 2rem;
      }

      @media (max-width: 768px) {
        .details-title {
          font-size: 2rem;
        }

        .hero-content {
          padding: 2rem 1rem;
        }

        .details-content {
          padding: 1rem;
        }
      }
    `,
  ],
})
export class DetailsComponent implements OnInit {
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private tmdbApi = inject(TmdbApiService);
  private watchlistService = inject(WatchlistService);

  media = signal<Movie | TVShow | null>(null);
  cast = signal<CastMember[]>([]);
  trailer = signal<Video | null>(null);
  similar = signal<MediaItem[]>([]);
  loading = signal(true);
  error = signal<string | null>(null);
  isInWatchlist = signal(false);

  ngOnInit() {
    this.route.params.subscribe((params) => {
      const type = params['type'] as 'movie' | 'tv';
      const id = parseInt(params['id'], 10);

      if (!id || !type) {
        this.error.set('Invalid media ID or type');
        this.loading.set(false);
        return;
      }

      this.loadMedia(type, id);
    });
  }

  private loadMedia(type: 'movie' | 'tv', id: number) {
    this.loading.set(true);
    this.error.set(null);

    // Load media details
    const details$: Observable<Movie | TVShow> =
      type === 'movie' ? this.tmdbApi.getMovieDetails(id) : this.tmdbApi.getTVDetails(id);

    details$.subscribe({
      next: (media: Movie | TVShow) => {
        this.media.set(media);
        this.isInWatchlist.set(this.watchlistService.isInWatchlist(id));

        // Load cast
        const cast$ = type === 'movie' ? this.tmdbApi.getMovieCast(id) : this.tmdbApi.getTVCast(id);

        cast$.subscribe({
          next: (credits) => {
            this.cast.set(credits.cast.slice(0, 10));
          },
        });

        // Load videos
        const videos$ =
          type === 'movie' ? this.tmdbApi.getMovieVideos(id) : this.tmdbApi.getTVVideos(id);

        videos$.subscribe({
          next: (videos) => {
            const trailerVideo = videos.results.find(
              (v) => v.type === 'Trailer' && v.site === 'YouTube'
            );
            if (trailerVideo) {
              this.trailer.set(trailerVideo);
            }
          },
        });

        // Load similar
        const similar$: Observable<MovieResponse | TVResponse> =
          type === 'movie' ? this.tmdbApi.getSimilarMovies(id) : this.tmdbApi.getSimilarTVShows(id);

        similar$.subscribe({
          next: (response: MovieResponse | TVResponse) => {
            this.similar.set(response.results);
          },
        });

        this.loading.set(false);
      },
      error: () => {
        this.error.set('Failed to load media details');
        this.loading.set(false);
      },
    });
  }

  getBackdropUrl(): string {
    const media = this.media();
    if (!media) return '';
    return this.tmdbApi.getBackdropUrl(media.backdrop_path, 'w1280');
  }

  getTitle(): string {
    const media = this.media();
    if (!media) return '';
    return (media as Movie).title || (media as TVShow).name || 'Unknown';
  }

  getRating(): string {
    const media = this.media();
    return media ? media.vote_average.toFixed(1) : '0.0';
  }

  getYear(): string {
    const media = this.media();
    if (!media) return '';
    const date = (media as Movie).release_date || (media as TVShow).first_air_date;
    return date ? new Date(date).getFullYear().toString() : '';
  }

  getRuntime(): string {
    const media = this.media();
    if (!media) return '';
    if ((media as Movie).runtime) {
      const hours = Math.floor((media as Movie).runtime! / 60);
      const minutes = (media as Movie).runtime! % 60;
      return hours > 0 ? `${hours}h ${minutes}m` : `${minutes}m`;
    }
    return '';
  }

  getGenres(): string {
    const media = this.media();
    if (!media || !media.genres) return '';
    return media.genres.map((g) => g.name).join(', ');
  }

  getMediaType(): 'movie' | 'tv' {
    const media = this.media();
    if (!media) return 'movie';
    return (media as Movie).title ? 'movie' : 'tv';
  }

  toggleWatchlist() {
    const media = this.media();
    if (!media) return;

    if (this.isInWatchlist()) {
      this.watchlistService.removeFromWatchlist(media.id);
    } else {
      this.watchlistService.addToWatchlist(media);
    }
    this.isInWatchlist.set(!this.isInWatchlist());
  }

  goBack() {
    this.router.navigate(['/']);
  }
}

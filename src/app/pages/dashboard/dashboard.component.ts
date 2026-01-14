import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TmdbApiService } from '../../core/services/tmdb-api.service';
import { MediaItem } from '../../core/models';
import { HeroBannerComponent } from '../../shared/components/hero-banner/hero-banner.component';
import { ContentSliderComponent } from '../../shared/components/content-slider/content-slider.component';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, HeroBannerComponent, ContentSliderComponent],
  template: `
    <div class="dashboard">
      @if (featured()) {
        <app-hero-banner [featured]="featured()!"></app-hero-banner>
      }
      
      <div class="content-sections">
        <app-content-slider
          title="Trending Now"
          [items]="trending()"
          [loading]="loadingTrending()"
        ></app-content-slider>
        
        <app-content-slider
          title="Popular Movies"
          [items]="popularMovies()"
          [loading]="loadingPopularMovies()"
        ></app-content-slider>
        
        <app-content-slider
          title="Top Rated Movies"
          [items]="topRatedMovies()"
          [loading]="loadingTopRated()"
        ></app-content-slider>
        
        <app-content-slider
          title="Upcoming Movies"
          [items]="upcomingMovies()"
          [loading]="loadingUpcoming()"
        ></app-content-slider>
        
        <app-content-slider
          title="Popular TV Shows"
          [items]="popularTV()"
          [loading]="loadingPopularTV()"
        ></app-content-slider>
      </div>
    </div>
  `,
  styles: [`
    .dashboard {
      min-height: 100vh;
    }

    .content-sections {
      padding: 2rem 0;
    }
  `]
})
export class DashboardComponent implements OnInit {
  private tmdbApi = inject(TmdbApiService);

  featured = signal<MediaItem | null>(null);
  trending = signal<MediaItem[]>([]);
  popularMovies = signal<MediaItem[]>([]);
  topRatedMovies = signal<MediaItem[]>([]);
  upcomingMovies = signal<MediaItem[]>([]);
  popularTV = signal<MediaItem[]>([]);

  loadingTrending = signal(true);
  loadingPopularMovies = signal(true);
  loadingTopRated = signal(true);
  loadingUpcoming = signal(true);
  loadingPopularTV = signal(true);

  ngOnInit() {
    // Load trending for hero banner
    this.tmdbApi.getTrending('all', 'day').subscribe({
      next: (response) => {
        const items = response.results.filter(item => item.backdrop_path);
        if (items.length > 0) {
          // Pick a random featured item
          const randomIndex = Math.floor(Math.random() * items.length);
          this.featured.set(items[randomIndex]);
        }
        this.trending.set(response.results);
        this.loadingTrending.set(false);
      },
      error: () => {
        this.loadingTrending.set(false);
      }
    });

    // Load popular movies
    this.tmdbApi.getPopularMovies().subscribe({
      next: (response) => {
        this.popularMovies.set(response.results);
        this.loadingPopularMovies.set(false);
      },
      error: () => {
        this.loadingPopularMovies.set(false);
      }
    });

    // Load top rated movies
    this.tmdbApi.getTopRatedMovies().subscribe({
      next: (response) => {
        this.topRatedMovies.set(response.results);
        this.loadingTopRated.set(false);
      },
      error: () => {
        this.loadingTopRated.set(false);
      }
    });

    // Load upcoming movies
    this.tmdbApi.getUpcomingMovies().subscribe({
      next: (response) => {
        this.upcomingMovies.set(response.results);
        this.loadingUpcoming.set(false);
      },
      error: () => {
        this.loadingUpcoming.set(false);
      }
    });

    // Load popular TV shows
    this.tmdbApi.getPopularTVShows().subscribe({
      next: (response) => {
        this.popularTV.set(response.results);
        this.loadingPopularTV.set(false);
      },
      error: () => {
        this.loadingPopularTV.set(false);
      }
    });
  }
}

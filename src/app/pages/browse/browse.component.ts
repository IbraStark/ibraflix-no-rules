import { Component, OnInit, inject, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { TmdbApiService } from '../../core/services/tmdb-api.service';
import { GenreService } from '../../core/services/genre.service';
import { MediaItem, Genre } from '../../core/models';
import { MediaCardComponent } from '../../shared/components/media-card/media-card.component';
import { SkeletonLoaderComponent } from '../../shared/components/skeleton-loader/skeleton-loader.component';

@Component({
  selector: 'app-browse',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule, MediaCardComponent, SkeletonLoaderComponent],
  template: `
    <div class="browse-page">
      <div class="browse-container">
        <aside class="filters-sidebar">
          <h2>Filters</h2>
          
          <div class="filter-group">
            <label>Type</label>
            <select [(ngModel)]="filters.type" (change)="applyFilters()">
              <option value="all">All</option>
              <option value="movie">Movies</option>
              <option value="tv">TV Shows</option>
            </select>
          </div>

          <div class="filter-group">
            <label>Genre</label>
            <select [(ngModel)]="filters.genre" (change)="applyFilters()">
              <option value="">All Genres</option>
              @for (genre of availableGenres(); track genre.id) {
                <option [value]="genre.id">{{ genre.name }}</option>
              }
            </select>
          </div>

          <div class="filter-group">
            <label>Rating: {{ filters.rating }}</label>
            <input
              type="range"
              min="0"
              max="10"
              step="0.5"
              [(ngModel)]="filters.rating"
              (input)="applyFilters()"
            />
          </div>

          <div class="filter-group">
            <label>Year</label>
            <input
              type="number"
              [(ngModel)]="filters.year"
              (change)="applyFilters()"
              placeholder="e.g., 2023"
              min="1900"
              [max]="currentYear"
            />
          </div>

          <button class="clear-btn" (click)="clearFilters()">Clear Filters</button>
        </aside>

        <main class="browse-content">
          <h1 class="page-title">Browse</h1>
          
          @if (loading()) {
            <div class="grid">
              @for (item of [1,2,3,4,5,6,7,8,9,10,11,12]; track $index) {
                <div class="grid-item">
                  <app-skeleton-loader type="card"></app-skeleton-loader>
                </div>
              }
            </div>
          } @else if (results().length === 0) {
            <div class="empty-state">
              <p>No results found. Try adjusting your filters.</p>
            </div>
          } @else {
            <div class="grid">
              @for (item of results(); track item.id) {
                <div class="grid-item">
                  <app-media-card [media]="item"></app-media-card>
                </div>
              }
            </div>

            @if (hasMore()) {
              <div class="pagination">
                <button class="btn" (click)="loadMore()" [disabled]="loading()">
                  Load More
                </button>
              </div>
            }
          }
        </main>
      </div>
    </div>
  `,
  styles: [`
    .browse-page {
      min-height: 100vh;
      padding: 2rem;
    }

    .browse-container {
      max-width: 1400px;
      margin: 0 auto;
      display: grid;
      grid-template-columns: 250px 1fr;
      gap: 2rem;
    }

    .filters-sidebar {
      background: #1f1f1f;
      padding: 1.5rem;
      border-radius: 8px;
      height: fit-content;
      position: sticky;
      top: 100px;
    }

    .filters-sidebar h2 {
      color: #fff;
      font-size: 1.25rem;
      margin: 0 0 1.5rem 0;
    }

    .filter-group {
      margin-bottom: 1.5rem;
    }

    .filter-group label {
      display: block;
      color: #b3b3b3;
      font-size: 0.875rem;
      margin-bottom: 0.5rem;
    }

    .filter-group select,
    .filter-group input[type="number"] {
      width: 100%;
      padding: 0.5rem;
      background: #2a2a2a;
      border: 1px solid #444;
      border-radius: 4px;
      color: #fff;
      font-size: 0.875rem;
    }

    .filter-group input[type="range"] {
      width: 100%;
    }

    .clear-btn {
      width: 100%;
      padding: 0.75rem;
      background: #e50914;
      color: #fff;
      border: none;
      border-radius: 4px;
      cursor: pointer;
      font-weight: 600;
      margin-top: 1rem;
    }

    .clear-btn:hover {
      background: #f40612;
    }

    .browse-content {
      flex: 1;
    }

    .page-title {
      color: #fff;
      font-size: 2rem;
      margin: 0 0 2rem 0;
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

    .pagination {
      text-align: center;
      margin-top: 3rem;
    }

    .btn {
      padding: 0.75rem 2rem;
      background: #e50914;
      color: #fff;
      border: none;
      border-radius: 4px;
      cursor: pointer;
      font-weight: 600;
    }

    .btn:hover:not(:disabled) {
      background: #f40612;
    }

    .btn:disabled {
      opacity: 0.5;
      cursor: not-allowed;
    }

    @media (max-width: 1024px) {
      .browse-container {
        grid-template-columns: 1fr;
      }

      .filters-sidebar {
        position: static;
      }
    }
  `]
})
export class BrowseComponent implements OnInit {
  private tmdbApi = inject(TmdbApiService);
  private genreService = inject(GenreService);
  private route = inject(ActivatedRoute);
  private router = inject(Router);

  filters = {
    type: 'all',
    genre: '',
    rating: 0,
    year: null as number | null
  };

  results = signal<MediaItem[]>([]);
  availableGenres = signal<Genre[]>([]);
  loading = signal(false);
  currentPage = signal(1);
  totalPages = signal(1);
  currentYear = new Date().getFullYear();

  ngOnInit() {
    // Load genres
    this.genreService.getAllGenres().subscribe({
      next: (genres) => {
        this.availableGenres.set([...genres.movies, ...genres.tv]);
      }
    });

    // Load initial results
    this.applyFilters();
  }

  hasMore(): boolean {
    return this.currentPage() < this.totalPages();
  }

  applyFilters() {
    this.currentPage.set(1);
    this.results.set([]);
    this.loadResults(1);
  }

  loadMore() {
    const nextPage = this.currentPage() + 1;
    this.loadResults(nextPage);
  }

  private loadResults(page: number) {
    this.loading.set(true);

    const filters: any = {};
    if (this.filters.genre) {
      filters.with_genres = this.filters.genre;
    }
    if (this.filters.rating > 0) {
      filters['vote_average.gte'] = this.filters.rating;
    }
    if (this.filters.year) {
      if (this.filters.type === 'movie') {
        filters.primary_release_year = this.filters.year;
      } else {
        filters.first_air_date_year = this.filters.year;
      }
    }
    filters.page = page;

    const requests: Promise<any>[] = [];

    if (this.filters.type === 'all' || this.filters.type === 'movie') {
      requests.push(
        this.tmdbApi.discoverMovies(filters).toPromise().then(r => ({ type: 'movie', response: r }))
      );
    }
    if (this.filters.type === 'all' || this.filters.type === 'tv') {
      requests.push(
        this.tmdbApi.discoverTV(filters).toPromise().then(r => ({ type: 'tv', response: r }))
      );
    }

    Promise.all(requests).then(results => {
      let allResults: MediaItem[] = [];
      results.forEach(({ response }) => {
        if (response) {
          allResults = [...allResults, ...response.results];
          this.totalPages.set(Math.max(this.totalPages(), response.total_pages));
        }
      });

      if (page === 1) {
        this.results.set(allResults);
      } else {
        this.results.set([...this.results(), ...allResults]);
      }
      this.currentPage.set(page);
      this.loading.set(false);
    }).catch(() => {
      this.loading.set(false);
    });
  }

  clearFilters() {
    this.filters = {
      type: 'all',
      genre: '',
      rating: 0,
      year: null
    };
    this.applyFilters();
  }
}

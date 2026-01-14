import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { debounceTime, distinctUntilChanged, Subject } from 'rxjs';
import { TmdbApiService } from '../../core/services/tmdb-api.service';
import { MediaItem } from '../../core/models';
import { MediaCardComponent } from '../../shared/components/media-card/media-card.component';
import { SkeletonLoaderComponent } from '../../shared/components/skeleton-loader/skeleton-loader.component';

@Component({
  selector: 'app-search',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule, MediaCardComponent, SkeletonLoaderComponent],
  template: `
    <div class="search-page">
      <div class="search-container">
        <div class="search-header">
          <h1>Search</h1>
          <div class="search-box">
            <input
              type="text"
              [(ngModel)]="searchQuery"
              (input)="onSearchInput()"
              placeholder="Search for movies or TV shows..."
              class="search-input"
            />
            <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor" class="search-icon">
              <path d="M15.5 14h-.79l-.28-.27C15.41 12.59 16 11.11 16 9.5 16 5.91 13.09 3 9.5 3S3 5.91 3 9.5 5.91 16 9.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79l5 4.99L20.49 19l-4.99-5zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 11.99 14 9.5 14z"/>
            </svg>
          </div>
        </div>

        @if (loading()) {
          <div class="grid">
            @for (item of [1,2,3,4,5,6,7,8,9,10,11,12]; track $index) {
              <div class="grid-item">
                <app-skeleton-loader type="card"></app-skeleton-loader>
              </div>
            }
          </div>
        } @else if (searchQuery && results().length === 0 && !loading()) {
          <div class="empty-state">
            <p>No results found for "{{ searchQuery }}"</p>
          </div>
        } @else if (!searchQuery) {
          <div class="empty-state">
            <p>Start typing to search for movies and TV shows</p>
          </div>
        } @else {
          <div class="results-header">
            <p>Found {{ results().length }} results for "{{ searchQuery }}"</p>
          </div>
          <div class="grid">
            @for (item of results(); track item.id) {
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
    .search-page {
      min-height: 100vh;
      padding: 2rem;
    }

    .search-container {
      max-width: 1400px;
      margin: 0 auto;
    }

    .search-header {
      margin-bottom: 2rem;
    }

    .search-header h1 {
      color: #fff;
      font-size: 2rem;
      margin: 0 0 1.5rem 0;
    }

    .search-box {
      position: relative;
      max-width: 600px;
    }

    .search-input {
      width: 100%;
      padding: 1rem 1rem 1rem 3rem;
      background: #1f1f1f;
      border: 1px solid #444;
      border-radius: 4px;
      color: #fff;
      font-size: 1rem;
    }

    .search-input:focus {
      outline: none;
      border-color: #e50914;
    }

    .search-icon {
      position: absolute;
      left: 1rem;
      top: 50%;
      transform: translateY(-50%);
      color: #b3b3b3;
    }

    .results-header {
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
      font-size: 1.1rem;
    }

    @media (max-width: 768px) {
      .search-page {
        padding: 1rem;
      }

      .grid {
        grid-template-columns: repeat(auto-fill, minmax(150px, 1fr));
      }
    }
  `]
})
export class SearchComponent implements OnInit {
  private tmdbApi = inject(TmdbApiService);
  private route = inject(ActivatedRoute);
  private router = inject(Router);

  searchQuery = '';
  results = signal<MediaItem[]>([]);
  loading = signal(false);
  private searchSubject = new Subject<string>();

  ngOnInit() {
    // Debounce search input
    this.searchSubject.pipe(
      debounceTime(500),
      distinctUntilChanged()
    ).subscribe(query => {
      if (query.trim()) {
        this.performSearch(query.trim());
      } else {
        this.results.set([]);
      }
    });

    // Check for query param
    this.route.queryParams.subscribe(params => {
      if (params['q']) {
        this.searchQuery = params['q'];
        this.performSearch(params['q']);
      }
    });
  }

  onSearchInput() {
    this.searchSubject.next(this.searchQuery);
    // Update URL
    if (this.searchQuery.trim()) {
      this.router.navigate([], {
        relativeTo: this.route,
        queryParams: { q: this.searchQuery },
        queryParamsHandling: 'merge'
      });
    }
  }

  private performSearch(query: string) {
    this.loading.set(true);
    this.tmdbApi.searchMulti(query).subscribe({
      next: (response) => {
        this.results.set(response.results);
        this.loading.set(false);
      },
      error: () => {
        this.results.set([]);
        this.loading.set(false);
      }
    });
  }
}

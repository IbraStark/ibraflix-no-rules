import { Component, inject, signal, effect } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { WatchlistService } from '../../core/services/watchlist.service';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <div class="profile-page">
      <div class="profile-container">
        <div class="profile-header">
          <h1 class="brand-logo">Ibraflix</h1>
          <p class="tagline">Your favorite streaming platform</p>
        </div>

        <div class="profile-content">
          <section class="profile-section">
            <h2>Watchlist Statistics</h2>
            <div class="stats-grid">
              <div class="stat-card">
                <div class="stat-value">{{ watchlistCount() }}</div>
                <div class="stat-label">Items in Watchlist</div>
              </div>
            </div>
          </section>

          <section class="profile-section">
            <h2>Watchlist Management</h2>
            <div class="actions">
              <button class="btn btn-danger" (click)="clearWatchlist()" [disabled]="watchlistCount() === 0">
                Clear Watchlist
              </button>
              <a routerLink="/watchlist" class="btn btn-secondary">View Watchlist</a>
            </div>
          </section>

          <section class="profile-section">
            <h2>About</h2>
            <div class="about-content">
              <p>Ibraflix is a streaming platform powered by TMDb API.</p>
              <p>Discover and explore thousands of movies and TV shows.</p>
              <p>
                <a href="https://www.themoviedb.org" target="_blank" rel="noopener" class="link">
                  Learn more about TMDb
                </a>
              </p>
            </div>
          </section>

          <section class="profile-section">
            <h2>Application Information</h2>
            <div class="info-content">
              <p><strong>Version:</strong> 1.0.0</p>
              <p><strong>Framework:</strong> Angular 21</p>
              <p><strong>Data Source:</strong> The Movie Database (TMDb)</p>
            </div>
          </section>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .profile-page {
      min-height: 100vh;
      padding: 2rem;
    }

    .profile-container {
      max-width: 800px;
      margin: 0 auto;
    }

    .profile-header {
      text-align: center;
      margin-bottom: 3rem;
    }

    .brand-logo {
      font-size: 3rem;
      font-weight: 700;
      color: #e50914;
      margin: 0 0 0.5rem 0;
    }

    .tagline {
      color: #b3b3b3;
      font-size: 1.1rem;
      margin: 0;
    }

    .profile-content {
      display: flex;
      flex-direction: column;
      gap: 2rem;
    }

    .profile-section {
      background: #1f1f1f;
      padding: 2rem;
      border-radius: 8px;
    }

    .profile-section h2 {
      color: #fff;
      font-size: 1.5rem;
      margin: 0 0 1.5rem 0;
    }

    .stats-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
      gap: 1rem;
    }

    .stat-card {
      background: #2a2a2a;
      padding: 1.5rem;
      border-radius: 8px;
      text-align: center;
    }

    .stat-value {
      font-size: 2.5rem;
      font-weight: 700;
      color: #e50914;
      margin-bottom: 0.5rem;
    }

    .stat-label {
      color: #b3b3b3;
      font-size: 0.875rem;
    }

    .actions {
      display: flex;
      gap: 1rem;
      flex-wrap: wrap;
    }

    .btn {
      padding: 0.75rem 2rem;
      border-radius: 4px;
      font-size: 1rem;
      font-weight: 600;
      border: none;
      cursor: pointer;
      text-decoration: none;
      display: inline-block;
      transition: all 0.3s ease;
    }

    .btn-danger {
      background: #e50914;
      color: #fff;
    }

    .btn-danger:hover:not(:disabled) {
      background: #f40612;
    }

    .btn-secondary {
      background: #2a2a2a;
      color: #fff;
      border: 1px solid #444;
    }

    .btn-secondary:hover {
      background: #333;
    }

    .btn:disabled {
      opacity: 0.5;
      cursor: not-allowed;
    }

    .about-content,
    .info-content {
      color: #b3b3b3;
      line-height: 1.6;
    }

    .about-content p,
    .info-content p {
      margin: 0 0 1rem 0;
    }

    .link {
      color: #e50914;
      text-decoration: none;
    }

    .link:hover {
      text-decoration: underline;
    }

    @media (max-width: 768px) {
      .profile-page {
        padding: 1rem;
      }

      .brand-logo {
        font-size: 2rem;
      }

      .actions {
        flex-direction: column;
      }

      .btn {
        width: 100%;
        text-align: center;
      }
    }
  `]
})
export class ProfileComponent {
  private watchlistService = inject(WatchlistService);
  watchlistCount = signal(0);

  constructor() {
    effect(() => {
      const items = this.watchlistService.watchlist();
      this.watchlistCount.set(items.length);
    });
  }

  clearWatchlist() {
    if (confirm('Are you sure you want to clear your watchlist? This action cannot be undone.')) {
      this.watchlistService.clearWatchlist();
    }
  }
}

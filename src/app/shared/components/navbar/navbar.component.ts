import { Component, inject, signal, effect } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { WatchlistService } from '../../../core/services/watchlist.service';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <nav class="navbar">
      <div class="navbar-container">
        <a [routerLink]="['/']" class="navbar-logo">
          <span class="logo-text">Ibraflix</span>
        </a>
        <div class="navbar-menu">
          <a [routerLink]="['/']" class="nav-link" routerLinkActive="active" [routerLinkActiveOptions]="{exact: true}">
            Home
          </a>
          <a [routerLink]="['/browse']" class="nav-link" routerLinkActive="active">
            Browse
          </a>
          <a [routerLink]="['/search']" class="nav-link" routerLinkActive="active">
            Search
          </a>
          <a [routerLink]="['/watchlist']" class="nav-link" routerLinkActive="active">
            My List
            @if (watchlistCount() > 0) {
              <span class="badge">{{ watchlistCount() }}</span>
            }
          </a>
        </div>
        <div class="navbar-actions">
          <a [routerLink]="['/profile']" class="nav-link profile-link" routerLinkActive="active">
            Profile
          </a>
        </div>
      </div>
    </nav>
  `,
  styles: [`
    .navbar {
      position: sticky;
      top: 0;
      z-index: 1000;
      background: rgba(20, 20, 20, 0.95);
      backdrop-filter: blur(10px);
      border-bottom: 1px solid rgba(255, 255, 255, 0.1);
    }

    .navbar-container {
      max-width: 1400px;
      margin: 0 auto;
      padding: 1rem 2rem;
      display: flex;
      align-items: center;
      justify-content: space-between;
    }

    .navbar-logo {
      text-decoration: none;
      font-size: 1.5rem;
      font-weight: 700;
      color: #e50914;
    }

    .logo-text {
      display: block;
    }

    .navbar-menu {
      display: flex;
      gap: 2rem;
      align-items: center;
    }

    .nav-link {
      color: #b3b3b3;
      text-decoration: none;
      font-size: 0.9rem;
      font-weight: 500;
      transition: color 0.3s ease;
      position: relative;
      display: flex;
      align-items: center;
      gap: 0.5rem;
    }

    .nav-link:hover,
    .nav-link.active {
      color: #fff;
    }

    .badge {
      background: #e50914;
      color: #fff;
      font-size: 0.75rem;
      padding: 0.125rem 0.5rem;
      border-radius: 10px;
      font-weight: 600;
    }

    .navbar-actions {
      display: flex;
      align-items: center;
    }

    @media (max-width: 768px) {
      .navbar-container {
        padding: 1rem;
      }

      .navbar-menu {
        gap: 1rem;
      }

      .nav-link {
        font-size: 0.8rem;
      }

      .logo-text {
        font-size: 1.25rem;
      }
    }
  `]
})
export class NavbarComponent {
  private watchlistService = inject(WatchlistService);
  watchlistCount = signal(0);

  constructor() {
    effect(() => {
      const items = this.watchlistService.watchlist();
      this.watchlistCount.set(items.length);
    });
  }
}

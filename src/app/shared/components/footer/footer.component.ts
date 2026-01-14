import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-footer',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <footer class="footer">
      <div class="footer-container">
        <div class="footer-brand">
          <h3 class="footer-logo">Ibraflix</h3>
          <p class="footer-tagline">Your favorite streaming platform</p>
        </div>
        <div class="footer-links">
          <div class="footer-column">
            <h4>Navigation</h4>
            <ul>
              <li><a routerLink="/">Home</a></li>
              <li><a routerLink="/browse">Browse</a></li>
              <li><a routerLink="/search">Search</a></li>
              <li><a routerLink="/watchlist">My List</a></li>
            </ul>
          </div>
          <div class="footer-column">
            <h4>About</h4>
            <ul>
              <li><a routerLink="/profile">Profile</a></li>
              <li><a href="https://www.themoviedb.org" target="_blank" rel="noopener">TMDb</a></li>
            </ul>
          </div>
        </div>
        <div class="footer-bottom">
          <p>&copy; 2024 Ibraflix. Powered by TMDb API.</p>
        </div>
      </div>
    </footer>
  `,
  styles: [`
    .footer {
      background: #000;
      color: #b3b3b3;
      padding: 3rem 2rem 1rem;
      margin-top: 4rem;
    }

    .footer-container {
      max-width: 1400px;
      margin: 0 auto;
    }

    .footer-brand {
      margin-bottom: 2rem;
    }

    .footer-logo {
      font-size: 1.5rem;
      font-weight: 700;
      color: #e50914;
      margin: 0 0 0.5rem 0;
    }

    .footer-tagline {
      color: #b3b3b3;
      margin: 0;
    }

    .footer-links {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
      gap: 2rem;
      margin-bottom: 2rem;
    }

    .footer-column h4 {
      color: #fff;
      font-size: 1rem;
      font-weight: 600;
      margin: 0 0 1rem 0;
    }

    .footer-column ul {
      list-style: none;
      padding: 0;
      margin: 0;
    }

    .footer-column li {
      margin-bottom: 0.5rem;
    }

    .footer-column a {
      color: #b3b3b3;
      text-decoration: none;
      transition: color 0.3s ease;
    }

    .footer-column a:hover {
      color: #fff;
    }

    .footer-bottom {
      border-top: 1px solid rgba(255, 255, 255, 0.1);
      padding-top: 1rem;
      text-align: center;
    }

    .footer-bottom p {
      margin: 0;
      font-size: 0.875rem;
    }

    @media (max-width: 768px) {
      .footer {
        padding: 2rem 1rem 1rem;
      }

      .footer-links {
        grid-template-columns: 1fr;
        gap: 1.5rem;
      }
    }
  `]
})
export class FooterComponent {
}

import { Component, Input, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CastMember } from '../../../core/models';
import { TmdbApiService } from '../../../core/services/tmdb-api.service';

@Component({
  selector: 'app-cast-list',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="cast-list">
      <h3 class="cast-title">Cast</h3>
      <div class="cast-grid">
        @for (member of cast.slice(0, 10); track member.id) {
          <div class="cast-item">
            <div class="cast-image-container">
              <img
                [src]="getProfileUrl(member.profile_path)"
                [alt]="member.name"
                loading="lazy"
                (error)="onImageError($event)"
                class="cast-image"
              />
            </div>
            <div class="cast-info">
              <p class="cast-name">{{ member.name }}</p>
              <p class="cast-character">{{ member.character }}</p>
            </div>
          </div>
        }
      </div>
    </div>
  `,
  styles: [`
    .cast-list {
      margin: 2rem 0;
    }

    .cast-title {
      font-size: 1.5rem;
      font-weight: 600;
      color: #fff;
      margin: 0 0 1rem 0;
    }

    .cast-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(150px, 1fr));
      gap: 1rem;
    }

    .cast-item {
      text-align: center;
    }

    .cast-image-container {
      width: 100%;
      aspect-ratio: 2/3;
      border-radius: 4px;
      overflow: hidden;
      background: #1f1f1f;
      margin-bottom: 0.5rem;
    }

    .cast-image {
      width: 100%;
      height: 100%;
      object-fit: cover;
      display: block;
    }

    .cast-info {
      padding: 0.5rem 0;
    }

    .cast-name {
      font-size: 0.875rem;
      font-weight: 600;
      color: #fff;
      margin: 0 0 0.25rem 0;
    }

    .cast-character {
      font-size: 0.75rem;
      color: #b3b3b3;
      margin: 0;
    }

    @media (max-width: 768px) {
      .cast-grid {
        grid-template-columns: repeat(auto-fill, minmax(100px, 1fr));
        gap: 0.5rem;
      }
    }
  `]
})
export class CastListComponent {
  @Input() cast: CastMember[] = [];
  
  private tmdbApi = inject(TmdbApiService);

  getProfileUrl(path: string | null): string {
    return this.tmdbApi.getProfileUrl(path);
  }

  onImageError(event: Event) {
    const img = event.target as HTMLImageElement;
    img.src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMzAwIiBoZWlnaHQ9IjQ1MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMzAwIiBoZWlnaHQ9IjQ1MCIgZmlsbD0iIzJhMmEyYSIvPjx0ZXh0IHg9IjUwJSIgeT0iNTAlIiBmb250LWZhbWlseT0iQXJpYWwiIGZvbnQtc2l6ZT0iMTgiIGZpbGw9IiM4ODg4ODgiIHRleHQtYW5jaG9yPSJtaWRkbGUiIGR5PSIuM2VtIj5ObyBJbWFnZTwvdGV4dD48L3N2Zz4=';
  }
}

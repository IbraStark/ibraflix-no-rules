import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-skeleton-loader',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="skeleton" [class]="type" [style.width]="width" [style.height]="height">
      <div class="skeleton-shimmer"></div>
    </div>
  `,
  styles: [`
    .skeleton {
      background: #1f1f1f;
      border-radius: 4px;
      position: relative;
      overflow: hidden;
      animation: pulse 1.5s ease-in-out infinite;
    }

    .skeleton-shimmer {
      position: absolute;
      top: 0;
      left: -100%;
      width: 100%;
      height: 100%;
      background: linear-gradient(
        90deg,
        transparent,
        rgba(255, 255, 255, 0.1),
        transparent
      );
      animation: shimmer 1.5s infinite;
    }

    .skeleton.poster {
      aspect-ratio: 2/3;
      width: 100%;
    }

    .skeleton.backdrop {
      aspect-ratio: 16/9;
      width: 100%;
    }

    .skeleton.card {
      aspect-ratio: 2/3;
      width: 100%;
    }

    .skeleton.text {
      height: 1rem;
      border-radius: 4px;
    }

    .skeleton.title {
      height: 1.5rem;
      border-radius: 4px;
    }

    @keyframes pulse {
      0%, 100% {
        opacity: 1;
      }
      50% {
        opacity: 0.7;
      }
    }

    @keyframes shimmer {
      0% {
        left: -100%;
      }
      100% {
        left: 100%;
      }
    }
  `]
})
export class SkeletonLoaderComponent {
  @Input() type: 'poster' | 'backdrop' | 'card' | 'text' | 'title' = 'card';
  @Input() width?: string;
  @Input() height?: string;
}

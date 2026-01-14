import { Component, Input, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MediaItem } from '../../../core/models';
import { MediaCardComponent } from '../media-card/media-card.component';
import { SkeletonLoaderComponent } from '../skeleton-loader/skeleton-loader.component';

@Component({
  selector: 'app-content-slider',
  standalone: true,
  imports: [CommonModule, MediaCardComponent, SkeletonLoaderComponent],
  template: `
    <div class="slider-container">
      <h2 class="slider-title">{{ title }}</h2>
      <div class="slider-wrapper">
        <button
          class="slider-btn prev"
          (click)="scrollLeft()"
          [class.hidden]="!canScrollLeft()"
          aria-label="Scroll left"
        >
          <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
            <path d="M15.41 7.41L14 6l-6 6 6 6 1.41-1.41L10.83 12z"/>
          </svg>
        </button>
        <div class="slider-content" #sliderContent>
          @if (loading) {
            <div class="slider-items">
              @for (item of skeletonItems; track $index) {
                <div class="slider-item">
                  <app-skeleton-loader type="card"></app-skeleton-loader>
                </div>
              }
            </div>
          } @else {
            <div class="slider-items">
              @for (item of items; track item.id) {
                <div class="slider-item">
                  <app-media-card [media]="item"></app-media-card>
                </div>
              }
            </div>
          }
        </div>
        <button
          class="slider-btn next"
          (click)="scrollRight()"
          [class.hidden]="!canScrollRight()"
          aria-label="Scroll right"
        >
          <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
            <path d="M10 6L8.59 7.41 13.17 12l-4.58 4.59L10 18l6-6z"/>
          </svg>
        </button>
      </div>
    </div>
  `,
  styles: [`
    .slider-container {
      margin-bottom: 3rem;
    }

    .slider-title {
      font-size: 1.25rem;
      font-weight: 600;
      color: #fff;
      margin: 0 0 1rem 0;
      padding: 0 1rem;
    }

    .slider-wrapper {
      position: relative;
    }

    .slider-content {
      overflow-x: auto;
      overflow-y: hidden;
      scroll-behavior: smooth;
      scrollbar-width: none;
      -ms-overflow-style: none;
      padding: 0 1rem;
    }

    .slider-content::-webkit-scrollbar {
      display: none;
    }

    .slider-items {
      display: flex;
      gap: 0.5rem;
      padding-bottom: 0.5rem;
    }

    .slider-item {
      flex: 0 0 auto;
      width: 200px;
    }

    @media (max-width: 768px) {
      .slider-item {
        width: 150px;
      }
    }

    .slider-btn {
      position: absolute;
      top: 50%;
      transform: translateY(-50%);
      width: 40px;
      height: 40px;
      border-radius: 50%;
      border: none;
      background: rgba(0, 0, 0, 0.7);
      color: #fff;
      cursor: pointer;
      display: flex;
      align-items: center;
      justify-content: center;
      z-index: 10;
      transition: all 0.3s ease;
    }

    .slider-btn:hover {
      background: rgba(0, 0, 0, 0.9);
      transform: translateY(-50%) scale(1.1);
    }

    .slider-btn.prev {
      left: 0;
    }

    .slider-btn.next {
      right: 0;
    }

    .slider-btn.hidden {
      display: none;
    }

    @media (max-width: 768px) {
      .slider-btn {
        display: none;
      }
    }
  `]
})
export class ContentSliderComponent {
  @Input() title = '';
  @Input() items: MediaItem[] = [];
  @Input() loading = false;

  skeletonItems = Array(10).fill(0);

  scrollLeft() {
    const slider = document.querySelector('.slider-content') as HTMLElement;
    if (slider) {
      slider.scrollBy({ left: -800, behavior: 'smooth' });
    }
  }

  scrollRight() {
    const slider = document.querySelector('.slider-content') as HTMLElement;
    if (slider) {
      slider.scrollBy({ left: 800, behavior: 'smooth' });
    }
  }

  canScrollLeft(): boolean {
    const slider = document.querySelector('.slider-content') as HTMLElement;
    if (!slider) return false;
    return slider.scrollLeft > 0;
  }

  canScrollRight(): boolean {
    const slider = document.querySelector('.slider-content') as HTMLElement;
    if (!slider) return false;
    return slider.scrollLeft < slider.scrollWidth - slider.clientWidth - 10;
  }
}

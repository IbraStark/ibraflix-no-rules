import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Video } from '../../../core/models';

@Component({
  selector: 'app-video-player',
  standalone: true,
  imports: [CommonModule],
  template: `
    @if (video && video.site === 'YouTube') {
      <div class="video-container">
        <div class="video-wrapper">
          <iframe
            [src]="getYouTubeUrl(video.key)"
            frameborder="0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowfullscreen
            class="video-iframe"
          ></iframe>
        </div>
        <h4 class="video-title">{{ video.name }}</h4>
      </div>
    }
  `,
  styles: [`
    .video-container {
      margin: 2rem 0;
    }

    .video-wrapper {
      position: relative;
      width: 100%;
      padding-bottom: 56.25%;
      background: #000;
      border-radius: 4px;
      overflow: hidden;
    }

    .video-iframe {
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
    }

    .video-title {
      font-size: 1rem;
      font-weight: 500;
      color: #fff;
      margin: 0.5rem 0 0 0;
    }
  `]
})
export class VideoPlayerComponent {
  @Input() video!: Video | null;

  getYouTubeUrl(key: string): string {
    return `https://www.youtube.com/embed/${key}?rel=0&modestbranding=1`;
  }
}

import { Injectable, inject } from '@angular/core';
import { Observable, of } from 'rxjs';
import { catchError, map, shareReplay } from 'rxjs/operators';
import { TmdbApiService } from './tmdb-api.service';
import { Genre, GenreResponse } from '../models';

@Injectable({
  providedIn: 'root'
})
export class GenreService {
  private tmdbApi = inject(TmdbApiService);
  
  private movieGenresCache$: Observable<Genre[]> | null = null;
  private tvGenresCache$: Observable<Genre[]> | null = null;

  getMovieGenres(): Observable<Genre[]> {
    if (!this.movieGenresCache$) {
      this.movieGenresCache$ = this.tmdbApi.getMovieGenres().pipe(
        map((response: GenreResponse) => response.genres),
        catchError(() => of([])),
        shareReplay(1)
      );
    }
    return this.movieGenresCache$;
  }

  getTVGenres(): Observable<Genre[]> {
    if (!this.tvGenresCache$) {
      this.tvGenresCache$ = this.tmdbApi.getTVGenres().pipe(
        map((response: GenreResponse) => response.genres),
        catchError(() => of([])),
        shareReplay(1)
      );
    }
    return this.tvGenresCache$;
  }

  getAllGenres(): Observable<{ movies: Genre[]; tv: Genre[] }> {
    return new Observable(observer => {
      let movieGenres: Genre[] = [];
      let tvGenres: Genre[] = [];
      let movieLoaded = false;
      let tvLoaded = false;

      const checkComplete = () => {
        if (movieLoaded && tvLoaded) {
          observer.next({ movies: movieGenres, tv: tvGenres });
          observer.complete();
        }
      };

      this.getMovieGenres().subscribe(genres => {
        movieGenres = genres;
        movieLoaded = true;
        checkComplete();
      });

      this.getTVGenres().subscribe(genres => {
        tvGenres = genres;
        tvLoaded = true;
        checkComplete();
      });
    });
  }
}

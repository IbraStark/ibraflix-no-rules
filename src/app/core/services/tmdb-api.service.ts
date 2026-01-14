import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import {
  Movie,
  TVShow,
  MediaItem,
  Credits,
  VideosResponse,
  Genre,
  MovieResponse,
  TVResponse,
  MediaResponse,
  GenreResponse,
  DiscoverFilters,
  TVDiscoverFilters
} from '../models';

@Injectable({
  providedIn: 'root'
})
export class TmdbApiService {
  private http = inject(HttpClient);
  private apiUrl = environment.tmdbApiUrl;
  private imageUrl = environment.tmdbImageUrl;

  // Image URL helpers
  getPosterUrl(path: string | null, size: 'w342' | 'w500' = 'w500'): string {
    if (!path) return this.getPlaceholderImage();
    return `${this.imageUrl}/${size}${path}`;
  }

  getBackdropUrl(path: string | null, size: 'w1280' | 'original' = 'w1280'): string {
    if (!path) return this.getPlaceholderImage();
    return `${this.imageUrl}/${size}${path}`;
  }

  getProfileUrl(path: string | null, size: 'w185' | 'w342' = 'w185'): string {
    if (!path) return this.getPlaceholderImage();
    return `${this.imageUrl}/${size}${path}`;
  }

  private getPlaceholderImage(): string {
    return 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMzAwIiBoZWlnaHQ9IjQ1MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMzAwIiBoZWlnaHQ9IjQ1MCIgZmlsbD0iIzJhMmEyYSIvPjx0ZXh0IHg9IjUwJSIgeT0iNTAlIiBmb250LWZhbWlseT0iQXJpYWwiIGZvbnQtc2l6ZT0iMTgiIGZpbGw9IiM4ODg4ODgiIHRleHQtYW5jaG9yPSJtaWRkbGUiIGR5PSIuM2VtIj5ObyBJbWFnZTwvdGV4dD48L3N2Zz4=';
  }

  // Trending
  getTrending(mediaType: 'all' | 'movie' | 'tv' = 'all', timeWindow: 'day' | 'week' = 'day'): Observable<MediaResponse> {
    return this.http.get<MediaResponse>(`${this.apiUrl}/trending/${mediaType}/${timeWindow}`);
  }

  // Movies
  getPopularMovies(page: number = 1): Observable<MovieResponse> {
    return this.http.get<MovieResponse>(`${this.apiUrl}/movie/popular`, {
      params: new HttpParams().set('page', page.toString())
    });
  }

  getTopRatedMovies(page: number = 1): Observable<MovieResponse> {
    return this.http.get<MovieResponse>(`${this.apiUrl}/movie/top_rated`, {
      params: new HttpParams().set('page', page.toString())
    });
  }

  getUpcomingMovies(page: number = 1): Observable<MovieResponse> {
    return this.http.get<MovieResponse>(`${this.apiUrl}/movie/upcoming`, {
      params: new HttpParams().set('page', page.toString())
    });
  }

  getMovieDetails(id: number): Observable<Movie> {
    return this.http.get<Movie>(`${this.apiUrl}/movie/${id}`);
  }

  getMovieCast(id: number): Observable<Credits> {
    return this.http.get<Credits>(`${this.apiUrl}/movie/${id}/credits`);
  }

  getMovieVideos(id: number): Observable<VideosResponse> {
    return this.http.get<VideosResponse>(`${this.apiUrl}/movie/${id}/videos`);
  }

  getSimilarMovies(id: number, page: number = 1): Observable<MovieResponse> {
    return this.http.get<MovieResponse>(`${this.apiUrl}/movie/${id}/similar`, {
      params: new HttpParams().set('page', page.toString())
    });
  }

  getMovieRecommendations(id: number, page: number = 1): Observable<MovieResponse> {
    return this.http.get<MovieResponse>(`${this.apiUrl}/movie/${id}/recommendations`, {
      params: new HttpParams().set('page', page.toString())
    });
  }

  // TV Shows
  getPopularTVShows(page: number = 1): Observable<TVResponse> {
    return this.http.get<TVResponse>(`${this.apiUrl}/tv/popular`, {
      params: new HttpParams().set('page', page.toString())
    });
  }

  getTopRatedTVShows(page: number = 1): Observable<TVResponse> {
    return this.http.get<TVResponse>(`${this.apiUrl}/tv/top_rated`, {
      params: new HttpParams().set('page', page.toString())
    });
  }

  getTVDetails(id: number): Observable<TVShow> {
    return this.http.get<TVShow>(`${this.apiUrl}/tv/${id}`);
  }

  getTVCast(id: number): Observable<Credits> {
    return this.http.get<Credits>(`${this.apiUrl}/tv/${id}/credits`);
  }

  getTVVideos(id: number): Observable<VideosResponse> {
    return this.http.get<VideosResponse>(`${this.apiUrl}/tv/${id}/videos`);
  }

  getSimilarTVShows(id: number, page: number = 1): Observable<TVResponse> {
    return this.http.get<TVResponse>(`${this.apiUrl}/tv/${id}/similar`, {
      params: new HttpParams().set('page', page.toString())
    });
  }

  getTVRecommendations(id: number, page: number = 1): Observable<TVResponse> {
    return this.http.get<TVResponse>(`${this.apiUrl}/tv/${id}/recommendations`, {
      params: new HttpParams().set('page', page.toString())
    });
  }

  // Search
  searchMovies(query: string, page: number = 1): Observable<MovieResponse> {
    return this.http.get<MovieResponse>(`${this.apiUrl}/search/movie`, {
      params: new HttpParams()
        .set('query', query)
        .set('page', page.toString())
    });
  }

  searchTV(query: string, page: number = 1): Observable<TVResponse> {
    return this.http.get<TVResponse>(`${this.apiUrl}/search/tv`, {
      params: new HttpParams()
        .set('query', query)
        .set('page', page.toString())
    });
  }

  searchMulti(query: string, page: number = 1): Observable<MediaResponse> {
    return this.http.get<MediaResponse>(`${this.apiUrl}/search/multi`, {
      params: new HttpParams()
        .set('query', query)
        .set('page', page.toString())
    });
  }

  // Genres
  getMovieGenres(): Observable<GenreResponse> {
    return this.http.get<GenreResponse>(`${this.apiUrl}/genre/movie/list`);
  }

  getTVGenres(): Observable<GenreResponse> {
    return this.http.get<GenreResponse>(`${this.apiUrl}/genre/tv/list`);
  }

  // Discover
  discoverMovies(filters: DiscoverFilters = {}): Observable<MovieResponse> {
    let params = new HttpParams();
    if (filters.with_genres) params = params.set('with_genres', filters.with_genres);
    if (filters.primary_release_year) params = params.set('primary_release_year', filters.primary_release_year.toString());
    if (filters['primary_release_date.gte']) params = params.set('primary_release_date.gte', filters['primary_release_date.gte']);
    if (filters['primary_release_date.lte']) params = params.set('primary_release_date.lte', filters['primary_release_date.lte']);
    if (filters['vote_average.gte']) params = params.set('vote_average.gte', filters['vote_average.gte'].toString());
    if (filters['vote_average.lte']) params = params.set('vote_average.lte', filters['vote_average.lte'].toString());
    if (filters.sort_by) params = params.set('sort_by', filters.sort_by);
    if (filters.page) params = params.set('page', filters.page.toString());

    return this.http.get<MovieResponse>(`${this.apiUrl}/discover/movie`, { params });
  }

  discoverTV(filters: TVDiscoverFilters = {}): Observable<TVResponse> {
    let params = new HttpParams();
    if (filters.with_genres) params = params.set('with_genres', filters.with_genres);
    if (filters.first_air_date_year) params = params.set('first_air_date_year', filters.first_air_date_year.toString());
    if (filters['first_air_date.gte']) params = params.set('first_air_date.gte', filters['first_air_date.gte']);
    if (filters['first_air_date.lte']) params = params.set('first_air_date.lte', filters['first_air_date.lte']);
    if (filters['vote_average.gte']) params = params.set('vote_average.gte', filters['vote_average.gte'].toString());
    if (filters['vote_average.lte']) params = params.set('vote_average.lte', filters['vote_average.lte'].toString());
    if (filters.sort_by) params = params.set('sort_by', filters.sort_by);
    if (filters.page) params = params.set('page', filters.page.toString());

    return this.http.get<TVResponse>(`${this.apiUrl}/discover/tv`, { params });
  }
}

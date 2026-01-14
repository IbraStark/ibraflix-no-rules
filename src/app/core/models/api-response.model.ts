import { MediaItem, Movie, TVShow, Genre, Credits, VideosResponse } from './movie.model';

export interface PaginatedResponse<T> {
  page: number;
  results: T[];
  total_pages: number;
  total_results: number;
}

export interface MovieResponse extends PaginatedResponse<Movie> {}
export interface TVResponse extends PaginatedResponse<TVShow> {}
export interface MediaResponse extends PaginatedResponse<MediaItem> {}

export interface GenreResponse {
  genres: Genre[];
}

export interface DiscoverFilters {
  with_genres?: string;
  primary_release_year?: number;
  'primary_release_date.gte'?: string;
  'primary_release_date.lte'?: string;
  'vote_average.gte'?: number;
  'vote_average.lte'?: number;
  sort_by?: string;
  page?: number;
}

export interface TVDiscoverFilters {
  with_genres?: string;
  first_air_date_year?: number;
  'first_air_date.gte'?: string;
  'first_air_date.lte'?: string;
  'vote_average.gte'?: number;
  'vote_average.lte'?: number;
  sort_by?: string;
  page?: number;
}

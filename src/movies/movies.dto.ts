export interface AddMovieRequestDto {
  title: string;
  genre: string;
  rating: number;
  streamingLink: string;
  releaseDate: Date;
  director: string;
  description: string;
}

export interface UpdateMovieRequestDto {
  title: string;
  genre: string;
  rating: number;
  streamingLink: string;
  releaseDate: Date;
  director: string;
  description: string;
}

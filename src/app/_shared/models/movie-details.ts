export class MovieDetails {
    movieId: number = 0;
    title: string = '';
    description: string;
    duration: number | null = null;
    genres: number[] = [];
    moviePosterImg: string;
    screenshots: string[];
    showingDateStart: string;
    showingDateEnd: string;
}

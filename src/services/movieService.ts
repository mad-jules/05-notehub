import axios from 'axios';
import type { Movie } from '../types/movie';

const myKey = import.meta.env.VITE_TMDB_TOKEN;
interface ApiResponse {
    results: Movie[];
    total_pages: number;
    total_results: number;
    page: number;
}

export async function fetchMovies(
    query: string,
    page: number,
): Promise<ApiResponse> {
    const response = await axios.get<ApiResponse>(
        'https://api.themoviedb.org/3/search/movie',
        {
            params: {
                query,
                language: 'en-US',
                page,
            },
            headers: {
                Authorization: `Bearer ${myKey}`,
            },
        },
    );

    return response.data;
}

export async function fetchTrendMovies(): Promise<ApiResponse> {
    const response = await axios.get<ApiResponse>(
        'https://api.themoviedb.org/3/trending/movie/day',
        {
            params: {
                language: 'en-US',
            },
            headers: {
                Authorization: `Bearer ${myKey}`,
            },
        },
    );
    return response.data;
}

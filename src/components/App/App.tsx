import { useEffect, useState } from 'react';
import { fetchMovies } from '../../services/movieService';
import { SearchBar } from '../SearchBar/SearchBar';
import type { Movie } from '../../types/movie';
import { MovieGrid } from '../MovieGrid/MovieGrid';
import toast, { Toaster } from 'react-hot-toast';
import { ErrorMessage } from '../ErrorMessage/ErrorMessage';
import { Loader } from '../Loader/Loader';
import { MovieModal } from '../MovieModal/MovieModal';
import { keepPreviousData, useQuery } from '@tanstack/react-query';
import ReactPaginate from 'react-paginate';
import css from './App.module.css';

export default function App() {
    const [selectedMovie, setSelectedMovie] = useState<Movie | null>(null);
    const [page, setPage] = useState(1);
    const [query, setQuery] = useState('');

    const { data, isError, isFetching, isSuccess } = useQuery({
        queryKey: ['movies', query, page],
        queryFn: () => {
            return fetchMovies(query, page);
        },
        enabled: query !== '',
        placeholderData: keepPreviousData,
    });

    useEffect(() => {
        if (!isSuccess || data.total_results > 0) {
            return;
        }
        toast.error('No movies found for your request.');
    }, [isSuccess, data]);

    function onSelect(movie: Movie) {
        setSelectedMovie(movie);
    }

    function closeModal() {
        setSelectedMovie(null);
    }

    async function handleSubmit(query: string) {
        setQuery(query);
        setPage(1);
    }

    return (
        <>
            <SearchBar onSubmit={handleSubmit} />

            {data?.total_pages && data.total_pages > 1 ? (
                <ReactPaginate
                    pageRangeDisplayed={5}
                    marginPagesDisplayed={1}
                    onPageChange={({ selected }) => setPage(selected + 1)}
                    forcePage={page - 1}
                    containerClassName={css.pagination}
                    activeClassName={css.active}
                    nextLabel="→"
                    previousLabel="←"
                    pageCount={data.total_pages}
                />
            ) : null}

            {isFetching && <Loader />}

            {isError && <ErrorMessage />}

            {selectedMovie && (
                <MovieModal movie={selectedMovie} onClose={closeModal} />
            )}

            {data && data.results.length && (
                <MovieGrid onSelect={onSelect} movies={data.results} />
            )}

            <Toaster />
        </>
    );
}

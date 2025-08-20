import { createPortal } from 'react-dom';
import type { Movie } from '../../types/movie';
import css from './MovieModal.module.css';
import { useEffect } from 'react';

interface MovieModalProps {
    movie: Movie;
    onClose: () => void;
}

export function MovieModal({ movie, onClose }: MovieModalProps) {
    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.key === 'Escape') {
                onClose();
            }
        };

        document.addEventListener('keydown', handleKeyDown);
        document.body.style.overflow = 'hidden';

        return () => {
            document.removeEventListener('keydown', handleKeyDown);
            document.body.style.overflow = 'visible';
        };
    }, []);

    function handleClose(e: React.MouseEvent<HTMLElement>) {
        if (e.target === e.currentTarget) {
            onClose();
        }
    }

    return createPortal(
        <div
            onClick={handleClose}
            className={css.backdrop}
            role="dialog"
            aria-modal="true"
        >
            <div className={css.modal}>
                <button
                    onClick={handleClose}
                    className={css.closeButton}
                    aria-label="Close modal"
                >
                    &times;
                </button>
                <img
                    src={`https://image.tmdb.org/t/p/w500/${movie.backdrop_path}`}
                    alt={movie.title}
                    className={css.image}
                />
                <div className={css.content}>
                    <h2>{movie.title}</h2>
                    <p>{movie.overview}</p>
                    <p>
                        <strong>Release Date:</strong> {movie.release_date}
                    </p>
                    <p>
                        <strong>Rating:</strong> {movie.vote_average}/10
                    </p>
                </div>
            </div>
        </div>,
        document.body,
    );
}

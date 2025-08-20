import toast from 'react-hot-toast';
import css from './SearchBar.module.css';

interface onSubmitProps {
    onSubmit: (query: string) => void;
}

export function SearchBar({ onSubmit }: onSubmitProps) {
    function handleSearch(formData: FormData) {
        const searchData = formData.get('query') as string;
        if (!searchData.trim()) {
            toast.error('Please enter your search query.');
            return;
        }
        onSubmit(searchData);
    }

    return (
        <header className={css.header}>
            <div className={css.container}>
                <a
                    className={css.link}
                    href="https://www.themoviedb.org/"
                    target="_blank"
                    rel="noopener noreferrer"
                >
                    Powered by TMDB
                </a>
                <form action={handleSearch} className={css.form}>
                    <input
                        className={css.input}
                        type="text"
                        name="query"
                        autoComplete="off"
                        placeholder="Search movies..."
                        autoFocus
                    />
                    <button className={css.button} type="submit">
                        Search
                    </button>
                </form>
            </div>
        </header>
    );
}

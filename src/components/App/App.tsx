// import toast, { Toaster } from 'react-hot-toast';
// import { ErrorMessage } from '../ErrorMessage/ErrorMessage';
// import { Loader } from '../Loader/Loader';
// import { keepPreviousData, useQuery } from '@tanstack/react-query';
// import ReactPaginate from 'react-paginate';
import { useState } from 'react';
import NoteList from '../NoteList/NoteList';
import Pagination from '../Pagination/Pagination';
import css from './App.module.css';
import Modal from '../Modal/Modal';
import NoteForm from '../NoteForm/NoteForm';
import { Toaster } from 'react-hot-toast';
import { fetchNote } from '../../services/noteService';
import { keepPreviousData, useQuery } from '@tanstack/react-query';
import SearchBox from '../SearchBox/SearchBox';
import { useDebouncedCallback } from 'use-debounce';
import { Loader } from '../Loader/Loader';

export default function App() {
    const [search, setSearch] = useState('');
    const [page, setPage] = useState(1);
    const [isOpen, setIsOpen] = useState(false);

    const { data, isFetching, isSuccess } = useQuery({
        queryKey: ['notes', search, page],
        queryFn: () => {
            return fetchNote({ page, search });
        },
        placeholderData: keepPreviousData,
    });

    const debounced = useDebouncedCallback((value) => {
        setSearch(value);
        setPage(1);
    }, 1000);

    function handleOnClose() {
        setIsOpen(false);
    }

    return (
        <div className={css.app}>
            <header className={css.toolbar}>
                <SearchBox debounced={debounced} />

                {data && data.totalPages > 1 && (
                    <Pagination
                        onPageChange={setPage}
                        page={page}
                        totalPages={data.totalPages}
                    />
                )}

                <button onClick={() => setIsOpen(true)} className={css.button}>
                    Create note +
                </button>
            </header>
            <main>
                {isFetching && <Loader />}
                {data && data.notes.length === 0 && isSuccess && (
                    <div>Notes not found</div>
                )}
                {data && data.notes.length > 0 && (
                    <NoteList notes={data.notes} />
                )}
                {isOpen && (
                    <Modal
                        children={<NoteForm onCancel={handleOnClose} />}
                        onClose={handleOnClose}
                    />
                )}
            </main>
            <Toaster />
        </div>
    );
}

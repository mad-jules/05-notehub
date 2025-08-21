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
import toast, { Toaster } from 'react-hot-toast';
import { deleteNote, fetchNote } from '../../services/noteService';
import { keepPreviousData, useMutation, useQuery } from '@tanstack/react-query';
import { queryClient } from '../../main';
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
    }, 1000);

    const mutation = useMutation({
        mutationFn: (id: string) => deleteNote(id),
        onSuccess: (note) => {
            queryClient.invalidateQueries({ queryKey: ['notes'] });
            toast.success(`The note ${note.title} has been deleted.`);
        },
        onError: (error) => {
            toast.error(error.message);
        },
    });

    function handleOnClose() {
        setIsOpen(false);
    }

    function handleDelete(id: string) {
        mutation.mutate(id);
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
                    <NoteList notes={data.notes} onDelete={handleDelete} />
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

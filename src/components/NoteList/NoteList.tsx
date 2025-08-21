import { useMutation, useQueryClient } from '@tanstack/react-query';
import { deleteNote } from '../../services/noteService';
import type { Note } from '../../types/note';
import css from './NoteList.module.css';
import toast from 'react-hot-toast';

interface NoteListProps {
    notes: Note[];
}

export default function NoteList({ notes }: NoteListProps) {
    const queryClient = useQueryClient();

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

    function handleDelete(id: string) {
        mutation.mutate(id);
    }

    return (
        <ul className={css.list}>
            {notes.map((note) => {
                return (
                    <li key={note.id} className={css.listItem}>
                        <h2 className={css.title}>{note.title}</h2>
                        <p className={css.content}>{note.content}</p>
                        <div className={css.footer}>
                            <span className={css.tag}>{note.tag}</span>
                            <button
                                onClick={() => handleDelete(note.id)}
                                className={css.button}
                            >
                                Delete
                            </button>
                        </div>
                    </li>
                );
            })}
        </ul>
    );
}

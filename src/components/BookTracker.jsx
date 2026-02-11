import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Book, Check, Circle, ExternalLink, Plus, Quote, Trash2 } from 'lucide-react';
import { useLocalStorage } from '../hooks/useLocalStorage';

const BookTracker = () => {
    const [books, setBooks] = useLocalStorage('library-books', [
        { id: 1, title: 'Atomic Habits', author: 'James Clear', status: 'Reading', progress: 0.4 },
        { id: 2, title: 'Deep Work', author: 'Cal Newport', status: 'To Read', progress: 0 },
        { id: 3, title: 'Sapiens', author: 'Yuval Noah Harari', status: 'To Read', progress: 0 },
        { id: 4, title: 'Show Your Work!', author: 'Austin Kleon', status: 'Finished', progress: 1 },
    ]);

    const [isAdding, setIsAdding] = useState(false);
    const [newBook, setNewBook] = useState({ title: '', author: '', status: 'To Read', progress: 0 });

    const addBook = (e) => {
        e.preventDefault();
        if (!newBook.title) return;
        setBooks([...books, { ...newBook, id: Date.now() }]);
        setIsAdding(false);
        setNewBook({ title: '', author: '', status: 'To Read', progress: 0 });
    };

    return (
        <div className="w-full max-w-4xl mx-auto h-full flex flex-col p-4 text-white overflow-y-auto custom-scrollbar">

            <div className="flex justify-between items-end mb-8">
                <div>
                    <h2 className="text-3xl font-serif font-bold text-amber-100/90 mb-2">Reading Library</h2>
                    <p className="text-sm opacity-60">"The more that you read, the more things you will know."</p>
                </div>
                <button
                    onClick={() => setIsAdding(!isAdding)}
                    className="bg-amber-600/20 text-amber-200 px-4 py-2 rounded-full border border-amber-500/30 hover:bg-amber-600/30 transition-colors flex items-center gap-2 text-sm"
                >
                    <Plus size={16} /> Add Book
                </button>
            </div>

            {/* Add Panel */}
            {isAdding && (
                <motion.form
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    onSubmit={addBook}
                    className="bg-black/20 p-4 rounded-xl border border-white/10 mb-8 space-y-4"
                >
                    <div className="grid grid-cols-2 gap-4">
                        <input
                            placeholder="Title"
                            value={newBook.title}
                            onChange={e => setNewBook({ ...newBook, title: e.target.value })}
                            className="bg-white/5 border border-white/10 rounded p-2 text-sm focus:border-amber-500/50 outline-none"
                        />
                        <input
                            placeholder="Author"
                            value={newBook.author}
                            onChange={e => setNewBook({ ...newBook, author: e.target.value })}
                            className="bg-white/5 border border-white/10 rounded p-2 text-sm focus:border-amber-500/50 outline-none"
                        />
                    </div>
                    <button type="submit" className="w-full bg-amber-500/20 py-2 rounded text-amber-200 text-sm font-bold border border-amber-500/30 hover:bg-amber-500/30">
                        Save
                    </button>
                </motion.form>
            )}

            {/* Grid Layout */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">

                {/* To Read Column */}
                <div className="space-y-4">
                    <h3 className="text-xs uppercase tracking-widest opacity-50 font-bold border-b border-white/10 pb-2">Reading Pile</h3>
                    {books.filter(b => b.status === 'To Read').map(book => (
                        <BookCard key={book.id} book={book} />
                    ))}
                    {books.filter(b => b.status === 'To Read').length === 0 && <p className="text-xs opacity-30 italic">Empty shelf.</p>}
                </div>

                {/* Currently Reading */}
                <div className="space-y-4">
                    <h3 className="text-xs uppercase tracking-widest text-amber-300 font-bold border-b border-amber-500/30 pb-2">Active</h3>
                    {books.filter(b => b.status === 'Reading').map(book => (
                        <BookCard key={book.id} book={book} />
                    ))}
                    {books.filter(b => b.status === 'Reading').length === 0 && <p className="text-xs opacity-30 italic">Start reading something.</p>}
                </div>

                {/* Finished */}
                <div className="space-y-4">
                    <h3 className="text-xs uppercase tracking-widest text-emerald-300 font-bold border-b border-emerald-500/30 pb-2">Knowledge Bank</h3>
                    {books.filter(b => b.status === 'Finished').map(book => (
                        <BookCard key={book.id} book={book} />
                    ))}
                </div>

            </div>
        </div>
    );
};

const BookCard = ({ book }) => {
    // Generate a pseudo-random color based on title if no cover
    const colors = ['bg-rose-500', 'bg-blue-500', 'bg-amber-500', 'bg-emerald-500', 'bg-violet-500', 'bg-slate-500'];
    const color = colors[book.title.length % colors.length];

    return (
        <motion.div
            layout
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="glass-panel p-4 flex gap-4 hover:bg-white/5 transition-colors group cursor-pointer"
        >
            {/* Pseudo Cover */}
            <div className={`w-16 h-24 rounded shadow-lg ${color}/20 border border-white/10 flex items-center justify-center shrink-0`}>
                <Book size={20} className="opacity-50" />
            </div>

            <div className="flex flex-col justify-between w-full">
                <div>
                    <h4 className="font-serif font-bold text-sm leading-tight mb-1 line-clamp-2">{book.title}</h4>
                    <p className="text-xs opacity-60">{book.author}</p>
                </div>

                {book.status === 'Reading' && (
                    <div className="mt-2">
                        <div className="w-full h-1 bg-white/10 rounded-full overflow-hidden">
                            <div className="h-full bg-amber-400" style={{ width: `${book.progress * 100}%` }} />
                        </div>
                        <p className="text-[10px] text-amber-300 mt-1 text-right">{Math.round(book.progress * 100)}%</p>
                    </div>
                )}

                {book.status === 'Finished' && (
                    <div className="mt-2 flex justify-end">
                        <Check size={14} className="text-emerald-400" />
                    </div>
                )}
            </div>
        </motion.div>
    );
};

export default BookTracker;

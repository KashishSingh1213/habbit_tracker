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

    const readingCount = books.filter(b => b.status === 'Reading').length;
    const finishedCount = books.filter(b => b.status === 'Finished').length;

    return (
        <div className="w-full max-w-5xl mx-auto h-full flex flex-col p-4 text-white overflow-y-auto custom-scrollbar pb-24">

            {/* Library Header */}
            <div className="flex flex-col md:flex-row justify-between items-end mb-8 gap-4">
                <div>
                    <h2 className="text-4xl font-serif font-bold text-transparent bg-clip-text bg-gradient-to-r from-amber-200 to-orange-200 mb-2">My Library</h2>
                    <div className="flex gap-4 text-sm font-mono opacity-60">
                        <span>{books.length} VOLUMES</span>
                        <span className="text-amber-300">{readingCount} ACTIVE</span>
                        <span className="text-emerald-300">{finishedCount} FINISHED</span>
                    </div>
                </div>
                <button
                    onClick={() => setIsAdding(!isAdding)}
                    className="bg-white/10 hover:bg-white/20 text-white px-6 py-2 rounded-full border border-white/20 transition-all flex items-center gap-2 text-sm font-medium backdrop-blur-md"
                >
                    <Plus size={16} /> New Entry
                </button>
            </div>

            {/* Add Panel */}
            <AnimatePresence>
                {isAdding && (
                    <motion.form
                        initial={{ opacity: 0, height: 0, mb: 0 }}
                        animate={{ opacity: 1, height: 'auto', mb: 32 }}
                        exit={{ opacity: 0, height: 0, mb: 0 }}
                        onSubmit={addBook}
                        className="glass-panel p-6 border border-amber-500/20 overflow-hidden"
                    >
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                            <div className="space-y-1">
                                <label className="text-[10px] uppercase tracking-widest opacity-50 pl-1">Title</label>
                                <input
                                    placeholder="e.g. The Psychology of Money"
                                    value={newBook.title}
                                    onChange={e => setNewBook({ ...newBook, title: e.target.value })}
                                    className="w-full bg-black/20 border border-white/10 rounded-lg p-3 text-sm focus:border-amber-500/50 outline-none text-white placeholder:text-white/20 transition-colors"
                                    autoFocus
                                />
                            </div>
                            <div className="space-y-1">
                                <label className="text-[10px] uppercase tracking-widest opacity-50 pl-1">Author</label>
                                <input
                                    placeholder="e.g. Morgan Housel"
                                    value={newBook.author}
                                    onChange={e => setNewBook({ ...newBook, author: e.target.value })}
                                    className="w-full bg-black/20 border border-white/10 rounded-lg p-3 text-sm focus:border-amber-500/50 outline-none text-white placeholder:text-white/20 transition-colors"
                                />
                            </div>
                        </div>
                        <div className="flex justify-end gap-3">
                            <button type="button" onClick={() => setIsAdding(false)} className="px-4 py-2 hover:bg-white/5 rounded-lg text-xs opacity-60">Cancel</button>
                            <button type="submit" className="bg-amber-500/20 hover:bg-amber-500/30 px-6 py-2 rounded-lg text-amber-200 text-xs font-bold border border-amber-500/30 transition-all">
                                Add to Shelf
                            </button>
                        </div>
                    </motion.form>
                )}
            </AnimatePresence>

            {/* Grid Layout */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">

                {/* To Read Column */}
                <div className="space-y-6">
                    <h3 className="flex items-center gap-2 text-xs uppercase tracking-[0.2em] font-bold opacity-40 border-b border-white/10 pb-3">
                        <Circle size={10} /> Reading Pile
                    </h3>
                    {books.filter(b => b.status === 'To Read').map(book => (
                        <BookCard key={book.id} book={book} />
                    ))}
                    {books.filter(b => b.status === 'To Read').length === 0 && <p className="text-xs opacity-20 italic text-center py-10">Shelf Empty</p>}
                </div>

                {/* Currently Reading */}
                <div className="space-y-6">
                    <h3 className="flex items-center gap-2 text-xs uppercase tracking-[0.2em] text-amber-200 font-bold border-b border-amber-500/30 pb-3">
                        <Book size={12} /> Currently Reading
                    </h3>
                    {books.filter(b => b.status === 'Reading').map(book => (
                        <BookCard key={book.id} book={book} />
                    ))}
                    {books.filter(b => b.status === 'Reading').length === 0 && <p className="text-xs opacity-20 italic text-center py-10">Nothing active</p>}
                </div>

                {/* Finished */}
                <div className="space-y-6">
                    <h3 className="flex items-center gap-2 text-xs uppercase tracking-[0.2em] text-emerald-200 font-bold border-b border-white/10 pb-3">
                        <Check size={12} /> Archives
                    </h3>
                    {books.filter(b => b.status === 'Finished').map(book => (
                        <BookCard key={book.id} book={book} />
                    ))}
                </div>

            </div>
        </div>
    );
};

const BookCard = ({ book }) => {
    // Generate a pseudo-random gradient based on title length
    const gradients = [
        'from-rose-500 to-orange-500',
        'from-blue-500 to-cyan-500',
        'from-emerald-500 to-teal-500',
        'from-violet-500 to-purple-500',
        'from-amber-500 to-yellow-500',
        'from-slate-500 to-gray-500'
    ];
    const gradient = gradients[book.title.length % gradients.length];

    return (
        <motion.div
            layout
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            whileHover={{ y: -5 }}
            className="glass-panel p-4 flex gap-4 hover:bg-white/5 transition-all group cursor-pointer relative overflow-hidden"
        >
            {/* Pseudo Cover */}
            <div className={`w-14 h-20 rounded-md shadow-lg bg-gradient-to-br ${gradient} flex items-center justify-center shrink-0 relative z-10`}>
                <Book size={20} className="text-white/80 drop-shadow-md" />
                <div className="absolute inset-0 bg-black/10" />
                <div className="absolute left-0 top-0 bottom-0 w-1 bg-white/20" /> {/* Spine */}
            </div>

            <div className="flex flex-col justify-between w-full z-10 py-0.5">
                <div>
                    <h4 className="font-serif font-bold text-sm leading-tight mb-1 line-clamp-2 text-white/90 group-hover:text-white transition-colors">{book.title}</h4>
                    <p className="text-xs opacity-50 font-medium tracking-wide">{book.author}</p>
                </div>

                {book.status === 'Reading' && (
                    <div className="mt-2">
                        <div className="w-full h-1 bg-white/10 rounded-full overflow-hidden">
                            <motion.div
                                initial={{ width: 0 }}
                                animate={{ width: `${book.progress * 100}%` }}
                                className="h-full bg-amber-400"
                            />
                        </div>
                        <p className="text-[10px] text-amber-300/80 mt-1 text-right font-mono">{Math.round(book.progress * 100)}%</p>
                    </div>
                )}

                {book.status === 'Finished' && (
                    <div className="mt-2 flex justify-end">
                        <div className="bg-emerald-500/20 p-1 rounded-full">
                            <Check size={10} className="text-emerald-400" />
                        </div>
                    </div>
                )}
            </div>

            {/* Background ambient glow based on book cover */}
            <div className={`absolute -right-10 -bottom-10 w-32 h-32 bg-gradient-to-br ${gradient} opacity-0 group-hover:opacity-10 blur-2xl transition-opacity duration-500`} />
        </motion.div>
    );
};

export default BookTracker;

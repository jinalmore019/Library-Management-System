import React, { useState, useEffect } from 'react';
import { api } from '../api';
import { Plus, Edit2, Trash2, X, Search, Image as ImageIcon } from 'lucide-react';
import toast from 'react-hot-toast';

const Books = () => {
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentBook, setCurrentBook] = useState({ title: '', author: '', price: '', imageUrl: '' });
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    fetchBooks();
  }, []);

  const fetchBooks = async () => {
    try {
      const data = await api.getBooks();
      setBooks(data || []);
    } catch (error) {
      toast.error("Failed to fetch books");
    } finally {
      setLoading(false);
    }
  };

  const handleOpenModal = (book = null) => {
    if (book) {
      setCurrentBook(book);
      setIsEditing(true);
    } else {
      setCurrentBook({ title: '', author: '', price: '', imageUrl: '' });
      setIsEditing(false);
    }
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  const handleChange = (e) => {
    setCurrentBook({ ...currentBook, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (isEditing) {
        await api.updateBook(currentBook.id, currentBook);
        toast.success("Book updated successfully!");
      } else {
        await api.addBook(currentBook);
        toast.success("Book added successfully!");
      }
      handleCloseModal();
      fetchBooks();
    } catch (error) {
      toast.error(error.message || "Error saving book");
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this book?")) {
      try {
        await api.deleteBook(id);
        toast.success("Book deleted");
        fetchBooks();
      } catch (error) {
        toast.error("Error deleting book.");
      }
    }
  };

  const filteredBooks = books.filter(b => 
    b.title?.toLowerCase().includes(searchQuery.toLowerCase()) || 
    b.author?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="animate-fade-in">
      <div className="page-header">
        <div>
          <h1 className="title">Book Collection</h1>
          <p className="subtitle">Manage the library's catalog of books</p>
        </div>
        <button className="btn" onClick={() => handleOpenModal()}>
          <Plus size={18} /> Add New Book
        </button>
      </div>

      <div className="glass-panel" style={{ marginBottom: '30px', padding: '15px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', background: 'rgba(255,255,255,0.05)', borderRadius: '8px', padding: '0 15px', border: '1px solid var(--border-color)' }}>
          <Search size={20} color="var(--text-secondary)" />
          <input 
            type="text" 
            placeholder="Search books by title or author..." 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            style={{ background: 'transparent', border: 'none', color: 'var(--text-primary)', padding: '12px 0', width: '100%', outline: 'none' }}
          />
        </div>
      </div>

      {loading ? (
        <div style={{ padding: '2rem', textAlign: 'center' }}>Loading Collection...</div>
      ) : filteredBooks.length === 0 ? (
        <div className="glass-panel" style={{ textAlign: 'center', padding: '4rem 2rem' }}>
          <h3 style={{ marginBottom: '10px' }}>No books found</h3>
          <p style={{ color: 'var(--text-secondary)' }}>Try adjusting your search or add a new book to the collection.</p>
        </div>
      ) : (
        <div style={{ 
          display: 'grid', 
          gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))', 
          gap: '24px' 
        }}>
          {filteredBooks.map((book) => (
            <div key={book.id} className="glass-panel" style={{ padding: '0', overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>
              <div style={{ 
                height: '280px', 
                background: 'rgba(0,0,0,0.2)', 
                display: 'flex', 
                alignItems: 'center', 
                justifyContent: 'center',
                borderBottom: '1px solid var(--border-color)'
              }}>
                {book.imageUrl ? (
                  <img src={book.imageUrl} alt={book.title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                ) : (
                  <div style={{ textAlign: 'center', color: 'var(--text-secondary)' }}>
                    <ImageIcon size={48} style={{ opacity: 0.5, marginBottom: '10px' }} />
                    <p style={{ fontSize: '0.9rem' }}>No Cover</p>
                  </div>
                )}
              </div>
              <div style={{ padding: '20px', flex: 1, display: 'flex', flexDirection: 'column' }}>
                <h3 style={{ fontSize: '1.1rem', marginBottom: '8px', lineHeight: '1.4' }}>{book.title}</h3>
                <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', marginBottom: '15px' }}>By {book.author}</p>
                <div style={{ marginTop: 'auto', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{ fontWeight: '600', color: 'var(--accent)' }}>${book.price}</span>
                  <div style={{ display: 'flex', gap: '8px' }}>
                    <button className="btn btn-outline" style={{ padding: '6px' }} onClick={() => handleOpenModal(book)}>
                      <Edit2 size={16} />
                    </button>
                    <button className="btn btn-danger" style={{ padding: '6px' }} onClick={() => handleDelete(book.id)}>
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {isModalOpen && (
        <div className="modal-overlay">
          <div className="glass-panel modal-content animate-fade-in">
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1.5rem' }}>
              <h3>{isEditing ? 'Edit Book' : 'Add New Book'}</h3>
              <button style={{ background: 'transparent', border: 'none', color: 'var(--text-primary)', cursor: 'pointer' }} onClick={handleCloseModal}>
                <X size={20} />
              </button>
            </div>
            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label>Book Title</label>
                <input required type="text" name="title" className="input" value={currentBook.title} onChange={handleChange} placeholder="Enter book title" />
              </div>
              <div className="form-group">
                <label>Author</label>
                <input required type="text" name="author" className="input" value={currentBook.author} onChange={handleChange} placeholder="Enter author name" />
              </div>
              <div className="form-group">
                <label>Price ($)</label>
                <input required type="number" step="0.01" name="price" className="input" value={currentBook.price} onChange={handleChange} placeholder="Enter price" />
              </div>
              <div className="form-group">
                <label>Cover Image URL (Optional)</label>
                <input type="url" name="imageUrl" className="input" value={currentBook.imageUrl || ''} onChange={handleChange} placeholder="https://example.com/image.jpg" />
              </div>
              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px', marginTop: '2rem' }}>
                <button type="button" className="btn btn-outline" onClick={handleCloseModal}>Cancel</button>
                <button type="submit" className="btn">{isEditing ? 'Save Changes' : 'Add Book'}</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Books;

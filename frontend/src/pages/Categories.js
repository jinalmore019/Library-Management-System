import React, { useState, useEffect } from 'react';
import { api } from '../api';
import { Plus, Edit2, Trash2, X } from 'lucide-react';

const Categories = () => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentCategory, setCurrentCategory] = useState({ name: '' });
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      const data = await api.getCategories();
      setCategories(data || []);
    } catch (error) {
      console.error("Failed to fetch categories", error);
    } finally {
      setLoading(false);
    }
  };

  const handleOpenModal = (category = null) => {
    if (category) {
      setCurrentCategory(category);
      setIsEditing(true);
    } else {
      setCurrentCategory({ name: '' });
      setIsEditing(false);
    }
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setCurrentCategory({ name: '' });
  };

  const handleChange = (e) => {
    setCurrentCategory({ ...currentCategory, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (isEditing) {
        await api.updateCategory(currentCategory.id, currentCategory);
      } else {
        await api.addCategory(currentCategory);
      }
      handleCloseModal();
      fetchCategories();
    } catch (error) {
      console.error("Error saving category", error);
      alert("Error saving category: " + error.message);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this category?")) {
      try {
        await api.deleteCategory(id);
        fetchCategories();
      } catch (error) {
        console.error("Error deleting category", error);
        alert("Error deleting category.");
      }
    }
  };

  return (
    <div className="animate-fade-in">
      <div className="page-header">
        <div>
          <h1 className="title">Book Categories</h1>
          <p className="subtitle">Organize library collections into categories</p>
        </div>
        <button className="btn" onClick={() => handleOpenModal()}>
          <Plus size={18} /> Add Category
        </button>
      </div>

      <div className="table-container" style={{ maxWidth: '800px' }}>
        {loading ? (
          <div style={{ padding: '2rem', textAlign: 'center' }}>Loading...</div>
        ) : (
          <table>
            <thead>
              <tr>
                <th>ID</th>
                <th>Category Name</th>
                <th style={{ width: '150px' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {categories.length === 0 ? (
                <tr><td colSpan="3" style={{textAlign: 'center'}}>No categories found. Add one!</td></tr>
              ) : (
                categories.map((cat) => (
                  <tr key={cat.id}>
                    <td>#{cat.id}</td>
                    <td style={{ fontWeight: '500', color: 'white' }}>{cat.name}</td>
                    <td>
                      <div style={{ display: 'flex', gap: '8px' }}>
                        <button className="btn btn-outline" style={{ padding: '6px 10px' }} onClick={() => handleOpenModal(cat)}>
                          <Edit2 size={16} />
                        </button>
                        <button className="btn btn-danger" style={{ padding: '6px 10px' }} onClick={() => handleDelete(cat.id)}>
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        )}
      </div>

      {isModalOpen && (
        <div className="modal-overlay">
          <div className="glass-panel modal-content animate-fade-in">
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1.5rem' }}>
              <h3>{isEditing ? 'Edit Category' : 'Add New Category'}</h3>
              <button style={{ background: 'transparent', border: 'none', color: 'white', cursor: 'pointer' }} onClick={handleCloseModal}>
                <X size={20} />
              </button>
            </div>
            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label>Category Name</label>
                <input required type="text" name="name" className="input" value={currentCategory.name} onChange={handleChange} placeholder="Enter category name" />
              </div>
              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px', marginTop: '2rem' }}>
                <button type="button" className="btn btn-outline" onClick={handleCloseModal}>Cancel</button>
                <button type="submit" className="btn">{isEditing ? 'Save Changes' : 'Add Category'}</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Categories;

import React, { useState, useEffect } from 'react';
import { api } from '../api';
import { Plus, Edit2, Trash2, X, Search } from 'lucide-react';
import toast from 'react-hot-toast';

const Students = () => {
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentStudent, setCurrentStudent] = useState({ name: '', email: '', mobile: '' });
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    fetchStudents();
  }, []);

  const fetchStudents = async () => {
    try {
      const data = await api.getStudents();
      setStudents(data || []);
    } catch (error) {
      toast.error("Failed to fetch students");
    } finally {
      setLoading(false);
    }
  };

  const handleOpenModal = (student = null) => {
    if (student) {
      setCurrentStudent(student);
      setIsEditing(true);
    } else {
      setCurrentStudent({ name: '', email: '', mobile: '' });
      setIsEditing(false);
    }
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  const handleChange = (e) => {
    setCurrentStudent({ ...currentStudent, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (isEditing) {
        await api.updateStudent(currentStudent.id, currentStudent);
        toast.success("Student updated successfully");
      } else {
        await api.addStudent(currentStudent);
        toast.success("Student added successfully");
      }
      handleCloseModal();
      fetchStudents();
    } catch (error) {
      toast.error(error.message || "Error saving student");
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this student?")) {
      try {
        await api.deleteStudent(id);
        toast.success("Student deleted");
        fetchStudents();
      } catch (error) {
        toast.error("Error deleting student.");
      }
    }
  };

  const filteredStudents = students.filter(s => 
    s.name?.toLowerCase().includes(searchQuery.toLowerCase()) || 
    s.email?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="animate-fade-in">
      <div className="page-header">
        <div>
          <h1 className="title">Manage Students</h1>
          <p className="subtitle">Directory of all registered students</p>
        </div>
        <button className="btn" onClick={() => handleOpenModal()}>
          <Plus size={18} /> Add New Student
        </button>
      </div>

      <div className="glass-panel" style={{ marginBottom: '20px', padding: '15px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', background: 'rgba(15, 23, 42, 0.6)', borderRadius: '8px', padding: '0 15px' }}>
          <Search size={20} color="var(--text-secondary)" />
          <input 
            type="text" 
            placeholder="Search students by name or email..." 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            style={{ background: 'transparent', border: 'none', color: 'white', padding: '12px 0', width: '100%', outline: 'none' }}
          />
        </div>
      </div>

      <div className="table-container">
        {loading ? (
          <div style={{ padding: '2rem', textAlign: 'center' }}>Loading...</div>
        ) : (
          <table>
            <thead>
              <tr>
                <th>ID</th>
                <th>Name</th>
                <th>Email</th>
                <th>Mobile</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredStudents.length === 0 ? (
                <tr><td colSpan="5" style={{textAlign: 'center'}}>No students found.</td></tr>
              ) : (
                filteredStudents.map((student) => (
                  <tr key={student.id}>
                    <td>#{student.id}</td>
                    <td style={{ fontWeight: '500', color: 'white' }}>{student.name}</td>
                    <td>{student.email}</td>
                    <td>{student.mobile}</td>
                    <td>
                      <div style={{ display: 'flex', gap: '8px' }}>
                        <button className="btn btn-outline" style={{ padding: '6px 10px' }} onClick={() => handleOpenModal(student)}>
                          <Edit2 size={16} />
                        </button>
                        <button className="btn btn-danger" style={{ padding: '6px 10px' }} onClick={() => handleDelete(student.id)}>
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
              <h3>{isEditing ? 'Edit Student' : 'Add New Student'}</h3>
              <button style={{ background: 'transparent', border: 'none', color: 'white', cursor: 'pointer' }} onClick={handleCloseModal}>
                <X size={20} />
              </button>
            </div>
            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label>Full Name</label>
                <input required type="text" name="name" className="input" value={currentStudent.name} onChange={handleChange} placeholder="Enter full name" />
              </div>
              <div className="form-group">
                <label>Email Address</label>
                <input required type="email" name="email" className="input" value={currentStudent.email} onChange={handleChange} placeholder="Enter email address" />
              </div>
              <div className="form-group">
                <label>Mobile Number</label>
                <input required type="text" name="mobile" className="input" value={currentStudent.mobile} onChange={handleChange} placeholder="Enter mobile number" />
              </div>
              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px', marginTop: '2rem' }}>
                <button type="button" className="btn btn-outline" onClick={handleCloseModal}>Cancel</button>
                <button type="submit" className="btn">{isEditing ? 'Save Changes' : 'Add Student'}</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Students;

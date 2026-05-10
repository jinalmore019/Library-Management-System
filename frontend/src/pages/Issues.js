import React, { useState, useEffect } from 'react';
import { api } from '../api';
import { Plus, Edit2, Trash2, X, CheckCircle, Download } from 'lucide-react';
import toast from 'react-hot-toast';

const Issues = () => {
  const [issues, setIssues] = useState([]);
  const [books, setBooks] = useState([]);
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentIssue, setCurrentIssue] = useState({ bookId: '', studentId: '', issueDate: '', dueDate: '', status: 'ISSUED' });
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    fetchInitialData();
  }, []);

  const fetchInitialData = async () => {
    try {
      const [issuesData, booksData, studentsData] = await Promise.all([
        api.getIssues(),
        api.getBooks(),
        api.getStudents()
      ]);
      setIssues(issuesData || []);
      setBooks(booksData || []);
      setStudents(studentsData || []);
    } catch (error) {
      toast.error("Failed to fetch library issues");
    } finally {
      setLoading(false);
    }
  };

  const handleOpenModal = (issue = null) => {
    if (issue) {
      setCurrentIssue({
        id: issue.id,
        bookId: issue.book ? issue.book.id : '',
        studentId: issue.student ? issue.student.id : '',
        issueDate: issue.issueDate || '',
        dueDate: issue.dueDate || '',
        status: issue.status || 'ISSUED',
        fineAmount: issue.fineAmount || 0
      });
      setIsEditing(true);
    } else {
      // Default due date is 14 days from today
      const today = new Date();
      const due = new Date();
      due.setDate(today.getDate() + 14);
      
      setCurrentIssue({ 
        bookId: '', 
        studentId: '', 
        issueDate: today.toISOString().split('T')[0], 
        dueDate: due.toISOString().split('T')[0],
        status: 'ISSUED' 
      });
      setIsEditing(false);
    }
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  const handleChange = (e) => {
    setCurrentIssue({ ...currentIssue, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const payload = {
      book: { id: parseInt(currentIssue.bookId) },
      student: { id: parseInt(currentIssue.studentId) },
      issueDate: currentIssue.issueDate,
      dueDate: currentIssue.dueDate,
      status: currentIssue.status,
      fineAmount: currentIssue.fineAmount || 0
    };

    try {
      if (isEditing) {
        await api.updateIssue(currentIssue.id, payload);
        toast.success("Issue updated successfully");
      } else {
        await api.addIssue(payload);
        toast.success("Book issued successfully");
      }
      handleCloseModal();
      fetchInitialData();
    } catch (error) {
      toast.error(error.message || "Error saving issue");
    }
  };

  const calculateFine = (dueDateStr) => {
    if (!dueDateStr) return 0;
    const due = new Date(dueDateStr);
    const today = new Date();
    
    // Reset times to compare just the dates
    due.setHours(0,0,0,0);
    today.setHours(0,0,0,0);
    
    if (today <= due) return 0;
    
    const diffTime = Math.abs(today - due);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)); 
    
    // $2 fine per day late
    return diffDays * 2.0;
  };

  const handleReturnBook = async (issue) => {
    const calculatedFine = calculateFine(issue.dueDate);
    let confirmMsg = `Mark "${issue.book?.title}" as returned?`;
    
    if (calculatedFine > 0) {
        confirmMsg = `WARNING: This book is overdue!\nA late fine of $${calculatedFine} will be applied.\nMark as returned?`;
    }

    if (window.confirm(confirmMsg)) {
      try {
        const payload = {
            ...issue,
            status: "RETURNED",
            fineAmount: calculatedFine
        };
        await api.updateIssue(issue.id, payload);
        if (calculatedFine > 0) {
            toast.error(`Book returned late! Fine: $${calculatedFine}`);
        } else {
            toast.success("Book returned on time!");
        }
        fetchInitialData();
      } catch(err) {
        toast.error("Could not return book");
      }
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this issue record?")) {
      try {
        await api.deleteIssue(id);
        toast.success("Record deleted");
        fetchInitialData();
      } catch (error) {
        toast.error("Error deleting issue");
      }
    }
  };

  const downloadCSV = () => {
    if (issues.length === 0) {
        toast.error("No data to export");
        return;
    }
    const headers = ["Issue ID", "Book Title", "Student Name", "Issue Date", "Due Date", "Status", "Fine ($)"];
    const csvRows = [headers.join(",")];
    
    issues.forEach(issue => {
        const row = [
            issue.id,
            `"${issue.book?.title || 'N/A'}"`,
            `"${issue.student?.name || 'N/A'}"`,
            issue.issueDate,
            issue.dueDate || 'N/A',
            issue.status || 'ISSUED',
            issue.fineAmount || 0
        ];
        csvRows.push(row.join(","));
    });

    const blob = new Blob([csvRows.join("\n")], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.setAttribute('hidden', '');
    a.setAttribute('href', url);
    a.setAttribute('download', 'library_issues_report.csv');
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    toast.success("Report downloaded");
  };

  return (
    <div className="animate-fade-in">
      <div className="page-header">
        <div>
          <h1 className="title">Issue Management</h1>
          <p className="subtitle">Track issuing, returns, and calculate overdue fines</p>
        </div>
        <div style={{ display: 'flex', gap: '15px' }}>
            <button className="btn btn-outline" onClick={downloadCSV}>
                <Download size={18} /> Export CSV
            </button>
            <button className="btn" onClick={() => handleOpenModal()}>
                <Plus size={18} /> Issue a Book
            </button>
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
                <th>Book Title</th>
                <th>Student</th>
                <th>Dates (Issued - Due)</th>
                <th>Status & Fine</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {issues.length === 0 ? (
                <tr><td colSpan="6" style={{textAlign: 'center'}}>No issues found. Issue a book!</td></tr>
              ) : (
                issues.map((issue) => {
                    const isOverdue = issue.status === 'ISSUED' && new Date() > new Date(issue.dueDate);
                    return (
                  <tr key={issue.id} style={{ background: isOverdue ? 'rgba(239, 68, 68, 0.05)' : '' }}>
                    <td>#{issue.id}</td>
                    <td style={{ fontWeight: '500', color: 'var(--text-primary)' }}>{issue.book?.title || 'Unknown Book'}</td>
                    <td>{issue.student?.name || 'Unknown Student'}</td>
                    <td>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                            <span style={{ fontSize: '0.85rem' }}>Out: {issue.issueDate}</span>
                            <span style={{ fontSize: '0.85rem', color: isOverdue ? 'var(--error)' : 'var(--text-secondary)' }}>Due: {issue.dueDate || 'N/A'}</span>
                        </div>
                    </td>
                    <td>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', alignItems: 'flex-start' }}>
                            <span style={{ 
                                background: issue.status === 'RETURNED' ? 'rgba(16, 185, 129, 0.15)' : 'rgba(245, 158, 11, 0.15)',
                                color: issue.status === 'RETURNED' ? '#10b981' : '#f59e0b',
                                padding: '4px 10px',
                                borderRadius: '20px',
                                fontSize: '0.75rem',
                                fontWeight: '700'
                            }}>
                                {issue.status || 'ISSUED'}
                            </span>
                            {issue.fineAmount > 0 && (
                                <span style={{ color: 'var(--error)', fontSize: '0.85rem', fontWeight: '600' }}>Fine: ${issue.fineAmount}</span>
                            )}
                            {isOverdue && (
                                <span style={{ color: 'var(--error)', fontSize: '0.8rem', fontWeight: '600' }}>OVERDUE!</span>
                            )}
                        </div>
                    </td>
                    <td>
                      <div style={{ display: 'flex', gap: '8px' }}>
                        {(!issue.status || issue.status === 'ISSUED') && (
                            <button className="btn btn-outline" style={{ padding: '6px 10px', borderColor: '#10b981', color: '#10b981' }} title="Mark as Returned" onClick={() => handleReturnBook(issue)}>
                                <CheckCircle size={16} />
                            </button>
                        )}
                        <button className="btn btn-outline" style={{ padding: '6px 10px' }} onClick={() => handleOpenModal(issue)}>
                          <Edit2 size={16} />
                        </button>
                        <button className="btn btn-danger" style={{ padding: '6px 10px' }} onClick={() => handleDelete(issue.id)}>
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })
              )}
            </tbody>
          </table>
        )}
      </div>

      {isModalOpen && (
        <div className="modal-overlay">
          <div className="glass-panel modal-content animate-fade-in">
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1.5rem' }}>
              <h3>{isEditing ? 'Edit Issue' : 'Issue Book'}</h3>
              <button style={{ background: 'transparent', border: 'none', color: 'var(--text-primary)', cursor: 'pointer' }} onClick={handleCloseModal}>
                <X size={20} />
              </button>
            </div>
            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label>Select Book</label>
                <select required name="bookId" className="input" value={currentIssue.bookId} onChange={handleChange}>
                  <option value="" disabled>Select a book...</option>
                  {books.map(b => (
                    <option key={b.id} value={b.id}>{b.title}</option>
                  ))}
                </select>
              </div>
              <div className="form-group">
                <label>Select Student</label>
                <select required name="studentId" className="input" value={currentIssue.studentId} onChange={handleChange}>
                  <option value="" disabled>Select a student...</option>
                  {students.map(s => (
                    <option key={s.id} value={s.id}>{s.name} ({s.email})</option>
                  ))}
                </select>
              </div>
              <div style={{ display: 'flex', gap: '15px' }}>
                <div className="form-group" style={{ flex: 1 }}>
                    <label>Issue Date</label>
                    <input required type="date" name="issueDate" className="input" value={currentIssue.issueDate} onChange={handleChange} />
                </div>
                <div className="form-group" style={{ flex: 1 }}>
                    <label>Due Date</label>
                    <input required type="date" name="dueDate" className="input" value={currentIssue.dueDate} onChange={handleChange} />
                </div>
              </div>
              {isEditing && (
                <div style={{ display: 'flex', gap: '15px' }}>
                    <div className="form-group" style={{ flex: 1 }}>
                        <label>Status</label>
                        <select name="status" className="input" value={currentIssue.status} onChange={handleChange}>
                            <option value="ISSUED">ISSUED</option>
                            <option value="RETURNED">RETURNED</option>
                        </select>
                    </div>
                    <div className="form-group" style={{ flex: 1 }}>
                        <label>Fine Amount ($)</label>
                        <input type="number" step="0.01" name="fineAmount" className="input" value={currentIssue.fineAmount} onChange={handleChange} />
                    </div>
                </div>
              )}
              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px', marginTop: '1rem' }}>
                <button type="button" className="btn btn-outline" onClick={handleCloseModal}>Cancel</button>
                <button type="submit" className="btn">{isEditing ? 'Save Changes' : 'Issue Book'}</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Issues;

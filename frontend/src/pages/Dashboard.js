import React, { useState, useEffect } from 'react';
import { Book, Users, Layers, Bookmark } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { api } from '../api';

const StatCard = ({ title, value, icon, color }) => (
  <div className="glass-panel" style={{ flex: 1, display: 'flex', alignItems: 'center', gap: '20px' }}>
    <div style={{ 
      background: `rgba(${color}, 0.2)`, 
      color: `rgb(${color})`, 
      padding: '16px', 
      borderRadius: '12px' 
    }}>
      {icon}
    </div>
    <div>
      <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', marginBottom: '4px' }}>{title}</p>
      <h3 style={{ fontSize: '1.8rem', fontWeight: '700' }}>{value}</h3>
    </div>
  </div>
);

const Dashboard = () => {
  const [stats, setStats] = useState({ books: 0, students: 0, categories: 0, issues: 0 });
  const [loading, setLoading] = useState(true);
  const [chartData, setChartData] = useState([]);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const [books, students, categories, issues] = await Promise.all([
          api.getBooks(),
          api.getStudents(),
          api.getCategories(),
          api.getIssues()
        ]);
        
        setStats({
          books: books ? books.length : 0,
          students: students ? students.length : 0,
          categories: categories ? categories.length : 0,
          issues: issues ? issues.length : 0
        });

        // Generate data for charts - Grouping issues by month
        const monthlyData = [
          { name: 'Jan', issues: 0 }, { name: 'Feb', issues: 0 },
          { name: 'Mar', issues: 0 }, { name: 'Apr', issues: 0 },
          { name: 'May', issues: 0 }, { name: 'Jun', issues: 0 }
        ];

        if (issues) {
          issues.forEach(issue => {
            if(issue.issueDate) {
              const monthIndex = new Date(issue.issueDate).getMonth();
              if (monthIndex < 6) monthlyData[monthIndex].issues += 1;
            }
          });
        }
        setChartData(monthlyData);

      } catch (error) {
        console.error("Error fetching stats", error);
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, []);

  const downloadReport = () => {
    if (!stats) return;
    const csvContent = "Metric,Value\n" + 
      `Total Books,${stats.books}\n` +
      `Active Students,${stats.students}\n` +
      `Categories,${stats.categories}\n` +
      `Total Issues,${stats.issues}`;
    
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'library_dashboard_summary.csv';
    a.click();
  };

  return (
    <div className="animate-fade-in">
      <div className="page-header">
        <div>
          <h1 className="title">Dashboard</h1>
          <p className="subtitle">Welcome to Library Management System</p>
        </div>
        <button className="btn btn-outline" onClick={downloadReport}>
          Download Summary (CSV)
        </button>
      </div>

      {loading ? (
        <div style={{ textAlign: 'center', padding: '3rem' }}>Loading Stats...</div>
      ) : (
        <>
          <div style={{ display: 'flex', gap: '24px', flexWrap: 'wrap', marginBottom: '30px' }}>
            <StatCard title="Total Books" value={stats.books} icon={<Book size={28} />} color="59, 130, 246" />
            <StatCard title="Active Students" value={stats.students} icon={<Users size={28} />} color="16, 185, 129" />
            <StatCard title="Categories" value={stats.categories} icon={<Layers size={28} />} color="139, 92, 246" />
            <StatCard title="Total Issues" value={stats.issues} icon={<Bookmark size={28} />} color="245, 158, 11" />
          </div>

          <div className="glass-panel" style={{ height: '400px' }}>
            <h3 style={{ marginBottom: '20px' }}>Books Issued (H1)</h3>
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData} margin={{ top: 10, right: 30, left: 0, bottom: 20 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
                <XAxis dataKey="name" stroke="#94a3b8" />
                <YAxis stroke="#94a3b8" />
                <Tooltip contentStyle={{ backgroundColor: '#1e293b', border: 'none', borderRadius: '8px' }} />
                <Bar dataKey="issues" fill="#3b82f6" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </>
      )}
    </div>
  );
};

export default Dashboard;

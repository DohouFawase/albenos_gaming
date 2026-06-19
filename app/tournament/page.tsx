'use client';
import React, { useEffect, useState } from 'react';

interface Inscription {
  id: string;
  nom: string;
  prenom: string;
  age: string;
  telephone: string;
  date: string;
}

export default function AdminTournamentPage() {
  const [data, setData] = useState<Inscription[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const fetchData = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/tournament', { cache: 'no-store' });
      if (!res.ok) throw new Error('Erreur de chargement');
      const json = await res.json();
      setData(json.reverse()); // plus récent en premier
    } catch (err) {
      setError('Impossible de charger les inscriptions.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    fetchData();
  }, []);

  const exportCSV = () => {
    const headers = ['Prénom', 'Nom', 'Âge', 'Téléphone', 'Date'];
    const rows = data.map(d => [d.prenom, d.nom, d.age, d.telephone, new Date(d.date).toLocaleString('fr-FR')]);
    const csv = [headers, ...rows].map(r => r.join(',')).join('\n');
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'inscriptions-tournoi.csv';
    a.click();
  };

  return (
    <div style={pageStyle}>
      <div style={headerRowStyle}>
        <div>
          <h1 style={titleStyle}>Inscriptions au tournoi</h1>
          <p style={subtitleStyle}>{data.length} inscription{data.length !== 1 ? 's' : ''}</p>
        </div>
        <div style={{ display: 'flex', gap: 10 }}>
          <button onClick={fetchData} style={buttonStyle}>Rafraîchir</button>
          <button onClick={exportCSV} style={{ ...buttonStyle, background: '#7f77dd' }}>
            Exporter CSV
          </button>
        </div>
      </div>

      {loading && <p style={{ color: '#9d97c4' }}>Chargement...</p>}
      {error && <p style={{ color: '#e57373' }}>{error}</p>}

      {!loading && !error && data.length === 0 && (
        <p style={{ color: '#9d97c4' }}>Aucune inscription pour le moment.</p>
      )}

      {!loading && data.length > 0 && (
        <div style={tableWrapStyle}>
          <table style={tableStyle}>
            <thead>
              <tr>
                <th style={thStyle}>Prénom</th>
                <th style={thStyle}>Nom</th>
                <th style={thStyle}>Âge</th>
                <th style={thStyle}>Téléphone</th>
                <th style={thStyle}>Date</th>
              </tr>
            </thead>
            <tbody>
              {data.map((entry) => (
                <tr key={entry.id} style={trStyle}>
                  <td style={tdStyle}>{entry.prenom}</td>
                  <td style={tdStyle}>{entry.nom}</td>
                  <td style={tdStyle}>{entry.age}</td>
                  <td style={tdStyle}>{entry.telephone}</td>
                  <td style={tdStyle}>{new Date(entry.date).toLocaleString('fr-FR')}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

const pageStyle: React.CSSProperties = {
  minHeight: '100vh',
  background: '#0a0a0f',
  padding: '40px clamp(20px, 5vw, 48px)',
  fontFamily: "'Inter', system-ui, -apple-system, sans-serif",
};

const headerRowStyle: React.CSSProperties = {
  display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start',
  flexWrap: 'wrap', gap: 16, marginBottom: 32,
};

const titleStyle: React.CSSProperties = {
  color: '#f4f3fb', fontSize: 26, fontWeight: 800, margin: '0 0 6px',
};

const subtitleStyle: React.CSSProperties = {
  color: '#9d97c4', fontSize: 14, margin: 0,
};

const buttonStyle: React.CSSProperties = {
  background: '#2a2a3a', color: '#f4f3fb', border: '1px solid #3a3a4a',
  borderRadius: 8, padding: '10px 18px', fontSize: 13, fontWeight: 600,
  cursor: 'pointer',
};

const tableWrapStyle: React.CSSProperties = {
  background: '#12121a', border: '1px solid #2a2a3a', borderRadius: 12,
  overflow: 'hidden', overflowX: 'auto',
};

const tableStyle: React.CSSProperties = {
  width: '100%', borderCollapse: 'collapse', fontSize: 14,
};

const thStyle: React.CSSProperties = {
  textAlign: 'left', color: '#7f77dd', fontSize: 11, letterSpacing: 1,
  textTransform: 'uppercase', padding: '14px 18px',
  borderBottom: '1px solid #2a2a3a', whiteSpace: 'nowrap',
};

const tdStyle: React.CSSProperties = {
  color: '#e0dff8', padding: '14px 18px', borderBottom: '1px solid #1a1a24',
  whiteSpace: 'nowrap',
};

const trStyle: React.CSSProperties = {};
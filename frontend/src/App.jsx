import React, { useEffect, useState } from 'react';
import FilterBar from './components/FilterBar';
import LogList from './components/LogList';

const API_BASE = import.meta.env.VITE_API_BASE || 'http://localhost:4000';

export default function App() {
  const [searchOptions, setSearchOptions] = useState({
    text: '',
    resourceId: '',
    traceId: '',
    spanId: '',
    commit: '',
    level: [],
    timestamp_start: '',
    timestamp_end: ''
  });
  const [myLogs, setMyLogs] = useState([]);
  const [loading, setLoading] = useState(false);
  const [errMsg, setErrMsg] = useState('');

  function exportCSV() {
    if (!myLogs.length) return;
    const keys = Object.keys(myLogs[0]);
    const rows = [keys.join(',')].concat(
      myLogs.map(obj => keys.map(k => {
        const v = typeof obj[k] === 'object' ? JSON.stringify(obj[k]) : String(obj[k] ?? '');
        return '"' + v.replace(/"/g,'""') + '"';
      }).join(','))
    );
    const blob = new Blob([rows.join('\n')], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'logs.csv';
    a.click();
    URL.revokeObjectURL(url);
  }

  useEffect(() => {
    const p = new URLSearchParams();
    if (searchOptions.level.length) p.set('level', searchOptions.level.join(','));
    if (searchOptions.text) p.set('message', searchOptions.text);
    ['resourceId','traceId','spanId','commit','timestamp_start','timestamp_end'].forEach(k=>{
      if (searchOptions[k]) p.set(k, searchOptions[k]);
    });
    const url = API_BASE + '/logs' + (p.toString() ? ('?' + p.toString()) : '');

    setLoading(true);
    setErrMsg('');
    fetch(url)
      .then(r => { if (!r.ok) throw new Error('Network error'); return r.json(); })
      .then(data => setMyLogs(data))
      .catch(e => setErrMsg(e.message))
      .finally(() => setLoading(false));
  }, [searchOptions]);

  return (
    <div className="container">
      <h1>Log Ingestion — Query UI</h1>
      <FilterBar searchOptions={searchOptions} setSearchOptions={setSearchOptions} />
      <div className="toolbar">
        <div className="count">Showing <strong>{myLogs.length}</strong> log(s)</div>
        <div className="spacer" />
        <button onClick={exportCSV} disabled={!myLogs.length}>Export CSV</button>
      </div>
      {loading && <div className="info">Loading...</div>}
      {errMsg && <div className="error">Error: {errMsg}</div>}
      <LogList logs={myLogs} />
      <footer>Developed by <strong>Sivaneshwaran</strong></footer>
    </div>
  );
}

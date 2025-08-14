import React, { useEffect, useState } from 'react';

const LEVELS = ['error','warn','info','debug'];

export default function FilterBar({ searchOptions, setSearchOptions }) {
  const [text, setText] = useState(searchOptions.text || '');
  const [resourceId, setResourceId] = useState(searchOptions.resourceId || '');
  const [level, setLevel] = useState(searchOptions.level || []);
  const [start, setStart] = useState(searchOptions.timestamp_start || '');
  const [end, setEnd] = useState(searchOptions.timestamp_end || '');
  const [traceId, setTraceId] = useState(searchOptions.traceId || '');
  const [spanId, setSpanId] = useState(searchOptions.spanId || '');
  const [commit, setCommit] = useState(searchOptions.commit || '');

  useEffect(() => { const t = setTimeout(()=>setSearchOptions(p=>({...p, text})), 350); return ()=>clearTimeout(t); }, [text]);
  useEffect(() => { const t = setTimeout(()=>setSearchOptions(p=>({...p, resourceId})), 300); return ()=>clearTimeout(t); }, [resourceId]);
  useEffect(() => { const t = setTimeout(()=>setSearchOptions(p=>({...p, traceId})), 300); return ()=>clearTimeout(t); }, [traceId]);
  useEffect(() => { const t = setTimeout(()=>setSearchOptions(p=>({...p, spanId})), 300); return ()=>clearTimeout(t); }, [spanId]);
  useEffect(() => { const t = setTimeout(()=>setSearchOptions(p=>({...p, commit})), 300); return ()=>clearTimeout(t); }, [commit]);
  useEffect(() => { setSearchOptions(p=>({ ...p, level })); }, [level]);
  useEffect(() => { setSearchOptions(p=>({ ...p, timestamp_start: start })); }, [start]);
  useEffect(() => { setSearchOptions(p=>({ ...p, timestamp_end: end })); }, [end]);

  function toggle(l) {
    setLevel(prev => prev.includes(l) ? prev.filter(x=>x!==l) : [...prev, l]);
  }
  function clearAll() {
    setText(''); setResourceId(''); setTraceId(''); setSpanId(''); setCommit('');
    setLevel([]); setStart(''); setEnd('');
  }

  return (
    <div className="filter-bar">
      <div className="row">
        <input placeholder="Search message..." value={text} onChange={e=>setText(e.target.value)} />
        <input placeholder="resourceId..." value={resourceId} onChange={e=>setResourceId(e.target.value)} />
        <input placeholder="traceId..." value={traceId} onChange={e=>setTraceId(e.target.value)} />
        <input placeholder="spanId..." value={spanId} onChange={e=>setSpanId(e.target.value)} />
        <input placeholder="commit..." value={commit} onChange={e=>setCommit(e.target.value)} />
      </div>
      <div className="row">
        <div className="levels">
          {LEVELS.map(l => (
            <label key={l} className={level.includes(l) ? 'selected' : ''}>
              <input type="checkbox" checked={level.includes(l)} onChange={()=>toggle(l)} /> {l}
            </label>
          ))}
        </div>
        <div className="date-row">
          <label>Start: <input type="datetime-local" value={start} onChange={e=>setStart(e.target.value)} /></label>
          <label>End: <input type="datetime-local" value={end} onChange={e=>setEnd(e.target.value)} /></label>
        </div>
        <button onClick={clearAll}>Clear</button>
      </div>
    </div>
  );
}

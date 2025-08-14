import React from 'react';

function levelClass(level) {
  if (level === 'error') return 'log error';
  if (level === 'warn') return 'log warn';
  if (level === 'info') return 'log info';
  return 'log debug';
}

export default function LogItem({ log }) {
  return (
    <div className={levelClass(log.level)}>
      <div className="meta">
        <div><strong>{log.level.toUpperCase()}</strong> — {new Date(log.timestamp).toLocaleString()}</div>
        <div>resource: {log.resourceId} | trace: {log.traceId} | span: {log.spanId} | commit: {log.commit}</div>
      </div>
      <div className="message">{log.message}</div>
      {log.metadata && <pre className="meta-json">{JSON.stringify(log.metadata, null, 2)}</pre>}
    </div>
  );
}

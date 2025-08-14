import React from 'react';
import LogItem from './LogItem';

export default function LogList({ logs }) {
  if (!logs || logs.length === 0) return <div className="info">No logs to display</div>;
  return <div className="log-list">{logs.map((l, i) => <LogItem key={i} log={l} />)}</div>;
}

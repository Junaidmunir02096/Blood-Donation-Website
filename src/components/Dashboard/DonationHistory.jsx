import { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faArrowUpFromBracket,
  faCheckCircle,
  faChevronUp,
  faChevronDown,
  faSort,
} from '@fortawesome/free-solid-svg-icons';
import './DonationHistory.scss';

const donationData = [
  {
    id: 'don-1',
    date: 'Aug 28, 2024',
    rawDate: new Date('2024-08-28'),
    location: 'Metro Regional Blood Center',
    type: 'Whole Blood',
    volume: '450ml',
    status: 'Completed',
  },
  {
    id: 'don-2',
    date: 'May 12, 2024',
    rawDate: new Date('2024-05-12'),
    location: 'City General Hospital',
    type: 'Plasma',
    volume: '800ml',
    status: 'Completed',
  },
  {
    id: 'don-3',
    date: 'Feb 05, 2024',
    rawDate: new Date('2024-02-05'),
    location: 'Community Drive - Westside',
    type: 'Whole Blood',
    volume: '450ml',
    status: 'Completed',
  },
  {
    id: 'don-4',
    date: 'Oct 14, 2023',
    rawDate: new Date('2023-10-14'),
    location: 'Sunrise Donation Hub',
    type: 'Platelets',
    volume: '300ml',
    status: 'Completed',
  },
  {
    id: 'don-5',
    date: 'Jun 30, 2023',
    rawDate: new Date('2023-06-30'),
    location: 'Metro Regional Blood Center',
    type: 'Whole Blood',
    volume: '450ml',
    status: 'Completed',
  },
];

const columns = [
  { key: 'date',     label: 'Date',          sortable: true  },
  { key: 'location', label: 'Location',      sortable: true  },
  { key: 'type',     label: 'Donation Type', sortable: true  },
  { key: 'volume',   label: 'Volume',        sortable: false },
  { key: 'status',   label: 'Status',        sortable: false },
];

// ── CSV Export ────────────────────────────────────────────────────────────────
const exportToCSV = (rows) => {
  const headers = ['Date', 'Location', 'Donation Type', 'Volume', 'Status'];
  const csvRows = [
    headers.join(','),
    ...rows.map((r) =>
      [r.date, `"${r.location}"`, r.type, r.volume, r.status].join(',')
    ),
  ];
  const blob = new Blob([csvRows.join('\n')], { type: 'text/csv;charset=utf-8;' });
  const url  = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href     = url;
  link.download = 'donation_history.csv';
  link.click();
  URL.revokeObjectURL(url);
};

// ── Component ─────────────────────────────────────────────────────────────────
const DonationHistory = () => {
  const [sortKey, setSortKey]   = useState('date');
  const [sortDir, setSortDir]   = useState('desc'); // 'asc' | 'desc'

  const handleSort = (key) => {
    if (!columns.find((c) => c.key === key)?.sortable) return;
    if (sortKey === key) {
      setSortDir((d) => (d === 'asc' ? 'desc' : 'asc'));
    } else {
      setSortKey(key);
      setSortDir('asc');
    }
  };

  const sorted = [...donationData].sort((a, b) => {
    let valA = sortKey === 'date' ? a.rawDate : a[sortKey];
    let valB = sortKey === 'date' ? b.rawDate : b[sortKey];
    if (valA < valB) return sortDir === 'asc' ? -1 : 1;
    if (valA > valB) return sortDir === 'asc' ?  1 : -1;
    return 0;
  });

  const SortIcon = ({ colKey }) => {
    const col = columns.find((c) => c.key === colKey);
    if (!col?.sortable) return null;
    if (sortKey !== colKey) return <FontAwesomeIcon icon={faSort} className="dh-table__sort-icon dh-table__sort-icon--idle" />;
    return sortDir === 'asc'
      ? <FontAwesomeIcon icon={faChevronUp}   className="dh-table__sort-icon dh-table__sort-icon--active" />
      : <FontAwesomeIcon icon={faChevronDown} className="dh-table__sort-icon dh-table__sort-icon--active" />;
  };

  return (
    <section className="donation-history" aria-label="Donation History">

      {/* ── Card ── */}
      <div className="dh-card">

        {/* Header */}
        <div className="dh-card__header">
          <h2 className="dh-card__title">Recent Donation History</h2>
          <button
            type="button"
            className="dh-card__export-btn"
            id="btn-export-donations"
            onClick={() => exportToCSV(sorted)}
            aria-label="Export donation history as CSV"
          >
            <FontAwesomeIcon icon={faArrowUpFromBracket} />
            Export Record
          </button>
        </div>

        {/* Table */}
        <div className="dh-table-wrapper" role="region" aria-label="Donation history table" tabIndex={0}>
          <table className="dh-table" aria-label="Recent donations">
            <thead>
              <tr>
                {columns.map((col) => (
                  <th
                    key={col.key}
                    className={`dh-table__th${col.sortable ? ' dh-table__th--sortable' : ''}${sortKey === col.key ? ' dh-table__th--sorted' : ''}`}
                    onClick={() => handleSort(col.key)}
                    aria-sort={
                      sortKey === col.key
                        ? sortDir === 'asc' ? 'ascending' : 'descending'
                        : undefined
                    }
                  >
                    {col.label}
                    <SortIcon colKey={col.key} />
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {sorted.map((row, idx) => (
                <tr key={row.id} className="dh-table__row" style={{ animationDelay: `${idx * 0.05}s` }}>
                  <td className="dh-table__td dh-table__td--date">{row.date}</td>
                  <td className="dh-table__td">{row.location}</td>
                  <td className="dh-table__td">{row.type}</td>
                  <td className="dh-table__td">{row.volume}</td>
                  <td className="dh-table__td">
                    <span className={`dh-badge dh-badge--${row.status.toLowerCase()}`}>
                      <FontAwesomeIcon icon={faCheckCircle} aria-hidden="true" />
                      {row.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Footer summary */}
        <p className="dh-card__footer">
          Showing <strong>{sorted.length}</strong> donation{sorted.length !== 1 ? 's' : ''}
        </p>
      </div>
    </section>
  );
};

export default DonationHistory;

import React, { useState, useEffect, useMemo } from 'react';

type SortField = 'label' | 'value' | 'toolName' | 'tooth';
type SortDirection = 'asc' | 'desc';

interface MeasurementRow {
  uid: string;
  label: string;
  displayText: string[];
  value: string;
  unit: string;
  toolName: string;
  tooth: number | null;
}

/**
 * DentalMeasurementsPanel — right-side panel that lists all current
 * measurements in a sortable, filterable table.
 */
function DentalMeasurementsPanel({
  servicesManager,
  commandsManager,
}: withAppTypes) {
  const { measurementService } = servicesManager.services;

  const [measurements, setMeasurements] = useState<MeasurementRow[]>([]);
  const [filterText, setFilterText] = useState('');
  const [sortField, setSortField] = useState<SortField>('label');
  const [sortDirection, setSortDirection] = useState<SortDirection>('asc');

  // ── Helpers ──────────────────────────────────────────────────────────
  const refreshMeasurements = () => {
    const all = measurementService.getMeasurements();
    const rows: MeasurementRow[] = all.map(m => {
      let displayText = [];
      if (Array.isArray(m.displayText)) {
        displayText = m.displayText;
      } else if (m.displayText && typeof m.displayText === 'object') {
        displayText = [
          ...(m.displayText.primary || []),
          ...(m.displayText.secondary || []),
        ];
      }

      // Try to extract a numeric value from displayText
      const numericMatch = displayText.join(' ').match(/([\d.]+)\s*(mm|°|cm)?/);
      return {
        uid: m.uid,
        label: m.label || m.toolName || '—',
        displayText,
        value: numericMatch ? numericMatch[1] : '—',
        unit: numericMatch?.[2] || m.unit || '',
        toolName: m.toolName || '',
        tooth: m.tooth || null,
      };
    });
    setMeasurements(rows);
  };

  // ── Subscribe to measurement events ─────────────────────────────────
  useEffect(() => {
    refreshMeasurements();

    const events = [
      measurementService.EVENTS.MEASUREMENT_ADDED,
      measurementService.EVENTS.RAW_MEASUREMENT_ADDED,
      measurementService.EVENTS.MEASUREMENT_UPDATED,
      measurementService.EVENTS.MEASUREMENT_REMOVED,
      measurementService.EVENTS.MEASUREMENTS_CLEARED,
    ];

    const subs = events.map(event =>
      measurementService.subscribe(event, refreshMeasurements)
    );

    return () => {
      subs.forEach(sub => sub.unsubscribe());
    };
  }, [measurementService]);

  // ── Sorting ─────────────────────────────────────────────────────────
  const toggleSort = (field: SortField) => {
    if (sortField === field) {
      setSortDirection(prev => (prev === 'asc' ? 'desc' : 'asc'));
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  };

  const sortIndicator = (field: SortField) => {
    if (sortField !== field) return '';
    return sortDirection === 'asc' ? ' ▲' : ' ▼';
  };

  // ── Filtered + sorted rows ──────────────────────────────────────────
  const visibleRows = useMemo(() => {
    let rows = [...measurements];

    // Filter
    if (filterText) {
      const lower = filterText.toLowerCase();
      rows = rows.filter(
        r =>
          r.label.toLowerCase().includes(lower) ||
          r.toolName.toLowerCase().includes(lower)
      );
    }

    // Sort
    rows.sort((a, b) => {
      const aVal = a[sortField] ?? '';
      const bVal = b[sortField] ?? '';
      const cmp = String(aVal).localeCompare(String(bVal), undefined, { numeric: true });
      return sortDirection === 'asc' ? cmp : -cmp;
    });

    return rows;
  }, [measurements, filterText, sortField, sortDirection]);

  // ── Jump to measurement on click ────────────────────────────────────
  const handleRowClick = (uid: string) => {
    commandsManager.runCommand('jumpToMeasurement', { uid });
  };

  // ── Render ──────────────────────────────────────────────────────────
  return (
    <div className="flex h-full flex-col overflow-hidden text-white">
      {/* Header */}
      <div className="bg-primary-dark flex items-center justify-between px-3 py-2">
        <span className="text-sm font-semibold">Dental Measurements</span>
        <div className="flex items-center gap-2">
          <button
            className="bg-primary hover:bg-primary-light rounded px-2 py-0.5 text-[10px] font-medium transition-colors"
            onClick={() => commandsManager.runCommand('exportMeasurementsAsJSON')}
          >
            Export JSON
          </button>
          <span className="text-muted-foreground text-xs">
            {measurements.length} item{measurements.length !== 1 ? 's' : ''}
          </span>
        </div>
      </div>

      {/* Filter input */}
      <div className="px-3 py-2">
        <input
          type="text"
          placeholder="Filter measurements…"
          className="bg-secondary border-secondary-light w-full rounded border px-2 py-1 text-xs text-white placeholder-gray-400 focus:outline-none"
          value={filterText}
          onChange={e => setFilterText(e.target.value)}
        />
      </div>

      {/* Table */}
      <div className="flex-1 overflow-y-auto px-1">
        <table className="w-full text-xs">
          <thead className="bg-secondary sticky top-0">
            <tr>
              <th
                className="cursor-pointer px-2 py-1 text-left font-medium"
                onClick={() => toggleSort('label')}
              >
                Label{sortIndicator('label')}
              </th>
              <th
                className="cursor-pointer px-2 py-1 text-right font-medium"
                onClick={() => toggleSort('value')}
              >
                Value{sortIndicator('value')}
              </th>
              <th
                className="cursor-pointer px-2 py-1 text-center font-medium"
                onClick={() => toggleSort('tooth')}
              >
                Tooth{sortIndicator('tooth')}
              </th>
            </tr>
          </thead>
          <tbody>
            {visibleRows.length === 0 ? (
              <tr>
                <td
                  colSpan={3}
                  className="text-muted-foreground px-2 py-4 text-center"
                >
                  No measurements
                </td>
              </tr>
            ) : (
              visibleRows.map(row => (
                <tr
                  key={row.uid}
                  className="hover:bg-primary-dark cursor-pointer border-b border-gray-700 transition-colors"
                  onClick={() => handleRowClick(row.uid)}
                >
                  <td className="px-2 py-1.5">{row.label}</td>
                  <td className="px-2 py-1.5 text-right">
                    {row.value}
                    {row.unit ? ` ${row.unit}` : ''}
                  </td>
                  <td className="px-2 py-1.5 text-center">
                    {row.tooth || '—'}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default DentalMeasurementsPanel;

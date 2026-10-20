import { CRM_CHART_COLORS } from '../../../../data/crm.data';

const CrmChartTooltip = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null;

  return (
    <div className="crm-tooltip">
      <p className="crm-tooltip__label">{label}</p>
      {payload.map((entry) => (
        <p key={entry.dataKey || entry.name} className="crm-tooltip__row">
          <span
            className="crm-tooltip__dot"
            style={{ background: entry.color || CRM_CHART_COLORS.primary }}
          />
          <span>{entry.name}</span>
          <strong>{Number(entry.value).toLocaleString('en-PK')}</strong>
        </p>
      ))}
    </div>
  );
};

export default CrmChartTooltip;

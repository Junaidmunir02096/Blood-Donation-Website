import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowTrendDown, faArrowTrendUp } from '@fortawesome/free-solid-svg-icons';

const formatValue = (value) =>
  typeof value === 'number' ? value.toLocaleString('en-PK') : value;

const CrmKpiCard = ({
  label,
  value,
  trend,
  hint,
  icon,
  tone = 'red',
  invertTrend = false,
}) => {
  const up = Number(trend) >= 0;
  const isGood = invertTrend ? !up : up;
  const trendAbs = Math.abs(Number(trend)).toFixed(1);

  return (
    <article className={`crm-kpi crm-kpi--${tone}`}>
      <div className="crm-kpi__top">
        <span className={`crm-kpi__icon crm-kpi__icon--${tone}`} aria-hidden="true">
          <FontAwesomeIcon icon={icon} />
        </span>
        {Number.isFinite(Number(trend)) && (
          <span
            className={`crm-kpi__trend ${isGood ? 'crm-kpi__trend--up' : 'crm-kpi__trend--down'}`}
          >
            <FontAwesomeIcon icon={up ? faArrowTrendUp : faArrowTrendDown} />
            {up ? '+' : '−'}{trendAbs}%
          </span>
        )}
      </div>
      <p className="crm-kpi__label">{label}</p>
      <p className="crm-kpi__value">{formatValue(value)}</p>
      {hint && <p className="crm-kpi__hint">{hint}</p>}
    </article>
  );
};

export default CrmKpiCard;

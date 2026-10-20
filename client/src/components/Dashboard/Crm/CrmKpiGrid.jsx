import {
  faTriangleExclamation,
  faUserCheck,
  faUserGroup,
  faHourglassHalf,
} from '@fortawesome/free-solid-svg-icons';
import CrmKpiCard from './CrmKpiCard';

const CrmKpiGrid = ({ kpis }) => {
  if (!kpis) return null;

  const cards = [
    {
      label: 'Total donors',
      value: kpis.totalDonors,
      trend: kpis.totalDonorsTrend,
      hint: 'Registered across the Pakistan network',
      icon: faUserGroup,
      tone: 'red',
    },
    {
      label: 'Available now',
      value: kpis.availableDonors,
      trend: kpis.availableDonorsTrend,
      hint: 'Verified and currently eligible',
      icon: faUserCheck,
      tone: 'teal',
    },
    {
      label: 'Pending requests',
      value: kpis.pendingRequests,
      trend: kpis.pendingRequestsTrend,
      hint: kpis.pendingMeta,
      icon: faHourglassHalf,
      tone: 'amber',
      invertTrend: true,
    },
    {
      label: 'Emergency alerts',
      value: kpis.emergencies,
      trend: kpis.emergenciesTrend,
      hint: kpis.emergenciesMeta,
      icon: faTriangleExclamation,
      tone: 'danger',
      invertTrend: true,
    },
  ];

  return (
    <div className="crm-kpi-grid">
      {cards.map((card) => (
        <CrmKpiCard key={card.label} {...card} />
      ))}
    </div>
  );
};

export default CrmKpiGrid;

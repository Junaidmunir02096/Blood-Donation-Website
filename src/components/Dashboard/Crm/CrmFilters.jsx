import { BLOOD_GROUPS } from '../../../constants/blood';
import { PAKISTAN_CITIES } from '../../../constants/pakistan';
import { CRM_PERIODS } from '../../../data/crm.data';

const CrmFilters = ({ filters, onChange, disabled }) => {
  const update = (key) => (e) => onChange({ ...filters, [key]: e.target.value });

  return (
    <div className="crm-filters" role="group" aria-label="Dashboard filters">
      <label className="crm-filters__field">
        <span className="crm-filters__label">Period</span>
        <select
          className="crm-filters__select"
          value={filters.period}
          onChange={update('period')}
          disabled={disabled}
          id="crm-filter-period"
        >
          {CRM_PERIODS.map((p) => (
            <option key={p.value} value={p.value}>{p.label}</option>
          ))}
        </select>
      </label>

      <label className="crm-filters__field">
        <span className="crm-filters__label">City</span>
        <select
          className="crm-filters__select"
          value={filters.city}
          onChange={update('city')}
          disabled={disabled}
          id="crm-filter-city"
        >
          <option value="all">All cities</option>
          {PAKISTAN_CITIES.map((city) => (
            <option key={city} value={city}>{city}</option>
          ))}
        </select>
      </label>

      <label className="crm-filters__field">
        <span className="crm-filters__label">Blood group</span>
        <select
          className="crm-filters__select"
          value={filters.bloodGroup}
          onChange={update('bloodGroup')}
          disabled={disabled}
          id="crm-filter-group"
        >
          <option value="all">All groups</option>
          {BLOOD_GROUPS.map((g) => (
            <option key={g} value={g}>{g}</option>
          ))}
        </select>
      </label>
    </div>
  );
};

export default CrmFilters;

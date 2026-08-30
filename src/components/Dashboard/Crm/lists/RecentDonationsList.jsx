import EmptyState from '../../../EmptyState/EmptyState';

const RecentDonationsList = ({ items = [], onViewAll }) => (
  <div className="crm-list">
    {items.length === 0 ? (
      <EmptyState
        title="No recent donations"
        message="Completed collections matching these filters will appear here."
      />
    ) : (
      <div className="crm-table-wrap">
        <table className="crm-table" aria-label="Recent donations">
          <thead>
            <tr>
              <th>Donor</th>
              <th>Group</th>
              <th>Location</th>
              <th>Type</th>
              <th>Date</th>
            </tr>
          </thead>
          <tbody>
            {items.map((row) => (
              <tr key={row.id}>
                <td className="crm-table__primary">{row.donor}</td>
                <td>
                  <span className="crm-blood">{row.bloodGroup}</span>
                </td>
                <td className="crm-table__muted">{row.location}</td>
                <td>{row.type}</td>
                <td className="crm-table__muted">{row.date}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    )}
    {onViewAll && items.length > 0 && (
      <button type="button" className="crm-panel__link crm-panel__link--block" onClick={onViewAll}>
        View donation history
      </button>
    )}
  </div>
);

export default RecentDonationsList;

import { Cell, Pie, PieChart, ResponsiveContainer, Tooltip } from 'recharts';
import { CRM_CHART_COLORS } from '../../../../data/crm.data';
import CrmChartTooltip from './CrmChartTooltip';

const DonorMixDonut = ({ data = [] }) => {
  const total = data.reduce((sum, row) => sum + row.value, 0);

  return (
    <div className="crm-donut">
      <div className="crm-chart crm-chart--donut" role="img" aria-label="Registered donor mix by blood group">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={data}
              dataKey="value"
              nameKey="group"
              innerRadius="62%"
              outerRadius="88%"
              paddingAngle={2}
              stroke="none"
            >
              {data.map((row) => (
                <Cell
                  key={row.group}
                  fill={CRM_CHART_COLORS.groups[row.group] || CRM_CHART_COLORS.primary}
                />
              ))}
            </Pie>
            <Tooltip content={<CrmChartTooltip />} />
          </PieChart>
        </ResponsiveContainer>
        <div className="crm-donut__center" aria-hidden="true">
          <span className="crm-donut__center-value">{total}%</span>
          <span className="crm-donut__center-label">Network mix</span>
        </div>
      </div>
      <ul className="crm-donut__legend">
        {data.map((row) => (
          <li key={row.group}>
            <span
              className="crm-donut__swatch"
              style={{ background: CRM_CHART_COLORS.groups[row.group] }}
            />
            <span>{row.group}</span>
            <strong>{row.value}%</strong>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default DonorMixDonut;

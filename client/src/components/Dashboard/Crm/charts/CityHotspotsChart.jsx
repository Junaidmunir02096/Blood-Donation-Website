import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';
import { CRM_CHART_COLORS } from '../../../../data/crm.data';
import CrmChartTooltip from './CrmChartTooltip';

const CityHotspotsChart = ({ data = [] }) => {
  const rows = [...data].sort((a, b) => b.donors - a.donors);

  return (
    <div className="crm-chart crm-chart--cities" role="img" aria-label="Registered donors by Pakistan city">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart
          data={rows}
          layout="vertical"
          margin={{ top: 4, right: 16, left: 8, bottom: 0 }}
        >
          <CartesianGrid stroke={CRM_CHART_COLORS.grid} strokeDasharray="3 3" horizontal={false} />
          <XAxis
            type="number"
            tick={{ fill: CRM_CHART_COLORS.muted, fontSize: 11 }}
            axisLine={false}
            tickLine={false}
          />
          <YAxis
            type="category"
            dataKey="city"
            width={96}
            interval={0}
            tick={{ fill: CRM_CHART_COLORS.navy, fontSize: 11, fontWeight: 600 }}
            axisLine={false}
            tickLine={false}
          />
          <Tooltip content={<CrmChartTooltip />} />
          <Bar dataKey="donors" name="Donors" radius={[0, 6, 6, 0]} maxBarSize={16}>
            {rows.map((row) => (
              <Cell
                key={row.city}
                fill={CRM_CHART_COLORS.status[row.status] || CRM_CHART_COLORS.primary}
                opacity={row.highlight === false ? 0.28 : 1}
              />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default CityHotspotsChart;

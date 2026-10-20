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

const BloodGroupBarChart = ({ data = [] }) => (
  <div className="crm-chart" role="img" aria-label="Donor availability by blood group">
    <ResponsiveContainer width="100%" height="100%">
      <BarChart data={data} margin={{ top: 8, right: 4, left: -12, bottom: 0 }}>
        <CartesianGrid stroke={CRM_CHART_COLORS.grid} strokeDasharray="3 3" vertical={false} />
        <XAxis
          dataKey="group"
          tick={{ fill: CRM_CHART_COLORS.muted, fontSize: 12 }}
          axisLine={false}
          tickLine={false}
        />
        <YAxis
          tick={{ fill: CRM_CHART_COLORS.muted, fontSize: 12 }}
          axisLine={false}
          tickLine={false}
        />
        <Tooltip content={<CrmChartTooltip />} />
        <Bar dataKey="donors" name="Available donors" radius={[6, 6, 0, 0]} maxBarSize={28}>
          {data.map((row) => (
            <Cell
              key={row.group}
              fill={CRM_CHART_COLORS.status[row.status] || CRM_CHART_COLORS.primary}
              opacity={row.highlight === false ? 0.28 : 1}
            />
          ))}
        </Bar>
      </BarChart>
    </ResponsiveContainer>
  </div>
);

export default BloodGroupBarChart;

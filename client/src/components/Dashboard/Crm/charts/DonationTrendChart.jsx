import {
  Area,
  CartesianGrid,
  ComposedChart,
  Legend,
  Line,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';
import { CRM_CHART_COLORS } from '../../../../data/crm.data';
import CrmChartTooltip from './CrmChartTooltip';

const DonationTrendChart = ({ data = [] }) => (
  <div className="crm-chart" role="img" aria-label="Donations versus blood requests over time">
    <ResponsiveContainer width="100%" height="100%">
      <ComposedChart data={data} margin={{ top: 8, right: 8, left: -12, bottom: 0 }}>
        <defs>
          <linearGradient id="crmDonationsFill" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor={CRM_CHART_COLORS.primary} stopOpacity={0.22} />
            <stop offset="100%" stopColor={CRM_CHART_COLORS.primary} stopOpacity={0.02} />
          </linearGradient>
        </defs>
        <CartesianGrid stroke={CRM_CHART_COLORS.grid} strokeDasharray="3 3" vertical={false} />
        <XAxis
          dataKey="label"
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
        <Legend
          wrapperStyle={{ fontSize: 12, paddingTop: 8 }}
          iconType="circle"
        />
        <Area
          type="monotone"
          dataKey="donations"
          name="Donations"
          stroke={CRM_CHART_COLORS.primary}
          fill="url(#crmDonationsFill)"
          strokeWidth={2.5}
          dot={{ r: 3, fill: CRM_CHART_COLORS.primary, strokeWidth: 0 }}
          activeDot={{ r: 5 }}
        />
        <Line
          type="monotone"
          dataKey="requests"
          name="Requests"
          stroke={CRM_CHART_COLORS.navy}
          strokeWidth={2}
          strokeDasharray="5 4"
          dot={{ r: 3, fill: CRM_CHART_COLORS.navy, strokeWidth: 0 }}
          activeDot={{ r: 5 }}
        />
      </ComposedChart>
    </ResponsiveContainer>
  </div>
);

export default DonationTrendChart;

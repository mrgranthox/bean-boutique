import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../ui/card';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line, PieChart, Pie, Cell } from 'recharts';

interface AdminAnalyticsProps {
  stats: {
    totalOrders: number;
    totalRevenue: number;
    totalUsers: number;
    totalProducts: number;
    totalEvents: number;
    activeSubscriptions: number;
    recentOrders: any[];
    topProducts: any[];
    monthlyRevenue: number[];
  };
}

export function AdminAnalytics({ stats }: AdminAnalyticsProps) {
  // Prepare chart data
  const monthlyData = [
    { month: 'Jan', revenue: stats.monthlyRevenue[0] || 2100, orders: 45 },
    { month: 'Feb', revenue: stats.monthlyRevenue[1] || 2800, orders: 52 },
    { month: 'Mar', revenue: stats.monthlyRevenue[2] || 3200, orders: 61 },
    { month: 'Apr', revenue: stats.monthlyRevenue[3] || 2900, orders: 58 },
    { month: 'May', revenue: stats.monthlyRevenue[4] || 3500, orders: 67 },
    { month: 'Jun', revenue: stats.monthlyRevenue[5] || 4200, orders: 78 },
    { month: 'Jul', revenue: stats.monthlyRevenue[6] || 3800, orders: 72 },
    { month: 'Aug', revenue: stats.monthlyRevenue[7] || 4100, orders: 76 },
    { month: 'Sep', revenue: stats.monthlyRevenue[8] || 3900, orders: 74 },
    { month: 'Oct', revenue: stats.monthlyRevenue[9] || 4500, orders: 82 },
    { month: 'Nov', revenue: stats.monthlyRevenue[10] || 4800, orders: 89 },
    { month: 'Dec', revenue: stats.monthlyRevenue[11] || 5200, orders: 96 }
  ];

  const categoryData = [
    { name: 'Coffee', value: 45, color: '#8b4513' },
    { name: 'Equipment', value: 30, color: '#cd853f' },
    { name: 'Subscriptions', value: 20, color: '#deb887' },
    { name: 'Events', value: 5, color: '#f4a460' }
  ];

  const dailyOrdersData = [
    { day: 'Mon', orders: 12, revenue: 350 },
    { day: 'Tue', orders: 19, revenue: 420 },
    { day: 'Wed', orders: 15, revenue: 380 },
    { day: 'Thu', orders: 22, revenue: 520 },
    { day: 'Fri', orders: 28, revenue: 680 },
    { day: 'Sat', orders: 35, revenue: 820 },
    { day: 'Sun', orders: 31, revenue: 750 }
  ];

  return (
    <div className="grid gap-6">
      {/* Monthly Revenue Trend */}
      <Card>
        <CardHeader>
          <CardTitle>Monthly Revenue Trend</CardTitle>
          <CardDescription>Revenue performance over the last 12 months</CardDescription>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={monthlyData}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
              <XAxis 
                dataKey="month" 
                stroke="hsl(var(--muted-foreground))"
                fontSize={12}
              />
              <YAxis 
                stroke="hsl(var(--muted-foreground))"
                fontSize={12}
                tickFormatter={(value) => `$${value}`}
              />
              <Tooltip 
                formatter={(value) => [`$${value}`, 'Revenue']}
                labelStyle={{ color: 'hsl(var(--foreground))' }}
                contentStyle={{ 
                  backgroundColor: 'hsl(var(--card))',
                  border: '1px solid hsl(var(--border))',
                  borderRadius: '8px'
                }}
              />
              <Line 
                type="monotone" 
                dataKey="revenue" 
                stroke="#8b4513" 
                strokeWidth={3}
                dot={{ fill: '#8b4513', strokeWidth: 2, r: 4 }}
                activeDot={{ r: 6, stroke: '#8b4513', strokeWidth: 2 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Daily Orders This Week */}
        <Card>
          <CardHeader>
            <CardTitle>Daily Orders This Week</CardTitle>
            <CardDescription>Orders and revenue by day of the week</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={250}>
              <BarChart data={dailyOrdersData}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                <XAxis 
                  dataKey="day" 
                  stroke="hsl(var(--muted-foreground))"
                  fontSize={12}
                />
                <YAxis 
                  stroke="hsl(var(--muted-foreground))"
                  fontSize={12}
                />
                <Tooltip 
                  formatter={(value, name) => [value, name === 'orders' ? 'Orders' : 'Revenue ($)']}
                  labelStyle={{ color: 'hsl(var(--foreground))' }}
                  contentStyle={{ 
                    backgroundColor: 'hsl(var(--card))',
                    border: '1px solid hsl(var(--border))',
                    borderRadius: '8px'
                  }}
                />
                <Bar 
                  dataKey="orders" 
                  fill="#8b4513" 
                  radius={[4, 4, 0, 0]}
                />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Sales by Category */}
        <Card>
          <CardHeader>
            <CardTitle>Sales by Category</CardTitle>
            <CardDescription>Revenue distribution across product categories</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={250}>
              <PieChart>
                <Pie
                  data={categoryData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={100}
                  paddingAngle={5}
                  dataKey="value"
                  label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                  labelLine={false}
                >
                  {categoryData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip 
                  formatter={(value) => [`${value}%`, 'Share']}
                  labelStyle={{ color: 'hsl(var(--foreground))' }}
                  contentStyle={{ 
                    backgroundColor: 'hsl(var(--card))',
                    border: '1px solid hsl(var(--border))',
                    borderRadius: '8px'
                  }}
                />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Key Metrics Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="text-center">
              <p className="text-2xl font-bold text-coffee-dark">24.5%</p>
              <p className="text-sm text-muted-foreground">Conversion Rate</p>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="text-center">
              <p className="text-2xl font-bold text-coffee-dark">$78.50</p>
              <p className="text-sm text-muted-foreground">Avg Order Value</p>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="text-center">
              <p className="text-2xl font-bold text-coffee-dark">3.2</p>
              <p className="text-sm text-muted-foreground">Orders per Customer</p>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="text-center">
              <p className="text-2xl font-bold text-coffee-dark">86%</p>
              <p className="text-sm text-muted-foreground">Customer Satisfaction</p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
export default function AdminDashboard() {
  const stats = [
    { name: 'Total Revenue', value: '$12,450', trend: '+12%' },
    { name: 'Active Subscriptions', value: '18', trend: '+2' },
    { name: 'Pending Invoices', value: '7', trend: '-1' },
    { name: 'Service Requests', value: '4', trend: 'New' },
  ];

  return (
    <div className="space-y-8">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {stats.map((stat) => (
          <div key={stat.name} className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
            <h3 className="text-gray-500 text-sm font-medium mb-1">{stat.name}</h3>
            <div className="flex items-end justify-between">
              <p className="text-2xl font-bold text-navy-900">{stat.value}</p>
              <span className={`text-xs font-bold px-2 py-1 rounded-full ${stat.trend.startsWith('+') ? 'bg-green-100 text-green-700' : 'bg-blue-100 text-blue-700'}`}>
                {stat.trend}
              </span>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100">
          <div className="p-6 border-b border-gray-100">
            <h3 className="text-lg font-bold text-navy-900">Recent Service Bookings</h3>
          </div>
          <div className="p-6">
            <p className="text-gray-400 text-center py-8">No recent bookings to display.</p>
          </div>
        </div>
        
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100">
          <div className="p-6 border-b border-gray-100">
            <h3 className="text-lg font-bold text-navy-900">Overdue Invoices</h3>
          </div>
          <div className="p-6">
            <p className="text-gray-400 text-center py-8">All invoices are up to date.</p>
          </div>
        </div>
      </div>
    </div>
  );
}

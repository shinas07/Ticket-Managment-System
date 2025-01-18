const StatsCard = ({ title, value, icon: Icon, trend, color }) => {
    const colors = {
      blue: 'bg-blue-500',
      green: 'bg-green-500',
      yellow: 'bg-yellow-500',
      purple: 'bg-purple-500'
    };
  
    return (
      <div className="bg-white rounded-lg shadow p-6">
        <div className="flex items-center">
          <div className={`${colors[color]} rounded-full p-3`}>
            <Icon className="h-6 w-6 text-white" />
          </div>
          <div className="ml-5">
            <p className="text-sm font-medium text-gray-500 truncate">
              {title}
            </p>
            <p className="mt-1 text-3xl font-semibold text-gray-900">
              {value}
            </p>
          </div>
        </div>
        <div className="mt-4">
          <div className="flex items-center">
            <span className="text-green-500 text-sm font-medium">
              {trend}
            </span>
            <span className="ml-2 text-sm text-gray-500">
              from last month
            </span>
          </div>
        </div>
      </div>
    );
  };
  
  export default StatsCard;
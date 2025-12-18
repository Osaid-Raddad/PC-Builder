import { useState, useEffect } from 'react';
import { MdStore, MdSupport, MdArticle, MdPeople } from 'react-icons/md';
import { Line, Bar } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend
} from 'chart.js';
import StatsCard from '../../components/admin/StatsCard';
import colors from '../../config/colors';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend
);

const Overview = () => {
  const [stats, setStats] = useState({
    pendingShops: 12,
    pendingSupport: 8,
    totalPosts: 145,
    totalUsers: 1250
  });

  const chartData = {
    labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
    datasets: [
      {
        label: 'Users',
        data: [650, 750, 890, 1020, 1150, 1250],
        borderColor: colors.mainYellow,
        backgroundColor: `${colors.mainYellow}40`,
        tension: 0.4,
        pointBackgroundColor: colors.mainYellow,
        pointBorderColor: colors.mainBlack,
        pointBorderWidth: 2,
      }
    ]
  };

  const barData = {
    labels: ['Shops', 'Tech Support', 'Posts', 'Users'],
    datasets: [
      {
        label: 'Activity',
        data: [45, 28, 89, 125],
        backgroundColor: [
          colors.mainYellow,
          colors.alabaster,
          colors.platinum,
          colors.jet
        ],
        borderColor: colors.mainBlack,
        borderWidth: 1,
      }
    ]
  };

  return (
    <div className="space-y-6">
      {/* Page Title */}
      <div>
        <h1 className="text-3xl font-bold" style={{ color: colors.mainBlack }}>
          Dashboard Overview
        </h1>
        <p style={{ color: colors.jet }} className="mt-1">
          Welcome back! Here's what's happening today.
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatsCard
          title="Pending Shop Requests"
          value={stats.pendingShops}
          icon={MdStore}
          trend="up"
          trendValue={12}
        />
        <StatsCard
          title="Pending Support Tickets"
          value={stats.pendingSupport}
          icon={MdSupport}
          trend="down"
          trendValue={5}
        />
        <StatsCard
          title="Total Posts"
          value={stats.totalPosts}
          icon={MdArticle}
          trend="up"
          trendValue={8}
        />
        <StatsCard
          title="Total Users"
          value={stats.totalUsers}
          icon={MdPeople}
          trend="up"
          trendValue={15}
        />
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div 
          className="rounded-xl shadow-lg p-6 border-2"
          style={{ 
            backgroundColor: '#FFFFFF',
            borderColor: colors.mainYellow
          }}
        >
          <h3 className="text-xl font-semibold mb-4" style={{ color: colors.mainBlack }}>
            User Growth
          </h3>
          <Line data={chartData} options={{ maintainAspectRatio: true }} />
        </div>

        <div 
          className="rounded-xl shadow-lg p-6 border-2"
          style={{ 
            backgroundColor: '#FFFFFF',
            borderColor: colors.mainYellow
          }}
        >
          <h3 className="text-xl font-semibold mb-4" style={{ color: colors.mainBlack }}>
            Platform Activity
          </h3>
          <Bar data={barData} options={{ maintainAspectRatio: true }} />
        </div>
      </div>

      {/* Recent Activity */}
      <div 
        className="rounded-xl shadow-lg p-6 border-2"
        style={{ 
          backgroundColor: '#FFFFFF',
          borderColor: colors.mainYellow
        }}
      >
        <h3 className="text-xl font-semibold mb-4" style={{ color: colors.mainBlack }}>
          Recent Activity
        </h3>
        <div className="space-y-3">
          {[
            { action: 'New shop request from TechStore', time: '2 minutes ago', type: 'shop' },
            { action: 'Support ticket #1234 resolved', time: '15 minutes ago', type: 'support' },
            { action: 'New post published by User123', time: '1 hour ago', type: 'post' },
            { action: 'New user registration', time: '2 hours ago', type: 'user' }
          ].map((activity, index) => (
            <div 
              key={index} 
              className="flex items-center justify-between p-3 rounded-lg hover:shadow-md transition-all border"
              style={{ 
                backgroundColor: colors.mainBeige,
                borderColor: colors.platinum
              }}
            >
              <div>
                <p className="font-medium" style={{ color: colors.mainBlack }}>
                  {activity.action}
                </p>
                <p className="text-sm" style={{ color: colors.jet }}>
                  {activity.time}
                </p>
              </div>
              <span 
                className="px-3 py-1 rounded-full text-xs font-semibold"
                style={{ 
                  backgroundColor: colors.mainYellow,
                  color: colors.mainBlack
                }}
              >
                {activity.type}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Overview;

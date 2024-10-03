import React, { useState, useEffect } from 'react';
//import { analytics } from '../../config/firebase';
import './AnalyticsPage.css'; 
import { Bar } from 'react-chartjs-2'; // Import Chart.js for bar chart
import 'chart.js/auto'; // Automatically import required chart components

const AnalyticsPage = () => {
  const [userCount, setUserCount] = useState(0);
  const [pageViews, setPageViews] = useState(0);
  const [activeUsers, setActiveUsers] = useState(0);
  const [timeRange, setTimeRange] = useState('all'); // Default time range
  //const [topPages, setTopPages] = useState([]);

  const [chartData, setChartData] = useState({
    labels: [],
    datasets: []
  });

  useEffect(() => {
    const fetchAnalyticsData = async () => {
      
      //analytics.getAnalyticsData gets the analytics data, not sure what to use for

      // Mocking data fetching (replace this with real Google Analytics reporting API logic)
      const mockData = {
        totalUsers: 1000,
        totalPageViews: 5000,
        activeUsers: 200,
        pages: [
          { title: 'Home', views: 1000 },
          { title: 'About Us', views: 800 },
          { title: 'Contributors', views: 500 },
          { title: 'Mathematics', views: 1200 },
          { title: 'Technology', views: 1500 },
        ]
      };

      setUserCount(mockData.totalUsers);
      setPageViews(mockData.totalPageViews);
      setActiveUsers(mockData.activeUsers);
      //setTopPages(mockData.pages);

      // Generate data for bar chart
      const pageTitles = mockData.pages.map(page => page.title);
      const pageViewsData = mockData.pages.map(page => page.views);

      setChartData({
        labels: pageTitles,
        datasets: [
          {
            label: 'Page Views',
            data: pageViewsData,
            backgroundColor: 'rgba(75, 192, 192, 0.6)',
            borderColor: 'rgba(75, 192, 192, 1)',
            borderWidth: 1
          }
        ]
      });
    };

    fetchAnalyticsData();
  }, [timeRange]);

  // Handle time range change
  const handleTimeRangeChange = (range) => {
    setTimeRange(range);
    // Here, you'd add logic to fetch analytics data based on the time range.
    // Example: If range is '30days', fetch data only for the past 30 days.
  };

  return (
    <div className="analytics-page">
      <h1>Analytics Dashboard</h1>
      
      <div className="analytics-overview">
        <div className="analytics-card">
          <h2>Total Users</h2>
          <p>{userCount}</p>
        </div>

        <div className="analytics-card">
          <h2>Total Page Views</h2>
          <p>{pageViews}</p>
        </div>

        <div className="analytics-card">
          <h2>Active Users</h2>
          <p>{activeUsers}</p>
        </div>
      </div>

      
        <div className="time-range-buttons">
        <button onClick={() => handleTimeRangeChange('all')}>All Data</button>
        <button onClick={() => handleTimeRangeChange('90days')}>Last 90 Days</button>
        <button onClick={() => handleTimeRangeChange('30days')}>Last 30 Days</button>
        <button onClick={() => handleTimeRangeChange('today')}>Today</button>
      </div>

      
      <div className="chart-container">
        <h2>Page Views by Page</h2>
        <Bar data={chartData} />
      </div>
    </div>
  );
};

export default AnalyticsPage;

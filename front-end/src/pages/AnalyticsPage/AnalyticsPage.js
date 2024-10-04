import React, { useState, useEffect } from 'react';
import './AnalyticsPage.css';
import { Bar } from 'react-chartjs-2';
import 'chart.js/auto';
import { db } from '../../config/firebase';
import {
  collection,
  getDocs,
  query,
  where,
  Timestamp,
} from 'firebase/firestore';

const AnalyticsPage = () => {
  const [userCount, setUserCount] = useState(0);
  const [pageViews, setPageViews] = useState(0);
  // Uncomment if you decide to use activeUsers
  // const [activeUsers, setActiveUsers] = useState(0);
  const [chartData, setChartData] = useState({
    labels: [],
    datasets: [],
  });
  const [timeRange, setTimeRange] = useState('all'); // Default time range

  useEffect(() => {
    const fetchAnalyticsData = async () => {
      try {
        // Fetch total users count
        const usersSnapshot = await getDocs(collection(db, 'users'));
        setUserCount(usersSnapshot.size);

        // Determine the start date based on the selected time range
        let startDate;
        const today = new Date();
        if (timeRange === 'today') {
          startDate = new Date(today.getFullYear(), today.getMonth(), today.getDate());
        } else if (timeRange === '7days') {
          startDate = new Date(today.getTime() - 6 * 24 * 60 * 60 * 1000);
        } else if (timeRange === '30days') {
          startDate = new Date(today.getTime() - 29 * 24 * 60 * 60 * 1000);
        } else {
          startDate = new Date(0); // All time
        }
        const startTimestamp = Timestamp.fromDate(startDate);

        // Fetch total page views within the time range
        const totalViewsCollection = collection(db, 'analytics', 'totalPageViews', 'viewsPerDay');
        const totalViewsQuery = query(totalViewsCollection, where('date', '>=', startTimestamp));
        const totalViewsSnapshot = await getDocs(totalViewsQuery);

        let totalPageViews = 0;
        totalViewsSnapshot.forEach((doc) => {
          totalPageViews += doc.data().count;
        });
        setPageViews(totalPageViews);

        // Fetch active users if you decide to use it
        /*
        const usersCollection = collection(db, 'users');
        const activeUsersQuery = query(usersCollection, where('lastActive', '>=', startTimestamp));
        const activeUsersSnapshot = await getDocs(activeUsersQuery);
        setActiveUsers(activeUsersSnapshot.size);
        */

        // Fetch page views per page within the time range
        const pagesCollection = collection(db, 'analytics', 'pages');
        const pagesSnapshot = await getDocs(pagesCollection);

        const pagesData = [];
        for (const pageDoc of pagesSnapshot.docs) {
          const pageName = pageDoc.id;
          const viewsPerDayCollection = collection(db, 'analytics', 'pages', pageName, 'viewsPerDay');
          const viewsPerDayQuery = query(viewsPerDayCollection, where('date', '>=', startTimestamp));
          const viewsPerDaySnapshot = await getDocs(viewsPerDayQuery);

          let pageTotalViews = 0;
          viewsPerDaySnapshot.forEach((doc) => {
            pageTotalViews += doc.data().views;
          });

          if (pageTotalViews > 0) {
            pagesData.push({ title: pageName, views: pageTotalViews });
          }
        }

        // Sort pages by views descending
        pagesData.sort((a, b) => b.views - a.views);

        // Prepare data for the chart
        const pageTitles = pagesData.map((page) => page.title);
        const pageViewsData = pagesData.map((page) => page.views);

        setChartData({
          labels: pageTitles,
          datasets: [
            {
              label: 'Page Views',
              data: pageViewsData,
              backgroundColor: 'rgba(75, 192, 192, 0.6)',
              borderColor: 'rgba(75, 192, 192, 1)',
              borderWidth: 1,
            },
          ],
        });
      } catch (error) {
        console.error('Error fetching analytics data:', error);
      }
    };

    fetchAnalyticsData();
  }, [timeRange]);

  // Handle time range change
  const handleTimeRangeChange = (range) => {
    setTimeRange(range);
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

        {/* Uncomment if you decide to display activeUsers */}
        {/* <div className="analytics-card">
          <h2>Active Users</h2>
          <p>{activeUsers}</p>
        </div> */}
      </div>

      <div className="time-range-buttons">
        <button
          className={timeRange === 'all' ? 'active' : ''}
          onClick={() => handleTimeRangeChange('all')}
        >
          All Time
        </button>
        <button
          className={timeRange === '30days' ? 'active' : ''}
          onClick={() => handleTimeRangeChange('30days')}
        >
          Last 30 Days
        </button>
        <button
          className={timeRange === '7days' ? 'active' : ''}
          onClick={() => handleTimeRangeChange('7days')}
        >
          Last 7 Days
        </button>
        <button
          className={timeRange === 'today' ? 'active' : ''}
          onClick={() => handleTimeRangeChange('today')}
        >
          Today
        </button>
      </div>

      <div className="chart-container">
        <h2>Page Views by Page</h2>
        {chartData.labels.length > 0 ? (
          <Bar data={chartData} />
        ) : (
          <p>No data available for the selected time range.</p>
        )}
      </div>
    </div>
  );
};

export default AnalyticsPage;

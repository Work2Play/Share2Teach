import React, { useState, useEffect } from 'react';
import { db } from '../../config/firebase'; // Firebase configuration
import './AnalyticsPage.css';
import { getDocs, collection, query, where, Timestamp } from 'firebase/firestore';
import { Chart } from 'chart.js/auto'; // Import Chart.js for the bar chart

const AnalyticsPage = () => {
  const [userCount, setUserCount] = useState(0);
  const [pageViews, setPageViews] = useState(0);
  const [activeUsers, setActiveUsers] = useState(0);
  const [filter, setFilter] = useState('all'); // Filter state for all, 90 days, 30 days, today

  useEffect(() => {
    const fetchAnalyticsData = async () => {
      try {
        // Fetch total users
        const usersCollectionRef = collection(db, "users");
        const userDocs = await getDocs(usersCollectionRef);
        setUserCount(userDocs.size); // Total number of users

        // Fetch total page views
        const pageViewsCollectionRef = collection(db, "pageViews");
        const pageViewsDocs = await getDocs(pageViewsCollectionRef);
        setPageViews(pageViewsDocs.size); // Total number of page views (count of documents)

        // Fetch active users (users who were active within the last 30 minutes)
        const thirtyMinutesAgo = Timestamp.now().toMillis() - 30 * 60 * 1000;
        const activeUsersQuery = query(
          collection(db, "activeUsers"),
          where("lastActive", ">", Timestamp.fromMillis(thirtyMinutesAgo))
        );
        const activeUsersDocs = await getDocs(activeUsersQuery);
        setActiveUsers(activeUsersDocs.size); // Count active users

        // Fetch top pages and filter based on the selected time period
        const filteredViews = filterPageViewsByTime(pageViewsDocs.docs, filter);
        const topPagesData = calculateTopPages(filteredViews);

        // Render chart
        renderChart(topPagesData);
      } catch (err) {
        console.error("Error fetching analytics data: ", err);
      }
    };

    fetchAnalyticsData();
  }, [filter]);

  // Helper function to filter page views by time
  const filterPageViewsByTime = (pageViewsDocs, filter) => {
    const now = new Date();
    return pageViewsDocs.filter((doc) => {
      const pageViewDate = new Date(doc.data().timestamp.toMillis()); // Assuming page views have a 'timestamp' field
      if (filter === 'today') {
        return pageViewDate.toDateString() === now.toDateString();
      } else if (filter === '30days') {
        const thirtyDaysAgo = new Date(now.setDate(now.getDate() - 30));
        return pageViewDate >= thirtyDaysAgo;
      } else if (filter === '90days') {
        const ninetyDaysAgo = new Date(now.setDate(now.getDate() - 90));
        return pageViewDate >= ninetyDaysAgo;
      } else {
        return true; // For 'all', return all records
      }
    });
  };

  // Helper function to calculate top pages
  const calculateTopPages = (pageViewsDocs) => {
    const pageViewCounts = {};
    pageViewsDocs.forEach((doc) => {
      const page = doc.data().page;
      if (pageViewCounts[page]) {
        pageViewCounts[page] += 1;
      } else {
        pageViewCounts[page] = 1;
      }
    });
    const topPagesArray = Object.entries(pageViewCounts).map(([page, views]) => ({ page, views }));
    topPagesArray.sort((a, b) => b.views - a.views);
    return topPagesArray;
  };

  // Render the bar chart using Chart.js
  const renderChart = (topPagesData) => {
    const ctx = document.getElementById('topPagesChart').getContext('2d');
    new Chart(ctx, {
      type: 'bar',
      data: {
        labels: topPagesData.map((page) => page.page),
        datasets: [{
          label: 'Page Views',
          data: topPagesData.map((page) => page.views),
          backgroundColor: 'rgba(75, 192, 192, 0.2)',
          borderColor: 'rgba(75, 192, 192, 1)',
          borderWidth: 1,
        }],
      },
      options: {
        scales: {
          y: {
            beginAtZero: true,
          },
        },
      },
    });
  };

  return (
    <div className="analytics-page">
      <h1>Analytics Dashboard</h1>

      <div className="filter-buttons">
        <button
          className={filter === 'all' ? 'selected' : ''}
          onClick={() => setFilter('all')}
        >
          All Data
        </button>
        <button
          className={filter === '90days' ? 'selected' : ''}
          onClick={() => setFilter('90days')}
        >
          Last 90 Days
        </button>
        <button
          className={filter === '30days' ? 'selected' : ''}
          onClick={() => setFilter('30days')}
        >
          Last 30 Days
        </button>
        <button
          className={filter === 'today' ? 'selected' : ''}
          onClick={() => setFilter('today')}
        >
          Today
        </button>
      </div>

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

      <div className="top-pages-section">
        <h2>Top Pages</h2>
        <canvas id="topPagesChart" width="400" height="200"></canvas>
      </div>
    </div>
  );
};

export default AnalyticsPage;

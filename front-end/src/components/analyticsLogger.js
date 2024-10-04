// src/utils/trackAnalytics.js

import { getFirestore, doc, updateDoc, FieldValue } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';

// Function to track page views
export const trackPageView = async (pageName) => {
  const db = getFirestore();
  const analyticsDoc = doc(db, 'analytics', 'site');

  try {
    await updateDoc(analyticsDoc, {
      [`pageViews.${pageName}`]: FieldValue.increment(1),
      totalPageViews: FieldValue.increment(1),
    });
  } catch (error) {
    console.error('Error tracking page view:', error);
  }
};

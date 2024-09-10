//importing basic react stuff
import React from 'react'
import "./DocActions.css"

//importing ability to change database
import { doc, updateDoc } from 'firebase/firestore';

//functionality to make use of the docs
import { db } from '../config/firebase';

//creating star ratings
export function RatingReview({ rating }) {
  const fullStars = Math.floor(rating);
  const decimalPart = rating - fullStars;

  return (
    <div>
      {[...Array(5)].map((_, index) => {
        const starValue = index + 1;

        if (starValue <= fullStars) {
          // Full star
          return (
            <span key={starValue} className="star" style={{ color: 'gold', fontSize: '35px' }}>
              ★
            </span>
          );
        } else if (starValue === fullStars + 1) {
          // Partially filled star (handle all decimal values)
          return (
            <span key={starValue} className="star" style={{ fontSize: '35px', position: 'relative' }}>
              <span style={{ color: 'gold', position: 'absolute', left: 0, top: 0, width: `${decimalPart * 100}%`, overflow: 'hidden' }}>
                ★
              </span>
              <span style={{ color: 'gray' }}>★</span> 
            </span>
          );
        } else {
          // Empty star
          return (
            <span key={starValue} className="star" style={{ color: 'gray', fontSize: '35px' }}>
              ★
            </span>
          );
        }
      })}
      <span>{rating}</span>
    </div>
  );
}

//a function that allows the creation of a popup
function ratingPopUp() {
  const ratingInput = document.getElementById('ratingInput');
  const rateButton = document.getElementById('rateButton');

  // Set attributes for the spin edit
  ratingInput.min = 1;
  ratingInput.max = 5;
  ratingInput.step = 0.1;

  // Event listener for rating input
  ratingInput.addEventListener('input', () => {
    let value = ratingInput.value.replace(/[^0-9.]/g, '');
    value = Math.max(1, Math.min(5, parseFloat(value) || 3));
    ratingInput.value = value;
  });

  // Event listener for rate button
  rateButton.addEventListener('click', () => {
    const rating = parseFloat(ratingInput.value);
    if (window.opener) {
      window.opener.postMessage(rating, '*');
    }
    window.close();
  });
}

export function DocumentActions({ document, oneCollection, docMain, twoCollection }) {

  const doRating = async () => {
    try {
      const popupContent = `
        <!DOCTYPE html>
  <html>
  <head>
    <title>Rate Us</title>
    <style>
      body {
        font-family: sans-serif;
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        min-height: 100vh;
        margin: 0;
        background-color: #f0f0f0;
      }

      #ratingInput {
        padding: 10px;
        margin-bottom: 15px;
        border: 1px solid #ccc;
        border-radius: 5px;
        width: 80%;
        text-align: center;
      }

      .rateButton {
        background-color: #4CAF50; /* Green */
        border: none;
        color: white;
        padding: 10px 20px;
        text-align: center;
        text-decoration: none;
        display: inline-block;
        font-size: 16px;
        border-radius: 5px;
        cursor: pointer;
      }
    </style>
  </head>
  <body>
    <h2>Rate Document</h2>
    <input type="number" id="ratingInput" min="1" max="5" step="0.5" />
    <button id="rateButton" class="rateButton">Rate</button> 
    <script>
      ${ratingPopUp.toString()} 
      ratingPopUp(); 
    </script>
  </body>
  </html>
`;

      const screenWidth = window.screen.width;
      const screenHeight = window.screen.height;
      const popupWidth = 300;
      const popupHeight = 300;
      const left = (screenWidth - popupWidth) / 2;
      const top = (screenHeight - popupHeight) / 2;

      // Open the popup
      const popupWindow = window.open('', 'Popup Window', `width=${popupWidth},height=${popupHeight},left=${left},top=${top}`);
      popupWindow.document.write(popupContent);

      // Return a promise that resolves when the message is received
      return new Promise((resolve, reject) => {
        const handleMessage = (event) => {
          if (event.source === popupWindow) {
            popupWindow.close();
            window.removeEventListener('message', handleMessage);
            resolve(event.data);
          }
        };

        window.addEventListener('message', handleMessage);
      });
    } catch (err) {
      console.error(err);
    }
  };

  // Handler function for rating
  const handleRating = async () => {
    try {
      const rating = await doRating();

      // Ensure we have a rating before updating
      if (rating != null) {
        const docRef = doc(db, oneCollection, docMain, twoCollection, document.id);

        // Calculate new rating
        const tempRate = document.rating;
        const tempAmount = document.ratingAmount;
        const tempTotal = tempRate * tempAmount;
        const newAverageRating = (tempTotal + rating) / (tempAmount + 1);

        // Update Firestore
        await updateDoc(docRef, {
          rating: newAverageRating,
          ratingAmount: tempAmount + 1
        });

        console.log('Document successfully updated');

        // reloading page toi update database
        window.location.reload();
      }
    } catch (err) {
      console.error('Error updating document:', err);
    }
  };

  //the code to report a document
  const handleReport = async () => {
    try {
      const docRef = doc(db, oneCollection, docMain, twoCollection, document.id);
      const tempAmount = document.reportAmount;

      await updateDoc(docRef, {
        reportAmount: tempAmount + 1
      });

      console.log('Document successfully reported');

      // reloading page toi update database
      window.location.reload();
    }catch(err) {
      console.error(err)
    }
  }
  return(
    <div>
      <button className="RateButton" onClick={handleRating}>Rate</button>
      <button className="ReportButton" onClick={handleReport}>Report</button>
    </div>
  )
}


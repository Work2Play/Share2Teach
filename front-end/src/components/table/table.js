import React from 'react';

//importing the rating and report button
import { RatingReview, DocumentActions } from '../../components/DocActions';
import "./table.css";

export function CreateTable({ resources, collectionOne, mainDoc, CollectionTwo }) { 
    // Function to round a number to a specified number of decimal places
    const roundToDecimalPlaces = (number, decimalPlaces) => {
        return Number(number.toFixed(decimalPlaces));
    };

    return (
        <div className="theTable">
            <table className="resource-table">
                <thead>
                    <tr>
                        <th>Title</th>
                        <th>Last Modified Date</th>
                        <th>Last Modified User</th>
                        <th>Rating</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                {resources.map((resource) => {
                    // Round the rating to 2 decimal places for display
                    const displayRating = roundToDecimalPlaces(resource.rating, 2);
                    return (
                        <tr key={resource.id}>
                                <td>
                                    <a href={resource.file_url} target="_blank" rel="noopener noreferrer">{resource.title}</a>
                                </td>
                            
                            <td>{resource.dateMod}</td>
                            <td>{resource.userMod}</td>
                            <td><RatingReview rating={displayRating} /></td>
                            <td>
                            <DocumentActions 
                                document={resource} 
                                oneCollection={collectionOne} 
                                docMain={mainDoc} 
                                twoCollection={CollectionTwo}
                            />
                            </td>
                        </tr>
                    );
                 })}
                </tbody>
            </table>
        </div>
    );
}
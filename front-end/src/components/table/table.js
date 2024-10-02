import React, { useState } from 'react';
import { RatingReview, DocumentActions } from '../../components/DocActions';
import "./table.css";

export function CreateTable({ resources, collectionOne, mainDoc, CollectionTwo }) {
    // State to store filter values
    const [titleFilter, setTitleFilter] = useState('');
    const [tagsFilter, setTagsFilter] = useState('');
    const [userFilter, setUserFilter] = useState('');
    const [ratingFilter, setRatingFilter] = useState('');
    const [searchTerm, setSearchTerm] = useState(''); // For overall search
    const [sortConfig, setSortConfig] = useState({ key: '', direction: '' }); // For sorting

    // Function to round a number to a specified number of decimal places
    const roundToDecimalPlaces = (number, decimalPlaces) => {
        return Number(number.toFixed(decimalPlaces));
    };

    // Function to handle sorting
    const sortResources = (resources) => {
        if (sortConfig.key) {
            return [...resources].sort((a, b) => {
                const aVal = a[sortConfig.key];
                const bVal = b[sortConfig.key];

                if (aVal < bVal) {
                    return sortConfig.direction === 'ascending' ? -1 : 1;
                }
                if (aVal > bVal) {
                    return sortConfig.direction === 'ascending' ? 1 : -1;
                }
                return 0;
            });
        }
        return resources;
    };

    // Function to handle the filtering logic
    const filterResources = (resource) => {
        const titleMatches = resource.title.toLowerCase().includes(titleFilter.toLowerCase());
        const tagsMatches = resource.tags ? resource.tags.join(', ').toLowerCase().includes(tagsFilter.toLowerCase()) : true;
        const userMatches = resource.userID.toLowerCase().includes(userFilter.toLowerCase());
        const ratingMatches = resource.rating ? resource.rating.toString().startsWith(ratingFilter) : true;

        const overallMatches = (
            resource.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
            (resource.tags && resource.tags.join(', ').toLowerCase().includes(searchTerm.toLowerCase())) ||
            resource.userID.toLowerCase().includes(searchTerm.toLowerCase())
        );

        return titleMatches && tagsMatches && userMatches && ratingMatches && overallMatches;
    };

    // Handle sorting when the header is clicked
    const requestSort = (key) => {
        let direction = 'ascending';
        if (sortConfig.key === key && sortConfig.direction === 'ascending') {
            direction = 'descending';
        }
        setSortConfig({ key, direction });
    };

    const sortedResources = sortResources(resources.filter(filterResources));

    return (
        <div className="theTable">
            {/* Search Bar for overall search */}
            <input 
                type="text" 
                placeholder="Search all fields..." 
                value={searchTerm} 
                onChange={(e) => setSearchTerm(e.target.value)} 
                className="overall-search"
            />
            
            {/* Column filters */}
            <div className="filters">
                <input 
                    type="text" 
                    placeholder="Filter by title" 
                    value={titleFilter} 
                    onChange={(e) => setTitleFilter(e.target.value)} 
                />
                <input 
                    type="text" 
                    placeholder="Filter by tags" 
                    value={tagsFilter} 
                    onChange={(e) => setTagsFilter(e.target.value)} 
                />
                <input 
                    type="text" 
                    placeholder="Filter by user" 
                    value={userFilter} 
                    onChange={(e) => setUserFilter(e.target.value)} 
                />
                <input 
                    type="text" 
                    placeholder="Filter by rating" 
                    value={ratingFilter} 
                    onChange={(e) => setRatingFilter(e.target.value)} 
                />
            </div>

            <table className="resource-table">
                <thead>
                    <tr>
                        <th onClick={() => requestSort('title')}>
                            Title {sortConfig.key === 'title' && (sortConfig.direction === 'ascending' ? '↑' : '↓')}
                        </th>
                        <th onClick={() => requestSort('tags')}>
                            Tags {sortConfig.key === 'tags' && (sortConfig.direction === 'ascending' ? '↑' : '↓')}
                        </th>
                        <th onClick={() => requestSort('modifiedAt')}>
                            Last Modified Date {sortConfig.key === 'modifiedAt' && (sortConfig.direction === 'ascending' ? '↑' : '↓')}
                        </th>
                        <th onClick={() => requestSort('userID')}>
                            Last Modified User {sortConfig.key === 'userID' && (sortConfig.direction === 'ascending' ? '↑' : '↓')}
                        </th>
                        <th onClick={() => requestSort('rating')}>
                            Rating {sortConfig.key === 'rating' && (sortConfig.direction === 'ascending' ? '↑' : '↓')}
                        </th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                {sortedResources.map((resource) => {
                    const displayRating = roundToDecimalPlaces(resource.rating, 1);
                    return (
                        <tr key={resource.id}>
                            <td>
                                <a href={resource.file_url} target="_blank" rel="noopener noreferrer">{resource.title}</a>
                            </td>
                            {resource.tags != null ? (
                                <td> {resource.tags.join(', ')}</td>
                            ) : (
                                <td> {" "}</td>
                            )}
                            <td>{resource.modifiedAt ? resource.modifiedAt.toDate().toLocaleString() : 'N/A'}</td>
                            <td>{resource.userID}</td>
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

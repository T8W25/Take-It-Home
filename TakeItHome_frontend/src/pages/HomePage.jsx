import React, { useState } from 'react';
import SearchBar from '../components/SearchBar';  // Import the SearchBar component

const HomePage = () => {
  const [searchResults, setSearchResults] = useState([]);
  const [allItems, setAllItems] = useState([  // Example list of items to search from
    { name: 'Laptop', category: 'Electronics' },
    { name: 'Chair', category: 'Furniture' },
    { name: 'Jacket', category: 'Clothing' },
    { name: 'Book', category: 'Books' },
    { name: 'Football', category: 'Sports' }
  ]);

  // Handle search functionality
  const handleSearch = (searchTerm, category, condition) => {
    console.log("Search term:", searchTerm, "Category:", category, "Condition:", condition);

    // Filter items based on the search term, category, and condition (if applicable)
    const filteredResults = allItems.filter(item => {
      return (
        (searchTerm ? item.name.toLowerCase().includes(searchTerm.toLowerCase()) : true) &&
        (category ? item.category === category : true)
      );
    });

    // Update the search results
    setSearchResults(filteredResults);
  };

  return (
    <div className="home-page">
      <h1>Welcome to Take-It-Home!</h1>
      
      {/* Add the SearchBar to HomePage and pass the handleSearch function */}
      <SearchBar onSearch={handleSearch} />
      
      {/* Display search results */}
      <div className="search-results">
        {searchResults.length > 0 ? (
          <ul>
            {searchResults.map((item, index) => (
              <li key={index}>{item.name} - {item.category}</li>  // Example display format
            ))}
          </ul>
        ) : (
          <p>No results found</p>
        )}
      </div>
    </div>
  );
};

export default HomePage;

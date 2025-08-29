// components/UpdatedAutoComplete.jsx
import { useState, useEffect, useRef } from "react";
import { apiService } from "../services/api.js";

function UpdatedAutoComplete() {
    const [input, setInput] = useState("");
    const [filteredSuggestions, setFilteredSuggestions] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [showSuggestions, setShowSuggestions] = useState(false);
    const debounceRef = useRef(null);
    const inputRef = useRef(null);

    const handleChange = (e) => {
        const value = e.target.value;
        setInput(value);

        if (value.trim() === "") {
            setFilteredSuggestions([]);
            setShowSuggestions(false);
            return;
        }

        // Debounce the search
        if (debounceRef.current) {
            clearTimeout(debounceRef.current);
        }

        debounceRef.current = setTimeout(async () => {
            setIsLoading(true);
            try {
                const results = await apiService.searchMovies(value.trim());
                setFilteredSuggestions(results.slice(0, 8)); // Limit to 8 results
                setShowSuggestions(true);
            } catch (error) {
                console.error('Search error:', error);
                setFilteredSuggestions([]);
            } finally {
                setIsLoading(false);
            }
        }, 300); // 300ms debounce
    };

    const handleSuggestionClick = (movie) => {
        setInput("");
        setFilteredSuggestions([]);
        setShowSuggestions(false);
        
        // Navigate to movie page
        const movieSlug = movie.name.toLowerCase().replace(/\s+/g, "-");
        const etno = movie.etno.toUpperCase().replace(/\s+/g, "-");
        window.location.href = `/home/${movieSlug}/${etno}`;
    };

    const handleBlur = () => {
        // Delay hiding suggestions to allow clicks
        setTimeout(() => setShowSuggestions(false), 150);
    };

    const handleFocus = () => {
        if (filteredSuggestions.length > 0) {
            setShowSuggestions(true);
        }
    };

    const handleKeyDown = (e) => {
        if (e.key === 'Escape') {
            setShowSuggestions(false);
            inputRef.current?.blur();
        }
    };

    useEffect(() => {
        return () => {
            if (debounceRef.current) {
                clearTimeout(debounceRef.current);
            }
        };
    }, []);

    return (
        <div className="searchBar" style={{ position: 'relative' }}>
            <input
                ref={inputRef}
                type="text"
                value={input}
                onChange={handleChange}
                onBlur={handleBlur}
                onFocus={handleFocus}
                onKeyDown={handleKeyDown}
                placeholder="Search for Movies, Sports, Events, Plays and Activities"
                style={{
                    width: '549px',
                    height: '20px',
                    padding: '6px',
                    border: '2px solid #f3f3ed',
                    marginRight: '120px'
                }}
            />
            
            {(showSuggestions && (filteredSuggestions.length > 0 || isLoading)) && (
                <ul style={{
                    listStyle: "none",
                    margin: 0,
                    padding: 0,
                    position: "absolute",
                    width: "100%",
                    backgroundColor: "white",
                    border: "1px solid #ccc",
                    borderTop: "none",
                    borderRadius: "0 0 4px 4px",
                    boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
                    zIndex: 1000,
                    maxHeight: "300px",
                    overflowY: "auto"
                }}>
                    {isLoading ? (
                        <li style={{
                            padding: "12px 16px",
                            textAlign: "center",
                            color: "#666",
                            fontStyle: "italic"
                        }}>
                            Searching...
                        </li>
                    ) : (
                        filteredSuggestions.map((movie, index) => (
                            <li
                                key={`${movie.id}-${index}`}
                                onClick={() => handleSuggestionClick(movie)}
                                onMouseDown={(e) => e.preventDefault()}
                                style={{
                                    padding: "12px 16px",
                                    cursor: "pointer",
                                    borderBottom: index < filteredSuggestions.length - 1 ? "1px solid #eee" : "none",
                                    display: "flex",
                                    alignItems: "center",
                                    gap: "12px",
                                    transition: "background-color 0.2s"
                                }}
                                onMouseEnter={(e) => e.target.style.backgroundColor = "#f5f5f5"}
                                onMouseLeave={(e) => e.target.style.backgroundColor = "white"}
                            >
                                <div style={{
                                    width: "40px",
                                    height: "60px",
                                    backgroundColor: "#f0f0f0",
                                    borderRadius: "4px",
                                    backgroundImage: movie.src ? `url(/${movie.src})` : 'none',
                                    backgroundSize: "cover",
                                    backgroundPosition: "center",
                                    flexShrink: 0
                                }} />
                                <div style={{ flex: 1 }}>
                                    <div style={{ fontWeight: "500", fontSize: "14px" }}>
                                        {movie.name}
                                    </div>
                                    <div style={{ 
                                        fontSize: "12px", 
                                        color: "#666",
                                        marginTop: "2px"
                                    }}>
                                        {movie.type} • {movie.censor}
                                    </div>
                                </div>
                            </li>
                        ))
                    )}
                </ul>
            )}
        </div>
    );
}

export default UpdatedAutoComplete;
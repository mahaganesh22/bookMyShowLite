import { useState } from "react";
function AutoComplete() {
    const [input, setInput] = useState("");
    const [filterdSuggestions, setFilteredSuggestions] = useState([]);

    const suggestions = [
        "Bombay","Bhairavam","8 Vasatalu", "Return of the Dragon", "Animal", "Andala Rakshasi",
        "Arjun Reddy"
    ];

    const handleChange = (e) => {
        const value = e.target.value;
        setInput(value);

        if (value === "") {
            setFilteredSuggestions([]);
            return;
        }

        const startsWithMatches = suggestions.filter(
            (item) => item.toLowerCase().startsWith(value.toLowerCase())
        ).sort((a,b) => a.localeCompare(b));

        const containsMatches = suggestions.filter(
            (item) => !item.toLowerCase().startsWith(value.toLowerCase()) && 
            item.toLowerCase().includes(value.toLowerCase())
        ).sort((a,b) => a.localeCompare(b));
        

        setFilteredSuggestions([...startsWithMatches, ...containsMatches]);
    }

    const handleSuggestionClick = () => {
        setInput("");
        setFilteredSuggestions([]);
    }


    return (
        <div className="searchBar">
            <input
                type = "text"
                value = {input}
                onChange = {handleChange}
                placeholder = "Search for Movies, Sports, Events, Plays and Activities"
            />
            {/* Initially "input" is null as we defined above where "input" is a state
              value stores "" in it and displays nothing in the input box. when we type 
              in the input box the onChage() function triggers and change the value of "input" 
              which re renders the entire component. Now the "input" has some value in it 
              which we typed and the value stores it and displays in the input box.
              This way value = {input} works in react
            */}
            {setFilteredSuggestions.length > 0 && (
                <ul 
                    style = {{
                        listStyle: "none",
                        margin: 0,
                        padding: 0,
                        position: "absolute",
                        width: "100%",
                        backgroundColor: "white",
                        border: "1px solid #ccc",
                        zIndex: 1,
                    }}
                >
                    {filterdSuggestions.map((suggestion, index) => (
                        <li
                            key = {index}
                            onClick = {() => handleSuggestionClick(suggestion)}
                            style = {{padding : "8px", cursor : "pointer"}}
                            onMouseDown = {(e) => e.preventDefault()}
                        >
                            {suggestion}
                        </li>
                    ))}
                </ul>
            )}
        </div>
    )
}

export default AutoComplete;
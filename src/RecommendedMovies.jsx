/*
    In this website mainly "useParams()" hook is used for the "Routing" where it easier 
    to implement.
*/


import { useState, useRef, useEffect } from "react";
import MoviePoster from "./MoviePoster";
import { Navigate, useNavigate } from "react-router-dom";
import React from "react";
// import movieDesc from "./movieDesc";
// import movies from "./movies";

function RecommendedMovies({moviesDesc}) {

    const navigate = useNavigate();
    // console.log("Challa")
    // console.log(moviesDesc)

    function handleClick (movie) {
        //console.log("Challa")
        const movieSlug = movie.name.toLowerCase().replace(/\s+/g, "-");
        const etno = movie.etno.toUpperCase().replace(/\s+/g, "-");
        navigate(`/home/${movieSlug}/${etno}`)
    }

    return (
        <>
            {
                <div style = {{margin : '30px'}}className="MoviesSection">
                    <h1>Recommended Movies</h1>
                    <div className="Movies">
                        {moviesDesc.map((movie,ind) => (
                            <div 
                                key = {movie.id}
                                className = "movie" 
                                onClick={() => {
                                    handleClick(movie);
                                }}
                            >
                                <img
                                    src = {`/${movie.src}`}
                                    alt = {`movie ${ind + 1}`}
                                />
                                <h3>{movie.name}</h3>
                                <p>{movie.type}</p>
                            </div>
                        ))}
                    </div>
                </div>
            }
        </>
    )
}

export default RecommendedMovies
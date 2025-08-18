import movies from "./movies";
import movieDesc from "./movieDesc";
import { Fragment, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useEffect } from "react";
import { useParams } from "react-router-dom";

function MoviePoster ({movieDetails}) {

    const today = new Date()

    const urlMode = today.getFullYear().toString() +
                  String(today.getMonth() + 1).padStart(2, '0') +
                  String(today.getDate()).padStart(2, '0')
                  

    const navigate = useNavigate();

    const handleTheaterPage = (() => {
        const date = urlMode;
        console.log("date = " + date)
        const movieSlug = movieDetails.name.toLowerCase().replace(/\s+/g, "-");
        const etno = movieDetails.etno.toUpperCase().replace(/\s+/g, "-");
        navigate(`/home/${movieSlug}/buytickets/${etno}/${date}`)
    })
    return(
        <>
            <div className = "moviePoster">
                <div className = "moviePosterImage">
                    <img
                        src = {`/${movieDetails.src}`}
                    />
                </div>
                <div className = "movieDetails">
                    <h1 style={{color : `white`}}>{movieDetails.name}</h1>
                    <div className = "paragraph">
                        <p id = "p1">2D</p>
                        <p id = "p2">Telugu, Tamil, Hindi, Kannada, Malayalam</p>
                    </div>
                    <p id = "p3">
                        {movieDetails.time}
                        {movieDetails.type} 
                        {movieDetails.censor} 
                        {movieDetails.release_date}
                    </p>

                    <button id = "bookButton" type = "button" onClick = {handleTheaterPage}>Book tickets</button>
                </div>
            </div>
            <div>
                <h2 id = "aboutMovie">About the Movie</h2>
                <pre id = "p4">{movieDetails.about_movie}</pre>
            </div>
        </>
    )
}

export default MoviePoster;
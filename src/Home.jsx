/*
    In this website mainly "useParams()" hook is used for the "Routing" where it easier 
    to implement.
*/

import Header from "./Header"
import Panel from "./Panel"
import Advertisement1 from "./Advertisement1"
import RecommendedMovies from "./RecommendedMovies"
import MoviePoster from "./MoviePoster"
import {useState, useEffect, useRef} from "react"
import { useNavigationType, useNavigate, useParams} from "react-router-dom"
// import movieDesc from "./movieDesc"
import TheaterPage from "./TheaterPage"
import SeatsAvailable from "./SeatsAvailable"

function Home() {

    const [selectedMovie, setSelectedMovie] = useState(null);
    const [selectedTheater, setSelectedTheater] = useState(null);
    const [movieDesc, setMovieDesc] = useState([])
    const [movieTheaters, setMovieTheaters] = useState([])

    {
        //This is used to identify whether we navigated forward or backward
        //it also have methods like "POP", "PUSH", "REPLACE" the down one

        //const navigateType = useNavigationType()

        // useEffect(() => {
        //     if (navigateType === "POP") {
        //         setSelectedMovie(null);
        //     }
        // },[navigateType])
    }

    const {movieName, ETNO, currentDate, Code} = useParams();

    // useEffect(() => {
        
    // }, [movieName, ETNO])

    // console.log("useParams = " + movieName + "," + ETNO + "," + Date);
    // console.log("Challa")

    useEffect(() => {
        const fetchData = async() => {
                const response = await fetch("http://localhost:3000")
                const data = await response.json();
                //console.log(data)
                setMovieDesc(data.moviesdata);
                setMovieTheaters(data.movieTheaters)
        }

        fetchData()
    }, [])

    useEffect(() => {

        if (movieName && ETNO) {
            const found = movieDesc.find((m) => 
                m.name.toLowerCase().replace(/\s+/g, "-") === movieName
            )

            //console.log("moviePoster = " + found)

            if (found) {
                setSelectedMovie(found);
            } else {
                setSelectedMovie(null);
            }
        }

    }, [movieDesc, ETNO, movieName, selectedMovie])

    useEffect(() => {
        if (movieName && ETNO && Code) {
            const found = movieDesc.find((m) => 
                m.name.toLowerCase().replace(/\s+/g, "-") === movieName
            )

            console.log("theaterPage = ")
            console.log(found)   

            if (found) {
                const theater = found.theaters.find((t) => 
                    t.theater_id === Code
                )

                if (theater) {
                    // console.log("theater = ")
                    // console.log(theater)
                    setSelectedTheater(theater)
                } else {
                    setSelectedTheater(null)
                }
            }
        }
    }, [movieName, ETNO, Code, selectedMovie, selectedTheater])

    // console.log("movieTheaters = " + movieTheaters.length)
    // console.log(movieTheaters)
    // console.log("movieDesc = " + movieDesc.length)
    // console.log(movieDesc)

    // console.log("SelectedMovie = ")
    // console.log(selectedMovie)

    return (
        <>
            <Header/>
            <Panel/>
            {
                !(movieName && ETNO) && !currentDate && !Code && <>
                    <Advertisement1/>
                    <RecommendedMovies moviesDesc = {movieDesc}/>
                </>
            }
            
            {
                (movieName && ETNO) && !currentDate && !Code && selectedMovie && <MoviePoster movieDetails = {selectedMovie}/>
            }

            {
                (movieName && ETNO && currentDate) && !Code && selectedMovie && <TheaterPage movieDetails = {selectedMovie}/>
            }

            {
                (movieName && ETNO && currentDate && Code) && selectedMovie && selectedTheater && <SeatsAvailable theaterDetails = {selectedTheater}/>
            }
        </>
    )
}

export default Home;

/*
    In this website mainly "useParams()" hook is used for the "Routing" where it easier 
    to implement.
*/


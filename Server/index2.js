import express from "express"
import cors from "cors"
import pg from "pg"
import bodyParser from 'body-parser'

const db = new pg.Client({
    user: "postgres",
    host: "localhost",
    database: "bookMyShowLite",
    password: "Ramarao@456",
    port: 5432
});

let moviesDesc = []
let movieTags = []
let movieTheaters = []
let theaters = []
let isDataLoaded = false; // Flag to track data loading

const app = express();
const port = 3000

app.use(cors({
    origin: 'http://localhost:5173',
    credentials: true
}));

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));

// Initialize database and load data
const initializeDatabase = async () => {
    try {
        await db.connect();
        console.log("Database connected");

        // Load movie tags
        const query1 = `
            SELECT 
                m.id,
                m.name,
                ARRAY_AGG(DISTINCT mt.tag) as tags
            FROM movies m
            JOIN movie_tags mt ON m.id = mt.movie_id
            GROUP BY m.id, m.name
            ORDER BY m.name;
        `;

        const query2 = `Select * from theaters`;
        const query3 = `SELECT
                            ARRAY(
                                SELECT CURRENT_DATE + i
                                FROM generate_series(0, days_ahead - 1) AS s(i)
                            ) AS available_dates
                        FROM theaters;`
        
        const query4 = `UPDATE theaters SET available_dates = $1::date[]`

        const dates = await db.query(query3)
        const available_dates = dates.rows[0].available_dates;
        // console.log("available_dates = ")
        // console.log(available_dates)
        const theaterData = await db.query(query2)
        movieTheaters = theaterData.rows;

        movieTheaters.forEach(obj => {
            obj.available_dates = available_dates
        })

        console.log("movieTheaters = ")
        console.log(movieTheaters);
        
        const tagsResult = await db.query(query1);
        movieTags = tagsResult.rows;
        console.log("Movie tags loaded:", movieTags.length);

        // Load movies
        const moviesResult = await db.query("SELECT * FROM movies");
        moviesDesc = moviesResult.rows;
        //console.log("Movies loaded:", moviesDesc.length);

        //console.log(movieTags)

        for (let i = 0; i < movieTags.length; i++) {
            const tag = movieTags[i];
            let desc = moviesDesc.find((m) => {
                return m.id === tag.id
            })
            desc.tags = tag.tags;
        }

        for (let i = 0; i < movieTheaters.length; i++) {
            const theater = movieTheaters[i];
            let desc = moviesDesc.find((m) => {
                return m.id === theater.movie_id
            })
            
            if (desc) {
                if (!desc.theaters) {
                    desc.theaters = []
                }
                desc.theaters.push(theater)
            }
        }

        // console.log("MovieDesc = ")
        // console.log(moviesDesc)

        // Set flag to indicate data is ready
        isDataLoaded = true;
        console.log("Database initialization complete")

        // Start server only after data is loaded
        app.listen(port, () => {
            console.log(`Server running at http://localhost:${port}`);
        });

    } catch (err) {
        console.error("Database initialization failed:", err);
        process.exit(1);
    }
};

// Middleware to check if data is loaded
const checkDataLoaded = (req, res, next) => {
    if (!isDataLoaded) {
        return res.status(503).json({ 
            error: "Server is still loading data. Please try again in a moment." 
        });
    }
    next();
};

// Apply middleware to all routes
app.use(checkDataLoaded);

app.get("/", (req, res) => {
    res.json({
        moviesdata: moviesDesc
    });
});

// app.get("/home/:movieName/:etno", (req, res) => {
//     res.json({
//         moviesdata: moviesDesc,
//         moviestags: movieTags
//     });
// });

// Initialize everything
initializeDatabase();
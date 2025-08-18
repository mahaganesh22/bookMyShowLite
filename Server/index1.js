import express from "express";
import cors from "cors";
const app = express();

const port = 3000;
//console.log(otp)

app.use(cors());

app.get("/", (req, res) => {
    const otp = Math.floor(100000 + 900000 * Math.random());
    console.log(otp)
    console.log(req.query);
    res.json(otp)
})

app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
})
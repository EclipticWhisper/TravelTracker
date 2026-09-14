import express from "express";
import bodyParser from "body-parser";
import pg from "pg";
import "dotenv/config";
const app = express();
const port = 3000;

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));
app.set("view engine", "ejs");

const db = new pg.Client({
  user: process.env.PGUSER,
  host: process.env.PGHOST,
  database: process.env.PGDATABASE,
  password: process.env.PGPASSWORD,
  port: Number(process.env.PGPORT),
});
db.connect();

async function checkVisitedCountries() {
  const result = await db.query("SELECT country_code FROM visitedcountries");
  let countries = [];
  result.rows.forEach((country) => {
    countries.push(country.country_code);
  });
  return countries;
}

app.get("/", async (req, res) => {
  const result = await checkVisitedCountries();
  const countries = result;
  res.render("index.ejs", { countries: countries, total: countries.length });
});

//INSERT new country
app.post("/add", async (req, res) => {
  const input = req.body["country"];

  const result = await db.query(
    "SELECT country_code FROM countries WHERE country_name = $1",
    [input]
  );

  if (result.rows.length !== 0) {
    const data = result.rows[0];
    const countryCode = data.country_code;

    await db.query("INSERT INTO visitedcountries (country_code) VALUES ($1)", [
      countryCode,
    ]);
    res.redirect("/");
  }
  // db.end();
});


app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
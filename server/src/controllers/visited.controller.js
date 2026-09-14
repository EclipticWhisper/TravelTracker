import { pool } from "../config/db.js";

function normalizeCode(code) {
  return code.trim().toUpperCase();
}

export async function getVisited(req, res, next) {
  try {
    const result = await pool.query(
      `SELECT v.country_code AS code, c.country_name AS name
         FROM visitedcountries v
         JOIN countries c ON c.country_code = v.country_code
        ORDER BY c.country_name`
    );

    const visited = result.rows.map((row) => ({
      code: row.code.trim(),
      name: row.name,
    }));

    res.json({ visited, total: visited.length });
  } catch (err) {
    next(err);
  }
}

export async function addVisited(req, res, next) {
  try {
    const input = (req.body.country || "").trim();

    if (!input) {
      return res.status(400).json({ error: "Country name or code is required." });
    }

    const isCode = /^[a-z]{2}$/i.test(input);

    const findResult = isCode
      ? await pool.query(
          "SELECT country_code, country_name FROM countries WHERE country_code = $1",
          [normalizeCode(input)]
        )
      : await pool.query(
          "SELECT country_code, country_name FROM countries WHERE country_name ILIKE $1 ORDER BY id LIMIT 1",
          [input]
        );

    if (findResult.rows.length === 0) {
      return res
        .status(404)
        .json({ error: `Country "${input}" was not found.` });
    }

    const country = findResult.rows[0];
    const code = country.country_code.trim();

    const insertResult = await pool.query(
      `INSERT INTO visitedcountries (country_code)
       VALUES ($1)
       ON CONFLICT (country_code) DO NOTHING
       RETURNING country_code`,
      [code]
    );

    if (insertResult.rows.length === 0) {
      return res
        .status(409)
        .json({ error: `${country.country_name} has already been added.` });
    }

    res.status(201).json({ country: { code, name: country.country_name } });
  } catch (err) {
    next(err);
  }
}

export async function removeVisited(req, res, next) {
  try {
    const code = normalizeCode(req.params.code);

    const result = await pool.query(
      "DELETE FROM visitedcountries WHERE country_code = $1 RETURNING country_code",
      [code]
    );

    if (result.rows.length === 0) {
      return res
        .status(404)
        .json({ error: "Country is not in your visited list." });
    }

    res.json({ removed: result.rows[0].country_code.trim() });
  } catch (err) {
    next(err);
  }
}

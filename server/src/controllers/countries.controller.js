import { pool } from "../config/db.js";

export async function listCountries(req, res, next) {
  try {
    const { search } = req.query;

    let text =
      "SELECT country_code AS code, country_name AS name FROM countries";
    const params = [];

    if (search && search.trim()) {
      text +=
        " WHERE country_name ILIKE $1 OR country_code ILIKE $1 ORDER BY country_name LIMIT 20";
      params.push(`%${search.trim()}%`);
    } else {
      text += " ORDER BY country_name";
    }

    const result = await pool.query(text, params);
    const countries = result.rows.map((row) => ({
      code: row.code.trim(),
      name: row.name,
    }));

    res.json({ countries, total: countries.length });
  } catch (err) {
    next(err);
  }
}

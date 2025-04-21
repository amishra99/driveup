import { query } from "../../../lib/db"; // Ensure you have your DB connection

export default async function handler(req, res) {
  const { model_id } = req.query; // Getting model_id from query params
  if (!model_id) return res.status(400).json({ error: "Missing model_id" });

  try {
    const variants = await query(
      `SELECT variant_id, variant, specifications, prices FROM car_final WHERE model_id = $1`,
      [model_id]
    );

    res.status(200).json(variants);
  } catch (error) {
    console.error("Error fetching variant details:", error);
    res.status(500).json({ error: "Internal server error" });
  }
}

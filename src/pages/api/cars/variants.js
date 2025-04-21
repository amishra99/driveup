import { query } from "../../../lib/db";

export default async function handler(req, res) {
  if (req.method !== "GET") {
    return res.status(405).json({ message: "Only GET requests allowed" });
  }

  const { model_id } = req.query;
  if (!model_id) {
    return res.status(400).json({ error: "Model ID is required" });
  }

  try {
    const variants = await query(
      `SELECT variant_id, variant, brief_info, color_options, color_image_urls, brochure_url, primary_image_url, secondary_image_urls FROM car_final WHERE model_id = $1;`,
      [model_id]
    );
    res.status(200).json(variants);
  } catch (error) {
    res.status(500).json({ error: "Internal Server Error" });
  }
}

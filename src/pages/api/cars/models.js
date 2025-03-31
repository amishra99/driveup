import { query } from "../../../lib/db";

export default async function handler(req, res) {
  if (req.method !== "GET") {
    return res.status(405).json({ message: "Only GET requests allowed" });
  }

  try {
    const models = await query(
      `SELECT model_id, model, brand, body_type, primary_image_url, secondary_image_urls, brochure_url, color_options, color_image_urls, brief_info, cast(rating as FLOAT) as rating, fuel_options, fuel, hp, cc, cast(starting_price as FLOAT) as starting_price FROM car_final 
      GROUP BY model_id, model, brand, body_type, primary_image_url, secondary_image_urls, brochure_url, color_options, color_image_urls, brief_info, cast(rating as FLOAT), fuel_options, fuel, hp, cc, cast(starting_price as FLOAT)
      ORDER BY starting_price;`
    );
    res.status(200).json(models);
  } catch (error) {
    res.status(500).json({ error: "Internal Server Error" });
  }
}

import { Pool } from "pg";
import dotenv from "dotenv";

dotenv.config();

console.log("🔍 DATABASE_URL:", process.env.DATABASE_URL); // Check if it's undefined

let pool;

try {
  pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: { rejectUnauthorized: false },
  });

  console.log("✅ Database Pool Created Successfully!");
} catch (dbError) {
  console.error("❌ Database Connection Failed:", dbError);
}

export default async function handler(req, res) {
  console.log("🚀 Incoming Request:", req.method);

  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method Not Allowed" });
  }

  try {
    console.log("✅ Received Data:", req.body);

    const userPreferences = req.body;
    const {
      budget,
      fuelType,
      bodyType,
      seatingCapacity,
      transmissionType,
      safetyPreference,
      performancePreference,
      additionalFeatures,
      brandPreference,
    } = userPreferences;

    let query = `
  WITH cte AS (
    SELECT cars.*, prices.budget AS car_price,
    CASE WHEN engine_and_transmission_10000_power IS NULL THEN NULL
    ELSE CAST(
    NULLIF(REGEXP_REPLACE(engine_and_transmission_10000_power, '[^0-9.].*', '', 'g'), '') 
    AS NUMERIC
  )
 END AS hp_new,
      CASE 
        WHEN safety_and_security_global_ncap_safety_rating = '5 Star' 
          AND adas_feature_automatic_emergency_braking = 'Yes' 
          AND (adas_feature_blind_spot_collision_avoidance_assist = 'Yes' OR safety_and_security_blind_spot_monitor = 'Yes') 
        THEN 'top_tier'
        
        WHEN CAST(safety_and_security_no_of_airbags AS INTEGER) >= 6 
          AND safety_and_security_electronic_stability_program_esp = 'Yes' 
          AND adas_feature_automatic_emergency_braking = 'Yes' 
        THEN 'advanced'

        WHEN safety_and_security_anti_lock_braking_system_abs = 'Yes' 
          AND CAST(safety_and_security_no_of_airbags AS INTEGER) >= 2 
        THEN 'basic'

        ELSE 'unknown'
      END AS computed_safety_level
    FROM CAR_MODEL_VARIANTS cars
    JOIN (
      SELECT variant_id, CAST(MIN(price) AS DECIMAL) AS budget
        FROM (
          SELECT variant_id, 
              CASE 
                  WHEN ex_showroom_price ILIKE 'NA' OR ex_showroom_price ILIKE 'To be Announced' THEN NULL
                  WHEN ex_showroom_price ~ 'Lakh' THEN 
                      CAST(REGEXP_REPLACE(ex_showroom_price, 'Rs\.|\s|Lakh', '', 'g') AS DECIMAL) * 100000
                  WHEN ex_showroom_price ~ 'Crore' THEN 
                      CAST(REGEXP_REPLACE(ex_showroom_price, 'Rs\.|\s|Crore', '', 'g') AS DECIMAL) * 10000000
                  ELSE 
                      CAST(REGEXP_REPLACE(ex_showroom_price, 'Rs\.|,|\s', '', 'g') AS DECIMAL)
              END AS price
          FROM CAR_MODEL_VARIANTS_PRICES
        ) A 
        GROUP BY variant_id
    ) prices ON cars.variant_id = prices.variant_id
  )

    SELECT * FROM cte 
    WHERE 1=1 AND safety_and_security_no_of_airbags ~ '^[0-9]+$'`;

    // Apply single-value filtering conditions
    if (fuelType)
      query += ` AND performance_and_fuel_economy_fuel_type = '${fuelType}'`;
    if (bodyType) query += ` AND body_type = '${bodyType}'`;
    if (seatingCapacity === "2")
      query += ` AND CAST(interior_dimensions_seating_capacity AS INTEGER) = 2`;
    if (seatingCapacity === "4-5")
      query += ` AND CAST(interior_dimensions_seating_capacity AS INTEGER) BETWEEN 4 AND 5`;
    if (seatingCapacity === "6-7")
      query += ` AND CAST(interior_dimensions_seating_capacity AS INTEGER) BETWEEN 6 AND 7`;
    if (seatingCapacity === "8+")
      query += ` AND CAST(interior_dimensions_seating_capacity AS INTEGER) >= 8`;

    if (transmissionType !== "no_preference")
      query += ` AND engine_and_transmission_transmission = '${transmissionType}'`;

    // Apply Safety Preference Filtering
    if (safetyPreference === "top_tier")
      query += ` AND computed_safety_level = 'top_tier'`;
    if (safetyPreference === "advanced")
      query += ` AND computed_safety_level IN ('advanced', 'top_tier')`;
    if (safetyPreference === "basic")
      query += ` AND computed_safety_level IN ('basic', 'advanced', 'top_tier')`;

    // Apply Budget Filtering (Convert Lakhs to Rupees)
    if (budget === "<10,00,000")
      query += ` AND CAST(car_price AS DECIMAL) <= 1000000`;
    if (budget === "10,00,000 to 20,00,000")
      query += ` AND CAST(car_price AS DECIMAL) BETWEEN 1000000 AND 2000000`;
    if (budget === "20,00,000 to 40,00,000")
      query += ` AND CAST(car_price AS DECIMAL) BETWEEN 2000000 AND 4000000`;
    if (budget === ">40,00,000")
      query += ` AND CAST(car_price AS DECIMAL) >= 4000000`;

    // Apply Performance vs Mileage Filtering
    if (performancePreference === "highMileage")
      query += ` AND CAST(hp_new AS NUMERIC) < 90`;
    if (performancePreference === "balanced")
      query += ` AND CAST(hp_new AS NUMERIC) BETWEEN 90 AND 120`;
    if (performancePreference === "performance")
      query += ` AND CAST(hp_new AS NUMERIC) > 120`;

    // Apply Additional Features (Sunroof, Large Boot, Drive Type)
    if (additionalFeatures && additionalFeatures.length > 0) {
      if (additionalFeatures.includes("sunroof")) {
        query += ` AND comfort_and_convenience_sunroof IS NOT NULL AND comfort_and_convenience_sunroof <> ''`;
      }
      if (additionalFeatures.includes("boot"))
        query += ` AND CAST(REGEXP_REPLACE(interior_dimensions_boot_space, '[^0-9]', '', 'g') AS NUMERIC) >= 400`;
      if (additionalFeatures.includes("awd"))
        query += ` AND engine_and_transmission_drive_type IN ('AWD', '4WD')`;
    }

    // Apply Brand Filtering (Multi-Select)
    if (brandPreference && brandPreference.length > 0) {
      const brandList = brandPreference.map((brand) => `'${brand}'`).join(", ");
      query += ` AND brand IN (${brandList})`;
    }

    // Fetch results
    let { rows } = await pool.query(query);

    console.log("✅ Query Result:", rows.length, "cars found");

    // AI-based ranking logic with explanation
    rows = rows.map((car) => {
      let score = 0;
      let explanation = []; // ✅ Use an array instead of a string

      // ✅ Convert numeric fields stored as text
      const carSeatingCapacity = car.interior_dimensions_seating_capacity
        ? parseInt(
            car.interior_dimensions_seating_capacity.replace(/\D/g, ""),
            10
          ) || 0
        : 0;

      const carBootSpace = car.interior_dimensions_boot_space
        ? parseInt(car.interior_dimensions_boot_space.replace(/\D/g, ""), 10) ||
          0
        : 0;

      if (brandPreference.includes(car.brand)) {
        score += 20;
        explanation.push(`Matches your preferred brand (${car.brand}). `);
      }
      if (car.performance_and_fuel_economy_fuel_type === fuelType) {
        score += 20;
        explanation.push(`Uses your preferred fuel type (${fuelType}). `);
      }
      if (car.body_type === bodyType) {
        score += 20;
        explanation.push(`Matches your preferred body type (${bodyType}). `);
      }

      // ✅ Fix Seating Capacity Comparison
      if (
        (seatingCapacity === "2" && carSeatingCapacity <= 2) ||
        (seatingCapacity === "4-5" &&
          carSeatingCapacity >= 4 &&
          carSeatingCapacity <= 5) ||
        (seatingCapacity === "6-7" &&
          carSeatingCapacity >= 6 &&
          carSeatingCapacity <= 7) ||
        (seatingCapacity === "8+" && carSeatingCapacity >= 8)
      ) {
        score += 15;
        explanation.push(`Has seating for ${carSeatingCapacity} people. `);
      }

      if (car.engine_and_transmission_transmission === transmissionType) {
        score += 10;
        explanation.push(`Comes with a ${transmissionType} transmission. `);
      }
      if (car.computed_safety_level === safetyPreference) {
        score += 15;
        explanation.push(`Offers ${safetyPreference} safety level. `);
      }

      // ✅ Fix HP Comparison
      if (car.hp_new >= 120 && performancePreference === "performance") {
        score += 10;
        explanation.push(`Has high performance with ${car.hp_new} BHP. `);
      }

      // ✅ Fix Boot Space Comparison
      if (carBootSpace >= 400 && additionalFeatures.includes("boot")) {
        score += 10;
        explanation.push(`Provides large boot space (${carBootSpace}L). `);
      }

      if (
        car.comfort_and_convenience_sunroof && // Checks if the value is NOT blank
        additionalFeatures.includes("sunroof")
      ) {
        score += 5;
        explanation.push(`Comes with a sunroof. `);
      }

      if (
        (car.engine_and_transmission_drive_type === "AWD" ||
          car.engine_and_transmission_drive_type === "4WD") &&
        additionalFeatures.includes("awd")
      ) {
        score += 5;
        explanation.push(
          `Equipped with ${car.engine_and_transmission_drive_type} for better control.`
        );
      }

      return { ...car, ai_score: score, explanation };
    });

    // Sort by AI score and return top 3
    rows.sort((a, b) => b.ai_score - a.ai_score);
    const rankedResults = rows.slice(0, 3);

    console.log("Final Recommendations Sent to Frontend:", rankedResults);

    return res.status(200).json({ recommendations: rankedResults });
  } catch (error) {
    console.error("Error fetching recommendations:", error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
}

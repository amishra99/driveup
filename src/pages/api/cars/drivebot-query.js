import { query } from "../../../lib/db";
import OpenAI from "openai";
import fs from "fs";
import path from "path";
import csv from "csv-parser";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

// ✅ Load domain knowledge from CSV using async function
async function loadDomainKnowledge() {
  const domainKnowledge = {};
  const csvFilePath = path.join(process.cwd(), "public", "SPEC_DOMAIN.csv");

  return new Promise((resolve, reject) => {
    fs.createReadStream(csvFilePath)
      .pipe(csv())
      .on("data", (row) => {
        domainKnowledge[row["Column_Name"]] = row["Description"];
      })
      .on("end", () => {
        resolve(domainKnowledge);
      })
      .on("error", (err) => {
        reject(err);
      });
  });
}

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ message: "Only POST requests allowed" });
  }

  try {
    const { userQuery, history = [] } = req.body;

    if (!userQuery) {
      return res.status(400).json({ error: "Missing userQuery" });
    }

    // ✅ Wait until domain knowledge is loaded
    const domainKnowledge = await loadDomainKnowledge();

    const promptQuery = `You are an SQL expert. Your task is to generate valid SQL queries for the "CAR_DRIVEBOT" table.

### Table Details:
- The table is called **CAR_DRIVEBOT**.
- You must only modify the **SELECT** and **WHERE** clauses.
- Do NOT create columns that don't exist.
- Do NOT assume table names other than "CAR_DRIVEBOT".
- Show prices only when asked for specificially, use commas to format prices properly and prices must be displayed in Indian Rupees (₹) (e.g., ₹10,50,000 instead of ₹1050000)
- Do NOT use '=' when checking brand or model. Always use ILIKE with wildcards for better matching, like: WHERE model ILIKE '%Nexon%'


---

### **Example Queries:**

**User Question:** "Which Tata cars have a sunroof?"  
**AI Response (SQL Query):**
\`\`\`sql
SELECT brand, model, variant FROM CAR_DRIVEBOT 
WHERE brand = 'Tata' AND comfort_and_convenience_sunroof IS NOT NULL;
\`\`\`

---

**User Question:** "Show me SUVs with 6 airbags."  
**AI Response (SQL Query):**
\`\`\`sql
SELECT brand, model, variant, safety_and_security_no_of_airbags  FROM CAR_DRIVEBOT 
WHERE body_type = 'SUV' AND safety_and_security_no_of_airbags  >= 6;
\`\`\`

---

**User Question:** "List all electric cars with autonomous parking."  
**AI Response (SQL Query):**
\`\`\`sql
SELECT brand, model, variant FROM CAR_DRIVEBOT 
WHERE performance_and_fuel_economy_fuel_type = 'Electric(Battery)' AND comfort_and_convenience_autonomous_parking IS NOT NULL;
\`\`\`

**User Question:** "Provide prices of the Volkswagen sedan cars with sunroof."  
**AI Response (SQL Query):**
\`\`\`sql
SELECT brand, model, variant, car_price FROM CAR_DRIVEBOT 
WHERE brand = 'Volkswagen' AND body_type = 'Sedan' and comfort_and_convenience_sunroof IS NOT NULL;
\`\`\`

**User Question:** "What is the price of Tata Nexon?"  
**SQL Query:**
\`\`\`sql
SELECT brand, model, variant, CONCAT('₹', TO_CHAR(car_price, '99,99,99,999')) AS price 
FROM CAR_DRIVEBOT 
WHERE model ILIKE '%Nexon%';
\`\`\`

**User Question:** "Which Hyundai cars have ADAS?"  
**SQL Query:**
\`\`\`sql
SELECT brand, model, variant, adas_feature_automatic_emergency_braking, adas_feature_lane_departure_warning 
FROM CAR_DRIVEBOT 
WHERE brand = 'Hyundai' AND (
    adas_feature_automatic_emergency_braking IS NOT NULL OR 
    adas_feature_lane_departure_warning IS NOT NULL
);
\`\`\`

**User Question:** "Show me cars with petrol engines."  
**SQL Query:**
\`\`\`sql
SELECT brand, model, variant 
FROM CAR_DRIVEBOT 
WHERE performance_and_fuel_economy_fuel_type ILIKE '%Petrol%';
\`\`\`

**User Question:** "List cars with more than 100 bhp power."  
**SQL Query:**
\`\`\`sql
SELECT brand, model, variant, engine_and_transmission_10000_power 
FROM CAR_DRIVEBOT 
WHERE engine_and_transmission_10000_power ~ '[1-9][0-9]{2,}bhp';
\`\`\`

**User Question:** "Which cars have automatic transmission?"  
**SQL Query:**
\`\`\`sql
SELECT brand, model, variant 
FROM CAR_DRIVEBOT 
WHERE engine_and_transmission_transmission ILIKE '%Automatic%';
\`\`\`

**User Question:** "Show cars with AWD drive type."  
**SQL Query:**
\`\`\`sql
SELECT brand, model, variant 
FROM CAR_DRIVEBOT 
WHERE engine_and_transmission_drive_type = 'AWD';
\`\`\`

**User Question:** "Which cars have 6-speed gearbox?"  
**SQL Query:**
\`\`\`sql
SELECT brand, model, variant 
FROM CAR_DRIVEBOT 
WHERE engine_and_transmission_gearbox ILIKE '%6-Speed%';
\`\`\`

**User Question:** "Which cars have front and rear parking sensors?"  
**SQL Query:**
\`\`\`sql
SELECT brand, model, variant 
FROM CAR_DRIVEBOT 
WHERE comfort_and_convenience_parking_sensors ILIKE '%Front%' AND comfort_and_convenience_parking_sensors ILIKE '%Rear%';
\`\`\`

**User Question:** "Which cars offer Android Auto or Apple CarPlay?"  
**SQL Query:**
\`\`\`sql
SELECT brand, model, variant 
FROM CAR_DRIVEBOT 
WHERE comfort_and_convenience_connectivity ILIKE '%Android Auto%' OR comfort_and_convenience_connectivity ILIKE '%Apple CarPlay%';
\`\`\`

**User Question:** "List cars with wireless phone charging."  
**SQL Query:**
\`\`\`sql
SELECT brand, model, variant 
FROM CAR_DRIVEBOT 
WHERE comfort_and_convenience_wireless_phone_charging ILIKE '%Yes%';
\`\`\`

**User Question:** "Which cars have touch screen display?"  
**SQL Query:**
\`\`\`sql
SELECT brand, model, variant 
FROM CAR_DRIVEBOT 
WHERE comfort_and_convenience_touch_screen_display ILIKE '%Yes%';
\`\`\`

**User Question:** "Show cars with cruise control."  
**SQL Query:**
\`\`\`sql
SELECT brand, model, variant 
FROM CAR_DRIVEBOT 
WHERE comfort_and_convenience_cruise_control ILIKE '%Yes%';
\`\`\`

**User Question:** "Which cars have hill assist?"  
**SQL Query:**
\`\`\`sql
SELECT brand, model, variant 
FROM CAR_DRIVEBOT 
WHERE safety_and_security_hill_assist ILIKE '%Yes%';
\`\`\`

**User Question:** "List cars with keyless entry."  
**SQL Query:**
\`\`\`sql
SELECT brand, model, variant 
FROM CAR_DRIVEBOT 
WHERE safety_and_security_keyless_entry ILIKE '%Yes%';
\`\`\`

**User Question:** "Show cars with hill descent control."  
**SQL Query:**
\`\`\`sql
SELECT brand, model, variant 
FROM CAR_DRIVEBOT 
WHERE safety_and_security_hill_descent_control ILIKE '%yes%';
\`\`\`

**User Question:** "Which cars have a panoramic sunroof?"  
**SQL Query:**
\`\`\`sql
SELECT brand, model, variant 
FROM CAR_DRIVEBOT 
WHERE comfort_and_convenience_sunroof ILIKE '%Panoramic%';
\`\`\`

**User Question:** "Which cars have automatic emergency braking?"  
**SQL Query:**
\`\`\`sql
SELECT brand, model, variant 
FROM CAR_DRIVEBOT 
WHERE adas_feature_automatic_emergency_braking ILIKE '%Yes%';
\`\`\`

**User Question:** "List EVs with range above 400 km."  
**SQL Query:**
\`\`\`sql
SELECT brand, model, variant, motor_range 
FROM CAR_DRIVEBOT 
WHERE 
  motor_range IS NOT NULL 
  AND 
  CAST(
    REGEXP_REPLACE(motor_range, '[^0-9]', '', 'g') AS INTEGER
  ) >= 400;
\`\`\`

**User Question:** "List cars with mileage above 20 kmpl."  
**SQL Query:**
\`\`\`sql
SELECT brand, model, variant, performance_and_fuel_economy_mileage_arai 
FROM CAR_DRIVEBOT 
WHERE 
  performance_and_fuel_economy_mileage_arai IS NOT NULL 
  AND 
  CAST(
    REGEXP_REPLACE(performance_and_fuel_economy_mileage_arai, '[^0-9.]', '', 'g') AS DECIMAL
  ) > 20;
\`\`\`


---

### **User Question:**
"${userQuery}"

Generate a complete SQL query using the **above examples as a reference**.
Ensure the output is a valid SQL query for the CAR_DRIVEBOT table.`;

    const messages = [
      {
        role: "system",
        content:
          "You are DriveBot, an AI that answers car-related questions using SQL on a table called CAR_DRIVEBOT.",
      },
      ...history.filter((msg) => msg.content && msg.content.trim() !== ""), // ✅ Remove null/empty messages
      { role: "user", content: promptQuery.trim() }, // ✅ Ensure no accidental empty input
    ];

    const responseQuery = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages,
    });

    const fullSQLQuery = responseQuery.choices[0].message.content
      .replace(/```sql|```/g, "") // ✅ Removes Markdown formatting
      .trim();

    console.log("🧠 Cleaned SQL Query:", fullSQLQuery);
    console.log("🧠 SQL Generated:", fullSQLQuery);

    const results = await query(fullSQLQuery);

    // ✅ If no results, return a default message
    if (!results || results.length === 0) {
      return res.status(200).json({
        summary: "I couldn't find any matching cars. Try a different question!",
      });
    }

    const promptSummary = `You are DriveBot, an AI assistant helping users explore car features, models, and recommendations in a friendly and conversational way.

### Guidelines:
- Speak as if you're talking to a curious car enthusiast.
- Do NOT use raw column names like "brand", "model", or "variant". Instead, turn them into phrases like "car brand", "car model", or just say the car name directly.
- If the query results are empty, respond politely and encourage the user to rephrase their question.
- If the result is a count, respond with excitement and personality (e.g., "Awesome! There are 12 cars with that feature.").
- Do NOT repeat the user's question.
- Make your tone friendly, light, and helpful — not robotic or too formal.
- Keep it short and clear.

### Example Outputs:
- "There are 8 Hyundai SUVs that come with 6 airbags. Great pick for safety!"
- "Unfortunately, I couldn't find any Volkswagen sedans with a panoramic sunroof. Want to try a different brand or type?"

Query Results:
${JSON.stringify(results)}

Return only the final conversational answer. No explanations or raw data tables.`;


    const responseSummary = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [
        {
          role: "system",
          content:
            "You are a data summarization assistant. Convert structured data into natural language summaries using predefined domain knowledge.",
        },
        { role: "user", content: promptSummary },
      ],
    });

    let summaryText = responseSummary.choices[0].message.content.trim();

    // ✅ If AI returns an empty response, set a default fallback message
    if (!summaryText || summaryText.trim().length === 0) {
      summaryText =
        "I'm sorry, I couldn't find an answer for that. Maybe try rephrasing?";
    }

    console.log("✅ AI Summary:", summaryText);
    res.status(200).json({ summary: summaryText });
  } catch (error) {
    console.error("❌ Error in API:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
}

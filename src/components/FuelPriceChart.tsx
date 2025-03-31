"use client";

import React, { useEffect, useState } from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { getFirestore, doc, getDoc } from "firebase/firestore";
import { Dialog, DialogTrigger, DialogContent } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

// Firestore instance (already initialized in your app)
const db = getFirestore();

type ChartDataPoint = { date: string; price: number };

const allCities = [
  "Mumbai",
  "New-Delhi",
  "Bangalore",
  "Pune",
  "Chennai",
  "Kolkata",
  "Hyderabad",
  "Ahmedabad",
  "Patna",
];

export default function FuelPriceChart({
  city,
  setCity,
}: {
  city: string;
  setCity: (value: string) => void;
}) {
  const [fuelType, setFuelType] = useState<"petrol" | "diesel">("petrol");
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState("");
  const [chartData, setChartData] = useState<ChartDataPoint[]>([]);
  const sortedData = [...chartData].sort(
    (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()
  );

  useEffect(() => {
    const fetchData = async () => {
      try {
        const ref = doc(db, "fuel_prices", city);
        const snap = await getDoc(ref);
        if (snap.exists()) {
          const data = snap.data();
          const prices = data[fuelType];
          const formatted = Object.entries(prices).map(([date, price]) => ({
            date,
            price: parseFloat(price),
          }));
          setChartData(formatted);
        }
      } catch (err) {
        console.error("Error fetching fuel prices:", err);
      }
    };

    fetchData();
  }, [city, fuelType]);

  const latestPrice =
    chartData.length > 0
      ? [...chartData]
          .sort(
            (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()
          )
          .at(-1)?.price ?? 0
      : 0;

  const filteredCities = allCities.filter((c) =>
    c.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <Card className="bg-[#1f1f1f] shadow-sm border border-zinc-700 rounded-lg">
      <CardHeader className="flex flex-col sm:flex-row sm:items-center sm:justify-between border-b border-zinc-700 px-6 py-4">
        <div>
          <CardTitle className="text-xl text-white">
            Fuel Prices Trend in{" "}
            <strong className="capitalize text-[#E9D8A6]">
              {city.replace("-", " ")}
            </strong>{" "}
          </CardTitle>
          <CardDescription className="text-xs text-muted-foreground">
            Showing prices for the last 11 days –{" "}
            <span className="italic text-xs">
              Updated as of{" "}
              {chartData.length > 0
                ? new Date(
                    Math.max(
                      ...chartData.map((entry) =>
                        new Date(entry.date).getTime()
                      )
                    )
                  ).toLocaleDateString()
                : "N/A"}
            </span>
          </CardDescription>
          <div className="flex justify-between items-start">
            <p className="text-xs text-muted-foreground">
              Select City{" "}
              <Dialog open={open} onOpenChange={setOpen}>
                <DialogTrigger asChild>
                  <button className="underline underline-offset-2 text-zinc-400 hover:opacity-80 transition">
                    {city.charAt(0).toUpperCase() + city.slice(1)}
                  </button>
                </DialogTrigger>
                <DialogContent className="max-w-sm">
                  <div className="flex flex-col gap-3">
                    <h3 className="text-lg font-semibold text-[#E9D8A6]">
                      Select your city
                    </h3>
                    <Input
                      type="text"
                      placeholder="Search city..."
                      value={search}
                      onChange={(e) => setSearch(e.target.value)}
                      className="rounded-md"
                    />
                    <div className="grid grid-cols-2 gap-2 max-h-[250px] overflow-y-auto">
                      {filteredCities.length > 0 ? (
                        filteredCities.map((c) => (
                          <Button
                            key={c}
                            variant={
                              city === c.toLowerCase() ? "default" : "outline"
                            }
                            onClick={() => {
                              setCity(c.toLowerCase());
                              setOpen(false);
                              setSearch("");
                            }}
                            className="w-full text-sm"
                          >
                            {c}
                          </Button>
                        ))
                      ) : (
                        <p className="col-span-2 text-muted-foreground text-sm text-center">
                          No cities found
                        </p>
                      )}
                    </div>
                  </div>
                </DialogContent>
              </Dialog>
            </p>
          </div>
        </div>
        <div className="mt-4 sm:mt-0 flex gap-4 items-center">
          {["petrol", "diesel"].map((type) => (
            <button
              key={type}
              onClick={() => setFuelType(type as "petrol" | "diesel")}
              className={`rounded-lg px-6 py-2 text-sm font-medium border transition ${
                fuelType === type
                  ? "bg-none text-white border-none"
                  : "text-muted-foreground border-zinc-600 hover:border-zinc-400 rounded-3xl"
              }`}
            >
              {type.charAt(0).toUpperCase() + type.slice(1)}
            </button>
          ))}
          <div className="ml-4 text-sm sm:text-base flex flex-col sm:flex-row sm:items-center text-muted-foreground">
            <span className="mr-1 text-xs sm:text-sm font-normal text-muted-foreground">
              Latest Price:{""}
            </span>
            <span className="text-base sm:text-base text-white">
              ₹{latestPrice.toFixed(2)}
            </span>
          </div>
        </div>
      </CardHeader>

      <CardContent className="px-4 py-6">
        {chartData.length > 0 ? (
          <ResponsiveContainer width="100%" height={300}>
            <LineChart
              data={sortedData}
              margin={{ top: 10, right: 20, left: 10, bottom: 10 }}
            >
              {/* ✅ Subtle horizontal gridlines */}
              <CartesianGrid
                strokeDasharray="1.5 3"
                stroke="rgba(107, 114, 128, 0.2)" // Tailwind's zinc-500 with opacity
                vertical={false}
              />

              {/* ✅ X-axis styling */}
              <XAxis
                dataKey="date"
                tickLine={false}
                axisLine={false}
                tick={{
                  fontSize: 11,
                  fill: "#a1a1aa", // subtle zinc-400 tone
                }}
                tickMargin={8}
                tickFormatter={(value) => {
                  const date = new Date(value);
                  return date.toLocaleDateString("en-US", {
                    month: "short",
                    day: "numeric",
                  }); // → Mar 29
                }}
              />

              {/* ✅ No visible Y-axis line or ticks */}
              <YAxis
                hide={true}
                domain={["auto", "auto"]}
                tickFormatter={(v) => `₹${v}`}
              />

              {/* ✅ Custom Tooltip */}
              <Tooltip
                contentStyle={{
                  backgroundColor: "#27272a",
                  border: "1px solid #3f3f46",
                  borderRadius: "0.5rem",
                  color: "white",
                }}
                formatter={(value: number) => [`₹${value.toFixed(2)}`, "Price"]}
                labelFormatter={(label) =>
                  new Date(label).toLocaleDateString("en-US", {
                    month: "short",
                    day: "numeric",
                  })
                }
              />

              {/* ✅ Smooth line */}
              <Line
                type="monotone"
                dataKey="price"
                stroke={fuelType === "petrol" ? "#22c55e" : "#3b82f6"} // green/blue
                strokeWidth={2}
                dot={{ r: 3 }}
                activeDot={{ r: 5 }}
              />
            </LineChart>
          </ResponsiveContainer>
        ) : (
          <p className="text-center text-muted-foreground">No data available</p>
        )}
      </CardContent>
    </Card>
  );
}

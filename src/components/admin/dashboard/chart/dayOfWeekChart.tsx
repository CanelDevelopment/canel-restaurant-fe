import {
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  AreaChart,
  Area,
} from "recharts";
import { Chart, useChart } from "@chakra-ui/charts";
import { Box, Center, Text, Image } from "@chakra-ui/react";
import { useState, useMemo } from "react";
import { DayPicker, type DateRange } from "react-day-picker";
import "react-day-picker/style.css";
import {
  getDay,
  isWithinInterval,
  startOfWeek,
  endOfWeek,
  format,
} from "date-fns";

// --- FIX #1: Define the shape of an Order object and the component's props ---
// This should match the Order type in your ChartSectionHeader
interface Order {
  createdAt: string; // The API provides the date as a string
  // Add other properties if needed, but createdAt is the essential one here
}

interface DayOfWeekChartProps {
  // The component now accepts an array of orders.
  // It can be `undefined` while data is loading.
  orders: Order[] | undefined;
}

export const DayOfWeekChart = ({ orders }: DayOfWeekChartProps) => {
  // --- FIX #2: Remove the hardcoded `sampleOrders` array ---
  // All data will now come from the `orders` prop.

  const defaultWeek: DateRange = {
    from: startOfWeek(new Date()),
    to: endOfWeek(new Date()),
  };
  const [selectedWeek, setSelectedWeek] = useState<DateRange | undefined>(
    defaultWeek
  );
  const [isOpen, setIsOpen] = useState(false);

  // --- FIX #3: Update the data processing logic to use the `orders` prop ---
  const chartData = useMemo(() => {
    const daysOfWeek = [
      "Dimanche",
      "Lundi",
      "Mardi",
      "Mercredi",
      "Jeudi",
      "Vendredi",
      "Samedi",
    ];
    const orderCounts = new Map<string, number>();
    daysOfWeek.forEach((day) => orderCounts.set(day, 0));

    // Filter the *props* data by the selected week
    const weeklyFilteredOrders = (orders || []).filter(
      (
        order // Use `(orders || [])` for safety
      ) =>
        selectedWeek?.from && selectedWeek?.to
          ? isWithinInterval(new Date(order.createdAt), {
              // Use `createdAt` from the API data
              start: selectedWeek.from,
              end: selectedWeek.to,
            })
          : false
    );

    // Count the weekly filtered orders by day
    weeklyFilteredOrders.forEach((order) => {
      const dayIndex = getDay(new Date(order.createdAt)); // Use `createdAt`
      const dayName = daysOfWeek[dayIndex];
      if (dayName) {
        orderCounts.set(dayName, (orderCounts.get(dayName) || 0) + 1);
      }
    });

    return daysOfWeek.map((day) => ({
      name: day,
      orders: orderCounts.get(day) || 0,
    }));
  }, [orders, selectedWeek]); // The calculation now depends on props (`orders`) and local state (`selectedWeek`)

  const chart = useChart({ data: chartData });

  const weekDisplayText = useMemo(() => {
    if (selectedWeek?.from && selectedWeek.to) {
      return `${format(selectedWeek.from, "MMM d")} - ${format(
        selectedWeek.to,
        "d"
      )}`;
    }
    return "Select Week";
  }, [selectedWeek]);

  return (
    <Box width={"100%"} bg={"white"} rounded={"lg"}>
      {/* The rest of your JSX remains exactly the same. No changes needed below. */}
      <Center
        justifyContent={"space-between"}
        fontFamily={"AmsiProCond"}
        p={3}
        position={"relative"}
      >
        <Text fontFamily={"AmsiProCond-Black"} color={"#000"} fontSize={"lg"}>
          Día de la Semana
        </Text>

        <Center
          alignItems={"center"}
          textAlign={"center"}
          bg={"#F4F4F4"}
          rounded={"lg"}
          minWidth={"140px"}
          px={3}
          height={"35px"}
          gap={2}
          cursor={"pointer"}
          onClick={() => setIsOpen(!isOpen)}
        >
          <Image loading="lazy" src="/admin/cal.svg" className="size-5" />
          <Text fontSize={"sm"} color={"#000"}>
            {weekDisplayText}
          </Text>
        </Center>

        {isOpen && (
          <Box position="absolute" top="100%" right={0} zIndex={10} mt={2}>
            <DayPicker
              mode="range"
              showOutsideDays
              selected={selectedWeek}
              onSelect={(range) => {
                if (range?.from) {
                  const newWeek = {
                    from: startOfWeek(range.from),
                    to: endOfWeek(range.from),
                  };
                  setSelectedWeek(newWeek);
                  setIsOpen(false);
                }
              }}
              styles={{
                root: {
                  padding: "5px",
                  borderRadius: "10px",
                  border: "1px solid #E2E8F0",
                  backgroundColor: "white",
                  boxShadow: "lg",
                },
              }}
              footer={
                <Text p={2} fontSize="sm" textAlign="center">
                  Please select a day to choose a week.
                </Text>
              }
            />
          </Box>
        )}
      </Center>

      <Chart.Root maxH="xs" chart={chart} bg={"white"} rounded={"lg"}>
        <AreaChart data={chart.data} style={{ marginLeft: "-20px" }}>
          <defs>
            <linearGradient id="greenGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="1%" stopColor="#2D7620" stopOpacity={0.6} />
              <stop offset="95%" stopColor="#2D7620" stopOpacity={0} />
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis
            dataKey="name"
            axisLine={true}
            tickLine={false}
            tickMargin={8}
            style={{
              fontFamily: "AmsiProCond",
              fontSize: "13px",
              fontWeight: 500,
            }}
          />
          <YAxis
            axisLine={true}
            tickLine={false}
            tickCount={6}
            allowDecimals={false}
            tickFormatter={(value) => `${value}`}
          />
          <Tooltip />
          <Area
            type="linear"
            dataKey="orders"
            stroke="#2D7620"
            fill="url(#greenGradient)"
          />
        </AreaChart>
      </Chart.Root>
    </Box>
  );
};

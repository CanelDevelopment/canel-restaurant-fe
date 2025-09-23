import { Chart, useChart } from "@chakra-ui/charts";
import { Box, Center, Text } from "@chakra-ui/react";
import { useMemo } from "react";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  LabelList,
  XAxis,
  YAxis,
} from "recharts";

// --- FIX #1: Define the shape of the data and props ---
interface Order {
  status: string;
  // Add any other properties if needed for more complex logic
}

interface OrderStatusChartProps {
  // This component will receive the list of orders filtered by branch
  orders: Order[] | undefined;
}

export const OrderStatusChart = ({ orders }: OrderStatusChartProps) => {
  // --- FIX #2: Process the `orders` prop to calculate status percentages ---
  const chartData = useMemo(() => {
    // If there are no orders, return an empty array for the chart
    const safeOrders = orders || [];
    const totalOrders = safeOrders.length;

    if (totalOrders === 0) {
      // Return a default structure with 0% allocation if no orders exist
      return [
        { allocation: 0, type: "Recibida", color: "TrafficGreen" },
        { allocation: 0, type: "Pendiente", color: "TrafficYellow" },
        { allocation: 0, type: "Entregado", color: "TrafficGreen" },
        { allocation: 0, type: "Cancelado", color: "TrafficRed" },
      ];
    }

    // This object maps API statuses (lowercase) to display names and colors
    const statusConfig = {
      recibida: { name: "Recibida", color: "TrafficGreen" },
      pendiente: { name: "Pendiente", color: "TrafficYellow" },
      entregado: { name: "Entregado", color: "TrafficGreen" },
      cancelado: { name: "Cancelado", color: "TrafficRed" },
    };

    // Map API statuses that might be different, e.g., 'accepté' should count as 'recibida'
    const statusMap: { [key: string]: keyof typeof statusConfig } = {
      pending: "pendiente",
      accepté: "recibida",
      completed: "entregado",
      delivered: "entregado",
      cancelled: "cancelado",
      rejected: "cancelado",
    };

    const statusCounts: { [key: string]: number } = {
      recibida: 0,
      pendiente: 0,
      entregado: 0,
      cancelado: 0,
    };

    // Count the orders for each status
    for (const order of safeOrders) {
      let statusKey = order.status.toLowerCase();
      // Use the map to standardize the status key
      let mappedStatus = statusMap[statusKey] || statusKey;

      if (mappedStatus in statusCounts) {
        statusCounts[mappedStatus]++;
      }
    }

    // Calculate the percentage for each status and format it for the chart
    return Object.entries(statusCounts).map(([statusKey, count]) => {
      const config = statusConfig[statusKey as keyof typeof statusConfig];
      return {
        type: config.name,
        allocation: (count / totalOrders) * 100,
        color: config.color,
      };
    });
  }, [orders]); // Recalculate only when the orders prop changes

  const chart = useChart({
    data: chartData, // Use the new dynamic data
  });

  return (
    <Box width={"100%"} bg={"white"} rounded={"lg"}>
      <Center
        flexDirection={["column", "row"]}
        justifyContent={"space-between"}
        fontFamily={"AmsiProCond"}
        p={4}
      >
        <Text
          fontFamily={"AmsiProCond-Black"}
          fontSize={["xl", "lg"]}
          color={"#000"}
        >
          Estado del Pedido
        </Text>
        <Text fontSize={"sm"} color={"#000"}>
          Excluyendo pedidos en camino y recogidos
        </Text>
      </Center>

      {/* The rest of your JSX chart component remains the same */}
      <Chart.Root maxH="xs" chart={chart}>
        <BarChart
          data={chart.data}
          style={{ marginLeft: "-20px" }}
          barCategoryGap="18%"
        >
          <CartesianGrid strokeDasharray="4 4" />

          <XAxis
            axisLine={true}
            tickLine={false}
            tickMargin={8}
            style={{
              fontFamily: "AmsiProCond",
              fontSize: "13px",
              fontWeight: 500,
            }}
            dataKey={chart.key("type")}
          />
          <YAxis
            axisLine={true}
            tickLine={false}
            tickCount={6}
            domain={[0, 100]}
            tickFormatter={(value) => `${value}%`} // Add '%' to Y-axis labels
          />

          <Bar
            isAnimationActive={false}
            dataKey={chart.key("allocation")}
            radius={[4, 4, 0, 0]}
          >
            {chart.data.map((item, index) => (
              <Cell key={`cell-${index}`} fill={chart.color(item.color)} />
            ))}
            <LabelList
              dataKey={chart.key("allocation")}
              position="top"
              offset={-18}
              formatter={(value: number) => `${value.toFixed(1)}%`} // Show one decimal place
              style={{
                fontFamily: "AmsiProCond",
                fontSize: "12px",
                fontWeight: 500,
                fill: "white",
              }}
            />
          </Bar>
        </BarChart>
      </Chart.Root>
    </Box>
  );
};

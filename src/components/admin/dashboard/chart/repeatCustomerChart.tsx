import { Chart, useChart } from "@chakra-ui/charts";
import { Box, Text, Flex, Circle, Grid, Spinner } from "@chakra-ui/react";
import { Cell, Label, Pie, PieChart, Tooltip } from "recharts";
import { useFetchNewVsRecurring } from "@/hooks/order/usefetcholdnewcustomer";

export const RepeatCustomerChart = () => {
  const { data, isLoading } = useFetchNewVsRecurring();
  const chart = useChart({
    data: [
      { name: "Nuevos", value: data?.newUsers ?? 0, color: "#25663e" },
      { name: "Recurrentes", value: data?.recurringUsers ?? 0, color: "red" },
    ],
  });

  // If loading, show spinner
  if (isLoading) {
    return (
      <Box
        width={["100%", "100%", "50%"]}
        bg={"white"}
        rounded={"lg"}
        px={5}
        py={3}
        display="flex"
        justifyContent="center"
        alignItems="center"
      >
        <Spinner size="lg" />
      </Box>
    );
  }

  const total = data?.total ?? 0;
  const newUsers = data?.newUsers ?? 0;
  const recurringUsers = data?.recurringUsers ?? 0;

  const repeatCustomerStatus = [
    {
      name: "Nuevos",
      value: `${newUsers} (${
        total ? ((newUsers / total) * 100).toFixed(0) : 0
      }%)`,
      color: "#51936b",
    },
    {
      name: "Ventas",
      value: "(0)", // Placeholder until you extend controller with sales
      color: "#51936b",
    },
    {
      name: "Ventas Prom.",
      value: "(nan)", // Placeholder
      color: "#51936b",
    },
    {
      name: "Recurrentes",
      value: `${recurringUsers} (${
        total ? ((recurringUsers / total) * 100).toFixed(0) : 0
      }%)`,
      color: "red",
    },
    {
      name: "Ventas",
      value: "(0)", // Placeholder
      color: "red",
    },
    {
      name: "Ventas Prom.",
      value: "(nan)", // Placeholder
      color: "red",
    },
  ];

  return (
    <Box
      width={["100%", "100%", "50%"]}
      bg={"white"}
      rounded={"lg"}
      px={5}
      py={3}
    >
      <Text
        fontFamily={"AmsiProCond-Black"}
        fontSize={"lg"}
        fontWeight={"bold"}
        color={"gray.700"}
        mb={2}
      >
        Clientes Nuevos vs. Recurrentes
      </Text>

      <Flex flexDirection={"column"} gap={4} justifyContent={"space-between"}>
        <Chart.Root boxSize="200px" chart={chart} mt={-8} ml={-8}>
          <PieChart>
            <Tooltip
              cursor={false}
              animationDuration={100}
              content={<Chart.Tooltip hideLabel />}
            />
            <Pie
              innerRadius={50}
              outerRadius={60}
              data={chart.data}
              startAngle={45}
              isAnimationActive={true}
              dataKey={chart.key("value")}
              nameKey="name"
            >
              <Label
                content={({ viewBox }) => (
                  <g className="radial-text-black">
                    <Chart.RadialText
                      viewBox={viewBox}
                      title={total.toLocaleString()}
                      description="Total"
                    />
                  </g>
                )}
              />
              {chart.data.map((item) => (
                <Cell key={item.color} fill={chart.color(item.color)} />
              ))}
            </Pie>
          </PieChart>
        </Chart.Root>

        <Grid templateColumns="repeat(3, 1fr)" mt={-12} gap={2}>
          {repeatCustomerStatus.map((a, i) => {
            return (
              <Flex key={i} flexDirection="column">
                <Text
                  fontFamily={"AmsiProCond"}
                  fontSize={"md"}
                  fontWeight={"medium"}
                  color={"black"}
                >
                  {a.name}
                </Text>

                <Flex
                  justifyContent={"start"}
                  alignItems={"center"}
                  textAlign={"center"}
                  gap={1}
                >
                  <Circle
                    display="flex"
                    justifyContent={"center"}
                    alignItems={"center"}
                    textAlign={"center"}
                    size="18px"
                    bg={a.color}
                    border={"2px solid white"}
                  />
                  <Text
                    fontFamily={"AmsiProCond"}
                    fontSize={"sm"}
                    color={"gray.600"}
                  >
                    {a.value}
                  </Text>
                </Flex>
              </Flex>
            );
          })}
        </Grid>
      </Flex>
    </Box>
  );
};

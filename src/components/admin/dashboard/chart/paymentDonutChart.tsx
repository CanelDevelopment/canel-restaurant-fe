import { Chart, useChart } from "@chakra-ui/charts";
import { Box, Circle, Flex, Text } from "@chakra-ui/react";
import { PieChart, Pie, Cell, Tooltip, Label } from "recharts";

export const PaymentDonutChart = () => {
  const chart = useChart({
    data: [
      { name: "efectivo", value: 5, color: "#25663e" },
      { name: "en línea", value: 1, color: "#f6f9e0" },
    ],
  });
  return (
    <Box
      width={["100%", "100%", "50%"]}
      bg={"Dgreen"}
      rounded={"lg"}
      px={5}
      py={3}
    >
      <Text
        fontFamily={"AmsiProCond-Black"}
        fontSize={"lg"}
        color={"gray.700"}
        mb={2}
      >
        Métodos de Pago
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
              startAngle={40}
              isAnimationActive={true}
              dataKey={chart.key("value")}
              nameKey="name"
            >
              <Label
                content={({ viewBox }) => (
                  <g className="radial-text-black">
                    <Chart.RadialText
                      viewBox={viewBox}
                      title={chart.getMin("value").toLocaleString()}
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

        <Flex flexDirection="column">
          <Text
            fontFamily={"AmsiProCond-Black"}
            fontSize={"md"}
            fontWeight={"medium"}
            color={"black"}
          >
            Efectivo
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
              bg={"#51936b"}
              border={"2px solid white"}
            />
            <Text fontFamily={"AmsiProCond"} fontSize={"sm"} color={"black"}>
              {" "}
              8 (100%)
            </Text>
          </Flex>
        </Flex>
      </Flex>
    </Box>
  );
};

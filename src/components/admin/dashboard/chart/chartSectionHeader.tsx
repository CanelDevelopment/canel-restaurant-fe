import {
  Box,
  Center,
  Flex,
  Stack,
  Text,
  Spinner,
  Button,
} from "@chakra-ui/react"; // Import Button
import { OrderStatusChart } from "./orderStatusChart";
import { DayOfWeekChart } from "./dayOfWeekChart";
import { RiderTracker } from "./ridertracker";
import { RepeatCustomerChart } from "./repeatCustomerChart";
import { PaymentDonutChart } from "./paymentDonutChart";
import type { Row } from "@tanstack/react-table";
import type { DashboardHeaderProps } from "../dashboardheader";
import { DynamicTable } from "../../table/dynamictable";
import { format } from "date-fns";
import {
  useFetchAllOrders,
  type OrderDetails,
} from "@/hooks/order/usefetchallorder";
import { useMemo, useState, useEffect } from "react";
import { RiderPerformanceCard } from "../riderperformance";
import {
  calculateTotals,
  type CalculationItem,
} from "@/store/calculationStore";

import { useFetchBranch } from "@/hooks/branch/usefetchbranch";
import {
  getCoordinatesFromAddress,
  getDeliveryPrice,
  getDistanceInKm,
} from "@/helper/calculationofdistance";

export interface TableData {
  ref: string;
  name: string;
  contact: string;
  items: string;
  totalPrice: number;
  status: string;
  platform: string;
  date: Date;
  originalOrder: OrderDetails;
}

interface StateDataType {
  name: string;
  color: string;
  value: string | number;
  paragrpg?: string;
}

interface ChartSectionHeaderProps extends DashboardHeaderProps {
  selectedBranchId: string;
}

export const ChartSectionHeader: React.FC<ChartSectionHeaderProps> = ({
  goToStep,
  selectedBranchId,
}) => {
  const { data: allOrders, isLoading } = useFetchAllOrders();
  const [trackedOrder, setTrackedOrder] = useState<OrderDetails | null>(null);
  const { data: allBranches } = useFetchBranch();

  const branchDeliveryRates = useMemo(() => {
    const map: Record<string, { min: number; max: number; price: number }[]> =
      {};
    allBranches?.forEach((b) => {
      map[b.id] = b.deliveryRates;
    });
    return map;
  }, [allBranches]);

  const filteredData = useMemo(() => {
    if (!allOrders) return [];
    if (selectedBranchId === "all") return allOrders;
    return allOrders.filter((order) => order.branchId === selectedBranchId);
  }, [allOrders, selectedBranchId]);

  useEffect(() => {
    if (filteredData.length > 0) {
      setTrackedOrder(filteredData[0]);
    } else {
      setTrackedOrder(null);
    }
  }, [filteredData]);

  const [stateData, setStateData] = useState<StateDataType[]>();

  useEffect(() => {
    if (!filteredData.length || !allBranches) {
      setStateData([]);
      return;
    }

    async function compute() {
      const calculatedTotals = await Promise.all(
        filteredData.map(async (order) => {
          // --- 1. Transform Items ---
          const transformedItems: CalculationItem[] = order.orderItems.map(
            (item) => ({
              quantity: item.quantity,
              product: {
                id: item.id || "",
                name: item.productName || "Unknown Product",
                price: Number(item.price),
                discount: Number(item.discount || 0),
              },
              selectedAddons:
                item.orderAddons?.map((addon) => ({
                  quantity: addon.quantity,
                  addonItem: {
                    id: addon.addonItem?.id || "",
                    name: addon.addonItem?.name || "Unknown Addon",
                    price: Number(addon.price),
                    discount: Number(addon.addonItem?.discount || 0),
                  },
                })) || [],
            })
          );

          // --- 2. Calculate Delivery Price ---
          let deliveryPrice = 0;

          if (order.type === "delivery" && order.location) {
            const branch = allBranches?.find((b) => b.id === order.branchId);

            if (branch?.location) {
              try {
                // === FIX: Cast to 'any' to stop TS complaining about Object vs String ===
                // We know it is a string based on your console log
                const locRaw = branch.location as any;
                const locArray = JSON.parse(locRaw);

                const branchLocation = {
                  lat: Number(locArray[0]),
                  lng: Number(locArray[1]),
                };

                // Cast order.location to string if TS thinks it's an object too
                const userAddress = order.location as unknown as string;
                const userLocation = await getCoordinatesFromAddress(
                  userAddress
                );

                if (userLocation) {
                  const distance = await getDistanceInKm(
                    branchLocation,
                    userLocation
                  );
                  const deliveryRates =
                    branchDeliveryRates[order.branchId] || [];

                  deliveryPrice = getDeliveryPrice(distance, deliveryRates);
                }
              } catch (error) {
                console.error("Total Calculation Error", error);
              }
            }
          }

          // --- 3. Final Calculation ---
          const summary = calculateTotals(
            transformedItems,
            order.type,
            deliveryPrice
          );
          return summary.finalTotal;
        })
      );

      const totalSales = calculatedTotals.reduce((acc, curr) => acc + curr, 0);

      setStateData([
        {
          name: "Venta Total",
          color: "Dgreen",
          value: totalSales.toFixed(2),
        },
        {
          name: "Pedido Total",
          value: filteredData.length,
          color: "#fff",
          paragrpg: "Excluyendo pedidos cancelados y rechazados",
        },
      ]);
    }

    compute();
  }, [filteredData, allBranches, branchDeliveryRates]);

  // console.log(stateData);

  const [tableData, setTableData] = useState<TableData[]>([]);

  useEffect(() => {
    if (!filteredData.length || !allBranches) return;

    async function computeTableData() {
      const rows = await Promise.all(
        filteredData.map(async (order) => {
          // --- 1. Text Formatting ---
          const itemNames = order.orderItems
            .map((item) => {
              const addons =
                item.orderAddons && item.orderAddons.length > 0
                  ? " + " +
                    item.orderAddons
                      .map(
                        (addon) =>
                          `${addon.addonItem?.name || "Addon"} (x${
                            addon.quantity
                          })`
                      )
                      .join(", ")
                  : "";
              return `${item.productName} (x${item.quantity})${addons}`;
            })
            .join(", ");

          // --- 2. Calculation Items Setup ---
          const transformedItems: CalculationItem[] = order.orderItems.map(
            (item) => {
              const product = (item as any).product || {};
              const category = product.category || {};
              return {
                quantity: item.quantity,
                product: {
                  id: item.id || "N/A",
                  name: item.productName || "Unknown Product",
                  price: Number(item.price),
                  discount: Number(item.discount || 0),
                  categoryId: product.categoryId || category.id,
                  volumeDiscountRules: category.volumeDiscountRules,
                },
                selectedAddons:
                  item.orderAddons?.map((addon) => ({
                    quantity: addon.quantity,
                    addonItem: {
                      id: addon.addonItem?.id || "N/A",
                      name: addon.addonItem?.name || "Unknown Addon",
                      price: Number(addon.price),
                      discount: Number(addon.addonItem?.discount || 0),
                    },
                  })) || [],
              };
            }
          );

          // --- 3. Delivery Calculation ---
          let deliveryPrice = 0;

          if (order.type === "delivery" && order.location) {
            const branch = allBranches?.find((b) => b.id === order.branchId);

            if (branch?.location) {
              try {
                // === FIX: Cast to 'any' here as well ===
                const locRaw = branch.location as any;
                const locArray = JSON.parse(locRaw);

                const branchLocation = {
                  lat: Number(locArray[0]),
                  lng: Number(locArray[1]),
                };

                const userAddress = order.location as unknown as string;
                const userLocation = await getCoordinatesFromAddress(
                  userAddress
                );

                if (userLocation) {
                  const distance = await getDistanceInKm(
                    branchLocation,
                    userLocation
                  );
                  const deliveryRates =
                    branchDeliveryRates[order.branchId] || [];

                  deliveryPrice = getDeliveryPrice(distance, deliveryRates);
                }
              } catch (error) {
                console.error("Table Calculation Error", error);
              }
            }
          }

          // --- 4. Final Totals ---
          const summary = calculateTotals(
            transformedItems,
            order.type,
            deliveryPrice
          );

          return {
            ref: order.id,
            name: order.name,
            contact: order.phoneNumber,
            items: itemNames || "No items",
            totalPrice: summary.finalTotal,
            platform: order.type,
            date: new Date(order.createdAt),
            status: order.status,
            originalOrder: order,
          };
        })
      );

      setTableData(rows);
    }

    computeTableData();
  }, [filteredData, allBranches, branchDeliveryRates]);

  const columns = useMemo(
    () => [
      {
        accessorKey: "ref",
        header: () => <Box fontWeight={"Black"}>Ref#</Box>,
        cell: ({ row }: { row: Row<TableData> }) => (
          <Box>{row.original.ref.slice(0, 6).toUpperCase()}</Box>
        ),
      },
      {
        accessorKey: "name",
        header: () => <Box fontWeight={"Black"}>Nombre</Box>,
      },
      {
        accessorKey: "contact",
        header: () => <Box fontWeight={"Black"}>Contacto</Box>,
      },
      {
        accessorKey: "items",
        header: () => <Box fontWeight={"Black"}>Artículos</Box>,
      },
      {
        accessorKey: "totalPrice",
        header: () => <Box fontWeight={"Black"}>Precio total</Box>,
        cell: ({ row }: { row: Row<TableData> }) => (
          <Box>Ref {row.original.totalPrice.toFixed(2)}</Box>
        ),
      },
      {
        accessorKey: "status",
        header: () => <Box fontWeight={"Black"}>Estatus</Box>,
        cell: ({ row }: { row: Row<TableData> }) => {
          const status = row.original.status.toLowerCase();
          const getStatusColor = (status: string) => {
            switch (status.toLowerCase()) {
              case "accepté":
                return "TrafficGreen";
              case "accepted_by_rider":
                return "TrafficGreen";
              case "confirmed":
                return "TrafficGreen";
              case "delivered":
                return "TrafficGreen";
              case "pending":
                return "TrafficYellow";
              case "cancelado":
                return "TrafficRed";
              default:
                return "gray";
            }
          };
          return (
            <Center
              className={`rounded-md capitalize w-24 h-9 text-white ${getStatusColor}`}
              bgColor={getStatusColor(status)}
            >
              {status === "accepted_by_rider"
                ? "Aceptado"
                : status === "confirmed"
                ? "Aceptado"
                : status === "delivered"
                ? "Entregado"
                : status === "pending"
                ? "Pendiente"
                : status}
            </Center>
          );
        },
      },
      {
        accessorKey: "platform",
        header: () => <Box fontWeight={"Black"}>Type de livraison</Box>,
      },
      {
        accessorKey: "date",
        header: () => <Box fontWeight={"Black"}>Fecha</Box>,
        cell: ({ row }: { row: Row<TableData> }) => (
          <Box>{format(row.original.date, "MMM d, yyyy")}</Box>
        ),
      },

      {
        id: "actions",
        header: () => <Box fontWeight={"Black"}>Acción</Box>,
        cell: ({ row }: { row: Row<TableData> }) => (
          <Button
            size="sm"
            onClick={() => setTrackedOrder(row.original.originalOrder)}
            // Highlight the button of the currently tracked order
            colorScheme={
              trackedOrder?.id === row.original.ref ? "teal" : "gray"
            }
            variant={
              trackedOrder?.id === row.original.ref ? "solid" : "outline"
            }
          >
            Rastrear
          </Button>
        ),
      },
    ],
    [trackedOrder]
  );

  return (
    <Box px={[3, 3, 10]} py={3} bg={"#f3f3f3"}>
      <Flex
        flexDirection={["column", "null", "row"]}
        width={"100%"}
        gap={4}
        mt={5}
      >
        <Box
          display={"flex"}
          gap={4}
          flexDirection={["column", "null", "row"]}
          w={"50%"}
        >
          {stateData?.map((item, ix) => {
            return (
              <Stack
                key={ix}
                bg={item.color}
                width={["100%", "100%", "100%"]}
                p={4}
                rounded={"xl"}
                fontFamily={"AmsiProCond"}
              >
                <Text
                  fontFamily={"AmsiProCond-Black"}
                  fontSize={"2xl"}
                  color={"#000"}
                  mt={8}
                >
                  {item.name}
                </Text>
                <Text
                  color={"Cbutton"}
                  fontSize={"2xl"}
                  fontFamily={"AmsiProCond-Bold"}
                >
                  {item.name === "Venta Total"
                    ? "Ref: " + item.value
                    : item.value}
                </Text>
                {item.paragrpg && (
                  <Text fontSize={"sm"} color={"#000"}>
                    {item.paragrpg}
                  </Text>
                )}
              </Stack>
            );
          })}
        </Box>
        <RiderPerformanceCard />
      </Flex>

      {isLoading ? (
        <Center h="600px">
          <Spinner size="xl" />
        </Center>
      ) : (
        <>
          <Flex gap={4} mt={4} flexDirection={["column", "null", "row"]}>
            <OrderStatusChart orders={filteredData} />
            <DayOfWeekChart orders={filteredData} />
          </Flex>

          <Flex
            width={"100%"}
            gap={4}
            mt={4}
            mb={6}
            flexDirection={["column", "null", "row"]}
          >
            <RiderTracker goToStep={goToStep} trackedOrder={trackedOrder} />
            <Flex
              gap={3}
              width={["100%", "100%", "50%"]}
              flexDirection={["column", "null", "row"]}
            >
              <PaymentDonutChart />
              <RepeatCustomerChart />
            </Flex>
          </Flex>

          <DynamicTable
            showDashboardSearch={true}
            data={tableData}
            columns={columns}
          />
        </>
      )}
    </Box>
  );
};

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
import type { TOrderType } from "@/components/order/orderPayment";

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

interface ChartSectionHeaderProps extends DashboardHeaderProps {
  selectedBranchId: string;
}

export const ChartSectionHeader: React.FC<ChartSectionHeaderProps> = ({
  goToStep,
  selectedBranchId,
}) => {
  const { data: allOrders, isLoading } = useFetchAllOrders();
  const [trackedOrder, setTrackedOrder] = useState<OrderDetails | null>(null);

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

  const stateData = useMemo(() => {
    const totalSales = filteredData.reduce((grandTotal, order) => {
      const transformedItems: CalculationItem[] = order.orderItems.map(
        (item) => ({
          quantity: item.quantity,
          product: {
            id: item.id || "",
            name: item.productName || "Unknown Product",
            price: item.price,
            discount: item.discount,
          },
          selectedAddons:
            item.orderAddons?.map((addon) => ({
              quantity: addon.quantity,
              addonItem: {
                id: addon.addonItem?.id || "",
                name: addon.addonItem?.name || "Unknown Addon",
                price: addon.price,
                discount: addon.addonItem?.discount,
              },
            })) || [],
        })
      );

      const summary = calculateTotals(
        transformedItems,
        order.type as TOrderType
      );

      return grandTotal + summary.finalTotal;
    }, 0);

    return [
      { name: "Venta Total", color: "Dgreen", value: totalSales.toFixed(2) },
      {
        name: "Pedido Total",
        value: filteredData.length,
        color: "#fff",
        paragrpg: "Excluyendo pedidos cancelados y rechazados",
      },
    ];
  }, [filteredData]);

  const tableData = useMemo<TableData[]>(() => {
    return filteredData.map((order): TableData => {
      const itemNames = order.orderItems
        .map((item) => {
          const addons =
            item.orderAddons && item.orderAddons.length > 0
              ? " + " +
                item.orderAddons
                  .map(
                    (addon) =>
                      `${addon.addonItem?.name || "Addon"} (x${addon.quantity})`
                  )
                  .join(", ")
              : "";

          return `${item.productName} (x${item.quantity})${addons}`;
        })
        .join(", ");

      const transformedItems: CalculationItem[] = order.orderItems.map(
        (item) => ({
          quantity: item.quantity,
          product: {
            id: item.id || "N/A",
            name: item.productName || "Unknown Product",
            price: item.price,
            discount: item.discount,
          },
          selectedAddons:
            item.orderAddons?.map((addon) => ({
              quantity: addon.quantity,
              addonItem: {
                id: addon.addonItem?.id || "N/A",
                name: addon.addonItem?.name || "Unknown Addon",
                price: addon.price,
                discount: addon.addonItem?.discount,
              },
            })) || [],
        })
      );

      // b. Call the centralized function to get the definitive summary
      const summary = calculateTotals(
        transformedItems,
        order.type as TOrderType
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
    });
  }, [filteredData]);

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
        header: () => <Box fontWeight={"Black"}>Nom</Box>,
      },
      {
        accessorKey: "contact",
        header: () => <Box fontWeight={"Black"}>Contacto</Box>,
      },
      {
        accessorKey: "items",
        header: () => <Box fontWeight={"Black"}>Article</Box>,
      },
      {
        accessorKey: "totalPrice",
        header: () => <Box fontWeight={"Black"}>Prix ​​total</Box>,
        cell: ({ row }: { row: Row<TableData> }) => (
          <Box>Ref {row.original.totalPrice.toFixed(2)}</Box>
        ),
      },
      {
        accessorKey: "status",
        header: () => <Box fontWeight={"Black"}>Statut</Box>,
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
                ? "Accepté"
                : status === "confirmed"
                ? "Accepté"
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
          {stateData.map((item, ix) => {
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

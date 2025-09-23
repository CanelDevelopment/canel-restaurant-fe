// Imports
import {
  Box,
  Center,
  Flex,
  Select,
  Portal,
  createListCollection,
  Input,
  Button,
  Spinner,
  Text,
} from "@chakra-ui/react";
import { DashLogoButtons } from "../dashlogobuttons";
import type { Row } from "@tanstack/react-table";
import { format } from "date-fns";
import { DynamicTable } from "../../table/dynamictable";
import { IncomingOrdersModal } from "./incomingordersmodal";
import { useState, useMemo } from "react";
import { DashboardHeading } from "../dashboardHeading";
import {
  useFetchAllOrders,
  type OrderDetails,
} from "@/hooks/order/usefetchallorder";
import { useFetchBranch } from "@/hooks/branch/usefetchbranch";
import { exportToPDF } from "@/lib/exporttopdf";
import {
  calculateTotals,
  type CalculationItem,
} from "@/store/calculationStore";
import type { TOrderType } from "@/components/order/orderPayment";

export type Data = {
  ref: string;
  name: string;
  contact: string;
  item: string;
  branchName: string;
  deliveryType: string;
  totalPrice: number;
  instruction: string;
  discount: number;
  date: Date;
  status: string; // expanded status types
};

export type TableData = Data & {
  originalOrder: OrderDetails;
};

export const IncomingOrdersHeader = () => {
  const {
    data: branches,
    isLoading: isBranchesLoading,
    isError: isBranchesError,
  } = useFetchBranch();

  const [selectedBranchId, setSelectedBranchId] = useState<string>("all");
  const [selectedBranchText, setSelectedBranchText] =
    useState<string>("All Branches");
  const [globalFilter, setGlobalFilter] = useState("");
  const [selectedStatus, setSelectedStatus] = useState<string>("all");

  const {
    data: orders,
    isLoading: isOrdersLoading,
    isError: isOrdersError,
    refetch: refetchOrders,
  } = useFetchAllOrders();

  const branchOptions = createListCollection({
    items: [
      { key: "all", textValue: "All Branches", children: "All Branches" },
      ...(branches?.map((branch) => ({
        key: branch.id,
        textValue: branch.name,
        children: branch.name,
      })) || []),
    ],
  });

  const isLoading = isOrdersLoading || isBranchesLoading;
  const isError = isOrdersError || isBranchesError;

  const formattedData = useMemo<TableData[]>(() => {
    if (!Array.isArray(orders) || !Array.isArray(branches)) return [];

    const branchNameMap = new Map(branches.map((b) => [b.id, b.name]));

    return orders
      .filter(
        (order) =>
          (selectedBranchId === "all" || order.branchId === selectedBranchId) &&
          (order.id.toLowerCase().includes(globalFilter.toLowerCase()) ||
            order.name.toLowerCase().includes(globalFilter.toLowerCase()) ||
            order.phoneNumber.includes(globalFilter)) &&
          (selectedStatus === "all" ||
            order.status.toLowerCase() === selectedStatus.toLowerCase())
      )
      .map((order: OrderDetails): TableData => {
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

        const allInstructions = order.orderItems
          .filter((item) => item.instructions)
          .map((item) => item.instructions)
          .join("; ");

        const transformedItems: CalculationItem[] = order.orderItems.map(
          (item) => ({
            quantity: item.quantity,
            product: {
              id: item.id || "unknown",
              name: item.productName,
              price: item.price,
              discount: item.discount,
            },
            selectedAddons:
              item.orderAddons?.map((addon) => ({
                quantity: addon.quantity,
                addonItem: {
                  id: addon.addonItem?.id || "unknown",
                  name: addon.addonItem?.name || "Addon",
                  price: addon.price, // Use the snapshot price from orderAddon
                  discount: addon.addonItem?.discount,
                },
              })) || [],
          })
        );

        const summary = calculateTotals(
          transformedItems,
          order.type as TOrderType
        );

        const totalPrice = summary.finalTotal;

        const branchName = branchNameMap.get(order.branchId) || "Unknown";

        return {
          ref: order.id,
          name: order.name,
          contact: order.phoneNumber,
          item: itemNames,
          branchName,
          deliveryType: order.type,
          discount: summary.discount,
          totalPrice,
          instruction: allInstructions || "None",
          date: new Date(order.createdAt),
          status: order.status,
          originalOrder: order,
        };
      });
  }, [orders, branches, selectedBranchId, globalFilter, selectedStatus]);

  const handleExportPDF = () => {
    const exportData = formattedData.map((order) => [
      order.ref.slice(0, 6).toUpperCase(),
      order.name,
      order.contact,
      order.item,
      order.branchName,
      order.deliveryType,
      order.totalPrice.toFixed(2),
      order.status,
      format(new Date(order.date), "MMM d, yyyy"),
    ]);

    exportToPDF({
      title: "Pedidos Entrantes",
      filename: "pedidos_entrantes.pdf",
      columns: [
        "Ref#",
        "Nombre",
        "Contacto",
        "Artículos",
        "Sucursal",
        "Entrega",
        "Precio Total",
        "Estado",
        "Fecha",
      ],
      data: exportData,
    });
  };

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
        cell: ({ row }: { row: Row<TableData> }) => (
          <Box className="capitalize truncate">{row.original.name}</Box>
        ),
      },
      {
        accessorKey: "contact",
        header: () => <Box fontWeight={"Black"}>Contacto</Box>,
        cell: ({ row }: { row: Row<TableData> }) => (
          <Box className="truncate">{row.original.contact}</Box>
        ),
      },
      {
        accessorKey: "item",
        header: () => <Box fontWeight={"Black"}>Artículos</Box>,
        cell: ({ row }: { row: Row<TableData> }) => (
          <Box className="truncate">{row.original.item}</Box>
        ),
      },
      {
        accessorKey: "branchName",
        header: () => <Box fontWeight={"Black"}>Sucursal</Box>,
        cell: ({ row }: { row: Row<TableData> }) => (
          <Box>{row.original.branchName}</Box>
        ),
      },
      {
        accessorKey: "deliveryType",
        header: () => <Box fontWeight={"Black"}>Entrega</Box>,
        cell: ({ row }: { row: Row<TableData> }) => (
          <Box className="capitalize">{row.original.deliveryType}</Box>
        ),
      },
      {
        accessorKey: "totalPrice",
        header: () => <Box fontWeight={"Black"}>Precio Total</Box>,
        cell: ({ row }: { row: Row<TableData> }) => (
          <Box>Ref. {row.original.totalPrice.toFixed(2)}</Box>
        ),
      },
      {
        accessorKey: "status",
        header: () => <Box fontWeight={"Black"}>Estado</Box>,
        cell: ({ row }: { row: Row<TableData> }) => {
          const status = row.original.status;
          const orderForRow = row.original.originalOrder;

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
            <Flex alignItems="center" gap={2}>
              <Text
                bg={getStatusColor(status)}
                color="white"
                rounded="md"
                w="7rem"
                h="2.5rem"
                display="flex"
                alignItems="center"
                justifyContent="center"
                textTransform="capitalize"
              >
                {status === "accepted_by_rider"
                  ? "Accepté"
                  : status === "confirmed"
                  ? "Accepté"
                  : status}
              </Text>
              <IncomingOrdersModal
                order={orderForRow}
                branchName={row.original.branchName}
              />
            </Flex>
          );
        },
      },
      {
        accessorKey: "date",
        header: () => <Box fontWeight={"Black"}>Fecha</Box>,
        cell: ({ row }: { row: Row<TableData> }) => (
          <Box>{format(new Date(row.original.date), "MMM d, yyyy")}</Box>
        ),
      },
    ],
    []
  );

  if (isLoading) {
    return (
      <Center h="60vh">
        <Spinner size="xl" />
      </Center>
    );
  }

  if (isError) {
    return (
      <Center h="60vh">
        <Text color="red.500" fontSize="xl">
          Failed to load incoming orders.
        </Text>
      </Center>
    );
  }

  return (
    <Box bg="white">
      <DashLogoButtons />
      <DashboardHeading title="PEDIDOS ENTRANTES" />

      <Box px={[0, 0, 8]} pb={3} bg="#f3f3f3">
        <Flex p={6} gap={4} direction="column" bg="white">
          <Flex gap={4} direction={["column", "row"]}>
            <Select.Root
              collection={branchOptions}
              onValueChange={(details) => {
                const selectedItem = branchOptions.items.find(
                  (item) => item.key === details?.value[0]
                );
                if (selectedItem) {
                  setSelectedBranchId(selectedItem.key);
                  setSelectedBranchText(selectedItem.textValue);
                }
              }}
            >
              <Select.HiddenSelect />
              <Select.Control>
                <Select.Trigger bg="#ebebeb" h="42px" border="none">
                  <Select.ValueText placeholder="Seleccionar Sucursal">
                    {selectedBranchText}
                  </Select.ValueText>
                  <Select.Indicator color={"#575757"} />
                </Select.Trigger>
              </Select.Control>
              <Portal>
                <Select.Positioner zIndex={2000}>
                  <Select.Content zIndex={2000}>
                    {branchOptions.items.map((item) => (
                      <Select.Item key={item.key} item={item.key}>
                        {item.textValue}
                        <Select.ItemIndicator />
                      </Select.Item>
                    ))}
                  </Select.Content>
                </Select.Positioner>
              </Portal>
            </Select.Root>

            <Input
              bg="#ebebeb"
              type="search"
              placeholder="Buscar por Ref#, Nom..."
              value={globalFilter}
              onChange={(e) => setGlobalFilter(e.target.value)}
              fontFamily="AmsiProCond"
            />
          </Flex>

          <Flex gap={4} wrap="wrap">
            <Button
              bg="Cgreen"
              width={["100%", "150px"]}
              rounded="md"
              color="Cbutton"
              fontFamily="AmsiProCond"
              pb={1}
              onClick={() => {
                refetchOrders();
              }}
            >
              Recharger les commandes
            </Button>
            <Button
              onClick={handleExportPDF}
              bg="Cgreen"
              color="Cbutton"
              pb={1.5}
            >
              Exportar Detalles
            </Button>
          </Flex>
        </Flex>

        {/* ✅ Pass status filter to table */}
        <DynamicTable
          showSearch={false}
          headerColor="#F8FBEF"
          data={formattedData}
          columns={columns}
          selectedStatus={selectedStatus}
          setSelectedStatus={setSelectedStatus}
        />
      </Box>
    </Box>
  );
};

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
import { useState, useMemo, useEffect } from "react";
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
import {
  getCoordinatesFromAddress,
  getDistanceInKm,
  getDeliveryPrice,
} from "@/helper/calculationofdistance";

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
  status: string;
};

export type TableData = Data & {
  originalOrder: OrderDetails;
};

// --- FIX: Increased to 15 to force the scrollbar to appear in the 70vh container ---
const ITEMS_PER_PAGE = 15;

export const IncomingOrdersHeader = () => {
  const {
    data: branches,
    isLoading: isBranchesLoading,
    isError: isBranchesError,
  } = useFetchBranch();

  const [selectedBranchId, setSelectedBranchId] = useState<string>("all");
  const [selectedBranchText, setSelectedBranchText] =
    useState<string>("Sucursales");
  const [globalFilter, setGlobalFilter] = useState("");
  const [selectedStatus, setSelectedStatus] = useState<string>("all");
  const [visibleCount, setVisibleCount] = useState(ITEMS_PER_PAGE);

  const {
    data: orders,
    isLoading: isOrdersLoading,
    isError: isOrdersError,
  } = useFetchAllOrders();

  const branchOptions = createListCollection({
    items: [
      {
        key: "all",
        textValue: "Sucursales",
        children: "Sucursales",
      },
      ...(branches?.map((branch) => ({
        key: branch.id,
        textValue: branch.name,
        children: branch.name,
      })) || []),
    ],
  });

  const branchRatesMap = useMemo(() => {
    const map: Record<string, any> = {};
    branches?.forEach((b) => {
      map[b.id] = b.deliveryRates;
    });
    return map;
  }, [branches]);

  const isLoading = isOrdersLoading || isBranchesLoading;
  const isError = isOrdersError || isBranchesError;

  const [fullFilteredData, setTableData] = useState<TableData[]>([]);

  const filteredOrders = useMemo(() => {
    if (!Array.isArray(orders)) return [];

    return orders.filter(
      (order) =>
        (selectedBranchId === "all" || order.branchId === selectedBranchId) &&
        (order.id.toLowerCase().includes(globalFilter.toLowerCase()) ||
          order.name.toLowerCase().includes(globalFilter.toLowerCase()) ||
          order.phoneNumber.includes(globalFilter)) &&
        (selectedStatus === "all" ||
          order.status.toLowerCase() === selectedStatus.toLowerCase())
    );
  }, [orders, selectedBranchId, globalFilter, selectedStatus]);

  useEffect(() => {
    if (!branches || !filteredOrders.length) {
      if (filteredOrders.length === 0) setTableData([]);
      return;
    }

    async function processTableData() {
      const branchNameMap = new Map(branches?.map((b) => [b.id, b.name]));

      const calculatedRows = await Promise.all(
        filteredOrders.map(async (order: OrderDetails): Promise<TableData> => {
          const itemNames = order.orderItems
            .map((item) => {
              const addons =
                item.orderAddons && item.orderAddons.length > 0
                  ? " + " +
                    item.orderAddons
                      .map(
                        (addon) =>
                          `${addon.addonItem?.name || "Complemento"} (x${
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
            (item) => {
              const product = (item as any).product || {};
              const category = product.category || {};
              return {
                quantity: item.quantity,
                product: {
                  id: item.id || "unknown",
                  name: item.productName,
                  price: Number(item.price),
                  discount: Number(item.discount || 0),
                  categoryId: product.categoryId || category.id,
                  volumeDiscountRules: category.volumeDiscountRules,
                },
                selectedAddons:
                  item.orderAddons?.map((addon) => ({
                    quantity: addon.quantity,
                    addonItem: {
                      id: addon.addonItem?.id || "unknown",
                      name: addon.addonItem?.name || "Complemento",
                      price: Number(addon.price),
                      discount: Number(addon.addonItem?.discount || 0),
                    },
                  })) || [],
              };
            }
          );

          let deliveryPrice = 0;

          if (order.type === "delivery" && order.location) {
            const branch = branches?.find((b) => b.id === order.branchId);

            if (branch?.location) {
              try {
                const locRaw = branch.location as any;
                let branchLat = 0;
                let branchLng = 0;

                if (typeof locRaw === "string") {
                  const parsed = JSON.parse(locRaw);
                  if (Array.isArray(parsed)) {
                    branchLat = parsed[0];
                    branchLng = parsed[1];
                  } else {
                    branchLat = parsed.lat;
                    branchLng = parsed.lng;
                  }
                } else {
                  branchLat = locRaw.lat;
                  branchLng = locRaw.lng;
                }

                const branchLocation = {
                  lat: Number(branchLat),
                  lng: Number(branchLng),
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
                  const deliveryRates = branchRatesMap[order.branchId] || [];
                  deliveryPrice = getDeliveryPrice(distance, deliveryRates);
                }
              } catch (error) {
                console.error("Error calc delivery for table", error);
              }
            }
          }

          const summary = calculateTotals(
            transformedItems,
            order.type as TOrderType,
            deliveryPrice
          );

          const branchName = branchNameMap.get(order.branchId) || "Desconocida";

          return {
            ref: order.id,
            name: order.name,
            contact: order.phoneNumber,
            item: itemNames,
            branchName,
            deliveryType: order.type,
            discount: summary.discount,
            totalPrice: summary.finalTotal,
            instruction: allInstructions || "Ninguna",
            date: new Date(order.createdAt),
            status: order.status,
            originalOrder: order,
          };
        })
      );

      setTableData(calculatedRows);
    }

    processTableData();
  }, [filteredOrders, branches, branchRatesMap]);

  useEffect(() => {
    setVisibleCount(ITEMS_PER_PAGE);
  }, [selectedBranchId, globalFilter, selectedStatus]);

  const displayedOrders = useMemo(() => {
    return fullFilteredData.slice(0, visibleCount);
  }, [fullFilteredData, visibleCount]);

  const hasMore = visibleCount < fullFilteredData.length;

  const loadMoreOrders = () => {
    if (hasMore) {
      // Load 10 more at a time
      setVisibleCount((prev) => prev + 10);
    }
  };

  const handleExportPDF = () => {
    const exportData = fullFilteredData.map((order) => [
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
        header: () => <Box fontWeight={"Black"}>Nombre</Box>,
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
              case "accepted_by_rider":
              case "confirmed":
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
                  ? "Aceptado"
                  : status === "confirmed"
                  ? "Aceptado"
                  : status === "delivered"
                  ? "Entregado"
                  : status === "pending"
                  ? "Pendiente"
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
          Error al cargar los pedidos entrantes.
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
                  <Select.ValueText placeholder="Sucursal">
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
              placeholder="Buscar por Ref#, Nombre..."
              value={globalFilter}
              onChange={(e) => setGlobalFilter(e.target.value)}
              fontFamily="AmsiProCond"
            />
          </Flex>

          <Flex gap={4} wrap="wrap" align="center">
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

        {/* DynamicTable is unchanged, but now receives enough data to scroll */}
        <DynamicTable
          showSearch={false}
          headerColor="#F8FBEF"
          data={displayedOrders}
          columns={columns}
          selectedStatus={selectedStatus}
          setSelectedStatus={setSelectedStatus}
          onLoadMore={loadMoreOrders}
          hasMore={hasMore}
          isLoading={false}
        />
      </Box>
    </Box>
  );
};

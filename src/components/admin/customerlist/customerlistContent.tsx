import { Box, Button, Center, Checkbox, Flex } from "@chakra-ui/react";
import type React from "react";
import { useEffect, useState } from "react";
import AdvancedSearchModal from "./advancedSearchModal";
import BroadcastModal from "./broadcastModal";
import { DynamicTable } from "../table/dynamictable";
import { authClient } from "@/provider/user.provider";
import toast from "react-hot-toast";
import { useFetchAllOrders } from "@/hooks/order/usefetchallorder";
import { useFetchAllUsers } from "@/hooks/user/usefetchalluser";
import { exportToPDF } from "@/lib/exporttopdf";

type CustomerRow = {
  id: string;
  ref: string;
  name: string;
  email: string;
  phoneNumber?: string | null;
  address: string;
  nooforders: number;
  orderref: string;
  blacklist: boolean;
  createdAt: string;
};

type SearchCriteria = {
  amountSpendCondition: string;
  amountSpendValue: string;
  numOrdersCondition: string;
  numOrdersValue: string;
  blacklistStatus: "all" | "blacklisted" | "not_blacklisted";
};

export const CustomerListContent: React.FC = () => {
  const [masterCustomerData, setMasterCustomerData] = useState<CustomerRow[]>(
    []
  );
  const [filteredCustomerData, setFilteredCustomerData] = useState<
    CustomerRow[]
  >([]);
  const [updatingUserId, setUpdatingUserId] = useState<string | null>(null);
  const { data: allOrders, isLoading: isLoadingOrders } = useFetchAllOrders();
  const { data: allUsers = [] } = useFetchAllUsers();

  const [displayedData, setDisplayedData] = useState<CustomerRow[]>([]);
  const [visibleCount, setVisibleCount] = useState(15);
  const [hasMore, setHasMore] = useState(true);

  const handleBanToggle = async (userId: string, currentStatus: boolean) => {
    setUpdatingUserId(userId);
    const updater = (data: CustomerRow[]) =>
      data.map((user) =>
        user.id === userId ? { ...user, blacklist: !currentStatus } : user
      );
    setMasterCustomerData(updater);
    setFilteredCustomerData(updater);

    try {
      if (currentStatus) {
        await authClient.admin.unbanUser({ userId });
        toast.success("¡Usuario desbloqueado exitosamente!");
      } else {
        await authClient.admin.banUser({ userId });
        toast.success("¡Usuario bloqueado exitosamente!");
      }
    } catch (err) {
      toast.error("Error al actualizar el estado del usuario.");
      const reverter = (data: CustomerRow[]) =>
        data.map((user) =>
          user.id === userId ? { ...user, blacklist: currentStatus } : user
        );
      setMasterCustomerData(reverter);
      setFilteredCustomerData(reverter);
      console.error("Error al bloquear/desbloquear usuario:", err);
    } finally {
      setUpdatingUserId(null);
    }
  };

  const handleExportPDF = () => {
    const exportData = filteredCustomerData.map((user) => [
      user.ref.slice(0, 6).toUpperCase(),
      user.name,
      user.phoneNumber,
      user.nooforders,
      user.ref,
      user.address,
      user.orderref,
      user.blacklist ? "Sí" : "No",
    ]);

    const columns = [
      "Ref#",
      "Nombre",
      "Contacto",
      "Artículos",
      "Sucursal",
      "Entrega",
      "Precio Total",
      "Estado",
    ];
    exportToPDF({
      title: "Lista de Clientes",
      filename: "lista_clientes.pdf",
      columns: columns,
      data: exportData,
    });
  };

  const columns = [
    { accessorKey: "ref", header: "Ref#" },
    { accessorKey: "name", header: "Nombre" },
    { accessorKey: "email", header: "E-mail" },
    { accessorKey: "contactnumber", header: "Número de Contacto" },
    { accessorKey: "address", header: "Dirección" },
    { accessorKey: "nooforders", header: "Nro. de Pedidos" },
    { accessorKey: "orderref", header: "Total Gastado" },
    {
      accessorKey: "blacklist",
      header: "Lista Negra",
      cell: ({ row }: { row: any }) => {
        const user = row.original as CustomerRow;
        return (
          <Checkbox.Root
            colorPalette={"green"}
            checked={user.blacklist}
            onCheckedChange={() => handleBanToggle(user.id, user.blacklist)}
            disabled={updatingUserId === user.id}
          >
            <Checkbox.HiddenInput />
            <Checkbox.Control
              bgColor={"#EBEBEB"}
              rounded={"md"}
              borderColor={"#949494"}
              color={"green"}
              cursor={updatingUserId === user.id ? "not-allowed" : "pointer"}
            />
          </Checkbox.Root>
        );
      },
    },
  ];

  useEffect(() => {
    const processCustomerData = () => {
      if (!allOrders || !allUsers) return;

      const customers = allUsers.filter(
        (u: { role: string }) => u.role.toLowerCase() === "user"
      );
      const orderCounts = new Map<string, number>();
      const totalSpent = new Map<string, number>();
      const latestOrderInfo = new Map<
        string,
        {
          phoneNumber: string;
          location: string;
          createdAt: Date;
          fullName: string;
        }
      >();

      for (const order of allOrders) {
        if (!order.userId) continue;

        const count = orderCounts.get(order.userId) || 0;

        orderCounts.set(order.userId, count + 1);

        let currentOrderTotal = 0;

        for (const item of order.orderItems) {
          const price = item.price;

          if (!isNaN(price)) {
            currentOrderTotal += price * item.quantity;
          }
        }

        const userTotal = totalSpent.get(order.userId) || 0;

        totalSpent.set(order.userId, userTotal + currentOrderTotal);

        const existingInfo = latestOrderInfo.get(order.userId);

        const currentOrderDate = new Date(order.createdAt);

        if (!existingInfo || currentOrderDate > existingInfo.createdAt) {
          latestOrderInfo.set(order.userId, {
            phoneNumber: order.phoneNumber,
            location: order.location,
            createdAt: currentOrderDate,
            fullName: order.name,
          });
        }
      }

      const mappedCustomers: CustomerRow[] = customers.map((user: any) => {
        const orderInfo = latestOrderInfo.get(user.id);

        return {
          id: user.id,
          ref: user.id.slice(0, 6).toUpperCase(),
          name: orderInfo?.fullName || user.fullName || "Sin Nombre",
          email: user.email,
          contactnumber:
            orderInfo?.phoneNumber ||
            user.phoneNumber ||
            "N/A" ||
            user.contactnumber,
          address: orderInfo?.location || "N/A",
          nooforders: orderCounts.get(user.id) || 0,
          orderref: `$${(totalSpent.get(user.id) || 0).toFixed(2)}`,
          blacklist: user.banned || false,
          createdAt: user.createdAt,
        };
      });

      setMasterCustomerData(mappedCustomers);
      setFilteredCustomerData(mappedCustomers);
    };
    processCustomerData();
  }, [allOrders, allUsers]);

  const handleSearch = (criteria: SearchCriteria) => {
    let filtered = [...masterCustomerData];
    console.log(criteria);
    const amountVal = parseFloat(criteria.amountSpendValue);
    if (!isNaN(amountVal)) {
      filtered = filtered.filter((customer) => {
        const spent = parseFloat(customer.orderref.replace(/[^0-9.-]+/g, ""));
        if (criteria.amountSpendCondition === "more") return spent > amountVal;
        if (criteria.amountSpendCondition === "exact")
          return spent === amountVal;
        if (criteria.amountSpendCondition === "less") return spent < amountVal;
        return true;
      });
    }

    const ordersVal = parseInt(criteria.numOrdersValue, 10);
    if (!isNaN(ordersVal)) {
      filtered = filtered.filter((customer) => {
        const orders = customer.nooforders;
        if (criteria.numOrdersCondition === "more") return orders > ordersVal;
        if (criteria.numOrdersCondition === "exact")
          return orders === ordersVal;
        if (criteria.numOrdersCondition === "less") return orders < ordersVal;
        return true;
      });
    }

    if (criteria.blacklistStatus === "blacklisted") {
      filtered = filtered.filter((customer) => customer.blacklist === true);
    } else if (criteria.blacklistStatus === "not_blacklisted") {
      filtered = filtered.filter((customer) => customer.blacklist === false);
    }

    setFilteredCustomerData(filtered);
  };

  useEffect(() => {
    if (filteredCustomerData.length > 0) {
      const initialData = filteredCustomerData.slice(0, 5);
      setDisplayedData(initialData);
      setVisibleCount(5);
      setHasMore(filteredCustomerData.length > 5);
    }
  }, [filteredCustomerData]);

  const handleLoadMore = () => {
    const nextCount = visibleCount + 10;
    const newData = filteredCustomerData.slice(0, nextCount);
    setDisplayedData(newData);
    setVisibleCount(nextCount);
    setHasMore(nextCount < filteredCustomerData.length);
  };

  return (
    <>
      <Box bgColor={"#FFF"}>
        <Center
          gap={4}
          alignItems={["start", "start", "center", "center"]}
          justifyContent={"space-between"}
          px={[3, 3, 5]}
          py={4}
          flexDirection={["column", "column", "row"]}
          w={"full"}
        >
          <Flex
            w={"full"}
            flexDirection={["column", "row"]}
            justifyContent={["flex-start", "space-between"]}
            alignItems={"flex-start"}
            gapY={3}
          >
            <AdvancedSearchModal onSearch={handleSearch} />
            <Box
              display={"flex"}
              flexDirection={["column", "row"]}
              gapY={3}
              gapX={5}
            >
              <BroadcastModal />
              <Button
                bgColor={"#000"}
                color={"#fff"}
                minW={"120px"}
                rounded={"md"}
                pb={1}
                onClick={handleExportPDF}
              >
                Exportar
              </Button>
            </Box>
          </Flex>
        </Center>

        <DynamicTable
          showsimpleSearch={true}
          placeholderprops="Buscar"
          data={displayedData}
          columns={columns}
          isLoading={isLoadingOrders}
          hasMore={hasMore}
          onLoadMore={handleLoadMore}
        />
      </Box>
    </>
  );
};

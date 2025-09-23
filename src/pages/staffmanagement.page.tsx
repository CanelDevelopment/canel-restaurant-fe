import { DashboardHeading } from "@/components/admin/dashboard/dashboardHeading";
import { DashLogoButtons } from "@/components/admin/dashboard/dashlogobuttons";
import { DynamicTable } from "@/components/admin/table/dynamictable";
import { Box, Checkbox, Center, Text } from "@chakra-ui/react";
import { useEffect, useState, type JSX } from "react";
import { FoodHeader } from "@/components/admin/foodcategory/foodheader";
import { useFetchStaff } from "@/hooks/user/usefetchstaff";
import { useDeleteStaff } from "@/hooks/user/usedeletestaff";
import { type StaffMember } from "@/hooks/user/usefetchstaff";
import { EditStaffModal } from "@/components/admin/staffmanagement/editstaffmodal";
type TableRow = {
  checked: JSX.Element;
  name: string;
  role: string;
  status: string;
  lastLogin: string;
  dateCreated: string;
  controls?: ("Editar" | "Eliminar")[];
  id: string; // This type requires 'id' to be a string
};

const StaffManagement = () => {
  const [userRows, setUserRows] = useState<TableRow[]>([]);
  const [searchQuery, _setSearchQuery] = useState("");
  const { data: staffData, isLoading } = useFetchStaff(searchQuery);
  const { mutate: deleteStaff } = useDeleteStaff();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedStaff, setSelectedStaff] = useState<StaffMember | null>(null);

  const handleEditClick = (staff: StaffMember) => {
    console.log("STAFFF:-", staff);
    setSelectedStaff(staff);
    setIsModalOpen(true);
  };

  const columns = [
    {
      accessorKey: "checked",
      id: "checked",
      header: ({ table }: { table: any }) => (
        <Checkbox.Root
          checked={table.getIsAllPageRowsSelected()}
          onCheckedChange={() => table.toggleAllPageRowsSelected()}
          data-state={
            table.getIsSomePageRowsSelected() &&
            !table.getIsAllPageRowsSelected()
              ? "indeterminate"
              : undefined
          }
        >
          <Checkbox.HiddenInput />
          <Checkbox.Control bgColor={"#fff"} rounded={"md"} color={"green"}>
            <Checkbox.Indicator />
          </Checkbox.Control>
        </Checkbox.Root>
      ),
      cell: ({ row }: { row: any }) => (
        <Checkbox.Root
          checked={row.getIsSelected()}
          onCheckedChange={() => row.toggleSelected()}
          disabled={!row.getCanSelect()}
          data-state={
            row.getIsSomeSelected() && !row.getIsSelected()
              ? "indeterminate"
              : undefined
          }
        >
          <Checkbox.HiddenInput />
          <Checkbox.Control
            bgColor={"rgba(148, 148, 148, 0.2)"}
            border={"0.5px solid rgba(148, 148, 148, 1))"}
            rounded={"md"}
            color={"green"}
          >
            <Checkbox.Indicator />
          </Checkbox.Control>
        </Checkbox.Root>
      ),
      size: 20,
    },
    {
      accessorKey: "name",
      header: "Nom",
      key: "name",
      cell: ({ row }: { row: any }) => (
        <div className="flex flex-col gap-1 group">
          <Text>{row.original.name}</Text>
          {row.original.controls && (
            <div className="flex gap-2 text-sm invisible group-hover:visible transition-all duration-200">
              <Text
                textDecoration={"underline"}
                color={"#4394D7"}
                cursor={"pointer"}
                onClick={() => handleEditClick(row.original)}
              >
                Editar
              </Text>
              <Text
                textDecoration={"underline"}
                color={"#FF5E5E"}
                cursor={"pointer"}
                onClick={() => {
                  // This is where the ID is used. It must not be undefined.
                  console.log("ATTEMPTING TO DELETE WITH ID:", row.original.id);
                  if (row.original.id) {
                    deleteStaff({ id: row.original.id });
                  } else {
                    console.error("DELETE FAILED: ID is undefined!");
                  }
                }}
              >
                Eliminar
              </Text>
            </div>
          )}
        </div>
      ),
    },
    { accessorKey: "role", header: "Rôle", key: "role" },
    { accessorKey: "status", header: "statut", key: "status" },
    {
      accessorKey: "dateCreated",
      header: "Fecha de Creación",
      key: "dateCreated",
    },
  ];

  useEffect(() => {
    if (staffData && Array.isArray(staffData)) {
      const mappedUsers: TableRow[] = staffData.map((user: any) => {
        return {
          id: user.id,
          name: user.name || "Desconocido",
          role: user.role || "Otros",
          status: user.banned ? "Inactivo" : "Activo",
          lastLogin: user.lastLogin || "—",
          dateCreated: new Date(user.createdAt).toLocaleDateString(),
          controls: ["Editar", "Eliminar"],
          checked: <></>, // Add a placeholder for the checked property
        };
      });

      setUserRows(mappedUsers);
    } else {
      setUserRows([]);
    }
  }, [staffData]);

  return (
    <>
      <Box width={["100%"]} bg="#f3f3f3">
        <DashLogoButtons />
        <DashboardHeading title="GESTIÓN DE PERSONAL" />
        <Box px={[0, 0, 8]} rounded={"none"}>
          <Center
            gap={4}
            alignItems={["start", "start", "center", "center"]}
            justifyContent={"space-between"}
            py={7}
            flexDirection={["column", "column", "row"]}
            bgColor={"#FFF"}
          >
            <FoodHeader link="/dashboard/staff_management/add_new_staff" />
          </Center>
        </Box>
        <Box px={[0, 8]}>
          <DynamicTable
            showsimpleSearch={true}
            placeholderprops="Buscar por rol y nom"
            data={userRows}
            columns={columns}
            isLoading={isLoading}
          />
        </Box>
      </Box>
      <EditStaffModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        staffMember={selectedStaff}
      />
    </>
  );
};

export default StaffManagement;

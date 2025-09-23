import { DashboardHeading } from "@/components/admin/dashboard/dashboardHeading";
import { DashLogoButtons } from "@/components/admin/dashboard/dashlogobuttons";
import { DynamicTable } from "@/components/admin/table/dynamictable";
import { Box, Checkbox, Button, Center, Text, Flex } from "@chakra-ui/react";
import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { FaPlus } from "react-icons/fa";
import { useFetchBranch } from "@/hooks/branch/usefetchbranch";
import { useDeleteBranch } from "@/hooks/branch/usedeletebranch";
import { EditBranchModal } from "@/components/admin/branchmanagement/editbranchmodal";

type BranchDataForModal = {
  id: string;
  name: string;
  address: string;
  cityId: string | null;
  managerId: string | null;
  status: boolean;
  operatingHours: string;
  phoneNumber: string;
};

// This type is for the data structure that the TABLE displays
type BranchForTable = {
  id: string;
  branchName: string;
  location: string;
  manager: string;
  status: "Activo" | "Inactivo";
  operatingHours: string;
  contact: string;
  rawBranchData: BranchDataForModal;
};

const BranchManagement = () => {
  const { data: branchData, isLoading, isError } = useFetchBranch();
  const { mutate: deleteBranch } = useDeleteBranch();

  const [isEditModalOpen, setEditModalOpen] = useState(false);
  const [selectedBranch, setSelectedBranch] =
    useState<BranchDataForModal | null>(null);
  const [tableData, setTableData] = useState<BranchForTable[]>([]);

  const handleEditClick = (branch: BranchDataForModal) => {
    setSelectedBranch(branch);
    setEditModalOpen(true);
  };

  const handleCloseModal = () => {
    setEditModalOpen(false);
    setSelectedBranch(null);
  };

  const columns = [
    {
      id: "select",
      header: ({ table }: { table: any }) => (
        <Checkbox.Root
          checked={table.getIsAllPageRowsSelected()}
          onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
          size={"lg"}
        >
          <Checkbox.HiddenInput />{" "}
          <Checkbox.Control
            border={"0.5px solid #949494"}
            rounded={"md"}
            bgColor={"#F6F6F6"}
          />
        </Checkbox.Root>
      ),
      cell: ({ row }: { row: any }) => (
        <Checkbox.Root
          checked={row.getIsSelected()}
          onCheckedChange={(value) => row.toggleSelected(!!value)}
          size={"lg"}
        >
          <Checkbox.HiddenInput />{" "}
          <Checkbox.Control
            border={"0.5px solid #949494"}
            rounded={"md"}
            bgColor={"#F6F6F6"}
          />
        </Checkbox.Root>
      ),
      size: 20,
    },
    {
      accessorKey: "branchName",
      header: "Nom",
      cell: ({ row }: { row: any }) => (
        <div className="flex flex-col gap-1 group">
          <Text>{row.original.branchName}</Text>
          <div className="flex gap-2 text-sm invisible group-hover:visible transition-all duration-200">
            {/* 5. Attach the edit handler to the "Editar" button */}
            <Text
              textDecoration={"underline"}
              color={"#4394D7"}
              cursor={"pointer"}
              onClick={() => handleEditClick(row.original.rawBranchData)}
            >
              Editar
            </Text>
            <Text
              textDecoration={"underline"}
              color={"#FF5E5E"}
              cursor={"pointer"}
              onClick={() => deleteBranch(row.original.id)}
            >
              Eliminar
            </Text>
          </div>
        </div>
      ),
    },
    {
      accessorKey: "location",
      header: "Ubicación",
      cell: ({ row }: { row: any }) => <Box>{row.original.location}</Box>,
      size: 200,
    },
    { accessorKey: "manager", header: "Gerente" },
    { accessorKey: "status", header: "Statut" },
    { accessorKey: "operatingHours", header: "Horario de Operación" },
    { accessorKey: "contact", header: "Contacto" },
  ];

  useEffect(() => {
    if (branchData) {
      const mappedBranches: BranchForTable[] = branchData.map(
        (branch: any) => ({
          // This is the formatted data for display in the table
          id: branch.id,
          branchName: branch.name || "N/A",
          location: `${branch.address || "Dirección no disponible"}, ${
            branch.city?.name || ""
          }`,
          manager: branch.manager?.fullName || "No Asignado",
          status: branch.status ? "Activo" : "Inactivo",
          operatingHours: branch.operatingHours || "No especificado",
          contact: branch.phoneNumber || "No disponible",
          // This is the raw data that the Edit Modal needs
          rawBranchData: {
            id: branch.id,
            name: branch.name,
            address: branch.address,
            cityId: branch.cityId,
            managerId: branch.manager ? branch.manager.id : "",
            status: branch.status,
            operatingHours: branch.operatingHours,
            phoneNumber: branch.phoneNumber,
          },
        })
      );
      setTableData(mappedBranches);
    }
  }, [branchData]);

  return (
    <>
      <Box width={["100%"]} bg="#f3f3f3">
        <DashLogoButtons />
        <DashboardHeading title="GESTIÓN DE SUCURSALES" />
        <Box px={[0, 0, 8]} rounded={"none"}>
          <Center
            gap={4}
            alignItems={["start", "start", "center", "center"]}
            justifyContent={"space-between"}
            px={[2, 0, 10]}
            py={7}
            flexDirection={["column", "column", "row"]}
            bgColor={"#FFF"}
          >
            <Flex gapX={4}>
              <Link to={"/dashboard/branch_management/add_new_branch"}>
                <Button
                  fontFamily={"AmsiProCond"}
                  bgColor={"Cgreen"}
                  color={"Cbutton"}
                  rounded={"md"}
                  fontSize={"md"}
                >
                  <FaPlus /> <Text mb={0.5}>Añadir Nuevo</Text>
                </Button>
              </Link>
            </Flex>
          </Center>
        </Box>
        <Box px={[0, 8]}>
          {isError ? (
            <Center h="400px" bg="white">
              <Text color="red.500">Error al cargar las sucursales.</Text>
            </Center>
          ) : (
            <DynamicTable
              showsimpleSearch={true}
              placeholderprops="Buscar por rol y nombre"
              data={tableData}
              columns={columns}
              isLoading={isLoading}
            />
          )}
        </Box>
      </Box>

      {/* 6. Render the EditBranchModal and pass it the state and handlers */}
      <EditBranchModal
        isOpen={isEditModalOpen}
        onClose={handleCloseModal}
        branch={selectedBranch}
      />
    </>
  );
};

export default BranchManagement;

import { DashboardHeading } from "@/components/admin/dashboard/dashboardHeading";
import { DashLogoButtons } from "@/components/admin/dashboard/dashlogobuttons";
import { DynamicTable } from "@/components/admin/table/dynamictable";
import { Box, Text, Checkbox, Button, Center, Image } from "@chakra-ui/react";
import { useMemo, useState } from "react"; // Import useMemo
import { FoodHeader } from "@/components/admin/foodcategory/foodheader";
import { useFetchAddon } from "@/hooks/addon/usefetchaddon";
import { useDeleteAddonitem } from "@/hooks/addon/usedeleteaddon";
import { EditAddonModal } from "@/components/admin/addon/editaddonmodal";
import { Tooltip } from "@/components/ui/tooltip";

export type AddonItemData = {
  id: string;
  name: string;
  description: string;
  addoncategory: string;
  price: number;
  image: string;
  date: string;
  pusblish: boolean;

  originalData: AddonDataForModal;
};

interface AddonDataForModal {
  id: string;
  name: string;
  description: string;
  price: number;
  image: string;
  addonCategoryId: string | null;
}

export const AddonItem = () => {
  // --- HOOKS ---
  const { data: addonItems, isLoading, isError } = useFetchAddon();
  const { mutate: deleteAddonItem } = useDeleteAddonitem();

  // --- STATE ---
  const [isEditModalOpen, setEditModalOpen] = useState(false);
  const [selectedAddon, setSelectedAddon] = useState<AddonDataForModal | null>(
    null
  );

  const [visibleCount, setVisibleCount] = useState(5);

  const loadMore = () => {
    setVisibleCount((prevCount) => prevCount + 5);
  };

  const handleOpenEditModal = (addon: AddonDataForModal) => {
    setSelectedAddon(addon);
    setEditModalOpen(true);
  };

  const handleCloseEditModal = () => {
    setEditModalOpen(false);
    setSelectedAddon(null);
  };

  const handleDelete = (addonId: string) => {
    deleteAddonItem(addonId);
  };

  const columns = [
    {
      id: "select",
      header: ({ table }: { table: any }) => (
        <Checkbox.Root
          checked={table.getIsAllRowsSelected()}
          onCheckedChange={(value) =>
            table.toggleAllRowsSelected(!!value.checked)
          }
          size="lg"
        >
          <Checkbox.HiddenInput />
          <Checkbox.Control
            border="0.5px solid #949494"
            rounded="md"
            bgColor="#F6F6F6"
          />
        </Checkbox.Root>
      ),
      cell: ({ row }: { row: any }) => (
        <Checkbox.Root
          checked={row.getIsSelected()}
          onCheckedChange={(value) => row.toggleSelected(!!value.checked)}
          size="lg"
        >
          <Checkbox.HiddenInput />
          <Checkbox.Control
            border="0.5px solid #949494"
            rounded="md"
            bgColor="#F6F6F6"
          />
        </Checkbox.Root>
      ),
    },
    {
      accessorKey: "name",
      header: "Nombre",
      cell: ({ row }: { row: any }) => (
        console.log(row.original.id),
        (
          <Box w="200px" className="flex flex-col gap-1 group">
            <Text>{row.original.name}</Text>
            <div className="flex gap-2 text-sm invisible group-hover:visible transition-all duration-200">
              <Text
                textDecoration="underline"
                color="#4394D7"
                cursor="pointer"
                onClick={() => handleOpenEditModal(row.original.originalData)}
              >
                Editar
              </Text>
              <Text
                textDecoration="underline"
                color="#FF5E5E"
                cursor="pointer"
                onClick={() => handleDelete(row.original.id)}
              >
                Eliminar
              </Text>
            </div>
          </Box>
        )
      ),
    },
    {
      accessorKey: "description",
      header: () => (
        <Box width="500px" textAlign="start">
          Descripción
        </Box>
      ),
      cell: ({ row }: { row: any }) => (
        <Box width="500px">
          <Tooltip content={row.original.description}>
            <Text truncate>{row.original.description}</Text>
          </Tooltip>
        </Box>
      ),
    },
    {
      accessorKey: "image",
      header: "Imagen",
      cell: ({ row }: { row: any }) => (
        <Box boxSize="50px">
          <Image
            src={row.original.image || "https://via.placeholder.com/50"}
            alt={row.original.name}
            borderRadius="md"
            objectFit="cover"
          />
        </Box>
      ),
    },
    {
      accessorKey: "addoncategory",
      header: "Categoría",
    },
    {
      accessorKey: "price",
      header: "Precio",
      cell: ({ row }: { row: any }) => (
        <Box w="120px">Ref {Number(row.original.price).toFixed(2)}</Box>
      ),
    },
    {
      accessorKey: "date",
      header: "Fecha",
      cell: ({ row }: { row: any }) => (
        <Box w="200px">
          <Text>
            {new Date(row.original.date).toLocaleDateString("fr-FR", {
              day: "2-digit",
              month: "2-digit",
              year: "numeric",
              hour: "2-digit",
              minute: "2-digit",
            })}
          </Text>
          <Button
            bgColor={row.original.pusblish ? "#199F50" : "#F48D1A"}
            color="#fff"
            rounded="lg"
            size="sm"
            mt={1}
          >
            {row.original.pusblish ? "Publicado" : "Pendiente"}
          </Button>
        </Box>
      ),
    },
  ];

  // 3. Use useMemo to slice and map the data efficiently
  const tableData: AddonItemData[] = useMemo(() => {
    return (addonItems?.slice(0, visibleCount) || []).map((item: any) => ({
      id: item.id,
      name: item.name,
      price: Number(item.price),
      description: item.description || "-",
      addoncategory: item.addon?.name ?? "Sin Categoría",
      date: item.createdAt,
      pusblish: true,
      image: item.image,
      originalData: {
        id: item.id,
        name: item.name,
        description: item.description || "-",
        price: Number(item.price),
        image: item.image,
        addonCategoryId: item.addon?.id || null,
      },
    }));
  }, [addonItems, visibleCount]);

  // 4. Determine if there are more items to load
  const hasMore = visibleCount < (addonItems?.length || 0);

  return (
    <>
      <Box width={["100%"]} bg="#f3f3f3">
        <DashLogoButtons />
        <DashboardHeading title="ARTÍCULO DE COMPLEMENTO" />
        <Box px={[0, 0, 8]} rounded="none">
          <FoodHeader
            link="/dashboard/add_new_addon_item"
            showAddonItem={true}
          />
        </Box>
        <Box px={[0, 8]}>
          {isError ? (
            <Center h="400px" bgColor="white">
              <Text color="red.500">No hay artículos de complemento.</Text>
            </Center>
          ) : (
            // 5. Pass the infinite scroll props to the DynamicTable
            <DynamicTable
              showSearch
              showsimpleSearch
              placeholderprops="Buscar aquí"
              data={tableData}
              columns={columns}
              isLoading={isLoading}
              onLoadMore={loadMore}
              hasMore={hasMore}
            />
          )}
        </Box>
      </Box>

      <EditAddonModal
        isOpen={isEditModalOpen}
        onClose={handleCloseEditModal}
        addon={selectedAddon}
      />
    </>
  );
};

export default AddonItem;

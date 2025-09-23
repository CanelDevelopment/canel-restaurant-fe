import { DashboardHeading } from "@/components/admin/dashboard/dashboardHeading";
import { DashLogoButtons } from "@/components/admin/dashboard/dashlogobuttons";
import { DynamicTable } from "@/components/admin/table/dynamictable";
import { Box, Text, Checkbox, Button, Center, Image } from "@chakra-ui/react";
import type { JSX } from "react";
import { useState } from "react";
import { FoodHeader } from "@/components/admin/foodcategory/foodheader";
import { useFetchAddon } from "@/hooks/addon/usefetchaddon";
import { useDeleteAddonitem } from "@/hooks/addon/usedeleteaddon"; // Make sure to create this hook
import { EditAddonModal } from "@/components/admin/addon/editaddonmodal";
import { Tooltip } from "@/components/ui/tooltip";

export type Category = {
  checked: JSX.Element;
  name: string;
  description: string;
  addoncategory: string;
  price: number;
  image: string;
  date: string;
  controls?: ("Edit" | "Delete")[];
  pusblish: boolean;
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
  const { data: addonItems, isLoading, isError } = useFetchAddon();
  const { mutate: deleteAddonItem } = useDeleteAddonitem();

  const [isEditModalOpen, setEditModalOpen] = useState(false);
  const [selectedAddon, setSelectedAddon] = useState<AddonDataForModal | null>(
    null
  );

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
          colorPalette={"green"}
          variant={"subtle"}
          checked={table.getIsAllRowsSelected()}
          onCheckedChange={(value) => {
            if (value.checked === true) table.toggleAllRowsSelected(true);
            else if (value.checked === false)
              table.toggleAllRowsSelected(false);
          }}
          data-state={
            table.getIsSomePageRowsSelected() &&
            !table.getIsAllPageRowsSelected()
              ? "indeterminate"
              : undefined
          }
          size={"lg"}
        >
          <Checkbox.HiddenInput />
          <Checkbox.Control
            border={"0.5px solid #949494"}
            rounded={"md"}
            bgColor={"#F6F6F6"}
          />
        </Checkbox.Root>
      ),
      cell: ({ row }: { row: any }) => (
        <Checkbox.Root
          colorPalette={"green"}
          variant={"subtle"}
          checked={row.getIsSelected()}
          onCheckedChange={(value) => {
            if (value.checked === true) row.toggleSelected(true);
            else if (value.checked === false) row.toggleSelected(false);
          }}
          size={"lg"}
        >
          <Checkbox.HiddenInput />
          <Checkbox.Control
            border={"0.5px solid #949494"}
            rounded={"md"}
            bgColor={"#F6F6F6"}
          />
        </Checkbox.Root>
      ),
    },

    {
      accessorKey: "name",
      header: "Addon Item Name",
      cell: ({ row }: { row: any }) => (
        <Box w={"200px"} className="flex flex-col gap-1 group">
          <Text>{row.original.name}</Text>

          <div className="flex gap-2 text-sm invisible group-hover:visible transition-all duration-200">
            <Text
              textDecoration={"underline"}
              color={"#4394D7"}
              cursor={"pointer"}
              onClick={() => handleOpenEditModal(row.original.originalData)}
            >
              Edit
            </Text>
            <Text
              textDecoration={"underline"}
              color={"#FF5E5E"}
              cursor={"pointer"}
              onClick={() => handleDelete(row.original.id)}
            >
              Delete
            </Text>
          </div>
        </Box>
      ),
    },
    {
      accessorKey: "description",
      header: () => (
        <Box width="500px" textAlign={"start"}>
          Description
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
      header: "Image",
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
      header: () => (
        <Box w={"120px"} textAlign={"start"}>
          AddOn Category
        </Box>
      ),
    },
    {
      accessorKey: "price",
      header: "Price",
      cell: ({ row }: { row: any }) => (
        <Box w={"120px"}>Ref {Number(row.original.price).toFixed(2)}</Box>
      ),
    },
    {
      accessorKey: "date",
      header: "Date",
      cell: ({ row }: { row: any }) => (
        console.log(row.original.date),
        (
          <Box w={"200px"}>
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
              color={"#fff"}
              rounded={"lg"}
            >
              {row.original.pusblish ? "Publish" : "Pending"}
            </Button>
          </Box>
        )
      ),
    },
  ];

  const tableData =
    addonItems?.map((item: any) => ({
      id: item.id,
      name: item.name,
      price: Number(item.price),
      description: item.description || "-",
      addoncategory: item.addon?.name ?? "Uncategorized",
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
    })) || [];

  return (
    <>
      <Box width={["100%"]} bg="#f3f3f3">
        <DashLogoButtons />

        {/* Heading */}
        <DashboardHeading title="ARTÍCULO DE COMPLEMENTO" />
        <Box px={[0, 0, 8]} rounded={"none"}>
          <FoodHeader link="/dashboard/add_new_addon_item" />
        </Box>
        <Box px={[0, 8]}>
          {isError ? (
            <Center h="400px" bgColor={"white"}>
              <Text color="red.500">No addon items.</Text>
            </Center>
          ) : (
            <DynamicTable
              showSearch={true}
              showsimpleSearch={true}
              placeholderprops={"Search here"}
              data={tableData}
              columns={columns}
              isLoading={isLoading}
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

import { DashboardHeading } from "@/components/admin/dashboard/dashboardHeading";
import { DashLogoButtons } from "@/components/admin/dashboard/dashlogobuttons";
import { DynamicTable } from "@/components/admin/table/dynamictable";
import { Box, Text, Checkbox, Button } from "@chakra-ui/react";
import { CustomeSwitch } from "@/components/admin/food Item/customeswitch";
import { useState, type JSX } from "react";
import { FoodHeader } from "@/components/admin/foodcategory/foodheader";
import { useFetchAddonCategories } from "@/hooks/addoncategory/usefetchaddoncategory";
import { useDeleteAddon } from "@/hooks/addoncategory/usedeleteaddon";
import { useUpdateAddonCategory } from "@/hooks/addoncategory/useupdateaddoncategory";
import { EditAddonCategoryModal } from "@/components/admin/addon/editaddoncategory";
// import { AddonContent } from "@/components/admin/addon/addoncontent";

export type Category = {
  id: string;
  checked: JSX.Element;
  name: string;
  description: string;
  status: JSX.Element;
  date: string;
  controls?: ("Editar" | "Eliminar")[];
  pusblish: boolean;
};

const AddonCategory = () => {
  const [_updatingVisibilityId, setUpdatingVisibilityId] = useState<
    string | null
  >(null);

  const [editingAddonCategory, setEditingAddonCategory] = useState<{
    id: string;
    name: string;
    description: string;
  } | null>(null);

  const { data, isLoading } = useFetchAddonCategories();

  const { mutate: deleteAddonCategory } = useDeleteAddon();

  const { mutate: updateAddonCategory, isPending: isUpdating } =
    useUpdateAddonCategory();

  const handleVisibilityToggle = (
    addonCategoryId: string,
    newVisibility: boolean
  ) => {
    setUpdatingVisibilityId(addonCategoryId);
    updateAddonCategory(
      { id: addonCategoryId, visibility: newVisibility },
      { onSettled: () => setUpdatingVisibilityId(null) }
    );
  };

  const handleUpdateSubmit = (payload: {
    id: string;
    name: string;
    description: string;
  }) => {
    updateAddonCategory(payload);
  };

  const columns = [
    {
      id: "select",
      header: ({ table }: { table: any }) => (
        <Box flex={1}>
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
        </Box>
      ),
      cell: ({ row }: { row: any }) => (
        <Box flex={1} display={"flex"} justifyContent={"center"}>
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
        </Box>
      ),
    },
    {
      accessorKey: "name",
      header: "Nom del Complemento",
      cell: ({ row }: { row: any }) => (
        <Box w={"200px"} className="flex flex-col gap-1 group">
          <Text>{row.original.name}</Text>
        </Box>
      ),
    },
    {
      accessorKey: "description",
      header: () => (
        <Box width="600px" textAlign={"start"}>
          Descripción
        </Box>
      ),
      cell: ({ row }: { row: any }) => (
        <Box width="600px">{row.original.description}</Box>
      ),
    },
    {
      accessorKey: "status",
      header: "Estado",
      cell: ({ row }: { row: any }) => (
        // console.log(row.original.id),
        <Box w={"200px"}>
          <span>
            <CustomeSwitch
              isChecked={row.original.status}
              isLoading={_updatingVisibilityId === row.original.id} // disable while updating
              onChange={(newVisibility) =>
                handleVisibilityToggle(row.original.id, newVisibility)
              }
            />
          </span>
        </Box>
      ),
    },
    {
      accessorKey: "date",
      header: "Fecha",
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
              {row.original.pusblish ? "Publicado" : "Pendiente"}
            </Button>
          </Box>
        )
      ),
    },
  ];

  const Tabledata =
    data?.map(
      (cat: { id: any; name: any; description: any; visibility: any }) => (
        console.log(cat),
        {
          checked: (
            <Box mr={10}>
              <Checkbox.Root>
                <Checkbox.HiddenInput />
                <Checkbox.Control
                  border={"0.5px solid #949494"}
                  rounded={"md"}
                  bgColor={"#F6F6F6"}
                />
              </Checkbox.Root>
            </Box>
          ),
          name: (
            <div className="flex flex-col gap-1 group">
              <span>{cat.name}</span>
              <div className="flex gap-2 text-sm invisible group-hover:visible transition-all duration-200">
                <Text
                  textDecoration={"underline"}
                  color={"#4394D7"}
                  cursor={"pointer"}
                  onClick={() =>
                    setEditingAddonCategory({
                      id: cat.id,
                      name: cat.name,
                      description: cat.description,
                    })
                  }
                >
                  Editar
                </Text>
                <Text
                  textDecoration={"underline"}
                  color={"#FF5E5E"}
                  cursor={"pointer"}
                  onClick={() => deleteAddonCategory(cat.id)}
                >
                  Eliminar
                </Text>
              </div>
            </div>
          ),
          description: cat.description || "-",
          status: cat.visibility,
          pusblish: cat.visibility,
          date: new Date().toLocaleString(),
          controls: ["Editar", "Eliminar"],
          id: cat.id,
        }
      )
    ) || [];

  return (
    <>
      <Box width={["100%"]} bg="#f3f3f3">
        <DashLogoButtons />

        {/* Heading */}
        <DashboardHeading title="CATEGORÍA DE COMPLEMENTO" />
        <Box px={[0, 0, 8]} rounded={"none"}>
          {/* <AddonContent link="/dashboard/add_addon_category" /> */}
          <FoodHeader link="/dashboard/add_addon_category " />
        </Box>
        <Box px={[0, 8]}>
          <DynamicTable
            showSearch={true}
            showsimpleSearch={true}
            placeholderprops={"Buscar aquí"}
            data={Tabledata}
            columns={columns}
            isLoading={isLoading}
          />
        </Box>
      </Box>

      <EditAddonCategoryModal
        isOpen={!!editingAddonCategory}
        onClose={() => setEditingAddonCategory(null)}
        category={editingAddonCategory}
        onUpdate={handleUpdateSubmit}
        isLoading={isUpdating}
      />
    </>
  );
};

export default AddonCategory;

import { DashboardHeading } from "@/components/admin/dashboard/dashboardHeading";
import { DashLogoButtons } from "@/components/admin/dashboard/dashlogobuttons";
import { FoodHeader } from "@/components/admin/foodcategory/foodheader";
import { DynamicTable } from "@/components/admin/table/dynamictable";
import { Box, Text, Checkbox, Button, Center, Spinner } from "@chakra-ui/react";
import { CustomeSwitch } from "@/components/admin/food Item/customeswitch";
import { useState, type JSX } from "react";
import { useFetchCategories } from "@/hooks/category/usefetchcategory";
import { useDeleteCategory } from "@/hooks/category/usedeletecategory";
import toast from "react-hot-toast";
import { useUpdateCategory } from "@/hooks/category/useupdatecategory";
import { EditModal } from "@/components/common/editmodal";
import { useQueryClient } from "@tanstack/react-query";

export type Category = {
  id: string;
  checked: JSX.Element;
  name: string;
  description: string;
  status: JSX.Element;
  date: string;
  controls?: ("Edit" | "Delete")[];
  pusblish: boolean;
  visibility: boolean;
  createdAt: string;
};

const Category = () => {
  const [updatingVisibilityId, setUpdatingVisibilityId] = useState<
    string | null
  >(null);

  const handleVisibilityToggle = (
    categoryId: string,
    newVisibility: boolean
  ) => {
    setUpdatingVisibilityId(categoryId);

    updateCategory({ id: categoryId, visibility: newVisibility });
  };

  const columns = [
    {
      id: "select",
      header: ({ table }: { table: any }) => (
        <Box>
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
        <Box w={0}>
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
      header: "Name",
      cell: ({ row }: { row: any }) => (
        <Box className="flex flex-col gap-1 group" w={"200px"}>
          <Text as={"span"}>{row.original.name}</Text>
        </Box>
      ),
    },
    {
      accessorKey: "description",
      header: () => (
        <Box width="600px" textAlign={"start"}>
          Description
        </Box>
      ),
      cell: ({ row }: { row: any }) => (
        <Box width="600px">{row.original.description}</Box>
      ),
    },
    {
      accessorKey: "status",
      header: "Status",
      cell: ({ row }: { row: any }) => (
        <Box w={"250px"}>
          <Text as={"span"}>
            <CustomeSwitch
              isChecked={row.original.visibility}
              onChange={(newVisibility) =>
                handleVisibilityToggle(row.original.id, newVisibility)
              }
              isLoading={updatingVisibilityId === row.original.id}
            />
          </Text>
        </Box>
      ),
    },
    {
      accessorKey: "date",
      header: "Date",
      cell: ({ row }: { row: any }) => (
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
            w={"100px"}
            letterSpacing={0.7}
          >
            <Text mb={1}>{row.original.pusblish ? "Publish" : "Pending"}</Text>
          </Button>
        </Box>
      ),
    },
  ];

  const { data, isPending, isError } = useFetchCategories();
  const {
    mutate: deleteCategory,
    isPending: deletePending,
    isError: deleteError,
    isSuccess,
  } = useDeleteCategory();

  isSuccess ? toast.success("Deleted successfully") : "";

  const Tabledata =
    data
      ?.slice() // Create a shallow copy of the array
      .reverse()
      .map(
        (cat: {
          id: any;
          name: any;
          description: any;
          visibility: any;
          createdAt: any;
        }) => ({
          id: cat.id,
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
                {deletePending ? (
                  <Center>
                    <Spinner size={"md"} />
                  </Center>
                ) : deleteError ? (
                  toast.error("Can't delete")
                ) : (
                  <>
                    <Text
                      textDecoration={"underline"}
                      color={"#4394D7"}
                      cursor={"pointer"}
                      onClick={() =>
                        setEditingCategory({
                          id: cat.id,
                          name: cat.name,
                          description: cat.description,
                        })
                      }
                    >
                      Edit
                    </Text>
                    <Text
                      textDecoration={"underline"}
                      color={"#FF5E5E"}
                      cursor={"pointer"}
                      onClick={() => deleteCategory(cat.id)}
                    >
                      Delete
                    </Text>
                  </>
                )}
              </div>
            </div>
          ),
          description: cat.description || "-",
          // status: <CustomeSwitch />,
          date: cat.createdAt,
          controls: ["Edit", "Delete"],
          pusblish: cat.visibility,
          visibility: cat.visibility,
        })
      ) || [];

  const [editingCategory, setEditingCategory] = useState<{
    id: string;
    name: string;
    description: string;
  } | null>(null);

  const { mutate: updateCategory, isPending: isUpdating } = useUpdateCategory();

  const queryClient = useQueryClient();

  const handleUpdateSubmit = (payload: {
    id: string;
    name: string;
    description: string;
  }) => {
    updateCategory(payload, {
      onSuccess: () => {
        setEditingCategory(null);
        queryClient.invalidateQueries({ queryKey: ["categories"] });
      },
    });
  };

  return (
    <>
      <Box width={["100%"]} bg="#f3f3f3">
        <DashLogoButtons />

        {/* Heading */}
        <DashboardHeading title="CATEGORÍA DE ALIMENTOS" />
        <Box px={[0, 0, 8]} rounded={"none"}>
          <FoodHeader link="/dashboard/add_new_category" />
        </Box>
        <Box px={[0, 8]}>
          {isError ? (
            <Center bgColor={"white"}>
              <Text>No category!</Text>
            </Center>
          ) : (
            <DynamicTable
              showsimpleSearch={true}
              data={Tabledata}
              columns={columns}
              isLoading={isPending}
            />
          )}
        </Box>
      </Box>

      <EditModal
        isOpen={!!editingCategory}
        onClose={() => setEditingCategory(null)}
        category={editingCategory}
        onUpdate={handleUpdateSubmit}
        isLoading={isUpdating}
      />
    </>
  );
};

export default Category;

import { Box, Text, Image, Checkbox, Center } from "@chakra-ui/react";
import { DashLogoButtons } from "../dashboard/dashlogobuttons";
import { DashboardHeading } from "../dashboard/dashboardHeading";
import { DynamicTable } from "../table/dynamictable";
import { CustomeSwitch } from "./customeswitch";
import { BranchesModal } from "./modal";
import { useFetchProducts } from "@/hooks/product/usefetchproducts";
import { useState, type JSX } from "react";
import { FoodHeader } from "../foodcategory/foodheader";
import { useUpdateProduct } from "@/hooks/product/useupdateproduct";
import { Tooltip } from "@/components/ui/tooltip";
import { EditProductModal } from "./editfoodmodal";
import { useDeleteProduct } from "@/hooks/product/usedeleteproduct";

interface MenuItem {
  id: string;
  name: JSX.Element;
  description: string;
  category: string;
  price: string;
  photo: JSX.Element;
  itemNotAvailable: boolean;
  branch: JSX.Element;
  date: string;
  status: string;
}

interface ProductDataForModal {
  id: string;
  name: string;
  description: string;
  price: string;
  photo: string;
  categoryId: string | null;
}

export const FoodItemHeader = () => {
  const { data: products, isLoading, isError } = useFetchProducts();
  const { mutate: updateProduct } = useUpdateProduct();

  const [updatingProductId, setUpdatingProductId] = useState<string | null>(
    null
  );

  const [isEditModalOpen, setEditModalOpen] = useState(false);

  const [selectedProduct, setSelectedProduct] =
    useState<ProductDataForModal | null>(null);

  const handleOpenEditModal = (product: ProductDataForModal) => {
    setSelectedProduct(product);
    setEditModalOpen(true);
  };

  const handleCloseEditModal = () => {
    setEditModalOpen(false);
    setSelectedProduct(null);
  };

  const handleVisibilityToggle = (
    productId: string,
    newAvailability: boolean
  ) => {
    setUpdatingProductId(productId);
    updateProduct(
      { id: productId, availability: newAvailability },
      { onSettled: () => setUpdatingProductId(null) }
    );
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
          size={"lg"}
        >
          <Checkbox.HiddenInput />
          <Checkbox.Control
            border={"0.5px solid #949494"}
            rounded={"md"}
            bgColor={"#F6F6F6"}
            color={"green"}
          />
        </Checkbox.Root>
      ),
      cell: ({ row }: { row: any }) => (
        <Checkbox.Root
          checked={row.getIsSelected()}
          onCheckedChange={(value) => row.toggleSelected(!!value.checked)}
          size={"lg"}
        >
          <Checkbox.HiddenInput />
          <Checkbox.Control
            border={"0.5px solid #949494"}
            rounded={"md"}
            bgColor={"#F6F6F6"}
            color={"green"}
          />
        </Checkbox.Root>
      ),
    },
    {
      accessorKey: "name",
      header: () => (
        <Box w={"150px"} textAlign={"start"}>
          Nombre
        </Box>
      ),
      cell: ({ row }: { row: any }) => <Box>{row.getValue("name")}</Box>,
    },
    {
      accessorKey: "description",
      header: () => (
        <Box width="200px" textAlign={"start"}>
          Description
        </Box>
      ),
      cell: ({ row }: { row: any }) => (
        <Box w={"200px"}>
          <Tooltip content={row.original.description}>
            <Text truncate>{row.original.description}</Text>
          </Tooltip>
        </Box>
      ),
    },
    {
      accessorKey: "category",
      header: "Categorías",
      cell: ({ row }: { row: any }) => row.getValue("category"),
    },
    {
      accessorKey: "price",
      header: "Precio",
      cell: ({ row }: { row: any }) => row.getValue("price"),
    },
    {
      accessorKey: "photo",
      header: "Foto",
      cell: ({ row }: { row: any }) => row.getValue("photo"),
    },
    {
      accessorKey: "itemNotAvailable",
      header: () => (
        <Box w={"200px"}>
          <Text>Artículo no Disponible</Text>
        </Box>
      ),
      cell: ({ row }: { row: any }) => (
        <Box w={"200px"} textAlign={"center"}>
          <CustomeSwitch
            isChecked={row.original.itemNotAvailable}
            onChange={(newVisibility) =>
              handleVisibilityToggle(row.original.id, newVisibility)
            }
            isLoading={updatingProductId === row.original.id}
          />
        </Box>
      ),
    },
    {
      accessorKey: "branch",
      header: "Disponibilidad",
      cell: ({ row }: { row: any }) => row.getValue("branch"),
    },
    {
      accessorKey: "date",
      header: "Fecha",
      cell: ({ row }: { row: any }) => (
        <Box w={"200px"}>
          {" "}
          {new Date(row.original.date).toLocaleDateString("fr-FR", {
            day: "2-digit",
            month: "2-digit",
            year: "numeric",
            hour: "2-digit",
            minute: "2-digit",
          })}
        </Box>
      ),
    },
  ];

  const { mutate } = useDeleteProduct();

  const tableData: MenuItem[] =
    products?.map((product) => ({
      // `product` here is the raw data from your API
      id: product.id,
      name: (
        <Box className="flex flex-col gap-1 group">
          {product.name}
          <Box className="flex gap-2 text-sm invisible group-hover:visible transition-all duration-200">
            <Text
              textDecoration={"underline"}
              color={"#4394D7"}
              cursor={"pointer"}
              onClick={() =>
                handleOpenEditModal({
                  id: product.id,
                  name: product.name,
                  description: product.description,
                  price: `Ref ${product.price}`,
                  photo: product.image,
                  categoryId: product.category?.id || null,
                })
              }
            >
              Editar
            </Text>
            <Text
              textDecoration={"underline"}
              color={"#FF5E5E"}
              cursor={"pointer"}
              onClick={() => mutate({ id: product.id })}
            >
              Eliminar
            </Text>
          </Box>
        </Box>
      ),
      description: product.description,
      category: product.category?.name ?? "Sin Categoría",
      price: `Ref ${product.price}`,
      photo: (
        <Box boxSize={20}>
          <Image
            loading="lazy"
            src={`${product.image}`}
            alt={product.name}
            borderRadius="md"
          />
        </Box>
      ),
      itemNotAvailable: product.availability,
      branch: (
        <BranchesModal
          productId={product.id}
          initialSelectedIds={product.branchId}
        />
      ),
      date: product.createdAt,
      status: product.status,
    })) || [];

  return (
    <Box bg={"white"}>
      <DashLogoButtons />
      <DashboardHeading title="ARTÍCULO DE COMIDA" />

      <Box px={[0, 0, 8]} pb={3} rounded={"none"} bg={"#f3f3f3"}>
        <FoodHeader link="/dashboard/add_new_item" showImportButton={true} />

        {isError ? (
          <Center h="400px" bg="white">
            <Text>¡No hay productos!</Text>
          </Center>
        ) : (
          <DynamicTable
            showsimpleSearch={true}
            placeholderprops="Buscar por ID de Artículo, Nom, Categoría"
            columns={columns}
            data={tableData}
            isLoading={isLoading}
          />
        )}
      </Box>

      <EditProductModal
        isOpen={isEditModalOpen}
        onClose={handleCloseEditModal}
        product={selectedProduct}
      />
    </Box>
  );
};

import { Box, Text, Image, Checkbox, Center } from "@chakra-ui/react";
import { DashLogoButtons } from "../dashboard/dashlogobuttons";
import { DashboardHeading } from "../dashboard/dashboardHeading";
import { DynamicTable } from "../table/dynamictable";
import { CustomeSwitch } from "./customeswitch";
import { BranchesModal } from "./modal";
import {
  useFetchProducts,
  type Products,
} from "@/hooks/product/usefetchproducts";
import { useEffect, useMemo, useState, type JSX } from "react";
import { FoodHeader } from "../foodcategory/foodheader";
import { useUpdateProduct } from "@/hooks/product/useupdateproduct";
import { Tooltip } from "@/components/ui/tooltip";
import { EditProductModal } from "./editfoodmodal";
import { useDeleteProduct } from "@/hooks/product/usedeleteproduct";
import type { ProductVariant } from "./newitemcontent";

export interface MenuItem {
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
  discount: string;
  categoryId: string[] | null;
  variants: ProductVariant[];
}

export const FoodItemHeader = () => {
  const { data: products, isLoading, isError } = useFetchProducts();
  const { mutate: updateProduct } = useUpdateProduct();
  const { mutate: deleteProduct } = useDeleteProduct(); // Moved up for cleaner access

  const [updatingProductId, setUpdatingProductId] = useState<string | null>(
    null
  );
  const [isEditModalOpen, setEditModalOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] =
    useState<ProductDataForModal | null>(null);

  const [visibleCount, setVisibleCount] = useState(5);
  const [_displayedData, setDisplayedData] = useState<Products[]>([]);

  // 1. SIMPLIFY TABLE DATA
  // Only return raw data here. Do not return JSX.

  const tableData = useMemo(() => {
    return products?.slice(0, visibleCount) || [];
  }, [products, visibleCount]);

  const loadMore = () => {
    setVisibleCount((prev) => prev + 10);
  };

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

  // 2. DEFINE UI IN COLUMNS
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
      // MOVED JSX HERE
      cell: ({ row }: { row: any }) => {
        const product = row.original;
        return (
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
                    variants: product.variants,
                    discount: product.discount,
                  })
                }
              >
                Editar
              </Text>
              <Text
                textDecoration={"underline"}
                color={"#FF5E5E"}
                cursor={"pointer"}
                onClick={() => deleteProduct({ id: product.id })}
              >
                Eliminar
              </Text>
            </Box>
          </Box>
        );
      },
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
      cell: ({ row }: { row: any }) => {
        const rels = row.original.category as
          | { category?: { name: string } }[]
          | undefined;

        if (!rels || rels.length === 0) return "Sin Categoría";

        const names = rels
          .map((pc) => pc.category?.name)
          .filter(Boolean)
          .join(", ");

        return names || "Sin Categoría";
      },
    },
    {
      accessorKey: "price",
      header: "Precio",
      cell: ({ row }: { row: any }) => `Ref ${row.original.price}`,
    },
    {
      accessorKey: "photo", // Note: accessorKey doesn't matter much if using cell render
      header: "Foto",
      // MOVED JSX HERE
      cell: ({ row }: { row: any }) => (
        <Box boxSize={20}>
          <Image
            loading="lazy"
            src={`${row.original.image}`}
            alt={row.original.name}
            borderRadius="md"
          />
        </Box>
      ),
    },
    {
      accessorKey: "itemNotAvailable",
      header: () => (
        <Box w={"200px"}>
          <Text>Artículo no Disponible</Text>
        </Box>
      ),
      cell: ({ row }: { row: any }) => (
        <Box w={"200px"} textAlign={"center"} position={"relative"} zIndex={0}>
          <CustomeSwitch
            isChecked={row.original.availability}
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
      // MOVED JSX HERE
      cell: ({ row }: { row: any }) => (
        <BranchesModal
          productId={row.original.id}
          initialSelectedIds={row.original.branchId}
        />
      ),
    },
    {
      accessorKey: "date",
      header: "Fecha",
      cell: ({ row }: { row: any }) => (
        <Box w={"200px"}>
          {new Date(row.original.createdAt).toLocaleDateString("fr-FR", {
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

  useEffect(() => {
    if (products) setDisplayedData(products.slice(0, visibleCount));
  }, [products, visibleCount]);

  return (
    <Box bg={"white"}>
      <DashLogoButtons />
      <DashboardHeading title="ARTÍCULO DE COMIDA" />

      <Box px={[0, 0, 8]} pb={3} rounded={"none"} bg={"#f3f3f3"}>
        <FoodHeader
          link="/dashboard/add_new_item"
          showImportButton={true}
          showProductModal={true}
        />

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
            onLoadMore={loadMore}
            hasMore={visibleCount < (products?.length || 0)}
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

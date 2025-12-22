import { useState } from "react";
import { Box, Button, Input, Dialog, Text, Portal } from "@chakra-ui/react";
import toast from "react-hot-toast";
import { FaPlus } from "react-icons/fa6";
// Import your new hooks for handling category data
import { useBulkImportCategories } from "@/hooks/category/usecreatebulkcategory";
import { useFetchCategories } from "@/hooks/category/usefetchcategory";
import * as XLSX from "xlsx";

interface BulkImportModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const BulkImportModalCategory: React.FC<BulkImportModalProps> = () => {
  const [file, setFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);

  // Use the new hooks for categories
  const { mutateAsync: bulkImport } = useBulkImportCategories();
  const { data: categoriesData } = useFetchCategories();

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setFile(e.target.files[0]);
    }
  };

  const handleUpload = async () => {
    if (!file) {
      toast.error("¡Por favor, seleccione un archivo CSV o XLSX primero!");
      return;
    }
    setIsUploading(true);

    try {
      await bulkImport(file);
    } catch (error) {
      console.error(error);
      toast.error("Error al procesar el archivo.");
    } finally {
      setIsUploading(false);
    }
  };

  const handleDownloadTemplate = () => {
    if (!categoriesData || categoriesData.length === 0)
      return toast.error("No products available to export!");

    const csvData = categoriesData.map((p) => ({
      id: p.id,
      name: p.name,
      description: p.description,
      createdAt: new Date(p.createdAt).toLocaleDateString(),
    }));

    const worksheet = XLSX.utils.json_to_sheet(csvData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Categorias");

    XLSX.writeFile(workbook, "plantilla_categorias.xlsx");
    toast.success("¡Plantilla descargada exitosamente!");
  };

  return (
    <Dialog.Root>
      <Dialog.Trigger asChild>
        <Button bgColor={"#000"} color={"#fff"} rounded={"md"}>
          <FaPlus />
          <Text mb={1}>Importar/Exportar en Masa</Text>
        </Button>
      </Dialog.Trigger>
      <Portal>
        <Dialog.Backdrop />
        <Dialog.Positioner>
          <Dialog.Content>
            <Dialog.Header
              color={"Cbutton"}
              bgColor={"Cgreen"}
              fontSize={"2xl"}
              fontFamily={"AmsiProCond-Black"}
              letterSpacing={0.5}
              roundedTop={"lg"}
              pb={8}
            >
              Cargar Archivo de Categorías
            </Dialog.Header>
            <Dialog.Body>
              <Box bg="white" mt={4} rounded="lg">
                <Text fontSize={"md"} mb={3} fontWeight={"Bold"}>
                  Seleccione el archivo para subir
                </Text>

                <Input
                  type="file"
                  accept=".csv, .xlsx"
                  onChange={handleFileChange}
                />

                <Button
                  mt={4}
                  bg="Cgreen"
                  color="Cbutton"
                  onClick={handleUpload}
                  disabled={isUploading}
                >
                  Subir Archivo
                </Button>

                <Button
                  mt={4}
                  ml={2}
                  bg="#222"
                  color="white"
                  onClick={handleDownloadTemplate}
                >
                  Descargar Plantilla
                </Button>
              </Box>
            </Dialog.Body>
          </Dialog.Content>
        </Dialog.Positioner>
      </Portal>
    </Dialog.Root>
  );
};

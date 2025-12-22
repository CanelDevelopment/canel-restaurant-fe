import { useState } from "react";
import { Box, Button, Input, Dialog, Text, Portal } from "@chakra-ui/react";
import toast from "react-hot-toast";
import { FaPlus } from "react-icons/fa6";
import { useBulkImportAddonItem } from "@/hooks/addon/useaddbulkaddonitem";
import * as XLSX from "xlsx";
import { useFetchAddon } from "@/hooks/addon/usefetchaddon";

interface BulkImportModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const BulkImportAddonModal: React.FC<BulkImportModalProps> = () => {
  const [file, setFile] = useState<File | null>(null);
  const { mutateAsync: bulkImport } = useBulkImportAddonItem();
  const { data: addonItems } = useFetchAddon();
  const [isUploading, setIsUploading] = useState(false);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) setFile(e.target.files[0]);
  };

  const handleUpload = async () => {
    if (!file) return toast.error("¡Primero selecciona un archivo CSV o XLSX!");
    setIsUploading(true);
    try {
      await bulkImport(file);
    } catch (error) {
      console.error(error);
      toast.error("No se pudo procesar el archivo");
    } finally {
      setIsUploading(false);
    }
  };

  const handleDownloadCSV = () => {
    if (!addonItems || addonItems.length === 0)
      return toast.error("¡No hay items de complemento para exportar!");

    const csvData = addonItems.map((item) => ({
      id: item.id,
      name: item.name,
      description: item.description,
      price: item.price,
      category: item.originalData?.name || "",
      availability: item.pusblish ? "Disponible" : "No disponible",
    }));

    const worksheet = XLSX.utils.json_to_sheet(csvData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "AddonItems");
    XLSX.writeFile(workbook, "addon-items.csv");

    toast.success("¡CSV descargado correctamente!");
  };

  return (
    <Dialog.Root>
      <Dialog.Trigger asChild>
        <Button bgColor="#000" color="#fff" rounded="md">
          <FaPlus />
          <Text mb={1}>Importar/Exportar Items de Complemento</Text>
        </Button>
      </Dialog.Trigger>
      <Portal>
        <Dialog.Backdrop />
        <Dialog.Positioner>
          <Dialog.Content>
            <Dialog.Header
              color="Cbutton"
              bgColor="Cgreen"
              fontSize="2xl"
              fontFamily="AmsiProCond-Black"
              letterSpacing={0.5}
              roundedTop="lg"
              pb={8}
            >
              Cargar archivo de items de complemento
            </Dialog.Header>
            <Dialog.Body>
              <Box bg="white" mt={4} rounded="lg">
                <Text fontSize="md" mb={3} fontWeight="bold">
                  Selecciona un archivo CSV o XLSX
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
                  Subir
                </Button>
                <Button
                  mt={4}
                  ml={2}
                  bg="#222"
                  color="white"
                  onClick={handleDownloadCSV}
                >
                  Descargar CSV
                </Button>
              </Box>
            </Dialog.Body>
          </Dialog.Content>
        </Dialog.Positioner>
      </Portal>
    </Dialog.Root>
  );
};

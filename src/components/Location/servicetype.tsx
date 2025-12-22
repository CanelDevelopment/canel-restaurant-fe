import { Box, Text, Icon } from "@chakra-ui/react";
import { FaArrowRightLong } from "react-icons/fa6";
import { IoArrowBack } from "react-icons/io5";
import type { Branch } from "@/pages/locationform.page";

interface ServiceTypeSelectorProps {
  view: "branch" | "service";
  cityBranches: Branch[];
  selectedBranch: Branch | null;
  onSelectBranch: (branch: Branch) => void;
  onSelectService: (type: "pickup" | "delivery") => void;
  onBack: () => void;
}

export const ServiceTypeSelector: React.FC<ServiceTypeSelectorProps> = ({
  view,
  cityBranches,
  selectedBranch,
  onSelectBranch,
  onSelectService,
  onBack,
}) => {
  const BackButton = () => (
    <Box
      as="button"
      onClick={onBack}
      display="flex"
      alignItems="center"
      gap={2}
      color="whiteAlpha.800"
      _hover={{ color: "white" }}
      cursor="pointer"
      mb={2}
    >
      <Icon as={IoArrowBack} />
      <Text fontFamily="AmsiProCond">Volver</Text>
    </Box>
  );

  const SelectionItem = ({
    label,
    onClick,
    isDisabled = false,
  }: {
    label: string;
    onClick: () => void;
    isDisabled?: boolean;
  }) => (
    <Box
      width={["80vw", "100%", "310px"]}
      bg={isDisabled ? "#E2E8F0" : "#fff"}
      rounded="md"
      border="1px solid #7a9f8a"
      color={isDisabled ? "#A0AEC0" : "#7a9f8a"}
      display="flex"
      justifyContent="space-between"
      alignItems="center"
      px={4}
      py={2}
      fontSize="xl"
      cursor={isDisabled ? "not-allowed" : "pointer"}
      onClick={!isDisabled ? onClick : undefined}
      _hover={
        !isDisabled ? { borderColor: "#5a7d6a", color: "#5a7d6a" } : undefined
      }
      opacity={isDisabled ? 0.6 : 1}
    >
      <Text mb={1} fontFamily="AmsiProCond">
        {label}
      </Text>
      <FaArrowRightLong color={isDisabled ? "#A0AEC0" : "#7a9f8a"} size={18} />
    </Box>
  );

  const renderBranchStep = () => (
    <>
      <BackButton />
      <Text color="white" fontSize="2xl" fontFamily="AmsiProCond-Bold" mb={2}>
        Selecciona una Sede
      </Text>

      {cityBranches.map((branch) => (
        <SelectionItem
          key={branch.id}
          label={branch.name}
          onClick={() => onSelectBranch(branch)}
        />
      ))}
    </>
  );

  const renderServiceStep = () => {
    if (!selectedBranch) return null;

    const { orderType } = selectedBranch;

    return (
      <>
        <BackButton />
        <Text color="white" fontSize="2xl" fontFamily="AmsiProCond-Bold" mb={2}>
          Selecciona el Tipo de Servicio
        </Text>

        {/* Pickup */}
        <SelectionItem
          label="Pickup"
          onClick={() => onSelectService("pickup")}
          isDisabled={orderType === "delivery"} // pickup disabled if branch serves only delivery
        />

        {/* Delivery */}
        <SelectionItem
          label="Delivery"
          onClick={() => onSelectService("delivery")}
          isDisabled={orderType === "pickup"} // delivery disabled if branch serves only pickup
        />
      </>
    );
  };

  return (
    <Box
      display="grid"
      gridTemplateColumns="repeat(1, 1fr)"
      gap={4}
      padding={4}
      paddingLeft={0}
      mt={4}
      w="100%"
    >
      {view === "branch" ? renderBranchStep() : renderServiceStep()}
    </Box>
  );
};

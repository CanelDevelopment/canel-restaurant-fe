import { Box, Text, Icon } from "@chakra-ui/react";
import { FaArrowRightLong } from "react-icons/fa6";
import { IoArrowBack } from "react-icons/io5";

interface Branch {
  id: string;
  name: string;
  serviceTypes: string[];
  city?: {
    id: string;
    name: string;
  };
  areas?: string[];
}

interface ServiceTypeSelectorProps {
  cityBranches: Branch[];
  step: "service" | "pickup" | "delivery_branch" | "delivery_area";
  selectedBranch: Branch | null;
  onSelectService: (type: "pickup" | "delivery") => void;
  onSelectPickupBranch: (branch: Branch) => void;
  onSelectDeliveryBranch: (branch: Branch) => void;
  onSelectDeliveryArea: (area: string) => void;
  onBack: () => void;
}

export const ServiceTypeSelector: React.FC<ServiceTypeSelectorProps> = ({
  cityBranches,
  step,
  selectedBranch,
  onSelectService,
  onSelectPickupBranch,
  onSelectDeliveryBranch,
  onSelectDeliveryArea,
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
      cursor={"pointer"}
      mb={2} // Add some margin
    >
      <Icon as={IoArrowBack} />
      <Text fontFamily="AmsiProCond">Volver</Text>
    </Box>
  );

  // Helper component for list items
  const SelectionItem = ({
    label,
    onClick,
  }: {
    label: string;
    onClick: () => void;
  }) => (
    <Box
      width={["80vw", "100%", "310px"]}
      bg="#fff"
      rounded="md"
      border="1px solid #7a9f8a"
      color="#7a9f8a"
      display="flex"
      justifyContent="space-between"
      alignItems="center"
      px={4}
      py={2}
      fontSize="xl"
      cursor="pointer"
      onClick={onClick}
      _hover={{ borderColor: "#5a7d6a", color: "#5a7d6a" }}
    >
      <Text mb={1} fontFamily="AmsiProCond">
        {label}
      </Text>
      <FaArrowRightLong color="#7a9f8a" size={18} />
    </Box>
  );

  const renderStepContent = () => {
    switch (step) {
      case "pickup":
        return (
          <>
            <BackButton />
            <Text
              color="white"
              fontSize="2xl"
              fontFamily="AmsiProCond-Bold"
              mb={2}
            >
              Selecciona una Sede para Pick-Up
            </Text>
            {cityBranches.map((branch) => (
              <SelectionItem
                key={branch.id}
                label={branch.name}
                onClick={() => onSelectPickupBranch(branch)}
              />
            ))}
          </>
        );

      case "delivery_branch":
        return (
          <>
            <BackButton />
            <Text
              color="white"
              fontSize="2xl"
              fontFamily="AmsiProCond-Bold"
              mb={2}
            >
              Selecciona una Sede para Delivery
            </Text>
            {cityBranches.map((branch) => (
              <SelectionItem
                key={branch.id}
                label={branch.name}
                onClick={() => onSelectDeliveryBranch(branch)}
              />
            ))}
          </>
        );

      case "delivery_area":
        if (!selectedBranch) return null;
        return (
          <>
            <BackButton />
            <Text
              color="white"
              fontSize="2xl"
              fontFamily="AmsiProCond-Bold"
              mb={2}
            >
              Áreas de Delivery para {selectedBranch.name}
            </Text>
            {(selectedBranch.areas || []).map((area) => (
              <SelectionItem
                key={area}
                label={area}
                onClick={() => onSelectDeliveryArea(area)}
              />
            ))}
          </>
        );

      case "service":
      default:
        return (
          <>
            <SelectionItem
              label="Delivery"
              onClick={() => onSelectService("delivery")}
            />
            <SelectionItem
              label="Pick-Up"
              onClick={() => onSelectService("pickup")}
            />
          </>
        );
    }
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
      {renderStepContent()}
    </Box>
  );
};

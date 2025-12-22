import { useFetchBranch } from "@/hooks/branch/usefetchbranch";
import { Box, Button, Checkbox, Flex, Spinner, Text } from "@chakra-ui/react";
import { Dialog } from "@chakra-ui/react";
import { useEffect, useState } from "react";
import { RxCross2 } from "react-icons/rx";
import { TbPencilMinus } from "react-icons/tb";
import { useAssignBranchToProduct } from "@/hooks/product/useassignbranch";

interface BranchesModalProps {
  productId: string;
  initialSelectedIds?: string[];
}

export function BranchesModal({
  productId,
  initialSelectedIds = [],
}: BranchesModalProps) {
  const { data: allBranches, isPending: isLoadingBranches } = useFetchBranch();
  const { mutate: updateBranches, isPending: isUpdating } =
    useAssignBranchToProduct();

  const [selectedIds, setSelectedIds] = useState<string[]>([]);

  useEffect(() => {
    setSelectedIds(initialSelectedIds || []);
  }, [initialSelectedIds]);

  const handleBranchToggle = (branchId: string) => {
    setSelectedIds((prevIds) =>
      prevIds.includes(branchId)
        ? prevIds.filter((id) => id !== branchId)
        : [...prevIds, branchId]
    );
  };

  const areAllSelected =
    (allBranches?.length ?? 0) > 0 &&
    selectedIds.length === (allBranches?.length ?? 0);

  const handleSelectAllToggle = () => {
    if (areAllSelected) {
      setSelectedIds([]);
    } else {
      const allBranchIds = allBranches?.map((branch) => branch.id) ?? [];
      setSelectedIds(allBranchIds);
    }
  };

  const handleSave = (closeModal: () => void) => {
    const branchIdForApi = selectedIds[0] || null;
    updateBranches(
      {
        productId: productId,
        branchId: branchIdForApi,
      },
      {
        onSuccess: () => {
          closeModal();
        },
      }
    );
  };

  return (
    <Dialog.Root size={"md"} placement={"center"}>
      <Dialog.Trigger>
        <Button bgColor={"#4394D7"} color={"#fff"} rounded={"lg"} pb={1}>
           sucursales <TbPencilMinus />
        </Button>
      </Dialog.Trigger>
      <Dialog.Backdrop />
      <Dialog.Positioner shadow={"none"}>
        <Dialog.Content
          bg="#fff"
          borderRadius="2xl"
          shadow={"none"}
          border={"2px solid #DFDFDF"}
          position={"relative"}
        >
          <Dialog.CloseTrigger asChild>
            <Box
              as="button"
              position="absolute"
              top="10px"
              right="12px"
              bg="#58615a"
              borderRadius="full"
              width="18px"
              height="18px"
              display="flex"
              alignItems="center"
              justifyContent="center"
              _hover={{ bg: "#434c45" }}
              cursor={"pointer"}
            >
              <RxCross2 size={10} color="white" />
            </Box>
          </Dialog.CloseTrigger>

          <Dialog.Header bg="#DFF1ED" p={4} borderTopRadius="2xl">
            <Dialog.Title>
              <Text
                fontFamily={"AmsiProCond-Black"}
                color={"Cbutton"}
                fontSize="xl"
              >
                Sucursales
              </Text>
            </Dialog.Title>
          </Dialog.Header>

          <Dialog.Body>
            <Flex
              alignItems={"start"}
              justifyContent={"space-between"}
              minH="120px"
            >
              {isLoadingBranches ? (
                <Flex w="100%" justify="center" align="center">
                  <Spinner />
                </Flex>
              ) : (
                <>
                  <Box
                    display={"flex"}
                    flexDirection={"column"}
                    alignItems={"start"}
                    mt={4}
                    gapY={4}
                  >
                    {allBranches?.map((branch) => (
                      <Checkbox.Root
                        key={branch.id}
                        size={"sm"}
                        checked={selectedIds.includes(branch.id)}
                        onCheckedChange={() => handleBranchToggle(branch.id)}
                      >
                        <Checkbox.HiddenInput />
                        <Checkbox.Control
                          bgColor={"#EBEBEB"}
                          border={"0.3px solid #949494"}
                          rounded={"sm"}
                          color={"Cbutton"}
                        />
                        <Checkbox.Label ml={2}>{branch.name}</Checkbox.Label>
                      </Checkbox.Root>
                    ))}
                  </Box>
                  <Box mt={4}>
                    <Checkbox.Root
                      size={"sm"}
                      checked={areAllSelected}
                      onCheckedChange={handleSelectAllToggle}
                    >
                      <Checkbox.HiddenInput />
                      <Checkbox.Control
                        bgColor={"#EBEBEB"}
                        border={"0.3px solid #949494"}
                        rounded={"sm"}
                        color={"Cbutton"}
                      />
                      <Checkbox.Label
                        color={"#4394D7"}
                        fontFamily={"AmsiProCond-Light"}
                        ml={2}
                      >
                        Seleccionar  sucursales
                      </Checkbox.Label>
                    </Checkbox.Root>
                  </Box>
                </>
              )}
            </Flex>
          </Dialog.Body>

          <Dialog.Footer>
            <Button
              mt={6}
              bg="Cgreen"
              color="Cbutton"
              width="100%"
              borderRadius="md"
              _hover={{ bg: "#95C532" }}
              onClick={() => handleSave(() => {})}
              disabled={isUpdating}
            >
              Guardar
            </Button>
          </Dialog.Footer>
        </Dialog.Content>
      </Dialog.Positioner>
    </Dialog.Root>
  );
}

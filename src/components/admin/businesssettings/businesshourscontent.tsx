import {
  Box,
  Flex,
  VStack,
  Text,
  Spinner,
  Center,
  Switch,
  Select,
  Portal,
  createListCollection,
} from "@chakra-ui/react";
import { BusinessHeader } from "./businessheader";
import { IoIosArrowForward } from "react-icons/io";
import { useState, useMemo } from "react";
import { BusinessHoursModal } from "./hoursmodal";
import { useToggleSchedule } from "@/hooks/schedule/usetoggleschedule";
import { useFetchSchedules } from "@/hooks/schedule/usefetchschedule";
import { useFetchCurrentUser } from "@/hooks/user/usefetchuser";
import { useFetchBranch } from "@/hooks/branch/usefetchbranch";

const DAYS_OF_WEEK = [
  { label: "Monday", index: 1 },
  { label: "Tuesday", index: 2 },
  { label: "Wednesday", index: 3 },
  { label: "Thursday", index: 4 },
  { label: "Friday", index: 5 },
  { label: "Saturday", index: 6 },
  { label: "Sunday", index: 0 },
];

export const BusinessHoursContent: React.FC = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedDay, setSelectedDay] = useState<string | null>(null);
  const [selectedBranchId, setSelectedBranchId] = useState<string | null>(null);

  const { data: user, isLoading: userLoading } = useFetchCurrentUser();
  const { data: branches, isLoading: branchLoading } = useFetchBranch();

  const branchId = useMemo(() => {
    if (user && branches) {
      if (user.role.toLowerCase() === "admin") {
        return selectedBranchId;
      }
      const managerBranch = branches.find(
        (branch) => branch.manager?.id === user.id
      );
      return managerBranch?.id || null;
    }
    return null;
  }, [user, branches, selectedBranchId]);

  const { data: scheduleData, isLoading: scheduleLoading } =
    useFetchSchedules(branchId);

  const toggleStatus = useToggleSchedule();

  const branchOptions = useMemo(() => {
    const items =
      branches?.map((branch) => ({
        key: branch.id,
        textValue: branch.name,
        children: branch.name,
      })) || [];

    return createListCollection({ items });
  }, [branches]);

  const scheduleMap = useMemo(() => {
    if (!scheduleData) return new Map();
    return new Map(scheduleData.map((item) => [item.dayOfWeek, item]));
  }, [scheduleData]);

  const handleDayClick = (day: string) => {
    setSelectedDay(day);
    setIsModalOpen(true);
  };

  const isLoading = userLoading || branchLoading;

  if (isLoading)
    return (
      <Center p={20}>
        <Spinner size="xl" />
      </Center>
    );

  if (user?.role.toLowerCase() === "manager" && !branchId)
    return (
      <Center p={20}>
        <Text>No hay sucursal asignada a este gerente.</Text>
      </Center>
    );

  return (
    <>
      <Box bgColor={"#fff"} py={10}>
        <BusinessHeader
          title="Horario comercial"
          description="Informe a sus clientes sobre su disponibilidad"
        />

        {user?.role.toLowerCase() === "admin" && (
          <Box
            width={["100%", "100%", "60%", "50%", "38%"]}
            px={[4, 10]}
            py={4}
            mb={6}
          >
            <Text mb={2} fontWeight="bold">
              Seleccionar Sucursal
            </Text>
            <Select.Root
              collection={branchOptions}
              value={selectedBranchId ? [selectedBranchId] : []}
              onValueChange={(details) => {
                if (details?.value[0]) {
                  setSelectedBranchId(details.value[0]);
                }
              }}
            >
              <Select.Control>
                <Select.Trigger bg="#ebebeb" h="42px" border="none">
                  <Select.ValueText placeholder="Select a branch">
                    {branchOptions.items.find(
                      (item) => item.key === selectedBranchId
                    )?.textValue || "Seleccionar rama"}
                  </Select.ValueText>
                  <Select.Indicator color={"#575757"} />
                </Select.Trigger>
              </Select.Control>
              <Portal>
                <Select.Positioner>
                  <Select.Content>
                    {branchOptions.items.map((item) => (
                      <Select.Item key={item.key} item={item.key}>
                        {item.textValue}
                        <Select.ItemIndicator />
                      </Select.Item>
                    ))}
                  </Select.Content>
                </Select.Positioner>
              </Portal>
            </Select.Root>
          </Box>
        )}

        <Box
          width={["100%", "100%", "60%", "50%", "38%"]}
          bg="white"
          borderRadius="md"
          px={[4, 10]}
          py={4}
        >
          {branchId ? (
            scheduleLoading ? (
              <Center>
                <Spinner />
              </Center>
            ) : (
              <VStack align="stretch">
                {DAYS_OF_WEEK.map(({ label, index }) => {
                  const itemData = scheduleMap.get(index);
                  const isActive = itemData?.isActive || false;
                  const timeSlots = itemData?.timeSlots || [];

                  return (
                    <Flex
                      key={label}
                      justify="space-between"
                      align="center"
                      border="1px solid #EBEBEB"
                      rounded="lg"
                      px={6}
                      py={4}
                    >
                      <Flex align="center" gap={4}>
                        <Switch.Root
                          checked={isActive}
                          onCheckedChange={() => {
                            if (branchId) {
                              toggleStatus.mutate({
                                id: branchId,
                                dayOfWeek: index,
                                isActive: !isActive,
                              } as any);
                            } else {
                              console.warn(
                                `No se puede alternar: No existe ningún ID de programación para ${label}.`
                              );
                            }
                          }}
                          colorPalette="green"
                        >
                          <Switch.HiddenInput />
                          <Switch.Control>
                            <Switch.Thumb />
                          </Switch.Control>
                        </Switch.Root>
                        <Text fontWeight="bold">{label}</Text>
                      </Flex>

                      <Text>
                        {timeSlots.length > 0
                          ? timeSlots
                              .map(
                                (t: { openTime: any; closeTime: any }) =>
                                  `${t.openTime} - ${t.closeTime}`
                              )
                              .join(", ")
                          : "Closed"}
                      </Text>

                      <Box
                        onClick={() => handleDayClick(label)}
                        cursor="pointer"
                      >
                        <IoIosArrowForward size={20} color="#575757" />
                      </Box>
                    </Flex>
                  );
                })}
              </VStack>
            )
          ) : (
            user?.role.toLowerCase() === "admin" && (
              <Center p={10}>
                <Text>
                  Por favor seleccione una sucursal para ver su horario.
                </Text>
              </Center>
            )
          )}
        </Box>
      </Box>

      {branchId && (
        <BusinessHoursModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          day={selectedDay}
          branchId={branchId}
        />
      )}
    </>
  );
};

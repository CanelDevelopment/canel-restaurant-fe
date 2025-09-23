import {
  Dialog,
  Button,
  Text,
  VStack,
  Grid,
  GridItem,
  Input,
  Flex,
  Box,
  Icon,
} from "@chakra-ui/react";
import { FiX, FiPlus } from "react-icons/fi";
import { BiSolidTrash } from "react-icons/bi";
import { useEffect, useState } from "react";
import { useAddSchedule } from "@/hooks/schedule/usecreateschedule";
import { useFetchSchedules } from "@/hooks/schedule/usefetchschedule";

// Day → Number Map
const mapDayToNumber = (day: string): number => {
  const map: Record<string, number> = {
    Sunday: 0,
    Monday: 1,
    Tuesday: 2,
    Wednesday: 3,
    Thursday: 4,
    Friday: 5,
    Saturday: 6,
  };
  return map[day] ?? 6;
};

interface BusinessHoursModalProps {
  isOpen: boolean;
  onClose: () => void;
  day: string | null;
  branchId: string;
}

export const BusinessHoursModal: React.FC<BusinessHoursModalProps> = ({
  isOpen,
  onClose,
  day,
  branchId,
}) => {
  const [shifts, setShifts] = useState([
    { openTime: "10:00", closeTime: "14:00" },
    { openTime: "17:00", closeTime: "21:00" },
  ]);

  const { mutate: addSchedule } = useAddSchedule();
  const { data: scheduleData } = useFetchSchedules(branchId);

  // Load schedule from backend when modal opens
  useEffect(() => {
    if (!day || !scheduleData) return;

    const matched = scheduleData.find(
      (s) => s.dayOfWeek === mapDayToNumber(day)
    );

    if (matched?.timeSlots?.length) {
      const prefilled = matched.timeSlots.map((slot) => ({
        openTime: slot.openTime.slice(0, 5), // HH:mm:ss → HH:mm
        closeTime: slot.closeTime.slice(0, 5),
      }));
      setShifts(prefilled);
    } else {
      setShifts([{ openTime: "10:00", closeTime: "14:00" }]);
    }
  }, [day, scheduleData, isOpen]);

  const handleSave = () => {
    if (!day) return;

    addSchedule({
      branchId: branchId,
      dayOfWeek: mapDayToNumber(day),
      isActive: true,
      timeSlots: shifts,
    });

    onClose();
  };

  if (!isOpen) return null;

  return (
    <Dialog.Root size={["xs", "md"]} open={isOpen}>
      <Dialog.Backdrop />
      <Dialog.Positioner>
        <Dialog.Content rounded="2xl" border="0.5px solid #DFDFDF" width="100%">
          <Dialog.CloseTrigger>
            <Box
              position="absolute"
              right="1"
              top="1"
              bgColor="Cbutton"
              rounded="full"
              color="#fff"
              p={0.5}
              onClick={onClose}
            >
              <FiX />
            </Box>
          </Dialog.CloseTrigger>

          <Dialog.Header roundedTop="2xl" bgColor="#E2F8ED" pb={4}>
            <Dialog.Title>
              <Text
                fontWeight="normal"
                fontFamily="AmsiProCond-Black"
                color="Cbutton"
                fontSize="xl"
              >
                Horario Comercial
              </Text>
              <Text fontSize="xs" fontWeight="normal" color="gray.500">
                Establezca su horario comercial aquí. Para ajustar días
                específicos, use el calendario.
              </Text>
            </Dialog.Title>
          </Dialog.Header>

          <Dialog.Body py={6} px={4}>
            <VStack align="stretch" spaceY={6} w="100%">
              {/* Shifts */}
              {shifts.map((shift, index) => (
                <Box key={index}>
                  <Grid templateColumns="repeat(2, 1fr)" gap={4} w="90%">
                    <GridItem>
                      Abre
                      <Input
                        type="time"
                        bgColor="#F4F4F4"
                        value={shift.openTime}
                        onChange={(e) => {
                          const updated = [...shifts];
                          updated[index].openTime = e.target.value;
                          setShifts(updated);
                        }}
                        rounded="md"
                        border="none"
                        mt={3}
                        color="#929292"
                      />
                    </GridItem>
                    <GridItem position="relative">
                      Cierra
                      <Input
                        type="time"
                        bgColor="#F4F4F4"
                        value={shift.closeTime}
                        onChange={(e) => {
                          const updated = [...shifts];
                          updated[index].closeTime = e.target.value;
                          setShifts(updated);
                        }}
                        rounded="md"
                        border="none"
                        mt={3}
                        color="#929292"
                      />
                      {index > 0 && (
                        <Icon
                          as={BiSolidTrash}
                          position="absolute"
                          right="-12"
                          top="10"
                          bgColor="#FFD3D3"
                          color="#EF4B4B"
                          p={2}
                          rounded="full"
                          fontSize="3xl"
                          cursor="pointer"
                          onClick={() => {
                            const updated = [...shifts];
                            updated.splice(index, 1);
                            setShifts(updated);
                          }}
                        />
                      )}
                    </GridItem>
                  </Grid>
                </Box>
              ))}

              {/* Add Shift Button */}
              <Box w="90%">
                <Button
                  w="100%"
                  size="sm"
                  mb={4}
                  bgColor="#F4F4F4"
                  color="#373B3F"
                  rounded="md"
                  py={6}
                  fontFamily="AmsiProCond-Black"
                  fontSize="md"
                  onClick={() =>
                    setShifts((prev) => [
                      ...prev,
                      { openTime: "10:00", closeTime: "14:00" },
                    ])
                  }
                >
                  <Icon as={FiPlus} color="#93AFD6" size="lg" />
                  <Text mb={1}>Añadir otro Turno</Text>
                </Button>
              </Box>
            </VStack>

            {/* Footer buttons */}
            <Flex justify="space-between" width="90%">
              <Button
                variant="outline"
                onClick={onClose}
                bgColor="#DDDDDD"
                color="Cbutton"
                w="48%"
              >
                Cancelar
              </Button>
              <Button
                onClick={handleSave}
                colorScheme="green"
                bgColor="Cgreen"
                color="Cbutton"
                w="48%"
              >
                Guardar
              </Button>
            </Flex>
          </Dialog.Body>
        </Dialog.Content>
      </Dialog.Positioner>
    </Dialog.Root>
  );
};

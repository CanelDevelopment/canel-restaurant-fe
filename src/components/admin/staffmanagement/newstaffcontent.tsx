import {
  Box,
  Button,
  createListCollection,
  Flex,
  Input,
  Portal,
  Select,
  Separator,
  Text,
  VStack,
  // Center,
  // Spinner,
} from "@chakra-ui/react";
import type React from "react";
import { authClient } from "@/provider/user.provider";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import PhoneInput from "react-phone-input-2";
import { useFetchCurrentUser } from "@/hooks/user/usefetchuser";
import { useFetchBranch } from "@/hooks/branch/usefetchbranch";
import { useMemo, useState } from "react";

const frameworks = createListCollection({
  items: [
    { label: "Manager", value: "manager" },
    { label: "Rider", value: "rider" },
    { label: "Admin", value: "admin" },
  ],
});

type CustomRole = "admin" | "user" | "manager" | "rider";

type StaffFormValues = {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  confirmPassword: string;
  role?: CustomRole;
  phone: number;
  branch: string;
  status: boolean;
};

// const [showPassword, setShowPassword] = useState(false);
// const handleShowClick = () => setShowPassword(!showPassword);

async function onSubmit(values: StaffFormValues) {
  if (values.password !== values.confirmPassword) {
    toast.error("¡Las contraseñas no coinciden!");
    return;
  }

  let roleForAuth: CustomRole | undefined;

  switch (values.role) {
    case "admin":
      roleForAuth = "admin";
      break;
    case "manager":
      roleForAuth = "manager";
      break;
    case "rider":
      roleForAuth = "rider";
      break;
    default:
      roleForAuth = undefined;
      break;
  }

  await authClient.admin.createUser(
    {
      name: `${values.firstName} ${values.lastName}`,
      email: values.email,
      password: values.password,
      data: {
        role: roleForAuth,
        phone: values.phone,
        branch: values.branch,
        status: values.status,
      },
    },
    {
      onSuccess: async () => {
        // console.log(ctx);
        toast.success("Personal creado exitosamente");
        await authClient.emailOtp.sendVerificationOtp({
          email: values.email,
          type: "email-verification",
        });
      },
      onError: (ctx) => {
        toast.error(ctx.error.message);
        console.log(ctx);
      },
    }
  );

  // console.log("Personal creado:", newStaff);
}

export const AddNewStaffContent: React.FC = () => {
  const { register, handleSubmit } = useForm<StaffFormValues>({
    defaultValues: {
      status: true,
    },
  });

  // --- FIX #2: Watch the boolean value and derive the display label and select value ---
  // const currentStatusBoolean = watch("status");
  // const currentStatusLabel = currentStatusBoolean ? "Activo" : "Inactivo";
  // const currentStatusString = currentStatusBoolean ? "active" : "inactive";

  // const [phoneNumber, setPhoneNumber] = useState("");

  const [showPassword, setShowPassword] = useState(false);
  const handleShowClick = () => setShowPassword(!showPassword);

  const { data: user } = useFetchCurrentUser();
  const { data: allBranches } = useFetchBranch();
  const [selectedBranchText, setSelectedBranchText] = useState<string>("");
  const [selectedBranchId, setSelectedBranchId] = useState<string>("");

  const availableBranches = useMemo(() => {
    if (!user || !allBranches) return [];

    if (user.role.toLowerCase() === "admin") {
      return allBranches;
    }

    if (user.role.toLowerCase() === "manager" && user.id) {
      const assignedBranch = allBranches.find(
        (branch) => branch.manager?.id === user.id
      );
      return assignedBranch ? [assignedBranch] : [];
    }

    return [];
  }, [user, allBranches]);

  const branchOptions = createListCollection({
    items: [
      ...(user && user.role.toLowerCase() === "admin"
        ? [{ key: "all", textValue: "All Branches", children: "All Branches" }]
        : []),
      ...(availableBranches?.map((branch) => ({
        key: branch.id,
        textValue: branch.name,
        children: branch.name,
      })) || []),
    ],
  });

  return (
    <Box>
      {/* <Center
        gap={4}
        alignItems={["start", "start", "center", "center"]}
        justifyContent={"space-between"}
        px={[3, 5, 5, 10]}
        py={7}
        flexDirection={["column", "column", "row"]}
        bgColor={"#FFF"}
      >
        <Flex
          gapY={4}
          flexWrap={["wrap", "nowrap"]}
          justifyContent={"space-between"}
          w={"full"}
        >
          <Flex gapX={4}>
            <Button
              fontFamily={"AmsiProCond"}
              bgColor={"Cgreen"}
              color={"Cbutton"}
              rounded={"md"}
              fontSize={"md"}
            >
              <FaPlus />
              Añadir Nuevo
            </Button>

            <Button bgColor={"#000"} color={"#fff"} fontFamily={"AmsiProCond"}>
              <IoListOutline />
              Lista
            </Button>
          </Flex>

          <Flex alignItems={"center"} gapX={5}>
            <Text color={"#000"}>Estado</Text>

            <Box w={"full"}>
              <Select.Root
                w={["60vw", "20vw", "40vw", "10vw"]}
                collection={statusCollection}
                value={[currentStatusString]} // Display the current status
                onValueChange={(details) => {
                  if (details.value.length > 0) {
                    // Convert the selected string ("active" / "inactive") to a boolean for the form state
                    const selectedBoolean = details.value[0] === "active";
                    setValue("status", selectedBoolean, {
                      shouldValidate: true,
                    });
                  }
                }}
              >
                <Select.HiddenSelect />
                <Select.Control
                  bgColor={"#f3f3f3"}
                  borderRadius="md"
                  cursor={"pointer"}
                  _hover={{ borderColor: "gray.400" }}
                  _focus={{
                    borderColor: "green.400",
                    boxShadow: "0 0 0 1px green.400",
                  }}
                >
                  <Select.Trigger cursor={"pointer"} border="none">
                    <Select.ValueText placeholder="Select Status" />
                  </Select.Trigger>
                  <Select.IndicatorGroup>
                    <Select.Indicator />
                  </Select.IndicatorGroup>
                </Select.Control>
                <Select.Positioner>
                  <Select.Content bg="#fff" borderWidth="1px">
                    {statusCollection.items.map((framework) => (
                      <Select.Item item={framework} key={framework.value}>
                        {framework.label}
                        <Select.ItemIndicator />
                      </Select.Item>
                    ))}
                  </Select.Content>
                </Select.Positioner>
              </Select.Root>
            </Box>
          </Flex>
        </Flex>
      </Center> */}

      <Separator opacity={0.1} />

      <Box bgColor={"#fff"}>
        {/* Left side */}
        <Box w={["100%", "100%", "50%"]} px={[3, 5, 5, 10]} py={7}>
          <Box maxW="md">
            <VStack align="stretch" color={"#000"} spaceY={5}>
              {/* First Name */}
              <Flex flexDirection={["column", "row"]}>
                <Text minW={"150px"} mb="1">
                  Prénom
                </Text>
                <Input
                  border={"none"}
                  bgColor={"#F4F4F4"}
                  rounded={"lg"}
                  _placeholder={{ color: "#929292" }}
                  placeholder="Ingrese el Prénom"
                  {...register("firstName", { required: "Requerido" })}
                />
              </Flex>

              {/* Last Name */}
              <Flex flexDirection={["column", "row"]}>
                <Text minW={"150px"} mb="1">
                  Nom de famille
                </Text>
                <Input
                  border={"none"}
                  bgColor={"#F4F4F4"}
                  rounded={"lg"}
                  _placeholder={{ color: "#929292" }}
                  placeholder="Ingrese el apellido"
                  {...register("lastName")}
                />
              </Flex>

              {/* Email Address */}
              <Flex flexDirection={["column", "row"]}>
                <Text minW={"150px"} mb="1">
                  Adresse email
                </Text>
                <Input
                  border={"none"}
                  bgColor={"#F4F4F4"}
                  rounded={"lg"}
                  _placeholder={{ color: "#929292" }}
                  placeholder="Ingrese el adresse email"
                  type="email"
                  {...register("email", { required: "Requerido" })}
                />
              </Flex>

              {/* Phone Number */}
              <Flex flexDirection={["column", "row"]}>
                <Text minW={"150px"} mb="1">
                  Número de Teléfono
                </Text>
                {/* <Input
                  border={"none"}
                  bgColor={"#F4F4F4"}
                  rounded={"lg"}
                  _placeholder={{ color: "#929292" }}
                  placeholder="+1"
                  type="number"
                  {...register("phone")}
                /> */}
                <PhoneInput
                  country={"us"}
                  // value={phoneNumber}
                  // onChange={(phone) => setPhoneNumber(phone)}
                  onlyCountries={["us", "ve", "pk"]}
                  countryCodeEditable={false}
                  // inputStyle={{
                  //   width: "100%",
                  //   height: "48px",
                  //   fontSize: "1rem",
                  //   border: "1px solid #E2E8F0",
                  //   borderRadius: "8px",
                  // }}
                  buttonStyle={{
                    borderTopLeftRadius: "8px",
                    borderBottomLeftRadius: "8px",
                    border: "1px solid #E2E8F0",
                    backgroundColor: "#f9f9f9",
                  }}
                  containerStyle={{ width: "100%" }}
                />
              </Flex>

              {/* New Password */}
              <Flex flexDirection={["column", "row"]}>
                <Text minW={"150px"} mb="1">
                  Nouveau mot de passe
                </Text>
                <Input
                  border={"none"}
                  bgColor={"#F4F4F4"}
                  rounded={"lg"}
                  _placeholder={{ color: "#929292" }}
                  placeholder="Ingrese la Nouveau mot de passe"
                  {...register("password")}
                  type="password"
                />
              </Flex>

              {/* Confirm Password */}
              <Flex flexDirection={"column"}>
                <Box display={"flex"} flexDirection={["column", "row"]}>
                  <Text minW={"150px"} mb="1">
                    Confirmez le mot de passe
                  </Text>
                  <Input
                    border={"none"}
                    bgColor={"#F4F4F4"}
                    rounded={"lg"}
                    _placeholder={{ color: "#929292" }}
                    placeholder="Confirme su mot de passe"
                    {...register("confirmPassword")}
                    // type="password"
                    type={showPassword ? "text" : "password"}
                  />
                </Box>
                <Text
                  color={"#4394D7"}
                  fontSize={"xs"}
                  textAlign={"end"}
                  onClick={handleShowClick}
                  cursor={"pointer"}
                >
                  Mostrar Contraseña
                </Text>
              </Flex>

              {/* Select Branch */}
              <Flex flexDirection={["column", "row"]}>
                <Text minW={"150px"} mb="1">
                  Seleccionar Sucursal
                </Text>
                <Select.Root
                  collection={branchOptions}
                  value={[selectedBranchId]}
                  onValueChange={(details) => {
                    const selectedItem = branchOptions.items.find(
                      (item) => item.key === details?.value[0]
                    );
                    if (selectedItem) {
                      setSelectedBranchId(selectedItem.key);
                      setSelectedBranchText(selectedItem.textValue);
                    }
                  }}
                >
                  <Select.Control>
                    <Select.Trigger bg="#ebebeb" h="42px" border="none">
                      <Select.ValueText placeholder="Seleccionar Sucursal">
                        {selectedBranchText}
                      </Select.ValueText>
                      <Select.Indicator color={"#575757"} />
                    </Select.Trigger>
                  </Select.Control>
                  <Portal>
                    <Select.Positioner zIndex={2000}>
                      <Select.Content zIndex={2000}>
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
              </Flex>

              {/* User Role */}
              <Flex flexDirection={["column", "row"]}>
                <Text minW={"150px"} mb="1">
                  Rol de Usuario
                </Text>
                <Select.Root collection={frameworks}>
                  <Select.HiddenSelect {...register("role")} />
                  <Select.Control>
                    <Select.Trigger
                      border={"none"}
                      bgColor={"#EBEBEB"}
                      rounded={"lg"}
                      _placeholder={{ color: "#929292" }}
                    >
                      <Select.ValueText placeholder="Seleccionar" />
                    </Select.Trigger>
                    <Select.IndicatorGroup>
                      <Select.Indicator />
                    </Select.IndicatorGroup>
                  </Select.Control>
                  <Portal>
                    <Select.Positioner>
                      <Select.Content>
                        {frameworks.items.map((framework) => (
                          <Select.Item item={framework} key={framework.value}>
                            {framework.label}
                            <Select.ItemIndicator />
                          </Select.Item>
                        ))}
                      </Select.Content>
                    </Select.Positioner>
                  </Portal>
                </Select.Root>
              </Flex>
            </VStack>
          </Box>
        </Box>

        <Box px={[3, 5, 5, 10]}>
          <Flex justifyContent={"end"}>
            <Button
              bgColor={"Cgreen"}
              color={"Cbutton"}
              rounded={"lg"}
              fontSize={"md"}
              fontFamily={"AmsiProCond"}
              px={16}
              onClick={handleSubmit(onSubmit)}
            >
              Guardar
            </Button>
          </Flex>
        </Box>
      </Box>
    </Box>
  );
};

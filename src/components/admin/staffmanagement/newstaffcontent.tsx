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
    { label: "Repartidor", value: "rider" },
    { label: "Administrador", value: "admin" },
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
}

export const AddNewStaffContent: React.FC = () => {
  const { register, handleSubmit } = useForm<StaffFormValues>({
    defaultValues: {
      status: true,
    },
  });

  const [showPassword, setShowPassword] = useState(false);
  const handleShowClick = () => setShowPassword(!showPassword);

  const { data: user } = useFetchCurrentUser();
  const { data: allBranches } = useFetchBranch();
  const [selectedBranchText, setSelectedBranchText] = useState<string>("");
  const [selectedBranchId, setSelectedBranchId] = useState<string>("");

  const availableBranches = useMemo(() => {
    if (!user || !allBranches) return [];

    if (user.role.toLowerCase() === "admin") return allBranches;

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
        ? [
            {
              key: "all",
              textValue: " Sucursales",
              children: " Sucursales",
            },
          ]
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
      <Separator opacity={0.1} />

      <Box bgColor={"#fff"}>
        <Box w={["100%", "100%", "50%"]} px={[3, 5, 5, 10]} py={7}>
          <Box maxW="md">
            <VStack align="stretch" color={"#000"} spaceY={5}>
              {/* First Name */}
              <Flex flexDirection={["column", "row"]}>
                <Text minW={"150px"} mb="1">
                  Nombre
                </Text>
                <Input
                  border={"none"}
                  bgColor={"#F4F4F4"}
                  rounded={"lg"}
                  _placeholder={{ color: "#929292" }}
                  placeholder="Ingrese el nombre"
                  {...register("firstName", { required: "Requerido" })}
                />
              </Flex>

              {/* Last Name */}
              <Flex flexDirection={["column", "row"]}>
                <Text minW={"150px"} mb="1">
                  Apellido
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

              {/* Email */}
              <Flex flexDirection={["column", "row"]}>
                <Text minW={"150px"} mb="1">
                  E-mail
                </Text>
                <Input
                  border={"none"}
                  bgColor={"#F4F4F4"}
                  rounded={"lg"}
                  _placeholder={{ color: "#929292" }}
                  placeholder="Ingrese el E-mail"
                  type="email"
                  {...register("email", { required: "Requerido" })}
                />
              </Flex>

              {/* Phone */}
              <Flex flexDirection={["column", "row"]}>
                <Text minW={"150px"} mb="1">
                  Número de Teléfono
                </Text>
                <PhoneInput
                  country={"us"}
                  onlyCountries={["us", "ve", "pk"]}
                  countryCodeEditable={false}
                  buttonStyle={{
                    borderTopLeftRadius: "8px",
                    borderBottomLeftRadius: "8px",
                    border: "1px solid #E2E8F0",
                    backgroundColor: "#f9f9f9",
                  }}
                  containerStyle={{ width: "100%" }}
                />
              </Flex>

              {/* Password */}
              <Flex flexDirection={["column", "row"]}>
                <Text minW={"150px"} mb="1">
                  Contraseña
                </Text>
                <Input
                  border={"none"}
                  bgColor={"#F4F4F4"}
                  rounded={"lg"}
                  _placeholder={{ color: "#929292" }}
                  placeholder="Ingrese la contraseña"
                  {...register("password")}
                  type="password"
                />
              </Flex>

              {/* Confirm Password */}
              <Flex flexDirection={"column"}>
                <Box display={"flex"} flexDirection={["column", "row"]}>
                  <Text minW={"150px"} mb="1">
                    Confirmar Contraseña
                  </Text>
                  <Input
                    border={"none"}
                    bgColor={"#F4F4F4"}
                    rounded={"lg"}
                    _placeholder={{ color: "#929292" }}
                    placeholder="Confirme la contraseña"
                    {...register("confirmPassword")}
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

              {/* Branch */}
              <Flex flexDirection={["column", "row"]}>
                <Text minW={"150px"} mb="1">
                  Sucursal
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

              {/* Role */}
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

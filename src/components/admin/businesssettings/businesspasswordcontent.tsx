import { Box, VStack, Text, Flex, Button } from "@chakra-ui/react";
import { BusinessHeader } from "./businessheader";
import { authClient } from "@/provider/user.provider";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { PasswordInput } from "@/components/ui/password-input";

type ResetPassword = {
  currentPassword: string;
  newPassword: string;
  confirmNewPassword: string;
};

export const BusinessPasswordContent = () => {
  const { register, handleSubmit } = useForm<ResetPassword>();

  async function handleResetPassword(values: ResetPassword) {
    console.log("Hello");
    if (values.confirmNewPassword !== values.newPassword)
      return toast.error("passwords don't match");

    await authClient.changePassword(
      {
        currentPassword: values.currentPassword,
        newPassword: values.confirmNewPassword,
      },
      {
        onSuccess() {
          toast.success("Password has been changed successsfully");
        },
        onError: (error) => {
          toast.error(error.error.message || "Something went wrong");
        },
      }
    );
  }

  return (
    <>
      <Box bg={"#fff"} py={10}>
        <BusinessHeader
          title="Contraseña y Seguridad"
          description="Gestione su contraseña, preferencias de inicio de sesión y métodos de recuperación."
        />

        <Box width={["100%", "100%", "100%", "50%"]} px={[3, 5, 10]} py={4}>
          <form onSubmit={handleSubmit(handleResetPassword)}>
            <VStack align="stretch" spaceY={6}>
              {/* Current Password */}
              <Flex
                flexDirection={["column", "column", "row"]}
                alignItems={["start", "start", "center"]}
              >
                <Text
                  fontWeight="medium"
                  color="gray.700"
                  fontFamily="AmsiProCond-Black"
                  mb={1}
                  minW={"180px"}
                >
                  Mot de Passe actuel
                </Text>
                <PasswordInput
                  placeholder="mot de passe actuel"
                  type="password"
                  size="lg"
                  borderColor="#EBEBEB"
                  bgColor="#F4F4F4"
                  rounded="md"
                  _placeholder={{
                    color: "#929292",
                    fontFamily: "AmsiProCond",
                  }}
                  {...register("currentPassword")}
                />
              </Flex>

              {/* New Password */}
              <Flex
                flexDirection={["column", "column", "row"]}
                alignItems={["start", "start", "center"]}
              >
                <Text
                  fontWeight="medium"
                  color="gray.700"
                  fontFamily="AmsiProCond-Black"
                  mb={1}
                  minW={"180px"}
                >
                  Nouveau mot de passe
                </Text>
                <PasswordInput
                  placeholder="Ingrese su nueva contraseña"
                  type="password"
                  size="lg"
                  borderColor="#EBEBEB"
                  bgColor="#F4F4F4"
                  rounded="md"
                  _placeholder={{
                    color: "#929292",
                    fontFamily: "AmsiProCond",
                  }}
                  {...register("newPassword")}
                />
              </Flex>

              {/* Confirm New Password */}
              <Flex
                flexDirection={["column", "column", "row"]}
                alignItems={["start", "start", "center"]}
              >
                <Text
                  fontWeight="medium"
                  color="gray.700"
                  fontFamily="AmsiProCond-Black"
                  mb={1}
                  minW={"180px"}
                >
                  Confirmez le mot de passe
                </Text>
                <PasswordInput
                  placeholder="Confirmez le mot de passe"
                  type="password"
                  size="lg"
                  borderColor="#EBEBEB"
                  bgColor="#F4F4F4"
                  rounded="md"
                  _placeholder={{
                    color: "#929292",
                    fontFamily: "AmsiProCond",
                  }}
                  {...register("confirmNewPassword")}
                />
              </Flex>
            </VStack>
          </form>
        </Box>

        <Box
          display={"flex"}
          justifyContent={"end"}
          w={"100%"}
          px={10}
          py={4}
          mt={20}
        >
          <Button
            bgColor={"Cgreen"}
            px={16}
            color={"Cbutton"}
            onClick={handleSubmit(handleResetPassword)}
          >
            Guardar
          </Button>
        </Box>
      </Box>
    </>
  );
};

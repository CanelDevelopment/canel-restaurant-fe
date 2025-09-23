import { Box, Flex, Icon, Text, Image, VStack, Stack } from "@chakra-ui/react";
import { IoIosArrowForward } from "react-icons/io";
import { useNavigate } from "react-router-dom";

export const MainPageContent = () => {
  const sections = [
    {
      title: "Nom e Información del Negocio",
      description:
        "Informe a los clientes sobre su negocio, liste su información de contacto y vincule sus cuentas de redes sociales.",
      link: "/dashboard/business_name_info",
    },
    {
      title: "Perfil y Banners",
      description:
        "Añada su logotipo, suba fotos del espacio de trabajo y elija su foto de portada.",
      link: "/dashboard/profile_banner",
    },
    {
      title: "Horario Comercial",
      description: "Informe a sus clientes cuándo está disponible para citas.",
      link: "/dashboard/business_hours",
    },
    {
      title: "Contraseña y Seguridad",
      description:
        "Gestione sus contraseñas, preferencias de inicio de sesión y métodos de recuperación.",
      link: "/dashboard/business_password",
    },
  ];

  const navigate = useNavigate();

  return (
    <Box bgColor={"#fff"} px={[4, 6, 10]} pt={14} pb={24} position="relative">
      {/* Circles in vertical stack behind cards */}
      <VStack
        // spacing={8}
        position="absolute"
        top={12}
        left={12}
        display={["none", "none", "flex"]}
        zIndex={0}
        spaceY={8}
      >
        {[...Array(4)].map((_, i) => (
          <Box key={i} bgColor="#FBFFF0" rounded="full" w="80px" h="80px"></Box>
        ))}
      </VStack>

      {/* Main content layout */}
      <Flex
        direction={["column", "column", "row"]}
        align="flex-start"
        justify="space-between"
        mt={[0, 0, 0]}
        gap={10}
      >
        {/* Left content (business cards) */}
        <Box w={["100%", "100%", "55%"]} px={[0, 0, 6]}>
          <Stack spaceY={5}>
            {sections.map((item, index) => (
              <Flex
                key={index}
                alignItems="center"
                border="0.3px solid #EBEBEB"
                rounded="xl"
                px={4}
                py={6}
                justify="space-between"
                position="relative"
                onClick={() => navigate(item.link)}
                cursor="pointer"
              >
                <Box pr={4}>
                  <Text
                    color="Cbutton"
                    fontFamily="AmsiProCond-Black"
                    fontSize="md"
                  >
                    {item.title}
                  </Text>
                  <Text color="#58615A" fontSize="sm" lineHeight="20px" mt={1}>
                    {item.description}
                  </Text>
                </Box>
                <Icon fontSize="lg" color="Cbutton" as={IoIosArrowForward} />
              </Flex>
            ))}
          </Stack>
        </Box>

        {/* Right image */}
        <Box w={["100%", "100%", "40%"]} textAlign="center">
          <Image
            loading="lazy"
            src="/admin/business_bg.png"
            alt="detalles-del-negocio"
            maxW={["80%", "60%", "100%"]}
            mx="auto"
          />
        </Box>
      </Flex>
    </Box>
  );
};

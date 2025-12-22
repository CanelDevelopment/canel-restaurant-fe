import { Box, Container, Heading, Icon, Image, Text } from "@chakra-ui/react";
import { AiFillFacebook, AiFillInstagram } from "react-icons/ai";

import React from "react";
import { useFetchLinks } from "@/hooks/branding/usefetchbranding";

const Footer: React.FC = () => {
  const { data } = useFetchLinks();
  const instagramUrl = data?.instagram || "";
  const facebookUrl = data?.facebook || "";

  return (
    <>
      <Box
        position={"relative"}
        bgImage={"url(/Background/greenBg.png)"}
        bgSize={"cover"}
        width={"full"}
        minHeight={["46vh", "43vh", "384px"]}
        px={4}
        py={0.5}
      >
        <Box
          backgroundImage="url('/Background/leave.png')"
          backgroundRepeat="no-repeat"
          width={"14%"}
          height={"60%"}
          position="absolute"
          bottom={0}
          right={0}
          zIndex={0}
        />

        <Container maxW={"container.xl"} mx={"auto"}>
          <Image
            loading="lazy"
            src="/Logos/foterlogo.png"
            alt="Logo"
            px={[3, 6]}
            pb={[3]}
            pt={[7, 7, 8, 12]}
            width={["30vw", "20vw", "14vw", "10vw"]}
            bg={"white"}
          />
          <Heading
            fontSize={["xl", "xl", "2xl", "4xl"]}
            color={"Cgreen"}
            py={6}
            lineHeight={"1.2"}
            fontFamily={"AmsiProCond"}
          >
            RECIBE LO MEJOR DE CANEL EN LA <br /> PUERTA DE TU CASA
          </Heading>
          <Text
            width={["full", "70%", "70%", "50%"]}
            color={"white"}
            fontSize={["xs", "10px", "12px", "13px"]}
            fontFamily={"AmsiProCond-Light"}
            pb={{ base: 3, md: 8 }}
            letterSpacing={[1.2, 1.5]}
          >
            Explora la increíble variedad de comida de Canel Restaurante.
            Deléitate con nuestra amplia gama de postres tradicionales y platos
            salados, todos elaborados con los ingredientes más frescos. Si se te
            antojan comidas auténticas y sabrosas o dulces deliciosos, pide
            ahora y disfruta del sabor de la tradición entregado directamente en
            tu puerta.
          </Text>
        </Container>
      </Box>

      <Container
        bgColor={"white"}
        color={"#111"}
        display={"flex"}
        flexDirection={["column", "row"]}
        justifyContent={["start", "space-between"]}
        alignItems={["flex-start", "center"]}
        py={3}
      >
        <Box
          display={"flex"}
          gapY={[0, 2]}
          fontSize={["sm", "10px", "10px", "12px"]}
          fontWeight={"light"}
          alignItems={["center", "center"]}
        >
          <Text>
            Copyright &copy; 2025 <b>Canel Restaurante.</b>
          </Text>
        </Box>

        <Box display={"flex"} alignItems={"center"} gap={2}>
          <Text
            color={"#2D4D3A"}
            fontSize={["sm", "10px", "10px", "12px"]}
            fontWeight={"bold"}
          >
            Síguenos:
          </Text>
          <Box display={"flex"} gap={2}>
            <Icon
              as={AiFillInstagram}
              size={"sm"}
              href={instagramUrl}
              cursor={"pointer"}
            />
            <Icon
              as={AiFillFacebook}
              size={"sm"}
              href={facebookUrl}
              cursor={"pointer"}
            />
            {/* <AiFillInstagram size={16} /> */}
            {/* <FaFacebook size={14} /> */}
          </Box>
        </Box>
      </Container>
    </>
  );
};

export default Footer;

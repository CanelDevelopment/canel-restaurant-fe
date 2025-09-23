import { Box, Text, Image, Input, Icon, Button } from "@chakra-ui/react";
import { BusinessHeader } from "./businessheader";
import React, { useRef, useState } from "react";
import { FaCamera } from "react-icons/fa6";
import { useAddBranding } from "@/hooks/branding/usecreatebranding";

export const ProfileContent: React.FC = () => {
  const logoInputRef = useRef<HTMLInputElement>(null);
  const bannerInputRef = useRef<HTMLInputElement>(null);
  const heroInputRef = useRef<HTMLInputElement>(null);

  const [logoFile, setLogoFile] = useState<File | null>(null);
  const [bannerFile, setBannerFile] = useState<File | null>(null);
  const [_heroFile, setHeroFile] = useState<File | null>(null);

  const [logoPreview, setLogoPreview] = useState<string | null>(null);
  const [bannerPreview, setBannerPreview] = useState<string | null>(null);
  const [heroPreview, setHeroPreview] = useState<string | null>(null);

  const { mutate, isPending } = useAddBranding();

  const handleLogoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setLogoFile(file);
      setLogoPreview(URL.createObjectURL(file));
    }
  };

  const handleBannerChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setBannerFile(file);
      setBannerPreview(URL.createObjectURL(file));
    }
  };

  const handleHeroChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setHeroFile(file);
      setHeroPreview(URL.createObjectURL(file));
    }
  };

  const handleSubmit = () => {
    mutate({
      logo: logoFile ?? undefined,
      banner: bannerFile ?? undefined,
    });
  };

  return (
    <>
      <Box bgColor={"#fff"} py={10}>
        <BusinessHeader
          title="Perfil y Banners"
          description="Añada su logotipo, suba fotos del espacio de trabajo y elija su foto de portada"
        />

        <Box
          //   width={["100%", "100%", "60%", "50%", "34%"]}
          bg="white"
          borderRadius="md"
          px={[4, 10]}
          py={4}
        >
          {/* Logo Dashboard */}

          <Box width={["100%", "100%", "60%", "50%", "34%"]}>
            <Text
              color={"Cbutton"}
              fontFamily={"AmsiProCond-Black"}
              fontSize={"xl"}
            >
              Logo
            </Text>
            <Text color={"#939799"} fontFamily={"AmsiProCond"}>
              Suba el logotipo de su negocio para que sea visible en su site
              web.
            </Text>

            <Box
              w="100%"
              maxW="400px"
              h="150px"
              maxH={"150px"}
              bg="#f4f4f4"
              borderRadius="xl"
              display="flex"
              alignItems="center"
              justifyContent="center"
              cursor="pointer"
              onClick={() => logoInputRef.current?.click()}
              position="relative"
              mt={6}
            >
              <Input
                type="file"
                accept="image/*"
                ref={logoInputRef}
                onChange={handleLogoChange}
                display="none"
              />

              {logoPreview ? (
                <Image
                  loading="lazy"
                  src={logoPreview}
                  alt="Logotipo subido"
                  //   boxSize="80px"
                  w={"30%"}
                  //   borderRadius="full"
                  objectFit="cover"
                />
              ) : (
                <Box
                  border="1px dashed #B5D5C5"
                  borderRadius="full"
                  px={5}
                  py={6}
                  display="flex"
                  flexDirection="column"
                  alignItems="center"
                  justifyContent="center"
                >
                  <Icon as={FaCamera} color="teal.500" boxSize={6} />
                  <Text
                    fontSize="sm"
                    fontFamily={"AmsiProCond-Black"}
                    mt={1}
                    color="gray.600"
                  >
                    Añadir Logo
                  </Text>
                </Box>
              )}
            </Box>
          </Box>

          {/* BAnner Dashboard */}
          <Box width={"100%"} mt={10}>
            <Text
              color={"Cbutton"}
              fontFamily={"AmsiProCond-Black"}
              fontSize={"xl"}
            >
              Banner de Temporada del Panel Principal
            </Text>
            <Text color={"#939799"} fontFamily={"AmsiProCond"}>
              Suba su banner principal para el panel de control
            </Text>

            <Box
              w="100%"
              //   maxW="400px"
              h="200px"
              bg="#f4f4f4"
              borderRadius="xl"
              display="flex"
              alignItems="center"
              justifyContent="center"
              cursor="pointer"
              onClick={() => bannerInputRef.current?.click()}
              position="relative"
              mt={6}
            >
              <Input
                type="file"
                accept="image/*"
                ref={bannerInputRef}
                onChange={handleBannerChange}
                display="none"
              />

              {bannerPreview ? (
                <Image
                  loading="lazy"
                  src={bannerPreview}
                  alt="Banner subido"
                  w={"100%"}
                  h={"100%"}
                  rounded={"xl"}
                  objectFit="cover"
                />
              ) : (
                <Box
                  border="1px dashed #B5D5C5"
                  borderRadius="full"
                  px={6}
                  py={5}
                  display="flex"
                  flexDirection="column"
                  alignItems="center"
                  justifyContent="center"
                >
                  <Icon as={FaCamera} color="teal.500" boxSize={6} />
                  <Text
                    fontSize="sm"
                    fontFamily={"AmsiProCond-Black"}
                    mt={1}
                    color="gray.600"
                  >
                    Portada
                  </Text>
                </Box>
              )}
            </Box>
          </Box>

          {/* website hero section */}
          <Box width={"100%"} mt={10}>
            <Text
              color={"Cbutton"}
              fontFamily={"AmsiProCond-Black"}
              fontSize={"xl"}
            >
              Sección Principal del Sitio Web
            </Text>
            <Text color={"#939799"} fontFamily={"AmsiProCond"}>
              Cambie la sección principal y añada ofertas para atraer más
              pedidos.
            </Text>

            <Box
              w="100%"
              //   maxW="400px"
              h="300px"
              bg="#f4f4f4"
              borderRadius="xl"
              display="flex"
              alignItems="center"
              justifyContent="center"
              cursor="pointer"
              onClick={() => heroInputRef.current?.click()}
              position="relative"
              mt={6}
            >
              <Input
                type="file"
                accept="image/*"
                ref={heroInputRef}
                onChange={handleHeroChange}
                display="none"
              />

              {heroPreview ? (
                <Image
                  loading="lazy"
                  src={heroPreview}
                  alt="Banner subido"
                  w={"100%"}
                  h={"100%"}
                  rounded={"xl"}
                  objectFit="cover"
                />
              ) : (
                <Box
                  border="1px dashed #B5D5C5"
                  borderRadius="full"
                  px={6}
                  py={7}
                  display="flex"
                  flexDirection="column"
                  alignItems="center"
                  justifyContent="center"
                >
                  <Icon as={FaCamera} color="teal.500" boxSize={6} />
                  <Text
                    fontSize="sm"
                    fontFamily={"AmsiProCond-Black"}
                    mt={1}
                    color="gray.600"
                  >
                    Añadir Imagen
                  </Text>
                </Box>
              )}
            </Box>
          </Box>

          <Box mt={8} display="flex" justifyContent="flex-end">
            <Button
              colorScheme="teal"
              onClick={handleSubmit}
              disabled={isPending}
              loadingText="Saving..."
              pb={1.5}
            >
              Guardar Cambios
            </Button>
          </Box>
        </Box>
      </Box>
    </>
  );
};

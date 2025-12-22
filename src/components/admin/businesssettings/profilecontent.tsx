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
  const [heroFile, setHeroFile] = useState<File | null>(null);

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
    console.log(heroFile);
    mutate({
      logo: logoFile ?? undefined,
      banner: bannerFile ?? undefined,
      mainSection: heroFile ?? undefined,
    });
  };

  return (
    <Box bgColor={"#fff"} py={10}>
      <BusinessHeader
        title="Perfil y Banners"
        description="Agregue su logotipo, suba fotos del espacio de trabajo y seleccione su imagen de portada"
      />

      <Box bg="white" borderRadius="md" px={[4, 10]} py={4}>
        {/* Logo */}
        <Box width={["100%", "100%", "60%", "50%", "34%"]}>
          <Text
            color={"Cbutton"}
            fontFamily={"AmsiProCond-Black"}
            fontSize={"xl"}
          >
            Logotipo
          </Text>
          <Text color={"#939799"} fontFamily={"AmsiProCond"}>
            Suba el logotipo de su negocio para que sea visible en su sitio web.
          </Text>

          <Box
            w="100%"
            maxW="400px"
            h="150px"
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
                w={"30%"}
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
                  Añadir Logotipo
                </Text>
              </Box>
            )}
          </Box>
        </Box>

        {/* Banner */}
        <Box width={"100%"} mt={10}>
          <Text
            color={"Cbutton"}
            fontFamily={"AmsiProCond-Black"}
            fontSize={"xl"}
          >
            Banner Principal del Panel
          </Text>
          <Text color={"#939799"} fontFamily={"AmsiProCond"}>
            Suba su banner principal para el panel de control
          </Text>

          <Box
            w="100%"
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
                  Añadir Banner
                </Text>
              </Box>
            )}
          </Box>
        </Box>

        {/* Hero Section */}
        <Box width={"100%"} mt={10}>
          <Text
            color={"Cbutton"}
            fontFamily={"AmsiProCond-Black"}
            fontSize={"xl"}
          >
            Sección Principal del Sitio Web
          </Text>
          <Text color={"#939799"} fontFamily={"AmsiProCond"}>
            Modifique la sección principal y agregue ofertas para atraer más
            pedidos.
          </Text>

          <Box
            w="100%"
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
                alt="Imagen principal subida"
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
            pb={1.5}
          >
            Guardar Cambios
          </Button>
        </Box>
      </Box>
    </Box>
  );
};

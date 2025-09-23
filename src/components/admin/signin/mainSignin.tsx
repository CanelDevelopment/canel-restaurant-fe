import { Box, Flex, Image } from "@chakra-ui/react";
import { AdminSigninForm } from "./adminSigninForm";

export const MainSignin = () => {
  return (
    <Flex
      direction={["column", "row"]}
      justifyContent={"center"}
      minHeight="100vh"
      className="bg-white"
      position={"relative"}
    >
      {/* <Image
        loading="lazy"
        src="/Welcome/leaf.svg"
        alt="Logo"
        display={["none", "block"]}
        position={"absolute"}
        marginRight={32}
        boxSize={16}
      /> */}

      <Box
        bgImage={"url(/locationbg.png)"}
        bgSize={"cover"}
        bgPos={"center"}
        bgRepeat={"no-repeat"}
        boxShadow="md"
        width={["100%", "100%"]}
        className="max-sm:hidden"
        overflow={"hidden"}
      >
        <Image
          loading="lazy"
          src="/Logos/logo.png"
          alt="Logo"
          paddingTop={8}
          marginLeft={8}
          className="size-30"
        />
        {/* <Center
          marginTop={-8}
          borderRadius="md"
          flexDirection={"column"}
          alignItems="center"
          textAlign={"center"}
          width={"100%"}
          height={"100%"}
        >
          <Image
            src="/admin/Ad1.png"
            alt="Welcome"
            className="w-[24rem] h-30"
          />
          <Flex
            marginTop={4}
            gap={2}
            flexDirection={"column"}
            justifyContent={"center"}
            alignItems="center"
            textAlign={"center"}
          >
            <Text
              fontSize={"3xl"}
              lineHeight={1.5}
              fontFamily={"AmsiProCond-Black"}
              color={"#FCE8BB"}
            >
              Welcome Back to Your Dashboard
            </Text>
            <Text
              fontSize={"md"}
              lineHeight={1.5}
              fontWeight={"light"}
              color={"#FFFFFF"}
              fontFamily={"AmsiProCond"}
            >
              Manage every flavor of your business with ease. <br /> Track
              orders, update menus, and oversee operations in real-time. <br />{" "}
              Your restaurant's success starts here.
            </Text>
          </Flex>
        </Center> */}
      </Box>

      <AdminSigninForm />
    </Flex>
  );
};

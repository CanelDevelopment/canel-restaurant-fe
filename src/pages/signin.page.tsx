import {
  Box,
  Image,
  Flex,
  Text,
  IconButton,
  Input,
  Icon,
  Spinner,
  Center,
  Button,
} from "@chakra-ui/react";
import { FaGoogle } from "react-icons/fa";
import { RiWhatsappFill } from "react-icons/ri";
import PhoneInput from "react-phone-input-2";
import { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { Offline } from "@/provider/offline";
import { authClient } from "@/provider/user.provider";
import toast from "react-hot-toast";

const Signin = () => {
  const [phoneNumber, setPhoneNumber] = useState("");
  const [otp, setOtp] = useState("");
  const [otpSent, setOtpSent] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isOtpLoading, setIsOtpLoading] = useState(false);

  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  useEffect(() => {
    const redirectParam = searchParams.get("redirect");
    if (redirectParam) {
      console.log("💾 Saving redirect path to storage:", redirectParam);
      localStorage.setItem("postLoginRedirect", redirectParam);
    }
  }, [searchParams]);

  const { data: sessionData, isPending: isSessionPending } =
    authClient.useSession();

  const handleLoginSuccess = () => {
    const storedRedirect = localStorage.getItem("postLoginRedirect");
    const targetPath = storedRedirect || "/home";

    if (window.location.pathname === targetPath) {
      return;
    }

    // 3. CHANGE THIS: Use navigate instead of window.location.href
    console.log("🚀 Navigating to:", targetPath);
    navigate(targetPath);

    // Clean up storage after redirect
    localStorage.removeItem("postLoginRedirect");
  };

  useEffect(() => {
    if (!isSessionPending && sessionData?.session) {
      handleLoginSuccess();
    }
  }, [sessionData, isSessionPending]);

  const signInWithGoogle = async () => {
    setIsLoading(true);

    const frontendUrl = import.meta.env.VITE_FRONTEND_URL;

    const storedRedirect =
      localStorage.getItem("postLoginRedirect") ||
      searchParams.get("redirect") ||
      "";

    const callbackUrl = storedRedirect
      ? `${frontendUrl}${storedRedirect}`
      : frontendUrl;

    try {
      const { data, error } = await authClient.signIn.social({
        provider: "google",
        callbackURL: callbackUrl,
      });

      if (data?.url) {
        window.location.href = data.url;
      } else if (error) {
        console.error("Google Signin Error", error);
      }
    } catch (error) {
      console.error("Google Signin Error", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSendOtp = async () => {
    if (phoneNumber.length < 10) {
      toast.error("Por favor ingresa un número de teléfono válido.");
      return;
    }
    setIsLoading(true);
    await authClient.phoneNumber.sendOtp(
      { phoneNumber: `+${phoneNumber}` },
      {
        onSuccess: () => {
          setOtpSent(true);
          toast.success("¡OTP enviado exitosamente!");
          setIsLoading(false);
        },
        onError: (ctx) => {
          toast.error(ctx.error.message);
          setIsLoading(false);
        },
      }
    );
  };

  const handleVerifyOtp = async () => {
    if (otp.length < 6) {
      toast.error("Por favor ingresa el código OTP de 6 dígitos.");
      return;
    }

    setIsOtpLoading(true);

    await authClient.phoneNumber.verify(
      { phoneNumber: `+${phoneNumber}`, code: otp },
      {
        disableSession: false,
        updatePhoneNumber: true,

        onSuccess: (ctx) => {
          toast.success("¡Éxito!");
          console.log(ctx);
          if (ctx.data?.token) {
            localStorage.setItem("bearer_token", ctx.data.token);
            console.log("💾 Token saved manually to localStorage");
          }
          setIsOtpLoading(false);
        },
        onError: (ctx) => {
          toast.error(ctx.error.message);
          setIsOtpLoading(false);
        },
      }
    );
  };

  return (
    <Offline
      fallback={
        <Center h={"full"} w={"full"}>
          <Spinner />
        </Center>
      }
    >
      <Flex
        direction={["column", "row"]}
        justifyContent={"center"}
        minHeight="100vh"
        bg="white"
        position={"relative"}
      >
        <Box
          bgImage={"url(/locationbg.png)"}
          bgSize={"cover"}
          bgPos={"center"}
          bgRepeat={"no-repeat"}
          width={["100%", "100%"]}
          className="max-sm:hidden max-md:hidden"
        >
          <Image
            loading="lazy"
            src="/Logos/logo.png"
            alt="Logo"
            p={10}
            w={["30%", "40%", "30%"]}
          />
        </Box>

        <Box
          p={[4, 12]}
          position={"relative"}
          display="flex"
          flexDirection="column"
          justifyContent={"center"}
          alignItems="center"
          gap={4}
          minHeight={"100vh"}
          width={["100%", "100%"]}
        >
          <Image
            loading="lazy"
            src="/Logos/foterlogo.png"
            position={"absolute"}
            top={8}
            left={4}
            width={"100px"}
            display={["block", "block", "none"]}
          />
          <Box
            width={"100%"}
            display={"flex"}
            justifyContent={"flex-start"}
            flexDirection={"column"}
            gapX={2}
          >
            <Text
              color={"#7a9f8a"}
              fontSize={"5xl"}
              fontFamily={"AmsiProCond-Black"}
              m={0}
              p={0}
            >
              Te damos la bienvenida
            </Text>
            <Text
              m={0}
              p={0}
              fontFamily={"AmsiProCond"}
              color={"#646464"}
              fontSize={"xl"}
            >
              Número de teléfono
            </Text>
          </Box>

          {!otpSent ? (
            <Box width="100%">
              <PhoneInput
                country={"us"}
                value={phoneNumber}
                onChange={(phone) => setPhoneNumber(phone)}
                onlyCountries={["us", "ve", "pk"]}
                countryCodeEditable={false}
                inputStyle={{
                  width: "100%",
                  height: "48px",
                  fontSize: "1rem",
                  border: "1px solid #E2E8F0",
                  borderRadius: "8px",
                }}
                buttonStyle={{
                  borderTopLeftRadius: "8px",
                  borderBottomLeftRadius: "8px",
                  border: "1px solid #E2E8F0",
                  backgroundColor: "#f9f9f9",
                }}
                containerStyle={{ width: "100%" }}
              />
            </Box>
          ) : (
            <Box width="100%">
              <Text mb={2} fontSize="sm">
                Enter the 6-digit code sent to +{phoneNumber}
              </Text>
              <Input
                placeholder="123456"
                fontSize="lg"
                textAlign="center"
                letterSpacing="0.5rem"
                value={otp}
                onChange={(e) => setOtp(e.target.value)}
                maxLength={6}
                height="48px"
              />
            </Box>
          )}

          <Box
            display="flex"
            flexDirection="column"
            justifyContent={"center"}
            alignItems="center"
            gap={6}
            width="100%"
          >
            <Button
              as="button"
              onClick={otpSent ? handleVerifyOtp : handleSendOtp}
              disabled={isLoading || isOtpLoading}
              bgColor="#7a9f8a"
              color="white"
              width="100%"
              display={"flex"}
              alignItems={"center"}
              gapX={2}
              px={4}
              py={3}
              rounded={"md"}
              justifyContent={"center"}
              cursor={"pointer"}
              _hover={{ bg: "#6b8e7a" }}
            >
              <Icon as={RiWhatsappFill} boxSize={5} />
              <Text fontFamily={"AmsiProCond-Light"} fontSize={"xl"} pb={1}>
                {otpSent ? "Verificar código" : "Enviar código por WhatsApp"}
              </Text>
            </Button>

            {!otpSent ? (
              <>
                <Box display="flex" alignItems="center" gap={2} width="100%">
                  <Box
                    as="span"
                    display="inline-block"
                    width="50%"
                    height="1px"
                    bg="gray.100"
                  />
                  <Text fontFamily={"AmsiProCond"} color={"#000"}>
                    o
                  </Text>
                  <Box
                    as="span"
                    display="inline-block"
                    width="50%"
                    height="1px"
                    bg="gray.100"
                  />
                </Box>

                <IconButton
                  bg="#FD4441"
                  color="white"
                  aria-label="Google"
                  size="lg"
                  width="100%"
                  py={6}
                  onClick={signInWithGoogle}
                  disabled={isLoading}
                >
                  <FaGoogle />
                  <Text
                    as={"span"}
                    fontFamily={"AmsiProCond-Light"}
                    fontSize={"xl"}
                    p={0}
                    m={0}
                    pb={1}
                    ml={3}
                  >
                    Continuar con Google
                  </Text>
                </IconButton>
              </>
            ) : null}
          </Box>
        </Box>
      </Flex>
    </Offline>
  );
};

export default Signin;

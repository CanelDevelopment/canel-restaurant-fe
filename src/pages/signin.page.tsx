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
import { useNavigate } from "react-router-dom";
import { Offline } from "@/provider/offline";
import { authClient } from "@/provider/user.provider";
import toast from "react-hot-toast";

const Signin = () => {
  const [phoneNumber, setPhoneNumber] = useState("");
  const [otp, setOtp] = useState("");
  const [otpSent, setOtpSent] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isOtpLoading, setIsOtpLoading] = useState(false);

  const navigate = useNavigate();

  const { data: sessionData, isPending: isSessionPending } =
    authClient.useSession();

  useEffect(() => {
    if (!isSessionPending && sessionData?.session) {
      navigate("/home");
    }
  }, [sessionData, isSessionPending, navigate]);

  const signInWithGoogle = async () => {
    setIsLoading(true);
    await authClient.signIn.social({
      provider: "google",
      callbackURL: import.meta.env.VITE_FRONTEND_URL,
    });
    setIsLoading(false);
  };

  const handleSendOtp = async () => {
    if (phoneNumber.length < 10) {
      toast.error("Please enter a valid phone number.", { icon: "⚠️" });
      return;
    }
    setIsLoading(true);
    await authClient.phoneNumber.sendOtp(
      { phoneNumber: `+${phoneNumber}` },
      {
        onSuccess: () => {
          setOtpSent(true);
          toast.success("OTP sent successfully!");
          setIsLoading(false);
        },
        onError: (ctx) => {
          toast.error(ctx.error.message);
          console.log(ctx.error);
          setIsLoading(false);
        },
        // onSettled: () => setIsOtpLoading(false),
      }
    );
  };

  const handleVerifyOtp = async () => {
    if (otp.length < 6) {
      toast.error("Please enter the 6-digit OTP.");
      return;
    }

    setIsOtpLoading(true);

    // setIsLoading(true);
    await authClient.phoneNumber.verify(
      { phoneNumber: `+${phoneNumber}`, code: otp },
      {
        disableSession: false,
        updatePhoneNumber: true,

        onSuccess: () => {
          toast.success("Successfull");
          setIsOtpLoading(false);
          // navigate("/home");
        },
        onError: (ctx) => {
          toast.error(ctx.error.message);
          setIsOtpLoading(false);
        },
        // onSettled: () => setIsOtpLoading(false),
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
        {/* Left side (unchanged) */}
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
          {/* Logo and header text (unchanged) */}
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

          {/* --- FIX 1 & 3: Consolidated Input and Conditional OTP Field --- */}
          {!otpSent ? (
            // SHOW PHONE INPUT
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
            // SHOW OTP INPUT
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
              as="button" // Make it a button
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
                  </Text>{" "}
                  {/* Corrected "0" to "o" */}
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

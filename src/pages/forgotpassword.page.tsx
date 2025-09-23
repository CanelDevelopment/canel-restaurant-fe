import React, { useState } from "react";
import { useForm, type SubmitHandler } from "react-hook-form";
import { authClient } from "@/provider/user.provider";
import toast from "react-hot-toast";
import {
  Box,
  Button,
  Input,
  Text,
  Center,
  Stack,
  Image,
} from "@chakra-ui/react";
import { Link } from "react-router-dom"; // Import Link for the logo

interface FormValues {
  email: string;
}

const ForgotPasswordPage: React.FC = () => {
  const [isSubmitted, setIsSubmitted] = useState(false);
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<FormValues>();

  // Corrected onSubmit handler for better-auth
  const onSubmit: SubmitHandler<FormValues> = async ({ email }) => {
    console.log(email);
    try {
      await authClient.requestPasswordReset({
        email,
        redirectTo: `${window.location.origin}/reset-password`,
      });
      setIsSubmitted(true);
    } catch (error: any) {
      toast.error("An error occurred. Please try again.");
      console.error(error);
    }
  };

  // The success message component
  const SuccessMessage = () => (
    <Box
      bg="white"
      p={[6, 8]}
      rounded="lg"
      boxShadow="xl"
      w={["90%", "400px"]}
      textAlign="center"
    >
      <Stack>
        <Text fontSize="2xl" fontFamily="AmsiProCond-Black" color="#3B5545">
          Request Sent!
        </Text>
        <Text fontFamily="AmsiProCond" color="gray.600">
          If an account with that email exists, we have sent a password reset
          link.
        </Text>
        <Link to="/admin-signin">
          <Button
            bg="Cgreen"
            color="black"
            fontFamily="AmsiProCond"
            width="100%"
            _hover={{ bg: "#4C9F7B" }}
          >
            Back to Sign In
          </Button>
        </Link>
      </Stack>
    </Box>
  );

  return (
    <Center h={"100vh"} bgColor={"Dgreen"} p={4}>
      {isSubmitted ? (
        <SuccessMessage />
      ) : (
        <Box
          as="form"
          onSubmit={handleSubmit(onSubmit)}
          bg="white"
          p={[6, 8]}
          rounded="lg"
          boxShadow="xl"
          w={["90%", "400px"]}
        >
          <Stack>
            <Center flexDirection="column">
              <Image
                src="/Logos/foterlogo.png"
                alt="Canel Logo"
                w="100px"
                mb={4}
              />
              <Text
                fontSize={["2xl", "3xl"]}
                fontFamily="AmsiProCond-Black"
                color="#3B5545"
              >
                Forgot Password
              </Text>
              <Text
                fontFamily="AmsiProCond"
                color="gray.500"
                textAlign="center"
              >
                No worries! Just enter your email to receive a reset link.
              </Text>
            </Center>

            <Box>
              <Input
                id="email"
                placeholder="your-email@example.com"
                type="email"
                bg={"#F4F4F4"}
                border={"none"}
                rounded={"md"}
                height={"45px"}
                {...register("email", { required: "Email is required" })}
              />
              <Text>{errors.email && errors.email.message}</Text>
            </Box>

            <Button
              type="submit"
              disabled={isSubmitting}
              bg="Cgreen"
              color={"black"}
              fontWeight={"normal"}
              fontFamily={"AmsiProCond"}
              width="100%"
              size="lg"
              _hover={{
                bg: "#4C9F7B",
              }}
            >
              Send Reset Link
            </Button>
          </Stack>
        </Box>
      )}
    </Center>
  );
};

export default ForgotPasswordPage;

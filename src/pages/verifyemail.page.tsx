// src/pages/VerifyEmailPage.tsx

import React, { useEffect, useState } from "react";
import { useSearchParams, Link } from "react-router-dom";
import { Center, Heading, Text, Spinner, VStack } from "@chakra-ui/react";
import { authClient } from "@/provider/user.provider";

const VerifyEmailPage: React.FC = () => {
  const [searchParams] = useSearchParams();
  const [status, setStatus] = useState<"verifying" | "success" | "error">(
    "verifying"
  );
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    const email = searchParams.get("email");
    const otp = searchParams.get("otp");

    if (!otp || !email) {
      setStatus("error");
      setErrorMessage("No verification token found. The link may be invalid.");
      return;
    }

    const verifyToken = async () => {
      try {
        // This is the built-in better-auth function to verify the token
        await authClient.emailOtp.verifyEmail({ email, otp });
        setStatus("success");
      } catch (error: any) {
        setStatus("error");
        setErrorMessage(
          error.message || "Verification failed. The link may have expired."
        );
      }
    };

    verifyToken();
  }, [searchParams]);

  return (
    <Center h="100vh" bg="gray.50">
      <VStack p={8} bg="white" boxShadow="lg" borderRadius="md" w="md">
        {status === "verifying" && (
          <>
            <Heading size="lg">Verifying your email...</Heading>
            <Spinner size="xl" color="teal.500" />
            <Text>Please wait a moment.</Text>
          </>
        )}

        {status === "success" && (
          <>
            <Heading size="lg" color="green.500">
              Email Verified!
            </Heading>
            <Text>Your account is now active.</Text>

            <Link to={"/admin-signin"}>Proceed to Login</Link>
          </>
        )}

        {status === "error" && (
          <>
            <Heading size="lg" color="red.500">
              Verification Failed
            </Heading>
            <Text>{errorMessage}</Text>
          </>
        )}
      </VStack>
    </Center>
  );
};

export default VerifyEmailPage;

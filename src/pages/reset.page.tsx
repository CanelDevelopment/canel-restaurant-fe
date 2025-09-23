import React, { useEffect, useState } from "react";
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
  //   FormControl,
  //   FormErrorMessage,
  //   InputGroup, // <-- Import InputGroup
  //   InputRightElement, // <-- Import InputRightElement
} from "@chakra-ui/react";
import { useNavigate, useSearchParams, Link } from "react-router-dom";
// import { BsEyeSlashFill } from "react-icons/bs"; // <-- Import icons
// import { IoEyeSharp } from "react-icons/io5";

interface FormValues {
  newPassword: string;
}

const ResetPasswordPage: React.FC = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const token = searchParams.get("token");

  // State for password visibility
  const [showPassword, _setShowPassword] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<FormValues>();

  useEffect(() => {
    if (!token) {
      toast.error("Invalid or missing reset token.");
      navigate("/admin/signin");
    }
  }, [token, navigate]);

  const onSubmit: SubmitHandler<FormValues> = async ({ newPassword }) => {
    if (!token) return;

    try {
      // Corrected API call
      await authClient.resetPassword({ token, newPassword });
      toast.success("Password has been reset successfully!");
      navigate("/admin/signin");
    } catch (error: any) {
      toast.error(
        error.message || "Failed to reset password. The link may have expired."
      );
      console.error(error);
    }
  };

  // A small component to show while verifying the token
  if (!token) {
    return (
      <Center h="100vh" bgColor={"#7a9f8a"}>
        <Text color="white">Invalid or expired link.</Text>
      </Center>
    );
  }

  return (
    <Center h={"100vh"} bgColor={"#7a9f8a"} p={4}>
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
            <Link to="/">
              <Image
                src="/Logos/foterlogo.png"
                alt="Canel Logo"
                w="100px"
                mb={4}
              />
            </Link>
            <Text
              fontSize={["2xl", "3xl"]}
              fontFamily="AmsiProCond-Black"
              color="#3B5545"
            >
              Reset Your Password
            </Text>
            <Text fontFamily="AmsiProCond" color="gray.500" textAlign="center">
              Enter your new, secure password below.
            </Text>
          </Center>

          <Box>
            {/* Use InputGroup to contain the input and the icon */}
            {/* <InputGroup start={"BsEyeSlashFill"}> */}
            <Input
              id="newPassword"
              placeholder="New Password"
              type={showPassword ? "text" : "password"}
              bg={"#F4F4F4"}
              border={"none"}
              rounded={"md"}
              height={"45px"}
              {...register("newPassword", {
                required: "A new password is required",
                minLength: {
                  value: 8,
                  message: "Password must be at least 8 characters long",
                },
              })}
            />
            {/* This element holds the visibility toggle icon */}
            {/* <InputRightElement height="100%">
                <Box
                  cursor="pointer"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? <IoEyeSharp /> : <BsEyeSlashFill />}
                </Box>
              </InputRightElement>
            </InputGroup> */}
            <Text>{errors.newPassword && errors.newPassword.message}</Text>
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
            Reset Password
          </Button>
        </Stack>
      </Box>
    </Center>
  );
};

export default ResetPasswordPage;

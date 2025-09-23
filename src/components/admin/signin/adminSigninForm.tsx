import {
  Box,
  Flex,
  IconButton,
  Text,
  Center,
  Input,
  Stack,
  Checkbox,
} from "@chakra-ui/react";
import {
  FormControl,
  FormLabel,
  FormErrorMessage,
} from "@chakra-ui/form-control";
import { useForm } from "react-hook-form";
import { useState } from "react";
import { authClient } from "@/provider/user.provider";
import { Link, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { PasswordInput } from "@/components/ui/password-input";
// import { BsEyeSlashFill } from "react-icons/bs";
// import { IoEyeSharp } from "react-icons/io5";

type AdminSigninFormValues = {
  email: string;
  password: string;
};

export const AdminSigninForm = () => {
  const {
    handleSubmit,
    register,
    formState: { errors, isSubmitting },
  } = useForm<AdminSigninFormValues>();

  const [rememberMeChecked, setRememberMeChecked] = useState(true);

  // const [showPassword, setShowPassword] = useState(false);
  // const handleShowClick = () => setShowPassword(!showPassword);

  const navigate = useNavigate();

  async function onLogin(values: AdminSigninFormValues) {
    try {
      await authClient.signIn.email({
        email: values.email,
        password: values.password,
        rememberMe: rememberMeChecked,
      }, {
        onSuccess: (ctx) => {
          const token = ctx.response.headers.get("set-auth-token");
          if (token) {
            localStorage.setItem("bearer_token", token);
          }
        }
      });

      const session = await authClient.getSession();
      console.log("This is session", session)
      if (session?.data?.user?.role === "user") {
        toast.error("You do not have admin access.");
        return;
      }
      navigate("/dashboard");
    } catch (error) {
      console.error("Login Error:", error);
      toast.error("Invalid email or password. Please try again.");
    }
  }

  return (
    <Box
      p={12}
      boxShadow="md"
      position={"relative"}
      display="flex"
      flexDirection="column"
      justifyContent={"center"}
      alignItems="center"
      gap={4}
      minHeight={["auto", "100vh"]}
      width={["100%", "100%"]}
    >
      <Box width={["auto", "100%", "70%"]}>
        <Flex
          justifyContent={"center"}
          alignItems={"start"}
          flexDirection={"column"}
        >
          <Text
            display={"flex"}
            justifyContent={"center"}
            alignItems={"center"}
            fontFamily={"AmsiProCond-Black"}
            color={"Cbutton"}
            bg={"white"}
            fontSize="4xl"
            mb={2}
          >
            Sig
            <Center
              fontFamily={"AmsiProCond-Black"}
              paddingRight={1}
              gap={2}
              bg={"Cbutton"}
              height={"60px"}
              color={"white"}
            >
              <Text>n</Text>
              <Text>In</Text>
            </Center>
          </Text>
          <Text fontFamily={"AmsiProCond"} fontSize="md" color="black" mb={6}>
            Sign into your account
          </Text>
        </Flex>

        <form onSubmit={handleSubmit(onLogin)}>
          <Stack gap={3} marginTop={5}>
            <FormControl isInvalid={!!errors.email}>
              <FormLabel
                fontSize={"sm"}
                htmlFor="name"
                fontFamily={"AmsiProCond"}
              >
                Email
              </FormLabel>
              <Input
                border={"none"}
                rounded={"md"}
                height={"45x"}
                bg={"#F4F4F4"}
                id="email"
                _placeholder={{
                  color: "black/60",
                  fontSize: "14px",
                }}
                placeholder="Email"
                {...register("email", {
                  required: "Email is required",
                  minLength: {
                    value: 4,
                    message: "Minimum length should be 4",
                  },
                })}
              />

              <FormErrorMessage color={"red"} fontSize="12px" marginTop={2}>
                {errors.email && errors.email.message}
              </FormErrorMessage>
            </FormControl>

            <FormControl isInvalid={!!errors.email} position={"relative"}>
              <FormLabel
                htmlFor="name"
                fontSize={"sm"}
                fontFamily={"AmsiProCond"}
              >
                Password
              </FormLabel>

              <PasswordInput
                border={"none"}
                rounded={"md"}
                height={"45x"}
                bg={"#F4F4F4"}
                _placeholder={{
                  color: "black/60",
                  fontSize: "14px",
                }}
                placeholder="Enter your Password"
                {...register("password", {
                  required: "Password is required",
                  minLength: {
                    value: 4,
                    message: "Minimum length should be 4",
                  },
                })}
              />


              <FormErrorMessage color={"red"} fontSize="12px" marginTop={2}>
                {errors.password && errors.password.message}
              </FormErrorMessage>
            </FormControl>
          </Stack>

          <Center marginTop={2} justifyContent={"space-between"}>
            <Text
              display={"flex"}
              justifyContent={"center"}
              fontSize={"sm"}
              color={"black/60"}
              fontFamily={"AmsiProCond"}
            >
              <Checkbox.Root
                size={"sm"}
                rounded={"lg"}
                checked={rememberMeChecked}
                onChange={(e) => {
                  const target = e.target as HTMLInputElement;
                  setRememberMeChecked(target.checked);
                }}
              >
                <Checkbox.HiddenInput />
                <Checkbox.Control>
                  <Checkbox.Indicator />
                </Checkbox.Control>
                <Checkbox.Label />
              </Checkbox.Root>
              Remember
            </Text>
            <Link to={"/forgot-password"}>
              <Text
                fontSize={"xs"}
                fontWeight={"Black"}
                color={"#4C9F7B"}
                fontFamily={"AmsiProCond"}
                _hover={{ cursor: "pointer", textDecoration: "underline" }}
              >
                Forget Password
              </Text>
            </Link>
          </Center>

          <Box
            display="flex"
            flexDirection="column"
            justifyContent={"center"}
            alignItems="center"
            gap={6}
            rounded={"lg"}
            marginTop={10}
            width="100%"
          >
            <IconButton
              bg="Cbutton"
              mt={4}
              aria-label="Login"
              size="lg"
              width="100%"
              colorScheme="teal"
              loading={isSubmitting}
              type="submit"
            >
              <Text
                color={"#fff"}
                fontWeight={"normal"}
                fontFamily={"AmsiProCond"}
                mb={1}
              >
                Login
              </Text>
            </IconButton>
          </Box>
        </form>
      </Box>

      <Center
        justifyContent={"space-between"}
        width={"100%"}
        position={"absolute"}
        bottom={0}
        right={0}
        px={3}
      >
        <Text
          fontSize={"xs"}
          className="text-xs text-gray-400 hover:text-black cursor-pointer"
        >
          Privacy Policy
        </Text>

    
      </Center>
    </Box>
  );
};

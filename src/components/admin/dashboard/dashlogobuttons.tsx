import {
  Box,
  Button,
  Center,
  Flex,
  Image,
  Icon,
  Text,
  Skeleton,
} from "@chakra-ui/react";
import {
  Menu,
  MenuContent,
  MenuPositioner,
  MenuRoot,
  MenuTrigger,
} from "@chakra-ui/react";
import { PauseOrderModal } from "./pauseordermodal";
import { FaSortDown, FaUser } from "react-icons/fa";
import { Link, useNavigate } from "react-router-dom";
import { authClient } from "@/provider/user.provider";
import toast from "react-hot-toast";
// import { useFetchCurrentUser } from "@/hooks/user/usefetchuser";

export const DashLogoButtons = () => {
  const navigate = useNavigate();

  async function handleSignOut() {
    try {
      await authClient.signOut();
      navigate("/admin-signin");
    } catch (error) {
      console.error("Sign-out error:", error);
      toast.error(
        "Algo salió mal al cerrar sesión. Por favor, inténtalo de nuevo."
      );
    }
  }

  // const { data: user, isLoading } = useFetchCurrentUser();
  const { data: user, isPending: isLoading } = authClient.useSession();

  return (
    <Center
      gap={4}
      alignItems={["start", "start", "center", "center"]}
      justifyContent={"space-between"}
      px={[3, 4, 10]}
      py={4}
      flexDirection={["column", "row", "row"]}
    >
      <Link to="/dashboard">
        <Image
          src="/admin/Ad3.png"
          loading="lazy"
          alt="Logo"
          className="size-25"
        />
      </Link>

      <Flex gap={[2, 2, 7]} flexDirection={["column", "column", "row"]}>
        <Flex gap={2}>
          <PauseOrderModal />
        </Flex>

        <Box borderLeft={"1px solid #EBEBEB"} marginLeft={-3} />

        <MenuRoot>
          <MenuTrigger asChild>
            <Button
              bg={"white"}
              color={"Cbutton"}
              variant="outline"
              display={"flex"}
              justifyContent={"center"}
              alignItems={"center"}
              textAlign={"center"}
              fontFamily={"AmsiProCond"}
              letterSpacing={0.5}
            >
              <Icon as={FaUser} w={3} h={3} />
              {isLoading ? (
                // Mostrar un esqueleto de carga mientras se obtiene la información del usuario
                <Skeleton height="20px" width="70px" />
              ) : (
                <Text pb={1}>{user ? user.user.name : "Invitado"}</Text>
              )}
              <Icon pb={1} as={FaSortDown} w={4} h={4} />
            </Button>
          </MenuTrigger>
          <MenuPositioner>
            <MenuContent>
              <Menu.Item value="signout" onClick={handleSignOut}>
                Cerrar Sesión
              </Menu.Item>
            </MenuContent>
          </MenuPositioner>
        </MenuRoot>
      </Flex>
    </Center>
  );
};

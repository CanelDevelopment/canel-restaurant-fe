import { useState } from "react";
import {
  Drawer,
  DrawerBackdrop,
  DrawerTrigger,
  DrawerPositioner,
  DrawerContent,
  DrawerCloseTrigger,
  DrawerBody,
  Box,
  Text,
  Accordion,
  VStack,
  Image,
  Flex,
  Center,
} from "@chakra-ui/react";
// import type { ReactNode } from "react";
import DashIcon1 from "/admin/dashMeterIcon.svg";
import DashIcon2 from "/admin/dashincomingorder.svg";
import DashIcon3 from "/admin/dashpos.svg";
import DashIcon4 from "/admin/dashfoodcategory.svg";
import DashIcon5 from "/admin/dashcustomer.svg";
import DashIcon6 from "/admin/dashbranch.svg";
import DashIcon7 from "/admin/dashstaff.svg";
import DashIcon8 from "/admin/dashrole.svg";
import DashIcon9 from "/admin/dashbusinesssettings.svg";
import { FaChevronDown } from "react-icons/fa";
import { IoMenu } from "react-icons/io5";
import { useNavigate, useLocation } from "react-router-dom";

const menuItems = [
  {
    label: "Tablero",
    icon: <Image src={DashIcon1} boxSize="24px" objectFit="contain" />,
    highlightIcon: (
      <Image
        src={"/Icon/dashbord-highlight.svg"}
        boxSize="24px"
        objectFit="contain"
      />
    ),
    link: "/dashboard",
    exact: true,
  },
  {
    label: "Pedidos Entrantes",
    icon: <Image src={DashIcon2} boxSize="24px" objectFit="contain" />,
    highlightIcon: (
      <Image
        src={"/Icon/incoming-highlight.svg"}
        boxSize="24px"
        objectFit="contain"
      />
    ),
    link: "/dashboard/incoming_orders",
  },
  {
    label: "Punto de Venta (POS)",
    icon: <Image src={DashIcon3} boxSize="24px" objectFit="contain" />,
    highlightIcon: (
      <Image
        src={"/Icon/pos-highlight.svg"}
        boxSize="24px"
        objectFit="contain"
      />
    ),
    link: "/dashboard/point_of_sale",
  },
  {
    label: "Lista de Clientes",
    icon: <Image src={DashIcon4} boxSize="24px" objectFit="contain" />,
    highlightIcon: (
      <Image
        src={"/Icon/customerList-highlight.svg"}
        boxSize="24px"
        objectFit="contain"
      />
    ),
    link: "/dashboard/customer_list",
  },
  {
    label: "Catálogo de Comida",
    link: "/dashboard/food_catalogue",
    icon: (
      <Box display="flex" alignItems="center" justifyContent="center">
        <Image src={DashIcon5} boxSize="24px" objectFit="contain" />
      </Box>
    ),
    highlightIcon: (
      <Box display="flex" alignItems="center" justifyContent="center">
        <Image
          src={"/Icon/foodCatalogue-highllight.svg"}
          boxSize="24px"
          objectFit="contain"
        />
      </Box>
    ),
    subItems: [
      { label: "Categoría de Comida", link: "/dashboard/food_category" },
      { label: "Artículo de Comida", link: "/dashboard/food_item" },
      { label: "Categoría de Complementos", link: "/dashboard/addon_category" },
      { label: "Artículo de Complemento", link: "/dashboard/addon_item" },
    ],
  },
  {
    label: "Gestión de Sucursales",
    icon: <Image src={DashIcon6} boxSize="24px" objectFit="contain" />,
    highlightIcon: (
      <Image
        src={"/Icon/branch-higlight.svg"}
        boxSize="24px"
        objectFit="contain"
      />
    ),
    link: "/dashboard/branch_management",
  },
  {
    label: "Gestión de Personal",
    icon: <Image src={DashIcon7} boxSize="24px" objectFit="contain" />,
    highlightIcon: (
      <Image
        src={"/Icon/staff-highlight.svg"}
        boxSize="24px"
        objectFit="contain"
      />
    ),
    link: "/dashboard/staff_management",
  },
  {
    label: "Roles",
    icon: <Image src={DashIcon8} boxSize="24px" objectFit="contain" />,
    highlightIcon: (
      <Image
        src={"/Icon/role-highlight.svg"}
        boxSize="24px"
        objectFit="contain"
      />
    ),
    link: "/dashboard/role_management",
  },
  {
    label: "Configuración del Negocio",
    icon: <Image src={DashIcon9} boxSize="24px" objectFit="contain" />,
    highlightIcon: (
      <Image
        src={"/Icon/settings-highlight.svg"}
        boxSize="24px"
        objectFit="contain"
      />
    ),
    link: "/dashboard/business_settings",
  },
];

export const Sidebar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isSidebarOpen] = useState(false);
  const [hovered, setHovered] = useState<string | null>(null);

  const navigate = useNavigate();
  const location = useLocation();

  const isSubItemActive = (subItems: { link: string }[] = []) =>
    subItems.some((sub) => location.pathname.startsWith(sub.link));

  const isItemActive = (link: string, exact: boolean = false) =>
    exact ? location.pathname === link : location.pathname.startsWith(link);

  return (
    <Flex
      position="relative"
      top="0"
      left="0"
      minH="100vh"
      h="100%"
      zIndex="10"
      // flex={1}
    >
      <Box
        w={["20", "24", "24", "20"]}
        bg={"DarkGreen"}
        className="text-white transition-all duration-300"
      >
        {/* Small Screen Drawer */}
        <Drawer.Root
          open={isOpen}
          placement="start"
          onOpenChange={(e) => setIsOpen(e.open)}
        >
          <DrawerTrigger asChild mt={4}>
            <Center p={2} cursor="pointer" bg="DarkGreen">
              <IoMenu size={26} className="hover:text-[Cgreen]" />
            </Center>
          </DrawerTrigger>
          <DrawerBackdrop />
          <DrawerPositioner>
            <DrawerContent bg="#3c5646" color="white">
              <DrawerCloseTrigger />
              <DrawerBody p={0}>
                <VStack align="start" gap={0}>
                  {menuItems.map((item, index) =>
                    item.subItems ? (
                      <Accordion.Root
                        p={3}
                        borderBottom={"1px solid #708D7B"}
                        variant={"plain"}
                        key={index}
                        w={"100%"}
                        _hover={{ bg: "#4a6d58" }}
                        collapsible
                      >
                        <Accordion.Item value={item.label}>
                          <Accordion.ItemTrigger>
                            <Text>{item.icon}</Text>
                            <Text
                              fontFamily={"AmsiProCond"}
                              textAlign={"center"}
                              ml={6}
                              fontSize={"sm"}
                            >
                              {item.label}
                            </Text>
                            <Accordion.ItemIndicator asChild ml={"auto"}>
                              <FaChevronDown color="white" />
                            </Accordion.ItemIndicator>
                          </Accordion.ItemTrigger>
                          <Accordion.ItemContent>
                            <Accordion.ItemBody>
                              {item.subItems.map((subItem, subIndex) => (
                                <Flex
                                  alignItems={"start"}
                                  justifyContent={"flex-start"}
                                  textAlign={"left"}
                                  key={subIndex}
                                  mt={2}
                                  onClick={() => navigate(subItem.link)}
                                  py={1}
                                  w={"full"}
                                >
                                  <Text
                                    color={"white"}
                                    _hover={{ color: "Cgreen" }}
                                    cursor={"pointer"}
                                    ml={16}
                                  >
                                    {subItem.label}
                                  </Text>
                                </Flex>
                              ))}
                            </Accordion.ItemBody>
                          </Accordion.ItemContent>
                        </Accordion.Item>
                      </Accordion.Root>
                    ) : (
                      <Flex
                        onClick={() => navigate(item.link)}
                        p={3}
                        borderBottom={"1px solid #708D7B"}
                        key={index}
                        className="w-full hover:bg-[Cgreen] rounded cursor-pointer"
                        _hover={{ bg: "#4a6d58" }}
                      >
                        <Text as="span" mr={2}>
                          {item.icon}
                        </Text>
                        <Text ml={6}>{item.label}</Text>
                      </Flex>
                    )
                  )}
                </VStack>
              </DrawerBody>
            </DrawerContent>
          </DrawerPositioner>
        </Drawer.Root>

        {/* Large Screen Sidebar */}
        <VStack align={["center", "center", "start"]}>
          {menuItems.map((item, index) =>
            item.subItems ? (
              <Box key={index} position="relative" width="100%">
                <Box
                  onMouseEnter={() => setHovered(item.label)}
                  onMouseLeave={() => setHovered(null)}
                >
                  <Flex
                    alignItems="center"
                    justifyContent="center"
                    borderBottom="1px solid #708D7B"
                    height="48px"
                    cursor="pointer"
                    _hover={{ bg: "#4a6d58" }}
                    bg={
                      isItemActive(item.link) || isSubItemActive(item.subItems)
                        ? "#4a6d58"
                        : "transparent"
                    }
                  >
                    <Box boxSize="24px">
                      {isItemActive(item.link) || isSubItemActive(item.subItems)
                        ? item.highlightIcon
                        : item.icon}
                    </Box>
                  </Flex>
                </Box>

                {!isSidebarOpen && hovered === item.label && (
                  <Box
                    position="absolute"
                    top="0"
                    left="100%"
                    bg="#3c5646"
                    px={2}
                    py={2}
                    w={"200px"}
                    borderRadius="md"
                    zIndex="100"
                    onMouseEnter={() => setHovered(item.label)}
                    onMouseLeave={() => setHovered(null)}
                  >
                    <VStack align="start">
                      {item.subItems.map((subItem, subIndex) => (
                        <Text
                          key={subIndex}
                          fontSize="md"
                          letterSpacing={0.8}
                          cursor="pointer"
                          _hover={{ color: "#A0DAB7" }}
                          onClick={() => navigate(subItem.link)}
                          color={
                            location.pathname === subItem.link
                              ? "Cgreen"
                              : "white"
                          }
                        >
                          <Text as={"span"} fontSize={"lg"}>
                            ⬤
                          </Text>{" "}
                          {subItem.label}
                        </Text>
                      ))}
                    </VStack>
                  </Box>
                )}
              </Box>
            ) : (
              <Flex
                key={index}
                alignItems="center"
                justifyContent="center"
                borderBottom="1px solid #708D7B"
                height="48px"
                width="100%"
                cursor="pointer"
                onClick={() => navigate(item.link)}
                _hover={{ bg: "#4a6d58" }}
                bg={
                  isItemActive(item.link, item.exact)
                    ? "#4a6d58"
                    : "transparent"
                }
              >
                <Box boxSize="24px">
                  {isItemActive(item.link, item.exact)
                    ? item.highlightIcon
                    : item.icon}
                </Box>
              </Flex>
            )
          )}
        </VStack>
      </Box>

      {/* Main Content */}
      {/* <Box bgColor={"#f3f3f3"} flex={1} overflowX={"hidden"}>
        {children}
      </Box> */}
    </Flex>
  );
};

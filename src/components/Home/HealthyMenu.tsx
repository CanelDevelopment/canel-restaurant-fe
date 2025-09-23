// import React from "react";
// import {
//   Elevatedcard,
//   type ElevatedCardProps,
// } from "@/components/Home/Elevatedcard";
// import { Box, Container, SimpleGrid, Image } from "@chakra-ui/react";
// import { IoCartOutline } from "react-icons/io5";

// const healthyItems: ElevatedCardProps[] = [
//   {
//     id: "14",
//     title: "TRIO OF AREAS",
//     price: "REF 10.99",
//     buttontext: "Agregar al carrito",
//     imageSource: "/Home/Homecard2-11.png",
//     icon: <IoCartOutline size={30} />,
//     // discount: 0,
//     itemW: ["100px", "200px"],
//   },
//   {
//     id: "15",
//     title: "ACAI & FRUIT BOWL",
//     price: "REF 10.99",
//     buttontext: "Agregar al carrito",
//     imageSource: "/Home/Homecard2-10.png",
//     icon: <IoCartOutline size={30} />,
//     // discount: 0,
//     itemW: ["70px", "130px"],
//   },
//   {
//     id: "16",
//     title: "BANANA & STRAWBERRY..",
//     price: "REF 10.99",
//     buttontext: "Agregar al carrito",
//     imageSource: "/Home/Homecard2-9.png",
//     icon: <IoCartOutline size={30} />,
//     // discount: 0,
//     itemW: ["70px", "120px"],
//   },
//   {
//     id: "17",
//     title: "EGG WITH TOAST AND..",
//     price: "REF 10.99",
//     buttontext: "Agregar al carrito",
//     imageSource: "/Home/Homecard2-8.png",
//     icon: <IoCartOutline size={30} />,
//     // discount: 0,
//     itemW: ["70px", "170px"],
//   },
// ];

// export const HealthyMenu: React.FC = () => {
//   return (
//     <>
//       <Box
//         bgImage={`linear-gradient(to bottom, rgba(255, 255, 255, 0.7), rgba(255,255,255,0.7)), url('/Background/grunge.png')`}
//         bgPos={"center"}
//         bgSize={"cover"}
//         position={"relative"}
//       >
//         <Box
//           backgroundImage="url('/Background/Noise.png')"
//           backgroundRepeat="repeat"
//           width={"20%"}
//           height={"45%"}
//           position="absolute"
//           rotate={"25"}
//           top={16}
//           left={-32}
//           zIndex={0}
//         />

//         <Box position="absolute" top={20} right={8} zIndex={0}>
//           <Image src="/Background/designElement2.png" w={"40px"} />
//         </Box>

//         <Box position="absolute" top={4} left={64} zIndex={0}>
//           <Image src="/Background/designElement-heart3.png" w={"70px"} />
//         </Box>

//         <Box
//           backgroundImage="url('/Background/designElement-swirl.png')"
//           backgroundRepeat="no-repeat"
//           width={"20%"}
//           height={"10%"}
//           position="absolute"
//           bottom={-2}
//           left={60}
//           zIndex={0}
//         />

//         <Box
//           backgroundImage="url('/Background/designElement-cheese.png')"
//           backgroundRepeat="no-repeat"
//           width={"20%"}
//           height={"20%"}
//           rotate={"180"}
//           position="absolute"
//           bottom={-14}
//           right={60}
//           zIndex={0}
//         />

//         <Container maxW={"container"}>
//           <SimpleGrid
//             py={12}
//             columns={{ base: 2, sm: 2, md: 2, lg: 4 }}
//             gapX={[1, 6]}
//             gapY={[10, 20]}
//             pt={20}
//           >
//             {healthyItems.map((card) => (
//               <Elevatedcard key={card.id} {...card} />
//             ))}
//           </SimpleGrid>
//         </Container>
//       </Box>
//     </>
//   );
// };

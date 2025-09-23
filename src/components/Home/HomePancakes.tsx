// import React from "react";
// import {
//   Elevatedcard,
//   type ElevatedCardProps,
// } from "@/components/Home/Elevatedcard";
// import { Box, Image, SimpleGrid, Container } from "@chakra-ui/react";
// import { IoCartOutline } from "react-icons/io5";

// const pancakes: ElevatedCardProps[] = [
//   {
//     id: "9",
//     title: "CHOCO PANCAKES",
//     price: "REF 10.99",
//     buttontext: "Agregar al carrito",
//     imageSource: "/Home/cakeOne.png",
//     icon: <IoCartOutline size={30} />,
//     itemW: ["80px", "auto"],
//     // discount: 0,
//   },
//   {
//     id: "10",
//     title: "OREO PANCAKES",
//     price: "REF 10.99",
//     buttontext: "Agregar al carrito",
//     imageSource: "/Home/cakeTwo.png",
//     icon: <IoCartOutline size={30} />,
//     itemW: ["80px", "auto"],
//     // discount: 0,
//   },
//   {
//     id: "11",
//     title: "STRAWBERRY PANCAKES",
//     price: "REF 10.99",
//     buttontext: "Agregar al carrito",
//     imageSource: "/Home/cakeThree.png",
//     icon: <IoCartOutline size={30} />,
//     itemW: ["80px", "auto"],
//     // discount: 0,
//   },
//   {
//     id: "12",
//     title: "OREO PANCAKES",
//     price: "REF 10.99",
//     buttontext: "Agregar al carrito",
//     imageSource: "/Home/cakeFour.png",
//     icon: <IoCartOutline size={30} />,
//     itemW: ["80px", "auto"],
//     // discount: 0,
//   },
// ];

// export const HomePancakes: React.FC = () => {
//   return (
//     <>
//       <Box
//         bgImage={`linear-gradient(to bottom, rgba(255, 255, 255, 0.7), rgba(255,255,255,0.7)), url('/Background/grunge.png')`}
//         bgPos={"center"}
//         bgSize={"cover"}
//         position={"relative"}
//       >
//         <Box
//           backgroundImage="url('/Background/Noise_2.png')"
//           backgroundRepeat="repeat"
//           width={"20%"}
//           height={"20%"}
//           position="absolute"
//           bottom={0}
//           right={0}
//           zIndex={0}
//         />

//         <Box position="absolute" top={-10} right={0} zIndex={0}>
//           <Image src="/Background/designElement-leave.png" w={"120px"} />
//         </Box>

//         <Box position="absolute" top={0} left={0} zIndex={0} opacity={0.6}>
//           <Image src="/Background/Marble.png" />
//         </Box>

//         <Box position="absolute" top={40} left={16} zIndex={0} rotate={"45"}>
//           <Image src="/Background/designElement2.png" w={"40px"} />
//         </Box>

//         <Container maxW={"container"}>
//           <SimpleGrid
//             py={12}
//             columns={{ base: 2, sm: 2, md: 2, lg: 4 }}
//             gapX={[1, 6]}
//             gapY={[10, 20]}
//             pt={20}
//           >
//             {pancakes.map((card) => (
//               <Elevatedcard key={card.id} {...card} />
//             ))}
//           </SimpleGrid>
//         </Container>
//       </Box>
//     </>
//   );
// };

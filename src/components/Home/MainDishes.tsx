// import React from "react";
// import {
//   Box,
//   Center,
//   Container,
//   Image,
//   SimpleGrid,
//   Spinner,
//   Text,
// } from "@chakra-ui/react";
// import { IoCartOutline } from "react-icons/io5";
// import { Elevatedcard } from "@/components/Home/Elevatedcard";
// import { useFetchProducts } from "@/hooks/product/usefetchproducts";

// // const elevatedCard: ElevatedCardProps[] = [
// //   {
// //     id: 1,
// //     imageSource: "/Home/Homecard2-1.png",
// //     title: "CHICKEN MILNASE",
// //     price: "REF 10.99",
// //     icon: <IoCartOutline size={30} />,
// //     buttontext: "Agregar al carrito",
// //     itemW: ["100px", "200px"],
// //   },
// //   {
// //     id: 2,
// //     imageSource: "/Home/Homecard2-2.png",
// //     title: "CHICKEN MILNASE",
// //     price: "REF 10.99",
// //     icon: <IoCartOutline size={30} />,
// //     buttontext: "Agregar al carrito",
// //     itemW: ["100px", "200px"],
// //   },
// //   {
// //     id: 3,
// //     imageSource: "/Home/Homecard2-3.png",
// //     title: "GRILLED MEAT AREPA",
// //     price: "REF 10.99",
// //     icon: <IoCartOutline size={30} />,
// //     buttontext: "Agregar al carrito",
// //     itemW: ["100px", "200px"],
// //   },
// //   {
// //     id: 4,
// //     imageSource: "/Home/Homecard2-4.png",
// //     title: "GRILLED CHICKEN",
// //     price: "REF 10.99",
// //     icon: <IoCartOutline size={30} />,
// //     buttontext: "Agregar al carrito",
// //     itemW: ["100px", "200px"],
// //   },
// //   {
// //     id: 5,
// //     imageSource: "/Home/Homecard2-5.png",
// //     title: "CHICKEN MILNASE",
// //     price: "REF 10.99",
// //     icon: <IoCartOutline size={30} />,
// //     buttontext: "Agregar al carrito",
// //     itemW: ["70px", "auto"],
// //   },
// //   {
// //     id: 6,
// //     imageSource: "/Home/Homecard2-6.png",
// //     title: "CHICKEN MILNASE",
// //     price: "REF 10.99",
// //     icon: <IoCartOutline size={30} />,
// //     buttontext: "Agregar al carrito",
// //     itemW: ["70px", "auto"],
// //   },
// //   {
// //     id: 7,
// //     imageSource: "/Home/Homecard2-7.png",
// //     title: "GRILLED MEAT AREPA",
// //     price: "REF 10.99",
// //     icon: <IoCartOutline size={30} />,
// //     buttontext: "Agregar al carrito",
// //     itemW: ["100px", "200px"],
// //   },
// //   {
// //     id: 8,
// //     imageSource: "/Home/Homecard2-8.png",
// //     title: "GRILLED CHICKEN",
// //     price: "REF 10.99",
// //     icon: <IoCartOutline size={30} />,
// //     buttontext: "Agregar al carrito",
// //     itemW: ["100px", "200px"],
// //   },
// // ];

// export const MainDishes: React.FC = () => {
//   const { data, isLoading, isError } = useFetchProducts();

//   if (isLoading) {
//     return (
//       <Center h="400px">
//         <Spinner size="xl" />
//       </Center>
//     );
//   }

//   if (isError) {
//     return (
//       <Center h="400px">
//         <Text color="red.500">Failed to load dishes.</Text>
//       </Center>
//     );
//   }

//   const strongPlates =
//     data?.filter((product) => product.category?.name === "Strong Plates") || [];

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
//           height={"20%"}
//           position="absolute"
//           bottom={0}
//           right={0}
//           zIndex={0}
//         />

//         <Box position="absolute" top={-4} right={32} zIndex={0}>
//           <Image src="/Background/designElement.png" width={"80px"} />
//         </Box>

//         <Box
//           backgroundImage="url('/Background/Ellipse.png')"
//           backgroundRepeat="no-repeat"
//           width={"10%"}
//           height={"20%"}
//           position="absolute"
//           bottom={-30}
//           left={0}
//           zIndex={0}
//         />

//         <Box
//           backgroundImage="url('/Background/designElement-cheese.png')"
//           backgroundRepeat="no-repeat"
//           width={"10%"}
//           height={"10%"}
//           position="absolute"
//           bottom={-16}
//           left={"50%"}
//           zIndex={0}
//         />

//         <Box position="absolute" top={24} right={14} zIndex={0}>
//           <Image
//             src="/Background/designElement2.png"
//             w={"36px"}
//             rotate={"-32"}
//           />
//         </Box>

//         <Box position="absolute" bottom={52} left={20} zIndex={0}>
//           <Image
//             src="/Background/designElement-cheese.png"
//             w={"60px"}
//             rotate={"-45"}
//           />
//         </Box>

//         <Container maxW={"container"}>
//           <SimpleGrid
//             py={12}
//             columns={{ base: 2, sm: 2, md: 2, lg: 4 }}
//             gapX={[1, 6]}
//             gapY={[6, 20]}
//             pt={20}
//           >
//             {strongPlates.map((card) => (
//               <Elevatedcard
//                 key={card.id}
//                 title={card.name}
//                 discount={card.discount}
//                 imageSource={card.image}
//                 price={`REF ${card.price}`}
//                 description={`${card.description}`}
//                 icon={<IoCartOutline size={30} />}
//                 id={card.id}
//                 buttontext="Agregar al carrito"
//               />
//             ))}
//           </SimpleGrid>
//         </Container>
//       </Box>
//     </>
//   );
// };

// import { FrequentCard } from "@/components/cart/frequentCard";
// import { Box, Text, SimpleGrid } from "@chakra-ui/react";
// import type React from "react";
// import { IoCartOutline } from "react-icons/io5";

// export const PancakesSection: React.FC = () => {
//   const cardData = [
//     {
//       id: 1,
//       title: "PANCAKES DE CHOCOLATE",
//       price: "REF 10.99",
//       buttontext: "Agregar al carrito",
//       imageSource: "/Home/cakeOne.png",
//       icon: <IoCartOutline size={30} />,
//     },
//     {
//       id: 2,
//       title: "PANCAKES DE OREO",
//       price: "REF 10.99",
//       buttontext: "Agregar al carrito",
//       imageSource: "/Home/cakeTwo.png",
//       icon: <IoCartOutline size={30} />,
//     },
//     {
//       id: 3,
//       title: "PANCAKES DE FRESA",
//       price: "REF 10.99",
//       buttontext: "Agregar al carrito",
//       imageSource: "/Home/cakeThree.png",
//       icon: <IoCartOutline size={30} />,
//     },
//     {
//       id: 4,
//       title: "PANCAKES DE OREO",
//       price: "REF 10.99",
//       buttontext: "Agregar al carrito",
//       imageSource: "/Home/cakeFour.png",
//       icon: <IoCartOutline size={30} />,
//     },
//   ];

//   return (
//     <>
//       <Box bgColor={"#fff"} px={[3, 6]} pt={12}>
//         <Text color={"#000"} fontFamily={"AmsiProCond-Black"} fontSize={"xl"}>
//           Pany Pasteles
//         </Text>

//         <SimpleGrid
//           py={12}
//           columns={{ base: 2, sm: 3, md: 2, lg: 4 }}
//           gapY={20}
//           gapX={[5, 5, 5, 0]}
//           w={"90%"}
//         >
//           {cardData.map((item) => (
//             <FrequentCard
//               // key={item.id}
//               imageSource={item.imageSource}
//               title={item.title}
//               price={item.price}
//             />
//           ))}
//         </SimpleGrid>
//       </Box>
//     </>
//   );
// };

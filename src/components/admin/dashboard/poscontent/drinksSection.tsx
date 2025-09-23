// import { FrequentCard } from "@/components/cart/frequentCard";
// import { Box, Text, SimpleGrid } from "@chakra-ui/react";
// import type React from "react";
// import { IoCartOutline } from "react-icons/io5";

// export const DrinksSections: React.FC = () => {
//   const cardData = [
//     {
//       id: 1,
//       title: "TÉ DE FRUTOS ROJOS",
//       price: "REF 10.99",
//       buttontext: "Agregar al carrito",
//       imageSource: "/Home/drink4.png",
//       icon: <IoCartOutline size={30} />,
//     },
//     {
//       id: 2,
//       title: "LIMONADA DE HIERBABUENA",
//       price: "REF 10.99",
//       buttontext: "Agregar al carrito",
//       imageSource: "/Home/drink3.png",
//       icon: <IoCartOutline size={30} />,
//     },
//     {
//       id: 3,
//       title: "NARANJA",
//       price: "REF 10.99",
//       buttontext: "Agregar al carrito",
//       imageSource: "/Home/drink2.png",
//       icon: <IoCartOutline size={30} />,
//     },
//     {
//       id: 4,
//       title: "PAPAYA",
//       price: "REF 10.99",
//       buttontext: "Agregar al carrito",
//       imageSource: "/Home/drink6.png",
//       icon: <IoCartOutline size={30} />,
//     },
//     {
//       id: 5,
//       title: "MELÓN",
//       price: "REF 10.99",
//       buttontext: "Agregar al carrito",
//       imageSource: "/Home/drink2.png",
//       icon: <IoCartOutline size={30} />,
//     },
//     {
//       id: 6,
//       title: "PIÑA",
//       price: "REF 10.99",
//       buttontext: "Agregar al carrito",
//       imageSource: "/Home/drink7.png",
//       icon: <IoCartOutline size={30} />,
//     },
//     {
//       id: 7,
//       title: "TÉ NEGRO CON LIMÓN",
//       price: "REF 10.99",
//       buttontext: "Agregar al carrito",
//       imageSource: "/Home/drink5.png",
//       icon: <IoCartOutline size={30} />,
//     },
//     {
//       id: 8,
//       title: "MELÓN",
//       price: "REF 10.99",
//       buttontext: "Agregar al carrito",
//       imageSource: "/Home/drink2.png",
//       icon: <IoCartOutline size={30} />,
//     },
//   ];

//   return (
//     <>
//       <Box bgColor={"#fff"} px={[3, 6]} pt={12}>
//         <Text color={"#000"} fontFamily={"AmsiProCond-Black"} fontSize={"xl"}>
//           Bebidas
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
//               price={Number(item.price)}
//             />
//           ))}
//         </SimpleGrid>
//       </Box>
//     </>
//   );
// };

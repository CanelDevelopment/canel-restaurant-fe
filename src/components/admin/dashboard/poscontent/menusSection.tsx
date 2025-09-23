// import { FrequentCard } from "@/components/cart/frequentCard";
// import { Box, Text, SimpleGrid } from "@chakra-ui/react";
// import type React from "react";

// export const MenusSection: React.FC = () => {
//   const cardData = [
//     {
//       imageSource: "/Home/Homecard1.png",
//       title: "DESAYUNO CRIOLLO",
//       price: "REF 10.99",
//       description:
//         "Huevos revueltos, carne desmechada, frijoles refritos, queso blanco, arepas...",
//       imageSize: "50%",
//     },
//     {
//       imageSource: "/Home/Homecard2.png",
//       title: "DESAYUNO AMERICANO",
//       price: "REF 10.99",
//       description:
//         "Huevos revueltos, carne desmechada, frijoles refritos, queso blanco, arepas...",
//       imageSize: "70%",
//     },
//     {
//       imageSource: "/Home/Homecard3.png",
//       title: "CLUB DE POLLO",
//       price: "REF 10.99",
//       description:
//         "Pollo a la parrilla, jamón, tocino crujiente, queso Emmental, tomate, lechuga…",
//       imageSize: "70%",
//     },
//     {
//       imageSource: "/Home/Homecard4.png",
//       title: "DESAYUNO AMERICANO",
//       price: "REF 10.99",
//       description:
//         "Huevos fritos o revueltos, jamón, tocino crujiente y queso Emmental…",
//       imageSize: "70%",
//     },
//     {
//       imageSource: "/Home/Homecard1.png",
//       title: "DESAYUNO CRIOLLO",
//       price: "REF 10.99",
//       description:
//         "Huevos revueltos, carne desmechada, frijoles refritos, queso blanco, arepas...",
//       imageSize: "70%",
//     },
//     {
//       imageSource: "/Home/Homecard2.png",
//       title: "DESAYUNO AMERICANO",
//       price: "REF 10.99",
//       description:
//         "Huevos revueltos, carne desmechada, frijoles refritos, queso blanco, arepas...",
//       imageSize: "70%",
//     },
//     {
//       imageSource: "/Home/Homecard3.png",
//       title: "CLUB DE POLLO",
//       price: "REF 10.99",
//       description:
//         "Pollo a la parrilla, jamón, tocino crujiente, queso Emmental, tomate, lechuga…",
//       imageSize: "70%",
//     },
//     {
//       imageSource: "/Home/Homecard4.png",
//       title: "DESAYUNO AMERICANO",
//       price: "REF 10.99",
//       description:
//         "Huevos fritos o revueltos, jamón, tocino crujiente y queso Emmental…",
//       imageSize: "70%",
//     },
//   ];

//   return (
//     <>
//       <Box bgColor={"#fff"} px={[2, 6, 6]} pt={12}>
//         <Text color={"#000"} fontFamily={"AmsiProCond-Black"} fontSize={"xl"}>
//           Menús
//         </Text>

//         <SimpleGrid
//           py={12}
//           columns={{ base: 2, sm: 3, md: 2, lg: 4 }}
//           gapY={20}
//           gapX={[5, 5, 5, 0]}
//           w={"90%"}
//         >
//           {cardData.map((item, index) => (
//             <FrequentCard
//               key={index}
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

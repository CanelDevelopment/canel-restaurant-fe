// import { Box, Center, Checkbox, Image } from "@chakra-ui/react";
// import type { ColumnDef, Row } from "@tanstack/react-table";
// // import type { Data } from "./fooditemtable";
// import { format, isWithinInterval } from "date-fns";
// import { CustomeSwitch } from "./customeswitch";

// export const columns: ColumnDef<>[] = [
//   {
//     accessorKey: "ref",
//     header: () => (
//       <Box textAlign={"center"} fontWeight={"Black"}>
//         <Checkbox.Root bg={"#f6f6f6"}>
//           <Checkbox.HiddenInput />
//           <Checkbox.Control bg={"#f6f6f6"} rounded={"sm"} color={"black"} />
//         </Checkbox.Root>
//       </Box>
//     ),
//     cell: () => (
//       <Box className="text-center">
//         <Checkbox.Root>
//           <Checkbox.HiddenInput />
//           <Checkbox.Control />
//         </Checkbox.Root>
//       </Box>
//     ),
//     enableSorting: false,
//   },
//   {
//     accessorKey: "name",
//     header: () => (
//       <Box textAlign={"center"} fontWeight={"Black"} width={"60px"}>
//         Name
//       </Box>
//     ),
//     cell: ({ row }: { row: Row<Data> }) => (
//       <Box className="capitalize text-center truncate " width={"100px"}>
//         {row.getValue("name")}
//       </Box>
//     ),
//   },
//   {
//     accessorKey: "contact",
//     header: () => (
//       <Box textAlign={"start"} fontWeight={"Black"}>
//         Description
//       </Box>
//     ),
//     cell: ({ row }: { row: Row<Data> }) => (
//       <Box className="text-center truncate max-w-[250px]">
//         {row.getValue("contact")}
//       </Box>
//     ),
//   },
//   {
//     accessorKey: "item",
//     header: () => (
//       <Box textAlign={"start"} fontWeight={"Black"}>
//         Categories
//       </Box>
//     ),
//     cell: ({ row }: { row: Row<Data> }) => (
//       <Box className="text-center font-medium truncate max-w-[150px]">
//         {row.getValue("item")}
//       </Box>
//     ),
//   },
//   {
//     accessorKey: "transtype",
//     header: () => (
//       <Box textAlign={"center"} fontWeight={"Black"}>
//         Price
//       </Box>
//     ),
//     cell: ({ row }: { row: Row<Data> }) => (
//       <Center className="space-x-2">{row.getValue("transtype")}</Center>
//     ),
//   },
//   {
//     accessorKey: "photo",
//     header: () => (
//       <Box textAlign={"center"} fontWeight={"Black"}>
//         Photo
//       </Box>
//     ),
//     cell: ({ row }: { row: Row<Data> }) => (
//       <Center>
//         <Image
//           boxSize={"70px"}
//           objectFit="contain"
//           src={row.getValue("photo")}
//           alt={row.getValue("name")}
//         />
//       </Center>
//     ),
//   },
//   {
//     accessorKey: "tax",
//     header: () => (
//       <Box textAlign={"center"} fontWeight={"Black"}>
//         Item Not Available
//       </Box>
//     ),
//     cell: () => (
//       <Center>
//         <CustomeSwitch />
//       </Center>
//     ),
//   },
//   {
//     accessorKey: "status",
//     header: () => (
//       <Box textAlign={"center"} fontWeight={"Black"}>
//         Availability
//       </Box>
//     ),
//     cell: ({ row }: { row: Row<Data> }) => {
//       const status = row.getValue("status") as "Select Branch" | "All Branch";
//       const statusStyles: Record<typeof status, { text: string }> = {
//         "All Branch": {
//           text: "text-white bg-[#4394D7]",
//         },
//         "Select Branch": {
//           text: "text-white bg-[#4394D7]",
//         },
//       };
//       return (
//         <Center>
//           <Center
//             className={`rounded-md capitalize w-28 h-10 flex items-center gap-2 border ${statusStyles[status].text}`}
//           >
//             {status}
//           </Center>
//         </Center>
//       );
//     },
//   },

//   {
//     accessorKey: "date",
//     header: () => (
//       <Box textAlign={"center"} fontWeight={"Black"}>
//         Date
//       </Box>
//     ),
//     cell: ({ row }: { row: Row<Data> }) => {
//       const date = row.getValue("date") as Date;
//       return (
//         <Box className="text-center">
//           {format(new Date(date), "MMM d, yyyy")}
//         </Box>
//       );
//     },
//     filterFn: (
//       row: Row<Data>,
//       __columnId: string,
//       filterValue: { from?: Date; to?: Date }
//     ): boolean => {
//       const { from, to } = filterValue || {};
//       if (!from || !to) return true;
//       const date = row.getValue("date") as Date;
//       return isWithinInterval(date, { start: from, end: to });
//     },
//   },
// ];

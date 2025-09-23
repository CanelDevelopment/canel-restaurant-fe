import {
  useReactTable,
  getCoreRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  getFilteredRowModel,
  flexRender,
  type ColumnDef,
  type SortingState,
  type ColumnFiltersState,
  type VisibilityState,
} from "@tanstack/react-table";
import { useState } from "react";
import {
  Box,
  Text,
  Button,
  Flex,
  Center,
  Input,
  Portal,
  createListCollection,
  Select,
  InputGroup,
  SkeletonText,
} from "@chakra-ui/react";
import { IoIosArrowDown, IoIosArrowUp } from "react-icons/io";
import { Table } from "@chakra-ui/react";
import { RiSearchLine } from "react-icons/ri";

interface DynamicTableProps<TData> {
  data: TData[];
  columns: ColumnDef<TData>[];
  showPagination?: boolean;
  showButtons?: boolean;
  pageSizeOptions?: { value: number; label: string }[];
  headerColor?: string;
  showSearch?: boolean;
  placeholderprops?: string;
  showInputIcon?: string;
  showDashboardSearch?: boolean;
  showsimpleSearch?: boolean;
  isLoading?: boolean;

  selectedStatus?: string;
  setSelectedStatus?: (status: string) => void;
}

const defaultPageSizeOptions = [
  { value: 5, label: "5" },
  { value: 10, label: "10" },
  { value: 15, label: "15" },
  { value: 20, label: "20" },
  { value: 25, label: "25" },
];

export function DynamicTable<TData>({
  data,
  columns,
  showPagination = true,
  // showButtons = false,
  headerColor,
  showSearch = true,
  pageSizeOptions = defaultPageSizeOptions,
  placeholderprops = "Buscar",
  showDashboardSearch = false,
  showsimpleSearch = false,
  isLoading = false,

  selectedStatus = "all",
  setSelectedStatus,
}: DynamicTableProps<TData>) {
  const [sorting, setSorting] = useState<SortingState>([]);
  const [globalFilter, setGlobalFilter] = useState("");
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({});
  const [pageSize, setPageSize] = useState(5);
  const [pageIndex, setPageIndex] = useState(0);

  const table = useReactTable({
    data,
    columns,
    state: {
      sorting,
      globalFilter,
      columnFilters,
      columnVisibility,
      pagination: {
        pageIndex,
        pageSize,
      },
    },
    enableRowSelection: true,
    onSortingChange: setSorting,
    onGlobalFilterChange: setGlobalFilter,
    onColumnFiltersChange: setColumnFilters,
    onColumnVisibilityChange: setColumnVisibility,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: showPagination ? getPaginationRowModel() : undefined,
    onPaginationChange: (updater) => {
      if (typeof updater === "function") {
        const newState = updater({ pageIndex, pageSize });
        setPageIndex(newState.pageIndex);
        setPageSize(newState.pageSize);
      } else {
        setPageIndex(updater.pageIndex);
        setPageSize(updater.pageSize);
      }
    },
  });

  const pageSizeCollection = createListCollection({ items: pageSizeOptions });

  return (
    <Box className="bg-white ">
      {/* Title and Buttons */}

      <Flex
        className="justify-between max-sm:items-center py-4 max-md:flex-col gap-4"
        p={[2, 5]}
        bgColor={`${headerColor}` || ""}
      >
        {showPagination && (
          <Flex className="max-md:w-full gap-4 items-center">
            <Text
              color={"#575757"}
              fontWeight={"medium"}
              fontFamily={"AmsiProCond"}
            >
              Mostrar
            </Text>

            <Select.Root
              collection={pageSizeCollection}
              size="sm"
              width={["100%", "80px"]}
              bg={"white"}
              value={[String(pageSize)]}
              onValueChange={(e) => {
                setPageSize(Number(e.value));
                table.setPageSize(Number(e.value));
              }}
            >
              <Select.HiddenSelect />
              <Select.Control>
                <Select.Trigger
                  bg={"black"}
                  color={"white"}
                  height={"40px"}
                  rounded={"md"}
                  fontFamily={"AmsiProCond"}
                >
                  <Select.ValueText placeholder={pageSize.toString()} />
                </Select.Trigger>
                <Select.IndicatorGroup>
                  <Select.Indicator color={"white"} fontWeight={"bold"} />
                </Select.IndicatorGroup>
              </Select.Control>
              <Portal>
                <Select.Positioner>
                  <Select.Content>
                    {pageSizeOptions.map((option) => (
                      <Select.Item key={option.value} item={option}>
                        <Select.ItemText>{option.label}</Select.ItemText>
                        <Select.ItemIndicator />
                      </Select.Item>
                    ))}
                  </Select.Content>
                </Select.Positioner>
              </Portal>
            </Select.Root>

            <Text
              color={"#575757"}
              fontWeight={"medium"}
              fontFamily={"AmsiProCond"}
            >
              Entradas
            </Text>
          </Flex>
        )}
        <Center
          justifyItems={showSearch ? "end" : "end"}
          justifyContent={
            showSearch ? "flex-end" : ["start", "start", "flex-end"]
          }
          width={["100%", "100%", showDashboardSearch ? "40%" : "100%"]}
          className="edit this"
          // px={[0, 0, 4]}
        >
          {showSearch ? (
            <>
              {showDashboardSearch ? (
                <>
                  <Text mr={2}>Buscar</Text>
                  <Input
                    bg={"#ebebeb"}
                    className="border border-gray-300 rounded-md"
                    border={"none"}
                    px={4}
                    py={6}
                    fontFamily={"AmsiProCond"}
                    onChange={(event) => setGlobalFilter(event.target.value)}
                    placeholder="Buscar por Ref#, Nom, Cliente, Número de Teléfono"
                  />
                </>
              ) : (
                ""
              )}
              {showsimpleSearch ? (
                <InputGroup
                  startElement={<RiSearchLine />}
                  width={["100%", "100%", "40%"]}
                >
                  <Input
                    bg={"#ebebeb"}
                    type="search"
                    placeholder={placeholderprops}
                    _placeholder={{ letterSpacing: 0.5 }}
                    value={globalFilter ?? ""}
                    onChange={(event) => setGlobalFilter(event.target.value)}
                    className="border border-gray-300 rounded-md"
                    border={"none"}
                    px={4}
                    py={4}
                    fontFamily={"AmsiProCond"}
                    pt={3}
                  />
                </InputGroup>
              ) : (
                ""
              )}
            </>
          ) : (
            // Button Group
            <Flex
              className="justify-between max-sm:items-center py-4 max-md:flex-col gap-4"
              p={[2, 5]}
              bgColor={`${headerColor}` || ""}
            >
              {!showSearch && setSelectedStatus && (
                <Flex gap={2} wrap="wrap">
                  {[
                    { label: "Nuevos Pedidos", value: "pending" },
                    { label: "En Proceso", value: "confirmed" },
                    { label: "Completados", value: "delivered" },
                    { label: "Todos", value: "all" },
                  ].map((btn) => (
                    <Button
                      key={btn.value}
                      height={"45px"}
                      bg={selectedStatus === btn.value ? "Cgreen" : "#EBEBEB"}
                      color={selectedStatus === btn.value ? "white" : "black"}
                      rounded={"md"}
                      fontFamily={"AmsiProCond"}
                      onClick={() => setSelectedStatus(btn.value)}
                    >
                      {btn.label}
                    </Button>
                  ))}
                </Flex>
              )}
            </Flex>
          )}
        </Center>
      </Flex>

      {/* Table */}
      <Box overflowX={"scroll"}>
        <Table.Root unstyled w={"full"} h={"full"}>
          {/* Header - No borders */}
          <Table.Header>
            {table.getHeaderGroups().map((headerGroup) => (
              <Table.Row key={headerGroup.id} bg={"#ebebeb"} height={"70px"}>
                {headerGroup.headers.map((header) => (
                  <Table.ColumnHeader
                    key={header.id}
                    onClick={header.column.getToggleSortingHandler()}
                    color={"#000"}
                    border="none"
                    px={4}
                    fontSize={"md"}
                    fontFamily={"AmsiProCond-Bold"}
                    fontWeight={300}
                    width={`${header.getSize()}px`}
                  >
                    <Flex align="center" gap={1}>
                      {flexRender(
                        header.column.columnDef.header,
                        header.getContext()
                      )}
                      {{
                        asc: <IoIosArrowUp />,
                        desc: <IoIosArrowDown />,
                      }[header.column.getIsSorted() as string] ?? null}
                    </Flex>
                  </Table.ColumnHeader>
                ))}
              </Table.Row>
            ))}
          </Table.Header>

          {/* Body - With light gray column borders */}
          <Table.Body>
            {isLoading ? (
              <Table.Row>
                <Table.Cell colSpan={columns.length} p={4}>
                  <SkeletonText noOfLines={10} gap="4" />
                </Table.Cell>
              </Table.Row>
            ) : table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row, rowIndex) => (
                <Table.Row
                  key={row.id}
                  data-state={row.getIsSelected() && "selected"}
                  color={"#000"}
                >
                  {row.getVisibleCells().map((cell, cellIndex) => (
                    <Table.Cell
                      key={cell.id}
                      bg={rowIndex % 2 === 1 ? "#f6f6f6" : "white"}
                      borderRight={
                        cellIndex < row.getVisibleCells().length - 1
                          ? "1px solid"
                          : "none"
                      }
                      borderColor="gray.200"
                      py={5}
                      px={3}
                      fontFamily={"AmsiProCond"}
                      width={`${cell.column.getSize()}px`}
                    >
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext()
                      )}
                    </Table.Cell>
                  ))}
                </Table.Row>
              ))
            ) : (
              <Table.Row>
                <Table.Cell
                  colSpan={columns.length}
                  className="h-24 text-center text-gray-500"
                  border="none"
                >
                  No hay resultados.
                </Table.Cell>
              </Table.Row>
            )}
          </Table.Body>

          {/* Footer - No borders */}
          {showPagination && (
            <Table.Footer className="bg-[#ebebeb]">
              <Table.Row>
                <Table.Cell
                  colSpan={columns.length}
                  className="px-4 py-2"
                  border="none"
                  fontFamily={"AmsiProCond"}
                >
                  <Center justifyContent={"end"} mt={4}>
                    {/* Pagination remains the same */}
                  </Center>
                </Table.Cell>
              </Table.Row>
            </Table.Footer>
          )}
        </Table.Root>
      </Box>
    </Box>
  );
}

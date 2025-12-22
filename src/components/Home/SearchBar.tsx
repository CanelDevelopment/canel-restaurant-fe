import { Box, Container, Input, InputGroup } from "@chakra-ui/react";
import { RiSearch2Fill } from "react-icons/ri";
import React, { useState } from "react";

interface SearchBarProps {
  onSearch: (query: string) => void;
}

const SearchBar: React.FC<SearchBarProps> = ({ onSearch }) => {
  const [searchTerm, setSearchTerm] = useState("");

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearchTerm(value);
    onSearch(value); // call parent with updated search term
  };

  return (
    <Box px={[0, 0, 0]} py={[5, 14]}>
      <Container maxW={"container.xl"}>
        <InputGroup startElement={<RiSearch2Fill size={20} />}>
          <Input
            placeholder="Buscar productos..."
            rounded={"full"}
            bg={"white"}
            color={"#222"}
            py={6}
            value={searchTerm}
            onChange={handleChange}
          />
        </InputGroup>
      </Container>
    </Box>
  );
};

export default SearchBar;

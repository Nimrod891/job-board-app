import { ChangeEvent } from "react";
import { Input, InputGroup, InputLeftElement } from "@chakra-ui/react";
import { SearchIcon } from "@chakra-ui/icons";

interface SearchInputProps {
  value: string;
  onSearch: (searchText: string) => void;
}

const SearchInput = ({ value, onSearch }: SearchInputProps) => {
  const handleChange = (event: ChangeEvent<HTMLInputElement>) =>
    onSearch(event.target.value);

  return (
    <InputGroup maxW={{ base: "100%", md: "480px" }} width="100%">
      <InputLeftElement pointerEvents="none">
        <SearchIcon />
      </InputLeftElement>

      <Input
        value={value}
        onChange={handleChange}
        borderRadius={20}
        placeholder="Search jobs..."
        variant="filled"
      />
    </InputGroup>
  );
};

export default SearchInput;

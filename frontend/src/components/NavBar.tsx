import { HStack, Image } from "@chakra-ui/react";
import logo from "../assets/logo.webp";
import ColorModeSwitch from "./ColorModeSwitch";
import SearchInput from "./SearchInput";

interface SearchInputProps {
  onSearch: (searchText: string) => void;
}
const NavBar = ({ onSearch }: SearchInputProps) => {
  return (
    <HStack paddingX="10px" paddingY="5px">
      <Image
        src={logo}
        boxSize="60px"
        borderRadius={10}
        overflow="hidden"
        flexShrink={0}
      />
      <SearchInput onSearch={onSearch} />
      <ColorModeSwitch />
    </HStack>
  );
};

export default NavBar;

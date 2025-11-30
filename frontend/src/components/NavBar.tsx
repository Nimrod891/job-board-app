import { Flex, HStack, Image } from "@chakra-ui/react";
import logo from "../assets/logo.webp";
import ColorModeSwitch from "./ColorModeSwitch";
import SearchInput from "./SearchInput";

interface NavBarProps {
  searchText: string;
  onSearch: (value: string) => void;
}

const NavBar = ({ searchText, onSearch }: NavBarProps) => {
  return (
    <Flex
      direction={{ base: "column", md: "row" }}
      gap={{ base: 3, md: 4 }}
      align={{ base: "stretch", md: "center" }}
      justify="space-between"
      paddingX="10px"
      paddingY="8px"
    >
      <HStack spacing={3}>
        <Image src={logo} boxSize="60px" borderRadius={10} overflow="hidden" />
      </HStack>
      <SearchInput value={searchText} onSearch={onSearch} />
      <ColorModeSwitch />
    </Flex>
  );
};

export default NavBar;

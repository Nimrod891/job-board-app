import { Box, Flex, Image } from "@chakra-ui/react";
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
      as="nav"
      align="center"
      gap={{ base: 3, md: 6 }}
      paddingX="10px"
      paddingY="8px"
      width="100%"
    >
      <Image
        src={logo}
        boxSize="52px"
        borderRadius={10}
        overflow="hidden"
        flexShrink={0}
      />
      <Box
        flex="1"
        minWidth={0}
        display="flex"
        justifyContent={{ base: "flex-start", md: "center" }}
      >
        <SearchInput value={searchText} onSearch={onSearch} />
      </Box>
      <Box flexShrink={0}>
        <ColorModeSwitch />
      </Box>
    </Flex>
  );
};

export default NavBar;

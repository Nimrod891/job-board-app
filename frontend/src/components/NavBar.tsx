import { Box, Flex, IconButton, Image, Show } from "@chakra-ui/react";
import { HamburgerIcon } from "@chakra-ui/icons";
import logo from "../assets/logo.webp";
import ColorModeSwitch from "./ColorModeSwitch";
import SearchInput from "./SearchInput";

interface NavBarProps {
  searchText: string;
  onSearch: (value: string) => void;
  onMenuClick: () => void;
}

const NavBar = ({ searchText, onSearch, onMenuClick }: NavBarProps) => {
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
        borderRadius={0}
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
        <Show above="lg">
          <ColorModeSwitch />
        </Show>
        <Show below="lg">
          <IconButton
            aria-label="Open menu"
            icon={<HamburgerIcon boxSize={5} />}
            variant="ghost"
            onClick={onMenuClick}
          />
        </Show>
      </Box>
    </Flex>
  );
};

export default NavBar;

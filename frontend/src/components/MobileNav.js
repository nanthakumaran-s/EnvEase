import {
  Avatar,
  Flex,
  HStack,
  Icon,
  IconButton,
  Menu,
  MenuButton,
  MenuDivider,
  MenuGroup,
  MenuItem,
  MenuList,
  Text,
} from "@chakra-ui/react";
import { FiMenu } from "react-icons/fi";
import { TiArrowSortedDown } from "react-icons/ti";
import { Link } from "react-router-dom";

export const MobileNav = ({ onOpen, ...rest }) => {
  return (
    <Flex
      ml={{ base: 0, md: 60 }}
      alignItems="center"
      bg="white"
      borderBottomWidth="1px"
      borderBottomColor="border"
      justifyContent={{ base: "space-between", md: "flex-end" }}
      {...rest}
    >
      <IconButton
        display={{ base: "flex", md: "none" }}
        onClick={onOpen}
        variant="outline"
        ml="3"
        aria-label="open menu"
        icon={<FiMenu />}
      />

      <HStack spacing={{ base: "0", md: "6" }}>
        {/* <IconButton
            size="lg"
            variant="ghost"
            aria-label="open menu"
            icon={<FiBell />}
          /> */}
        <Flex alignItems={"center"}>
          <Menu>
            <MenuButton transition="all 0.3s">
              <Flex px="5" py="3" alignItems="center" cursor="pointer">
                <Avatar src="/avatar512.png" name="Nanthakumaran S" size="sm" />
                <Flex
                  ml="4"
                  flexDirection="column"
                  justifyContent="center"
                  alignItems="flex-start"
                >
                  <Text fontSize="14" fontWeight="400">
                    Nanthakumaran S
                  </Text>
                  <Text fontSize="12" fontWeight="500" color="blackAlpha.500">
                    Presidio
                  </Text>
                </Flex>
                <Flex ml="5">
                  <Icon color="blackAlpha.700" as={TiArrowSortedDown} />
                </Flex>
              </Flex>
            </MenuButton>
            <MenuList bg="white" borderColor="border" borderRadius="3">
              <MenuGroup
                title="Account"
                fontSize="15"
                color="blackAlpha.400"
                letterSpacing="widest"
              >
                <Link to="/profile-settings">
                  <MenuItem fontSize="15" color="blackAlpha">
                    Manage Account
                  </MenuItem>
                </Link>
                <Link to="/org-settings">
                  <MenuItem fontSize="15" color="blackAlpha">
                    Organization
                  </MenuItem>
                </Link>
              </MenuGroup>

              <MenuDivider />
              <MenuItem fontSize="15" color="blackAlpha">
                Sign out
              </MenuItem>
            </MenuList>
          </Menu>
        </Flex>
      </HStack>
    </Flex>
  );
};

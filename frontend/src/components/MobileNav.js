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
import { Link, useNavigate } from "react-router-dom";
import { useRecoilState } from "recoil";
import { userDefault, userAtom } from "../state/user.atom";

export const MobileNav = ({ onOpen, ...rest }) => {
  const [user, setUser] = useRecoilState(userAtom);
  const navigate = useNavigate();

  const handleSignout = async () => {
    setUser(userDefault);
    localStorage.removeItem("tokens");
    navigate("/auth");
  };

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
        <Flex alignItems={"center"}>
          <Menu>
            <MenuButton transition="all 0.3s">
              <Flex px="5" py="3" alignItems="center" cursor="pointer">
                <Avatar src="/avatar512.png" name={user.name} size="sm" />
                <Flex
                  ml="4"
                  flexDirection="column"
                  justifyContent="center"
                  alignItems="flex-start"
                >
                  <Text fontSize="14" fontWeight="400">
                    {user.name}
                  </Text>
                  <Text fontSize="12" fontWeight="500" color="blackAlpha.500">
                    {user.enterprise.name}
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
              <MenuItem
                fontSize="15"
                color="blackAlpha"
                onClick={handleSignout}
              >
                Sign out
              </MenuItem>
            </MenuList>
          </Menu>
        </Flex>
      </HStack>
    </Flex>
  );
};

import {
  Box,
  Button,
  CloseButton,
  Flex,
  Icon,
  Image,
  Text,
} from "@chakra-ui/react";
import React, { useState } from "react";
import {
  PiCheckBold,
  PiGearDuotone,
  PiLockKeyDuotone,
  PiUsersThreeDuotone,
} from "react-icons/pi";
import { TiArrowSortedDown, TiArrowSortedUp } from "react-icons/ti";
import { Link, useLocation } from "react-router-dom";

const LinkItems = [
  { name: "Secrets", icon: PiLockKeyDuotone, link: "/dashboard" },
  { name: "Members", icon: PiUsersThreeDuotone, link: "/members" },
  { name: "Settings", icon: PiGearDuotone, link: "/settings" },
];

export const SidebarContent = ({ onClose, ...rest }) => {
  const [show, setShow] = useState(false);

  return (
    <Box {...rest}>
      <Flex
        transition="3s ease"
        bg="white"
        borderRight="1px"
        borderRightColor="border"
        w={{ base: "full", md: 60 }}
        pos="fixed"
        height="100vh"
        flexDirection="column"
        justifyContent="space-between"
      >
        <Flex flexDirection="column">
          <Flex
            py="4"
            px="5"
            mb="2"
            alignItems="center"
            justifyContent="space-between"
          >
            <Image
              src="/extendedLogo.png"
              width={{ base: "150px", md: "120px" }}
            />
            <CloseButton
              display={{ base: "flex", md: "none" }}
              onClick={onClose}
            />
          </Flex>
          <Flex
            flexDirection="column"
            width="100%"
            alignItems="flex-start"
            justifyContent="center"
            px="5"
            my="5"
          >
            <Text
              fontSize="13"
              fontWeight="700"
              color="blackAlpha.400"
              letterSpacing="widest"
              textTransform="uppercase"
            >
              Project
            </Text>
            <Flex
              mt="2"
              width="100%"
              px="3"
              py="3"
              alignItems="center"
              justifyContent="space-between"
              bg="blackAlpha.100"
              borderRadius="5"
              cursor="pointer"
              onClick={() => setShow(!show)}
            >
              <Text fontSize="15" fontWeight="600" color="blackAlpha.700">
                Some Project
              </Text>
              <Icon
                color="blackAlpha.700"
                as={show ? TiArrowSortedUp : TiArrowSortedDown}
              />
            </Flex>
            {show && (
              <Flex
                mt="1"
                maxHeight="150px"
                width="100%"
                border="1px"
                borderColor="border"
                borderRadius="5"
                flexDirection="column"
                overflowY="scroll"
              >
                <Flex
                  alignItems="center"
                  gap="3"
                  pl="5"
                  py="3"
                  _hover={{ bg: "blackAlpha.50" }}
                  cursor="pointer"
                >
                  <Icon as={PiCheckBold} fontSize="16" color="green" />
                  <Text fontSize="14" fontWeight="500">
                    Some Project
                  </Text>
                </Flex>
                <Flex
                  alignItems="center"
                  gap="3"
                  pl="5"
                  py="3"
                  _hover={{ bg: "blackAlpha.50" }}
                  cursor="pointer"
                >
                  <Icon as={PiCheckBold} fontSize="16" visibility="hidden" />
                  <Text fontSize="14" fontWeight="500">
                    Some Project
                  </Text>
                </Flex>
              </Flex>
            )}
          </Flex>
          {LinkItems.map((link) => (
            <NavItem key={link.name} icon={link.icon} link={link.link}>
              {link.name}
            </NavItem>
          ))}
        </Flex>
        <Flex>
          <Button
            m="4"
            mt={{ base: 0, md: 5 }}
            bg="blackAlpha.100"
            _hover={{ bg: "blackAlpha.200" }}
            fontSize="15"
            color="blackAlpha.700"
            width="100%"
          >
            Add Project
          </Button>
        </Flex>
      </Flex>
    </Box>
  );
};

const NavItem = ({ icon, link, children, ...rest }) => {
  const location = useLocation();

  return (
    <Link
      to={link}
      style={{ textDecoration: "none" }}
      _focus={{ boxShadow: "none" }}
    >
      <Flex
        align="center"
        py="2"
        px="3"
        mx="3"
        borderRadius="3"
        role="group"
        cursor="pointer"
        transition="all 0.2s ease"
        _hover={{
          bg: "brand.50",
        }}
        {...rest}
      >
        {icon && (
          <Icon
            mr="4"
            fontSize="20"
            color={link === location.pathname ? "brand.600" : ""}
            as={icon}
          />
        )}
        <Text
          fontSize="15"
          fontWeight="500"
          color={link === location.pathname ? "brand.600" : ""}
        >
          {children}
        </Text>
      </Flex>
    </Link>
  );
};

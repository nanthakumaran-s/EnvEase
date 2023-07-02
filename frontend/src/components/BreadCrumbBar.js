import {
  Avatar,
  Breadcrumb,
  BreadcrumbItem,
  Flex,
  Text,
} from "@chakra-ui/react";
import React from "react";
import { MdChevronRight } from "react-icons/md";

const BreadCrumbBar = () => {
  return (
    <Breadcrumb separator={<MdChevronRight color="blackAlpha" />}>
      <BreadcrumbItem>
        <Flex alignItems="center" gap="3">
          <Avatar
            src="/"
            name="Presidio"
            bg="brand.500"
            color="white"
            size="sm"
          />
          <Text fontSize="15" fontWeight="700" color="brand.600">
            Presidio
          </Text>
        </Flex>
      </BreadcrumbItem>
      <BreadcrumbItem>
        <Text fontSize="15" fontWeight="500">
          Some Project
        </Text>
      </BreadcrumbItem>
      <BreadcrumbItem>
        <Text fontSize="15" fontWeight="500">
          Secrets
        </Text>
      </BreadcrumbItem>
    </Breadcrumb>
  );
};

export default BreadCrumbBar;

import {
  Avatar,
  Breadcrumb,
  BreadcrumbItem,
  Flex,
  Text,
} from "@chakra-ui/react";
import React from "react";
import { MdChevronRight } from "react-icons/md";
import { useRecoilValue } from "recoil";
import { userAtom } from "../state/user.atom";

const BreadCrumbBar = ({ sections }) => {
  const user = useRecoilValue(userAtom);

  return (
    <Breadcrumb separator={<MdChevronRight color="blackAlpha" />}>
      <BreadcrumbItem>
        <Flex alignItems="center" gap="3">
          <Avatar
            src="/"
            name={user.enterprise.name}
            bg="brand.500"
            color="white"
            size="sm"
          />
          <Text fontSize="15" fontWeight="700" color="brand.600">
            {user.enterprise.name}
          </Text>
        </Flex>
      </BreadcrumbItem>
      {sections.map((section, index) => (
        <BreadcrumbItem key={index}>
          <Text fontSize="15" fontWeight="500">
            {section}
          </Text>
        </BreadcrumbItem>
      ))}
    </Breadcrumb>
  );
};

export default BreadCrumbBar;

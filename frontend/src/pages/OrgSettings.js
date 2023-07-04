import React, { useState } from "react";
import SidebarWithHeader from "../components/SidebarWithHeader";
import BreadCrumbBar from "../components/BreadCrumbBar";
import {
  Box,
  Button,
  Flex,
  Icon,
  IconButton,
  Text,
  Tooltip,
} from "@chakra-ui/react";
import ReactDataGrid from "@inovua/reactdatagrid-community";
import { headerProps, gridStyle } from "../utils/constants";
import { HiOutlinePencil } from "react-icons/hi";
import { FiTrash2 } from "react-icons/fi";
import { BiPlus } from "react-icons/bi";

const OrgSettings = () => {
  const [dataForGrid, setDataForGrid] = useState([
    {
      id: 1,
      name: "Nanthakumaran S",
      email: "nanthakumarans@presidio.com",
      role: "Employee",
    },
  ]);

  const columns = [
    {
      name: "id",
      header: "Id",
      maxWidth: 60,
      render: ({ value }) => {
        return (
          <Text fontSize="14" fontWeight="600">
            {value}
          </Text>
        );
      },
      headerProps,
    },
    {
      name: "name",
      header: "Name",
      minWidth: 250,
      render: ({ value }) => {
        return (
          <Text fontSize="14" fontWeight="600">
            {value}
          </Text>
        );
      },
      headerProps,
    },
    {
      name: "email",
      header: "Email",
      minWidth: 250,
      render: ({ value }) => {
        return (
          <Text fontSize="14" fontWeight="600">
            {value}
          </Text>
        );
      },
      headerProps,
    },
    {
      name: "role",
      header: "Role",
      minWidth: 100,
      render: ({ value }) => {
        return (
          <Text fontSize="14" fontWeight="600">
            {value}
          </Text>
        );
      },
      headerProps,
    },
    {
      name: "quickAction",
      header: "",
      minWidth: 200,
      render: ({ data }) => {
        return (
          <Flex alignItems="center">
            <Tooltip label="Edit" placement="top" hasArrow>
              <IconButton
                icon={<Icon as={HiOutlinePencil} />}
                color="black"
                bg="transparent"
                _hover={{
                  color: "blue.500",
                }}
                onClick={() => {}}
              />
            </Tooltip>
            <Tooltip label="Remove" placement="top" hasArrow>
              <IconButton
                icon={<Icon as={FiTrash2} />}
                color="black"
                bg="transparent"
                _hover={{
                  color: "brand.500",
                }}
              />
            </Tooltip>
          </Flex>
        );
      },
    },
  ];

  return (
    <SidebarWithHeader>
      <BreadCrumbBar sections={["Org Settings"]} />
      <Flex
        mt={5}
        flexDirection="column"
        alignItems="flex-start"
        bg="white"
        borderRadius="5"
        px="6"
        pt="4"
        pb="6"
        boxShadow="sm"
      >
        <Text fontSize="18" fontWeight="600">
          Members
        </Text>
        <Flex width="100%" mt={4} alignItems="center" justifyContent="flex-end">
          <Button
            fontSize="14"
            fontWeight="500"
            leftIcon={<Icon as={BiPlus} />}
          >
            Add Member
          </Button>
        </Flex>
        <Box mt={3} width="100%">
          <ReactDataGrid
            idProperty="id"
            style={gridStyle}
            columns={columns}
            pagination
            dataSource={dataForGrid}
            defaultLimit={10}
            rowHeight={60}
          />
        </Box>
      </Flex>
    </SidebarWithHeader>
  );
};

export default OrgSettings;

import React, { useState } from "react";
import SidebarWithHeader from "../components/SidebarWithHeader";
import BreadCrumbBar from "../components/BreadCrumbBar";
import {
  Badge,
  Box,
  Button,
  Checkbox,
  Flex,
  FormControl,
  FormLabel,
  Icon,
  IconButton,
  Input,
  Text,
  Tooltip,
} from "@chakra-ui/react";
import ReactDataGrid from "@inovua/reactdatagrid-community";
import { headerProps, gridStyle } from "../utils/constants";
import { FiRefreshCw, FiTrash2 } from "react-icons/fi";

const ProfileSettings = () => {
  const [dataForGrid, setDataForGrid] = useState([
    {
      id: 1,
      token: "12345",
      device: "Web",
      addTime: "12 Jun 2023",
      expiryTime: "12 Dec 2023",
      isRevoked: false,
    },
    {
      id: 1,
      token: "123456",
      device: "Web",
      addTime: "12 Jun 2023",
      expiryTime: "12 Dec 2023",
      isRevoked: false,
    },
    {
      id: 1,
      token: "123456",
      device: "Web",
      addTime: "12 Jun 2023",
      expiryTime: "12 Dec 2023",
      isRevoked: true,
    },
  ]);

  const cur = "12345";

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
      name: "device",
      header: "Device",
      minWidth: 100,
      render: ({ data }) => {
        return (
          <Flex alignItems="center" gap="3">
            <Text fontSize="14" fontWeight="600">
              {data.device}
            </Text>
            {data.token === cur ? (
              <Badge colorScheme="green">Current</Badge>
            ) : (
              ""
            )}
          </Flex>
        );
      },
      headerProps,
    },
    {
      name: "addTime",
      header: "Added At",
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
      name: "expiryTime",
      header: "Expiry Time",
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
      name: "isRevoked",
      header: "Is Revoked",
      minWidth: 100,
      render: ({ value }) => {
        return (
          <Text fontSize="14" fontWeight="600">
            {!value ? (
              <Badge colorScheme="green">Active</Badge>
            ) : (
              <Badge colorScheme="brand">Inactive</Badge>
            )}
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
            <Tooltip label="Revoke" placement="top" hasArrow>
              <IconButton
                icon={<Icon as={FiRefreshCw} />}
                color="black"
                bg="transparent"
                _hover={{
                  color: "blue.500",
                }}
                onClick={() => {}}
                isDisabled={data.isRevoked}
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
      <BreadCrumbBar sections={["Profile Settings"]} />

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
          Two Step Vertification
        </Text>
        <Checkbox mt="3" fontSize="15" borderColor="border" colorScheme="brand">
          Enable
        </Checkbox>
      </Flex>

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
          Sessions
        </Text>
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
          Change Password
        </Text>
        <form style={{ width: "100%", marginTop: "12px" }}>
          <Flex
            width="100%"
            alignItems="center"
            justifyContent="center"
            gap="3"
          >
            <FormControl>
              <FormLabel fontSize="15">Old password</FormLabel>
              <Input placeholder="Old password" type="password" fontSize="14" />
            </FormControl>
            <FormControl>
              <FormLabel fontSize="15">New password</FormLabel>
              <Input placeholder="New password" type="password" fontSize="14" />
            </FormControl>
          </Flex>
        </form>
        <Button
          colorScheme="brand"
          borderRadius="5"
          fontSize="15"
          width="150px"
          mt="5"
          isDisabled
        >
          Change
        </Button>
      </Flex>
    </SidebarWithHeader>
  );
};

export default ProfileSettings;

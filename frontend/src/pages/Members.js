import React, { useState } from "react";
import SidebarWithHeader from "../components/SidebarWithHeader";
import BreadCrumbBar from "../components/BreadCrumbBar";
import { Box, Flex, Heading, Text } from "@chakra-ui/layout";
import { Button, IconButton } from "@chakra-ui/button";
import { BiPlus } from "react-icons/bi";
import { Icon } from "@chakra-ui/icon";
import ReactDataGrid from "@inovua/reactdatagrid-community";
import { headerProps, gridStyle } from "../utils/constants";
import { Tooltip } from "@chakra-ui/tooltip";
import { HiOutlinePencil } from "react-icons/hi";
import { FiTrash2 } from "react-icons/fi";
import {
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalHeader,
  ModalOverlay,
} from "@chakra-ui/modal";
import { useDisclosure } from "@chakra-ui/hooks";

const Members = () => {
  const [dataForGrid, setDataForGrid] = useState([
    {
      id: 1,
      name: "Nanthakumaran S",
      email: "nanthakumarans@presidio.com",
      role: "Employee",
      access: "Read",
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
      name: "access",
      header: "Access",
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

  const { isOpen, onOpen, onClose } = useDisclosure();

  const [isUpdate, setIsUpdate] = useState(false);

  return (
    <SidebarWithHeader>
      <Modal
        isOpen={isOpen}
        onClose={onClose}
        isCentered
        onCloseComplete={() => {}}
      >
        <ModalOverlay />
        <ModalContent borderRadius="3">
          <ModalHeader fontSize="18">Modal Title</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <form>
              <Flex alignItems="center" justifyContent="flex-end" mt={6} mb={3}>
                <Button
                  variant="ghost"
                  mr={1}
                  onClick={onClose}
                  fontSize="14"
                  borderRadius="3"
                >
                  Close
                </Button>
                <Button
                  colorScheme="brand"
                  fontSize="14"
                  borderRadius="3"
                  type="submit"
                >
                  {isUpdate ? "Update" : "Add"}
                </Button>
              </Flex>
            </form>
          </ModalBody>
        </ModalContent>
      </Modal>

      <BreadCrumbBar sections={["Some Project", "Members"]} />
      <Flex mt={4} alignItems="center" justifyContent="space-between">
        <Heading fontSize="24">Members</Heading>
        <Button fontSize="14" fontWeight="500" leftIcon={<Icon as={BiPlus} />}>
          Add Member
        </Button>
      </Flex>
      <Box mt={3}>
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
    </SidebarWithHeader>
  );
};

export default Members;

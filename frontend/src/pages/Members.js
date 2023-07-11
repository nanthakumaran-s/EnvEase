/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState } from "react";
import SidebarWithHeader from "../components/SidebarWithHeader";
import BreadCrumbBar from "../components/BreadCrumbBar";
import { Box, Flex, Heading, Text } from "@chakra-ui/layout";
import { Button, IconButton } from "@chakra-ui/button";
import { BiPlus } from "react-icons/bi";
import { Icon } from "@chakra-ui/icon";
import ReactDataGrid from "@inovua/reactdatagrid-community";
import { headerProps, gridStyle } from "../utils/constants";
import { Tooltip } from "@chakra-ui/tooltip";
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
import { useRecoilValue } from "recoil";
import { currentProjectAtom, projectsAtom } from "../state/projects.atom";
import useAxios from "../hooks/useAxios";
import useCustomToast from "../hooks/useCustomToast";
import {
  FormControl,
  FormHelperText,
  FormLabel,
  Input,
  Select,
} from "@chakra-ui/react";
import { useForm } from "react-hook-form";
import { TiArrowSortedDown } from "react-icons/ti";
import { userAtom } from "../state/user.atom";

const access = [
  {
    id: 1,
    access: "No Access",
  },
  {
    id: 2,
    access: "Read",
  },
  {
    id: 3,
    access: "Write",
  },
  {
    id: 4,
    access: "Read Write",
  },
];

const Members = () => {
  const {
    data: membersData,
    error: membersError,
    loading: membersLoading,
    trigger: membersTrigger,
  } = useAxios("GET", "/project/members");

  const {
    data: addMemberData,
    error: addMemberError,
    loading: addMemberLoading,
    trigger: addMemberTrigger,
    remove: addMemberRemove,
  } = useAxios("POST", "/project/member");

  const {
    data: removeMemberData,
    error: removeMemberError,
    loading: removeMemberLoading,
    trigger: removeMemberTrigger,
    remove: removeMemberRemove,
  } = useAxios("DELETE", "/project/member");

  const projects = useRecoilValue(projectsAtom);
  const user = useRecoilValue(userAtom);
  const currentProject = useRecoilValue(currentProjectAtom);

  const [dataForGrid, setDataForGrid] = useState([]);

  const { loadingToast, errorToast, closeAll } = useCustomToast();

  const [accessSelected, setAccessSelected] = useState(1);

  useEffect(() => {
    if (membersData) {
      setDataForGrid(
        membersData.members.map((member, index) => ({
          ...member,
          refId: index + 1,
        }))
      );
    }

    if (addMemberData) {
      membersTrigger({
        projectId: projects[currentProject].id,
      });
      addMemberRemove();
      onClose();
    }

    if (removeMemberData) {
      membersTrigger({
        projectId: projects[currentProject].id,
      });
      removeMemberRemove();
    }
  }, [membersData, addMemberData, removeMemberData]);

  useEffect(() => {
    if (projects.length > 0) {
      membersTrigger({
        projectId: projects[currentProject].id,
      });
    }
  }, [projects, currentProject]);

  useEffect(() => {
    if (membersLoading || addMemberLoading || removeMemberLoading) {
      loadingToast();
    }

    if (!membersLoading && !addMemberLoading && !removeMemberLoading) {
      closeAll();
    }
  }, [membersLoading, addMemberLoading, removeMemberLoading]);

  useEffect(() => {
    if (membersError) {
      errorToast("Some error occurred. Please try again later.");
    }

    if (addMemberError) {
      if (addMemberError.response) {
        errorToast(addMemberError.response.data.message);
        return;
      }
      errorToast("Some error occurred. Please try again later.");
    }

    if (removeMemberError) {
      if (removeMemberError.response) {
        errorToast(removeMemberError.response.data.message);
        return;
      }
      errorToast("Some error occurred. Please try again later.");
    }
  }, [membersError, addMemberError, removeMemberError]);

  const columns = [
    {
      name: "refId",
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
            <Tooltip label="Remove" placement="top" hasArrow>
              <IconButton
                icon={<Icon as={FiTrash2} />}
                color="black"
                bg="transparent"
                _hover={{
                  color: "brand.500",
                }}
                onClick={() => {
                  if (data.email === user.email) return;
                  removeMemberTrigger({
                    userId: data.id,
                    projectId: projects[currentProject].id,
                  });
                }}
                isDisabled={user.role.role === "Employee"}
              />
            </Tooltip>
          </Flex>
        );
      },
    },
  ];

  const { isOpen, onOpen, onClose } = useDisclosure();

  const {
    register,
    formState: { errors },
    handleSubmit,
    reset,
  } = useForm();

  const addMember = (data) => {
    addMemberTrigger({
      email: data.mail,
      projectId: projects[currentProject].id,
      accessId: accessSelected,
    });
  };

  return (
    <SidebarWithHeader>
      <Modal
        isOpen={isOpen}
        onClose={onClose}
        isCentered
        onCloseComplete={() => {
          reset();
        }}
      >
        <ModalOverlay />
        <ModalContent borderRadius="3">
          <ModalHeader fontSize="18">Add Member</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <form onSubmit={handleSubmit(addMember)}>
              <FormControl isInvalid={errors.mail ? true : false}>
                <FormLabel fontSize="14" fontWeight="600">
                  Mail
                </FormLabel>
                <Input
                  placeholder="Enter mail"
                  fontSize="14"
                  borderRadius="5"
                  type="text"
                  {...register("mail", { required: true })}
                />
                {errors.mail ? (
                  <FormHelperText color="red" fontSize="12" fontWeight="500">
                    Mail cannot be empty.
                  </FormHelperText>
                ) : (
                  ""
                )}
              </FormControl>
              <FormControl mt={3}>
                <FormLabel fontSize="14" fontWeight="600">
                  Role
                </FormLabel>
                <Select
                  iconColor="blackAlpha.700"
                  iconSize="18"
                  variant="filled"
                  icon={<TiArrowSortedDown />}
                  cursor="pointer"
                  fontSize="14"
                  fontWeight="500"
                  onChange={(e) => setAccessSelected(parseInt(e.target.value))}
                >
                  {access.map((r, index) => (
                    <option key={index} value={r.id}>
                      {r.access}
                    </option>
                  ))}
                </Select>
              </FormControl>
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
                  Add
                </Button>
              </Flex>
            </form>
          </ModalBody>
        </ModalContent>
      </Modal>

      {projects.length === 0 ? (
        <Flex
          width="100%"
          height="80vh"
          alignItems="center"
          justifyContent="center"
        >
          <Text fontSize="24" fontWeight="600">
            No Projects Found
          </Text>
        </Flex>
      ) : (
        <React.Fragment>
          <BreadCrumbBar
            sections={[projects[currentProject].name, "Members"]}
          />
          <Flex mt={4} alignItems="center" justifyContent="space-between">
            <Heading fontSize="24">Members</Heading>
            {user.role.role !== "Employee" && (
              <Button
                fontSize="14"
                fontWeight="500"
                leftIcon={<Icon as={BiPlus} />}
                onClick={onOpen}
              >
                Add Member
              </Button>
            )}
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
        </React.Fragment>
      )}
    </SidebarWithHeader>
  );
};

export default Members;

/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState } from "react";
import SidebarWithHeader from "../components/SidebarWithHeader";
import BreadCrumbBar from "../components/BreadCrumbBar";
import {
  AlertDialog,
  AlertDialogBody,
  AlertDialogContent,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogOverlay,
  Box,
  Button,
  Flex,
  FormControl,
  FormHelperText,
  FormLabel,
  Icon,
  IconButton,
  Input,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalHeader,
  ModalOverlay,
  Select,
  Text,
  Tooltip,
  useDisclosure,
} from "@chakra-ui/react";
import ReactDataGrid from "@inovua/reactdatagrid-community";
import { headerProps, gridStyle } from "../utils/constants";
import { FiTrash2 } from "react-icons/fi";
import { BiPlus } from "react-icons/bi";
import { useRecoilValue } from "recoil";
import { userAtom } from "../state/user.atom";
import useAxios from "../hooks/useAxios";
import useCustomToast from "../hooks/useCustomToast";
import { useForm } from "react-hook-form";
import { TiArrowSortedDown } from "react-icons/ti";

const role = [
  {
    id: 3,
    role: "Admin",
  },
  {
    id: 4,
    role: "HR",
  },
  {
    id: 5,
    role: "Project Manager",
  },
  {
    id: 6,
    role: "Employee",
  },
];

const OrgSettings = () => {
  const user = useRecoilValue(userAtom);
  const [dataForGrid, setDataForGrid] = useState([]);
  const [userToDelete, setUserToDelete] = useState(-1);

  const { data, error, loading, trigger } = useAxios(
    "GET",
    "/enterprise/members"
  );
  const {
    data: registerData,
    error: registerError,
    loading: registerLoading,
    trigger: registerTrigger,
    remove: registerRemove,
  } = useAxios("POST", "/auth/register");
  const {
    data: deleteData,
    error: deleteError,
    loading: deleteLoading,
    trigger: deleteTrigger,
    remove: deleteRemove,
  } = useAxios("DELETE", "/auth");

  const { loadingToast, errorToast, closeAll } = useCustomToast();

  useEffect(() => {
    if (data) {
      if (data.status === true) {
        setDataForGrid(data.members.map((d, i) => ({ ...d, refId: i + 1 })));
      } else {
        errorToast("Some error occured. Please try again later.");
      }
    }

    if (registerData) {
      if (registerData.status === true) {
        trigger();
        registerRemove();
        modelOnClose();
      } else {
        errorToast("Some error occured. Please try again later.");
      }
    }

    if (deleteData) {
      if (deleteData.status === true) {
        trigger();
        deleteRemove();
        alertOnClose();
      } else {
        errorToast("Some error occured. Please try again later.");
      }
    }
  }, [data, registerData, deleteData]);

  useEffect(() => {
    if (loading || registerLoading || deleteLoading) {
      loadingToast();
    }

    if (!loading && !registerLoading && !deleteLoading) {
      closeAll();
    }
  }, [loading, registerLoading, deleteLoading]);

  useEffect(() => {
    if (error) {
      errorToast("Some error occurred. Please try again later.");
    }

    if (registerError) {
      if (registerError.response) {
        errorToast(registerError.response.data.message);
        return;
      }
      errorToast("Some error occurred. Please try again later.");
    }

    if (deleteError) {
      if (deleteError.response) {
        errorToast(deleteError.response.data.message);
        return;
      }
      errorToast("Some error occurred. Please try again later.");
    }
  }, [error, registerError, deleteError]);

  useEffect(() => {
    trigger();
  }, []);

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
            <Tooltip label="Remove" placement="top" hasArrow>
              <IconButton
                icon={<Icon as={FiTrash2} />}
                color="black"
                bg="transparent"
                _hover={{
                  color: "brand.500",
                }}
                isDisabled={user.role.role === "Employee"}
                onClick={() => {
                  setUserToDelete(data.id);
                  alertOnOpen();
                }}
              />
            </Tooltip>
          </Flex>
        );
      },
    },
  ];

  const {
    isOpen: alertIsOpen,
    onOpen: alertOnOpen,
    onClose: alertOnClose,
  } = useDisclosure();

  const {
    isOpen: modelIsOpen,
    onOpen: modelOnOpen,
    onClose: modelOnClose,
  } = useDisclosure();
  const cancelRef = React.useRef();

  const {
    register,
    formState: { errors },
    handleSubmit,
    reset,
  } = useForm();

  const [roleSelected, setRoleSelected] = useState(3);

  const onModelSubmit = (data) => {
    registerTrigger({
      name: data.name,
      email: data.email,
      password: data.password,
      twoFactor: true,
      roleId: roleSelected,
      enterpriseId: user.enterprise.id,
    });
  };

  return (
    <SidebarWithHeader>
      <AlertDialog
        isOpen={alertIsOpen}
        leastDestructiveRef={cancelRef}
        onClose={alertOnClose}
        isCentered
      >
        <AlertDialogOverlay>
          <AlertDialogContent>
            <AlertDialogHeader fontSize="lg" fontWeight="bold">
              Delete Member
            </AlertDialogHeader>

            <AlertDialogBody>
              Are you sure? You can't undo this action afterwards.
            </AlertDialogBody>

            <AlertDialogFooter>
              <Button ref={cancelRef} onClick={alertOnClose}>
                Cancel
              </Button>
              <Button
                colorScheme="red"
                onClick={() => {
                  deleteTrigger({
                    id: userToDelete,
                  });
                }}
                ml={3}
              >
                Delete
              </Button>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialogOverlay>
      </AlertDialog>

      <Modal
        isOpen={modelIsOpen}
        onClose={modelOnClose}
        isCentered
        onCloseComplete={() => {
          reset();
        }}
      >
        <ModalOverlay />
        <ModalContent borderRadius="3">
          <ModalHeader fontSize="18">Add new member</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <form onSubmit={handleSubmit(onModelSubmit)}>
              <FormControl isInvalid={errors.name ? true : false}>
                <FormLabel fontSize="14" fontWeight="600">
                  Name
                </FormLabel>
                <Input
                  placeholder="Enter name"
                  fontSize="14"
                  borderRadius="5"
                  type="text"
                  {...register("name", { required: true })}
                />
                {errors.name ? (
                  <FormHelperText color="red" fontSize="12" fontWeight="500">
                    Name cannot be empty.
                  </FormHelperText>
                ) : (
                  ""
                )}
              </FormControl>
              <FormControl mt={3} isInvalid={errors.email ? true : false}>
                <FormLabel fontSize="14" fontWeight="600">
                  Email
                </FormLabel>
                <Input
                  placeholder="Enter email"
                  fontSize="14"
                  borderRadius="5"
                  type="email"
                  {...register("email", { required: true })}
                />
                {errors.email ? (
                  <FormHelperText color="red" fontSize="12" fontWeight="500">
                    Email cannot be empty.
                  </FormHelperText>
                ) : (
                  ""
                )}
              </FormControl>
              <FormControl mt={3} isInvalid={errors.password ? true : false}>
                <FormLabel fontSize="14" fontWeight="600">
                  Password
                </FormLabel>
                <Input
                  placeholder="Enter password"
                  fontSize="14"
                  borderRadius="5"
                  type="password"
                  {...register("password", { required: true })}
                />
                {errors.password ? (
                  <FormHelperText color="red" fontSize="12" fontWeight="500">
                    Password cannot be empty.
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
                  value={role[roleSelected]}
                  onChange={(e) => setRoleSelected(parseInt(e.target.value))}
                >
                  {role.map((r, index) => (
                    <option key={index} value={r.id}>
                      {r.role}
                    </option>
                  ))}
                </Select>
              </FormControl>
              <Flex alignItems="center" justifyContent="flex-end" mt={6} mb={3}>
                <Button
                  variant="ghost"
                  mr={1}
                  onClick={modelOnClose}
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
                  isLoading={registerLoading}
                >
                  Add
                </Button>
              </Flex>
            </form>
          </ModalBody>
        </ModalContent>
      </Modal>

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
        {user.role.role !== "Employee" && (
          <Flex
            width="100%"
            mt={4}
            alignItems="center"
            justifyContent="flex-end"
          >
            <Button
              fontSize="14"
              fontWeight="500"
              leftIcon={<Icon as={BiPlus} />}
              onClick={() => modelOnOpen()}
            >
              Add Member
            </Button>
          </Flex>
        )}
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

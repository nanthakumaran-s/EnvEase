/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState } from "react";
// import useAxios from "../hooks/useAxios";
import SidebarWithHeader from "../components/SidebarWithHeader";
import BreadCrumbBar from "../components/BreadCrumbBar";
import {
  Box,
  Button,
  Flex,
  FormControl,
  FormHelperText,
  FormLabel,
  Heading,
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
import { TiArrowSortedDown } from "react-icons/ti";
import ReactDataGrid from "@inovua/reactdatagrid-community";
import "@inovua/reactdatagrid-community/base.css";
import "@inovua/reactdatagrid-community/theme/default-light.css";

import { gridStyle, headerProps } from "../utils/constants";
import { HiOutlinePencil } from "react-icons/hi";
import {
  FiDownloadCloud,
  FiEye,
  FiEyeOff,
  FiTrash2,
  FiUploadCloud,
} from "react-icons/fi";
import { BiPlus } from "react-icons/bi";
import { PiCheckBold } from "react-icons/pi";
import { useForm } from "react-hook-form";

const Dashboard = () => {
  // const [data, error, loading, trigger] = useAxios("GET", "/user", {});

  //   useEffect(() => {
  //     console.log(data);
  //   }, [data]);

  //   useEffect(() => {
  //     trigger();
  //   }, []);

  const [dataForGrid, setDataForGrid] = useState([
    {
      id: 1,
      key: "MONGO_URI",
      value: "Some value",
      toShow: false,
    },
    {
      id: 2,
      key: "MONGO_URI",
      value: "Some valu",
      toShow: false,
    },
    {
      id: 3,
      key: "MONGO_URI",
      value: "Some valu",
      toShow: false,
    },
    {
      id: 4,
      key: "MONGO_URI",
      value: "Some valu",
      toShow: false,
    },
    {
      id: 5,
      key: "MONGO_URI",
      value: "Some valu",
      toShow: false,
    },
    {
      id: 6,
      key: "MONGO_URI",
      value: "Some valu",
      toShow: false,
    },
    {
      id: 7,
      key: "MONGO_URI",
      value: "Some valu",
      toShow: false,
    },
    {
      id: 8,
      key: "MONGO_URI",
      value: "Some valu",
      toShow: false,
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
      name: "key",
      header: "Key",
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
      name: "value",
      header: "Value",
      flex: 1,
      minWidth: 400,
      render: ({ data }) => {
        return (
          <Text
            fontSize="14"
            fontWeight="600"
            letterSpacing={!data.toShow ? "widest" : "normal"}
          >
            {data.toShow ? data.value : "*".repeat(data.value.length)}
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
            <Tooltip
              label={data.toShow ? "Unreveal" : "Reveal"}
              placement="top"
              hasArrow
            >
              <IconButton
                icon={<Icon as={data.toShow ? FiEyeOff : FiEye} />}
                color="black"
                bg="transparent"
                _hover={{
                  color: "orange.600",
                }}
                onClick={() => {
                  setDataForGrid(
                    dataForGrid.map((obj) => {
                      if (obj.id === data.id) {
                        obj.toShow = !obj.toShow;
                        console.log(obj);
                      }
                      return obj;
                    })
                  );
                }}
              />
            </Tooltip>
            <Tooltip label="Edit" placement="top" hasArrow>
              <IconButton
                icon={<Icon as={HiOutlinePencil} />}
                color="black"
                bg="transparent"
                _hover={{
                  color: "blue.500",
                }}
                onClick={() => {
                  setIsUpdate(true);
                  setIdToUpdate(data.id);
                  setValue("key", data.key);
                  setValue("value", data.value);
                  onOpen();
                }}
              />
            </Tooltip>
            <Tooltip label="Delete" placement="top" hasArrow>
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
  const [idToUpdate, setIdToUpdate] = useState(-1);
  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    reset,
  } = useForm();

  const onModelSubmit = async (data) => {
    console.log(data);
  };

  const [revealAll, setRevealAll] = useState(false);

  useEffect(() => {
    setDataForGrid(
      dataForGrid.map((obj) => {
        obj.toShow = revealAll;
        return obj;
      })
    );
  }, [revealAll]);

  return (
    <SidebarWithHeader>
      <Modal
        isOpen={isOpen}
        onClose={onClose}
        isCentered
        onCloseComplete={() => {
          reset();
          setIsUpdate(false);
          setIdToUpdate(-1);
        }}
      >
        <ModalOverlay />
        <ModalContent borderRadius="3">
          <ModalHeader fontSize="18">
            {isUpdate ? "Update secret" : "Add new secret"}
          </ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <form onSubmit={handleSubmit(onModelSubmit)}>
              <FormControl isInvalid={errors.key ? true : false}>
                <FormLabel fontSize="14" fontWeight="600">
                  Key
                </FormLabel>
                <Input
                  placeholder="Enter key"
                  fontSize="14"
                  borderRadius="5"
                  type="text"
                  {...register("key", { required: true })}
                />
                {errors.key ? (
                  <FormHelperText color="red" fontSize="12" fontWeight="500">
                    Key cannot be empty.
                  </FormHelperText>
                ) : (
                  ""
                )}
              </FormControl>
              <FormControl mt={3} isInvalid={errors.value ? true : false}>
                <FormLabel fontSize="14" fontWeight="600">
                  Value
                </FormLabel>
                <Input
                  placeholder="Enter value"
                  fontSize="14"
                  borderRadius="5"
                  type="text"
                  {...register("value", { required: true })}
                />
                {errors.value ? (
                  <FormHelperText color="red" fontSize="12" fontWeight="500">
                    Key cannot be empty.
                  </FormHelperText>
                ) : (
                  ""
                )}
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
                  {isUpdate ? "Update" : "Add"}
                </Button>
              </Flex>
            </form>
          </ModalBody>
        </ModalContent>
      </Modal>

      <BreadCrumbBar section="Secrets" />
      <Flex mt={4} alignItems="center" justifyContent="space-between">
        <Heading fontSize="24">Secrets</Heading>
        <Select
          width="200px"
          iconColor="blackAlpha.700"
          iconSize="18"
          variant="filled"
          icon={<TiArrowSortedDown />}
          cursor="pointer"
          fontSize="14"
          fontWeight="500"
        >
          <option value="Development">Development</option>
          <option value="Testing">Testing</option>
          <option value="Production">Production</option>
        </Select>
      </Flex>

      <Flex
        width="100%"
        alignItems="center"
        justifyContent="flex-end"
        mt={3}
        gap="3"
      >
        <Tooltip
          label={revealAll ? "Unreveal all" : "Reveal all"}
          placement="top"
          hasArrow
        >
          <IconButton
            icon={<Icon as={revealAll ? FiEyeOff : FiEye} />}
            color="blackAlpha"
            onClick={() => setRevealAll(!revealAll)}
          />
        </Tooltip>
        <Tooltip label="Download .env" placement="top" hasArrow>
          <IconButton icon={<Icon as={FiDownloadCloud} />} color="blackAlpha" />
        </Tooltip>
        <Button
          fontSize="14"
          fontWeight="500"
          leftIcon={<Icon as={BiPlus} />}
          onClick={onOpen}
        >
          Add secret
        </Button>
        <Button
          fontSize="14"
          fontWeight="500"
          leftIcon={<Icon as={PiCheckBold} />}
          colorScheme="green"
          isDisabled
        >
          Save changes
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
      <Box
        border="2px"
        borderStyle="dashed"
        borderColor="border"
        mt="6"
        display="flex"
        alignItems="center"
        justifyContent="center"
        py="8"
        gap="3"
        borderRadius="3"
        position="relative"
      >
        <Icon as={FiUploadCloud} fontSize="30" color="blackAlpha.600" />
        <Text fontSize="16" fontWeight="500" color="blackAlpha.600">
          Drag and drop .env files to upload
        </Text>
        <Input
          type="file"
          height="100%"
          width="100%"
          position="absolute"
          top="0"
          left="0"
          opacity="0"
          aria-hidden="true"
          accept=".env"
        />
      </Box>
    </SidebarWithHeader>
  );
};

export default Dashboard;

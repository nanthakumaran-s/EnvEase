/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState } from "react";
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
import { useForm } from "react-hook-form";
import { useRecoilValue } from "recoil";
import { currentProjectAtom, projectsAtom } from "../state/projects.atom";
import useAxios from "../hooks/useAxios";
import useCustomToast from "../hooks/useCustomToast";

const type = ["Development", "Testing", "Production"];

const Dashboard = () => {
  const { data, error, loading, trigger, remove } = useAxios("GET", "/env");
  const {
    data: addData,
    error: addError,
    loading: addLoading,
    trigger: addTrigger,
    remove: addRemove,
  } = useAxios("POST", "/env");
  const {
    data: updateData,
    error: updateError,
    loading: updateLoading,
    trigger: updateTrigger,
    remove: updateRemove,
  } = useAxios("PATCH", "/env");
  const {
    data: deleteData,
    error: deleteError,
    loading: deleteLoading,
    trigger: deleteTrigger,
    remove: deleteRemove,
  } = useAxios("DELETE", "/env");

  const projects = useRecoilValue(projectsAtom);
  const currentProject = useRecoilValue(currentProjectAtom);
  const [selectedType, setSelectedType] = useState(type[0]);

  useEffect(() => {
    if (projects.length > 0) {
      trigger({
        projectId: projects[currentProject].id,
        type: selectedType,
      });
    }
  }, [selectedType]);

  useEffect(() => {
    if (data) {
      setDataForGrid(
        data.envs.map((e, i) => ({ ...e, refId: i + 1, toShow: false }))
      );
      remove();
    }

    if (addData) {
      trigger({
        projectId: projects[currentProject].id,
        type: selectedType,
      });
      addRemove();
      onClose();
    }

    if (updateData) {
      trigger({
        projectId: projects[currentProject].id,
        type: selectedType,
      });
      updateRemove();
      onClose();
    }

    if (deleteData) {
      trigger({
        projectId: projects[currentProject].id,
        type: selectedType,
      });
      deleteRemove();
    }
  }, [data, addData, updateData, deleteData]);

  const { loadingToast, errorToast, closeAll } = useCustomToast();

  useEffect(() => {
    if (error || addError || updateError || deleteError) {
      errorToast("Some error occurred. Please try again later.");
    }
  }, [error, addError, updateError, deleteError]);

  useEffect(() => {
    if (loading || deleteLoading) {
      loadingToast();
    }

    if (!loading && !deleteLoading) {
      closeAll();
    }
  }, [loading, deleteLoading]);

  useEffect(() => {
    if (projects.length > 0) {
      trigger({
        projectId: projects[currentProject].id,
        type: type[0],
      });
    }
  }, [projects]);

  const [dataForGrid, setDataForGrid] = useState([]);

  const parse = async (event) => {
    const fileReader = new FileReader();
    fileReader.readAsText(event.target.files[0], "UTF-8");
    fileReader.onload = async (e) => {
      let content = e.target.result;
      content = content.toString().split("\n");
      const envs = [];
      for (let i = 0; i < content.length; i++) {
        const obj = {};
        const keyValuePair = content[i].split("=");
        if (
          keyValuePair[0] === "" ||
          keyValuePair[0] === undefined ||
          keyValuePair[1] === undefined
        ) {
          continue;
        }
        obj["key"] = keyValuePair[0];
        obj["value"] = keyValuePair[1];
        envs.push(obj);
      }
      for (let i = 0; i < envs.length; i++) {
        if (envs[i].key === "" || envs[i].value === "") {
          return;
        }
        addTrigger({
          key: envs[i].key,
          value: envs[i].value,
          projectId: projects[currentProject].id,
          type: selectedType,
        });
      }
    };
    event.target.value = null;
  };

  const download = async () => {
    let content = "";
    for (let i = 0; i < dataForGrid.length; i++) {
      content += `${dataForGrid[i].key}=${dataForGrid[i].value}\n`;
    }
    const blob = new Blob([content], { type: "text/document" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.download = "env";
    link.href = url;
    link.click();
  };

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
                onClick={() => {
                  deleteTrigger({
                    id: data.id,
                  });
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
            <form
              onSubmit={handleSubmit((data) => {
                if (isUpdate) {
                  updateTrigger({
                    id: idToUpdate,
                    value: data.value,
                    projectId: projects[currentProject].id,
                  });
                } else {
                  addTrigger({
                    key: data.key,
                    value: data.value,
                    projectId: projects[currentProject].id,
                    type: selectedType,
                  });
                }
              })}
            >
              <FormControl isInvalid={errors.key ? true : false}>
                <FormLabel fontSize="14" fontWeight="600">
                  Key
                </FormLabel>
                <Input
                  placeholder="Enter key"
                  fontSize="14"
                  borderRadius="5"
                  type="text"
                  isDisabled={isUpdate}
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
                  isLoading={addLoading || updateLoading}
                >
                  {isUpdate ? "Update" : "Add"}
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
            sections={[projects[currentProject].name, "Secrets"]}
          />
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
              value={selectedType}
              onChange={(e) => setSelectedType(e.target.value)}
            >
              {type.map((t, i) => (
                <option key={i} value={t}>
                  {t}
                </option>
              ))}
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
              <IconButton
                icon={<Icon as={FiDownloadCloud} />}
                color="blackAlpha"
                onClick={download}
              />
            </Tooltip>
            <Button
              fontSize="14"
              fontWeight="500"
              leftIcon={<Icon as={BiPlus} />}
              onClick={onOpen}
            >
              Add secret
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
              multiple={false}
              onChange={parse}
              isDisabled={addLoading}
            />
          </Box>
        </React.Fragment>
      )}
    </SidebarWithHeader>
  );
};

export default Dashboard;

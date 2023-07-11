/* eslint-disable react-hooks/exhaustive-deps */
import {
  Box,
  Button,
  CloseButton,
  Flex,
  FormControl,
  FormHelperText,
  FormLabel,
  Icon,
  Image,
  Input,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalHeader,
  ModalOverlay,
  Text,
  useDisclosure,
} from "@chakra-ui/react";
import React, { useEffect, useState } from "react";
import {
  PiCheckBold,
  PiGearDuotone,
  PiLockKeyDuotone,
  PiUsersThreeDuotone,
} from "react-icons/pi";
import { TiArrowSortedDown, TiArrowSortedUp } from "react-icons/ti";
import { Link, useLocation } from "react-router-dom";
import { useRecoilState, useRecoilValue, useSetRecoilState } from "recoil";
import { userAccess, userAtom } from "../state/user.atom";
import { currentProjectAtom, projectsAtom } from "../state/projects.atom";
import useAxios from "../hooks/useAxios";
import useCustomToast from "../hooks/useCustomToast";
import { useForm } from "react-hook-form";

const LinkItems = [
  { name: "Secrets", icon: PiLockKeyDuotone, link: "/dashboard" },
  { name: "Members", icon: PiUsersThreeDuotone, link: "/members" },
  { name: "Settings", icon: PiGearDuotone, link: "/settings" },
];

export const SidebarContent = ({ onClose, ...rest }) => {
  const [show, setShow] = useState(false);

  const user = useRecoilValue(userAtom);
  const [projects, setProjects] = useRecoilState(projectsAtom);
  const [currentProject, setCurrentProject] =
    useRecoilState(currentProjectAtom);
  const setAccess = useSetRecoilState(userAccess);

  const { data, error, loading, trigger, remove } = useAxios(
    "GET",
    "/project/projects"
  );

  const {
    data: createProjectData,
    error: createProjectError,
    loading: createProjectLoading,
    trigger: createProjectTrigger,
    remove: createProjectRemove,
  } = useAxios("POST", "/project");

  const { loadingToast, closeAll, errorToast } = useCustomToast();

  useEffect(() => {
    if (data) {
      setProjects(data.projects);
      if (data.projects.length > 0) {
        setAccess(data.projects[0].access);
      }
      remove();
    }

    if (createProjectData) {
      trigger();
      createProjectRemove();
      modelOnClose();
    }
  }, [data, createProjectData]);

  useEffect(() => {
    trigger();
  }, []);

  useEffect(() => {
    if (loading || createProjectLoading) {
      loadingToast();
    }

    if (!loading && !createProjectLoading) {
      closeAll();
    }
  }, [loading, createProjectLoading]);

  useEffect(() => {
    if (error) {
      errorToast("Some error occurred. Please try again later.");
    }

    if (createProjectError) {
      errorToast("Some error occurred. Please try again later.");
    }
  }, [error, createProjectError]);

  const { onClose: modelOnClose, onOpen, isOpen } = useDisclosure();

  const {
    reset,
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  return (
    <Box {...rest}>
      <Modal
        isOpen={isOpen}
        onClose={modelOnClose}
        isCentered
        onCloseComplete={() => {
          reset();
        }}
      >
        <ModalOverlay />
        <ModalContent borderRadius="3">
          <ModalHeader fontSize="18">Add new project</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <form
              onSubmit={handleSubmit((data) => {
                createProjectTrigger({
                  name: data.name,
                });
              })}
            >
              <FormControl isInvalid={errors.key ? true : false}>
                <FormLabel fontSize="14" fontWeight="600">
                  Project name
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
                >
                  Add
                </Button>
              </Flex>
            </form>
          </ModalBody>
        </ModalContent>
      </Modal>
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
                {projects.length === 0 ? "---" : projects[currentProject].name}
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
                {projects.map((project, index) => (
                  <Flex
                    alignItems="center"
                    gap="3"
                    pl="5"
                    py="3"
                    _hover={{ bg: "blackAlpha.50" }}
                    cursor="pointer"
                    key={index}
                    onClick={() => {
                      setCurrentProject(index);
                      setAccess(project.access);
                    }}
                  >
                    <Icon
                      as={PiCheckBold}
                      fontSize="16"
                      color="green"
                      visibility={index !== currentProject ? "hidden" : ""}
                    />
                    <Text fontSize="14" fontWeight="500">
                      {project.name}
                    </Text>
                  </Flex>
                ))}
              </Flex>
            )}
          </Flex>
          {LinkItems.map((link) => (
            <NavItem key={link.name} icon={link.icon} link={link.link}>
              {link.name}
            </NavItem>
          ))}
        </Flex>
        {user.role.role !== "Employee" && (
          <Flex>
            <Button
              m="4"
              mt={{ base: 0, md: 5 }}
              bg="blackAlpha.100"
              _hover={{ bg: "blackAlpha.200" }}
              fontSize="15"
              color="blackAlpha.700"
              width="100%"
              onClick={onOpen}
            >
              Add Project
            </Button>
          </Flex>
        )}
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

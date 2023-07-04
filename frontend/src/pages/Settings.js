import React from "react";
import SidebarWithHeader from "../components/SidebarWithHeader";
import BreadCrumbBar from "../components/BreadCrumbBar";
import { Flex, Heading, Highlight, Text } from "@chakra-ui/layout";
import { FormControl, FormLabel } from "@chakra-ui/form-control";
import { Input } from "@chakra-ui/input";
import { Button } from "@chakra-ui/button";
import CopyToClipboard from "../components/CopyToClipboard";

const Settings = () => {
  return (
    <SidebarWithHeader>
      <BreadCrumbBar sections={["Some Project", "Settings"]} />
      <Flex mt={4} alignItems="center" justifyContent="space-between">
        <Heading fontSize="24">Settings</Heading>
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
        <FormControl>
          <FormLabel fontSize="18" fontWeight="600">
            Project Name
          </FormLabel>
          <Flex gap="2">
            <Input
              borderRadius="3"
              placeholder="Enter project name"
              fontSize="15"
              value="Some Proj"
              isDisabled
            />
            <Button
              colorScheme="brand"
              borderRadius="3"
              width="150px"
              fontSize="15"
              isDisabled
            >
              Save
            </Button>
          </Flex>
        </FormControl>
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
          Project API Key
        </Text>
        <Flex
          mt={3}
          bg="blackAlpha.50"
          py="2"
          borderRadius="5"
          alignItems="center"
          gap="12"
        >
          <Flex fontSize="15" ml="3" gap="2">
            <Text fontWeight="700" color="blackAlpha.800">
              API Key:
            </Text>
            <Text fontWeight="500" color="blackAlpha.600">
              E*ksjdvsbvksninkreumBJHB
            </Text>
          </Flex>
          <CopyToClipboard text="E*ksjdvsbvksninkreumBJHB" />
        </Flex>
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
        border="1px"
        borderColor="brand.500"
        boxShadow="sm"
      >
        <Text fontSize="18" fontWeight="600" color="brand.500">
          Danger Zone
        </Text>
        <Text mt="3" fontSize="15">
          <Highlight
            query="Some project"
            styles={{
              color: "brand.600",
              fontWeight: "700",
            }}
          >
            Enter Some project to delete this project
          </Highlight>
        </Text>
        <Flex gap="2" width="100%" mt="3" mb="1">
          <Input
            borderRadius="3"
            placeholder="Enter the project name"
            fontSize="15"
          />
          <Button
            colorScheme="brand"
            borderRadius="3"
            width="150px"
            fontSize="15"
            isDisabled
          >
            Delete
          </Button>
        </Flex>
      </Flex>
    </SidebarWithHeader>
  );
};

export default Settings;

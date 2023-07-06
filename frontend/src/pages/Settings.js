/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState } from "react";
import SidebarWithHeader from "../components/SidebarWithHeader";
import BreadCrumbBar from "../components/BreadCrumbBar";
import { Flex, Heading, Highlight, Text } from "@chakra-ui/layout";
import { Input } from "@chakra-ui/input";
import { Button } from "@chakra-ui/button";
import CopyToClipboard from "../components/CopyToClipboard";
import { useRecoilValue } from "recoil";
import { currentProjectAtom, projectsAtom } from "../state/projects.atom";
import useAxios from "../hooks/useAxios";
import { userAtom } from "../state/user.atom";
import useCustomToast from "../hooks/useCustomToast";
import { useNavigate } from "react-router-dom";

const Settings = () => {
  const user = useRecoilValue(userAtom);
  const projects = useRecoilValue(projectsAtom);
  const currentProject = useRecoilValue(currentProjectAtom);

  const [value, setValue] = useState("");

  const { data, error, loading, trigger } = useAxios("DELETE", "/project");
  const { loadingToast, errorToast, closeAll } = useCustomToast();

  const navigate = useNavigate();

  useEffect(() => {
    if (data) {
      navigate("/dashboard");
    }
  }, [data]);

  useEffect(() => {
    if (loading) {
      loadingToast();
    }

    if (!loading) {
      closeAll();
    }
  }, [loading]);

  useEffect(() => {
    if (error) {
      errorToast("Some error occurred. Please try again later.");
    }
  }, [error]);

  return (
    <SidebarWithHeader>
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
            sections={[projects[currentProject].name, "Settings"]}
          />
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
                  {projects[currentProject].apiKey}
                </Text>
              </Flex>
              <CopyToClipboard text={projects[currentProject].apiKey} />
            </Flex>
          </Flex>

          {user.role.role !== "Employee" && (
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
                  query={projects[currentProject].name}
                  styles={{
                    color: "brand.600",
                    fontWeight: "700",
                  }}
                >
                  {`Enter ${projects[currentProject].name} to delete this project`}
                </Highlight>
              </Text>
              <Flex gap="2" width="100%" mt="3" mb="1">
                <Input
                  borderRadius="3"
                  placeholder="Enter the project name"
                  fontSize="15"
                  value={value}
                  onChange={(e) => setValue(e.target.value)}
                />
                <Button
                  colorScheme="brand"
                  borderRadius="3"
                  width="150px"
                  fontSize="15"
                  isDisabled={value !== projects[currentProject].name}
                  isLoading={loading}
                  onClick={() => {
                    trigger({
                      projectId: projects[currentProject].id,
                    });
                  }}
                >
                  Delete
                </Button>
              </Flex>
            </Flex>
          )}
        </React.Fragment>
      )}
    </SidebarWithHeader>
  );
};

export default Settings;

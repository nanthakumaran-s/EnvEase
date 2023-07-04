/* eslint-disable react-hooks/exhaustive-deps */
import {
  Badge,
  Box,
  Flex,
  Icon,
  IconButton,
  Text,
  Tooltip,
} from "@chakra-ui/react";
import ReactDataGrid from "@inovua/reactdatagrid-community";
import React, { useEffect, useState } from "react";
import { headerProps, gridStyle } from "../../utils/constants";
import { FiRefreshCw, FiTrash2 } from "react-icons/fi";
import useAxios from "../../hooks/useAxios";
import moment from "moment";
import useCustomToast from "../../hooks/useCustomToast";

const SessionSection = () => {
  const { loadingToast, errorToast, closeAll } = useCustomToast();
  const {
    data: sessionData,
    loading: sessionLoading,
    trigger: sessionTrigger,
  } = useAxios("GET", "/session");

  const {
    data: revokeData,
    loading: revokeLoading,
    trigger: revokeTrigger,
    remove: revokedRemove,
  } = useAxios("PATCH", "/session/revoke");

  const {
    data: deleteData,
    loading: deleteLoading,
    trigger: deleteTrigger,
    remove: deleteRemove,
  } = useAxios("DELETE", "/session");

  const handleRevoke = async (token) => {
    revokeTrigger({
      token,
    });
  };

  const handleDelete = async (token) => {
    deleteTrigger({
      token,
    });
  };

  useEffect(() => {
    if (sessionLoading || revokeLoading || deleteLoading) {
      loadingToast();
    }

    if (!sessionLoading && !revokeLoading && !deleteLoading) {
      closeAll();
    }
  }, [sessionLoading, revokeLoading, deleteLoading]);

  useEffect(() => {
    if (sessionData) {
      setDataForGrid(
        sessionData.sessions.map((session, ind) => ({
          ...session,
          refId: ind + 1,
        }))
      );
    }

    if (revokeData) {
      if (revokeData.status === true) {
        sessionTrigger();
        revokedRemove();
      } else {
        errorToast(
          "Some error occured while revoking session. Try again later!"
        );
      }
    }

    if (deleteData) {
      if (deleteData.status === true) {
        sessionTrigger();
        deleteRemove();
      } else {
        errorToast(
          "Some error occured while revoking session. Try again later!"
        );
      }
    }
  }, [sessionData, revokeData, deleteData]);

  useEffect(() => {
    sessionTrigger();
  }, []);

  const [dataForGrid, setDataForGrid] = useState([]);
  const tokens = JSON.parse(localStorage.getItem("tokens"));

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
      name: "device",
      header: "Device",
      minWidth: 100,
      render: ({ data }) => {
        return (
          <Flex alignItems="center" gap="3">
            <Text fontSize="14" fontWeight="600">
              {data.device}
            </Text>
            {data.token === tokens.refreshToken ? (
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
      name: "addedTime",
      header: "Added At",
      minWidth: 200,
      render: ({ value }) => {
        return (
          <Text fontSize="14" fontWeight="600">
            {moment(value).format("DD MMM YYYY")}
          </Text>
        );
      },
      headerProps,
    },
    {
      name: "expiryTime",
      header: "Expiry Time",
      minWidth: 200,
      render: ({ value }) => {
        return (
          <Text fontSize="14" fontWeight="600">
            {moment(value).format("DD MMM YYYY")}
          </Text>
        );
      },
      headerProps,
    },
    {
      name: "isRevoked",
      header: "Status",
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
                onClick={() => handleRevoke(data.token)}
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
                onClick={() => handleDelete(data.token)}
              />
            </Tooltip>
          </Flex>
        );
      },
    },
  ];

  return (
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
  );
};

export default SessionSection;

/* eslint-disable react-hooks/exhaustive-deps */
import React from "react";
import useAxios from "../hooks/useAxios";
import SidebarWithHeader from "../components/SidebarWithHeader";
import BreadCrumbBar from "../components/BreadCrumbBar";
import {
  Flex,
  Heading,
  Select,
  Table,
  TableContainer,
  Tbody,
  Td,
  Text,
  Th,
  Thead,
  Tr,
} from "@chakra-ui/react";
import { TiArrowSortedDown } from "react-icons/ti";

const Dashboard = () => {
  const [data, error, loading, trigger] = useAxios("GET", "/user", {});

  //   useEffect(() => {
  //     console.log(data);
  //   }, [data]);

  //   useEffect(() => {
  //     trigger();
  //   }, []);

  if (loading) {
    return <p>Loading...</p>;
  }

  return (
    <SidebarWithHeader>
      <BreadCrumbBar />
      <Flex mt="6" alignItems="center" justifyContent="space-between">
        <Heading fontSize="24">Secrets</Heading>
        <Select
          width="200px"
          iconColor="blackAlpha.700"
          iconSize="18"
          variant="filled"
          icon={<TiArrowSortedDown />}
          cursor="pointer"
        >
          <option value="Development">Development</option>
          <option value="Testing">Testing</option>
          <option value="Production">Production</option>
        </Select>
      </Flex>
      <TableContainer mt="5" borderRadius="8" boxShadow="sm">
        <Table variant="simple" bg="white" colorScheme="blackAlpha">
          <Thead>
            <Tr>
              <Th width="50px"></Th>
              <Th width="300px">Key</Th>
              <Th>Value</Th>
            </Tr>
          </Thead>
          <Tbody>
            <Tr>
              <Td>1</Td>
              <Td>
                <Text fontSize="15">MONGO_URI</Text>
              </Td>
              <Td>
                <Text fontSize="15">Some</Text>
              </Td>
            </Tr>
          </Tbody>
        </Table>
      </TableContainer>
    </SidebarWithHeader>
  );
};

export default Dashboard;

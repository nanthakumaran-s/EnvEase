/* eslint-disable react-hooks/exhaustive-deps */
import { Checkbox, Flex, Text } from "@chakra-ui/react";
import React, { useEffect, useState } from "react";
import { userAtom } from "../../state/user.atom";
import useAxios from "../../hooks/useAxios";
import { useRecoilState } from "recoil";
import useCustomToast from "../../hooks/useCustomToast";

const TwoFactor = () => {
  const [user, setUser] = useRecoilState(userAtom);
  const [state, setState] = useState(user.twoFactor);

  useEffect(() => {
    setState(user.twoFactor);
  }, [user]);

  const { data, error, loading, trigger } = useAxios(
    "PATCH",
    "/user/two-factor"
  );

  const { successToast, errorToast } = useCustomToast();

  useEffect(() => {
    if (data) {
      if (data.status === true) {
        successToast("Updated successfully.");
        setUser({
          ...user,
          twoFactor: !state,
        });
        setState(!state);
      } else {
        errorToast("Update failed. Please try again later.");
      }
    }
  }, [data]);

  useEffect(() => {
    if (error) {
      errorToast("Some error occurred. Please try again later.");
    }
  }, [error]);

  const handleClick = () => {
    trigger({
      twoFactor: !state,
    });
  };

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
        Two Step Vertification
      </Text>
      <Checkbox
        isChecked={state}
        mt="3"
        fontSize="15"
        borderColor="border"
        colorScheme="brand"
        isDisabled={loading}
        onChange={handleClick}
      >
        Enable
      </Checkbox>
    </Flex>
  );
};

export default TwoFactor;

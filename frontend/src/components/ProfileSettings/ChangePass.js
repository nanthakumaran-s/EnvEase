/* eslint-disable react-hooks/exhaustive-deps */
import {
  Button,
  Flex,
  FormControl,
  FormHelperText,
  FormLabel,
  Input,
  Text,
} from "@chakra-ui/react";
import React, { useEffect } from "react";
import { useForm } from "react-hook-form";
import useAxios from "../../hooks/useAxios";
import useCustomToast from "../../hooks/useCustomToast";

const ChangePass = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm();

  const { data, error, loading, trigger } = useAxios(
    "PATCH",
    "/user/change-password"
  );

  const { successToast, errorToast } = useCustomToast();

  useEffect(() => {
    if (data) {
      if (data.status === true) {
        successToast("Password changed successfully.");
        reset();
      } else {
        errorToast("Password change failed. Please try again later.");
      }
    }
  }, [data]);

  useEffect(() => {
    if (error) {
      errorToast("Some error occurred. Please try again later.");
    }
  }, [error]);

  const onSubmit = async (data) => {
    trigger({
      ...data,
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
        Change Password
      </Text>
      <form
        style={{ width: "100%", marginTop: "12px" }}
        onSubmit={handleSubmit(onSubmit)}
      >
        <Flex width="100%" alignItems="center" justifyContent="center" gap="3">
          <FormControl isInvalid={errors.oldPassword ? true : false}>
            <FormLabel fontSize="15">Old password</FormLabel>
            <Input
              placeholder="Old password"
              type="password"
              fontSize="14"
              {...register("oldPassword", { required: true })}
            />
            {errors.oldPassword ? (
              <FormHelperText color="red" fontSize="12" fontWeight="500">
                Field is required.
              </FormHelperText>
            ) : (
              ""
            )}
          </FormControl>
          <FormControl isInvalid={errors.newPassword ? true : false}>
            <FormLabel fontSize="15">New password</FormLabel>
            <Input
              placeholder="New password"
              type="password"
              fontSize="14"
              {...register("newPassword", { required: true })}
            />
            {errors.newPassword ? (
              <FormHelperText color="red" fontSize="12" fontWeight="500">
                Field is required.
              </FormHelperText>
            ) : (
              ""
            )}
          </FormControl>
        </Flex>
        <Button
          colorScheme="brand"
          borderRadius="5"
          fontSize="15"
          width="150px"
          mt="5"
          type="submit"
          isLoading={loading}
        >
          Change
        </Button>
      </form>
    </Flex>
  );
};

export default ChangePass;

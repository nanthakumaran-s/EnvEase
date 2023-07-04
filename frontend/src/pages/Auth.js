import {
  Alert,
  AlertIcon,
  Button,
  Flex,
  FormControl,
  FormHelperText,
  FormLabel,
  Heading,
  IconButton,
  Image,
  Input,
  InputGroup,
  InputRightElement,
  Text,
} from "@chakra-ui/react";
import React, { useEffect, useState } from "react";
import { PiEye, PiEyeClosed } from "react-icons/pi";
import { AiOutlineCloseCircle } from "react-icons/ai";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import useAxios from "../hooks/useAxios";

const Auth = () => {
  const [show, setShow] = useState(false);
  const handleClick = () => setShow(!show);

  const [error, setError] = useState({
    status: false,
    message: "",
  });

  const navigate = useNavigate();
  const {
    data: resData,
    error: resErr,
    loading,
    trigger,
  } = useAxios("POST", "/auth/login");

  useEffect(() => {
    if (resData != null) {
      if (resData.status === true) {
        localStorage.setItem("tokens", JSON.stringify(resData.user.tokens));
        navigate("/dashboard");
        return;
      }

      if (resData.status === false) {
        setError({
          status: true,
          message: "There was an error processing your request",
        });
        return;
      }
    }
  }, [resData, navigate]);

  useEffect(() => {
    if (resErr != null) {
      setError({
        status: true,
        message: resErr.response
          ? resErr.response.data.message
          : "There was an error processing your request",
      });
      return;
    }
  }, [resErr]);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();
  const onSubmit = async (data) => {
    setError({
      status: false,
      message: "",
    });
    trigger({
      email: data.email,
      password: data.password,
      device: "Web",
    });
  };

  return (
    <Flex
      width="100%"
      height="100vh"
      flexDir="column"
      alignItems="center"
      justifyContent="space-between"
      py="10"
      bg="bg"
    >
      <Flex flexDirection="column">
        <Flex alignItems="center" justifyContent="center">
          <Image src={"/extendedLogoTransparent.png"} height="14" />
        </Flex>
        <Flex
          width="700px"
          alignItems="center"
          justifyContent="center"
          mt="7"
          border="1px"
          borderColor="border"
          bg="white"
          height="528px"
          borderRadius="3"
        >
          <Flex
            width="50%"
            height="100%"
            bg="secBg"
            alignItems="center"
            justifyContent="center"
          >
            <Image src={"/assets/authentication.svg"} width="70%" />
          </Flex>
          <Flex
            width="50%"
            height="100%"
            bg="white"
            flexDirection="column"
            px="7"
            py="10"
          >
            <Heading fontSize="24">Login</Heading>
            <form onSubmit={handleSubmit(onSubmit)}>
              <FormControl mt="8" isInvalid={errors.email ? true : false}>
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
                    Email is required.
                  </FormHelperText>
                ) : (
                  ""
                )}
              </FormControl>
              <FormControl mt="3" isInvalid={errors.password ? true : false}>
                <FormLabel fontSize="14" fontWeight="600">
                  Password
                </FormLabel>
                <InputGroup>
                  <Input
                    type={show ? "text" : "password"}
                    placeholder="Enter password"
                    fontSize="14"
                    borderRadius="5"
                    {...register("password", { required: true })}
                  />
                  <InputRightElement>
                    <IconButton size="sm" variant="ghost" onClick={handleClick}>
                      {show ? <PiEyeClosed size="20" /> : <PiEye size="20" />}
                    </IconButton>
                  </InputRightElement>
                </InputGroup>
                {errors.password ? (
                  <FormHelperText color="red" fontSize="12" fontWeight="500">
                    Password is required.
                  </FormHelperText>
                ) : (
                  ""
                )}
              </FormControl>
              {error.status && (
                <Alert status="error" mt="5" borderRadius="3" fontSize="14">
                  <AlertIcon children={<AiOutlineCloseCircle size="25" />} />
                  {error.message}
                </Alert>
              )}
              <Flex justifyContent="flex-end">
                <Button
                  colorScheme="brand"
                  fontSize="16"
                  mt="5"
                  borderRadius="3"
                  px="7"
                  py="6"
                  isLoading={loading}
                  type="submit"
                >
                  Submit
                </Button>
              </Flex>
            </form>
          </Flex>
        </Flex>
      </Flex>
      <Text fontSize="12" fontWeight="500">
        ©2023 EnvEase. All rights reserved.
      </Text>
    </Flex>
  );
};

export default Auth;

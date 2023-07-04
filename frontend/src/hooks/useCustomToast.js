import { useToast } from "@chakra-ui/react";

const useCustomToast = () => {
  const toast = useToast();

  const successToast = (desc, duration = 3000) => {
    return toast({
      title: "Success!!!",
      description: desc,
      status: "success",
      duration: duration,
      isClosable: true,
    });
  };

  const errorToast = (desc, duration = 3000) => {
    return toast({
      title: "Oops!!!",
      description: desc,
      status: "error",
      duration: duration,
      isClosable: true,
    });
  };

  const loadingToast = () => {
    return toast({
      title: "Loading...",
      description: "Hang on. Your request is in progress",
      status: "loading",
      isClosable: false,
    });
  };

  const close = (id) => {
    toast.close(id);
  };

  const closeAll = () => {
    toast.closeAll();
  };

  return {
    successToast,
    errorToast,
    loadingToast,
    close,
    closeAll,
  };
};

export default useCustomToast;

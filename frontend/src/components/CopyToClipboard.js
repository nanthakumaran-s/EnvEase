import { Icon, IconButton } from "@chakra-ui/react";
import React, { useEffect, useState } from "react";
import { FiCheck, FiCopy } from "react-icons/fi";

const CopyToClipboard = ({ text }) => {
  const [state, setState] = useState(false);

  useEffect(() => {
    if (state === true) {
      setTimeout(() => setState(false), 2000);
    }
  }, [state]);

  return (
    <IconButton
      icon={<Icon as={!state ? FiCopy : FiCheck} />}
      variant="ghost"
      color={!state ? "blackAlpha.600" : "green.600"}
      _hover={{
        color: "blackAlpha.900",
        bg: "border",
      }}
      onClick={() => {
        setState(true);
        navigator.clipboard.writeText(text);
      }}
      mr="2"
    />
  );
};

export default CopyToClipboard;

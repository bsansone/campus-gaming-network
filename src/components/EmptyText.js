// Libraries
import React from "react";
import { Text } from "@chakra-ui/react";

////////////////////////////////////////////////////////////////////////////////
// EmptyText

const EmptyText = ({ children, color, ...rest }) => {
  return (
    <Text color="gray.600" fontSize="xl" {...rest}>
      {children}
    </Text>
  );
};

export default EmptyText;

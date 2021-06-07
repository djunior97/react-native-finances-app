import React from "react";

import { Container, Category, Icon } from "./styles";

interface SelectTransactionTypeButtonProps {
  title: string;
  onPress: () => void;
}

export function SelectTransactionTypeButton({
  title,
  onPress,
}: SelectTransactionTypeButtonProps) {
  return (
    <Container onPress={onPress}>
      <Category>{title}</Category>
      <Icon name="chevron-down" />
    </Container>
  );
}

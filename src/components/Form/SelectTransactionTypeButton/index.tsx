import React from "react";

import { Container, Category, Icon } from "./styles";

interface SelectTransactionTypeButtonProps {
  title: string;
}

export function SelectTransactionTypeButton({
  title,
}: SelectTransactionTypeButtonProps) {
  return (
    <Container>
      <Category>{title}</Category>
      <Icon name="chevron-down" />
    </Container>
  );
}

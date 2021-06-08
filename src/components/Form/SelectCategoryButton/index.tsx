import React from "react";

import { Container, Category, Icon } from "./styles";

interface SelectCategoryButtonProps {
  title: string;
  onPress: () => void;
}

export function SelectCategoryButton({
  title,
  onPress,
}: SelectCategoryButtonProps) {
  return (
    <Container onPress={onPress}>
      <Category>{title}</Category>
      <Icon name="chevron-down" />
    </Container>
  );
}

import React from "react";

import { Container, Title, Amount } from "./styles";

interface HistoryCardProps {
  title: string;
  amount: string;
  color: string;
}

export function HistoryCard({ color, title, amount }: HistoryCardProps) {
  return (
    <Container color={color}>
      <Title>{title}</Title>
      <Amount>{amount}</Amount>
    </Container>
  );
}

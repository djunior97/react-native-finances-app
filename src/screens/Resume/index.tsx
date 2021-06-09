import React, { useEffect, useState } from "react";

import { HistoryCard } from "../../components/HistoryCard";

import { storage } from "../../utils";
import { categories } from "../../utils/categories";
import { TransactionProps } from "../Dashboard";

import { Container, Header, Title, Content } from "./styles";

interface CategoryData {
  name: string;
  total: string;
  color: string;
  key: string;
}

export function Resume() {
  const [totalByCategories, setTotalByCategories] = useState<CategoryData[]>(
    []
  );

  async function loadData() {
    const dataKey = "@gofinances:transactions";

    const response = await storage.getData(dataKey);
    const transactions = response ? response : [];

    const expenses = transactions.filter(
      (expense: TransactionProps) => expense.type === "negative"
    );

    const totalByCategory: CategoryData[] = [];

    categories.forEach((category) => {
      let categorySum = 0;

      expenses.forEach((expense: TransactionProps) => {
        if (expense.category === category.key) {
          categorySum += Number(expense.amount);
        }
      });

      if (categorySum > 0) {
        const total = categorySum.toLocaleString("pt-BR", {
          style: "currency",
          currency: "BRL",
        });

        totalByCategory.push({
          name: category.name,
          total,
          color: category.color,
          key: category.key,
        });
      }
    });

    setTotalByCategories(totalByCategory);
  }

  useEffect(() => {
    loadData();
  }, []);

  return (
    <Container>
      <Header>
        <Title>Resumo por categoria</Title>
      </Header>

      <Content>
        {totalByCategories.map((item) => (
          <HistoryCard
            key={item.key}
            title={item.name}
            amount={item.total}
            color={item.color}
          />
        ))}
      </Content>
    </Container>
  );
}

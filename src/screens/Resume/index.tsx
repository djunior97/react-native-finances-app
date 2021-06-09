import React, { useEffect, useState } from "react";
import { RFValue } from "react-native-responsive-fontsize";
import { VictoryPie } from "victory-native";
import { useTheme } from "styled-components";
import { useBottomTabBarHeight } from "@react-navigation/bottom-tabs";

import { HistoryCard } from "../../components/HistoryCard";

import { storage } from "../../utils";
import { categories } from "../../utils/categories";
import { TransactionProps } from "../Dashboard";

import {
  Container,
  Header,
  Title,
  Content,
  ChartContainer,
  HistoryCardList,
} from "./styles";

export interface CategoryData {
  name: string;
  total: number;
  formattedTotal: string;
  color: string;
  key: string;
  formattedPercent: string;
  percent: number;
}

export function Resume() {
  const [totalByCategories, setTotalByCategories] = useState<CategoryData[]>(
    []
  );

  const theme = useTheme();

  async function loadData() {
    const dataKey = "@gofinances:transactions";

    const response = await storage.getData(dataKey);
    const transactions = response ? response : [];

    const expenses = transactions.filter(
      (expense: TransactionProps) => expense.type === "negative"
    );

    const expensesTotal = expenses.reduce(
      (acc: number, expense: TransactionProps) => {
        return acc + Number(expense.amount);
      },
      0
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
        const formattedTotal = categorySum.toLocaleString("pt-BR", {
          style: "currency",
          currency: "BRL",
        });

        const percent = (categorySum / expensesTotal) * 100;
        const formattedPercent = `${percent.toFixed(0)}%`;

        totalByCategory.push({
          name: category.name,
          total: categorySum,
          formattedTotal,
          color: category.color,
          key: category.key,
          percent,
          formattedPercent,
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
        <ChartContainer>
          <VictoryPie
            data={totalByCategories}
            x="formattedPercent"
            y="total"
            colorScale={totalByCategories.map((category) => category.color)}
            style={{
              labels: {
                fontSize: RFValue(18),
                fontWeight: "bold",
                fill: theme.colors.shape,
              },
            }}
            labelRadius={75}
          />
        </ChartContainer>

        {/* {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((item) => (
          <HistoryCard
            key="{item.key}"
            title="{item.name}"
            amount="{item.formattedTotal}"
            color="{item.color}"
          />
        ))} */}
        <HistoryCardList
          data={totalByCategories}
          keyExtractor={(item) => item.key}
          renderItem={({ item }) => (
            <HistoryCard
              key={item.key}
              title={item.name}
              amount={item.formattedTotal}
              color={item.color}
            />
          )}
        />
      </Content>
    </Container>
  );
}

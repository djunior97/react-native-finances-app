import React, { useCallback, useEffect, useState } from "react";
import { ActivityIndicator } from "react-native";
import { RFValue } from "react-native-responsive-fontsize";
import { VictoryPie } from "victory-native";
import { useTheme } from "styled-components";
import { useFocusEffect } from "@react-navigation/native";
import { addMonths, subMonths, format } from "date-fns";
import { ptBR } from "date-fns/locale";

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
  MonthSelect,
  MonthSelectButton,
  MonthSelectIcon,
  Month,
  LoadContainer,
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
  const [isLoading, setIsLoading] = useState(true);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [totalByCategories, setTotalByCategories] = useState<CategoryData[]>(
    []
  );

  const theme = useTheme();

  function handleChangeDate(action: "prev" | "next") {
    setSelectedDate(
      action === "prev"
        ? subMonths(selectedDate, 1)
        : addMonths(selectedDate, 1)
    );
  }

  async function loadData() {
    setIsLoading(true);

    const dataKey = "@gofinances:transactions";

    const response = await storage.getData(dataKey);
    const transactions = response ? response : [];

    const expenses = transactions.filter(
      (expense: TransactionProps) =>
        expense.type === "negative" &&
        new Date(expense.date).getMonth() === selectedDate.getMonth() &&
        new Date(expense.date).getFullYear() === selectedDate.getFullYear()
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
    setTimeout(() => {
      setIsLoading(false);
    }, 500);
  }

  useFocusEffect(
    useCallback(() => {
      loadData();
    }, [selectedDate])
  );

  return (
    <Container>
      <Header>
        <Title>Resumo por categoria</Title>
      </Header>

      {isLoading ? (
        <LoadContainer>
          <ActivityIndicator color={theme.colors.secondary} size="large" />
        </LoadContainer>
      ) : (
        <Content>
          <MonthSelect>
            <MonthSelectButton onPress={() => handleChangeDate("prev")}>
              <MonthSelectIcon name="chevron-left" />
            </MonthSelectButton>

            <Month>
              {format(selectedDate, "MMMM, yyyy", { locale: ptBR })}
            </Month>

            <MonthSelectButton onPress={() => handleChangeDate("next")}>
              <MonthSelectIcon name="chevron-right" />
            </MonthSelectButton>
          </MonthSelect>

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
      )}
    </Container>
  );
}

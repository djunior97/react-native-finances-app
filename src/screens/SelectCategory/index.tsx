import React from "react";
import { FlatList } from "react-native";

import { Button } from "../../components/Form/Button";

import { categories } from "../../utils/categories";
import {
  Container,
  Header,
  Title,
  Category,
  Icon,
  Name,
  Divider,
  Footer,
} from "./styles";

interface Category {
  key: string;
  name: string;
}

interface SelectCategoryProps {
  category: string;
  setCategory: (category: Category) => void;
  closeSelectCategory: () => void;
}

export function SelectCategory({
  category,
  setCategory,
  closeSelectCategory,
}: SelectCategoryProps) {
  return (
    <Container>
      <Header>
        <Title>Categoria</Title>
      </Header>

      <FlatList
        data={categories}
        style={{ flex: 1, width: "100%" }}
        keyExtractor={(item) => item.key}
        renderItem={({ item }) => (
          <Category>
            <Icon name={item.icon} />
            <Name>{item.name}</Name>
          </Category>
        )}
        ItemSeparatorComponent={() => <Divider />}
      ></FlatList>

      <Footer>
        <Button title="Selecionar" />
      </Footer>
    </Container>
  );
}

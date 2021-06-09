import AsyncStorage from "@react-native-async-storage/async-storage";

async function getData(key: string) {
  const data = await AsyncStorage.getItem(key);

  return data ? JSON.parse(data) : data;
}

export const storage = {
  getData,
};

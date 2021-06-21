import AsyncStorage from "@react-native-async-storage/async-storage";

async function getData(key: string) {
  const data = await AsyncStorage.getItem(key);

  return data ? JSON.parse(data) : data;
}

async function setData(key: string, data: any) {
  await AsyncStorage.setItem(key, JSON.stringify(data));
}

async function removeData(key: string) {
  await AsyncStorage.removeItem(key);
}

export const storage = {
  getData,
  setData,
  removeData,
};

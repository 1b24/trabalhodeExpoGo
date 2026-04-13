import { ScrollView } from "react-native";
import ProfileScreen from "./app/(tabs)/profile";
import HomeScreen from "./app/(tabs)/home";

export default function App() {
  let telaAtual = "home";

  if (telaAtual === "home") {
    return (
      <>
        <HomeScreen />
      </>
    );
  }

  if (telaAtual === "profile") {
    return (
      <>
        <ProfileScreen />
      </>
    );
  }

}
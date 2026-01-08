import React from "react";
import { StatusBar } from "expo-status-bar";
import AppNavigator from "./src/navigation/AppNavigator";
import { BuildProvider } from "./src/context/BuildContext";

export default function App() {
  return (
    <BuildProvider>
      <StatusBar style="light" />
      <AppNavigator />
    </BuildProvider>
  );
}

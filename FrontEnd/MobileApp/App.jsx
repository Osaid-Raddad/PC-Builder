import React from "react";
import { StatusBar } from "expo-status-bar";
import AppNavigator from "./src/navigation/AppNavigator";
import { BuildProvider } from "./src/context/BuildContext";
import { CompareProvider } from "./src/context/CompareContext";

export default function App() {
  return (
    <BuildProvider>
      <CompareProvider>
        <StatusBar style="light" />
        <AppNavigator />
      </CompareProvider>
    </BuildProvider>
  );
}

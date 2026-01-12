import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import colors from "../config/colors";

// Import Screens
import HomeScreen from "../screens/HomeScreen";
import LoginScreen from "../screens/auth/LoginScreen";
import RegisterScreen from "../screens/auth/RegisterScreen";
import ForgotPasswordScreen from "../screens/auth/ForgotPasswordScreen";
import ResetPasswordScreen from "../screens/auth/ResetPasswordScreen";
import BuilderScreen from "../screens/builder/BuilderScreen";
import ProductsScreen from "../screens/products/ProductsScreen";
import ComparatorScreen from "../screens/comparator/ComparatorScreen";
import CompletedBuildsScreen from "../screens/completedBuilds/CompletedBuildsScreen";
import PostsScreen from "../screens/posts/PostsScreen";
import NewsScreen from "../screens/news/NewsScreen";
import ShopsScreen from "../screens/shops/ShopsScreen";
import ChatScreen from "../screens/chat/ChatScreen";
import ProfileScreen from "../screens/profile/ProfileScreen";
import FAQScreen from "../screens/faq/FAQScreen";
import ContactScreen from "../screens/contact/ContactScreen";
import TechSupportScreen from "../screens/techSupport/TechSupportScreen";
import BuildingGuidesScreen from "../screens/buildingGuides/BuildingGuidesScreen";
import TermsOfServiceScreen from "../screens/termsOfService/TermsOfServiceScreen";
import QuantumComputingScreen from "../screens/quantumComputing/QuantumComputingScreen";

// Profile Feature Screens
import MyBuildsScreen from "../screens/profile/MyBuildsScreen";
import SavedScreen from "../screens/profile/SavedScreen";
import SettingsScreen from "../screens/profile/SettingsScreen";

// Admin Screens
import DashboardScreen from "../screens/admin/DashboardScreen";
import ShopRequestsScreen from "../screens/admin/ShopRequestsScreen";
import PostManagementScreen from "../screens/admin/PostManagementScreen";
import UserManagementScreen from "../screens/admin/UserManagementScreen";
import ProductManagementScreen from "../screens/admin/ProductManagementScreen";
import TechSupportRequestsScreen from "../screens/admin/TechSupportRequestsScreen";
import ChangeRolesScreen from "../screens/admin/ChangeRolesScreen";

// Product Category Screens
import CPUScreen from "../screens/products/CPUScreen";
import GPUScreen from "../screens/products/GPUScreen";
import MotherboardScreen from "../screens/products/MotherboardScreen";
import MemoryScreen from "../screens/products/MemoryScreen";
import StorageScreen from "../screens/products/StorageScreen";
import PowerSupplyScreen from "../screens/products/PowerSupplyScreen";
import CaseScreen from "../screens/products/CaseScreen";
import CoolerScreen from "../screens/products/CoolerScreen";
import MonitorScreen from "../screens/products/MonitorScreen";
import ExpansionScreen from "../screens/products/ExpansionScreen";
import PeripheralsScreen from "../screens/products/PeripheralsScreen";
import AccessoriesScreen from "../screens/products/AccessoriesScreen";

const Stack = createStackNavigator();

export default function AppNavigator() {
  return (
    <NavigationContainer>
      <Stack.Navigator
        initialRouteName="Home"
        screenOptions={({ route }) => ({
          headerShown: false,
          cardStyle: { backgroundColor: colors.background },
          animation: route.params?.animation === 'horizontal-inverted' ? 'slide_from_left' : 'slide_from_right',
          transitionSpec: {
            open: {
              animation: 'timing',
              config: {
                duration: 200,
              },
            },
            close: {
              animation: 'timing',
              config: {
                duration: 200,
              },
            },
          },
        })}
      >
        {/* Main Screens */}
        <Stack.Screen name="Home" component={HomeScreen} />
        <Stack.Screen name="Login" component={LoginScreen} />
        <Stack.Screen name="Register" component={RegisterScreen} />
        <Stack.Screen name="ForgotPassword" component={ForgotPasswordScreen} />
        <Stack.Screen name="ResetPassword" component={ResetPasswordScreen} />

        {/* Builder & Tools */}
        <Stack.Screen name="Builder" component={BuilderScreen} />
        <Stack.Screen name="Comparator" component={ComparatorScreen} />
        <Stack.Screen
          name="CompletedBuilds"
          component={CompletedBuildsScreen}
        />

        {/* Products */}
        <Stack.Screen name="Products" component={ProductsScreen} />
        <Stack.Screen name="CPU" component={CPUScreen} />
        <Stack.Screen name="GPU" component={GPUScreen} />
        <Stack.Screen name="Motherboard" component={MotherboardScreen} />
        <Stack.Screen name="Memory" component={MemoryScreen} />
        <Stack.Screen name="Storage" component={StorageScreen} />
        <Stack.Screen name="PowerSupply" component={PowerSupplyScreen} />
        <Stack.Screen name="Case" component={CaseScreen} />
        <Stack.Screen name="Cooler" component={CoolerScreen} />
        <Stack.Screen name="Monitor" component={MonitorScreen} />
        <Stack.Screen name="Expansion" component={ExpansionScreen} />
        <Stack.Screen name="Peripherals" component={PeripheralsScreen} />
        <Stack.Screen name="Accessories" component={AccessoriesScreen} />

        {/* Community */}
        <Stack.Screen name="Posts" component={PostsScreen} />
        <Stack.Screen name="News" component={NewsScreen} />
        <Stack.Screen name="Shops" component={ShopsScreen} />
        <Stack.Screen name="QuantumComputing" component={QuantumComputingScreen} />
        <Stack.Screen name="Chat" component={ChatScreen} />

        {/* User */}
        <Stack.Screen name="Profile" component={ProfileScreen} />
        <Stack.Screen name="MyBuilds" component={MyBuildsScreen} />
        <Stack.Screen name="Saved" component={SavedScreen} />
        <Stack.Screen name="Settings" component={SettingsScreen} />

        {/* Admin */}
        <Stack.Screen name="Dashboard" component={DashboardScreen} />
        <Stack.Screen name="ShopRequests" component={ShopRequestsScreen} />
        <Stack.Screen name="PostManagement" component={PostManagementScreen} />
        <Stack.Screen name="UserManagement" component={UserManagementScreen} />
        <Stack.Screen name="ProductManagement" component={ProductManagementScreen} />
        <Stack.Screen name="TechSupportRequests" component={TechSupportRequestsScreen} />
        <Stack.Screen name="ChangeRoles" component={ChangeRolesScreen} />

        {/* Support */}
        <Stack.Screen name="TechSupport" component={TechSupportScreen} />
        <Stack.Screen name="FAQ" component={FAQScreen} />
        <Stack.Screen name="BuildingGuides" component={BuildingGuidesScreen} />
        <Stack.Screen name="Contact" component={ContactScreen} />
        <Stack.Screen name="TermsOfService" component={TermsOfServiceScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

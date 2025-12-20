import React from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  FlatList,
} from "react-native";
import { Feather, MaterialCommunityIcons } from "@expo/vector-icons";
import ScreenLayout from "../../components/ScreenLayout";
import colors from "../../config/colors";

const MOCK_BUILDS = [
  {
    id: "1",
    name: "Gaming Beast 2024",
    cpu: "AMD Ryzen 9 7950X",
    gpu: "RTX 4090",
    totalPrice: 3500,
    date: "Dec 10, 2024",
  },
  {
    id: "2",
    name: "Budget Workstation",
    cpu: "Intel i5-13400F",
    gpu: "RTX 3060",
    totalPrice: 1200,
    date: "Nov 25, 2024",
  },
  {
    id: "3",
    name: "Content Creator Pro",
    cpu: "AMD Ryzen 7 7800X3D",
    gpu: "RTX 4070 Ti",
    totalPrice: 2100,
    date: "Oct 15, 2024",
  },
];

export default function MyBuildsScreen({ navigation }) {
  const renderBuild = ({ item }) => (
    <TouchableOpacity style={styles.buildCard}>
      <View style={styles.buildHeader}>
        <MaterialCommunityIcons
          name="desktop-tower"
          size={32}
          color={colors.mainYellow}
        />
        <View style={styles.buildInfo}>
          <Text style={styles.buildName}>{item.name}</Text>
          <Text style={styles.buildDate}>{item.date}</Text>
        </View>
      </View>
      
      <View style={styles.buildDetails}>
        <View style={styles.component}>
          <MaterialCommunityIcons name="cpu-64-bit" size={18} color={colors.text} />
          <Text style={styles.componentText}>{item.cpu}</Text>
        </View>
        <View style={styles.component}>
          <MaterialCommunityIcons name="expansion-card" size={18} color={colors.text} />
          <Text style={styles.componentText}>{item.gpu}</Text>
        </View>
      </View>

      <View style={styles.buildFooter}>
        <Text style={styles.price}>${item.totalPrice}</Text>
        <View style={styles.actions}>
          <TouchableOpacity style={styles.actionButton}>
            <Feather name="edit-2" size={18} color={colors.mainYellow} />
          </TouchableOpacity>
          <TouchableOpacity style={styles.actionButton}>
            <Feather name="share-2" size={18} color={colors.mainYellow} />
          </TouchableOpacity>
          <TouchableOpacity style={styles.actionButton}>
            <Feather name="trash-2" size={18} color={colors.error} />
          </TouchableOpacity>
        </View>
      </View>
    </TouchableOpacity>
  );

  return (
    <ScreenLayout navigation={navigation} scrollable={false}>
      <View style={styles.container}>
        <TouchableOpacity 
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <Feather name="arrow-left" size={24} color={colors.mainBlack} />
        </TouchableOpacity>

        <View style={styles.header}>
          <Text style={styles.title}>My Builds</Text>
          <Text style={styles.subtitle}>All your custom PC builds</Text>
        </View>

        <TouchableOpacity 
          style={styles.createButton}
          onPress={() => navigation.navigate('Builder')}
        >
          <Feather name="plus" size={20} color={colors.mainBlack} />
          <Text style={styles.createButtonText}>Create New Build</Text>
        </TouchableOpacity>

        <FlatList
          data={MOCK_BUILDS}
          renderItem={renderBuild}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.listContainer}
          ListEmptyComponent={
            <View style={styles.emptyState}>
              <MaterialCommunityIcons
                name="desktop-tower-off"
                size={64}
                color={colors.text}
              />
              <Text style={styles.emptyText}>No builds yet</Text>
              <Text style={styles.emptySubtext}>Start building your dream PC!</Text>
            </View>
          }
        />
      </View>
    </ScreenLayout>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: colors.mainBeige,
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'white',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  header: {
    marginBottom: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    color: colors.mainBlack,
  },
  subtitle: {
    fontSize: 16,
    color: colors.text,
    marginTop: 8,
  },
  createButton: {
    flexDirection: 'row',
    backgroundColor: colors.mainYellow,
    padding: 14,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
    gap: 8,
  },
  createButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.mainBlack,
  },
  listContainer: {
    paddingBottom: 20,
  },
  buildCard: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  buildHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
    gap: 12,
  },
  buildInfo: {
    flex: 1,
  },
  buildName: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.mainBlack,
  },
  buildDate: {
    fontSize: 12,
    color: colors.text,
    marginTop: 4,
  },
  buildDetails: {
    marginBottom: 12,
  },
  component: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 6,
    gap: 8,
  },
  componentText: {
    fontSize: 14,
    color: colors.text,
  },
  buildFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: colors.border,
  },
  price: {
    fontSize: 20,
    fontWeight: 'bold',
    color: colors.mainYellow,
  },
  actions: {
    flexDirection: 'row',
    gap: 12,
  },
  actionButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: colors.background,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 60,
  },
  emptyText: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.mainBlack,
    marginTop: 16,
  },
  emptySubtext: {
    fontSize: 14,
    color: colors.text,
    marginTop: 8,
  },
});

import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Alert,
} from "react-native";
import { Feather, MaterialCommunityIcons } from "@expo/vector-icons";
import ScreenLayout from "../../components/ScreenLayout";
import colors from "../../config/colors";

const AI_MODELS = [
  {
    id: 1,
    name: "Small Language Model (7B params)",
    category: "LLM",
    description: "Models like Llama 2 7B, Mistral 7B",
    useCases: ["Chatbots", "Text Generation", "Code Assistance"],
  },
  {
    id: 2,
    name: "Medium Language Model (13B params)",
    category: "LLM",
    description: "Models like Llama 2 13B, Vicuna 13B",
    useCases: ["Advanced Chatbots", "Content Creation", "Analysis"],
  },
  {
    id: 3,
    name: "Large Language Model (70B+ params)",
    category: "LLM",
    description: "Models like Llama 2 70B, GPT-3.5 equivalent",
    useCases: ["Professional Applications", "Complex Reasoning"],
  },
  {
    id: 4,
    name: "Stable Diffusion XL",
    category: "Image Generation",
    description: "High-quality image generation",
    useCases: ["Art Creation", "Product Design", "Content Generation"],
  },
  {
    id: 5,
    name: "Whisper (Speech Recognition)",
    category: "Audio",
    description: "Speech-to-text transcription",
    useCases: ["Transcription", "Subtitling", "Voice Commands"],
  },
  {
    id: 6,
    name: "Custom Deep Learning",
    category: "Custom",
    description: "Training custom models",
    useCases: ["Research", "Custom AI Solutions"],
  },
];

const HARDWARE_RECOMMENDATIONS = {
  1: {
    // Small LLM
    inference: {
      cpu: "AMD Ryzen 7 5800X or Intel Core i7-12700K",
      cpuCores: "8+ cores",
      ram: "32 GB DDR4",
      gpu: "NVIDIA RTX 4060 Ti 16GB or RTX 3060 12GB",
      vram: "12-16 GB",
      storage: "500 GB NVMe SSD",
      powerSupply: "650W 80+ Gold",
      estimatedCost: "$1,200 - $1,500",
    },
    training: {
      cpu: "AMD Ryzen 9 5950X or Intel Core i9-12900K",
      cpuCores: "16+ cores",
      ram: "64 GB DDR4",
      gpu: "NVIDIA RTX 4090 or RTX 4080",
      vram: "24 GB minimum",
      storage: "1 TB NVMe SSD",
      powerSupply: "1000W 80+ Gold",
      estimatedCost: "$3,000 - $4,000",
    },
  },
  2: {
    // Medium LLM
    inference: {
      cpu: "AMD Ryzen 9 5900X or Intel Core i9-12900K",
      cpuCores: "12+ cores",
      ram: "64 GB DDR4",
      gpu: "NVIDIA RTX 4070 Ti or RTX 4080",
      vram: "16-20 GB",
      storage: "1 TB NVMe SSD",
      powerSupply: "850W 80+ Gold",
      estimatedCost: "$2,000 - $2,500",
    },
    training: {
      cpu: "AMD Threadripper or Intel Core i9-13900K",
      cpuCores: "24+ cores",
      ram: "128 GB DDR4",
      gpu: "2x NVIDIA RTX 4090 or A6000",
      vram: "48 GB total (24GB per card)",
      storage: "2 TB NVMe SSD",
      powerSupply: "1600W 80+ Platinum",
      estimatedCost: "$6,000 - $8,000",
    },
  },
  3: {
    // Large LLM
    inference: {
      cpu: "AMD Threadripper PRO or Intel Xeon W",
      cpuCores: "32+ cores",
      ram: "128 GB DDR4 ECC",
      gpu: "2x NVIDIA RTX 4090 or A100 40GB",
      vram: "80 GB total minimum",
      storage: "2 TB NVMe SSD",
      powerSupply: "1600W 80+ Platinum",
      estimatedCost: "$8,000 - $12,000",
    },
    training: {
      cpu: "AMD EPYC or Intel Xeon Scalable",
      cpuCores: "64+ cores",
      ram: "256 GB DDR4 ECC",
      gpu: "4x NVIDIA A100 80GB or H100",
      vram: "320 GB total minimum",
      storage: "4 TB NVMe SSD RAID",
      powerSupply: "2000W+ 80+ Titanium",
      estimatedCost: "$25,000+",
    },
  },
  4: {
    // Stable Diffusion XL
    inference: {
      cpu: "AMD Ryzen 7 5800X or Intel Core i7-12700K",
      cpuCores: "8+ cores",
      ram: "32 GB DDR4",
      gpu: "NVIDIA RTX 4070 or RTX 3080",
      vram: "12 GB minimum",
      storage: "500 GB NVMe SSD",
      powerSupply: "750W 80+ Gold",
      estimatedCost: "$1,500 - $2,000",
    },
    training: {
      cpu: "AMD Ryzen 9 5950X or Intel Core i9-12900K",
      cpuCores: "16+ cores",
      ram: "64 GB DDR4",
      gpu: "NVIDIA RTX 4090 or A6000",
      vram: "24 GB minimum",
      storage: "2 TB NVMe SSD",
      powerSupply: "1000W 80+ Gold",
      estimatedCost: "$3,500 - $5,000",
    },
  },
  5: {
    // Whisper
    inference: {
      cpu: "AMD Ryzen 5 5600X or Intel Core i5-12400",
      cpuCores: "6+ cores",
      ram: "16 GB DDR4",
      gpu: "NVIDIA RTX 4060 or RTX 3060",
      vram: "8 GB",
      storage: "256 GB NVMe SSD",
      powerSupply: "550W 80+ Bronze",
      estimatedCost: "$800 - $1,000",
    },
    training: {
      cpu: "AMD Ryzen 7 5800X or Intel Core i7-12700K",
      cpuCores: "8+ cores",
      ram: "32 GB DDR4",
      gpu: "NVIDIA RTX 4070 or RTX 3080",
      vram: "12 GB",
      storage: "1 TB NVMe SSD",
      powerSupply: "750W 80+ Gold",
      estimatedCost: "$1,800 - $2,200",
    },
  },
  6: {
    // Custom Deep Learning
    inference: {
      cpu: "AMD Ryzen 9 5900X or Intel Core i9-12900K",
      cpuCores: "12+ cores",
      ram: "64 GB DDR4",
      gpu: "NVIDIA RTX 4080 or RTX 4090",
      vram: "16-24 GB",
      storage: "1 TB NVMe SSD",
      powerSupply: "850W 80+ Gold",
      estimatedCost: "$2,500 - $3,500",
    },
    training: {
      cpu: "AMD Threadripper or Intel Core i9-13900K",
      cpuCores: "24+ cores",
      ram: "128 GB DDR4",
      gpu: "2x NVIDIA RTX 4090",
      vram: "48 GB total",
      storage: "2 TB NVMe SSD",
      powerSupply: "1600W 80+ Platinum",
      estimatedCost: "$6,000 - $8,000",
    },
  },
};

export default function AIHardwareCalculatorScreen({ navigation }) {
  const [selectedModel, setSelectedModel] = useState(null);
  const [workloadType, setWorkloadType] = useState("inference"); // inference or training
  const [customDescription, setCustomDescription] = useState("");
  const [showCustomInput, setShowCustomInput] = useState(false);
  const [showWorkloadInfo, setShowWorkloadInfo] = useState(false);

  const handleModelSelect = (model) => {
    // Toggle selection - if same model is clicked, deselect it
    if (selectedModel?.id === model.id) {
      setSelectedModel(null);
    } else {
      setSelectedModel(model);
    }
    setShowCustomInput(false);
  };

  const handleCustomModel = () => {
    setShowCustomInput(true);
    setSelectedModel(null);
  };

  const renderRecommendations = () => {
    if (!selectedModel) return null;

    const recommendations = HARDWARE_RECOMMENDATIONS[selectedModel.id]?.[workloadType];
    if (!recommendations) return null;

    return (
      <View style={styles.recommendationsCard}>
        <View style={styles.recommendationsHeader}>
          <MaterialCommunityIcons name="check-decagram" size={32} color={colors.success} />
          <View style={styles.recommendationsHeaderText}>
            <Text style={styles.recommendationsTitle}>
              Your Hardware Requirements
            </Text>
            <Text style={styles.recommendationsSubtitle}>
              {selectedModel.name}
            </Text>
          </View>
        </View>

        <View style={styles.workloadBadge}>
          <MaterialCommunityIcons 
            name={workloadType === "inference" ? "play-circle" : "school"} 
            size={20} 
            color={colors.mainBlack} 
          />
          <Text style={styles.workloadBadgeText}>
            {workloadType === "inference" ? "For Running Models" : "For Training/Fine-tuning"}
          </Text>
        </View>

        <View style={styles.specsList}>
          <View style={styles.specItem}>
            <MaterialCommunityIcons name="cpu-64-bit" size={24} color={colors.primary} />
            <View style={styles.specContent}>
              <Text style={styles.specLabel}>CPU</Text>
              <Text style={styles.specValue}>{recommendations.cpu}</Text>
              <Text style={styles.specDetail}>{recommendations.cpuCores}</Text>
            </View>
          </View>

          <View style={styles.specItem}>
            <MaterialCommunityIcons name="memory" size={24} color={colors.primary} />
            <View style={styles.specContent}>
              <Text style={styles.specLabel}>RAM</Text>
              <Text style={styles.specValue}>{recommendations.ram}</Text>
            </View>
          </View>

          <View style={styles.specItem}>
            <MaterialCommunityIcons name="expansion-card" size={24} color={colors.primary} />
            <View style={styles.specContent}>
              <Text style={styles.specLabel}>GPU</Text>
              <Text style={styles.specValue}>{recommendations.gpu}</Text>
              <Text style={styles.specDetail}>VRAM: {recommendations.vram}</Text>
            </View>
          </View>

          <View style={styles.specItem}>
            <MaterialCommunityIcons name="harddisk" size={24} color={colors.primary} />
            <View style={styles.specContent}>
              <Text style={styles.specLabel}>Storage</Text>
              <Text style={styles.specValue}>{recommendations.storage}</Text>
            </View>
          </View>

          <View style={styles.specItem}>
            <MaterialCommunityIcons name="flash" size={24} color={colors.primary} />
            <View style={styles.specContent}>
              <Text style={styles.specLabel}>Power Supply</Text>
              <Text style={styles.specValue}>{recommendations.powerSupply}</Text>
            </View>
          </View>

          <View style={styles.costCard}>
            <Text style={styles.costLabel}>Estimated Build Cost</Text>
            <Text style={styles.costValue}>{recommendations.estimatedCost}</Text>
          </View>
        </View>

        <TouchableOpacity
          style={styles.buildButton}
          onPress={() => {
            Alert.alert(
              "Start Building",
              "Would you like to browse components to build this configuration?",
              [
                { text: "Cancel", style: "cancel" },
                { text: "Go to Builder", onPress: () => navigation.navigate("Builder") },
              ]
            );
          }}
        >
          <Feather name="tool" size={20} color={colors.mainBlack} />
          <Text style={styles.buildButtonText}>Start Building This Configuration</Text>
        </TouchableOpacity>
      </View>
    );
  };

  return (
    <ScreenLayout navigation={navigation} scrollable={false}>
      <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <View style={styles.headerIconContainer}>
            <MaterialCommunityIcons name="brain" size={50} color={colors.mainYellow} />
          </View>
          <Text style={styles.title}>AI Hardware Calculator</Text>
          <Text style={styles.subtitle}>
            Get precise hardware recommendations for your AI projects
          </Text>
        </View>

        {/* Instructions */}
        <View style={styles.instructionsCard}>
          <View style={styles.instructionStep}>
            <View style={styles.stepNumber}>
              <Text style={styles.stepNumberText}>1</Text>
            </View>
            <Text style={styles.instructionText}>
              Choose if you're running or training models
            </Text>
          </View>
          <View style={styles.instructionStep}>
            <View style={styles.stepNumber}>
              <Text style={styles.stepNumberText}>2</Text>
            </View>
            <Text style={styles.instructionText}>
              Select your AI model type
            </Text>
          </View>
          <View style={styles.instructionStep}>
            <View style={styles.stepNumber}>
              <Text style={styles.stepNumberText}>3</Text>
            </View>
            <Text style={styles.instructionText}>
              Get detailed hardware specifications
            </Text>
          </View>
        </View>

        {/* Workload Type Selection */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Step 1: Choose Your Workload</Text>
            <TouchableOpacity 
              onPress={() => setShowWorkloadInfo(!showWorkloadInfo)}
              style={styles.infoButton}
            >
              <Feather name="info" size={20} color={colors.primary} />
            </TouchableOpacity>
          </View>

          {showWorkloadInfo && (
            <View style={styles.infoBox}>
              <Text style={styles.infoBoxText}>
                <Text style={styles.infoBoxBold}>Inference (Running): </Text>
                Use existing pre-trained models for predictions, text generation, or image creation.
                {"\n\n"}
                <Text style={styles.infoBoxBold}>Training (Fine-tuning): </Text>
                Customize and train models with your own data. Requires significantly more powerful hardware.
              </Text>
            </View>
          )}
          <View style={styles.workloadButtons}>
            <TouchableOpacity
              style={[
                styles.workloadButton,
                workloadType === "inference" && styles.workloadButtonActive,
              ]}
              onPress={() => setWorkloadType("inference")}
            >
              <MaterialCommunityIcons
                name="play-circle-outline"
                size={24}
                color={workloadType === "inference" ? colors.mainBlack : colors.mainBlack}
              />
              <Text
                style={[
                  styles.workloadButtonText,
                  workloadType === "inference" && styles.workloadButtonTextActive,
                ]}
              >
                Inference
              </Text>
              <Text style={[
                styles.workloadButtonDesc,
                workloadType === "inference" && styles.workloadButtonDescActive
              ]}>
                Running pre-trained models
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[
                styles.workloadButton,
                workloadType === "training" && styles.workloadButtonActive,
              ]}
              onPress={() => setWorkloadType("training")}
            >
              <MaterialCommunityIcons
                name="school-outline"
                size={28}
                color={workloadType === "training" ? colors.mainBlack : colors.mainBlack}
              />
              <Text
                style={[
                  styles.workloadButtonText,
                  workloadType === "training" && styles.workloadButtonTextActive,
                ]}
              >
                Training
              </Text>
              <Text style={[
                styles.workloadButtonDesc,
                workloadType === "training" && styles.workloadButtonDescActive
              ]}>
                Training & fine-tuning models
              </Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Model Selection */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Step 2: Select AI Model Type</Text>
          <Text style={styles.sectionDescription}>
            Choose the type of AI model you want to work with
          </Text>
          <View style={styles.modelsGrid}>
            {AI_MODELS.map((model) => (
              <TouchableOpacity
                key={model.id}
                style={[
                  styles.modelCard,
                  selectedModel?.id === model.id && styles.modelCardActive,
                ]}
                onPress={() => handleModelSelect(model)}
              >
                <View style={styles.modelHeader}>
                  <MaterialCommunityIcons
                    name={
                      model.category === "LLM"
                        ? "text-box-outline"
                        : model.category === "Image Generation"
                        ? "image-outline"
                        : model.category === "Audio"
                        ? "microphone"
                        : "cog-outline"
                    }
                    size={28}
                    color={selectedModel?.id === model.id ? colors.mainYellow : colors.primary}
                  />
                  {selectedModel?.id === model.id && (
                    <MaterialCommunityIcons
                      name="check-circle"
                      size={20}
                      color={colors.success}
                      style={styles.checkIcon}
                    />
                  )}
                </View>
                <Text style={styles.modelName}>{model.name}</Text>
                <View style={styles.categoryBadge}>
                  <Text style={styles.categoryBadgeText}>{model.category}</Text>
                </View>
                <Text style={styles.modelDescription}>{model.description}</Text>
                <Text style={styles.useCasesLabel}>Common uses:</Text>
                <View style={styles.useCasesContainer}>
                  {model.useCases.slice(0, 2).map((useCase, index) => (
                    <View key={index} style={styles.useCaseTag}>
                      <Feather name="check" size={12} color={colors.primary} />
                      <Text style={styles.useCaseText}>{useCase}</Text>
                    </View>
                  ))}
                </View>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Custom Model Input */}
        <View style={styles.orDivider}>
          <View style={styles.orLine} />
          <Text style={styles.orText}>OR</Text>
          <View style={styles.orLine} />
        </View>

        <TouchableOpacity
          style={styles.customButton}
          onPress={handleCustomModel}
        >
          <Feather name="edit-3" size={22} color={colors.primary} />
          <Text style={styles.customButtonText}>Describe Your Custom AI Project</Text>
        </TouchableOpacity>

        {showCustomInput && (
          <View style={styles.customInputCard}>
            <Text style={styles.customInputLabel}>Describe Your AI Project</Text>
            <Text style={styles.customInputHint}>
              Tell us about your AI project, expected data size, performance needs, etc.
            </Text>
            <TextInput
              style={styles.customInput}
              placeholder="Example: I want to train a computer vision model for real-time object detection using a dataset of 50,000 images..."
              placeholderTextColor={colors.mainBlack}
              multiline
              numberOfLines={5}
              value={customDescription}
              onChangeText={setCustomDescription}
            />
            <TouchableOpacity
              style={styles.analyzeButton}
              onPress={() => {
                Alert.alert(
                  "Coming Soon!",
                  "AI-powered analysis of your custom requirements will be available in a future update. For now, select a pre-configured model above.",
                  [{ text: "Got it" }]
                );
              }}
            >
              <MaterialCommunityIcons name="auto-fix" size={20} color={colors.mainWhite} />
              <Text style={styles.analyzeButtonText}>Analyze My Requirements</Text>
            </TouchableOpacity>
          </View>
        )}

        {/* Recommendations */}
        {renderRecommendations()}

        {selectedModel && (
          <View style={styles.performanceNote}>
            <Feather name="zap" size={18} color={colors.mainYellow} />
            <Text style={styles.performanceNoteText}>
              <Text style={styles.performanceNoteBold}>Performance Tip: </Text>
              For {workloadType === "inference" ? "faster inference" : "efficient training"}, consider upgrading to higher-tier components.
            </Text>
          </View>
        )}

        <View style={styles.infoCard}>
          <Feather name="info" size={20} color={colors.primary} />
          <View style={styles.infoCardContent}>
            <Text style={styles.infoCardTitle}>About These Recommendations</Text>
            <Text style={styles.infoText}>
              Hardware requirements are general guidelines based on industry standards.{"\n"}
              {"\n"}Actual performance may vary depending on:{"\n"}
              {"\n"}• Model optimization and quantization{"\n"}
              • Batch sizes and data processing{"\n"}
              • Software frameworks used{"\n"}
              • Specific implementation details
            </Text>
          </View>
        </View>
      </ScrollView>
    </ScreenLayout>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.mainBeige,
    padding: 20,
  },
  header: {
    alignItems: "center",
    marginBottom: 25,
  },
  headerIconContainer: {
    backgroundColor: colors.mainWhite,
    width: 80,
    height: 80,
    borderRadius: 40,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 15,
    shadowColor: colors.mainBlack,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    color: colors.mainBlack,
    textAlign: "center",
  },
  subtitle: {
    fontSize: 15,
    color: colors.mainBlack,
    marginTop: 8,
    textAlign: "center",
    paddingHorizontal: 20,
  },
  instructionsCard: {
    backgroundColor: colors.mainWhite,
    padding: 20,
    borderRadius: 12,
    marginBottom: 25,
    borderLeftWidth: 4,
    borderLeftColor: colors.mainYellow,
  },
  instructionStep: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 12,
  },
  stepNumber: {
    backgroundColor: colors.mainYellow,
    width: 28,
    height: 28,
    borderRadius: 14,
    alignItems: "center",
    justifyContent: "center",
    marginRight: 12,
  },
  stepNumberText: {
    fontSize: 14,
    fontWeight: "bold",
    color: colors.mainBlack,
  },
  instructionText: {
    flex: 1,
    fontSize: 14,
    color: colors.mainBlack,
  },
  section: {
    marginBottom: 25,
  },
  sectionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 15,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: colors.mainBlack,
  },
  sectionDescription: {
    fontSize: 14,
    color: colors.mainBlack,
    marginBottom: 15,
    marginTop: 5,
  },
  infoButton: {
    padding: 4,
  },
  infoBox: {
    backgroundColor: "#E3F2FD",
    padding: 15,
    borderRadius: 8,
    marginBottom: 15,
    borderLeftWidth: 3,
    borderLeftColor: colors.primary,
  },
  infoBoxText: {
    fontSize: 13,
    color: colors.mainBlack,
    lineHeight: 20,
  },
  infoBoxBold: {
    fontWeight: "bold",
    color: colors.primary,
  },
  workloadButtons: {
    flexDirection: "row",
    gap: 15,
  },
  workloadButton: {
    flex: 1,
    backgroundColor: colors.mainWhite,
    padding: 20,
    borderRadius: 12,
    alignItems: "center",
    borderWidth: 2,
    borderColor: "#E0E0E0",
    shadowColor: colors.mainBlack,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  workloadButtonActive: {
    backgroundColor: colors.mainYellow,
    borderColor: colors.mainYellow,
    shadowOpacity: 0.15,
    shadowRadius: 4,
    elevation: 3,
  },
  workloadButtonText: {
    fontSize: 16,
    fontWeight: "bold",
    color: colors.mainBlack,
    marginTop: 10,
  },
  workloadButtonTextActive: {
    color: colors.mainBlack,
  },
  workloadButtonDesc: {
    fontSize: 12,
    color: colors.mainBlack,
    marginTop: 5,
    textAlign: "center",
  },
  workloadButtonDescActive: {
    color: colors.mainBlack,
    opacity: 0.7,
  },
  modelsGrid: {
    gap: 15,
  },
  modelCard: {
    backgroundColor: colors.mainWhite,
    padding: 20,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: "#E0E0E0",
    shadowColor: colors.mainBlack,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  modelCardActive: {
    borderColor: colors.mainYellow,
    backgroundColor: "#FFFBF0",
    borderWidth: 3,
    shadowOpacity: 0.15,
    shadowRadius: 4,
    elevation: 3,
  },
  modelHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 12,
  },
  checkIcon: {
    position: "absolute",
    right: 0,
    top: 0,
  },
  modelName: {
    fontSize: 17,
    fontWeight: "bold",
    color: colors.mainBlack,
    marginBottom: 8,
  },
  categoryBadge: {
    alignSelf: "flex-start",
    backgroundColor: colors.primary,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
    marginBottom: 8,
  },
  categoryBadgeText: {
    fontSize: 11,
    fontWeight: "600",
    color: colors.mainWhite,
    textTransform: "uppercase",
  },
  modelDescription: {
    fontSize: 14,
    color: colors.mainBlack,
    marginBottom: 12,
    lineHeight: 20,
  },
  useCasesLabel: {
    fontSize: 12,
    fontWeight: "600",
    color: colors.mainBlack,
    marginBottom: 8,
    textTransform: "uppercase",
  },
  useCasesContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
  },
  useCaseTag: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#E8F5E9",
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 12,
    gap: 4,
  },
  useCaseText: {
    fontSize: 12,
    color: colors.success,
    fontWeight: "500",
  },
  orDivider: {
    flexDirection: "row",
    alignItems: "center",
    marginVertical: 20,
  },
  orLine: {
    flex: 1,
    height: 1,
    backgroundColor: "#E0E0E0",
  },
  orText: {
    marginHorizontal: 15,
    fontSize: 12,
    fontWeight: "600",
    color: colors.mainBlack,
  },
  customButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: colors.mainWhite,
    padding: 18,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: colors.primary,
    borderStyle: "dashed",
    marginBottom: 20,
    gap: 10,
  },
  customButtonText: {
    fontSize: 16,
    color: colors.primary,
    fontWeight: "600",
  },
  customInputCard: {
    backgroundColor: colors.mainWhite,
    padding: 20,
    borderRadius: 12,
    marginBottom: 25,
    shadowColor: colors.mainBlack,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  customInputLabel: {
    fontSize: 17,
    fontWeight: "bold",
    color: colors.mainBlack,
    marginBottom: 6,
  },
  customInputHint: {
    fontSize: 13,
    color: colors.mainBlack,
    marginBottom: 12,
  },
  customInput: {
    backgroundColor: colors.mainBeige,
    borderRadius: 8,
    padding: 15,
    fontSize: 14,
    color: colors.mainBlack,
    minHeight: 120,
    textAlignVertical: "top",
    borderWidth: 1,
    borderColor: "#E0E0E0",
  },
  analyzeButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: colors.primary,
    padding: 15,
    borderRadius: 8,
    marginTop: 15,
    gap: 8,
  },
  analyzeButtonText: {
    color: colors.mainWhite,
    fontSize: 16,
    fontWeight: "bold",
  },
  recommendationsCard: {
    backgroundColor: colors.mainWhite,
    padding: 20,
    borderRadius: 12,
    marginBottom: 20,
    shadowColor: colors.mainBlack,
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.15,
    shadowRadius: 6,
    elevation: 5,
  },
  recommendationsHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    marginBottom: 12,
  },
  recommendationsHeaderText: {
    flex: 1,
  },
  recommendationsTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: colors.mainBlack,
  },
  recommendationsSubtitle: {
    fontSize: 14,
    color: colors.primary,
    marginTop: 2,
    fontWeight: "600",
  },
  workloadBadge: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: colors.mainYellow,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 20,
    alignSelf: "flex-start",
    marginBottom: 20,
    gap: 6,
  },
  workloadBadgeText: {
    fontSize: 13,
    fontWeight: "600",
    color: colors.mainBlack,
  },
  specsList: {
    gap: 15,
  },
  specItem: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: 15,
    padding: 15,
    backgroundColor: colors.mainBeige,
    borderRadius: 8,
    borderLeftWidth: 3,
    borderLeftColor: colors.primary,
  },
  specContent: {
    flex: 1,
  },
  specLabel: {
    fontSize: 11,
    color: colors.mainBlack,
    textTransform: "uppercase",
    fontWeight: "700",
    marginBottom: 4,
    letterSpacing: 0.5,
  },
  specValue: {
    fontSize: 15,
    fontWeight: "bold",
    color: colors.mainBlack,
    marginBottom: 4,
    lineHeight: 22,
  },
  specDetail: {
    fontSize: 13,
    color: colors.primary,
    fontWeight: "500",
  },
  costCard: {
    backgroundColor: colors.mainYellow,
    padding: 20,
    borderRadius: 8,
    alignItems: "center",
    marginTop: 10,
    shadowColor: colors.mainBlack,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  costLabel: {
    fontSize: 13,
    color: colors.mainBlack,
    fontWeight: "700",
    marginBottom: 8,
    textTransform: "uppercase",
    letterSpacing: 0.5,
  },
  costValue: {
    fontSize: 28,
    fontWeight: "bold",
    color: colors.mainBlack,
  },
  buildButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: colors.mainYellow,
    padding: 16,
    borderRadius: 8,
    marginTop: 20,
    gap: 10,
    shadowColor: colors.mainBlack,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 4,
    elevation: 3,
  },
  buildButtonText: {
    fontSize: 16,
    fontWeight: "bold",
    color: colors.mainBlack,
  },
  performanceNote: {
    flexDirection: "row",
    alignItems: "flex-start",
    backgroundColor: "#FFF8E1",
    padding: 15,
    borderRadius: 8,
    gap: 12,
    marginBottom: 20,
    borderLeftWidth: 3,
    borderLeftColor: colors.mainYellow,
  },
  performanceNoteText: {
    flex: 1,
    fontSize: 13,
    color: colors.mainBlack,
    lineHeight: 20,
  },
  performanceNoteBold: {
    fontWeight: "bold",
    color: colors.mainBlack,
  },
  infoCard: {
    flexDirection: "row",
    alignItems: "flex-start",
    backgroundColor: colors.mainWhite,
    padding: 18,
    borderRadius: 8,
    gap: 12,
    marginBottom: 30,
    borderWidth: 1,
    borderColor: "#E0E0E0",
  },
  infoCardContent: {
    flex: 1,
  },
  infoCardTitle: {
    fontSize: 14,
    fontWeight: "bold",
    color: colors.mainBlack,
    marginBottom: 6,
  },
  infoText: {
    flexWrap: "wrap",
    fontSize: 12,
    color: colors.mainBlack,
    lineHeight: 18,
  },
});

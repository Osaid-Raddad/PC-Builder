import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Animated,
} from 'react-native';
import { Feather, MaterialCommunityIcons } from '@expo/vector-icons';
import ScreenLayout from '../../components/ScreenLayout';
import colors from '../../config/colors';

export default function QuantumComputingScreen({ navigation }) {
  const [isQuantumView, setIsQuantumView] = useState(false);
  const [activeTab, setActiveTab] = useState('basics');

  const tabs = [
    { id: 'basics', label: 'Basics', icon: 'cpu' },
    { id: 'comparison', label: 'vs Classical', icon: 'bar-chart-2' },
    { id: 'applications', label: 'Applications', icon: 'target' },
    { id: 'future', label: 'Future', icon: 'trending-up' },
    { id: 'challenges', label: 'Challenges', icon: 'alert-triangle' },
  ];

  const comparisonData = [
    { feature: 'Basic Unit', classical: 'Bit (0 or 1)', quantum: 'Qubit (0, 1, or both)' },
    { feature: 'Processing', classical: 'Sequential/Parallel', quantum: 'Superposition + Entanglement' },
    { feature: 'Best For', classical: 'Everyday tasks, gaming', quantum: 'Complex optimization, simulation' },
    { feature: 'Error Rate', classical: '~10⁻¹⁷', quantum: '~10⁻² (improving)' },
    { feature: 'Temperature', classical: 'Room temperature', quantum: 'Near absolute zero (-273°C)' },
    { feature: 'Speed', classical: 'Baseline', quantum: '100M - 158M times faster (specific tasks)' },
  ];

  const applications = [
    {
      icon: 'cpu',
      title: 'Artificial Intelligence',
      description: 'Train AI models 1000x faster with quantum neural networks.',
      stat: '158M times speedup potential',
      color: colors.mainYellow,
    },
    {
      icon: 'lock',
      title: 'Cryptography',
      description: 'Break RSA encryption in hours vs millions of years.',
      stat: 'Factor 2048-bit in ~8 hours',
      color: colors.error,
    },
    {
      icon: 'activity',
      title: 'Scientific Simulation',
      description: 'Simulate molecular interactions for drug discovery.',
      stat: 'Model 100+ atom systems',
      color: colors.success,
    },
    {
      icon: 'crosshair',
      title: 'Optimization',
      description: 'Solve logistics and supply chain problems instantly.',
      stat: '1000+ variables in seconds',
      color: colors.accent,
    },
  ];

  const futureTimeline = [
    {
      period: '2025-2027',
      title: 'Quantum Co-Processors',
      points: [
        'Classical CPU handles everyday tasks',
        'QPU offloads specific workloads',
        'First consumer quantum accelerators',
      ],
    },
    {
      period: '2028-2032',
      title: 'Hybrid Systems',
      points: [
        'Integrated quantum cores on CPUs',
        'Quantum-enhanced GPUs',
        'Quantum memory (qRAM)',
      ],
    },
    {
      period: '2033+',
      title: 'Full Quantum Computing',
      points: [
        'Room-temperature qubits',
        'Quantum operating systems',
        'Quantum gaming experiences',
      ],
    },
  ];

  const challenges = [
    {
      icon: 'thermometer',
      title: 'Temperature',
      issue: 'Requires -273°C (near absolute zero)',
      progress: 15,
    },
    {
      icon: 'alert-triangle',
      title: 'Error Rates',
      issue: 'Systems are extremely fragile',
      progress: 35,
    },
    {
      icon: 'cpu',
      title: 'Scalability',
      issue: 'Difficult to scale beyond 1000 qubits',
      progress: 8,
    },
    {
      icon: 'code',
      title: 'Software',
      issue: 'Limited algorithms and tools',
      progress: 45,
    },
    {
      icon: 'dollar-sign',
      title: 'Cost',
      issue: '$15M+ per quantum computer',
      progress: 25,
    },
    {
      icon: 'server',
      title: 'Size',
      issue: 'Requires room-sized systems',
      progress: 12,
    },
  ];

  const renderBasicsTab = () => (
    <View style={styles.tabContent}>
      <Text style={styles.sectionTitle}>Computing at the Speed of Nature</Text>
      <Text style={styles.sectionText}>
        Traditional computers use <Text style={styles.highlight}>bits</Text> (1s and 0s).
        Quantum computers use <Text style={styles.highlight}>qubits</Text>, which can exist in
        multiple states simultaneously (superposition) and influence each other across distances (entanglement).
      </Text>

      <View style={styles.calloutCard}>
        <MaterialCommunityIcons name="lightning-bolt" size={32} color={colors.mainYellow} />
        <View style={styles.calloutContent}>
          <Text style={styles.calloutTitle}>Quantum Advantage</Text>
          <Text style={styles.calloutText}>
            For specific tasks, quantum computers can be <Text style={styles.highlight}>158 million times faster</Text> than classical systems.
          </Text>
        </View>
      </View>

      <View style={styles.visualDemo}>
        <Text style={styles.visualTitle}>Interactive Demo</Text>
        <TouchableOpacity
          style={styles.toggleButton}
          onPress={() => setIsQuantumView(!isQuantumView)}
        >
          <Text style={styles.toggleButtonText}>
            {isQuantumView ? 'Quantum Qubit' : 'Classical Bit'}
          </Text>
        </TouchableOpacity>

        {!isQuantumView ? (
          <View style={styles.bitDisplay}>
            <View style={[styles.bitBox, { backgroundColor: colors.error }]}>
              <Text style={styles.bitValue}>{Math.random() > 0.5 ? '1' : '0'}</Text>
            </View>
            <Text style={styles.bitLabel}>Classical Bit: Either 0 OR 1</Text>
          </View>
        ) : (
          <View style={styles.bitDisplay}>
            <View style={[styles.qubitBox, { backgroundColor: colors.mainYellow }]}>
              <Text style={styles.qubitValue}>|ψ⟩</Text>
            </View>
            <Text style={styles.bitLabel}>Quantum Qubit: 0 AND 1 (Superposition)</Text>
          </View>
        )}
      </View>

      <Text style={styles.analogyText}>
        💡 <Text style={styles.highlight}>Analogy:</Text> A classical computer checks every door in a maze one by one.
        A quantum computer checks all doors at once.
      </Text>
    </View>
  );

  const renderComparisonTab = () => (
    <View style={styles.tabContent}>
      <Text style={styles.sectionTitle}>Two Paradigms, Infinite Possibilities</Text>

      {comparisonData.map((row, index) => (
        <View key={index} style={styles.comparisonRow}>
          <Text style={styles.comparisonFeature}>{row.feature}</Text>
          <View style={styles.comparisonValues}>
            <View style={styles.comparisonItem}>
              <Text style={[styles.comparisonLabel, { color: colors.error }]}>Classical</Text>
              <Text style={styles.comparisonValue}>{row.classical}</Text>
            </View>
            <View style={styles.comparisonItem}>
              <Text style={[styles.comparisonLabel, { color: colors.mainYellow }]}>Quantum</Text>
              <Text style={styles.comparisonValue}>{row.quantum}</Text>
            </View>
          </View>
        </View>
      ))}
    </View>
  );

  const renderApplicationsTab = () => (
    <View style={styles.tabContent}>
      <Text style={styles.sectionTitle}>Where Quantum Dominates</Text>

      {applications.map((app, index) => (
        <View key={index} style={styles.applicationCard}>
          <View style={[styles.applicationIconContainer, { backgroundColor: app.color + '20' }]}>
            <Feather name={app.icon} size={28} color={app.color} />
          </View>
          <View style={styles.applicationContent}>
            <Text style={styles.applicationTitle}>{app.title}</Text>
            <Text style={styles.applicationDescription}>{app.description}</Text>
            <Text style={[styles.applicationStat, { color: app.color }]}>
              {app.stat}
            </Text>
          </View>
        </View>
      ))}
    </View>
  );

  const renderFutureTab = () => (
    <View style={styles.tabContent}>
      <Text style={styles.sectionTitle}>Your PC in 2035: Quantum-Hybrid</Text>

      {futureTimeline.map((phase, index) => (
        <View key={index} style={styles.timelineItem}>
          <View style={styles.timelineMarker}>
            <View style={styles.timelineDot} />
            {index < futureTimeline.length - 1 && <View style={styles.timelineLine} />}
          </View>
          <View style={styles.timelineContent}>
            <Text style={styles.timelinePeriod}>{phase.period}</Text>
            <Text style={styles.timelineTitle}>{phase.title}</Text>
            {phase.points.map((point, pointIndex) => (
              <View key={pointIndex} style={styles.timelinePoint}>
                <Feather name="check-circle" size={16} color={colors.mainYellow} />
                <Text style={styles.timelinePointText}>{point}</Text>
              </View>
            ))}
          </View>
        </View>
      ))}

      <View style={styles.futureComponents}>
        <Text style={styles.futureComponentsTitle}>Component Evolution</Text>
        
        {[
          { name: 'CPU', future: '16 cores + 64 qubit QPU' },
          { name: 'GPU', future: '15K cores + 128 qubit ray tracer' },
          { name: 'RAM', future: '1TB instant access qRAM' },
          { name: 'Storage', future: 'Quantum-safe encryption' },
        ].map((comp, index) => (
          <View key={index} style={styles.componentItem}>
            <MaterialCommunityIcons name="chip" size={24} color={colors.mainYellow} />
            <View style={styles.componentInfo}>
              <Text style={styles.componentName}>{comp.name}</Text>
              <Text style={styles.componentFuture}>{comp.future}</Text>
            </View>
          </View>
        ))}
      </View>
    </View>
  );

  const renderChallengesTab = () => (
    <View style={styles.tabContent}>
      <Text style={styles.sectionTitle}>Why You Can't Buy a Quantum PC... Yet</Text>

      {challenges.map((challenge, index) => (
        <View key={index} style={styles.challengeCard}>
          <Feather name={challenge.icon} size={32} color={colors.error} />
          <View style={styles.challengeContent}>
            <Text style={styles.challengeTitle}>{challenge.title}</Text>
            <Text style={styles.challengeIssue}>{challenge.issue}</Text>
            <View style={styles.progressContainer}>
              <View style={styles.progressBarBg}>
                <View
                  style={[styles.progressBarFill, { width: `${challenge.progress}%` }]}
                />
              </View>
              <Text style={styles.progressText}>{challenge.progress}%</Text>
            </View>
          </View>
        </View>
      ))}

      <View style={styles.conclusionCard}>
        <MaterialCommunityIcons name="lightbulb-on" size={32} color={colors.mainYellow} />
        <Text style={styles.conclusionText}>
          While quantum PCs aren't ready for consumers yet, research is progressing rapidly.
          By 2030, hybrid quantum-classical systems may start appearing in high-end workstations.
        </Text>
      </View>
    </View>
  );

  return (
    <ScreenLayout navigation={navigation}>
      <View style={styles.container}>
        {/* Hero Header */}
        <View style={styles.heroHeader}>
          <MaterialCommunityIcons name="atom" size={48} color={colors.mainYellow} />
          <Text style={styles.heroTitle}>Beyond Silicon:</Text>
          <Text style={styles.heroSubtitle}>The Quantum Revolution</Text>
          <Text style={styles.heroDescription}>
            Discover how quantum computing is reshaping the future of performance and possibility
          </Text>
        </View>

        {/* Tabs */}
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          style={styles.tabsContainer}
          contentContainerStyle={styles.tabsContent}
        >
          {tabs.map((tab) => (
            <TouchableOpacity
              key={tab.id}
              style={[styles.tab, activeTab === tab.id && styles.activeTab]}
              onPress={() => setActiveTab(tab.id)}
            >
              <Feather
                name={tab.icon}
                size={18}
                color={activeTab === tab.id ? 'white' : colors.platinum}
              />
              <Text
                style={[styles.tabText, activeTab === tab.id && styles.activeTabText]}
              >
                {tab.label}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>

        {/* Content */}
        <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
          {activeTab === 'basics' && renderBasicsTab()}
          {activeTab === 'comparison' && renderComparisonTab()}
          {activeTab === 'applications' && renderApplicationsTab()}
          {activeTab === 'future' && renderFutureTab()}
          {activeTab === 'challenges' && renderChallengesTab()}

          <View style={styles.footer}>
            <Text style={styles.footerText}>
              Want to learn more? Explore quantum computing resources and stay updated on the latest breakthroughs.
            </Text>
          </View>
        </ScrollView>
      </View>
    </ScreenLayout>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.mainBlack,
  },
  heroHeader: {
    padding: 24,
    alignItems: 'center',
    backgroundColor: colors.jet,
    borderBottomWidth: 2,
    borderBottomColor: colors.mainYellow,
  },
  heroTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: colors.mainYellow,
    marginTop: 12,
  },
  heroSubtitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: colors.mainYellow,
    marginBottom: 8,
  },
  heroDescription: {
    fontSize: 14,
    color: colors.platinum,
    textAlign: 'center',
    lineHeight: 20,
  },
  tabsContainer: {
    maxHeight: 60,
    borderBottomWidth: 1,
    borderBottomColor: colors.jet,
  },
  tabsContent: {
    paddingHorizontal: 12,
    paddingVertical: 12,
  },
  tab: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 8,
    marginRight: 8,
    borderRadius: 20,
    backgroundColor: colors.jet,
    gap: 6,
  },
  activeTab: {
    backgroundColor: colors.mainYellow,
  },
  tabText: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.platinum,
  },
  activeTabText: {
    color: 'white',
  },
  content: {
    flex: 1,
  },
  tabContent: {
    padding: 20,
  },
  sectionTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: colors.mainYellow,
    marginBottom: 16,
  },
  sectionText: {
    fontSize: 15,
    color: colors.platinum,
    lineHeight: 24,
    marginBottom: 16,
  },
  highlight: {
    color: colors.mainYellow,
    fontWeight: 'bold',
  },
  calloutCard: {
    flexDirection: 'row',
    backgroundColor: colors.jet,
    borderRadius: 12,
    padding: 16,
    marginBottom: 20,
    borderLeftWidth: 4,
    borderLeftColor: colors.mainYellow,
  },
  calloutContent: {
    flex: 1,
    marginLeft: 12,
  },
  calloutTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: colors.mainBeige,
    marginBottom: 6,
  },
  calloutText: {
    fontSize: 14,
    color: colors.platinum,
    lineHeight: 20,
  },
  visualDemo: {
    backgroundColor: colors.jet,
    borderRadius: 12,
    padding: 20,
    marginBottom: 20,
    alignItems: 'center',
  },
  visualTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: colors.mainBeige,
    marginBottom: 16,
  },
  toggleButton: {
    backgroundColor: colors.mainYellow,
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 24,
    marginBottom: 20,
  },
  toggleButtonText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: 'white',
  },
  bitDisplay: {
    alignItems: 'center',
  },
  bitBox: {
    width: 120,
    height: 120,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
  },
  bitValue: {
    fontSize: 48,
    fontWeight: 'bold',
    color: 'white',
  },
  qubitBox: {
    width: 120,
    height: 120,
    borderRadius: 60,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
  },
  qubitValue: {
    fontSize: 40,
    fontWeight: 'bold',
    color: 'white',
  },
  bitLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.mainBeige,
    textAlign: 'center',
  },
  analogyText: {
    fontSize: 14,
    color: colors.platinum,
    lineHeight: 22,
    fontStyle: 'italic',
    backgroundColor: colors.jet,
    padding: 16,
    borderRadius: 12,
  },
  comparisonRow: {
    backgroundColor: colors.jet,
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
  },
  comparisonFeature: {
    fontSize: 16,
    fontWeight: 'bold',
    color: colors.mainBeige,
    marginBottom: 12,
  },
  comparisonValues: {
    gap: 12,
  },
  comparisonItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  comparisonLabel: {
    fontSize: 14,
    fontWeight: '600',
    flex: 0.3,
  },
  comparisonValue: {
    fontSize: 13,
    color: colors.platinum,
    flex: 0.7,
  },
  applicationCard: {
    flexDirection: 'row',
    backgroundColor: colors.jet,
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
  },
  applicationIconContainer: {
    width: 56,
    height: 56,
    borderRadius: 28,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  applicationContent: {
    flex: 1,
  },
  applicationTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: colors.mainBeige,
    marginBottom: 6,
  },
  applicationDescription: {
    fontSize: 13,
    color: colors.platinum,
    lineHeight: 18,
    marginBottom: 8,
  },
  applicationStat: {
    fontSize: 12,
    fontWeight: 'bold',
  },
  timelineItem: {
    flexDirection: 'row',
    marginBottom: 24,
  },
  timelineMarker: {
    alignItems: 'center',
    marginRight: 16,
  },
  timelineDot: {
    width: 16,
    height: 16,
    borderRadius: 8,
    backgroundColor: colors.mainYellow,
  },
  timelineLine: {
    width: 2,
    flex: 1,
    backgroundColor: colors.mainYellow,
    marginTop: 4,
  },
  timelineContent: {
    flex: 1,
  },
  timelinePeriod: {
    fontSize: 14,
    fontWeight: 'bold',
    color: colors.mainYellow,
    marginBottom: 4,
  },
  timelineTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: colors.mainBeige,
    marginBottom: 12,
  },
  timelinePoint: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 8,
    gap: 8,
  },
  timelinePointText: {
    fontSize: 13,
    color: colors.platinum,
    flex: 1,
    lineHeight: 18,
  },
  futureComponents: {
    backgroundColor: colors.jet,
    borderRadius: 12,
    padding: 16,
    marginTop: 20,
  },
  futureComponentsTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: colors.mainBeige,
    marginBottom: 16,
  },
  componentItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
    gap: 12,
  },
  componentInfo: {
    flex: 1,
  },
  componentName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: colors.mainBeige,
  },
  componentFuture: {
    fontSize: 13,
    color: colors.platinum,
  },
  challengeCard: {
    flexDirection: 'row',
    backgroundColor: colors.jet,
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    gap: 12,
  },
  challengeContent: {
    flex: 1,
  },
  challengeTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: colors.mainBeige,
    marginBottom: 6,
  },
  challengeIssue: {
    fontSize: 13,
    color: colors.platinum,
    marginBottom: 12,
  },
  progressContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  progressBarBg: {
    flex: 1,
    height: 8,
    backgroundColor: colors.mainBlack,
    borderRadius: 4,
  },
  progressBarFill: {
    height: '100%',
    backgroundColor: colors.mainYellow,
    borderRadius: 4,
  },
  progressText: {
    fontSize: 12,
    fontWeight: 'bold',
    color: colors.mainYellow,
    width: 40,
  },
  conclusionCard: {
    flexDirection: 'row',
    backgroundColor: colors.jet,
    borderRadius: 12,
    padding: 16,
    marginTop: 8,
    gap: 12,
    alignItems: 'center',
  },
  conclusionText: {
    flex: 1,
    fontSize: 14,
    color: colors.platinum,
    lineHeight: 20,
  },
  footer: {
    padding: 20,
    alignItems: 'center',
  },
  footerText: {
    fontSize: 13,
    color: colors.platinum,
    textAlign: 'center',
    lineHeight: 20,
  },
});

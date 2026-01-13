import React, { createContext, useContext, useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

const CompareContext = createContext();

export const useCompare = () => {
  const context = useContext(CompareContext);
  if (!context) {
    throw new Error('useCompare must be used within a CompareProvider');
  }
  return context;
};

export const CompareProvider = ({ children }) => {
  const [compareList, setCompareList] = useState([]);

  // Load compare list from AsyncStorage on mount
  useEffect(() => {
    loadCompareList();
  }, []);

  // Save compare list to AsyncStorage whenever it changes
  useEffect(() => {
    saveCompareList();
  }, [compareList]);

  const loadCompareList = async () => {
    try {
      const saved = await AsyncStorage.getItem('compareList');
      if (saved) {
        setCompareList(JSON.parse(saved));
      }
    } catch (error) {
      console.error('Error loading compare list:', error);
    }
  };

  const saveCompareList = async () => {
    try {
      await AsyncStorage.setItem('compareList', JSON.stringify(compareList));
    } catch (error) {
      console.error('Error saving compare list:', error);
    }
  };

  const addToCompare = (product, category) => {
    setCompareList(prev => {
      // Check if product already exists
      if (prev.some(item => item.id === product.id)) {
        return prev;
      }

      // If adding first product or same category, add it
      if (prev.length === 0 || prev[0].category === category) {
        // Limit to 4 products for comparison
        if (prev.length >= 4) {
          return prev;
        }
        return [...prev, { ...product, category }];
      }
      
      // Different category - don't add
      return prev;
    });
  };

  const removeFromCompare = (productId) => {
    setCompareList(prev => prev.filter(item => item.id !== productId));
  };

  const clearCompare = async () => {
    setCompareList([]);
    try {
      await AsyncStorage.removeItem('compareList');
    } catch (error) {
      console.error('Error clearing compare list:', error);
    }
  };

  const isInCompare = (productId) => {
    return compareList.some(item => item.id === productId);
  };

  const getCategory = () => {
    return compareList.length > 0 ? compareList[0].category : null;
  };

  const canAddMore = () => {
    return compareList.length < 4;
  };

  const value = {
    compareList,
    addToCompare,
    removeFromCompare,
    clearCompare,
    isInCompare,
    getCategory,
    canAddMore
  };

  return (
    <CompareContext.Provider value={value}>
      {children}
    </CompareContext.Provider>
  );
};

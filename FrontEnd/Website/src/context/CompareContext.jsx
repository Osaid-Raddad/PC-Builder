import React, { createContext, useContext, useState, useEffect } from 'react';

const CompareContext = createContext();

export const useCompare = () => {
  const context = useContext(CompareContext);
  if (!context) {
    throw new Error('useCompare must be used within a CompareProvider');
  }
  return context;
};

export const CompareProvider = ({ children }) => {
  const [compareList, setCompareList] = useState(() => {
    try {
      const saved = localStorage.getItem('compareList');
      return saved ? JSON.parse(saved) : [];
    } catch (error) {
      console.error('Error loading compare list:', error);
      return [];
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem('compareList', JSON.stringify(compareList));
    } catch (error) {
      console.error('Error saving compare list:', error);
    }
  }, [compareList]);

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

  const clearCompare = () => {
    setCompareList([]);
    localStorage.removeItem('compareList');
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

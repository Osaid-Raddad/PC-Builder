import { useState } from 'react';
import { MdInventory } from 'react-icons/md';
import colors from '../../config/colors';

const ProductManagement = () => {
  return (
    <div className="space-y-6">
      <div className="text-center py-20">
        <MdInventory className="text-6xl mx-auto mb-4" style={{ color: colors.primary }} />
        <h1 className="text-3xl font-bold mb-2" style={{ color: colors.text }}>
          Product Management
        </h1>
        <p className="text-gray-500">
          Product management features coming soon...
        </p>
      </div>
    </div>
  );
};

export default ProductManagement;

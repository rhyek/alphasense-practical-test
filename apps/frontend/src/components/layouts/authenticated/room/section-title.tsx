import React from 'react';

export const SectionTitle: React.FC = ({ children }) => {
  return (
    <h3 style={{ margin: 0, marginTop: 5, marginBottom: 15 }}>{children}</h3>
  );
};

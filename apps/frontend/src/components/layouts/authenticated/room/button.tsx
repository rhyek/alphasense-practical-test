import React from 'react';

export const RoomButton: React.FC<
  React.ButtonHTMLAttributes<HTMLButtonElement>
> = ({ children, ...props }) => (
  <button {...props} style={{ display: 'block', width: '100%' }}>
    {children}
  </button>
);

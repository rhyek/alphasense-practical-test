import { memo } from 'react';

export const PanelTitle = memo(({ children }) => {
  return <em style={{ display: 'block', marginBottom: 10 }}>{children}</em>;
});

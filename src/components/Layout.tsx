import React from 'react';
import BottomNav from './BottomNav';
import AppHeader from './AppHeader';
import { Box } from '@mui/material';

interface LayoutProps {
  children: React.ReactNode;
  value: number;
  onBottomNavChange: (newValue: number) => void;
}

const Layout: React.FC<LayoutProps> = ({ children, value, onBottomNavChange }) => {

  const handleBottomNavChange = (newValue: number) => {
    onBottomNavChange(newValue);
  };

  return (
    <>
      <AppHeader />
      <Box sx={{ paddingTop: 5 }}>
        {children}
      </Box>
      <BottomNav value={value} onChange={handleBottomNavChange} />
    </>
  );
};

export default Layout;

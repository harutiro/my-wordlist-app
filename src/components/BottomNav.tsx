import React, { useEffect } from 'react';
import { BottomNavigation, BottomNavigationAction } from '@mui/material';
import HomeIcon from '@mui/icons-material/Home';
import QuizIcon from '@mui/icons-material/Quiz';
import { useNavigate, useLocation } from 'react-router-dom';

interface BottomNavProps {
  value: number;
  onChange: (newValue: number) => void;
}

const BottomNav: React.FC<BottomNavProps> = ({ value, onChange }) => {
  const navigate = useNavigate();
  const location = useLocation();

  // URLに基づいてvalueを設定
  useEffect(() => {
    if (location.pathname === '/') {
      onChange(0); // Homeタブ
    } else if (location.pathname === '/quiz') {
      onChange(1); // Quizタブ
    }
  }, [location.pathname, onChange]);

  // クリック時にvalueを更新
  const handleNavigation = (newValue: number, path: string) => {
    onChange(newValue);  // onChangeでvalueを更新
    navigate(path);      // ページ遷移
  };

  return (
    <BottomNavigation
      value={value}
      onChange={(_, newValue) => onChange(newValue)} // onChangeでnewValueを更新
      showLabels
      sx={{ position: 'fixed', bottom: 0, width: '100%' }}
    >
      <BottomNavigationAction
        label="Home"
        icon={<HomeIcon />}
        onClick={() => handleNavigation(0, '/')} // Homeタブを選択
        sx={{
            // 選択されたタブの色をより確実に設定する
            color: (theme) => (value === 0 ? theme.palette.primary.main : theme.palette.text.secondary),
          }}
      />
      <BottomNavigationAction
        label="Quiz"
        icon={<QuizIcon />}
        onClick={() => handleNavigation(1, '/quiz')} // Quizタブを選択
        sx={{
            color: (theme) => (value === 1 ? theme.palette.primary.main : theme.palette.text.secondary),
          }}
      />
    </BottomNavigation>
  );
};

export default BottomNav;

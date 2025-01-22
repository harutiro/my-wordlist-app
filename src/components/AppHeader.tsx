import { AppBar, Toolbar, Typography } from '@mui/material';

const AppHeader = () => {
  return (
    <AppBar position="sticky" color="primary">
      <Toolbar>
        <Typography variant="h6" sx={{ flexGrow: 1 }}>
          Word List
        </Typography>
      </Toolbar>
    </AppBar>
  );
};

export default AppHeader;

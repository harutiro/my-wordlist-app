import { useLocation, useNavigate } from 'react-router-dom';
import { useState } from 'react';
import { Container, Card, Typography, Box, Button } from '@mui/material';
import Layout from '../components/Layout';

const ResultPage = () => {
  const [value, setValue] = useState(0);
  const location = useLocation();
  const navigate = useNavigate();
  const { correctAnswers, totalQuestions } = location.state || { correctAnswers: 0, totalQuestions: 0 };

  // 編集画面に戻る処理
  const handleEditClick = () => {
    navigate('/'); // ここで編集画面のルートに遷移
  };

  // クイズをもう一度やり直す処理
  const handleRetryClick = () => {
    navigate('/quiz'); // クイズ画面に戻る
  };

  return (
    <Layout value={value} onBottomNavChange={(newValue) => setValue(newValue)}>
      <Container sx={{ marginTop: 3 }}>
        <Box>
          <Card sx={{ padding: 3, textAlign: 'center' }}>
            <Typography variant="h4" gutterBottom>
              クイズ結果
            </Typography>
            <Typography variant="h5">
              正解数: {correctAnswers} / {totalQuestions}
            </Typography>
            <Typography variant="body1" sx={{ marginTop: 2 }}>
              {correctAnswers / totalQuestions >= 0.5 ? 'おめでとうございます!' : '次は頑張りましょう！'}
            </Typography>
            <Box sx={{ marginTop: 3, display: 'flex', justifyContent: 'center', gap: 2 }}>
              <Button
                variant="contained"
                color="primary"
                onClick={handleRetryClick} // 再試行ボタンの処理
              >
                もう一度
              </Button>
              <Button
                variant="outlined"
                color="secondary"
                onClick={handleEditClick} // 編集画面に戻るボタンの処理
              >
                編集画面に戻る
              </Button>
            </Box>
          </Card>
        </Box>
      </Container>
    </Layout>
  );
};

export default ResultPage;

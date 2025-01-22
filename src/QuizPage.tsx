import { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { Box, Button, Card, Container, Typography } from '@mui/material';
import Layout from './components/Layout';

interface Word {
  id: string;
  write: string;
  read: string;
  answers?: string[];
}

const QuizPage = () => {
  const [wordList, setWordList] = useState<Word[]>([]);
  const [questionNumber, setQuestionNumber] = useState<number>(0);
  const [question, setQuestion] = useState<Word>({} as Word);
  const [value, setValue] = useState(0);
  const navigate = useNavigate();

  useEffect(() => {
    const savedWords = JSON.parse(localStorage.getItem('wordList') || '[]');
    setWordList(savedWords);
    if (savedWords.length > 0) {
      setQuestion(savedWords[0]);
    }
  }, []);

  useEffect(() => {
    // question.readが変わった時だけリクエストを発行する
    if (question.read) {
      axios
        .get(`https://word2vec.harutiro.net/near?get_number=50&str=${question.read}`)
        .then((response) => {
          if (response.data.status === 'OK') {
            const nearList = [
              response.data.data[Math.floor(Math.random() * 50)],
              response.data.data[Math.floor(Math.random() * 50)],
              question.read,
            ];
            setQuestion((prev) => ({
              ...prev,
              answers: nearList.sort(() => Math.random() - 0.5),
            }));
          }
        })
        .catch((error) => console.error(error));
    }
  }, [question.read]); // question.readが変更されたときだけ発火

  const handleAnswerClick = (answer: string) => {
    const correct = answer === question.read;
    alert(correct ? '正解!' : '不正解...');
    if (questionNumber < wordList.length - 1) {
      setQuestionNumber(questionNumber + 1);
      setQuestion(wordList[questionNumber + 1]);
    } else {
      alert('クイズ終了!');
      navigate('/');
    }
  };

  if (!question.id) return <div>Loading...</div>;

  return (
    <Layout value={value} onBottomNavChange={(newValue) => setValue(newValue)}>
      <Container sx={{ marginTop: 3 }}>
        <Box>
          <Card sx={{ padding: 3, textAlign: 'center' }}>
            <Typography variant="h4" gutterBottom>
              {question.write}
            </Typography>

            <Box display="flex" justifyContent="center" flexWrap="wrap" gap={2}>
              {question.answers?.map((answer) => (
                <Button
                  key={answer}
                  variant="contained"
                  color="primary"
                  onClick={() => handleAnswerClick(answer)}
                  sx={{ width: '100px', height: '50px' }}
                >
                  {answer}
                </Button>
              ))}
            </Box>
          </Card>
        </Box>
      </Container>
    </Layout>
  );
};

export default QuizPage;

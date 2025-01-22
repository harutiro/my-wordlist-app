import { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { Box, Button, Card, Container, Typography, Alert } from '@mui/material';
import Layout from '../components/Layout';

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
  const [correctAnswers, setCorrectAnswers] = useState<number>(0); // 正解数を管理
  const [alertMessage, setAlertMessage] = useState<string>(''); // アラートメッセージ
  const [alertSeverity, setAlertSeverity] = useState<'success' | 'error'>('success'); // アラートの種類
  const [showAlert, setShowAlert] = useState<boolean>(false); // アラート表示の状態
  const [showNextButton, setShowNextButton] = useState<boolean>(false); // 次の問題ボタンの表示制御
  const [quizFinished, setQuizFinished] = useState<boolean>(false); // クイズ終了フラグ
  const navigate = useNavigate();

  useEffect(() => {
    const savedWords = JSON.parse(localStorage.getItem('wordList') || '[]');
    setWordList(savedWords);
    if (savedWords.length > 0) {
      setQuestion(savedWords[0]);
    }
  }, []);

  useEffect(() => {
    // wordListが空のときにエラーメッセージを表示
    if (wordList.length === 0) return;

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
  }, [question.read, wordList]); // wordListが空でないかも確認

  const playSound = (correct: boolean) => {
    const sound = new Audio(correct ? '/correct.mp3' : '/incorrect.mp3');
    sound.play();
  };

  const handleAnswerClick = (answer: string) => {
    const correct = answer === question.read;
    if (correct) {
      setCorrectAnswers((prev) => prev + 1); // 正解したらカウントアップ
    }

    // 正解・不正解のメッセージとアラートの種類を設定
    setAlertMessage(correct ? '正解!' : `不正解... 正しい答えは「${question.read}」です`);
    setAlertSeverity(correct ? 'success' : 'error');
    setShowAlert(true);

    playSound(correct);  // 正解音または不正解音を再生

    // 「次の問題」ボタンを表示
    setShowNextButton(true);
  };

  const handleNextQuestion = () => {
    if (questionNumber < wordList.length - 1) {
      setQuestionNumber(questionNumber + 1);
      setQuestion(wordList[questionNumber + 1]);
      setShowAlert(false); // アラートを非表示
    } else {
      // クイズ終了のアラートを表示
      setAlertMessage('クイズ終了!');
      setAlertSeverity('success');
      setQuizFinished(true); // クイズ終了フラグを設定
      setShowAlert(true);
    }
    setShowNextButton(false); // 次の問題ボタンを非表示
  };

  const handleFinishQuiz = () => {
    // 結果画面に遷移
    navigate('/result', { state: { correctAnswers, totalQuestions: wordList.length } });
  };

  if (wordList.length === 0) {
    return (
      <Layout value={value} onBottomNavChange={(newValue) => setValue(newValue)}>
        <Container sx={{ marginTop: 3 }}>
          <Box>
            <Card sx={{ padding: 3, textAlign: 'center' }}>
              <Typography variant="h4" gutterBottom>
                単語リストが空です
              </Typography>
              <Typography variant="body1">
                単語リストに単語を追加してから問題を開始してください。
              </Typography>
              <Button
                variant="contained"
                color="primary"
                sx={{ marginTop: 2 }}
                onClick={() => navigate('/')}
              >
                単語を追加
              </Button>
            </Card>
          </Box>
        </Container>
      </Layout>
    );
  }

  if (!question.id) return <div>Loading...</div>;

  return (
    <Layout value={value} onBottomNavChange={(newValue) => setValue(newValue)}>
      <Container sx={{ marginTop: 3 }}>
        <Box>
          <Card sx={{ padding: 3, textAlign: 'center' }}>
            <Typography variant="h4" gutterBottom>
              {question.write}
            </Typography>

            {/* アラートメッセージを表示 */}
            {showAlert && (
              <Alert severity={alertSeverity} sx={{ marginBottom: 2 }}>
                {alertMessage}
              </Alert>
            )}

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

            {/* 最終問題の場合 */}
            {quizFinished ? (
              <Button
                variant="contained"
                color="primary"
                onClick={handleFinishQuiz}
                sx={{ marginTop: 2 }}
              >
                リザルトへ進む
              </Button>
            ) : (
              // 次の問題へボタン
              showNextButton && (
                <Button
                  variant="contained"
                  color="primary"
                  onClick={handleNextQuestion}
                  sx={{ marginTop: 2 }}
                >
                  次の問題へ
                </Button>
              )
            )}
          </Card>
        </Box>
      </Container>
    </Layout>
  );
};

export default QuizPage;

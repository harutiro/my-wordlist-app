import { useState, useEffect } from 'react';
import axios from 'axios';
import { Button, TextField, Card, CardContent, Typography, Box, Container } from '@mui/material';
import { v4 as uuidv4 } from 'uuid';
import Layout from '../components/Layout';
import DeleteIcon from '@mui/icons-material/Delete';

interface Word {
  id: string;
  write: string;
  read: string;
}

const App = () => {
  const [wordList, setWordList] = useState<Word[]>([]);
  const [writeText, setWriteText] = useState<string>('');
  const [readText, setReadText] = useState<string>('');
  const [value, setValue] = useState(0);

  useEffect(() => {
    const savedWords = JSON.parse(localStorage.getItem('wordList') || '[]');
    setWordList(savedWords);
  }, []);

  const addWord = async () => {
    if (!writeText || !readText) {
      alert('単語と意味を入力してください');
      return;
    }

    try {
      const response = await axios.get(
        `https://word2vec.harutiro.net/near?get_number=50&str=${readText}`
      );
      if (response.data.status === 'OK') {
        const newWord: Word = {
          id: uuidv4(),
          write: writeText,
          read: readText,
        };
        const updatedList = [...wordList, newWord];
        setWordList(updatedList);
        localStorage.setItem('wordList', JSON.stringify(updatedList));

        setWriteText('');
        setReadText('');
      } else {
        alert('問題の自動生成に使えない単語です、他の単語を入力してください');
      }
    } catch (error) {
      console.error(error);
    }
  };

  const handleDelete = (id: string) => {
    const updatedList = wordList.filter((word) => word.id !== id);
    setWordList(updatedList);
    localStorage.setItem('wordList', JSON.stringify(updatedList));
  };

  const handleNavigation = (newValue: number) => {
    setValue(newValue);
  };

  return (
    <Layout value={value} onBottomNavChange={handleNavigation}>
      <Container maxWidth="md">
        <Typography variant="h3" gutterBottom align="center">
          単語リスト
        </Typography>

        <Box display="flex" flexDirection="column" alignItems="center" mb={3}>
          <TextField
            label="単語"
            variant="outlined"
            value={writeText}
            onChange={(e) => setWriteText(e.target.value)}
            sx={{ mb: 2 }}
            fullWidth
          />
          <TextField
            label="意味"
            variant="outlined"
            value={readText}
            onChange={(e) => setReadText(e.target.value)}
            sx={{ mb: 2 }}
            fullWidth
          />
          <Button
            variant="contained"
            color="primary"
            onClick={addWord}
            sx={{ width: '200px', height: '50px' }}
          >
            保存
          </Button>
        </Box>

        {wordList.map((word) => (
          <Card key={word.id} sx={{ marginBottom: 2, borderRadius: '12px', position: 'relative' }}>
            <CardContent>
              <Typography variant="h5" component="div" color="primary">
                {word.write}
              </Typography>
              <Typography variant="body1" color="textSecondary">
                {word.read}
              </Typography>
              {/* ゴミ箱アイコン */}
              <Button
                variant="outlined"
                color="error"
                onClick={() => handleDelete(word.id)}
                sx={{
                  position: 'absolute',
                  top: 8,
                  right: 8,
                  minWidth: 'auto',
                  padding: 0,
                  '& svg': {
                    fontSize: 28,
                  },
                }}
              >
                <DeleteIcon />
              </Button>
            </CardContent>
          </Card>
        ))}
      </Container>
    </Layout>
  );
};

export default App;

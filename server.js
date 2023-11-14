const { log } = require('console');
const express = require('express');
require('dotenv').config();
const { Configuration, OpenAIApi } = require('openai');
const path = require('path');

const app = express();
app.use(express.json());
const port = process.env.PORT || 3000;
app.use(express.static('src'));


app.post('/', async (req, res) => {
  try {
    const apiKey = req.body.api_key;
    const message = req.body.message;

    if (!apiKey) {
      return res.status(201).json({ message: 'API key is missing in the request body.' });
    }

    if (message.toLowerCase().includes('your name') || message.toLowerCase() === 'how i can call you') {
      const responses = [
        `I'm Cherry, in honor of a very beautiful girl who is a very important person to my creator.`,
        `I'm Cherry, and I'm happy to bear that name.`,
        `My name is Cherry, but my real name on passport is Ellen.`,
        `You can refer to me as Cherry. How can I assist you today?`
      ]
      let index = Math.floor(Math.random() * 10)%4;
      return res.status(200).json({ message:  responses[index]});
    }

    const configuration = new Configuration({
      apiKey: apiKey,
    });

    const openai = new OpenAIApi(configuration);

    

    const completion = await openai.createCompletion({
      model: 'gpt-3.5-turbo-instruct',
      prompt: message,
      max_tokens: 2048,
    });
    const responseText = completion.data.choices[0].text;
    res.json({
      response: responseText,
    });
    
  } catch (error) {
    console.log(error);
    res.status(400).json({ error_message: 'Wrong API key or poor connection.' });
  }
});

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});

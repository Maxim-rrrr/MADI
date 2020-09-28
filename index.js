const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const config = require('config')


const app = express();
const PORT = config.get('port') || 4000

async function start() {
  try {
    await mongoose.connect(config.get('mongoUri'), { 
      useNewUrlParser: true,
      useCreateIndex: true,
      useUnifiedTopology: true
    })
    app.listen(PORT, () => console.log(`Сервер прослушивает порт: ${PORT} `));
  } catch (err) {
    console.log('Server error', err.message);
    process.exit(1)
  }
}

start()

app.use(bodyParser.json());
app.use('/api', require('./api'));
app.use('/uploads', express.static('uploads'))

/*
 * Подключение express по стандарту ES5, 
 * так как Node не поддерживает ES6
 */
const express = require('express');

// Подключаем базу данных
const mongoose = require('mongoose');

// Подключение body-parser для чтения тела запроса в формате json
const bodyParser = require('body-parser');

// express() - основная функция фремворка express 
const app = express();

// mongodb://localhost/customer-db - адресс БД
mongoose.connect("mongodb://localhost/customer-db", { useNewUrlParser: true, useUnifiedTopology: true });

app.use(bodyParser.json());

/* 
 * Этот метод позволяет все запросы, 
 * начинающиеся на строку в первом аргументе отправлять в файл
 * переданный во втором аргументе
 */
app.use('/api',  require('./api'));

/*
 * Порт
 * И CallBack function, вызываемая 
 * после обращения к серверу
 */
const port = 4000;

app.listen(port, () => {
  console.log('Сервер прослушивает порт ' + port);
});
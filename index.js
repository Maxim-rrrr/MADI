const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const config = require('config')
const path = require('path')

const app = express();

app.use(bodyParser.json());
app.use('/api', require('./api'));
app.use('/uploads', express.static('uploads'))

if (process.env.NODE_ENV === 'production') {
  app.use('/', express.static(path.join(__dirname, 'client', 'build')))

  app.get('*', (req, res) => {
    res.sendFile(path.resolve(__dirname, 'client', 'build', 'index.html'))
  })
}

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

// Проверка подтверждённых платежей
const YandexCheckout = require('yandex-checkout')('Ваш идентификатор магазина', 'Ваш секретный ключ');
const Payment = require('./Schemes/Payment')
const Task = require('./Schemes/Task')
const nodemailer = require('nodemailer')

setInterval(async () => {
  let payments = await Payment.find({}).then()

  payments.forEach((payment) => {

    YandexCheckout.getPayment(payment.id)
    .then((result) => {
      
      if (result.status === "succeeded") {
        console.log('payment.description: ', payment.description);
        let description = JSON.parse(payment.description)

        // Подготовка изображений 
        let attachments = []
        let subject, work, variant
        subject = Task.findOne({name: description.subject}).then()

        // Предмет 
        subject.works.forEach(w => {
          if (w.name === description.work) {
            work = w
          }
        })

        // Вариант
        work.variant.forEach((v, i) => {
          if (i + 1 === +description.variant) {
            variant = v
          }
        })

        // Задания
        variant.forEach((t, i) => {
          if (description.tasks.includes(i + 1)) {
            t.img.forEach(img => {
              attachments.push({
                filename: `Задание_${i + 1}.jpg`,
                path: `./uploads/${img}`,
                cid: 'unique@cid'
              })
            })
          }
        })

        // Отпрака
        async function mail (req, res) {
          try {
        
            let transporter = nodemailer.createTransport({
              host: 'smtp.mail.ru',
              port: 465,
              secure: true, // true for 465, false for other ports
              auth: {
                user: 'sendingmessage1@mail.ru',
                pass: 'Eo$P4KuuioP1'
              }
            })
                 
            await transporter.sendMail({
              from: '"Работы по курсам мади" <sendingmessage1@mail.ru>',
              to: description.email,
              subject: 'Решения',
              text: '',
              html: `Предмет: ${description.subject}<br> Работа: ${work}<br> Вариант: ${variant}<br> Заданий: ${tasks.join(', ')}`,
              attachments: attachments,
              
            })
      
            console.log(`Отправленны решения ${description.email}`)
            Payment.deleteOne({_id: payment._id}).then()

          } catch (err) { console.log(`Ошибка отправки решений ${err}`) }
        }
      
        mail(req, res);        
      }

    })
    .catch((err) => {
      console.error(err);
    })

  })
  
}, 10000)

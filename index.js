const express = require('express')
const mongoose = require('mongoose')
const bodyParser = require('body-parser')
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
    console.log('База данных подключена');
    app.listen(PORT, () => console.log(`Сервер прослушивает порт: ${PORT} `));
  } catch (err) {
    console.log('Server error', err.message);
    process.exit(1)
  }
}

start()

// Функция логирования 
const dayjs = require('dayjs')
const Log = require('./Schemes/Log')

function logger(status = 200, message = '') {
  Log.create({
    time: `${dayjs().get('D')}-${(dayjs().get('M') + 1)}-${dayjs().get('y')}_${dayjs().get('h')}:${dayjs().get('m')}:${dayjs().get('s')}:${dayjs().get('ms')}`,
    status,
    message
  })
}


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
        result = JSON.parse(result)
        if (result.status === "succeeded") {
          console.log('payment.description: ', payment.description);
          let description = JSON.parse(payment.description)
          
          if (description.type == 1) { // Оплата работ

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
  
            // Отправка
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
                
                logger(status = 200, message = `Отправленны решения: ${description.email} Предмет: ${description.subject} Работа: ${work} Вариант: ${variant} Заданий: ${tasks.join(', ')} `)
                console.log(`Отправленны решения ${description.email}`)
                Payment.deleteOne({_id: payment._id}).then()
  
              } catch (err) { 
                logger(status = 500, message = `Ошибка отправки решений ${err}`)
                console.log(`Ошибка отправки решений ${err}`) 
              }
            }
          
            mail(req, res);  
                  
          } else if (description.type == 2) { // Пополнение баланса
            try {
              sum = +result.amount.value
              user_token = description.token
  
              user = Сustomer.findOne({token: user_token}).then()
              user.balance += sum;
  
              Сustomer.findByIdAndUpdate({token: user_token},{balance: user.balance}).then()
              logger(status = 200, message = `Пополнение счёта: ${description.email} Сумма: ${result.amount.value} руб.`)
            } catch (err) {
              logger(status = 500, message = `Ошибка пополнение счёта: ${description.email} Сумма: ${result.amount.value} руб.`)
            }
          }
        }

      })
      .catch((err) => {
        logger(status = 500, message = `Ошибка запрова неоплаченных платежей ${err}`)
        console.error(err);
      })

  })
  
}, 10000)


// Отправка отчётов раз в неделю
const crontab = require('node-crontab')

crontab.scheduleJob("* * * * */7", async () => { 
  let loges = await Log.find({}).then()

  let messageHTML = '<head><style>.log{display:flex;justify-content:space-between;margin-bottom:10px}.log--e{background:#c72020}.t{margin:0 15px;white-space:nowrap}</style></head> <body>'

  loges.forEach(log => {
    let mod = ''
    if (log.status != 200 || log.status != '200') {
      mod = ' log--e'
    }
    messageHTML += '<div class="log' + mod + '"><span>' + log.status + '</span>' +
    '<span class="t">' + log.time + '</span><span>' + 
    log.message + '</span></div>'
  })

  if (loges.length === 0) {
    messageHTML = 'Записей нет'
  } else {
    messageHTML +='</body>'
  }

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
      from: '"Мади" <sendingmessage1@mail.ru>',
      to: 'kewin.rrrr@gmail.com',
      subject: 'Отчёт',
      text: '',
      html: messageHTML
    })
    
    console.log(`Отчёт отправлен`)
    Log.deleteMany({}).then()
  } catch (err) { 
    logger(status = 500, message = `Ошибка отправки отчёта`)
    console.log(`Ошибка отправки отчёта: ${err}`) 
  }

});
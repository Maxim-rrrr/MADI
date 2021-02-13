const YandexCheckout = require('yandex-checkout')('778992', 'live_mI9nD9Zhg3zO0AzsQRZ4WzyNmbE2Ccasn4BGjTKDUPw');
const Payment = require('../Schemes/Payment')
const Task = require('../Schemes/Task')
const Сustomer = require('../Schemes/Customer')
const nodemailer = require('nodemailer')

const logger = require('./logger')
const config = require('config')

exports.checkPayment = async () => {
  let payments = await Payment.find({}).then()

  payments.forEach((payment) => {
    YandexCheckout.getPayment(payment.id)
      .then((result) => {
        if (result.status === "succeeded") {
          let description = JSON.parse(result.description)
          
          const bonus = async () => {
            // Отправка 5% от покупки пригласителю
            let U = await Сustomer.findOne({token: description.token}).then()
  
            if (U.inviting) {
              let invit_user = await Сustomer.findOne({email: U.inviting}).then()
  
              Сustomer.findOneAndUpdate({token: invit_user.token},{
                balance: +invit_user.balance + (+result.amount.value * 0.1)
              }).then()
  
            }

          }


          if (description.type == 1) { // Оплата работ

            // Подготовка изображений 
            let attachments = []
            let subject = Task.findOne({name: description.subject}).then()
  
            solutions = subject.tasks
            description.categories.forEach(item => {
              solutions.forEach(task => {
                if (task.name === item) {
                  solutions = task.tasks
                }
              })
            })

            // Задания
            solutions.forEach((t, i) => {
              if (description.tasks.includes(i + 1)) {
                t.img.forEach(img => {

                  let ind = -1
                  for (let j = img.length - 1; j !== 0; j--) {
                    if (img[j] === '.') {
                      ind = j
                      break
                    } 
                  }

                  attachments.push({
                    filename: `${i + 1 + img.substring(ind)}`,
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
                    user: config.get('emailSendMessage'),
                    pass: config.get('passSendMessage')
                  }
                })
                    
                await transporter.sendMail({
                  from: '"Работы по курсам мади" <' +  config.get('emailSendMessage') + '>',
                  to: description.email,
                  subject: 'Решения',
                  text: '',
                  html: `Предмет: ${description.subject}<br> Раздел: ${description.categories.join(' -> ')} <br> Задания: ${description.tasks.join(', ')}`,
                  attachments: attachments,
                  
                })
                
                logger.logger(status = 200, message = `Отправленны решения: ${description.email}  Предмет: ${description.subject} Раздел: ${description.categories.join(' -> ')} Заданий: ${description.tasks.join(', ')} `)
                console.log("\x1b[32m", `Отправленны решения ${description.email}`)
                Payment.deleteOne({_id: payment._id}).then()

                let user = await Сustomer.findOne({token: description.token}).then()
                Сustomer.findOneAndUpdate({token: user.token}, {
                  orders: [...user.orders, {
                    'subject': description.subject,
                    'work': description.work,
                    'variant': description.variant,
                    'tasks': description.tasks.join(', ')
                  }],
                  summa: user.summa + +result.amount.value
                }).then()
              } catch (err) { 
                logger.logger(status = 500, message = `Ошибка отправки решений ${err}`)
                console.log("\x1b[41m", `Ошибка отправки решений ${err}`) 
              }
            }
          
            mail(req, res);  
                  
          } else if (description.type == 2) { // Пополнение баланса
            try {
              sum = +result.amount.value
              user_token = description.token
              console.log(`user_token ---- ${user_token}`)
              const addBalanse = async () => {
                let user = await Сustomer.findOne({token: user_token}).then()
                user.balance += sum;
    
                Сustomer.findOneAndUpdate({token: user_token},{
                  balance: user.balance,
                  summa: user.summa + +result.amount.value
                }).then()
                logger.logger(status = 200, message = `Пополнение счёта: ${description.email} Сумма: ${result.amount.value} руб.`)
                Payment.deleteOne({id: payment.id}).then()
              }

              addBalanse()

            } catch (err) {
              logger.logger(status = 500, message = `Ошибка пополнение счёта: ${description.email} Сумма: ${result.amount.value} руб.`)
            }
          }
        }

      })
      .catch((err) => {
        logger.logger(status = 500, message = `Ошибка запрова неоплаченных платежей ${err}`)
        console.error(err);
      })

  })
  
}
const nodemailer = require('nodemailer')
const logger = require('./logger')
const config = require('config')
const Log = require('../Schemes/Log')

exports.sendReports = async () => { 
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
        user: config.get('emailSendMessage'),
        pass: config.get('passSendMessage')
      }
    })
        
    await transporter.sendMail({
      from: '"Мади" <' +  config.get('emailSendMessage') + '>',
      to: 'kewin.rrrr@gmail.com',
      subject: 'Отчёт',
      text: '',
      html: messageHTML
    })
    
    console.log("\x1b[32m", `Отчёт отправлен`)
    Log.deleteMany({}).then()
  } catch (err) { 
    logger.logger(status = 500, message = `Ошибка отправки отчёта`)
    console.log("\x1b[31m", `Ошибка отправки отчёта: ${err}`) 
  }

}
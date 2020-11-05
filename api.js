const express = require('express')
const router = express.Router()
const dayjs = require('dayjs')

const Сustomer = require('./Schemes/Customer')
const Admin = require('./Schemes/Admin')
const Task = require('./Schemes/Task')
const Payment = require('./Schemes/Payment')
const Log = require('./Schemes/Log')

const nodemailer = require('nodemailer')
const crypto = require("crypto");

function logger(status = 200, message = '') {
  Log.create({
    time: `${dayjs().get('D')}-${(dayjs().get('M') + 1)}-${dayjs().get('y')}_${dayjs().get('h')}:${dayjs().get('m')}:${dayjs().get('s')}:${dayjs().get('ms')}`,
    status,
    message
  })
}


/////// Работа с пользователями ///////

// Получение всего списка пользователей 
router.post('/customers', (req, res)=>{
  Сustomer.find({})
    .then(customer => {
      res.send(customer);
    });
});

// Получение пользователя по id 
router.post('/customers/:id', (req, res)=>{
  Сustomer.findOne({_id: req.params.id})
    .then(customer => {
      res.send(customer);
    });
});

// Вход
router.post('/login', (req, res)=>{
  try {
    Сustomer.findOne({email: req.body.email})
      .then(customer => {
        if (customer) {

          if (req.body.password === customer.password) {
            res.send({status: 200, user: customer});
          } else {
            res.send({status: 400, message: 'Неверный логин или пароль'});
          }

        } else {
          res.send({status: 400, message: 'Неверный логин или пароль'});
        }
      });

  } catch (error) {
    logger(status = 500, message = `Ошибка сервера при входе пользователя: ${err}`)
    res.send(error);
  }

});

// Вход админа
router.post('/login-admin', (req, res)=>{
  try {
    Admin.findOne({
      name: req.body.name,
      password: req.body.password
    })
    .then(admin => {
      if (admin) {

        res.send({status: 200, token: admin.token});

      } else {
        res.send({status: 400, message: 'Неверный логин или пароль'});
      }
    });

  } catch (error) {
    logger(status = 500, message = `Ошибка сервера при входе админа: ${err}`)
    res.send(error);
  }

});

// Проверка на админа
router.post('/isAdmin', (req, res) => {
  try {
    Admin.findOne({
      token: req.body.token
    })
    .then(async (admin) => {
      if (admin) {

        res.send({ status: 200 });

      } else {

        if (req.body.userToken) {
          let user = await Сustomer.findOne({ token: req.body.userToken }).then()
          logger(status = 400, message = `Попытка несанкционированного ввода в админку: от пользователя ${user.email}`)
        } else {
          logger(status = 400, message = `Попытка несанкционированного ввода в админку`)
        }

        res.send({ status: 400, message: 'Попытка несанкционированного ввода в админку' });
        
      }
    });

  } catch (error) {
    logger(status = 500, message = `Ошибка сервера при входе админа: ${err}`)
    res.send(error);
  }

});

// Получение id пользователя по email
router.post('/getId', (req, res)=>{
  try {
    Сustomer.findOne({email: req.body.email})
      .then(customer => {
        if (customer) {
          res.send({status: 200, id: customer._id});
        } else {
          res.send({status: 400, message: 'Несуществующий email'});
        }
      });

  } catch (error) {
    res.send(error);
  }

});

// Получение пользователя по token
router.post('/getCustomer', (req, res)=>{
  try {
    Сustomer.findOne({token: req.body.token})
      .then(customer => {
        if (customer) {
          if (req.body.counter) {
            res.send({status: 200, customer, counter: req.body.counter});
          }
          res.send({status: 200, customer});
        } else {
          res.send({status: 400, message: req.body.token});
        }
      });

  } catch (error) {
    res.send(error);
  }

});

// Отправка кода подтверждения
router.post('/code', (req, res)=>{
  async function mail (req, res) {
    try {
  
      let transporter = nodemailer.createTransport({
        host: 'smtp.mail.ru',
        port: 465,
        secure: true, // true for 465, false for other ports
        auth: {
          user: 'sendingmessage2@mail.ru',
          pass: 'tyjNaPOuA12&'
        }
      })
      
      let code = Math.floor(Math.random() * 900000 + 100000);

      let result = await transporter.sendMail({
        from: '"Работы по курсам мади" <sendingmessage2@mail.ru>',
        to: req.body.email,
        subject: 'Код подтверждения',
        text: '',
        html: '<b>Завершите регистрацию <br/> Код подтверждения: </b><h1> ' + code + ' </h1>'
        
      })

      res.send({
        result: result,
        code: code
      });
      
    } catch (err) {
      console.log(`status: 500`, `message: Ошибка сервера при отправке кода подтверждения: ${err}`);
      logger(status = 500, message = `Ошибка сервера при отправке кода подтверждения: ${err}`)
      res.send({
        error: err,
        massage: 'Наташа, мы всё уронили'
      });
  
    }
  }

  mail(req, res);

});

// Добавление пользователя
router.post('/add-user', (req, res)=> {
  
  try {
    Сustomer.create(req.body)
      .then((customer) => {
        
        let sha256 = crypto.createHash("sha256")
        sha256.update(customer._id + '', "utf8")

        let token = sha256.digest("base64")

        Сustomer.findByIdAndUpdate({_id: customer.id},{token: token}).then()

        customer.token = token
        res.send(customer)
      });
  } catch (err) {
    logger(status = 500, message = `Ошибка сервера при регистрации пользователя: ${err}`)
    res.send(err);
  }
  
  
});

// Изменение по id
router.post('/user-edit/:id', (req, res)=> {
  try {
    Сustomer.findByIdAndUpdate({_id: req.params.id}, req.body)
    .then(() => {
      Сustomer.findOne({_id: req.params.id})
        .then(customer => {
          res.send(customer);
        });
    });
  } catch (err) {
    logger(status = 500, message = `Ошибка сервера при изменении данных пользователя: ${err}`)
    res.send(err)
  }
  
});


/////// Работа с заданиями ///////

// Добавление
router.post('/addTask', (req, res) => {
  try {
    Task.create(req.body)
      .then(name => {
        res.send(name)
      });

  } catch (err) { 
    logger(status = 500, message = `Ошибка добавления предмета: ${err}`)
    res.send({ status: 500, err }) 
  }
});

// Получение всего списка
router.post('/getTasks', (req, res) => {
  try {
    Task.find({})
    .then(tasks => {
      res.send({ status: 200, tasks });
    });
  } catch (err) { 
    logger(status = 500, message = `Ошибка получения всех заданий из БД: ${err}`)
    res.send({ status: 500, err }) 
  }
  
});

// Изменение предмета по id
router.post('/setTask/:id', (req, res) => {
  try {
    Task.findByIdAndUpdate({_id: req.params.id}, req.body)
    .then(() => {
      Task.findOne({_id: req.params.id})
        .then(task => {
          res.send({ status: 200, task });
        });
    });
  } catch (err) {
    logger(status = 500, message = `Ошибка изменения предмета: ${err}`)
    res.send(err)
  }
  
});

// Удаление предмета по id
router.post('/removeTask/:id', (req, res) =>{
  try {
    Task.deleteOne({_id: req.params.id})
    .then(task => {
      res.send({ status: 200, task });
    });
  } catch (err) {
    logger(status = 500, message = `Ошибка удаления предмета: ${err}`)
    res.send(err)
  }
  
});

/////// Загрузка изображений ///////
const multer = require('multer')
const moment = require('moment')

var storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads')
  },
  filename: function (req, file, cb) {
    const date = moment().format('DDMMYYYY-HHmmss_SSS')
    cb(null, date + '.jpg')
  }
})
 
var upload = multer({ storage: storage })

router.post('/addImg', upload.single('myFile'), (req, res, next) => {
  const file = req.body
  if (!file) {
    const error = new Error('Please upload a file')
    error.httpStatusCode = 400
    return next(error)
  }

    res.send({
      'originalname' : req.file.originalname,
      'filename' : req.file.filename
    })
  
})

router.post('/paymentFullBalance', async (req, res) =>{
  try {
    let user = await Сustomer.findOne({token: req.body.token}).then()
    let description = req.body
    
    // Подготовка изображений 
    let attachments = []
    let subject = await Task.findOne({name: description.subject}).then()

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
            user: 'sendingmessage2@mail.ru',
            pass: 'tyjNaPOuA12&'
          }
        })
            
        await transporter.sendMail({
          from: '"Работы по курсам мади" <sendingmessage2@mail.ru>',
          to: user.email,
          subject: 'Решения',
          text: '',
          html: `Предмет: ${description.subject}<br> Раздел: ${description.categories.join(' -> ')} <br> Задания: ${description.tasks.join(', ')}`,
          attachments: attachments,
          
        })
        
        logger(status = 200, message = `Отправленны решения: ${description.email}  Предмет: ${description.subject} Раздел: ${description.categories.join(' -> ')} Заданий: ${description.tasks.join(', ')} `)
        console.log(`Отправленны решения ${user.email}`)

      } catch (err) { 
        logger(status = 500, message = `Ошибка отправки решений ${err}`)
        console.log(`Ошибка отправки решений ${err}`) 
      }
    }
  
    await mail(req, res);

    Сustomer.findOneAndUpdate({token: user.token},{
      balance: +user.balance - +description.prise
    }).then()

    Сustomer.findOneAndUpdate({token: user.token},{
      orders: [...user.orders, {
        'subject': description.subject,
        'categories': description.categories.join(' -> '),
        'tasks': description.tasks.join(', ')
      }]
    }).then()

    res.send({
      status: 200,
      numberPayment: description.numberPayment
    })
  } catch (err) {
    logger(status = 500, message = `Ошибка покупки полность за баланс: ${err}`)
    res.send(err)
  }
  
});


/////// Яндекс Касса ///////
const YandexCheckout = require('yandex-checkout')('Ваш идентификатор магазина', 'Ваш секретный ключ') // !!!

// Создание платежа
router.post('/createPayment', (req, res) => {
  let idempotenceKey = 'ключ идемпотентности' // !!!
  YandexCheckout.createPayment({
    'amount': {
      'value': req.body.prise,
      'currency': 'RUB'
    },
    'confirmation': {
      'type': 'redirect',
      'return_url': 'Страница возврата после платежа' // !!!
    },
    "capture": true,
    "description": JSON.stringify(req.body.info)
  }, idempotenceKey)
  .then(result => {
    Payment.create({id: result.id}).then();
    logger(status = 200, message = `успешное создание платежа id: ${result.id}`)
    res.send({payment: result})
  })
  .catch(err => {
    logger(status = 500, message = `Ошибка создания платежа`)
    res.send(err)
  })

})

module.exports = router
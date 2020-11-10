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
    await mongoose.connect(config.get('localMongoUri'), { 
      useNewUrlParser: true,
      useCreateIndex: true,
      useUnifiedTopology: true
    })
    console.log("\x1b[32m", 'База данных подключена.');
    app.listen(PORT, () => console.log("\x1b[32m", `Сервер прослушивает порт: ${PORT} `));
  } catch (err) {
    console.log("\x1b[41m", 'Server error.', err.message);
    process.exit(1)
  }
}

start()

const Admin = require('./Schemes/Admin')
async  function checkAdmin() {
  
  let admin = await Admin.findOne().then()

  if (!admin) {
    Admin.create({ 
      "name" : "admin",
      "password" : "DLla3eFURPnhvYSc2L2OA6UuxzEPompTiFiMErG5Pds=" 
    }).then((admin) => {
        
      function cryptor(value) {
        let sha256 = crypto.createHash("sha256")
        sha256.update(value + '', "utf8")

        return sha256.digest("base64")
      }

      let token = cryptor(admin._id)
      Admin.findByIdAndUpdate({_id: admin.id},{ token }).then()

    });
  }
}




// Проверка подтверждённых платежей
const checkPayment = require('./modules/checkPayment')

setInterval(() => { checkPayment.checkPayment() }, 10000)


// Отправка отчётов раз в неделю
const crontab = require('node-crontab')
const sendReports = require('./modules/sendReport')

crontab.scheduleJob("* * * * */7", () => { sendReports.sendReports() });
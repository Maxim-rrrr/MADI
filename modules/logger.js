const dayjs = require('dayjs')
const Log = require('../Schemes/Log')

// Функция логирования 
exports.logger = (status = 200, message = '') => {
  Log.create({
    time: `${dayjs().get('D')}-${(dayjs().get('M') + 1)}-${dayjs().get('y')}_${dayjs().get('h')}:${dayjs().get('m')}:${dayjs().get('s')}:${dayjs().get('ms')}`,
    status,
    message
  })
}
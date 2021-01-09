const testFolder = './uploads/';
const fs = require('fs');

const used = () => {
  let list = []




  return list
}



fs.readdirSync(testFolder).forEach(async file => {
  const list = await used()
  if (list.includes('./uploads/' + file)) {
    fs.unlink(path)
  }

})
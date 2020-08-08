const express = require("express");
const router = express.Router();
const Сustomer = require("./customer")
const nodemailer = require('nodemailer');

router.get("/customers", (req, res)=>{
  Сustomer.find({})
    .then(customer => {
      res.send(customer);
    });
});

router.post("/code", (req, res)=>{
  // Сustomer.create(req.body)
  //   .then(customer => {
  //     res.send(customer);
  //   });
  async function mail (req, res) {
    try {
  
      let transporter = nodemailer.createTransport({
        host: 'smtp.mail.ru',
        port: 465,
        secure: true, // true for 465, false for other ports
        auth: {
          user: 'sendingmessage@mail.ru',
          pass: 'Eo$P4KuuioP1'
        }
      })
      
      let code = Math.floor(Math.random() * 900000 + 100000);

      let result = await transporter.sendMail({
        from: '"Работы по курсам мади" <sendingmessage@mail.ru>',
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
  
      res.send({
        error: err,
        massage: 'Наташа, мы всё уронили'
      });
  
    }
  }

  mail(req, res);

});

router.post("/add-user", (req, res)=>{
  /*
   * req.body :
   *  {
   *    email: String,
   *    password: String,
   *  } 
   * 
   *  Необязательное поле:
   *    balance: {
   *      type: Number,
   *      default: 0
   *    }
   * 
   */
  Сustomer.create(req.body)
    .then(customer => {
      res.send(customer);
    });
  
});

router.put("/customers/:id", (req, res)=>{
  Сustomer.findByIdAndUpdate({_id: req.params.id}, req.body)
    .then(() => {
      Сustomer.findOne({_id: req.params.id})
        .then(customer => {
          res.send(customer);
        });
    });
});

router.delete("/customers/:id", (req, res)=>{
  Сustomer.deleteOne({_id: req.params.id})
    .then(customer => {
      res.send(customer);
    });
});

module.exports = router;
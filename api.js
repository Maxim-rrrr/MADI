const express = require("express");
const router = express.Router();
const Сustomer = require("./customer")

router.get("/customers", (req, res)=>{
  Сustomer.find({})
    .then(customer => {
      res.send(customer);
    });
});

router.post("/customers", (req, res)=>{
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
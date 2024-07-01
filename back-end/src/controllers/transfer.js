const express = require('express');
const Transfer = require('../model/transfer');
const router = express.Router();




router.post('/', async(req, res) => {
    try {

        const { fromcountryname,tocountryname, amount } = req.body;

        const data = new Transfer(
            {
                fromcountryname,
                tocountryname,
                amount
          });
      
        await data.save();
        res.sendStatus(200);

        
    } catch (e) {
        
        console.log("Error", e);
        res.sendStatus(500);


    }
});

//delete method
router.delete("/:id", async(req, res) => {

    try {
        const {id} = req.params; 
        await Transfer.deleteOne({ _id: id });

        res.sendStatus(200);

    } catch (error) {
        console.log("Error ", error);

        res.sendStatus(500);
    }
});

//get method
router.get("/",async(req, res) => {

    try {

        const data = await Transfer.find().sort({_id:-1});
        res.status(200).json(data); 

    } catch (e) {
        res.sendStatus(500);
    }
});



module.exports = router;
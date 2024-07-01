const express = require('express');
const Country = require('../model/country');
const router = express.Router();




router.post('/', async(req, res) => {
    try {

        const { countryname, code } = req.body;
        const data = new Country(
            {
                countryname,
                code
          });
      
        await data.save();
        res.sendStatus(200);

        
    } catch (e) {
        
        console.log("Error", e);
        res.sendStatus(500);


    }
});


 //get method
 router.get("/",async(req, res) => {

    try {

        const data = await Country.find();
        res.status(200).json(data); 

    } catch (e) {
        res.sendStatus(500);
    }
});




module.exports = router;
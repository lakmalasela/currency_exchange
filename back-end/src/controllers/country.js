const express = require('express');
const Country = require('../model/country');
const router = express.Router();




router.post('/', async(req, res) => {
    try {

        const { countryname, code } = req.body;
        console.log(countryname, code);

        const data = new Country(
            {
                countryname,
                code
          });
      
        await data.save();

        console.log('req', req.body);
        
        
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
        console.log("GET CTA ",data);
        res.status(200).json(data); 

    } catch (e) {
        res.sendStatus(500);
    }
});


// //update method
// router.put("/:id", async(req, res) => {


//     try {
//         const {id} = req.params;
//         const {name} = req.body;
    

//         await Category.updateOne({_id:id},{name,name});
//         return  res.sendStatus(200); 



//     } catch (error) {
//         res.sendStatus(500);
//     }
// });

module.exports = router;
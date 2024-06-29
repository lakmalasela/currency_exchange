const express = require('express');
const Transfer = require('../model/transfer');
const router = express.Router();




router.post('/', async(req, res) => {
    try {

        const { fromcountryname,tocountryname, amount } = req.body;
        console.log(fromcountryname,tocountryname, amount);

        const data = new Transfer(
            {
                fromcountryname,
                tocountryname,
                amount
          });
      
        await data.save();

        console.log('req', req.body);
        
        
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

        const data = await Transfer.find();
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
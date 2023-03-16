const express = require("express");
const { authToken } = require("../auth/authToken");
const { ToyModel, validToy } = require("../models/toyModel")
const router = express.Router();

router.get("/", async (req, res) => {
  try {
    let data = await ToyModel.find({}).limit(20);
    res.json(data);
  }
  catch {
    console.log(err);
    res.status(502).json({ err })
  }
})


router.get("/search", async(req,res) =>{
  try{
    let search = req.query.name;
    let searchQ = new RegExp(search,"i");
    let data = await ToyModel.find({$or:[{name: searchQ}, {info: searchQ}, {category: searchQ}]}).limit(10);
   return res.json(data)
  }
  catch(err){
    console.log(err);
    return res.status(502).json({err})
  }
})



router.post("/",authToken, async (req, res) => {
  let validBody = validToy(req.body);
  if (validBody.error) {
    return res.status(400).json(validBody.error.details);
  }
  try {
    let toy = ToyModel(req.body);
    toy.userID = req.tokenData._id;
    await toy.save();
    res.json(toy);
  }
  catch (err) {
    console.log(err);
    res.status(502).json({ err })
  }
})

router.delete("/:idDel",authToken, async (req, res) => {
  try {
    let data = await ToyModel.deleteOne({ _id: req.params.idDel,userID:req.tokenData._id });
    res.json(data);
  }
  catch (err) {
    console.log(err);
    res.status(400).send(err)
  }
})

router.put("/:idEdit",authToken, async (req, res) => {
  let validBody = validToy(req.body);
  if (validBody.error) {
    return res.status(400).json(validBody.error.details);
  }
  try {
    let data = await ToyModel.updateOne({ _id: req.params.idEdit,userID:req.tokenData._id }, req.body);
    res.json(data);
  }
  catch(err){
    console.log(err);
    res.status(502).send(err)
  }
})



module.exports = router; 
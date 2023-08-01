const express = require("express");
const fetchuser = require("../middleware/fetchuser");
const Notes = require("../models/Notes");
const { body, validationResult } = require("express-validator");


const  router = express.Router()
//ROUTER1 : get all notes to required using : GET:"/api/auth/fetchallnotes : login required"
router.get("/fetchallnotes",fetchuser,async(req,res)=>{
    try {
        const notes = await Notes.find({user:req.user.id})
        res.json(notes)
    } catch (error) {
        console.log(error)
        res.json({error:"internal server error"})
        
    }
})

//ROUTER2 : get all notes to required using : GET:"/api/auth/addnotes : login required"
router.post("/addnotes",fetchuser,[
    body('title',"enter a valid title").isLength({ min: 3 }),
    
],async(req,res)=>{
    try { 
        const { title,description,tag}= req.body
        const error = validationResult(req);
        if(!error.isEmpty()){
            res.statusCode = 400
            return res.json({error:error.array()})
        }
        if(description.length <5){
            res.statusCode =400
            return res.json({error:"enter a valid description"})
        }
        const notes = await Notes.create({title,description,tag,user:req.user.id})
        
        return res.json(notes)
    } catch (error) {
        console.log(error)
        res.json({error:"internal server error"})
    }
})



//ROUTER3 : put update notes : put:"/api/auth/updatenotes : login required"
router.put("/updatenote/:id",fetchuser,async(req,res)=>{
    try {
        const {title,description,tag} = req.body
        const newnote = {}
        if(title){newnote.title = title}
        if(description){newnote.description = description}
        if(tag){newnote.tag = tag}
        //find note to update
        let note = await Notes.findById(req.params.id)
        if(!note){
            return res.status(404).send("not found")
            
        }
        if(note.user.toString() !== req.user.id){
            return res.status(404).send("not allowed")
        }
        note = await Notes.findByIdAndUpdate(req.params.id,{$set:newnote},{new:true});
        return res.json(note)
    } catch (error) {
        console.error(error)
        res.status(500).json({error:"internal server error"})
    }


}) 
//ROUTER 4 : delete notes : delete:"/api/auth/deletenotes : login required"
router.delete("/deletenote/:id",fetchuser,async(req,res)=>{
    try {

        //find note to update
        let note = await Notes.findById(req.params.id)
        console.log(note)
        if(!note){
            return res.status(404).send("not found")
            
        }
        if(note.user.toString() !== req.user.id){
            return res.status(404).send("not allowed")
        }
        note = await Notes.findByIdAndDelete(req.params.id);
        return res.json({"sucess":"note has been deleted",note:note})
    } catch (error) {
        console.error(error)
        res.status(500).json({error:"internal server error"})
    }


}) 

module.exports = router;
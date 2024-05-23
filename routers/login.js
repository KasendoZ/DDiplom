const express = require("express");
const app = express();
const router = express.Router();
const {sing_up, staff, profile, master_shop} = require("../models/all_models");
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const auth = require("../middleware/auth");



router.get("/", async(req, res) => {
    try {
        const master = await master_shop.find()
        console.log("login master" , master);
    
        res.render("login", {
            success: req.flash('success'),
            errors: req.flash('errors'),
            master_shop : master
        })
    } catch (error) {
        console.log(error);
    }
})

router.get('/validate', async (req, res)=>{
    try {
        const master = await master_shop.find()
        console.log("login master" , master);
    
        res.render("validate", {
            success: req.flash('success'),
            errors: req.flash('errors'),
            master_shop : master
        })
    } catch (error) {
        console.log(error);
    }
})

router.get("/login", async(req, res) => {
    try {
        const master = await master_shop.find()
        console.log("login master" , master);
    
        res.render("login", {
            success: req.flash('success'),
            errors: req.flash('errors'),
            master_shop : master
        })
    } catch (error) {
        console.log(error);
    }
})

router.post("/login", async(req, res) => {
    try{
        const email = req.body.email;
        
        const  useremail = await sing_up.findOne({email : email});
        console.log("login useremail", useremail);

        if(!useremail){
            req.flash('errors', `your email is not register`)
            return res.redirect("/login")

        }

        if(useremail.role == "staff"){
            const staff_data = await staff.findOne({name : useremail.name})
            console.log("staff_data", staff_data);

            if (staff_data.status == "Disabled") {
                req.flash('errors', `Your account is currently disabled by the Admin.`)
                return res.redirect("/login")
            }
        }

        const password = req.body.password;

        const hash_pass = await bcrypt.compare(password, useremail.password)
        
        if(hash_pass == false){
            req.flash('errors', `your password is wrong`)
            return res.redirect("/login")
        }

        const token = jwt.sign({username : useremail.username, email : useremail.email, role : useremail.role }, process.env.secret_key)
        console.log("login token", token);

        res.cookie("jwt", token, {expires : new Date(Date.now() + 60000 * 60)})
        
        
        req.flash('success', `login successfully`)
        res.redirect("/index")
    }catch(error){
        console.log(error);
    }
})


router.get("/staff/:id", async(req, res) => {
    try{
        const _id = req.params.id;
        console.log("abcd", _id);

        const staff_data = await staff.findById({_id})
        console.log("login staff", staff_data);

        
        if(staff_data.status == "Disabled"){
            req.flash('errors', `Your account is currently disabled by the Admin.`)
            res.redirect("/staff/view")
        }
        
        const  useremail = await sing_up.findOne({email : staff_data.email});
        console.log(useremail);

        const token = jwt.sign({username : useremail.username, email : useremail.email, role : useremail.role }, process.env.secret_key)
        // console.log(token);

        res.cookie("jwt", token, {expires : new Date(Date.now() + 60000 * 60)})
        

        req.flash('success', `login successfully`)
        res.redirect("/index")
    }catch(error){
        console.log(error);
    }
})


router.get("/logout", (req, res) => {
    res.clearCookie("jwt")


    res.redirect('/login');
});



module.exports = router;
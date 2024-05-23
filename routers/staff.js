const express = require("express");
const app = express();
const router = express.Router();
const bcrypt = require('bcryptjs');
const { profile, master_shop, sing_up, categories, brands, units, product, warehouse, staff} = require("../models/all_models");
const auth = require("../middleware/auth");
const users = require("../public/language/languages.json");



router.get("/view", auth, async(req, res) => {
    try{
        const {username, email, role} = req.user
        const role_data = req.user
        
        const profile_data = await profile.findOne({email : role_data.email})

        const master = await master_shop.find()
        console.log("master" , master);


        const find_data = await staff.find();
        console.log(find_data);
        
        if (master[0].language == "English (US)") {
            var lan_data = users.English
            console.log(lan_data);
        } else if(master[0].language == "Hindi") {
            var lan_data = users.Hindi

        }else if(master[0].language == "German") {
            var lan_data = users.German
        
        }else if(master[0].language == "Spanish") {
            var lan_data = users.Spanish
        
        }else if(master[0].language == "French") {
            var lan_data = users.French
        
        }else if(master[0].language == "Portuguese (BR)") {
            var lan_data = users.Portuguese
        
        }else if(master[0].language == "Chinese") {
            var lan_data = users.Chinese
        
        }else if(master[0].language == "Arabic (ae)") {
            var lan_data = users.Arabic
        }


        res.render("staff", {
            success: req.flash('success'),
            errors: req.flash('errors'),
            role : role_data,
            profile : profile_data,
            master_shop : master,
            user : find_data,
            language : lan_data
        }) 
    }catch(error){
        console.log(error);
    }
})

router.post("/view", auth, async(req, res) => {
    try{
        const {name, email, mobile, password, status} = req.body;
        
        const hash = await bcrypt.hash(password, 10)

        const data = new staff({name, email, mobile, status})

        const staff_name = await staff.findOne({email:email});
        console.log(staff_name);

        if(staff_name){
            req.flash('errors', `Email ${email} is alredy added. please choose another`)
            res.redirect("back")
            return false
        }
        
        const userdata = await data.save();

        const staff_login = new sing_up({name, email, password:hash, role:"staff"})

        const login = await staff_login.save();
        // console.log(userdata);

        const new_profile = new profile({firstname: name, email})
        const profile_data = await new_profile.save();

        req.flash('success', `${name} is add successfully`)
        res.redirect("/staff/view")
    }catch(error){  
        console.log(error);
    }
})

router.get("/view/:id", auth, async(req, res) => {
    try{
        const _id = req.params.id;
        // console.log(_id);
        
        const master = await master_shop.find()
        console.log("master" , master);

        const user_id = await staff.findById(_id)

        if (master[0].language == "English (US)") {
            var lan_data = users.English
            console.log(lan_data);
        } else if(master[0].language == "Hindi") {
            var lan_data = users.Hindi

        }else if(master[0].language == "German") {
            var lan_data = users.German
        
        }else if(master[0].language == "Spanish") {
            var lan_data = users.Spanish
        
        }else if(master[0].language == "French") {
            var lan_data = users.French
        
        }else if(master[0].language == "Portuguese (BR)") {
            var lan_data = users.Portuguese
        
        }else if(master[0].language == "Chinese") {
            var lan_data = users.Chinese
        
        }else if(master[0].language == "Arabic (ae)") {
            var lan_data = users.Arabic
        }

        res.render("staff", {
            success: req.flash('success'),
            errors: req.flash('errors'),
            master_shop : master,
            user : user_id,
            language : lan_data
        })

    }catch(error){
        console.log(error);
    }
})

router.post("/view/:id", auth, async(req, res) => {
    try{
        const _id = req.params.id;
        const data = await staff.findById(_id);
        const {name, email, mobile, password, status} = req.body;

        data.name = name
        data.email = email
        data.mobile = mobile
        data.password = password
        data.status = status

        const new_data = await data.save();

        const profile_data = await profile.findOne({email : email})
        console.log("edit profile_data", profile_data);

        profile_data.firstname = name
        profile_data.email = email

        await profile_data.save()

        req.flash('success', `staff data update successfully`)
        res.redirect("/staff/view")
    }catch(error){
        console.log(error);
    }
})


module.exports = router;
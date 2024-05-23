const express = require("express");
const app = express();
const router = express.Router();
const { profile, master_shop, categories, brands, units, product, warehouse, staff, customer, customer_payment, c_payment_data, sing_up} = require("../models/all_models");
const auth = require("../middleware/auth");
const users = require("../public/language/languages.json");


router.get("/view", auth,  async(req, res) => {
    try{
        const {username, email, role} = req.user
        const role_data = req.user

        const profile_data = await profile.findOne({email : role_data.email})

        const master = await master_shop.find()
        console.log("master" , master);

        const find_data = await customer.find();
        // console.log(find_data);

        const customer_data = await customer.aggregate([
            {
                $lookup:
                {
                    from: "c_payments",
                    localField: "name",
                    foreignField: "customer",
                    as: "customer_docs"
                }
            }
            
        ]);
        console.log(customer_data);

        const payment_data = customer_data.map(data => {
            console.log("data" , data);
            var sale = 0
            var sale_return = 0

            data.customer_docs.forEach(element => {
                console.log("element" , element);
                if (element.reason == "Sale") {
                    sale += element.amount
                } else {
                    sale_return += element.amount
                }
            });

            data.sale = parseFloat(sale) + 0 
            data.sale_return = parseFloat(sale_return) + 0

            return data
        })
        console.log("payment_data" , payment_data);

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

        res.render("customer", {
            success: req.flash('success'),
            errors: req.flash('errors'),
            user : find_data,
            role : role_data,
            profile : profile_data,
            payment: payment_data,
            master_shop : master,
            language : lan_data
        })
    }catch(error){
        console.log(error);
    }
})

router.post("/view", auth, async(req, res) => {
    try{
        const {name, address, mobile, email, receivable, payable} = req.body;
        
        const data = new customer({name, address, mobile, email, receivable, payable})

        const userdata = await data.save();
        // console.log(userdata);
    
        req.flash('success', `customer add successfully`)
        res.redirect("/customer/view")
    }catch(error){  
        console.log(error);
    }
})

router.get("/view/:id", auth, async(req, res) => {
    try{
        const {username, email, role} = req.user
        const role_data = req.user

        const profile_data = await profile.findOne({email : role_data.email})

        const master = await master_shop.find()
        console.log("master" , master);

        const _id = req.params.id;
        // console.log(_id);
        const user_id = await customer.findById(_id)

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

        res.render("customer", {
            success: req.flash('success'),
            errors: req.flash('errors'),
            role : role_data,
            profile : profile_data,
            user : user_id,
            master_shop : master,
            language : lan_data
        })
    }catch(error){
        console.log(error);
    }
})

router.post("/view/:id", auth, async(req, res) => {
    try{
        const _id = req.params.id;
        const data = await customer.findById(_id);
        const {name, address, mobile, email, receivable, payable} = req.body;

        data.name = name
        data.address = address
        data.mobile = mobile
        data.email = email
        data.receivable = receivable
        data.payable = payable

        const new_data = await data.save();
        req.flash('success', `customer update successfully`)
        res.redirect("/customer/view")
    }catch(error){
        console.log(error);
    }   
})

// -------- customer payment ------- //

router.get("/view/payment/:id", auth, async (req, res) => {
    try {
        const {username, email, role} = req.user
        const role_data = req.user

        const profile_data = await profile.findOne({email : role_data.email})

        const master = await master_shop.find()
        console.log("master" , master);

        console.log(req.params.id);

        const customer_data = await customer.findOne({ _id: req.params.id })
        console.log("customer_data" , customer_data);

        const payment_data = await c_payment_data.find({ customer: customer_data.name })
        console.log(payment_data);

        const payable_sum = await c_payment_data.aggregate([
            {
                $match: { "customer": customer_data.name }
            },
            {
                $match: { "reason": "Sale" }
            },
            {
                $group: {
                    _id: "$reason",
                    sum: { $sum: "$amount" }
                }
            },
        ])
        console.log("payable_sum", payable_sum);


        const receivable_sum = await c_payment_data.aggregate([
            {
                $match: { "customer": customer_data.name }
            },
            {
                $match: { "reason": "Sale Return" }
            },
            {
                $group: {
                    _id: "$reason",
                    sum: { $sum: "$amount" }
                }
            },
        ])
        console.log("receivable_sum", receivable_sum);

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


        res.render("customer_payment", {
            success: req.flash('success'),
            errors: req.flash('errors'),
            role : role_data,
            profile : profile_data,
            payment: payment_data,
            payable: payable_sum,
            receivable: receivable_sum,
            master_shop : master,
            language : lan_data
        })
    } catch (error) {
        console.log(error);
    }
})

module.exports = router;
const express = require("express");
const app = express();
const router = express.Router();
const { profile, master_shop, categories, brands, units, product, warehouse, staff, customer, suppliers, purchases, suppliers_payment, s_payment_data } = require("../models/all_models");
const auth = require("../middleware/auth");
const users = require("../public/language/languages.json");



router.get("/view", auth, async (req, res) => {
    try {
        const {username, email, role} = req.user
        const role_data = req.user
        
        const profile_data = await profile.findOne({email : role_data.email})

        const master = await master_shop.find()
        console.log("master" , master);


        const find_data = await suppliers.find();
        console.log(find_data);

        const suppliers_data = await suppliers.aggregate([
            {
                $lookup:
                {
                    from: "s_payments",
                    localField: "name",
                    foreignField: "suppliers",
                    as: "suppliers_docs"
                }
            }
            
        ]);

       const payment_data = suppliers_data.map(data => {
            console.log("data", data);
            var purchase = 0
            var purchase_return = 0

            data.suppliers_docs.forEach((doc)=>{
                console.log("doc" , doc);
                if (doc.reason == "Purchase") {
                    purchase += doc.amount
                }else{
                    purchase_return += doc.amount
                }
            })

           data.purchase= purchase
           data.purchase_return = purchase_return

           return data
        })
        console.log("supplier.js payment_data", payment_data);

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

        res.render("supplier", {
            success: req.flash('success'),
            errors: req.flash('errors'),
            user: find_data,
            profile : profile_data,
            master_shop : master,
            role : role_data,
            payment: payment_data,
            language : lan_data
        })

    } catch (error) {
        console.log(error);
    }
})


router.post("/view", auth, async (req, res) => {
    try {
        // console.log(req.body.name);
        const { name, email, mobile, company, address, receivable, payable } = req.body;
        const data = new suppliers({ name, email, mobile, company, address, receivable, payable })

        const userdata = await data.save();
        // console.log(userdata);
        req.flash('success', `supplier data add successfully`)
        res.redirect("/supplier/view")
    } catch (error) {
        console.log(error);
    }
})


router.get("/view/:id", auth, async (req, res) => {
    try {
        const {username, email, role} = req.user
        const role_data = req.user
        
        const profile_data = await profile.findOne({email : role_data.email})

        const master = await master_shop.find()
        console.log("master" , master);

        const _id = req.params.id;
        // console.log(_id);
        const user_id = await suppliers.findById(_id)
        console.log(user_id);

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

        res.render("supplier", {
            success: req.flash('success'),
            errors: req.flash('errors'),
            role : role_data,
            profile : profile_data,
            master_shop : master,
            user: user_id,
            language : lan_data
        })

    } catch (error) {
        console.log(error);
    }
})

router.post("/view/:id", auth, async (req, res) => {
    try {
        const _id = req.params.id;
        const data = await suppliers.findById(_id);
        const { name, email, mobile, company, address, receivable, payable } = req.body;
        
        data.name = name
        data.email = email
        data.mobile = mobile
        data.company = company
        data.address = address
        data.receivable = receivable
        data.payable = payable

        const new_data = await data.save();
        req.flash('success', `supplier data update successfully`)
        res.redirect("/supplier/view")
    } catch (error) {
        console.log(error);
    }
})


// -------- supplier payment ------- //

router.get("/view/payment/:id", auth, async (req, res) => {
    try {
        const {username, email, role} = req.user
        const role_data = req.user
        
        const profile_data = await profile.findOne({email : role_data.email})
        
        const master = await master_shop.find()
        console.log("master" , master);

        console.log(req.params.id);

        const suppliers_data = await suppliers.findOne({ _id: req.params.id })
        console.log(suppliers_data);

        const payment_data = await s_payment_data.find({ suppliers: suppliers_data.name })
        console.log(payment_data);

        const payable_sum = await s_payment_data.aggregate([
            {
                $match: { "suppliers": suppliers_data.name }
            },
            {
                $match: { "reason": "Purchase" }
            },
            {
                $group: {
                    _id: "$reason",
                    sum: { $sum: "$amount" }
                }
            },
        ])
        console.log("payable_sum", payable_sum);


        const receivable_sum = await s_payment_data.aggregate([
            {
                $match: { "suppliers": suppliers_data.name }
            },
            {
                $match: { "reason": "Purchase Return" }
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

        res.render("supplier_payment", {
            success: req.flash('success'),
            errors: req.flash('errors'),
            role : role_data,
            profile : profile_data,
            master_shop : master,
            payment: payment_data,
            payable: payable_sum,
            receivable: receivable_sum,
            language : lan_data
        })
    } catch (error) {
        console.log(error);
    }
})



module.exports = router;
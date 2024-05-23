const express = require("express");
const app = express();
const router = express.Router();
const auth = require("../middleware/auth");
const { profile, sales, sales_return, purchases, purchases_return, categories, product, suppliers, customer, master_shop} = require("../models/all_models");
const users = require("../public/language/languages.json");


router.get("/index", auth, async(req, res) => {
    try {
        const {username, email, role} = req.user
        const role_data = req.user
        console.log("role_data" , role_data);

        const profile_data = await profile.findOne({email : role_data.email})
        console.log("profile_data" , profile_data);


        const master = await master_shop.find()
        console.log("master" , master);

        
        const sale_data = await sales.aggregate([
            {
                $group: {
                    _id: null,
                    total_price: {$sum: "$total_price"},
                }
            }
        ])
        // console.log("11111", sale_data);

        const sales_return_data = await sales_return.aggregate([
            {
                $group: {
                    _id: null,
                    total: {$sum: "$total_amount"},
                }
            }
        ])

        const purchases_data = await purchases.aggregate([
            {
                $group: {
                    _id: null,
                    total_amount: {$sum: "$total_amount"},
                }
            }
        ])

        const purchases_return_data = await purchases_return.aggregate([
            {
                $group: {
                    _id: null,
                    total: {$sum: "$total_amount"},
                }
            }
        ])


        const purchases_table_data = await purchases.aggregate([
            {
                $sort: {
                    'invoice':-1
                }
            },
            { $limit : 5 },
            {
                $sort: {
                    'invoice':1
                }
            },
        ])


        const sales_table_data = await sales.aggregate([
            {
                $sort: {
                    'invoice':-1
                }
            },
            { $limit : 5 },
            {
                $sort: {
                    'invoice':1
                }
            },
        ])

        const categories_data = await categories.find()

        const product_data = await product.find()
        
        const suppliers_data = await suppliers.find()
        
        const customer_data = await customer.find()
        console.log(customer_data.length);

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

        res.render("index", {
            success: req.flash('success'),
            errors: req.flash('errors'),
            role : role_data,
            profile : profile_data,
            sale: sale_data[0],
            sales_return: sales_return_data[0],
            purchases: purchases_data[0],
            purchases_return: purchases_return_data[0],
            purchases_table: purchases_table_data,
            sales_table: sales_table_data,
            categories: categories_data.length,
            product: product_data.length,
            suppliers: suppliers_data.length,
            customer: customer_data.length,
            master_shop : master,
            language : lan_data
        })
    } catch (error) {
        console.log(error);
    }
})


module.exports = router;
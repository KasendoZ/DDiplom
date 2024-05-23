const express = require("express");
const app = express();
const router = express.Router();
const auth = require("../middleware/auth");
const {profile, master_shop, categories, brands, units, product, warehouse, staff, customer, suppliers, purchases, suppliers_payment, expenses_type, all_expenses, adjustment} = require("../models/all_models");
const users = require("../public/language/languages.json");


router.get("/view", auth, async(req, res) => {
    try {
        const {username, email, role} = req.user
        const role_data = req.user

        const profile_data = await profile.findOne({email : role_data.email})

        const master = await master_shop.find()
        console.log("master" , master);

        const warehouse_data = await warehouse.find({status : "Enabled"})
        const product_data = await product.find()

        const adjustment_data = await adjustment.find()

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
        res.render("adjustment", {
            success: req.flash('success'),
            errors: req.flash('errors'),
            role : role_data,
            profile : profile_data,
            warehouse : warehouse_data,
            product : product_data,
            adjustment : adjustment_data,
            master_shop : master,
            language : lan_data
        })
    } catch (error) {
        console.log(error);
    }
    
})


router.get("/view/add_adjustment", auth, async (req, res) => {
    try {
        const {username, email, role} = req.user
        const role_data = req.user

        const profile_data = await profile.findOne({email : role_data.email})

        const master = await master_shop.find()
        console.log("master" , master);

        const warehouse_data = await warehouse.find({status : 'Enabled'});
        const product_data = await product.find({});

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
        
        res.render("add_adjustment", {
            success: req.flash('success'),
            errors: req.flash('errors'),
            role : role_data,
            profile : profile_data,
            warehouse: warehouse_data,
            product: product_data,
            master_shop : master,
            language : lan_data
        })
    } catch (error) {
        console.log(error);
    }
})


router.post("/view/add_adjustment", auth, async(req, res) => {
    try{
        const {warehouse_name, date, product_name, stock_adjust, adjust_qty, type, note} = req.body
        

        if(typeof product_name == "string"){
            var product_name_array = [req.body.product_name]
            var stock_adjust_array = [req.body.stock_adjust]
            var adjust_qty_array = [req.body.adjust_qty]
            var type_array = [req.body.type]
            
            console.log("if");
        }else{
            var product_name_array = [...req.body.product_name]
            var stock_adjust_array = [...req.body.stock_adjust]
            var adjust_qty_array = [...req.body.adjust_qty]
            var type_array = [...req.body.type]

            console.log("else", product_name_array);
        } 
        
        const newproduct = product_name_array.map((value)=>{
            
            return  value  = {
                        product_name : value,
                    } 
            })
                    
        stock_adjust_array.forEach((value,i) => {
            newproduct[i].stock_adjust = value
        });

        adjust_qty_array.forEach((value,i) => {
            newproduct[i].adjust_qty = value
        });
        
        type_array.forEach((value, i) => {
            newproduct[i].type = value
        })


        var error = 0
        newproduct.forEach(data => {
            console.log("foreach newproduct", data);
            if (parseInt(data.stock_adjust) <= 0 ) {
                
                error++
            }
        })
        if (error != 0) {
            
            req.flash("errors", `You can't subtract, the current stock is 0`)
            return res.redirect("back")
        }

        
        const data = new adjustment({ warehouse_name, date, product:newproduct, note })

        const adjustment_data = await data.save()
        console.log(data);

    
        
        // --------- warehouse ------- //

        const warehouse_data = await warehouse.findOne({ name: warehouse_name });

        data.product.forEach(product_details => {
            // console.log("if product_details", product_details);


            const match_data = warehouse_data.product_details.map((data) => {
                // console.log("map", data);

                if (product_details.type == "Subtract") {
                    
                    if (data.product_name == product_details.product_name) {
                        
                        data.product_stock = parseInt(data.product_stock) - parseInt(product_details.adjust_qty)
                    }
                } else {
                    
                    if (data.product_name == product_details.product_name) {
                        
                        data.product_stock = parseInt(data.product_stock) + parseInt(product_details.adjust_qty)
                    }
                }


            })

            // console.log("final", warehouse_data);
        })

        await warehouse_data.save()
        

        req.flash('success', `adjustment add successfull`)
        res.redirect("/adjustment/view")
    }catch(error){
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

        const _id = req.params.id
        const adjustment_data = await adjustment.findById({_id})
        console.log(adjustment_data);

        const purchases_data = await purchases.aggregate([
            {
                $match: { "warehouse_name": adjustment_data.warehouse_name }
            },
            {
                $unwind: "$product"
            },
            {
                $group: {
                    _id: "$product.product_name", 
                }
            },
        ])
        console.log("purchases_data" , purchases_data);

        const stock_data = await warehouse.aggregate([
            {
                $match: { "name": adjustment_data.warehouse_name }
            },
            {
                $unwind: "$product_details"
            },
            {
                $group: {
                    _id: "$product_details.product_name",
                    product_stock: { $first: "$product_details.product_stock" }
                }
            },
        ])
        console.log("stock_data", stock_data);

        const product_data = await product.find({})
        
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

        res.render("edit_adjustment", {
            success: req.flash('success'), 
            errors: req.flash('errors'),
            role : role_data,
            profile : profile_data,
            adjustment: adjustment_data,
            stock: stock_data,  
            master_shop : master,
            warehouse_name : purchases_data,
            unit: product_data,
            language : lan_data
        })
    } catch (error) {
        console.log(error);
    }
})

router.post("/view/:id", auth, async (req, res) => {
    try{
        const _id = req.params.id;
        console.log(_id);
        console.log("req.bodyy", req.body);
        

        const old_adjustment = await adjustment.findById({_id})
        console.log("old_adjustment" , old_adjustment);

        const old_warehouse_data = await warehouse.findOne({name : old_adjustment.warehouse_name})
        console.log("old_warehouse_data" , old_warehouse_data);


        const {warehouse_name, date, product_name, adjust_qty, type, note} = req.body
        

        if(typeof product_name == "string"){
            var product_name_array = [req.body.product_name]
            var stock_adjust_array = [req.body.stock_adjust]
            var adjust_qty_array = [req.body.adjust_qty]
            var type_array = [req.body.type]
            
            console.log("if");
        }else{
            var product_name_array = [...req.body.product_name]
            var stock_adjust_array = [...req.body.stock_adjust]
            var adjust_qty_array = [...req.body.adjust_qty]
            var type_array = [...req.body.type]

            console.log("else", type_array);
        } 
        
        const newproduct = product_name_array.map((value)=>{
            
            return  value  = {
                        product_name : value,
                    } 
            })
                    
        stock_adjust_array.forEach((value,i) => {
            newproduct[i].stock_adjust = value
        });

        adjust_qty_array.forEach((value,i) => {
            newproduct[i].adjust_qty = value
        });
        
        type_array.forEach((value, i) => {
            newproduct[i].type = value
        })



        var error = 0
        newproduct.forEach(data => {
            console.log("foreach newproduct", data);
            if (parseInt(data.stock_adjust) <= 0 ) {
                
                error++
            }
        })
        if (error != 0) {
            
            req.flash("errors", `You can't subtract, the current stock is 0`)
            return res.redirect("back")
        }



        old_adjustment.product.forEach(product_details => {
            // console.log("if product_details", product_details);

            const match_data = old_warehouse_data.product_details.map((data) => {
                // console.log("map", data);

                if (product_details.type == "Subtract") {
                    
                    if (data.product_name == product_details.product_name) {
                        
                        data.product_stock = parseInt(data.product_stock) + parseInt(product_details.adjust_qty)
                    }
                } else {
                    
                    if (data.product_name == product_details.product_name) {
                        
                        data.product_stock = parseInt(data.product_stock) - parseInt(product_details.adjust_qty)
                    }
                }

            })
        })
        console.log("old_warehouse_data", old_warehouse_data);
        await old_warehouse_data.save()


        old_adjustment.warehouse_name = warehouse_name
        old_adjustment.date = date
        old_adjustment.product = newproduct
        old_adjustment.note = note

        const adjustment_data = await old_adjustment.save()
        // console.log(data);

        const new_warehouse_data = await warehouse.findOne({ name: warehouse_name });
        // console.log("new_warehouse_data", new_warehouse_data);

        adjustment_data.product.forEach(product_details => {
            // console.log("if product_details", product_details);

            const match_data = new_warehouse_data.product_details.map((data) => {
                // console.log("map", data);

                if (product_details.type == "Subtract") {
                    
                    if (data.product_name == product_details.product_name) {
                        
                        data.product_stock = parseInt(data.product_stock) - parseInt(product_details.adjust_qty)
                    }
                } else {

                    if (data.product_name == product_details.product_name) {
                        
                        data.product_stock = parseInt(data.product_stock) + parseInt(product_details.adjust_qty)
                    }
                }

            })
        })
        
        console.log("final", new_warehouse_data);
        await new_warehouse_data.save()

        req.flash('success', `adjustment data update successfully`)
        res.redirect("/adjustment/view")

    } catch (error) {
        console.log(error);
    }
})



module.exports = router;
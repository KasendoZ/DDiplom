const express = require("express");
const app = express();
const router = express.Router();
const { profile, master_shop, categories, brands, units, product, warehouse, staff, customer, suppliers, purchases, purchases_return, sales, sales_return, suppliers_payment, customer_payment, transfers } = require("../models/all_models");
const auth = require("../middleware/auth");
const users = require("../public/language/languages.json");


router.get("/view", auth, async(req, res) => {
    try {
        const {username, email, role} = req.user
        const role_data = req.user
        
        const profile_data = await profile.findOne({email : role_data.email})
        
        const master = await master_shop.find()
        console.log("master" , master);

        const transfer_data = await transfers.find()
        console.log("transfers transfer_data", transfer_data);

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

        res.render("transfer", {
            success: req.flash('success'),
            errors: req.flash('errors'),
            role : role_data,
            profile : profile_data,
            master_shop : master,
            transfer: transfer_data,
            language : lan_data
        })
    } catch (error) {
        console.log(error);
    }
})


router.get("/view/add_transfer", auth, async(req, res) => {
    try{
        const {username, email, role} = req.user
        const role_data = req.user
        
        const profile_data = await profile.findOne({email : role_data.email})

        const master = await master_shop.find()
        console.log("master" , master);

        const warehouse_data = await warehouse.find({status : 'Enabled'})

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

        res.render("add_transfer", {
            success: req.flash('success'),
            errors: req.flash('errors'),
            role : role_data,
            profile : profile_data,
            master_shop : master,
            warehouse: warehouse_data,
            language : lan_data
        })
        
    }catch(error){
        console.log(error);
    }
})

router.post("/view/add_transfer", auth, async(req, res) => {
    try{
        console.log(req.body);
        const {date, from_warehouse, to_warehouse, product_name, quantity, note} = req.body



        if(typeof product_name == "string"){
            var product_name_array = [req.body.product_name]
            var stock_array = [req.body.stock]
            var quantity_array = [req.body.quantity]
            
            console.log("if");
        }else{
            var product_name_array = [...req.body.product_name]
            var stock_array = [...req.body.stock]
            var quantity_array = [...req.body.quantity]

            console.log("else", product_name_array);
        } 
        
        const newproduct = product_name_array.map((value)=>{
            
            return  value  = {
                        product_name : value,
                    }   
            })
                    
        stock_array.forEach((value,i) => {
            newproduct[i].stock = value
        });

        quantity_array.forEach((value,i) => {
            newproduct[i].quantity = value
        });
        



        var error = 0
        newproduct.forEach(data => {
            console.log("foreach newproduct", data);
            if (parseInt(data.stock) < parseInt(data.quantity)) {
                
                error++
            }
        })
        if (error != 0) {
            
            req.flash("errors", `Must not be greater than stock Qty`)
            return res.redirect("back")
        }


        
        // console.log("newproduct", newproduct);
        
        const data = new transfers({ date, from_warehouse, to_warehouse, product:newproduct, note })
        const transfers_data = await data.save()
        console.log(data);




        const from_warehouse_data = await warehouse.findOne({ name: from_warehouse });

        data.product.forEach(product_details => {
            // console.log("if product_details", product_details);


            const match_data = from_warehouse_data.product_details.map((data) => {
                // console.log("map", data);

                if (data.product_name == product_details.product_name) {
                    data.product_stock = parseInt(data.product_stock) - parseInt(product_details.quantity)
                    
                }

            })
            // console.log("final", from_warehouse_data);
        })

        await from_warehouse_data.save()




        const to_warehouse_data = await warehouse.findOne({ name: to_warehouse });

        data.product.forEach(product_details => {
            // console.log("if product_details", product_details);

            var x = 0;
            const match_data = to_warehouse_data.product_details.map((data) => {
                // console.log("map", data);

                if (data.product_name == product_details.product_name) {
                    data.product_stock = parseInt(data.product_stock) + parseInt(product_details.quantity)
                    x++
                }

            })

            if (x == "0") {
                to_warehouse_data.product_details = to_warehouse_data.product_details.concat({ product_name: product_details.product_name, product_stock: product_details.quantity })
            }   
            // console.log("final", to_warehouse_data);
        })

        await to_warehouse_data.save()



        req.flash('success', `Product Transfer successfully`)
        res.redirect("/transfer/view")

    }catch(error){
        console.log(error);
    }
})


router.get("/view/:id", auth, async(req, res) => {
    try { 
        const {username, email, role} = req.user
        const role_data = req.user
        
        const profile_data = await profile.findOne({email : role_data.email})

        const master = await master_shop.find()
        console.log("master" , master);


        const transfer_data = await transfers.findById(req.params.id)
        const warehouse_data = await warehouse.find({status : 'Enabled'})

        const stock_data = await warehouse.aggregate([
            {
                $match: { "name": transfer_data.from_warehouse }
            },
            {
                $unwind: "$product_details"
            },
            // {
            //     $match: { "product_details.product_name": transfer_data.product_name }
            // },
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

        res.render("edit_transfer", {
            success: req.flash('success'),
            errors: req.flash('errors'),
            role : role_data,
            profile : profile_data,
            master_shop : master,
            warehouse: warehouse_data,
            transfer: transfer_data,
            stock: stock_data,
            unit: product_data,
            language : lan_data
        })
        
    } catch (error) {
        console.log(error);
    }
})

router.post("/view/:id", auth, async(req, res) => {
    try {
        const _id = req.params.id
        console.log(req.body);

        const transfer_data = await transfers.findById(_id)
        console.log("transfer_data" , transfer_data);



        const {date, from_warehouse, to_warehouse, product_name, quantity, note} = req.body



        if(typeof product_name == "string"){
            var product_name_array = [req.body.product_name]
            var stock_array = [req.body.stock]
            var quantity_array = [req.body.quantity]
            
            console.log("if");
        }else{
            var product_name_array = [...req.body.product_name]
            var stock_array = [...req.body.stock]
            var quantity_array = [...req.body.quantity]

            console.log("else", product_name_array);
        } 
        
        const newproduct = product_name_array.map((value)=>{
            
            return  value  = {
                        product_name : value,
                    }   
            })
                    
        stock_array.forEach((value,i) => {
            newproduct[i].stock = value
        });

        quantity_array.forEach((value,i) => {
            newproduct[i].quantity = value
        });
        


        var error = 0
        newproduct.forEach(data => {
            console.log("foreach newproduct", data);
            if (parseInt(data.stock) < parseInt(data.quantity)) {
                
                error++
            }
        })
        if (error != 0) {
            
            req.flash("errors", `Must not be greater than stock Qty`)
            return res.redirect("back")
        }




        const old_from_warehouse_data = await warehouse.findOne({ name: transfer_data.from_warehouse });

        transfer_data.product.forEach(product_details => {
            // console.log("if product_details", product_details);


            const match_data = old_from_warehouse_data.product_details.map((data) => {
                // console.log("map", data);

                if (data.product_name == product_details.product_name) {
                    data.product_stock = parseInt(data.product_stock) + parseInt(product_details.quantity)
                    
                }

            })
            // console.log("final", old_from_warehouse_data);
        })

        await old_from_warehouse_data.save()



        const old_to_warehouse_data = await warehouse.findOne({ name: transfer_data.to_warehouse });

        transfer_data.product.forEach(product_details => {
            // console.log("if product_details", product_details);

            const match_data = old_to_warehouse_data.product_details.map((data) => {
                // console.log("map", data);

                if (data.product_name == product_details.product_name) {
                    data.product_stock = parseInt(data.product_stock) - parseInt(product_details.quantity)
                   
                }

            }) 
            // console.log("final", old_to_warehouse_data);
        })

        await old_to_warehouse_data.save()



        
        transfer_data.date = date
        transfer_data.from_warehouse = from_warehouse
        transfer_data.to_warehouse = to_warehouse
        transfer_data.product = newproduct
        transfer_data.note = note

        const data = await transfer_data.save()
        console.log(data);



        const from_warehouse_data = await warehouse.findOne({ name: from_warehouse });

        data.product.forEach(product_details => {
            // console.log("if product_details", product_details);


            const match_data = from_warehouse_data.product_details.map((data) => {
                // console.log("map", data);

                if (data.product_name == product_details.product_name) {
                    data.product_stock = parseInt(data.product_stock) - parseInt(product_details.quantity)
                    
                }

            })
            // console.log("final", from_warehouse_data);
        })

        await from_warehouse_data.save()



        const to_warehouse_data = await warehouse.findOne({ name: to_warehouse });

        data.product.forEach(product_details => {
            // console.log("if product_details", product_details);

            var x = 0;
            const match_data = to_warehouse_data.product_details.map((data) => {
                // console.log("map", data);

                if (data.product_name == product_details.product_name) {
                    data.product_stock = parseInt(data.product_stock) + parseInt(product_details.quantity)
                    x++
                }

            })

            if (x == "0") {
                to_warehouse_data.product_details = to_warehouse_data.product_details.concat({ product_name: product_details.product_name, product_stock: product_details.quantity })
            }   
            // console.log("final", to_warehouse_data);
        })

        await to_warehouse_data.save()
        
        req.flash('success', `Transfer Edit Successfully`)
        res.redirect("/transfer/view")

    } catch (error) {
        console.log(error);
    }
})


module.exports = router;
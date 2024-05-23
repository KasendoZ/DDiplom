const express = require("express");
const app = express();
const router = express.Router();
const { profile, master_shop, categories, brands, units, product, warehouse, staff, customer, suppliers, purchases, purchases_return, sales, sales_return, customer_payment, c_payment_data } = require("../models/all_models");
const auth = require("../middleware/auth");
const users = require("../public/language/languages.json");


router.get("/view", auth, async (req, res) => {
    try {
        const {username, email, role} = req.user
        const role_data = req.user
        
        const profile_data = await profile.findOne({email : role_data.email})

        const master = await master_shop.find()
        console.log("master" , master);

        const all_data = await sales_return.aggregate([
            {
                $lookup:
                {
                    from: "customers",
                    localField: "customer",
                    foreignField: "name",
                    as: "customer_docs"
                }
            },
            {
                $unwind: "$customer_docs"
            }
        ])
        console.log("all_data" , all_data);

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

        res.render("sales_return", {
            success: req.flash('success'),
            errors: req.flash('errors'),
            role : role_data,
            profile : profile_data,
            master_shop : master,
            user : all_data,
            language : lan_data
        })
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

        const _id = req.params.id
        console.log(_id);

        const user_id = await sales_return.findById(_id);
        console.log("user_id" , user_id);

        const stock_data = await warehouse.aggregate([
            {
                $match: { "name": user_id.warehouse_name }
            },
            {
                $unwind: "$product_details"
            },
            // {
            //     $match: { "product_details.product_name": user_id.product_name }
            // },
            {
                $group: {
                  _id: "$product_details.product_name",
                  product_stock: { $first: "$product_details.product_stock" } 
                }
            },
        ])
        console.log(stock_data);

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

        res.render("return_sale_edit", {
            success: req.flash('success'),
            errors: req.flash('errors'),
            role : role_data,
            profile : profile_data,
            master_shop : master,
            user: user_id,
            stock: stock_data,
            unit: product_data,
            language : lan_data
        })
    } catch (error) {
        console.log(error);
    }
})

router.post("/view/:id", auth, async (req, res) => {
    try {
        const _id = req.params.id
        console.log(_id);

        const old_data = await sales_return.findOne({invoice : req.body.invoice})
        console.log("old_data" , old_data);


        const old_warehouse_data = await warehouse.findOne({ name: old_data.warehouse_name });
        console.log("old_warehouse_data", old_warehouse_data);


        



        const { invoice, customer, date, warehouse_name, product_name, sale_qty, stock_quantity, return_qty, price, total, note, total_amount, discount, payable_to_customer, paid_amount, due_amount } = req.body
        console.log(req.body);

        if(typeof product_name == "string"){
            var product_name_array = [req.body.product_name]
            var sale_qty_array = [req.body.sale_qty]
            var stock_quantity_array = [req.body.stock_quantity]
            var return_qty_array = [req.body.return_qty]
            var price_array = [req.body.price]
            var total_array = [req.body.total]
            
            console.log("if");
        }else{
            var product_name_array = [...req.body.product_name]
            var sale_qty_array = [...req.body.sale_qty]
            var stock_quantity_array = [...req.body.stock_quantity]
            var return_qty_array = [...req.body.return_qty]
            var price_array = [...req.body.price]
            var total_array = [...req.body.total]

            console.log("else", product_name_array);
        } 
        
        const newproduct = product_name_array.map((value)=>{
            
            return  value  = {
                        product_name : value,
                    }   
        })
        
        sale_qty_array.forEach((value, i) => {
            newproduct[i].sale_qty = value
        })

        stock_quantity_array.forEach((value, i) => {
            newproduct[i].stock_quantity = value
        })
        
        return_qty_array.forEach((value, i) => {
            newproduct[i].return_qty = value
        })
        
        price_array.forEach((value, i) => {
            newproduct[i].price = value
        })
        
        total_array.forEach((value, i) => {
            newproduct[i].total = value
        })
        
        console.log("newproduct", newproduct);



        
        var error = 0
        newproduct.forEach(data => {
            console.log("foreach newproduct", data);
            if (parseInt(data.sale_qty) < parseInt(data.return_qty) || parseInt(data.stock_quantity) < parseInt(data.return_qty) || parseInt(data.return_qty) == 0 ) {
                
                error++
            }
        })
        if (error != 0) {
            
            req.flash("errors", `Must not be greater than sale Qty`)
            return res.redirect("back")
        }




        old_data.return_sale.forEach(product_details => {
            // console.log("if product_details", product_details);



            const match_data = old_warehouse_data.product_details.map((data) => {
                // console.log("map", data);

                if (data.product_name == product_details.product_name) {
                    data.product_stock = parseInt(data.product_stock) + parseInt(product_details.return_qty)
                    
                }

            })
        })
        console.log("old_warehouse_data", old_warehouse_data);
        await old_warehouse_data.save()




        old_data.invoice = invoice
        old_data.customer = customer
        old_data.date = date
        old_data.warehouse_name = warehouse_name
        old_data.return_sale = newproduct
        old_data.note = note
        old_data.total_amount = total_amount
        old_data.discount = discount
        old_data.payable_to_customer = payable_to_customer
        old_data.paid_amount = paid_amount
        old_data.due_amount = due_amount
        
        
        const new_data = await old_data.save()
        console.log("new new_data", new_data);



        // -------- supplier payment ------- //

        const c_payment = await c_payment_data.findOne({invoice : req.body.invoice , reason : "Sale Return"})

        c_payment.suppliers = req.body.suppliers
        c_payment.date = req.body.date
        c_payment.amount = parseFloat(req.body.due_amount)


        await c_payment.save()

        // -------- supplier payment end ------- //



        req.flash("success", `purchase return successfully`)
        res.redirect("/sales_return/view")
    } catch (error) {
        console.log(error);
    }
})

// // ========= Give Payment ============= //

router.post("/give_payment/:id", auth, async (req, res) => {
    try {
        const _id = req.params.id;
        const { invoice, customer, payable_to_customer, paid_amount } = req.body
        
        const data = await sales_return.findById(_id)
        console.log("data" , data);
        console.log(payable_to_customer);
        console.log(paid_amount);

        var subtract = payable_to_customer - paid_amount
        console.log("subtract" , subtract);


        data.paid_amount = parseFloat(paid_amount) + parseFloat(data.paid_amount)
        data.due_amount = subtract


        console.log(data);
        const new_data = await data.save();
        // console.log(new_data);


        // -------- c_payment ------- //
        console.log(111111);
        const c_payment = await c_payment_data.findOne({invoice : req.body.invoice , reason : "Sale Return"})
        console.log("c_payment" , c_payment);

        c_payment.amount = subtract
        await c_payment.save()

        // -------- c_payment end ------- //


        // -------- supplier payment ------- //

        let date_ob = new Date();
        let newdate = ("0" + date_ob.getDate()).slice(-2);
        let month = ("0" + (date_ob.getMonth() + 1)).slice(-2);
        let year = date_ob.getFullYear();
        let final_date = year + "-" + month + "-" + newdate
       
        const customer_payment_data = new customer_payment({invoice, date : year + "-" + month + "-" + newdate, customer, reason : "Returned Payment For Sale Return", amount : paid_amount})

        const new_customer_payment = await customer_payment_data.save()

        // -------- supplier payment end ------- //



        req.flash('success', `payment successfull`)
        res.redirect("/sales_return/view")
    } catch (error) {
        console.log(error);
    }
})


router.get("/invoice/:id", auth, async (req, res) => {
    try {
        const {username, email, role} = req.user
        const role_data = req.user

        const profile_data = await profile.findOne({email : role_data.email})

        const master = await master_shop.find()
        console.log("master" , master);

        const _id = req.params.id

        const user_id = await sales_return.findById(_id);
        console.log(user_id);
        

        const customer_data = await customer.findOne({ name : user_id.customer });
        console.log(customer_data);
        
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
        res.render("sales_return_invoice", {
            success: req.flash('success'),
            errors: req.flash('errors'),
            role : role_data,
            profile : profile_data,
            master_shop : master,
            customers : customer_data,
            sales : user_id,
            language : lan_data
        })
    } catch (error) {
        console.log(error);
    }
})

module.exports = router;    
const express = require("express");
const app = express();
const router = express.Router();
const { profile, master_shop, categories, brands, units, product, warehouse, staff, customer, suppliers, purchases, purchases_return, suppliers_payment, s_payment_data, email_settings } = require("../models/all_models");
const auth = require("../middleware/auth");
const nodemailer = require('nodemailer');
var ejs = require('ejs');
const path = require("path");
const users = require("../public/language/languages.json");

router.get("/view", auth, async (req, res) => {
    try {
        const {username, email, role} = req.user
        const role_data = req.user

        const profile_data = await profile.findOne({email : role_data.email})

        const master = await master_shop.find()
        console.log("all purchases master" , master);

        const purchases_data = await purchases.aggregate([
            {
                $lookup:
                {
                    from: "suppliers",
                    localField: "suppliers",
                    foreignField: "name",
                    as: "suppliers_docs"
                }
            },
            {
                $unwind: "$suppliers_docs"
            }
        ])

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

        res.render("all_purchases", {
            success: req.flash('success'),
            errors: req.flash('errors'),
            purchases: purchases_data,
            role : role_data,
            profile : profile_data,
            master_shop : master,
            language : lan_data
        })
    } catch (error) {
        console.log("table page", error);
    }
})


// ========= Add Purchase ========== //

router.get("/view/add_purchases", auth, async (req, res) => {
    try {
        const {username, email, role} = req.user
        const role_data = req.user

        const profile_data = await profile.findOne({email : role_data.email})

        const master = await master_shop.find()
        console.log("master" , master);

        const suppliers_data = await suppliers.find({});
        const warehouse_data = await warehouse.find({status : 'Enabled'});
        
        const product_data = await product.find({});

        const purchases_data = await purchases.find({})
        const invoice_no = purchases_data.length + 1

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

        res.render("add_purchases", {
            success: req.flash('success'),
            errors: req.flash('errors'),
            role : role_data,
            profile : profile_data,
            suppliers: suppliers_data,
            warehouse: warehouse_data,
            product: product_data,
            invoice: invoice_no,
            master_shop : master,
            language : lan_data
        })
    } catch (error) {
        console.log(error);
    }
})


router.get("/view/add_purchases/:id", auth, async (req, res) => {
    try {
        const product_name = req.params.id
        console.log(product_name);

        const master = await master_shop.find()
        console.log("master" , master);

        const product_data = await product.findOne({name : product_name})
        console.log("product", product_data);
    
        res.status(200).json({product_data, master})
    } catch (error) {
        console.log("add_purchases error", error);
    }
})

    
router.post("/view/add_purchases", auth, async (req, res) => {
    try {
        console.log(req.body, "done");
        const { invoice, date, warehouse_name, product_name, quantity, price, total, note, total_amount, discount, payable, due_amount } = req.body
        console.log(req.body.product_name);

        
        if(typeof product_name == "string"){
            var product_name_array = [req.body.product_name]
            var quantity_array = [req.body.quantity]
            var price_array = [req.body.price]
            var total_array = [req.body.total]
            
            console.log("if");
        }else{
            var product_name_array = [...req.body.product_name]
            var quantity_array = [...req.body.quantity]
            var price_array = [...req.body.price]
            var total_array = [...req.body.total]

            console.log("else", product_name_array);
        } 
        
        const newproduct = product_name_array.map((value)=>{
            
            return  value  = {
                        product_name : value,
                    }   
            })
                    
        quantity_array.forEach((value,i) => {
            newproduct[i].quantity = value
        });
        
        price_array.forEach((value, i) => {
            newproduct[i].price = value
        })
        
        total_array.forEach((value, i) => {
            newproduct[i].total = value
        })
        
        
        const data = new purchases({ invoice, suppliers:req.body.suppliers, date, warehouse_name, product:newproduct, note, total_amount, discount, payable, due_amount })
        const purchases_data = await data.save()
        console.log(data);
        

        const new_purchase = await purchases.findOne({ invoice: invoice });
        console.log("new_purchase", new_purchase);
        
        // --------- warehouse ------- //

        const warehouse_data = await warehouse.findOne({ name: warehouse_name });

        new_purchase.product.forEach(product_details => {
            // console.log("if product_details", product_details);

            var x = 0;
            const match_data = warehouse_data.product_details.map((data) => {
                // console.log("map", data);

                if (data.product_name == product_details.product_name) {
                    data.product_stock = parseInt(data.product_stock) + parseInt(product_details.quantity)
                    x++
                }

            })

            if (x == "0") {
                warehouse_data.product_details = warehouse_data.product_details.concat({ product_name: product_details.product_name, product_stock: product_details.quantity })
            }
            // console.log("final", warehouse_data);
        })

        await warehouse_data.save()

        // --------- warehouse end ------- //


        // ------------- email ------------- //
    
        const master = await master_shop.find()
        console.log("add post", master[0].image);

        const email_data = await email_settings.findOne()

        const suppliers_data = await suppliers.findOne({name : req.body.suppliers})
        console.log("suppliers_data", suppliers_data);
        
        if (master[0].currency_placement == 1) {
            right_currency = master[0].currency
            left_currency = ""
        } else {
            right_currency = ""
            left_currency = master[0].currency
        }

        var product_list = product_name_array
        var quantity_list = quantity_array
        var price_list = price_array
        var total_list = total_array

        var arrayItems = "";
        var n;

        for (n in product_list) {
            arrayItems +=  '<tr>'+
                                '<td style="border: 1px solid black;">' + product_list[n] + '</td>' +
                                '<td style="border: 1px solid black;">' +quantity_list[n]+ '</td>' +
                                '<td style="border: 1px solid black;">'+ left_currency + '' + price_list[n] + ''+ right_currency +'</td>' +
                                '<td style="border: 1px solid black;">'+ left_currency + '' + total_list[n] + ''+ right_currency +'</td>' +
                            '</tr>'
        }
        
        console.log("product_list", arrayItems);
        

        let mailTransporter = nodemailer.createTransport({
            // host: email_data.host,
            // port: Number(email_data.port),
            // secure: false,
            service: 'gmail',
            auth: {
                user: email_data.email,
                pass: email_data.password
            }
        });

        let mailDetails = {
            from: email_data.email,
            to: suppliers_data.email,
            subject:'Purchase Mail',
            attachments: [{
                filename: 'Logo.png',
                path: __dirname + '/../public' +'/upload/'+master[0].image,
                cid: 'logo'
           }],
            html:'<!DOCTYPE html>'+
                '<html><head><title></title>'+
                '</head><body>'+
                    '<div>'+
                        '<div style="display: flex; align-items: center; justify-content: center;">'+
                            '<div>'+
                                '<img src="cid:logo" class="rounded" width="66.5px" height="66.5px"></img>'+
                            '</div>'+
                        
                            '<div>'+
                                '<h2> '+ master[0].site_title +' </h2>'+
                            '</div>'+
                        '</div>'+
                        '<hr class="my-3">'+
                        '<div>'+
                            '<h5 style="text-align: left;">'+
                                ' Order Number : '+ invoice +' '+
                                '<span style="float: right;">'+
                                    ' Order Date : '+ date +' '+
                                '</span>'+
                                
                            '</h5>'+
                        '</div>'+
                        '<table style="width: 100% !important;">'+
                            '<thead style="width: 100% !important;">'+
                                '<tr>'+
                                    '<th style="border: 1px solid black;"> Product Name </th>'+
                                    '<th style="border: 1px solid black;"> Product Quantity </th>'+
                                    '<th style="border: 1px solid black;"> Product Price </th>'+
                                    '<th style="border: 1px solid black;"> Total </th>'+
                                '</tr>'+
                            '</thead>'+
                            '<tbody style="text-align: center;">'+
                                ' '+ arrayItems +' '+
                            '</tbody>'+
                        '</table>'+
                        
                        '<div>'+
                            '<h4 style="text-align: right;">Total Amount : '+ left_currency + '' + total_amount +''+ right_currency +' </h4>'+
                            '<h4 style="text-align: right;">Discount : '+ left_currency + '' + discount +''+ right_currency +' </h4>'+
                            '<h4 style="text-align: right;">Payable Amount : '+ left_currency + '' + payable +''+ right_currency +'</h4>'+
                        '</div>'+
                        '<div>'+
                            '<strong> Regards </strong>'+
                            '<h5>'+ master[0].site_title +'</h5>'+
                        '</div>'+
                    '</div>'+
                '</body></html>'
        };
        
        mailTransporter.sendMail(mailDetails, function(err, data) {
            if(err) {
                console.log(err);
                console.log('Error Occurs');
            } else {
                console.log('Email sent successfully');
            }
        });

        
        // ------------- email end ------------- //


        // -------- supplier payment ------- //

        const s_payment = new s_payment_data({invoice : invoice, suppliers : req.body.suppliers , reason : "Purchase" , amount : due_amount})

        await s_payment.save()
        console.log("s_payment" , s_payment);

        // -------- supplier payment end ------- //


        req.flash('success', `purchase data add successfully`)
        res.redirect("/all_purchases/view");
    } catch (error) {
        console.log(error);
    }
})


// ========= edit Purchase ============ //

router.get("/view/:id", auth, async (req, res) => {
    try {
        const {username, email, role} = req.user
        const role_data = req.user

        const profile_data = await profile.findOne({email : role_data.email})

        const master = await master_shop.find()
        console.log("master" , master);

        const _id = req.params.id
        const user_id = await purchases.findById(_id);
        console.log("edit Purchase user_id", user_id);

        const suppliers_data = await suppliers.find({});
        const warehouse_data = await warehouse.find({status : 'Enabled'});
        const product_data = await product.find({});
        console.log("edit Purchase product_data", product_data);

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

        res.render("edit_purchases", {
            success: req.flash('success'),
            errors: req.flash('errors'),
            role : role_data,
            profile : profile_data,
            purchases: user_id,
            suppliers: suppliers_data,
            warehouse: warehouse_data,
            product: product_data,
            master_shop : master,
            language : lan_data
        })
    } catch (error) {
        console.log(error);
    }
})

router.post("/view/:id", auth, async (req, res) => {
    try {
        const _id = req.params.id;

        const purchases_data = await purchases.findOne({ _id: req.params.id })
        console.log("purchases_data", purchases_data);

        const old_warehouse_data = await warehouse.findOne({ name: purchases_data.warehouse_name });
        console.log("old_warehouse_data", old_warehouse_data);

        purchases_data.product.forEach(product_details => {
            // console.log("if product_details", product_details);

            const match_data = old_warehouse_data.product_details.map((data) => {
                // console.log("map", data);

                if (data.product_name == product_details.product_name) {
                    data.product_stock = parseInt(data.product_stock) - parseInt(product_details.quantity)
                    
                }

            })
        })
        console.log("old_warehouse_data", old_warehouse_data);
        await old_warehouse_data.save()


        const { invoice, suppliers, date, warehouse_name, product_name, quantity, price, total, note, total_amount, discount, payable, paid_amount, due_amount } = req.body
        console.log(req.body.product_name);

        if(typeof product_name == "string"){
            var product_name_array = [req.body.product_name]
            var quantity_array = [req.body.quantity]
            var price_array = [req.body.price]
            var total_array = [req.body.total]
            
        }else{
            var product_name_array = [...req.body.product_name]
            var quantity_array = [...req.body.quantity]
            var price_array = [...req.body.price]
            var total_array = [...req.body.total]

        } 
        
        const newproduct = product_name_array.map((value)=>{
            
            return  value  = {
                        product_name : value,
                    }   
            })
                    
        quantity_array.forEach((value,i) => {
            newproduct[i].quantity = value
        });
        
        price_array.forEach((value, i) => {
            newproduct[i].price = value
        })
        
        total_array.forEach((value, i) => {
            newproduct[i].total = value
        })
        

        purchases_data.invoice = invoice
        purchases_data.suppliers = suppliers
        purchases_data.date = date
        purchases_data.warehouse_name = warehouse_name
        purchases_data.product = newproduct
        purchases_data.note = note
        purchases_data.total_amount = total_amount
        purchases_data.discount = discount
        purchases_data.payable = payable
        purchases_data.paid_amount = paid_amount
        purchases_data.due_amount = due_amount
        
        console.log("new purchases_data", purchases_data);
        
        const new_data = await purchases_data.save()
        // console.log(data);

        const new_warehouse_data = await warehouse.findOne({ name: req.body.warehouse_name });
        console.log("new_warehouse_data", new_warehouse_data);

        purchases_data.product.forEach(product_details => {
            // console.log("if product_details", product_details);

            var x = 0;
            const match_data = new_warehouse_data.product_details.map((data) => {
                // console.log("map", data);

                if (data.product_name == product_details.product_name) {
                    data.product_stock = parseInt(data.product_stock) + parseInt(product_details.quantity)
                    x++
                }

            })

            if (x == "0") {
                new_warehouse_data.product_details = new_warehouse_data.product_details.concat({ product_name: product_details.product_name, product_stock: product_details.quantity })
            }
        })
        
        console.log("final", new_warehouse_data);
        await new_warehouse_data.save()


        // -------- supplier payment ------- //

        const s_payment = await s_payment_data.findOne({invoice : req.body.invoice})

        s_payment.suppliers = req.body.suppliers
        s_payment.amount = parseInt(req.body.due_amount)

        await s_payment.save()

        // -------- supplier payment end ------- //

        req.flash('success', `purchase data update successfully`)
        res.redirect("/all_purchases/view")
    } catch (error) {
        console.log(error);
    }
})


// ========= Give Payment ============= //

router.post("/give_payment/:id", auth, async (req, res) => {
    try {
        const _id = req.params.id;
        const { invoice, suppliers, payable, due_amount } = req.body

        const data = await purchases.findById(_id)

        var subtract = payable - due_amount

        data.paid_amount = parseFloat(data.paid_amount) + parseFloat(due_amount)
        data.due_amount = subtract

        const new_data = await data.save();
        console.log(new_data);

        // -------- s_payment ------- //

        const s_payment = await s_payment_data.findOne({invoice : invoice})
        s_payment.amount = subtract

        await s_payment.save()

        // -------- s_payment end ------- //


        // -------- supplier payment ------- //

        let date_ob = new Date();
        let newdate = ("0" + date_ob.getDate()).slice(-2);
        let month = ("0" + (date_ob.getMonth() + 1)).slice(-2);
        let year = date_ob.getFullYear();
        let final_date = year + "-" + month + "-" + newdate
       
        const suppliers_payment_data = new suppliers_payment({invoice, date : year + "-" + month + "-" + newdate, suppliers, reason : "Paid For Purchase", amount : due_amount})

        const new_suppliers_payment = await suppliers_payment_data.save()

        // -------- supplier payment end ------- //

        req.flash('success', `payment successfull`)
        res.redirect("/all_purchases/view")
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

        const user_id = await purchases.findById(_id);
        console.log(user_id);
        
        const suppliers_data = await suppliers.findOne({ name : user_id.suppliers });
        console.log(suppliers_data);

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
        
        res.render("purchase_invoice", {
            success: req.flash('success'),
            errors: req.flash('errors'),
            role : role_data,
            profile : profile_data,
            master_shop : master,
            supplier : suppliers_data,
            purchase : user_id,
            language : lan_data
        })
    } catch (error) {
        console.log(error);
    }
})


// ============ return purchase ============= //

router.get("/view/return_purchase/:id", auth, async (req, res) => {
    try {
        const {username, email, role} = req.user
        const role_data = req.user

        const profile_data = await profile.findOne({email : role_data.email})

        const master = await master_shop.find()
        console.log("master" , master);

        const _id = req.params.id
        console.log(_id);

        const user_id = await purchases.findById(_id);
        console.log("user_id", user_id);

        const product_data = await product.find({});

        const stock_data = await warehouse.aggregate([
            {
                $match: { "name": user_id.warehouse_name }
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

        res.render("return_purchase", {
            success: req.flash('success'),
            errors: req.flash('errors'),
            role : role_data,
            profile : profile_data,
            user: user_id,
            stock: stock_data,
            master_shop : master,
            product: product_data,
            language : lan_data
        })
    } catch (error) {
        console.log(error);
    }
})

router.post("/view/return_purchase/:id", auth, async (req, res) => {
    try {
        const { invoice, date, warehouse_name, product_name, purchase_quantity, stock_quantity, return_qty, price, total, note, total_amount, receivable, discount } = req.body
        console.log(req.body);


        if(typeof product_name == "string"){
            var product_name_array = [req.body.product_name]
            var quantity_array = [req.body.purchase_quantity]
            var stock_quantity_array = [req.body.stock_quantity]
            var return_qty_array = [req.body.return_qty]
            var price_array = [req.body.price]
            var total_array = [req.body.total]
            
        }else{
            var product_name_array = [...req.body.product_name]
            var quantity_array = [...req.body.purchase_quantity]
            var stock_quantity_array = [...req.body.stock_quantity]
            var return_qty_array = [...req.body.return_qty]
            var price_array = [...req.body.price]
            var total_array = [...req.body.total]

        } 
        
        const newproduct = product_name_array.map((value)=>{
            
            return  value  = {
                        product_name : value,
                    }   
            })
                    
        quantity_array.forEach((value,i) => {
            newproduct[i].purchase_quantity = value
        });

        stock_quantity_array.forEach((value,i) => {
            newproduct[i].stock_quantity = value
        });
        
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
            if (parseInt(data.purchase_quantity) < parseInt(data.return_qty) || parseInt(data.stock_quantity) < parseInt(data.return_qty) ) {
                
                error++
            }
        })
        if (error != 0) {
            
            req.flash("errors", `Must not be greater than Purchase/Stock Qty`)
            return res.redirect("back")
        }

        const data = new purchases_return({ invoice, suppliers:req.body.suppliers, date, warehouse_name, return_product:newproduct, note, total_amount, receivable, due_amount : receivable, discount })
        const purchases_return_data = await data.save()
        console.log(data);

        const new_purchase = await purchases_return.findOne({ invoice: invoice });

        const warehouse_data = await warehouse.findOne({ name: warehouse_name });

        new_purchase.return_product.forEach(product_details => {
            // console.log("if product_details", product_details);

            var x = 0;
            const match_data = warehouse_data.product_details.map((data) => {
                // console.log("map", data);

                if (data.product_name == product_details.product_name) {
                    data.product_stock = parseInt(data.product_stock) - parseInt(product_details.return_qty)
                    
                }

            })
            console.log("final", warehouse_data);
        })

        await warehouse_data.save()

        const old_data = await purchases.findOne({ invoice: invoice });
        // console.log(old_data);

        old_data.return_data = "True"

        const purchases_data = await old_data.save()
        // console.log(purchases_data);


        // -------- supplier payment ------- //

        const s_payment = new s_payment_data({invoice : invoice, suppliers : req.body.suppliers , reason : "Purchase Return" , amount : receivable})

        await s_payment.save()

        // -------- supplier payment end ------- //


        // ------------- email ------------- //
        

        const master = await master_shop.find()
        console.log("add post", master[0].image);

        const email_data = await email_settings.findOne()

        const suppliers_data = await suppliers.findOne({name : req.body.suppliers})
        console.log("suppliers_data", suppliers_data);
        
        if (master[0].currency_placement == 1) {
            right_currency = master[0].currency
            left_currency = ""
        } else {
            right_currency = ""
            left_currency = master[0].currency
        }

        var product_list = product_name_array
        var return_qty_list = return_qty_array
        var price_list = price_array
        var total_list = total_array

        var arrayItems = "";
        var n;

        for (n in product_list) {
            arrayItems +=  '<tr>'+
                                '<td style="border: 1px solid black;">' + product_list[n] + '</td>' +
                                '<td style="border: 1px solid black;">' +return_qty_list[n]+ '</td>' +
                                '<td style="border: 1px solid black;">'+ left_currency + '' + price_list[n] + ''+ right_currency +'</td>' +
                                '<td style="border: 1px solid black;">'+ left_currency + '' + total_list[n] + ''+ right_currency +'</td>' +
                            '</tr>'
        }
        
        console.log("product_list", arrayItems);
        
        let mailTransporter = nodemailer.createTransport({
            // host: email_data.host,
            // port: Number(email_data.port),
            // secure: false,
            service: 'gmail',
            auth: {
                user: email_data.email,
                pass: email_data.password
            }
        });

        let mailDetails = {
            from: email_data.email,
            to: suppliers_data.email,
            subject:'Purchase Return Mail',
            attachments: [{
                filename: 'Logo.png',
                path: __dirname + '/../public' +'/upload/'+master[0].image,
                cid: 'logo'
           }],
            html:'<!DOCTYPE html>'+
                '<html><head><title></title>'+
                '</head><body>'+
                    '<div>'+
                        '<div style="display: flex; align-items: center; justify-content: center;">'+
                            '<div>'+
                                '<img src="cid:logo" class="rounded" width="66.5px" height="66.5px"></img>'+
                            '</div>'+
                        
                            '<div>'+
                                '<h2> '+ master[0].site_title +' </h2>'+
                            '</div>'+
                        '</div>'+
                        '<hr class="my-3">'+
                        '<div>'+
                            '<h5 style="text-align: left;">'+
                                ' Order Number : '+ invoice +' '+
                                '<span style="float: right;">'+
                                    ' Order Date : '+ date +' '+
                                '</span>'+
                                
                            '</h5>'+
                        '</div>'+
                        '<table style="width: 100% !important;">'+
                            '<thead style="width: 100% !important;">'+
                                '<tr>'+
                                    '<th style="border: 1px solid black;"> Product Name </th>'+
                                    '<th style="border: 1px solid black;"> Return Quantity </th>'+
                                    '<th style="border: 1px solid black;"> Product Price </th>'+
                                    '<th style="border: 1px solid black;"> Total </th>'+
                                '</tr>'+
                            '</thead>'+
                            '<tbody style="text-align: center;">'+
                                ' '+ arrayItems +' '+
                            '</tbody>'+
                        '</table>'+
                        
                        '<div>'+
                            '<h4 style="text-align: right;">Total Amount : '+ left_currency + '' + total_amount +''+ right_currency +' </h4>'+
                            '<h4 style="text-align: right;">Discount : '+ left_currency + '' + discount +''+ right_currency +' </h4>'+
                            '<h4 style="text-align: right;">Receivable Amount : '+ left_currency + '' + receivable +''+ right_currency +'</h4>'+
                        '</div>'+
                        '<div>'+
                            '<strong> Regards </strong>'+
                            '<h5>'+ master[0].site_title +'</h5>'+
                        '</div>'+
                    '</div>'+
                '</body></html>'
        };
        
        mailTransporter.sendMail(mailDetails, function(err, data) {
            if(err) {
                console.log(err);
                console.log('Error Occurs');
            } else {
                console.log('Email sent successfully');
            }
        });

        
        // ------------- email end ------------- //

        req.flash('success', `purchases item return successfull`)
        res.redirect("/all_purchases/view")
    } catch (error) {
        console.log(error);
    }
})

module.exports = router;
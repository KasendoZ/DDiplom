const express = require("express");
const app = express();
const router = express.Router();
const { profile, master_shop, categories, brands, units, product, warehouse, staff, customer, suppliers, purchases, purchases_return, sales, sales_return, suppliers_payment, customer_payment, c_payment_data, email_settings } = require("../models/all_models");
const auth = require("../middleware/auth");
const nodemailer = require('nodemailer');
const users = require("../public/language/languages.json");


router.get("/view", auth, async (req, res) => {
    try {
        const {username, email, role} = req.user
        const role_data = req.user

        const profile_data = await profile.findOne({email : role_data.email})

        const master = await master_shop.find()

        const all_data = await sales.find();
        console.log("sales all_data", all_data);

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

        res.render("all_sales", {
            success: req.flash('success'),
            errors: req.flash('errors'),
            sales: all_data,
            profile : profile_data,
            role : role_data,
            master_shop : master,
            language : lan_data
        })
    } catch (error) {
        console.log(error);
    }
})

router.get("/view/add_sales", auth, async (req, res) => {
    try {
        const {username, email, role} = req.user
        const role_data = req.user

        const profile_data = await profile.findOne({email : role_data.email})

        const master = await master_shop.find()
        console.log("master" , master);

        const customer_data = await customer.find({})
        const warehouse_data = await warehouse.find({status : "Enabled"})
        
        const product_data = await product.find({})

        const sales_data = await sales.find({})
        const invoice_no = sales_data.length + 1

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

        res.render("add_sales", {
            success: req.flash('success'),
            errors: req.flash('errors'),
            role : role_data,
            profile : profile_data,
            customer: customer_data,
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

// ======= product ajax router ========= //

router.get("/view/add_sales/:id", auth, async (req, res) => {
    try {
        const warehouse = req.params.id
        console.log(warehouse);
        const product_data = await product.find()

        const purchases_data = await purchases.aggregate([
            {
                $match: { "warehouse_name": warehouse }
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

        res.status(200).json({ purchases_data, product_data })
    } catch (error) {
        console.log(error);
    }
})

// ======= product ajax router end ========= //


router.post("/view/add_sale/product", auth, async (req, res) => {   
    try {
        const { warehouse_data, product_data } = req.body
        console.log(req.body.product_data);;

        const master = await master_shop.find()
        console.log("master" , master);

        const new_product = await product.findOne({name : product_data})
        console.log("product", new_product);

        const stock_data = await warehouse.aggregate([
            {
                $match: { "name": warehouse_data }
            },
            {
                $unwind: "$product_details"
            },
            {
                $match: { "product_details.product_name": product_data }
            },
            {
                $group: {
                    _id: "$product_details.product_name",
                    product_stock: { $first: "$product_details.product_stock" }
                }
            },
        ])
        console.log("stock_data", stock_data);
            
        
        res.status(200).json({master, new_product, stock_data})
    } catch (error) {
        console.log(error);
    }
})


router.post("/view/add_sales", auth, async (req, res) => {
    try {
        const { invoice, date, warehouse_name, product_name, stock, quantity, price, total, note, total_price, discount, receivable_amount, received_amount, due_amount } = req.body
    

        if(typeof product_name == "string"){
            var product_name_array = [req.body.product_name]
            var stock_array = [req.body.stock]
            var quantity_array = [req.body.quantity]
            var price_array = [req.body.price]
            var total_array = [req.body.total]
            
        }else{
            var product_name_array = [...req.body.product_name]
            var stock_array = [...req.body.stock]
            var quantity_array = [...req.body.quantity]
            var price_array = [...req.body.price]
            var total_array = [...req.body.total]

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
        
        price_array.forEach((value, i) => {
            newproduct[i].price = value
        })
        
        total_array.forEach((value, i) => {
            newproduct[i].total = value
        })
        
        var error = 0
        newproduct.forEach(data => {
            console.log("foreach newproduct", data);
            if (parseInt(data.stock) < parseInt(data.quantity) || parseInt(data.quantity) == 0 ) {
                
                error++
            }
        })
        if (error != 0) {
            
            req.flash("errors", `Must not be greater than stock Qty`)
            return res.redirect("back")
        }

        // console.log("newproduct", newproduct);
        console.log(req.body.total_price);
        const data = new sales({ invoice, customer: req.body.customer, date, warehouse_name, sale_product:newproduct, note, total_price, discount, receivable_amount, received_amount, due_amount })

        var due = receivable_amount
        data.due_amount = due

        const purchases_data = await data.save()
        console.log(data);


        const new_sales = await sales.findOne({ invoice: invoice });
        // console.log("new_purchase", new_purchase);
        
        // --------- warehouse ------- //

        const warehouse_data = await warehouse.findOne({ name: warehouse_name });

        new_sales.sale_product.forEach(product_details => {
            // console.log("if product_details", product_details);

            const match_data = warehouse_data.product_details.map((data) => {
                // console.log("map", data);

                if (data.product_name == product_details.product_name) {
                    data.product_stock = parseInt(data.product_stock) - parseInt(product_details.quantity)
                    
                }

            })

            // console.log("final", warehouse_data);
        })

        await warehouse_data.save()

        // --------- warehouse end ------- //



        // -------- c_payment ------- //

        const c_payment = new c_payment_data({invoice : invoice, customer : req.body.customer , reason : "Sale" , amount : due})

        await c_payment.save()

        // -------- c_payment end ------- //



        // ------------- email ------------- //
        

        const master = await master_shop.find()
        console.log("add post", master[0].image);

        const email_data = await email_settings.findOne()

        const customer_data = await customer.findOne({name : req.body.customer})
        console.log("customer_data", customer_data);
        
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
                                '<td style="border: 1px solid black;">' + quantity_list[n] + '</td>' +
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
            to: customer_data.email,
            subject:'Sale Product Mail',
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
                                    '<th style="border: 1px solid black;"> Quantity </th>'+
                                    '<th style="border: 1px solid black;"> Price </th>'+
                                    '<th style="border: 1px solid black;"> Total </th>'+
                                '</tr>'+
                            '</thead>'+
                            '<tbody style="text-align: center;">'+
                                ' '+ arrayItems +' '+
                            '</tbody>'+
                        '</table>'+
                        
                        '<div>'+
                            '<h4 style="text-align: right;">Total Amount : '+ left_currency + '' + total_price +''+ right_currency +' </h4>'+
                            '<h4 style="text-align: right;">Discount : '+ left_currency + '' + discount +''+ right_currency +' </h4>'+
                            '<h4 style="text-align: right;">Receivable Amount : '+ left_currency + '' + receivable_amount +''+ right_currency +'</h4>'+
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

        req.flash("success", "Sales Add successfully")
        res.redirect("/all_sales/view")
    } catch (error) {
        console.log(error);
    }
})


router.get("/view/:id", auth , async (req, res) => {
    try {
        const {username, email, role} = req.user
        const role_data = req.user

        const profile_data = await profile.findOne({email : role_data.email})

        const master = await master_shop.find()
        console.log("master" , master);

        const _id = req.params.id

        const user_id = await sales.findById(_id);
        console.log("user_id", user_id);

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


        const customer_data = await customer.find({})
        const warehouse_data = await warehouse.find({status : 'Enabled'})

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

        res.render("edit_sales", {
            success: req.flash('success'),
            errors: req.flash('errors'),
            role : role_data,
            profile : profile_data,
            customer: customer_data,
            warehouse: warehouse_data,
            product: stock_data,
            user: user_id,
            master_shop : master,
            unit: product_data,
            language : lan_data
            
        })
    } catch (error) {
        console.log(error);
    }
})

router.post("/view/:id", auth , async (req, res) => {
    try {
        const _id = req.params.id
        console.log(_id);

        const old_sales = await sales.findOne({ _id: req.params.id })

        const old_warehouse_data = await warehouse.findOne({ name: old_sales.warehouse_name });
        console.log("old_warehouse_data", old_warehouse_data);


        const { invoice, customer, date, warehouse_name, product_name, quantity, price, total, note, total_price, discount, receivable_amount, received_amount, due_amount } = req.body
        console.log(req.body);


        if(typeof product_name == "string"){
            var product_name_array = [req.body.product_name]
            var stock_array = [req.body.stock]
            var quantity_array = [req.body.quantity]
            var price_array = [req.body.price]
            var total_array = [req.body.total]
            
        }else{
            var product_name_array = [...req.body.product_name]
            var stock_array = [req.body.stock]
            var quantity_array = [...req.body.quantity]
            var price_array = [...req.body.price]
            var total_array = [...req.body.total]

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

        price_array.forEach((value, i) => {
            newproduct[i].price = value
        })
        
        total_array.forEach((value, i) => {
            newproduct[i].total = value
        })

        var error = 0
        newproduct.forEach(data => {
            console.log("foreach newproduct", data);
            if (parseInt(data.stock) < parseInt(data.quantity) || parseInt(data.quantity) == 0 ) {
                
                error++
            }
        })
        if (error != 0) {
            
            req.flash("errors", `Must not be greater than stock Qty`)
            return res.redirect("back")
        }


        old_sales.sale_product.forEach(product_details => {
            // console.log("if product_details", product_details);

            const match_data = old_warehouse_data.product_details.map((data) => {
                // console.log("map", data);

                if (data.product_name == product_details.product_name) {
                    data.product_stock = parseInt(data.product_stock) + parseInt(product_details.quantity)
                
                }

            })
        })
        console.log("old_warehouse_data", old_warehouse_data);
        await old_warehouse_data.save()



        old_sales.invoice = invoice
        old_sales.customer = customer
        old_sales.date = date
        old_sales.warehouse_name = warehouse_name
        old_sales.sale_product = newproduct
        old_sales.note = note
        old_sales.total_price = total_price
        old_sales.discount = discount
        old_sales.receivable_amount = receivable_amount
        old_sales.received_amount = received_amount
        old_sales.due_amount = due_amount
        
        
        const new_data = await old_sales.save()
        console.log("new new_data", new_data);

        
        const new_sales_data = await sales.findOne({ _id: req.params.id });
        console.log("new_sales_data", new_sales_data);

        const new_warehouse_data = await warehouse.findOne({ name: warehouse_name });
        // console.log("new_warehouse_data", new_warehouse_data);

        new_sales_data.sale_product.forEach(product_details => {
            // console.log("if product_details", product_details);

            const match_data = new_warehouse_data.product_details.map((data) => {
                // console.log("map", data);

                if (data.product_name == product_details.product_name) {
                    data.product_stock = parseInt(data.product_stock) - parseInt(product_details.quantity)
                    
                }

            })
        })
        
        console.log("final", new_warehouse_data);
        await new_warehouse_data.save()


        // -------- supplier payment ------- //

        const c_payment = await c_payment_data.findOne({invoice : req.body.invoice})

        c_payment.suppliers = req.body.suppliers
        c_payment.amount = parseFloat(req.body.due_amount)

        await c_payment.save()

        // -------- supplier payment end ------- //

        req.flash("success", `Sales Update successfully`)
        res.redirect("/all_sales/view")

    } catch (error) {
        console.log(error);
    }
})

// ========= Give Payment ============= //

router.post("/give_payment/:id", auth , async (req, res) => {
    try {
        const _id = req.params.id;
        const { invoice, customer, receivable_amount, received_amount } = req.body

        const data = await sales.findById(_id)
        console.log(data);

        var subtract = receivable_amount - received_amount
        console.log(received_amount);

        data.received_amount = parseFloat(received_amount) + parseFloat(data.received_amount)
        data.due_amount = subtract

        console.log(data);
        const new_data = await data.save();


        // -------- c_payment ------- //

        const c_payment = await c_payment_data.findOne({invoice : invoice})
        c_payment.amount = subtract

        await c_payment.save()

        // -------- c_payment end ------- //


        // -------- supplier payment ------- //

        let date_ob = new Date();
        let newdate = ("0" + date_ob.getDate()).slice(-2);
        let month = ("0" + (date_ob.getMonth() + 1)).slice(-2);
        let year = date_ob.getFullYear();
        let final_date = year + "-" + month + "-" + newdate
       
        const customer_payment_data = new customer_payment({invoice, date : year + "-" + month + "-" + newdate, customer, reason : "Received Payment For Sale", amount : received_amount})

        const new_customer_payment = await customer_payment_data.save()

        // -------- supplier payment end ------- //

        req.flash('success', `payment successfull`)
        res.redirect("/all_sales/view")
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

        const user_id = await sales.findById(_id);
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
        
        res.render("sales_invoice", {
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

// ============ return sales ============= //

router.get("/view/return_sales/:id", auth , async (req, res) => {
    try {
        const {username, email, role} = req.user
        const role_data = req.user

        const profile_data = await profile.findOne({email : role_data.email})

        const master = await master_shop.find()
        console.log("master" , master);

        const _id = req.params.id
        console.log(_id);

        const user_id = await sales.findById(_id);
        console.log("user_id" , user_id);

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

        res.render("return_sale", {
            success: req.flash('success'),
            errors: req.flash('errors'),
            role : role_data,
            profile : profile_data,
            user: user_id,
            stock: stock_data,
            master_shop : master,
            unit: product_data,
            language : lan_data
        })
    } catch (error) {
        console.log(error);
    }
})

router.post("/view/return_sales/:id", auth , async (req, res) => {
    try {
        const { invoice, date, warehouse_name, product_name, sale_qty, stock_quantity, return_qty, price, total, note, total_amount, discount, payable_to_customer, due_amount } = req.body
        console.log(req.body);

        if(typeof product_name == "string"){
            var product_name_array = [req.body.product_name]
            var sale_qty_array = [req.body.sale_qty]
            var stock_quantity_array = [req.body.stock_quantity]
            var return_qty_array = [req.body.return_qty]
            var price_array = [req.body.price]
            var total_array = [req.body.total]
            
        }else{
            var product_name_array = [...req.body.product_name]
            var sale_qty_array = [...req.body.sale_qty]
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


        const old_data = await sales.findOne({ invoice: invoice });
        console.log(old_data);

        old_data.return_data = "True"
        
        const sales_data = await old_data.save()
        
        const data = new sales_return({ invoice, customer: req.body.customer, date, warehouse_name, return_sale:newproduct, note, total_amount, discount, payable_to_customer, due_amount })
        const sale_return_data = await data.save()
        console.log(data);


        const new_sales_return = await sales_return.findOne({ invoice: invoice });

        const warehouse_data = await warehouse.findOne({ name: warehouse_name });

        new_sales_return.return_sale.forEach(product_details => {
            // console.log("if product_details", product_details);

            const match_data = warehouse_data.product_details.map((data) => {
                // console.log("map", data);

                if (data.product_name == product_details.product_name) {
                    data.product_stock = parseInt(data.product_stock) + parseInt(product_details.return_qty)
                    
                }

            })
            console.log("final", warehouse_data);
        })

        await warehouse_data.save()


        // -------- supplier payment ------- //
        console.log(req.body);
        const c_payment = new c_payment_data({invoice : invoice, customer : req.body.customer , reason : "Sale Return" , amount : due_amount})

        await c_payment.save()

        // -------- supplier payment end ------- //


        // ------------- email ------------- //
        
        const master = await master_shop.find()
        console.log("add post", master[0].image);

        const email_data = await email_settings.findOne()

        const customer_data = await customer.findOne({name : req.body.customer})
        console.log("customer_data", customer_data);
        
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
            arrayItems +=   '<tr>'+
                                '<td style="border: 1px solid black;">' + product_list[n] + '</td>' +
                                '<td style="border: 1px solid black;">' + return_qty_list[n] + '</td>' +
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
            to: customer_data.email,
            subject:'Sale Return Mail',
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
                                    '<th style="border: 1px solid black;"> Price </th>'+
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
                            '<h4 style="text-align: right;">Payable to Customer : '+ left_currency + '' + payable_to_customer +''+ right_currency +'</h4>'+
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

        req.flash('success', `sales item return successfull`)
        res.redirect("/all_sales/view")
    } catch (error) {
        console.log(error);
    }
})


module.exports = router;
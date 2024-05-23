const express = require("express");
const res = require("express/lib/response");
const app = express();
const router = express.Router();
const multer = require('multer');
const { profile, master_shop, categories, brands, units, product, purchases, warehouse } = require("../models/all_models");
const auth = require("../middleware/auth");
const users = require("../public/language/languages.json");

// ========== categories ============ //

router.get("/categories", auth, async (req, res) => {
    try {
        const {username, email, role} = req.user
        const role_data = req.user

        const profile_data = await profile.findOne({email : role_data.email})

        const master = await master_shop.find()
        console.log("master" , master);

        const find_data = await categories.find();
        // console.log(find_data);

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

        res.render("categories", {
            success: req.flash('success'),
            errors: req.flash('errors'),
            role : role_data,
            profile : profile_data,
            user: find_data,
            master_shop : master,
            language : lan_data
            })
    } catch (error) {
        console.log(error);
    }
})

router.post("/categories", auth, async (req, res) => {
    try {
        // console.log(req.body.name);
        const { name, products } = req.body;
        const data = new categories({ name, products })

        const categories_name = await categories.findOne({name:name})
        if(categories_name){
            req.flash("errors", `${name} categories is alredy added. please choose another`)
        }else{
            req.flash("success", `${name} categories is add successfully`)
        }

        const userdata = await data.save();
        // console.log(userdata);
        res.redirect("/products/categories")
    } catch (error) {
        console.log(error);
    }
})

router.get("/categories/:id", auth, async (req, res) => {
    try {
        const {username, email, role} = req.user
        const role_data = req.user

        const profile_data = await profile.findOne({email : role_data.email})

        const master = await master_shop.find()
        console.log("master" , master);

        const _id = req.params.id;
        console.log(_id);
        const user_id = await categories.findById(_id)

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

        res.render("categories", {
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

router.post("/categories/:id", auth, async (req, res) => {
    try {
        const _id = req.params.id;
        const update_data = await categories.findByIdAndUpdate(_id, req.body);

        req.flash("success", `${users.categories_edit}`)
        res.redirect("/products/categories")
    } catch (error) {
        console.log(error);
    }
})

router.get("/categories/delete/:id", auth, async (req, res) => {
    try {
        const _id = req.params.id;
        const delete_data = await categories.findByIdAndDelete(_id);

        req.flash("success", `categories data delete successfully`)
        res.redirect("/products/categories")
    } catch (error) {
        console.log(error);
    }
})


// ============ brands ============= //

router.get("/brands", auth, async (req, res) => {
    try {
        const {username, email, role} = req.user
        const role_data = req.user
        
        const profile_data = await profile.findOne({email : role_data.email})

        const master = await master_shop.find()
        console.log("master" , master);

        const find_data = await brands.find();
        // console.log(find_data);

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
        
        res.render("brands", {
            success: req.flash('success'),
            errors: req.flash('errors'),
            role : role_data,
            profile : profile_data,
            master_shop : master,
            user: find_data,
            language : lan_data
        })
    } catch (error) {
        console.log(error);
    }
})

router.post("/brands", auth, async (req, res) => {
    try {
        // console.log(req.body.name);
        const { name, products } = req.body;
        const data = new brands({ name,products })

        const brands_name = await brands.findOne({name:name})
        if(brands_name){
            req.flash("errors", `${name} brand is alredy added. please choose another`)
        }else{
            req.flash("success", `${name} brand is add successfully`)
        }

        const userdata = await data.save();
        // console.log(userdata);
        res.redirect("/products/brands")
    } catch (error) {
        console.log(error);
    }
})


router.get("/brands/:id", auth, async (req, res) => {
    try {
        const {username, email, role} = req.user
        const role_data = req.user
        
        const profile_data = await profile.findOne({email : role_data.email})

        const master = await master_shop.find()
        console.log("master" , master);

        const _id = req.params.id;
        console.log(_id);
        const user_id = await brands.findById(_id)

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

        res.render("brands", {
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

router.post("/brands/:id", auth, async (req, res) => {
    try {
        const _id = req.params.id;
        const update_data = await brands.findByIdAndUpdate(_id, req.body);

        req.flash('success', `brand data update successfully`)
        res.redirect("/products/brands")
    } catch (error) {
        console.log(error);
    }
})

router.get("/brands/delete/:id", auth, async (req, res) => {
    try {
        const _id = req.params.id;
        const delete_data = await brands.findByIdAndDelete(_id);

        req.flash("success", `brand data delete successfully`)
        res.redirect("/products/brands")
    } catch (error) {
        console.log(error);
    }
})


// ============ units ============= //


router.get("/units", auth, async (req, res) => {
    try {
        const {username, email, role} = req.user
        const role_data = req.user
        
        const profile_data = await profile.findOne({email : role_data.email})

        const master = await master_shop.find()
        console.log("master" , master);

        const find_data = await units.find();
        // console.log(find_data);

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

        res.render("units", {
            success: req.flash('success'),
            errors: req.flash('errors'),
            role : role_data,
            profile : profile_data,
            master_shop : master,
            user: find_data,
            language : lan_data
        })
    } catch (error) {
        console.log(error);
    }
})

router.post("/units", auth, async (req, res) => {
    try {
        // console.log(req.body.name);
        const { name,products } = req.body;
        const data = new units({ name,products })

        const unit_name = await units.findOne({name:name});
        if(unit_name){
            req.flash('errors', `${name} unit is alredy added. please choose another`)
        }else{
            req.flash('success', `${name} unit is add successfully`)
        }

        const userdata = await data.save();
        // console.log(userdata);
        res.redirect("/products/units")
    } catch (error) {
        console.log(error);
    }
})


router.get("/units/:id", auth, async (req, res) => {
    try {
        const {username, email, role} = req.user
        const role_data = req.user
        
        const profile_data = await profile.findOne({email : role_data.email})

        const master = await master_shop.find()
        console.log("master" , master);

        const _id = req.params.id;
        // console.log(_id);
        const user_id = await units.findById(_id)

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

        res.render("units", {
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

router.post("/units/:id", auth, async (req, res) => {
    try {
        const _id = req.params.id;
        const update_data = await units.findByIdAndUpdate(_id, req.body);

        req.flash('success', `unit data update successfully`)
        res.redirect("/products/units")
    } catch (error) {
        console.log(error);
    }
})

router.get("/units/delete/:id", auth, async (req, res) => {
    try {
        const _id = req.params.id;
        const delete_data = await units.findByIdAndDelete(_id);

        req.flash('success', `unit data delete successfully`)
        res.redirect("/products/units")
    } catch (error) {
        console.log(error);
    }
})



const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, "public/upload")
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + file.originalname)
    }
})

const upload = multer({ storage: storage });


// ======== Products ============ //

router.get("/view", auth, async (req, res) => {
    try {
        const {username, email, role} = req.user
        const role_data = req.user
        
        const profile_data = await profile.findOne({email : role_data.email})

        const master = await master_shop.find()
        console.log("Products master" , master);

        const find_data = await product.find();
        console.log("Products find_data", find_data);


        const warehouse_data = await warehouse.aggregate([
            {
                $unwind: "$product_details"
            },
            {
                $lookup:
                {
                    from: "products",
                    localField: "product_details.product_name",
                    foreignField: "name",
                    as: "product_docs"
                }
            },
            {
                $unwind: "$product_docs"
            },
            {
                $project: 
                {
                    product_name: '$product_details.product_name',
                    product_stock: '$product_details.product_stock',
                }
            },
            {
                $group: {
                    _id: "$product_name",
                    product_stock: { $sum: "$product_stock" }
                }
            },
        ])
        console.log("Products warehouse_data", warehouse_data);


        warehouse_data.forEach(product_details => {

            const match_data = find_data.map((data) => {

                if (data.name == product_details._id) {
                    data.stock = parseInt(data.stock) + parseInt(product_details.product_stock)
                    
                }

            })
        })
        console.log("Products find_data", find_data);

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

        res.render("products", { 
            success: req.flash('success'),
            errors: req.flash('errors'),
            alldata: find_data,
            profile : profile_data,
            master_shop : master,
            role : role_data,
            product_stock : warehouse_data,
            language : lan_data
        })
    } catch (error) {
        console.log(error);
    }
})

// ------------ Add Product ------------ //

router.get("/view/add_products", auth, async (req, res) => {
    try {
        const {username, email, role} = req.user
        const role_data = req.user
        
        const profile_data = await profile.findOne({email : role_data.email})

        const master = await master_shop.find()
        console.log("master" , master);

        const categories_data = await categories.find({});
        const brands_data = await brands.find({});
        const units_data = await units.find({});

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

        // res.render("product_add_product", {
        res.render("add_product", {
            success: req.flash('success'),
            errors: req.flash('errors'),
            role : role_data,
            profile : profile_data,
            categories: categories_data,
            brands: brands_data,
            master_shop : master,
            units: units_data,
            language : lan_data
        })
    } catch (error) {
        console.log(error);
    }
})

router.post("/view/add_products", auth, upload.single("image"), async (req, res) => {
    try {
        const { name, category, brand, sku, unit, alertquantity, stock, product_code} = req.body
        const image = req.file.filename;
        
        const data = new product({ image, name, category, brand, sku, unit, alertquantity, stock, product_code});
        const products_data = await data.save()
        console.log(products_data);

        const categories_data = await categories.findOne({name : category});
        categories_data.products = parseInt(categories_data.products) + 1
        await categories_data.save()

        const brands_data = await brands.findOne({name : brand});
        brands_data.products = parseInt(brands_data.products) + 1
        await brands_data.save()

        const units_data = await units.findOne({name : unit});
        units_data.products = parseInt(units_data.products) + 1
        await units_data.save()


        req.flash('success', `product add successfully`)
        res.redirect("/products/view")
    } catch (error) {
        console.log(error);
    }
})


// ========= edit Product ============ //

router.get("/view/:id", auth, async (req, res) => {
    try {
        const {username, email, role} = req.user
        const role_data = req.user
        
        const profile_data = await profile.findOne({email : role_data.email})

        const master = await master_shop.find()
        console.log("edit Product master" , master);

        const _id = req.params.id
        const user_id = await product.findById(_id)


        const categories_data = await categories.find({});
        const brands_data = await brands.find({});
        const units_data = await units.find({});


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

        res.render("edit_product", {
            success: req.flash('success'),
            errors: req.flash('errors'),
            role : role_data,
            profile : profile_data,
            alldata: user_id,
            categories: categories_data, 
            brands: brands_data, 
            master_shop : master,
            units: units_data,
            language : lan_data 
        })

    } catch (error) {
        console.log(error);
    }
})

router.post("/view/:id", auth, upload.single("image"), async (req, res) => {
    try {
        console.log("hello");
        const _id = req.params.id;
        const data = await product.findById(_id)

        const { image, name, category, brand, sku, unit, alertquantity, product_code } = req.body

        if (req.file) {
            data.image = req.file.filename
        }
        data.name = name
        data.category = category
        data.brand = brand
        data.sku = sku
        data.unit = unit
        data.alertquantity = alertquantity
        data.product_code = product_code

        const new_data = await data.save();
        console.log("product edit", data);
        
        req.flash('success', `product update successfully`)
        res.redirect("/products/view")
    } catch (error) {
        console.log(error);
    }
})


router.get("/barcode/:id", auth, async (req, res) => {
    try {
        const {username, email, role} = req.user
        const role_data = req.user
        
        const profile_data = await profile.findOne({email : role_data.email})

        const master = await master_shop.find()
        console.log("barcode Product master" , master);

        const _id = req.params.id
        const user_id = await product.findById(_id)
        console.log("barcode user_id", user_id);

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
        
        res.render("product_barcode", {
            success: req.flash('success'),
            errors: req.flash('errors'),
            role : role_data,
            profile : profile_data,
            alldata: user_id,
            master_shop : master,
            language : lan_data
        })

    } catch (error) {
        console.log(error);
    }
})


module.exports = router;
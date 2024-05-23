const mongoose = require('mongoose');


// ========= sing_up ========= //

const sing_up_data = new mongoose.Schema({
    name: {
        type: String,
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    },
    mobile: {
        type: Number,
    },
    role: {
        type: String,
        require: true
    }
})

const sing_up = new mongoose.model("sing_up", sing_up_data);


// ======== profile ======== //

const profile_data = new mongoose.Schema({
    firstname: {
        type: String,
    },
    lastname: {
        type: String,
    },
    email: {
        type: String,
    },
    image: {
        type: String
    }
})

const profile = new mongoose.model("profile", profile_data);


// ======== categories ========== //

const categories_data = new mongoose.Schema({
    name: {
        type: String,
    },
    products: {
        type: Number,
    }
})

const categories = new mongoose.model("categories", categories_data);

// ========= brands =========== //

const brands_data = new mongoose.Schema({
    name: {
        type: String,
    },
    products: {
        type: Number,
    }
})

const brands = new mongoose.model("brands", brands_data);



// ========= units =========== //

const units_data = new mongoose.Schema({
    name: {
        type: String,
    },
    products: {
        type: Number,
    }
})

const units = new mongoose.model("units", units_data);


// ========= products =========== //

const product_data = new mongoose.Schema({
    image: {
        type: String,
        required: true
    },
    name: {
        type: String,
        required: true,
        unique : true
    },
    category: {
        type: String,
        required: true
    },
    brand: {
        type: String,
        required: true
    },
    sku: {
        type: String,
        required: true
    },
    unit: {
        type: String,
        required: true
    },
    stock: {
        type: Number
    },
    alertquantity: {
        type: Number
    },
    product_code: {
        type: String,
        unique: true
    }
})

const product = new mongoose.model("product", product_data);


// ========= warehouse =========== //

const warehouse_data = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    address: {
        type: String,
        required: true
    },
    status: {
        type: String,
        default: "Enabled"
    },
    product_details: [
        {
            product_name: {
                type: String,
                default: "no product"
            },
            product_stock: {
                type: Number,
                default: 0
            },
        }
    ]
})

const warehouse = new mongoose.model("warehouse", warehouse_data);


// ========= staff =========== //

const staff_data = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    mobile: {
        type: Number,
        required: true
    },
    status: {
        type: String,
        default: "Enabled"
    }
})

const staff = new mongoose.model("staff", staff_data);


// ========= customer =========== //

const customer_data = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    address: {
        type: String,
        required: true
    },
    mobile: {
        type: Number,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    receivable: {
        type: Number,
    },
    payable: {
        type: Number,
    }
})

const customer = new mongoose.model("customer", customer_data);


// ========= c_payment_data =========== //

const c_payment = new mongoose.Schema({
    invoice: {
        type: Number,
    },
    date: {
        type: String,
    },
    customer: {
        type: String,
    },
    reason: {
        type: String,
    },
    amount: {
        type: Number,
    }
})

const c_payment_data = new mongoose.model("c_payment", c_payment);


// ========= c_payment_data end =========== //



// ========= customer payment =========== //

const customer_payment_data = new mongoose.Schema({
    invoice: {
        type: Number,
    },
    date: {
        type: String,
    },
    customer: {
        type: String,
    },
    reason: {
        type: String,
    },
    amount: {
        type: Number,
    }
})

const customer_payment = new mongoose.model("customer_payment", customer_payment_data);



// ========= suppliers =========== //

const suppliers_data = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    mobile: {
        type: Number,
        required: true
    },
    company: {
        type: String,
    },
    address: {
        type: String,
    },
    receivable: {
        type: Number,
    },
    payable: {
        type: Number,
    }
})

const suppliers = new mongoose.model("suppliers", suppliers_data);

// ========= suppliers end =========== //


// ========= s_payment_data =========== //

const s_payment = new mongoose.Schema({
    invoice: {
        type: Number,
    },
    date: {
        type: String,
    },
    suppliers: {
        type: String,
    },
    reason: {
        type: String,
    },
    amount: {
        type: Number,
    }
})

const s_payment_data = new mongoose.model("s_payment", s_payment);


// ========= s_payment_data end =========== //



// ========= suppliers payment =========== //

const suppliers_payment_data = new mongoose.Schema({
    invoice: {
        type: Number,
    },
    date: {
        type: String,
    },
    suppliers: {
        type: String,
    },
    reason: {
        type: String,
    },
    amount: {
        type: Number,
    }
})

const suppliers_payment = new mongoose.model("suppliers_payment", suppliers_payment_data);

// ========= suppliers payment end =========== //



// ========= purchases =========== //

const purchases_data = new mongoose.Schema({
    invoice: {
        type: String,
    },
    suppliers: {
        type: String,
    },
    date: {
        type: String,
    },
    warehouse_name: {
        type: String,
    },
    product:[{
        product_name: {
            type: String
        },
        quantity: {
            type: Number
        },
        price: {
            type: Number
        },
        total: {
            type: Number
        },
    }],
    note: {
        type: String
    },
    total_amount: {
        type: Number,
    },
    discount: {
        type: Number,
    },
    payable: {
        type: Number,
    },
    paid_amount: {
        type: Number,
        default: 0
    },
    due_amount: {
        type: Number,
    },
    return_data: {
        type: String,
        default: "False"
    }
})

const purchases = new mongoose.model("purchases", purchases_data);


// ========= return purchases =========== //

const purchases_return_data = new mongoose.Schema({
    invoice: {
        type: String,
    },
    suppliers: {
        type: String,
    },
    date: {
        type: String,
    },
    warehouse_name: {
        type: String,
    },
    return_product:[{
        product_name: {
            type: String
        },
        purchase_quantity: {
            type: Number
        },
        return_qty: {
            type: Number
        },
        price: {
            type: Number
        },
        total: {
            type: Number
        }
    }],
    note: {
        type: String
    },
    total_amount: {
        type: Number,
    },
    discount: {
        type: Number,
    },
    receivable: {
        type: Number,
    },
    received: {
        type: Number,
        default: 0
    },
    due_amount: {
        type: Number,
        default: 0
    }
})

const purchases_return = new mongoose.model("return_purchases", purchases_return_data);

// ============== return purchases end =============== //


// ============ sales =============== //

const sales_data = new mongoose.Schema({
    invoice: {
        type: String,
    },
    customer: {
        type: String,
    },
    date: {
        type: String,
    },
    warehouse_name: {
        type: String,
    },
    sale_product:[{
        product_name: {
            type: String
        },
        quantity: {
            type: Number
        },
        price: {
            type: Number
        },
        total: {
            type: Number
        },
    }],
    note: {
        type: String
    },
    total_price: {
        type: Number,
    },
    discount: {
        type: Number,
    },
    receivable_amount: {
        type: Number,
    },
    received_amount: {
        type: Number,
    },
    due_amount: {
        type: Number,
    },
    return_data: {
        type: String,
        default: "False"
    },
})

const sales = new mongoose.model("sales", sales_data);

// ============ sales end =============== //


// ========= return sales =========== //

const sales_return_data = new mongoose.Schema({
    invoice: {
        type: String,
    },
    customer: {
        type: String,
    },
    date: {
        type: String,
    },
    warehouse_name: {
        type: String,
    },
    return_sale:[{
        product_name: {
            type: String
        },
        sale_qty: {
            type: Number
        },
        return_qty: {
            type: Number
        },
        price: {
            type: Number
        },
        total: {
            type: Number
        },
    }],
    note: {
        type: String
    },
    total_amount: {
        type: Number,
    },
    discount: {
        type: Number,
    },
    payable_to_customer: {
        type: Number,
    },
    paid_amount: {
        type: Number,
        default: 0
    },
    due_amount: {
        type: Number,
        default: 0
    }
})

const sales_return = new mongoose.model("return_sales", sales_return_data);

// ============== return sales end =============== //


// ========= All Transfers =========== //

const transfers_data = new mongoose.Schema({
    date: {
        type: String,
    },
    from_warehouse: {
        type: String,
    },
    to_warehouse: {
        type: String
    },
    product:[{
        product_name: {
            type: String
        },
        quantity: {
            type: Number
        },
    }],
    note: {
        type: String
    }
})

const transfers = new mongoose.model("transfer", transfers_data);

// ========= All Transfers end =========== //


// ========= Expenses Type =========== //

const expenses = new mongoose.Schema({
    name: {
        type: String,
    }
})

const expenses_type = new mongoose.model("expenses_type", expenses);

// ========= Expenses Type end =========== //


// ========= Expenses =========== //

const expenses_data = new mongoose.Schema({
    type: {
        type: String,
    },
    date: {
        type: String,
    },
    amount: {
        type: Number,
    },
    note: {
        type: String,
    },
})

const all_expenses = new mongoose.model("expenses", expenses_data);

// ========= Expenses end =========== //


// ========= Adjustment =========== //

const adjustment_data = new mongoose.Schema({
    warehouse_name: {
        type: String,
    },
    date: {
        type: String,
    },
    product:[{
        product_name: {
            type: String,
        },
        adjust_qty: {
            type: Number,
        },
        type: {
            type: String,
        },
    }],
    note: {
        type: String,
    },
})

const adjustment = new mongoose.model("adjustment", adjustment_data);


// ========= Adjustment end =========== //


// ========= master_settings =========== //

const master_settings_data = new mongoose.Schema({
    site_title: {
        type: String,
    },
    image: {
        type: String,
    },
    currency: {
        type: String,
        default: "$"
    },
    currency_placement: {
        type: String,
        default: 2
    },
    timezone: {
        type: String,
    },
    language: {
        type: String,
        default: "English"
    },
})

const master_shop = new mongoose.model("master_shop", master_settings_data);

// ========= master_settings end =========== //



// ========= email_settings =========== //

const email_settings_data = new mongoose.Schema({
    host: {
        type: String,
    },
    port: {
        type: String,
    },
    email: {
        type: String,
    },
    password: {
        type: String,
    },
})

const email_settings = new mongoose.model("email_settings", email_settings_data);

// ========= email_settings end =========== //



module.exports = { sing_up, profile, categories, brands, units, product, warehouse, staff, customer,
                    suppliers, suppliers_payment, s_payment_data, purchases, purchases_return, sales, sales_return,
                    customer_payment, c_payment_data, transfers, expenses_type, all_expenses, adjustment, master_shop, email_settings};
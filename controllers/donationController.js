const Order = require('../models/Order');
const Charity = require('../models/Charity');
const User = require('../models/User');
const Project = require('../models/Project'); 


// const paymentService = require('../services/paymentService'); // Abstracted payment logic
const Razorpay = require('razorpay');
require('dotenv').config();


const Sib = require('sib-api-v3-sdk');

const client = Sib.ApiClient.instance;
const apiKey = client.authentications['api-key'];
apiKey.apiKey = process.env.API_KEY;

exports.updateTransactionStatus = async (req, res) => {
    try {
        console.log("update transcation called");
        console.log(apiKey.apiKey);
        const { order_id, payment_id } = req.body;  // Extract order & payment ID from request body
        const { projectid, charityid, amount} = req.params;  // Extract project ID, charity ID, amount, and user ID
        const userid=req.user.id;
        if (!amount || isNaN(amount)) {
            return res.status(400).json({ success: false, message: "Invalid amount" });
        }

        // Find the order by order_id and charityid
        const order = await Order.findOne({ where: { orderid: order_id, charity_id: charityid } });

        if (!order) {
            return res.status(404).json({ success: false, message: "Order not found" });
        }

        // Update the order with payment details and status
        await order.update({ paymentid: payment_id || null, status: "SUCCESSFUL", amount });

        // Find the project and update the current amount
        const project = await Project.findByPk(projectid);
        if (!project) {
            return res.status(404).json({ success: false, message: "Project not found" });
        }

        // Increment the current amount in the project
        const updatedAmount = project.current + parseInt(amount);
        await project.update({ current: updatedAmount });

        // Find the user and charity details
        const user = await User.findByPk(userid);
        const charity = await Charity.findByPk(charityid);
        console.log(user);
        // console.log(charity);

        if (!user || !charity) {
            return res.status(404).json({ success: false, message: "User or Charity not found" });
        }

        // Send email notifications
        await sendDonationEmail(user.email, user.name, amount, charity.name, project.title);
        await sendCharityEmail(charity.email, charity.name, user.name, amount, project.title);

        return res.status(202).json({ success: true, message: "Transaction successful & email sent" });
    } catch (err) {
        console.error('Error updating transaction status:', err);
        res.status(500).json({ success: false, message: "Internal Server Error" });
    }
};

// ✅ Send email to user (donor)
async function sendDonationEmail(userEmail, userName, amount, charityName, projectTitle) {
    try {
        const tranEmailApi = new Sib.TransactionalEmailsApi();
        const sender = {  email: 'vsbrall143@gmail.com', name: 'Charitify' };

        const emailResponse = await tranEmailApi.sendTransacEmail({
            sender,
            to: [{ email: userEmail }],
            subject: "Thank You for Your Donation!",
            textContent: `Dear ${userName},\n\nThank you for your generous donation of ₹${amount} to ${charityName} for the project "${projectTitle}".\n\nYour support is making a difference!\n\nBest Regards,\nCharitify Team`,
            html: `<p>Dear ${userName},</p>
                   <p>Thank you for your generous donation of <strong>₹${amount}</strong> to <strong>${charityName}</strong> for the project "<strong>${projectTitle}</strong>".</p>
                   <p>Your support is making a difference!</p>
                   <p>Best Regards,<br>Charitify Team</p>`
        });

        console.log("Donation confirmation email sent:", emailResponse);
    } catch (error) {
        console.error("Error sending donation email:", error);
    }
}

// ✅ Send email to charity (organization)
async function sendCharityEmail(charityEmail, charityName, donorName, amount, projectTitle) {
    try {
        const tranEmailApi = new Sib.TransactionalEmailsApi();
        const sender = { email: 'vsbrall143@gmail.com', name: 'Charitify' };

        const emailResponse = await tranEmailApi.sendTransacEmail({
            sender,
            to: [{ email: charityEmail }],
            subject: "New Donation Received!",
            textContent: `Dear ${charityName},\n\nYou have received a donation of ₹${amount} from ${donorName} for your project "${projectTitle}".\n\nThank you for your great work!\n\nBest Regards,\nCharitify Team`,
            html: `<p>Dear ${charityName},</p>
                   <p>You have received a donation of <strong>₹${amount}</strong> from <strong>${donorName}</strong> for your project "<strong>${projectTitle}</strong>".</p>
                   <p>Thank you for your great work!</p>
                   <p>Best Regards,<br>Charitify Team</p>`
        });

        console.log("Charity donation notification email sent:", emailResponse);
    } catch (error) {
        console.error("Error sending charity email:", error);
    }
}













exports.donation = async (req, res) => {
    console.log("req.user:", req.user);
    
    try {
        const rzp = new Razorpay({
            key_id: process.env.RAZORPAY_KEY_ID,
            key_secret: process.env.RAZORPAY_KEY_SECRET
        });

        const { amount } = req.params;  // Extract project ID, charity ID, and amount
        const charity_id = req.params.charityid; // Fetch charity_id from request params

        if (!charity_id) {
            return res.status(400).json({ error: 'Charity ID is required' });
        }

        // Verify that the charity exists
        const charity = await Charity.findByPk(charity_id);
        if (!charity) {
            return res.status(404).json({ error: 'Charity not found' });
        }

        rzp.orders.create({ amount, currency: "INR" }, async (err, order) => {
            if (err) {
                return res.status(500).json({ error: 'Error creating order with Razorpay' });
            }

            try {
                // Fetch user instance from database
                const user = await User.findByPk(req.user.id);

                if (!user) {
                    return res.status(404).json({ error: 'User not found' });
                }

                // Create order using Sequelize
                const newOrder = await Order.create({
                    orderid: order.id,
                    status: 'PENDING',
                    user_id: user.id,
                    charity_id: charity.id, // Ensure charity_id is stored
                });

                return res.status(201).json({ order, key_id: rzp.key_id });
            } catch (error) {
                console.error("Error saving order to database:", error);
                return res.status(500).json({ error: 'Failed to save order in the database' });
            }
        });
    } catch (error) {
        console.error("Error in donation:", error);
        return res.status(500).json({ error: 'Something went wronggg' });
    }
};



// exports.updateTransactionStatus = async (req, res) => {
//     try {
//         const { order_id, payment_id } = req.body;  // Extract order & payment ID from request body
//         const { projectid, charityid, amount } = req.params;  // Extract project ID, charity ID, and amount

//         if (!amount || isNaN(amount)) {
//             return res.status(400).json({ success: false, message: "Invalid amount" });
//         }

//         // Find the order by order_id and charityid
//         const order = await Order.findOne({ 
//             where: { orderid: order_id, charity_id: charityid } 
//         });

//         if (!order) {
//             return res.status(404).json({ success: false, message: "Order not found" });
//         }

//         // Update the order with payment details and status
//         await order.update({ paymentid: payment_id || null, status: "SUCCESSFUL",amount });

//         // Find the project and update the current amount
//         const project = await Project.findByPk(projectid);
//         if (!project) {
//             return res.status(404).json({ success: false, message: "Project not found" });
//         }

//         // Increment the current amount in the project
//         const updatedAmount = project.current + parseInt(amount);
//         await project.update({ current: updatedAmount });

//         return res.status(202).json({ success: true, message: "Transaction successful" });
//     } catch (err) {
//         console.error('Error updating transaction status:', err);
//         res.status(500).json({ success: false, message: "Internal Server Error" });
//     }
// };

 exports.charityHistory = async (req, res) => { 
    try {
        const user_id = req.user.id;

        const orders = await Order.findAll({
            where: { user_id },
            include: [
                { model: Charity, as: 'orderCharity', attributes: ['name'] } // Use correct alias
            ],
            order: [['createdAt', 'DESC']]
        });

        console.log(orders);

        const formattedOrders = orders.map(order => ({
            charityName: order.orderCharity?.name || "Unknown Charity", // Safe check
            date: order.createdAt,
            amount: order.amount,
            status: order.status
        }));

        res.json(formattedOrders);
    } catch (error) {
        console.error("Error fetching donation history:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
};



exports.allcharityHistory = async (req, res) => { 
    try {
        const user_id = req.user.id;

        const orders = await Order.findAll({
            include: [
                { model: Charity, as: 'orderCharity', attributes: ['name'] } // Use correct alias
            ],
            order: [['createdAt', 'DESC']]
        });

        console.log(orders);

        const formattedOrders = orders.map(order => ({
            charityName: order.orderCharity?.name || "Unknown Charity", // Safe check
            date: order.createdAt,
            amount: order.amount,
            status: order.status
        }));

        res.json(formattedOrders);
    } catch (error) {
        console.error("Error fetching donation history:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
};


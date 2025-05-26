const jwt = require("jsonwebtoken");
const User = require("../Model/User");
const Menu = require("../Model/menu");
const Order = require("../Model/order");

exports.loginEmployee = async (req, res) => {
  try {
    console.log("POST /login hit with", req.body);
    const { employeeId } = req.body;

    if (!employeeId) {
      return res
        .status(400)
        .json({ success: false, message: "Employee ID is required" });
    }

    const user = await User.findOne({ employeeId });

    if (!user) {
      return res
        .status(404)
        .json({ success: false, message: "Employee not found" });
    }

    const token = jwt.sign(
      { id: user._id, role: user.role, name: user.name },
      process.env.JWT_SECRET,
      { expiresIn: "1d" }
    );

    res.json({ token, role: user.role, name: user.name });
  } catch (error) {
    console.error("Login error:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};


//---------------------- only employee login ----------------------

// exports.loginEmployee = async (req, res) => {

//   console.log("POST /login hit with", req.body);
//   const { employeeId } = req.body;

//   if (!employeeId) {
//     return res
//       .status(400)
//       .json({ success: false, message: "Employee ID is required" });
//   }
//   try {
//     const user = await User.findOne({ employeeId });
//     if (!user) {
//       return res
//         .status(401)
//         .json({ success: false, message: "Invalid Employee ID" });
//     }
//     return res
//       .status(200)
//       .json({ success: true, message: "Login successful", name: user.name });
//   } catch (error) {
//     console.error("Login error:", error);
//     res.status(500).json({ success: false, message: "Server error" });
//   }
// };

exports.orderDetails = async (req, res) => {
  try {
    const { employeeId, totalAmount, paymentMode, menuItems } = req.body;

    if (!employeeId || !totalAmount || !paymentMode || !menuItems || !menuItems.length) {
      return res.status(400).json({ error: "Missing required fields or empty menuItems" });
    }

    // Fetch user by employeeId
    const user = await User.findOne({ employeeId });
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    // Create the order with menuItems as strings
    const order = new Order({
      menuItems,    // e.g. ["Tea", "Chips"]
      employeeId,
      name: user.name,
      totalAmount,
      paymentMode,
    });

    await order.save();

    res.status(201).json({ message: "Order placed successfully", order });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message || "Internal Server Error" });
  }
};


// exports.getEmployee = async (req, res) => {
//   const employee = await User.findOne({ employeeId: req.params.id });
//   if (!employee) return res.status(404).json({ error: 'Employee not found' });
//   res.json(employee);
// };

exports.getMenu = async (req, res) => {
  try {
    const items = await Menu.find(); // All items
    console.log("Items fetched from DB:", items); // ✅ Add this
    const categorized = {};

    items.forEach((item) => {
      if (!categorized[item.category]) {
        categorized[item.category] = [];
      }
      categorized[item.category].push(item);
    });

    res.json(categorized);
  } catch (error) {
    console.error("Error in getMenu:", error); // ✅ Log error
    res.status(500).json({ error: "Failed to fetch menu data" });
  }
};

exports.getAllOrders = async (req, res) => {
  try {
    const orders = await Order.find()
      .sort({ createdAt: -1 })
      .populate('menuItems') // ✅ Add this line
      .populate('employeeId');

    res.json({ success: true, data: orders });
  } catch (err) {
    console.error("Error fetching orders:", err);
    res.status(500).json({ success: false, message: "Server error" });
  }
};


// exports.getAllOrders = async (req, res) => {
//   try {
//     const orders = await Order.find().sort({ createdAt: -1 });
//     res.json({ success: true, data: orders });
//   } catch (err) {
//     console.error("Error fetching orders:", err);
//     res.status(500).json({ success: false, message: "Server error" });
//   }
// };

exports.getOrders = async (req, res) => {
  const { employeeId, cart, paymentMode } = req.body;

  const employee = await User.findOne({ employeeId });
  if (!employee) return res.status(404).json({ error: "Employee not found" });

  const total = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);

  if (paymentMode === "Wallet") {
    if (employee.walletBalance < total)
      return res.status(400).json({ error: "Insufficient balance" });
    employee.walletBalance -= total;
    await employee.save();
  } else if (paymentMode === "Payroll") {
    if (!employee.eligibleForPayroll)
      return res
        .status(403)
        .json({ error: "Not eligible for payroll deduction" });
    // Handle payroll deduction logic here
  }

  const order = await Order.create({
    employeeId,
    items: cart,
    paymentMode,
    totalAmount: total,
  });

  const estimatedTime = new Date(Date.now() + 10 * 60000); // 10 min
  const formattedTime = estimatedTime.toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit",
  });

  res.json({
    success: true,
    orderId: order._id,
    estimatedReadyTime: formattedTime,
  });
};

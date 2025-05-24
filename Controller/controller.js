const User = require("../Model/User");
const Menu = require("../Model/menu");
const Order = require("../Model/order");

exports.loginEmployee = async (req, res) => {
  console.log("POST /login hit with", req.body); // Add this line
  const { employeeId } = req.body;

  if (!employeeId) {
    return res
      .status(400)
      .json({ success: false, message: "Employee ID is required" });
  }
  try {
    const user = await User.findOne({ employeeId });
    if (!user) {
      return res
        .status(401)
        .json({ success: false, message: "Invalid Employee ID" });
    }
    return res
      .status(200)
      .json({ success: true, message: "Login successful", name: user.name });
  } catch (error) {
    console.error("Login error:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

exports.orderDetails = async (req, res) => {
  console.log("Incoming Order:", req.body);
  const { employeeId, totalAmount, paymentMode } = req.body;

  if (!employeeId || !totalAmount || !paymentMode) {
    return res.status(400).json({ error: "Missing required fields" });
  }

  // Fetch user from DB
  const user = await User.findOne({ employeeId }); // adjust based on your schema

  if (!user) {
    return res.status(404).json({ error: "User not found" });
  }

  const order = new Order({
    employeeId,
    name: user.name,
    totalAmount,
    paymentMode,

    timestamp: new Date(),
  });

  await order.save();

  res.status(201).json({ message: "Order placed successfully", order });
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

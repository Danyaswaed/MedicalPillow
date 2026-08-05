const generateInvoice = (order) => ({
  orderId: order._id,
  total: order.total,
  status: order.status,
  items: order.items || [],
});

module.exports = { generateInvoice };

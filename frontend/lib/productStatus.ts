export function getStockStatus(product: any) {
  if (!product.track_stock) {
    return {
      label: "Unlimited",
      color: "bg-gray-100 text-gray-700",
    }
  }

  if (product.stock_quantity <= 0) {
    return {
      label: "Out of stock",
      color: "bg-red-100 text-red-700",
    }
  }

  if (product.stock_quantity <= product.stock_alert_threshold) {
    return {
      label: "Low stock",
      color: "bg-yellow-100 text-yellow-700",
    }
  }

  return {
    label: "In stock",
    color: "bg-green-100 text-green-700",
  }
}

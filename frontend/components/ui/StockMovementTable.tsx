"use client"

interface StockMovementTableProps {
  data: {
    id: number
    date: string
    product: string
    sku: string
    movementType: string
    quantity: number
    reference: string
    user: string
  }[]
}

export function StockMovementTable({ data }: StockMovementTableProps) {
  return (
    <div className="overflow-x-auto">
      <table className="w-full">
        <thead className="bg-gray-50">
          <tr>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Date
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Product
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              SKU
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Movement Type
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Quantity
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Reference
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              User
            </th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {data.map((row) => (
            <tr key={row.id} className="hover:bg-gray-50 cursor-pointer">
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                {row.date}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                {row.product}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                {row.sku}
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <span
                  className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                    row.movementType === "Stock In"
                      ? "bg-green-100 text-green-800"
                      : row.movementType === "Stock Out"
                        ? "bg-red-100 text-red-800"
                        : row.movementType === "Adjustment"
                          ? "bg-yellow-100 text-yellow-800"
                          : row.movementType === "Sales deduction"
                            ? "bg-blue-100 text-blue-800"
                            : "bg-purple-100 text-purple-800"
                  }`}
                >
                  {row.movementType}
                </span>
              </td>
              <td
                className={`px-6 py-4 whitespace-nowrap text-sm font-medium ${
                  row.quantity > 0 ? "text-green-600" : "text-red-600"
                }`}
              >
                {row.quantity > 0 ? "+" : ""}
                {row.quantity}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                {row.reference}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                {row.user}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

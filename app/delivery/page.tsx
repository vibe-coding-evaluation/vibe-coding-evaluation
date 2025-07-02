import { DeliveryMatrix } from "@/components/delivery-matrix"

export default function DeliveryPage() {
  return (
    <div className="min-h-screen bg-gray-50 p-4">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-xl font-bold mb-4">Software Delivery Matrix</h1>
        <DeliveryMatrix />
      </div>
    </div>
  )
}

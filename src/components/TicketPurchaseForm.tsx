// File: src/components/TicketPurchaseForm.tsx

import React, { useState } from 'react';
import { Event } from '@prisma/client';

interface TicketPurchaseFormProps {
  event: Event;
}

const TicketPurchaseForm: React.FC<TicketPurchaseFormProps> = ({ event }) => {
  const [selectedZone, setSelectedZone] = useState('');
  const [quantity, setQuantity] = useState(1);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    // Implement ticket purchase logic here
    console.log('Purchase ticket:', { eventId: event.id, zone: selectedZone, quantity });
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white shadow-md rounded-lg p-6">
      <h2 className="text-2xl font-semibold mb-4">Purchase Tickets</h2>
      <div className="mb-4">
        <label htmlFor="zone" className="block text-gray-700 font-bold mb-2">
          Select Zone
        </label>
        <select
          id="zone"
          value={selectedZone}
          onChange={(e) => setSelectedZone(e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
          required
        >
          <option value="">Select a zone</option>
          {Object.entries(event.ticketPrices as Record<string, number>).map(([zone, price]) => (
            <option key={zone} value={zone}>
              {zone} - ${price}
            </option>
          ))}
        </select>
      </div>
      <div className="mb-4">
        <label htmlFor="quantity" className="block text-gray-700 font-bold mb-2">
          Quantity
        </label>
        <input
          type="number"
          id="quantity"
          value={quantity}
          onChange={(e) => setQuantity(parseInt(e.target.value))}
          min="1"
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
          required
        />
      </div>
      <button type="submit" className="btn-primary w-full">
        Purchase Tickets
      </button>
    </form>
  );
};

export default TicketPurchaseForm;
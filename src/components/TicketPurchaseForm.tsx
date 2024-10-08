// src/components/TicketPurchaseForm.tsx

import React, { useState } from 'react';
import { useSession } from 'next-auth/react';
import { Event } from '@/types';
import { purchaseTickets } from '@/lib/api';

interface TicketPurchaseFormProps {
  event: Event;
}

const TicketPurchaseForm: React.FC<TicketPurchaseFormProps> = ({ event }) => {
  const { data: session } = useSession();
  const [selectedZone, setSelectedZone] = useState('');
  const [quantity, setQuantity] = useState(1);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (!session) {
      setError('You must be logged in to purchase tickets');
      return;
    }

    try {
      await purchaseTickets(event.id, selectedZone, quantity);
      setSuccess(`Successfully purchased ${quantity} ticket(s) for ${event.name}`);
    } catch (error) {
      setError('Failed to purchase tickets. Please try again.');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="mt-6">
      <h2 className="text-xl font-semibold mb-4">Purchase Tickets</h2>
      {error && <p className="text-error-500 mb-4">{error}</p>}
      {success && <p className="text-success-500 mb-4">{success}</p>}
      <div className="mb-4">
        <label htmlFor="zone" className="block text-sm font-medium text-gray-700">Select Zone</label>
        <select
          id="zone"
          value={selectedZone}
          onChange={(e) => setSelectedZone(e.target.value)}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-300 focus:ring focus:ring-primary-200"
          required
        >
          <option value="">Select a zone</option>
          {Object.entries(event.ticketPrices).map(([zone, price]) => (
            <option key={zone} value={zone}>
              {zone} - ${price}
            </option>
          ))}
        </select>
      </div>
      <div className="mb-4">
        <label htmlFor="quantity" className="block text-sm font-medium text-gray-700">Quantity</label>
        <input
          type="number"
          id="quantity"
          value={quantity}
          onChange={(e) => setQuantity(parseInt(e.target.value))}
          min="1"
          max="20"
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-300 focus:ring focus:ring-primary-200"
          required
        />
      </div>
      <button
        type="submit"
        className="bg-primary-500 hover:bg-primary-600 text-white font-bold py-2 px-4 rounded"
      >
        Purchase Tickets
      </button>
    </form>
  );
};

export default TicketPurchaseForm;
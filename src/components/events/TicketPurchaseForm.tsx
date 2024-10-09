import React, { useState } from 'react';
import { useSession } from 'next-auth/react';
import { Event } from '@/types';
import { purchaseTickets } from '@/lib/api';
import Form from '@/components/common/Form';
import Button from '@/components/common/Button';
import Card from '@/components/common/Card';

interface TicketPurchaseFormProps {
  event: Event;
}

const TicketPurchaseForm: React.FC<TicketPurchaseFormProps> = ({ event }) => {
  const { data: session } = useSession();
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const ticketOptions = Object.entries(event.ticketPrices).map(([zone, price]) => ({
    value: zone,
    label: `${zone} - $${price}`
  }));

  const fields = [
    {
      name: 'zone',
      label: 'Select Zone',
      type: 'select',
      options: ticketOptions,
    },
    {
      name: 'quantity',
      label: 'Quantity',
      type: 'number',
      min: 1,
      max: 20,
    },
  ];

  const handleSubmit = async (data: Record<string, any>) => {
    setError('');
    setSuccess('');

    if (!session) {
      setError('You must be logged in to purchase tickets');
      return;
    }

    try {
      await purchaseTickets(event.id, data.zone, parseInt(data.quantity));
      setSuccess(`Successfully purchased ${data.quantity} ticket(s) for ${event.name}`);
    } catch (error) {
      setError('Failed to purchase tickets. Please try again.');
    }
  };

  return (
    <Card className="mt-6">
      <h2 className="text-xl font-semibold mb-4">Purchase Tickets</h2>
      {error && <p className="text-error-500 mb-4">{error}</p>}
      {success && <p className="text-success-500 mb-4">{success}</p>}
      <Form
        fields={fields}
        onSubmit={handleSubmit}
        submitLabel="Purchase Tickets"
      />
    </Card>
  );
};

export default TicketPurchaseForm;
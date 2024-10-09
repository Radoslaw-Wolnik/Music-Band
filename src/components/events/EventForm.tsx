import React from 'react';
import { useRouter } from 'next/navigation';
import Form from '@/components/common/Form';
import { createEvent } from '@/lib/api';

const EventForm: React.FC = () => {
  const router = useRouter();

  const fields = [
    { name: 'name', label: 'Event Name', type: 'text', placeholder: 'Enter event name' },
    { name: 'description', label: 'Description', type: 'textarea', placeholder: 'Enter event description' },
    { name: 'date', label: 'Date', type: 'datetime-local' },
    { name: 'venueId', label: 'Venue', type: 'select', options: [
      { value: '1', label: 'Venue 1' },
      { value: '2', label: 'Venue 2' },
      // Add more venues as needed
    ]},
    { name: 'ticketPrice', label: 'Ticket Price', type: 'number', placeholder: 'Enter ticket price' },
  ];

  const handleSubmit = async (data: Record<string, any>) => {
    try {
      await createEvent(data);
      router.push('/events');
    } catch (error) {
      console.error('Error creating event:', error);
      // Handle error (e.g., show error message to user)
    }
  };

  return (
    <div>
      <h2 className="text-2xl font-bold mb-4">Create New Event</h2>
      <Form fields={fields} onSubmit={handleSubmit} submitLabel="Create Event" />
    </div>
  );
};

export default EventForm;
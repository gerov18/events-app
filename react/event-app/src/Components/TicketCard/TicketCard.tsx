import React, { useState } from 'react';
import moment from 'moment';
import { QRCodeSVG } from 'qrcode.react';
import { Modal } from '../Modal/Modal';
import { Reservation, Ticket } from '../../types/Reservation';

interface TicketCardProps {
  ticket: Ticket;
  eventTitle: string;
  eventDate: string;
  eventLocation: string;
}

const TicketCard: React.FC<TicketCardProps> = ({
  ticket,
  eventTitle,
  eventDate,
  eventLocation,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  console.log('ticket.status', ticket.status);
  return (
    <>
      <div
        onClick={() => setIsOpen(true)}
        className='cursor-pointer bg-white border border-gray-200 rounded-2xl shadow hover:shadow-md transition-shadow duration-200 p-5 flex flex-col items-center text-center'>
        <h4 className='text-lg font-semibold text-gray-800 mb-2'>
          Ticket #{ticket.id}
        </h4>
        <span
          className={`px-2 py-1 text-sm rounded-full ${
            ticket.status === 'CONFIRMED'
              ? 'bg-green-100 text-green-800'
              : ticket.status === 'PENDING'
              ? 'bg-yellow-100 text-yellow-800'
              : 'bg-red-100 text-red-800'
          }`}>
          {ticket.status}
        </span>
      </div>

      <Modal
        isOpen={isOpen}
        title={`Ticket #${ticket.id}`}
        onClose={() => setIsOpen(false)}
        cancelText='Close'>
        <div className='space-y-4'>
          <p>
            <strong>Event:</strong> {eventTitle}
          </p>
          <p>
            <strong>Date:</strong> {moment(eventDate).format('DD.MM.YYYY')}
          </p>
          <p>
            <strong>Location:</strong> {eventLocation}
          </p>
          <p>
            <strong>Status:</strong>{' '}
            <span
              className={`px-2 py-1 inline-block rounded-full ${
                ticket.status === 'CONFIRMED'
                  ? 'bg-green-100 text-green-800'
                  : ticket.status === 'PENDING'
                  ? 'bg-yellow-100 text-yellow-800'
                  : 'bg-red-100 text-red-800'
              }`}>
              {ticket.status}
            </span>
          </p>
          <div className='flex justify-center'>
            {ticket.qrCode ? (
              <img
                src={ticket.qrCode}
                alt={`Ticket ${ticket.id} QR`}
                width={128}
                height={128}
                style={{ objectFit: 'contain' }}
              />
            ) : (
              <div className='w-40 h-40 bg-gray-100 flex items-center justify-center rounded-lg'>
                <span className='text-gray-500'>No QR Code</span>
              </div>
            )}
          </div>
        </div>
      </Modal>
    </>
  );
};

export default TicketCard;

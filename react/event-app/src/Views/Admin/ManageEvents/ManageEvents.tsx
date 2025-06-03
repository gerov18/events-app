import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useGetEventsQuery } from '../../../api/events/eventApi';
import {
  useDeleteAdminEventMutation,
  useGetAdminEventByIdQuery,
} from '../../../api/admin/adminEventsApi';
import moment from 'moment';

const ManageEvents: React.FC = () => {
  const navigate = useNavigate();
  const { data: events, isLoading, isError } = useGetEventsQuery({});
  const [deleteAdminEvent, { isLoading: isDeleting }] =
    useDeleteAdminEventMutation();

  const [deletingId, setDeletingId] = useState<number | null>(null);
  const [confirmId, setConfirmId] = useState<number | null>(null);

  if (isLoading) {
    return (
      <div className='flex justify-center items-center h-64'>
        <p className='text-gray-500 text-lg'>Loading events…</p>
      </div>
    );
  }

  if (isError || !events) {
    return (
      <div className='flex justify-center items-center h-64'>
        <p className='text-red-500 text-lg'>Failed to load events.</p>
      </div>
    );
  }

  const handleDeleteClick = (eventId: number) => {
    setConfirmId(eventId);
  };

  const handleConfirmDelete = async () => {
    if (confirmId == null) return;
    setDeletingId(confirmId);
    try {
      await deleteAdminEvent(confirmId).unwrap();
    } catch (err) {
      console.error('Delete failed:', err);
    } finally {
      setDeletingId(null);
      setConfirmId(null);
    }
  };

  const handleCancelDelete = () => {
    setConfirmId(null);
  };

  return (
    <div className='min-h-screen bg-gray-50 py-8 px-4 md:px-8 lg:px-16'>
      <div className='max-w-6xl mx-auto space-y-6'>
        <div className='flex justify-between items-center'>
          <h1 className='text-3xl font-extrabold text-gray-900'>
            Manage Events
          </h1>
          {/* <Link
            to='/admin/events/new'
            className='px-4 py-2 bg-green-600 text-white rounded-lg shadow hover:bg-green-700 transition'>
            + Create New Event
          </Link> */}
        </div>

        <div className='overflow-x-auto bg-white rounded-lg shadow'>
          <table className='min-w-full divide-y divide-gray-200'>
            <thead className='bg-gray-100'>
              <tr>
                <th className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>
                  ID
                </th>
                <th className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>
                  Title
                </th>
                <th className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>
                  Date
                </th>
                <th className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>
                  Location
                </th>
                <th className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>
                  Capacity
                </th>
                <th className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>
                  Available
                </th>
                <th className='px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider'>
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className='bg-white divide-y divide-gray-200'>
              {events.map(ev => (
                <tr key={ev.id}>
                  <td className='px-6 py-4 whitespace-nowrap text-sm text-gray-700'>
                    {ev.id}
                  </td>
                  <td className='px-6 py-4 whitespace-nowrap'>
                    <Link
                      to={`/events/${ev.id}`}
                      className='text-indigo-600 hover:underline'>
                      {ev.title}
                    </Link>
                  </td>
                  <td className='px-6 py-4 whitespace-nowrap text-sm text-gray-700'>
                    {moment(ev.date).format('DD MMM YYYY')}
                  </td>
                  <td className='px-6 py-4 whitespace-nowrap text-sm text-gray-700'>
                    {ev.location}
                  </td>
                  <td className='px-6 py-4 whitespace-nowrap text-sm text-gray-700'>
                    {ev.capacity}
                  </td>
                  <td className='px-6 py-4 whitespace-nowrap text-sm text-gray-700'>
                    {ev.availableTickets}
                  </td>
                  <td className='px-6 py-4 whitespace-nowrap text-right text-sm font-medium space-x-2'>
                    <Link
                      to={`/admin/events/${ev.id}`}
                      className='text-blue-600 hover:text-blue-800'>
                      View
                    </Link>
                    <Link
                      to={`/admin/events/${ev.id}/edit`}
                      className='text-indigo-600 hover:text-indigo-800'>
                      Edit
                    </Link>
                    <button
                      onClick={() => handleDeleteClick(ev.id)}
                      disabled={deletingId === ev.id}
                      className={`text-red-600 hover:text-red-800 transition ${
                        deletingId === ev.id
                          ? 'opacity-50 cursor-not-allowed'
                          : ''
                      }`}>
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {confirmId !== null && (
          <div className='fixed inset-0 z-50 flex items-center justify-center'>
            <div
              className='fixed inset-0 bg-black opacity-50'
              onClick={handleCancelDelete}
            />
            <div className='relative bg-white rounded-lg shadow-xl p-6 w-96'>
              <h3 className='text-lg font-semibold text-gray-900 mb-4'>
                Confirm Deletion
              </h3>
              <p className='text-gray-700 mb-6'>
                Are you sure you want to permanently delete event{' '}
                <strong>#{confirmId}</strong>?
              </p>
              <div className='flex justify-end space-x-3'>
                <button
                  onClick={handleCancelDelete}
                  className='px-4 py-2 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 transition'>
                  Cancel
                </button>
                <button
                  onClick={handleConfirmDelete}
                  className='px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition'
                  disabled={isDeleting}>
                  {isDeleting ? 'Deleting…' : 'Delete'}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ManageEvents;

import React, { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import Modal from '../../../Components/Modal/Modal';
import EventsSlider from '../../../Components/EventsSlider/EventsSlider';
import {
  useDeleteOrganiserMutation,
  useGetOrganiserByIdQuery,
} from '../../../api/admin/adminOrganisersApi';
import { useGetEventsQuery } from '../../../api/events/eventApi';

const AdminOrganiserDetails: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const organiserId = Number(id);
  const navigate = useNavigate();

  const {
    data: organiser,
    isLoading: isLoadingOrg,
    isError: isErrorOrg,
  } = useGetOrganiserByIdQuery(organiserId, {
    skip: isNaN(organiserId),
  });

  const {
    data: organiserEvents,
    isLoading: isLoadingEvents,
    isError: isErrorEvents,
  } = useGetEventsQuery(
    { createdBy: organiserId },
    { skip: isNaN(organiserId) }
  );

  const [deleteOrganiser, { isLoading: isDeleting }] =
    useDeleteOrganiserMutation();

  const [modalOpen, setModalOpen] = useState(false);

  useEffect(() => {
    if (!isLoadingOrg && isErrorOrg) {
      navigate('/admin/organisers', { replace: true });
    }
  }, [isLoadingOrg, isErrorOrg, navigate]);

  if (isLoadingOrg) {
    return (
      <div className='flex justify-center items-center h-64'>
        <p className='text-gray-500 text-lg'>Loading organiser details…</p>
      </div>
    );
  }

  if (!organiser) {
    return (
      <div className='flex justify-center items-center h-64'>
        <p className='text-red-500 text-lg'>Organiser not found.</p>
      </div>
    );
  }

  const handleConfirmDelete = async () => {
    try {
      await deleteOrganiser(organiserId).unwrap();
      navigate('/admin/organisers');
    } catch (err) {
      console.error('Failed to delete organiser:', err);
    }
  };

  return (
    <div className='px-6 py-8 max-w-4xl mx-auto space-y-12'>
      <div className='bg-white rounded-2xl shadow-lg overflow-hidden'>
        <div className='bg-gradient-to-r from-indigo-600 to-blue-500 p-8 text-white text-center'>
          <h1 className='text-4xl font-extrabold drop-shadow-lg'>
            {organiser.name}
          </h1>
          {organiser.description && (
            <p className='mt-2 text-lg opacity-90'>{organiser.description}</p>
          )}
        </div>
        <div className='p-6 grid grid-cols-1 sm:grid-cols-2 gap-4'>
          <div>
            <p className='text-gray-700'>
              <strong>Email:</strong>{' '}
              <span className='text-indigo-600'>{organiser.email}</span>
            </p>
            {organiser.phone && (
              <p className='text-gray-700 mt-2'>
                <strong>Phone:</strong>{' '}
                <span className='text-indigo-600'>{organiser.phone}</span>
              </p>
            )}
          </div>

          {organiser.website && (
            <div>
              <p className='text-gray-700'>
                <strong>Website:</strong>{' '}
                <a
                  href={organiser.website}
                  target='_blank'
                  rel='noopener noreferrer'
                  className='text-blue-600 hover:underline'>
                  {organiser.website}
                </a>
              </p>
            </div>
          )}
        </div>

        <div className='flex justify-end p-6 space-x-4 bg-gray-50'>
          <Link
            to={`/admin/organisers/${organiser.id}/edit`}
            className='px-6 py-2 bg-blue-600 text-white rounded-lg shadow hover:bg-blue-700 transition'>
            Edit
          </Link>
          <button
            onClick={() => setModalOpen(true)}
            disabled={isDeleting}
            className={`px-6 py-2 rounded-lg font-medium text-white shadow transition transform hover:scale-105 ${
              isDeleting
                ? 'bg-gray-300 text-gray-600 cursor-not-allowed'
                : 'bg-red-500 hover:bg-red-600'
            }`}>
            {isDeleting ? 'Deleting…' : 'Delete'}
          </button>
        </div>
      </div>

      <div className='space-y-6'>
        <h2 className='text-3xl font-bold text-gray-800 text-center'>
          Events by {organiser.name}
        </h2>

        {isLoadingEvents ? (
          <p className='text-center text-gray-500'>Loading events…</p>
        ) : isErrorEvents ? (
          <p className='text-center text-red-500'>Error loading events.</p>
        ) : organiserEvents && organiserEvents.length === 0 ? (
          <div className='bg-yellow-50 border border-yellow-200 rounded-lg p-6 text-center shadow-sm'>
            <p className='text-yellow-700 font-semibold mb-2'>No events yet</p>
            <p className='text-sm text-yellow-600'>
              This organiser hasn't created any events.
            </p>
          </div>
        ) : (
          <EventsSlider
            events={organiserEvents ?? []}
            columns={2}
          />
        )}
      </div>

      <Modal
        isOpen={modalOpen}
        title='Confirm Delete'
        onClose={() => setModalOpen(false)}
        onConfirm={handleConfirmDelete}
        confirmText='Delete'
        cancelText='Cancel'>
        <p className='text-gray-700'>
          Are you sure you want to permanently delete organiser “
          <strong>{organiser.name}</strong>”? This action cannot be undone.
        </p>
      </Modal>
    </div>
  );
};

export default AdminOrganiserDetails;

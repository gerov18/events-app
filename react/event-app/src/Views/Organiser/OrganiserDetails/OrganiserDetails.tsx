import React, { useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { RootState } from '../../../api/store';
import { useGetOrganiserByIdQuery } from '../../../api/organiser/organiserApi';
import { useGetEventsQuery } from '../../../api/events/eventApi';
import moment from 'moment';
import { Organiser as OrganiserType } from '../../../types/Organiser';
import { Event as EventType } from '../../../types/Event';
import EventsSlider from '../../../Components/EventsSlider/EventsSlider';

export const OrganiserDetails: React.FC = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const organiserId = Number(id);

  const {
    data: organiser,
    isLoading: isOrgLoading,
    isError: isOrgError,
  } = useGetOrganiserByIdQuery(organiserId);

  const {
    data: allEvents,
    isLoading: isEventsLoading,
    isError: isEventsError,
  } = useGetEventsQuery({ createdBy: organiserId });

  const auth = useSelector((state: RootState) => state.auth);
  const userType = auth.userType;
  const currentUser = auth.user as OrganiserType | null;

  useEffect(() => {
    if (!isOrgLoading && (isOrgError || !organiser)) {
      navigate('/', { replace: true });
    }
  }, [isOrgLoading, isOrgError, organiser, navigate]);

  if (isOrgLoading || isEventsLoading) {
    return (
      <div className='flex justify-center items-center h-64'>
        <p className='text-gray-500'>Loading organiser details…</p>
      </div>
    );
  }

  if (!organiser) {
    return <div className='p-4 text-red-500'>Organiser not found.</div>;
  }

  const organiserEvents: EventType[] = allEvents ?? [];
  const canManage =
    (userType === 'organiser' && currentUser?.id === organiser.id) ||
    userType === 'admin';

  return (
    <div className='max-w-4xl mx-auto mt-12 mb-16 px-6'>
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

        {canManage && (
          <div className='flex justify-end p-6 space-x-4 bg-gray-50'>
            <Link
              to='/organiser/me/edit'
              className='px-6 py-2 bg-blue-600 text-white rounded-lg shadow hover:bg-blue-700 transition'>
              Edit Profile
            </Link>
            <Link
              to='/organiser/me/delete'
              className='px-6 py-2 bg-red-500 text-white rounded-lg shadow hover:bg-red-600 transition'>
              Delete Profile
            </Link>
          </div>
        )}
      </div>

      <div className='mt-12'>
        <h2 className='text-3xl font-bold text-gray-800 mb-6 text-center'>
          Events by {organiser.name}
        </h2>
        {isEventsError ? (
          <p className='text-center text-red-500'>Error loading events.</p>
        ) : organiserEvents.length === 0 ? (
          <div className='bg-yellow-50 border border-yellow-200 rounded-lg p-6 text-center shadow-sm'>
            <p className='text-yellow-700 font-semibold mb-2'>No events yet</p>
            <p className='text-sm text-yellow-600'>
              This organiser hasn't created any events.
            </p>
          </div>
        ) : (
          <EventsSlider
            events={organiserEvents}
            columns={2}
          />
        )}
      </div>
      <div className='mt-12'>
        <Link
          to='/events/new'
          className='inline-block px-6 py-3 bg-green-600 text-white font-semibold rounded-lg shadow-md hover:bg-green-700 transition-transform transform hover:scale-105'>
          Create New Event
        </Link>
      </div>
    </div>
  );
};

export default OrganiserDetails;

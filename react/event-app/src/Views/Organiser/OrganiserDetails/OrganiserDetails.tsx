import React, { useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { RootState } from '../../../api/store';
import { useGetOrganiserByIdQuery } from '../../../api/organiser/organiserApi';
import { useGetEventsQuery } from '../../../api/events/eventApi';
import moment from 'moment';
import { Organiser as OrganiserType } from '../../../types/Organiser';
import { Event as EventType } from '../../../types/Event';

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
  } = useGetEventsQuery();

  const auth = useSelector((state: RootState) => state.auth);
  const userType = auth.userType;
  const currentUser = auth.user as OrganiserType | null;

  useEffect(() => {
    if (!isOrgLoading && (isOrgError || !organiser)) {
      navigate('/', { replace: true });
    }
  }, [isOrgLoading, isOrgError, organiser, navigate]);

  if (isOrgLoading || isEventsLoading) {
    return <div className='p-4'>Loading organiser details…</div>;
  }

  if (!organiser) {
    return <div className='p-4 text-red-500'>Organiser not found.</div>;
  }

  const organiserEvents: EventType[] =
    allEvents?.filter(e => e.createdBy === organiser.id) || [];

  const canManage =
    (userType === 'organiser' && currentUser?.id === organiser.id) ||
    userType === 'admin';

  return (
    <div className='p-6 max-w-4xl mx-auto'>
      <h1 className='text-3xl font-bold mb-4'>{organiser.name}</h1>
      <div className='mb-6'>
        {organiser.description && (
          <p className='mb-2 text-gray-700'>{organiser.description}</p>
        )}
        <p>
          <strong>Email:</strong> {organiser.email}
        </p>
        {organiser.phone && (
          <p>
            <strong>Phone:</strong> {organiser.phone}
          </p>
        )}
        {organiser.website && (
          <p>
            <strong>Website:</strong>{' '}
            <a
              href={organiser.website}
              target='_blank'
              rel='noopener noreferrer'
              className='text-blue-600 hover:underline'>
              {organiser.website}
            </a>
          </p>
        )}

        {canManage && (
          <div className='mt-4 space-x-4'>
            <Link
              to='/organiser/me/edit'
              className='px-4 py-2 bg-blue-500 text-white rounded'>
              Edit Profile
            </Link>
            <Link
              to='/organiser/me/delete'
              className='px-4 py-2 bg-red-500 text-white rounded'>
              Delete Profile
            </Link>
          </div>
        )}
      </div>

      <h2 className='text-2xl font-semibold mb-3'>
        Events by {organiser.name}
      </h2>
      {isEventsError ? (
        <p className='text-red-500'>Error loading events.</p>
      ) : organiserEvents.length === 0 ? (
        <p className='text-gray-600'>
          This organiser has not created any events yet.
        </p>
      ) : (
        <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
          {organiserEvents.map(evt => (
            <Link
              to={`/events/${evt.id}`}
              key={evt.id}
              className='block border rounded overflow-hidden hover:shadow-lg'>
              <div className='p-4'>
                <h3 className='text-xl font-bold mb-2'>{evt.title}</h3>
                <p className='text-gray-600 mb-1'>
                  {moment(evt.date).format('DD.MM.YYYY')}
                </p>
                <p className='text-gray-700'>Location: {evt.location}</p>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
};

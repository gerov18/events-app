import React from 'react';
import {
  useGetRoleRequestsQuery,
  useHandleRoleRequestMutation,
} from '../../../api/admin/adminApi';

export const HandleRoleRequests: React.FC = () => {
  const { data: requests, isLoading, isError } = useGetRoleRequestsQuery();

  const [handleRequest] = useHandleRoleRequestMutation();

  if (isLoading) return <div>Loading role requests…</div>;
  if (isError)
    return <div className='text-red-500'>Error loading requests</div>;

  return (
    <div className='max-w-4xl mx-auto'>
      <h2 className='text-2xl font-semibold mb-4'>Role Requests</h2>
      {requests && requests.length === 0 ? (
        <p className='text-gray-600'>No pending role requests.</p>
      ) : (
        <table className='min-w-full bg-white border'>
          <thead>
            <tr className='bg-gray-200 text-left'>
              <th className='px-4 py-2'>Request ID</th>
              <th className='px-4 py-2'>User</th>
              <th className='px-4 py-2'>Requested Role</th>
              <th className='px-4 py-2'>Status</th>
              <th className='px-4 py-2'>Actions</th>
            </tr>
          </thead>
          <tbody>
            {requests!.map(req => (
              <tr
                key={req.id}
                className='border-t'>
                <td className='px-4 py-2'>{req.id}</td>
                <td className='px-4 py-2'>
                  {req.user.username} ({req.user.email})
                </td>
                <td className='px-4 py-2'>{req.role}</td>
                <td className='px-4 py-2'>{req.status}</td>
                <td className='px-4 py-2 space-x-2'>
                  <button
                    onClick={() =>
                      handleRequest({ id: req.id, status: 'ACCEPTED' }).unwrap()
                    }
                    className='px-2 py-1 bg-green-500 text-white rounded hover:bg-green-600'>
                    Accept
                  </button>
                  <button
                    onClick={() =>
                      handleRequest({ id: req.id, status: 'REJECTED' }).unwrap()
                    }
                    className='px-2 py-1 bg-red-500 text-white rounded hover:bg-red-600'>
                    Reject
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

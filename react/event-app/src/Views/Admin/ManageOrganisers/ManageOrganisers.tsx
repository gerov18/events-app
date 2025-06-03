import React from 'react';
import {
  useDeleteUserByAdminMutation,
  useGetAllOrganisersQuery,
} from '../../../api/admin/adminApi';
import { Organiser } from '../../../types/Organiser';
import { Link } from 'react-router';

export const ManageOrganisers: React.FC = () => {
  const { data: organisers, isLoading, isError } = useGetAllOrganisersQuery();
  const [deleteOrganiser] = useDeleteUserByAdminMutation();

  if (isLoading) return <div>Loading organisers…</div>;
  if (isError)
    return <div className='text-red-500'>Error loading organisers</div>;

  return (
    <div className='max-w-4xl mx-auto'>
      <h2 className='text-2xl font-semibold mb-4'>All Organisers</h2>
      <table className='min-w-full bg-white border'>
        <thead>
          <tr className='bg-gray-200 text-left'>
            <th className='px-4 py-2'>ID</th>
            <th className='px-4 py-2'>Name</th>
            <th className='px-4 py-2'>Email</th>
            <th className='px-4 py-2'>Actions</th>
          </tr>
        </thead>
        <tbody>
          {organisers!.map((org: Organiser) => (
            <tr
              key={org.id}
              className='border-t'>
              <td className='px-4 py-2'>{org.id}</td>
              <td className='px-4 py-2'>
                <Link
                  to={`/admin/organisers/${org.id}`}
                  className='hover:underline'>
                  {org.name}
                </Link>
              </td>
              <td className='px-4 py-2'>{org.email}</td>
              <td className='px-4 py-2'>
                <button
                  onClick={() => {
                    if (window.confirm(`Delete organiser ${org.name}?`)) {
                      deleteOrganiser(org.id).unwrap();
                    }
                  }}
                  className='px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600'>
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

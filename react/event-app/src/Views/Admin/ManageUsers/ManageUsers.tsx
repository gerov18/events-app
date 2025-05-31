// src/Views/Admin/ManageUsers.tsx
import React from 'react';
import { User } from '../../../types/User';
import {
  useDeleteUserByAdminMutation,
  useGetAllUsersQuery,
  useUpdateUserRoleMutation,
} from '../../../api/admin/adminApi';

export const ManageUsers: React.FC = () => {
  const { data: users, isLoading, isError } = useGetAllUsersQuery();

  const [deleteUser] = useDeleteUserByAdminMutation();
  const [updateUserRole] = useUpdateUserRoleMutation();

  if (isLoading) return <div>Loading users…</div>;
  if (isError) return <div className='text-red-500'>Error loading users</div>;

  return (
    <div className='max-w-4xl mx-auto'>
      <h2 className='text-2xl font-semibold mb-4'>All Users</h2>
      <table className='min-w-full bg-white border'>
        <thead>
          <tr className='bg-gray-200 text-left'>
            <th className='px-4 py-2'>ID</th>
            <th className='px-4 py-2'>Email</th>
            <th className='px-4 py-2'>Username</th>
            <th className='px-4 py-2'>Role</th>
            <th className='px-4 py-2'>Actions</th>
          </tr>
        </thead>
        <tbody>
          {users!.map((user: User) => (
            <tr
              key={user.id}
              className='border-t'>
              <td className='px-4 py-2'>{user.id}</td>
              <td className='px-4 py-2'>{user.email}</td>
              <td className='px-4 py-2'>{user.username}</td>
              <td className='px-4 py-2'>{user.role}</td>
              <td className='px-4 py-2 space-x-2'>
                {user.role !== 'ADMIN' && (
                  <button
                    onClick={() =>
                      updateUserRole({ id: user.id, role: 'ADMIN' }).unwrap()
                    }
                    className='px-2 py-1 bg-green-500 text-white rounded hover:bg-green-600'>
                    Make Admin
                  </button>
                )}

                {user.role !== 'USER' && (
                  <button
                    onClick={() =>
                      updateUserRole({ id: user.id, role: 'USER' }).unwrap()
                    }
                    className='px-2 py-1 bg-yellow-500 text-white rounded hover:bg-yellow-600'>
                    Reset to User
                  </button>
                )}

                <button
                  onClick={() => {
                    if (
                      window.confirm(
                        `Are you sure you want to delete user ${user.username}?`
                      )
                    ) {
                      deleteUser(user.id).unwrap();
                    }
                  }}
                  className='px-2 py-1 bg-red-500 text-white rounded hover:bg-red-600'>
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

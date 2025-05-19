import { useForm } from 'react-hook-form';
import { EventInput, eventSchema } from '../../api/events/eventSchema';
import { FormInput } from '../../Components/FormInput/FormInput';
import { CreateEventInput } from '../../types/Event';
import { zodResolver } from '@hookform/resolvers/zod';

const EventForm = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<EventInput>({
    resolver: zodResolver(eventSchema),
  });
  const handleFormSubmit = async (data: CreateEventInput) => {};

  return (
    <div>
      <form>
        <FormInput
          label='Title'
          type='text'
          register={register('title', { required: 'Title is required' })}
          error={errors.title?.message as string}
        />
      </form>
    </div>
  );
};

export default EventForm;

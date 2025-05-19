import { FormInput } from '../../Components/FormInput/FormInput';
import { CreateEventInput } from '../../types/event';

const EventForm = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<RegisterInput>({
    resolver: zodResolver(registerSchema),
  });
  const handleFormSubmit = async (data: CreateEventInput) => {};

  return (
    <div>
      <form>
        <FormInput
          label='Title'
          type='text'
          register={register('title', { required: 'Title is required' })}
          error={errors.email?.message as string}
        />
      </form>
    </div>
  );
};

export default EventForm;

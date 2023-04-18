import { useForm } from 'react-hook-form';
import { useMutation } from '@trpc/react';
// import { userRouter } from './userRouter';

interface FormData {
  displayName: string;
  instrument: string;
  bio: string;
  zipCode: string;
  skillLevel: number;
}

function SignupForm() {
  const {
    register,
    handleSubmit,
    formState: { isSubmitting },
  } = useForm<FormData>();

//   const [signup] = useMutation(userRouter.mutation('signup'));

  async function onSubmit(formData: FormData) {
    try {
    const { displayName, instrument, bio, zipCode, skillLevel } = formData;
    console.log('formData', formData);
    //   const result = await signup({
    //     displayName,
    //     primaryInstrument: instrument,
    //     bio,
    //     zipCode,
    //     skillLevel,
    //   });

    //   console.log('User created:', result.data);
    } catch (error) {
      console.error(error);
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <label>
        Display name:
        <input {...register('displayName')} />
      </label>
      <label>
        Primary instrument:
        <input {...register('instrument')} />
      </label>
      <label>
        Bio:
        <input {...register('bio')} />
      </label>
      <label>
        ZIP code:
        <input {...register('zipCode')} />
      </label>
      <label>
        Skill level:
        <input type="number" {...register('skillLevel')} />
      </label>
      <button type="submit" disabled={isSubmitting}>
        Submit
      </button>
    </form>
  );
}

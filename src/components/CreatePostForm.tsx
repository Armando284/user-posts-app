import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { createPostSchema, type CreatePostInput } from '../schemas/post'

interface CreatePostFormProps {
  onSubmit: (values: CreatePostInput) => void
}

export function CreatePostForm({ onSubmit }: CreatePostFormProps) {
  const {
    formState: { errors },
    handleSubmit,
    register,
    reset,
  } = useForm<CreatePostInput>({
    resolver: zodResolver(createPostSchema),
    defaultValues: {
      title: '',
      body: '',
    },
  })

  return (
    <form
      onSubmit={handleSubmit((values) => {
        onSubmit(values)
        reset()
      })}
      noValidate
    >
      <h3>Create a post</h3>

      <div>
        <label htmlFor="post-title">Title</label>
        <input
          id="post-title"
          type="text"
          aria-invalid={Boolean(errors.title)}
          aria-describedby={errors.title ? 'post-title-error' : undefined}
          {...register('title')}
        />
        {errors.title ? (
          <p id="post-title-error" role="alert">
            {errors.title.message}
          </p>
        ) : null}
      </div>

      <div>
        <label htmlFor="post-body">Post content</label>
        <textarea
          id="post-body"
          rows={4}
          aria-invalid={Boolean(errors.body)}
          aria-describedby={errors.body ? 'post-body-error' : undefined}
          {...register('body')}
        />
        {errors.body ? (
          <p id="post-body-error" role="alert">
            {errors.body.message}
          </p>
        ) : null}
      </div>

      <button type="submit">Create post</button>
    </form>
  )
}

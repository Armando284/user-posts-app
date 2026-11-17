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
      className="flex flex-col gap-5"
    >
      <h3 className="text-base font-semibold tracking-tight text-ink">Create a post</h3>

      <div className="flex flex-col gap-2">
        <label htmlFor="post-title" className="text-sm font-medium text-ink">
          Title
        </label>
        <input
          id="post-title"
          type="text"
          aria-invalid={Boolean(errors.title)}
          aria-describedby={errors.title ? 'post-title-error' : undefined}
          className={`h-10 w-full rounded-lg border bg-surface px-3 text-base text-ink transition-colors placeholder:text-muted focus:border-accent ${
            errors.title ? 'border-danger' : 'border-line'
          }`}
          {...register('title')}
        />
        {errors.title ? (
          <p id="post-title-error" role="alert" className="text-sm font-medium text-danger">
            {errors.title.message}
          </p>
        ) : null}
      </div>

      <div className="flex flex-col gap-2">
        <label htmlFor="post-body" className="text-sm font-medium text-ink">
          Post content
        </label>
        <textarea
          id="post-body"
          rows={4}
          aria-invalid={Boolean(errors.body)}
          aria-describedby={errors.body ? 'post-body-error' : undefined}
          className={`min-h-32 w-full resize-y rounded-lg border bg-surface px-3 py-2.5 text-base leading-6 text-ink transition-colors placeholder:text-muted focus:border-accent ${
            errors.body ? 'border-danger' : 'border-line'
          }`}
          {...register('body')}
        />
        {errors.body ? (
          <p id="post-body-error" role="alert" className="text-sm font-medium text-danger">
            {errors.body.message}
          </p>
        ) : null}
      </div>

      <div className="flex justify-end">
        <button
          type="submit"
          className="inline-flex h-10 cursor-pointer items-center justify-center rounded-lg bg-accent px-4 text-sm font-semibold text-white transition-colors hover:bg-accent-strong focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-surface"
        >
          Create post
        </button>
      </div>
    </form>
  )
}

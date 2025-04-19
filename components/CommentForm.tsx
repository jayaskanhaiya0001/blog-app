import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useSession } from 'next-auth/react';
import axios from 'axios';
import { useMutation, useQueryClient } from 'react-query';

const commentSchema = z.object({
  content: z.string().min(1, 'Comment cannot be empty')
});

type CommentFormData = z.infer<typeof commentSchema>;

interface CommentFormProps {
  blogId: string;
}

export default function CommentForm({ blogId }: CommentFormProps) {
  const { data: session }: any = useSession();
  const queryClient = useQueryClient();
  
  const { register, handleSubmit, reset, formState: { errors } } = useForm<CommentFormData>({
    resolver: zodResolver(commentSchema)
  });

  const mutation = useMutation(
    (data: CommentFormData) => axios.post('/api/comments', { ...data, blogId } , {
      headers: {
        'Authorization' : `Bearer ${session.accessToken}`
      }
    }),
    {
      onSuccess: () => {
        queryClient.invalidateQueries(['comments', blogId]);
        reset();
      }
    }
  );

  const onSubmit = (data: CommentFormData) => {
    mutation.mutate(data);
  };

  if (!session) {
    return (
      <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 mb-6">
        <p className="text-yellow-700">
          Please <a href="/auth/login" className="text-blue-600 hover:underline">login</a> to post a comment.
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="mb-8">
      <div className="mb-4">
        <label htmlFor="content" className="block text-sm font-medium text-gray-700 mb-2">
          Add a comment
        </label>
        <textarea
          id="content"
          {...register('content')}
          className="w-full px-3 text-black py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
          rows={4}
        />
        {errors.content && (
          <p className="mt-1 text-sm text-red-600">{errors.content.message}</p>
        )}
      </div>
      <button
        type="submit"
        className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
        disabled={mutation.isLoading}
      >
        {mutation.isLoading ? 'Posting...' : 'Post Comment'}
      </button>
    </form>
  );
}
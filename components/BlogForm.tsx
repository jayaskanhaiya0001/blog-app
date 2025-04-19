import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import axios from 'axios';
import { useRouter } from 'next/router';
import { useMutation } from 'react-query';
import { useSession } from 'next-auth/react';

const blogSchema = z.object({
  title: z.string().min(1, 'Title is required'),
  content: z.string().min(1, 'Content is required'),
});

type BlogFormData = z.infer<typeof blogSchema>;

interface BlogFormProps {
  blog?: any;
  onSuccess: () => void;
}

export default function BlogForm({ blog, onSuccess }: BlogFormProps) {
  const router = useRouter();
  const isEdit = !!blog;
  const session: any = useSession();
  // const {da}
  const { register, handleSubmit, formState: { errors } } = useForm<BlogFormData>({
    resolver: zodResolver(blogSchema),
    defaultValues: blog || {
      title: '',
      content: '',

    }
  });

  const mutation = useMutation(
    (data: BlogFormData) => {

      // console.log("Session status while creating the form data",session?.data?.accessToken)

      // console.log("Token access",token.accessToken);
      if (isEdit) {
        return axios.put(`/api/admin/blogs/${blog._id}`, data);
      } else {
        return axios.post('/api/admin/blogs', data, {
          headers: {
            'Authorization': `Bearer ${session.data.accessToken}`
          }
        });
      }
    },
    {
      onSuccess: () => {
        onSuccess();
      }
    }
  );

  const onSubmit = (data: BlogFormData) => {
    mutation.mutate(data);
  };

  return (


    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <div>
        <label htmlFor="title" className="block text-sm font-medium text-gray-700">
          Title
        </label>
        <input
          id="title"
          {...register('title')}
          className="mt-1 block w-full rounded-md py-2 text-black  border-black border-2 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
        />
        {errors.title && (
          <p className="mt-1 text-sm text-red-600">{errors.title.message}</p>
        )}
      </div>

      <div>
        <label htmlFor="content" className="block text-sm font-medium text-gray-700">
          Content
        </label>
        <textarea
          id="content"
          rows={10}
          {...register('content')}
          className="mt-1 block w-full rounded-md border-black border-2 text-black shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
        />
        {errors.content && (
          <p className="mt-1 text-sm text-red-600">{errors.content.message}</p>
        )}
      </div>

      {/* <div>
        <label htmlFor="tags" className="block text-sm font-medium text-gray-700">
          Tags (comma separated)
        </label>
        <input
          id="tags"
          {...register('tags')}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
        />
      </div> */}

      <div className="flex justify-end">
        <button
          type="button"
          onClick={() => router.push('/admin')}
          className="rounded-md border border-gray-300 bg-white py-2 px-4 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
        >
          Cancel
        </button>
        <button
          type="submit"
          className="ml-3 inline-flex justify-center rounded-md border border-transparent bg-blue-600 py-2 px-4 text-sm font-medium text-white shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
          disabled={mutation.isLoading}
        >
          {mutation.isLoading ? 'Saving...' : 'Save'}
        </button>
      </div>
    </form>

  );
}
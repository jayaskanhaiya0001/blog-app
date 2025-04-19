import { useQuery } from 'react-query';
import axios from 'axios';
import { useRouter } from 'next/router';
import Link from 'next/link';
import Layout from '@/components/Layout';

interface Blog {
  _id: string;
  title: string;
  author: {
    username: string;
  };
  createdAt: string;
}
  
export default function BlogListPage() {
  const router = useRouter();
  const { page = 1, search } = router.query;
  const { data, isLoading, error } = useQuery(['blogs', page, search], async () => {
    const { data } = await axios.get('/api/blogs', {
      params: { page, search }
    });
    return data;
  });
  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error loading blogs</div>;
  return (
    <Layout>
      <div>
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-black">Blog Posts</h1>
          <input
            type="text"
            placeholder="Search blogs..."
            className="px-4 py-2 border rounded-md"
            value={search}
            onChange={(e) => router.push({
              pathname: '/blogs',
              query: { ...router.query, search: e.target.value }
            })}
          />
        </div>
        <div className="grid gap-8 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
          {data.data.map((blog: Blog) => (
            <Link href={`/blogs/${blog._id}`} key={blog._id}>
              <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm hover:shadow-md transition-all duration-300 hover:border-blue-500 cursor-pointer group">
                <h2 className="text-2xl font-semibold mb-2 text-gray-800 group-hover:text-blue-600 transition">
                  {blog.title}
                </h2>
                <p className="text-gray-500 text-sm mb-1">By {blog.author.username}</p>
                <p className="text-gray-400 text-xs">{new Date(blog.createdAt).toLocaleDateString()}</p>
                <div className="mt-4 text-sm text-blue-600 group-hover:underline">Read more →</div>
              </div>
            </Link>
          ))}
        </div>
        <div className="flex justify-between mt-8 mx-auto max-w-max items-center gap-4">
          <button
            onClick={() => router.push({
              pathname: '/blogs',
              query: { ...router.query, page: Math.max(1, Number(page) - 1) }
            })}
            disabled={Number(page) === 1}
            className="px-4 py-2 bg-gray-200 rounded-md disabled:opacity-50 text-black"
          >
            Previous
          </button>
          <span className='text-black'>Page {page} of {data.totalPages}</span>
          <button
            onClick={() => router.push({
              pathname: '/blogs',
              query: { ...router.query, page: Number(page) + 1 }
            })}
            disabled={Number(page) === data.totalPages}
            className="px-4 py-2 bg-gray-200 rounded-md disabled:opacity-50 text-black"
          >
            Next
          </button>
        </div>
      </div>
    </Layout>
  );
}
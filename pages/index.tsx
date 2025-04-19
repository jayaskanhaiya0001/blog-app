import Layout from "@/components/Layout";
import { useQuery } from 'react-query';
import axios from 'axios';
import { motion } from "framer-motion";


export default function Home() {
  const { data: blogs, isLoading, error } = useQuery('blogs', async () => {
    const { data } = await axios.get('/api/blogs');
    return data;
  });
  return (
    <Layout>
      <div >
        <h1 className="text-3xl font-bold mb-8 text-black">Latest Blog Posts</h1>

        {isLoading ? (
          <div>Loading...</div>
        ) : error ? (
          <div>Error loading blogs</div>
        ) : (

          <div className="grid gap-8 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
          {blogs.data.map((blog: any, index: any) => (
            <motion.div
              key={blog._id}
              className="bg-white rounded-2xl shadow-lg p-6 group hover:shadow-2xl transition-all duration-300 cursor-pointer border border-gray-100"
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              whileHover={{ scale: 1.02 }}
            >
              <h2 className="text-2xl font-semibold text-gray-800 mb-3 group-hover:text-blue-600 transition-colors duration-300">
                {blog.title}
              </h2>
              <p className="text-gray-600 mb-4 line-clamp-3">{blog.content}</p>
              <div className="flex justify-between items-center text-sm text-gray-500">
                <span>
                  By <span className="font-medium text-gray-700">{blog.author.username}</span>
                </span>
                <span>{new Date(blog.createdAt).toLocaleDateString()}</span>
              </div>
              <div className="mt-4">
                <button className="text-sm px-4 py-2 bg-blue-100 text-blue-700 rounded-full font-medium transition duration-300 hover:bg-blue-600 hover:text-white">
                  Read More →
                </button>
              </div>
            </motion.div>
          ))}
        </div>

        )}
      </div>
    </Layout>
  );
}

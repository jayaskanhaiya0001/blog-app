import { NextPage } from 'next';
import ProtectedRoute from '@/components/ProtectedRoute';
import { useRouter } from 'next/router';
import BlogForm from '@/components/BlogForm';
import Layout from '@/components/Layout';

const CreateBlogPage: NextPage = () => {
  const router = useRouter();

  const handleSuccess = () => {
    router.push('/admin');
  };

  return (
    <ProtectedRoute adminOnly>
      <Layout>
          <div className="mx-auto py-8">
            <h1 className="text-2xl font-bold mb-6 text-black">Create New Blog Post</h1>
            <BlogForm onSuccess={handleSuccess} />
          </div>
  
      </Layout>
    </ProtectedRoute>
  );
};

export default CreateBlogPage;
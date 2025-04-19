import { NextPage, GetServerSideProps } from 'next';
import { useQuery } from 'react-query';
import axios from 'axios';
import Layout from '@/components/Layout';
import CommentForm from '@/components/CommentForm';
import { getSession } from 'next-auth/react';




interface BlogPageProps {
    id: string;
    token: string
}

const BlogPage: NextPage<BlogPageProps> = ({ id, token }) => {
    const { data: blog, isLoading, error } = useQuery(['blog', id], async () => {
        const { data } = await axios.get(`/api/blogs/${id}`, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        }
        );
        return data;
    });

    const { data: comments } = useQuery(['comments', id], async () => {
        const { data } = await axios.get(`/api/comments?blogId=${id}`, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        });
        return data;
    });

    if (isLoading) return <div>Loading...</div>;
    if (error) return <div>Error loading blog post</div>;

    return (
        <Layout>
            <div>
                <article className="mb-12">
                    <h1 className="text-4xl font-bold mb-4 text-black">{blog.title}</h1>
                    <div className="text-gray-500 mb-6">
                        By {blog.author.username} • {new Date(blog.createdAt).toLocaleDateString()}
                    </div>
                    <div className="prose max-w-none text-black" dangerouslySetInnerHTML={{ __html: blog.content }} />
                </article>

                <section className="mb-12">
                    <h2 className="text-2xl font-bold mb-6 text-black">Comments</h2>
                    <CommentForm blogId={id} />
                    {/* <CommentsList comments={comments} /> */}
                </section>
            </div>
        </Layout>
    );
};

export const getServerSideProps: GetServerSideProps = async (context) => {
    const session: any = await getSession(context);
    return {
        props: {
            id: context.params?.id,
            token: session.accessToken
        }
    };
};

export default BlogPage;
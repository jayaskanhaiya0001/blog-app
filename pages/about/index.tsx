import Layout from '@/components/Layout';
import Link from 'next/link';

export default function AboutPage() {
    return (
        <Layout>
            <div className=" h-full  text-gray-800 flex flex-col items-center justify-center px-4">
                <div className="max-w-2xl w-full bg-white shadow-lg rounded-2xl p-8">
                    <h1 className="text-4xl font-bold mb-4 text-center">About Our Blog</h1>
                    <p className="text-lg mb-4">
                        Welcome to our blog application! This platform is designed for readers and writers to share thoughts, ideas,
                        and stories. We focus on clean content, community-driven posts, and an easy reading experience.
                    </p>
                    <p className="text-lg mb-4">
                        Built with Next.js and styled with Tailwind CSS, our blog is fast, modern, and mobile-friendly. Whether you're
                        here to explore or publish your own work, we hope you enjoy the experience.
                    </p>
                    <p className="text-lg mb-6">
                        Stay tuned for updates, new features, and exciting content!
                    </p>
                    <div className="text-center">
                        <Link href="/" className="inline-block px-6 py-2 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition">
                            Go Back Home
                        </Link>
                    </div>
                </div>
            </div>
        </Layout>
    );
}

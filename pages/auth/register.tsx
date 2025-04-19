import RegisterForm from '@/components/RegisterForm';
import Head from 'next/head';

export default function RegisterPage() {
  return (
    <>
      <Head>
        <title>Register | Blog App</title>
        <meta name="description" content="Create a new account" />
      </Head>
      
      <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
        <div className="sm:mx-auto sm:w-full sm:max-w-md">
          <h1 className="text-center text-3xl font-extrabold text-gray-900">
            Blog App
          </h1>
        </div>
        
        <RegisterForm />
      </div>
    </>
  );
}
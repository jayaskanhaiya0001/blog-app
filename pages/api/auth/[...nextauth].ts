import NextAuth from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import axios from 'axios';

export const authOptions: any = {
    providers: [
        CredentialsProvider({
            name: 'Credentials',
            credentials: {
                email: { label: "Email", type: "email" },
                password: { label: "Password", type: "password" }
            },
            async authorize(credentials) {
                try {
                    const { data } = await axios.post(`http://localhost:3000/api/auth/login`, {
                        email: credentials?.email,
                        password: credentials?.password
                    });


                    if (data.token && data.user) {
                        return {
                            id: data.user.id,
                            name: data.user.username,
                            email: data.user.email,
                            role: data.user.role,
                            token: data.token
                        };

                    }
                    return null;
                } catch (error) {
                    return null;
                }
            }
        })
    ],
    callbacks: {
        async jwt({ token, user }: any) {
            if (user) {
                token.role = user.role;
                token.accessToken = user.token;
            }
            return token;
        },
        async session({ session, token }: any) {
            if (token) {
                session.user.role = token.role;
                session.accessToken = token.accessToken;
            }
            return session;
        }
    },
    pages: {
        signIn: '/auth/login'
    },
    secret: process.env.NEXTAUTH_SECRET,
    session: {
        strategy: 'jwt',
    },
}

export default NextAuth(authOptions);


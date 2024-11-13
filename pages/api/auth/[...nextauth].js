import { connectDB } from "@/util/database";
import { MongoDBAdapter } from "@next-auth/mongodb-adapter";
import NextAuth from "next-auth";
import GoogleProvider from "next-auth/providers/google";

export const authOptions = {
  // 구현하고 싶은 로그인 방식(provider)
  providers: [
    GoogleProvider({
      clientId: process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID,
      clientSecret: process.env.NEXT_PUBLIC_API_KEY,
      allowDangerousEmailAccountLinking: true,
    }),
  ],
  // JWT 생성 시 사용할 암호(secret)
  secret: 'qwer1234',
  adapter: MongoDBAdapter(connectDB)
};
export default NextAuth(authOptions);
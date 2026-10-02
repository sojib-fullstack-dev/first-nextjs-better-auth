import { betterAuth, google } from "better-auth";
import { MongoClient } from "mongodb";
import { mongodbAdapter } from "better-auth/adapters/mongodb";
import process from "node:process";
import { Resend } from 'resend';


const client = new MongoClient(process.env.BETTER_AUTH_MONGODB_URL);
const db = client.db();

const resend = new Resend(process.env.RESEND_API_KEY);

export const auth = betterAuth({

     emailAndPassword: { 
    enabled: true, 
   requireEmailVerification:true,
  },

  emailVerification: {
    sendVerificationEmail: async ( { user, url }) => {
      console.log('Verify URL:', url)
      void resend.emails.send({
        from: 'Acme <onboarding@resend.dev>',
        to: user.email,
        subject: 'Verify your email address',
        html: `
        <h1>Please Verify your email address</h1>
        Click <a href="${url}">here</a> to verify your email.
        `,
      });
    },
    sendOnSignUp: true,
		autoSignInAfterVerification: true,
		expiresIn: 7*24*3600 // 7 day
  },
		


socialProviders: {
        google: { 
            clientId: process.env.BETTER_AUTH_GOOGLE_CLIENT_ID,
            clientSecret: process.env.BETTER_AUTH_GOOGLE_SECRET
        }, 

          github: { 
            clientId: process.env.BETTER_AUTH_GITHUB_CLIENT_ID, 
            clientSecret: process.env.BETTER_AUTH_GITHUB_SECRET_ID, 
        }, 
    }, 
     database: mongodbAdapter(db, {
    client

  }),
})
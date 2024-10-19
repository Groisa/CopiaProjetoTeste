/** @type {import('next').NextConfig} */
const nextConfig = {
    publicRuntimeConfig: {
        FIREBASE_API_KEY: "AIzaSyCSjTCgp1-2ZGTLTOGpeqI8gmN2RSa30VU",
        FIREBASE_AUTH_DOMAIN: "AIzaSyCSjTCgp1-2ZGTLTOGpeqI8gmN2RSa30VU",
        FIREBASE_PROJECT_ID: "projetocaminhao",
        FIREBASE_STORAGE_BUCKET: "process.env.FIREBASE_STORAGE_BUCKET",
        FIREBASE_MESSAGING_SENDER_ID: "1093176108703",
        FIREBASE_APP_ID: "1:1093176108703:web:845968589e1182d68fa4aa",
        FIREBASE_MEASUREMENT_ID: process.env.FIREBASE_MEASUREMENT_ID,
    },
};



export default nextConfig;

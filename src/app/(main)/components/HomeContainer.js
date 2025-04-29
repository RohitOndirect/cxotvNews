import { Suspense } from "react";
import { fetchCustomAds } from "../../../redux/slices/customAdsSlice";
import dynamic from 'next/dynamic';
import HomePage from './HomePage';

// Import wrapper function for server actions
import { createServerComponentClient } from "./serverActions.js";

export const metadata = {
    title: 'Latest Technology News - CXOTV Today & Tech Updates',
    description: 'Stay updated with the latest technology news, CXO insights, and expert opinions on CXO TV. Get the latest tech updates and exclusive interviews.',
    keywords: 'technology news, CXO TV, tech updates, latest tech trends, digital transformation',
    openGraph: {
        title: 'Latest Technology News - CXOTV Today & Tech Updates',
        type: 'website',
        url: 'https://cxotv.techplusmedia.com/',
    }
};

async function Home() {
    // Fetch initial ads data on the server
    let serverAdsData = null;

    try {
        // Get server-side store and dispatch
        const { store } = await createServerComponentClient();
        await store.dispatch(fetchCustomAds());

        // Get the data from the store after fetching
        serverAdsData = store.getState().customAds.data;
    } catch (error) {
        console.error('Error fetching ads data on server:', error);
    }

    return (
        <>
            <Suspense fallback={<div>Loading metadata...</div>}>
            </Suspense>

            <HomePage serverAdsData={serverAdsData} />
        </>
    );
}

export default Home;
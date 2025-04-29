"use client"

import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchCustomAds } from "../../../redux/slices/customAdsSlice";
import dynamic from 'next/dynamic';
import Section from "./Section";
import HomeSlider from "./HomeSlider.js";
import "../globals.css";
import { Suspense } from "react";

// Import Ads component directly
import Ad from "./Ad.js";

// Use dynamic imports with ssr:true for components that support SSR
const NewsSection = dynamic(() => import("./NewsSection.js"), {
    suspense: true,
    ssr: true
});

const TwoCategoryData = dynamic(() => import("./TwoCategoryData.js"), {
    suspense: true,
    ssr: true
});

const HomePage = ({ serverAdsData }) => {
    const dispatch = useDispatch();
    const { isAdLoading, isError } = useSelector((state) => state.customAds);

    useEffect(() => {
        // Only fetch if we don't have server data
        if (!serverAdsData) {
            dispatch(fetchCustomAds());
        }
    }, [dispatch, serverAdsData]);

    if (isAdLoading && !serverAdsData) {
        return (
            <div className="grid min-h-[calc(100vh-3.5rem)] place-items-center">
                <div className="spinner"></div>
            </div>
        );
    }

    if (isError) {
        return (
            <div>
                <div className="flex flex-col items-center justify-center py-20 gap-8">
                    <p className="lg:text-[40px] text-red-600 font-fira capitalize">
                        Server Error
                    </p>
                    <div className="text-red-600 font-roboto text-4xl font-bold">
                        Oops! Something Went Wrong
                    </div>
                    <p className="text-gray-700 text-lg text-center">
                        Sorry, there seems to be an error on the server side. Please refresh
                        the page or try again later.
                    </p>
                </div>
            </div>
        );
    }

    const categoryData = [
        { name: "Tech Thursday", title: "TECH THURSDAY" },
        { name: "BFSI", title: "CXO BFSI" },
        { name: "Health Technology", title: "CXO HEALTH" },
        { name: "Education Technology", title: "CXO EDUCATION" },
        { name: "Marketing Mondays", title: "MARKETING" },
        { name: "Technology", title: "TECH NEWS" },
    ];

    const categoriesWithHeadings1 = [
        { name: "Technology", heading: "Technology" },
        { name: "Interviews", heading: "Interviews" },
    ];

    const categoriesWithHeadings2 = [
        { name: "what's popular", heading: "WHAT'S POPULAR" },
        { name: "editor's choice", heading: "EDITOR'S CHOICE" },
    ];

    const names = [
        "Tech Priorities",
        "Tech Thursday",
        "Interviews",
        "CFO Playbook",
        "Developers",
        "Cyberwatch",
        "CXO Talk",
        "Marketing Mondays",
        "Talks with Kalpana",
        "CEO Talk",
    ];

    const sliderLeft = ["CXO Talk", "Marketing Mondays", "CEO Talk"];

    return (
        <>
            <div className="sr-only">
                <h1>Latest Technology News - CXOTV Today & Tech Updates</h1>
                <h2>Latest Technology News & Trends</h2>
            </div>
            <div className="flex flex-col gap-3 mx-auto w-full">
                <div className="mx-auto lg:w-[50%] w-[90%]">
                    <Suspense fallback={<div>Loading ad...</div>}>
                        <Ad name="tech-summit-2023" />
                    </Suspense>
                </div>

                <div className="py-2">
                    <HomeSlider category="Trending News" names={sliderLeft} />
                </div>
                <div>
                    <Section names={names} />
                </div>

                <div className="w-full py-10 px-4 mx-auto items-center bg-[#F3F2F6]">
                    <Suspense fallback={<div>Loading categories...</div>}>
                        <TwoCategoryData
                            active={true}
                            categoriesWithHeadings={categoriesWithHeadings1}
                        />
                    </Suspense>
                </div>

                <Suspense fallback={<div>Loading news...</div>}>
                    <NewsSection categoryData={categoryData} />
                </Suspense>

                <div className="mx-auto lg:w-[50%] w-[90%]">
                    <Suspense fallback={<div>Loading ad...</div>}>
                        <Ad name="Data-cloud" />
                    </Suspense>
                </div>

                <div className="w-full py-10 px-5 mx-auto items-center bg-[#F3F2F6]">
                    <Suspense fallback={<div>Loading categories...</div>}>
                        <TwoCategoryData categoriesWithHeadings={categoriesWithHeadings2} />
                    </Suspense>
                </div>
                <div className="mx-auto lg:w-[50%] w-full">
                    <Suspense fallback={<div>Loading ad...</div>}>
                        <Ad name="Data-cloud" />
                    </Suspense>
                </div>
            </div>
        </>
    );
};

export default HomePage;
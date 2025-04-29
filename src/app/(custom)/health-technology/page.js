'use client'
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import Head from "next/head";
import { fetchCategories } from "../../../redux/slices/categoriesSlice";
import { fetchCustomAds } from "../../../redux/slices/customAdsSlice";
import HeaderAdjust from "../../(main)/components/HeaderAdjust";
import Slider from "../../(custom)/components/Slider";
import TwoCategoryData from "../../(main)/components/TwoCategoryData";
import NewsSection from "../../(main)/components/NewsSection";
import Footer from "../../(main)/components/Footer";
import health from "../../../../public/assets/Health-Technology-Logo.png";
import Ad from "../../(main)/components/Ad";
import CommunityNavbar from "../../(custom)/components/CommunityNavbar";

const Health = () => {
    const dispatch = useDispatch();
    const categories = useSelector((state) => state.categories.categories);
    const Health = categories.find(
        (category) => category.attributes.name === "Health Technology"
    );

    useEffect(() => {
        dispatch(fetchCategories());
        dispatch(fetchCustomAds());
    }, [dispatch]);

    // Rest of the component remains the same as in React version
    const categoriesWithHeadings1 = [
        { name: "CXO Speak", heading: "CXO SPEAK" },
        { name: "Pharma", heading: "PHARMA" },
    ];

    const categoryData = [
        { name: "Healthcare IT News", title: "HEALTHCARE IT NEWS" },
        { name: "Health Webinars", title: "EVENTS" },
        { name: "Medical Technology", title: "MEDICAL" },
        { name: "Feature", title: "FEATURE" },
    ];

    const names = [
        "Healthcare IT News",
        "Health Webinars",
        "Medical Technology",
        "Feature",
    ];

    const healthLinks = [
        { name: "Home", path: "/" },
        { name: "Trending News", path: "/Trending-News" },
        {
            name: "Podcast",
            subLinks: [
                { name: "Health CXO TALK", path: "/Health-CXO-Talk" },
            ],
        },
        { name: "Interviews", path: "/interviews" },
    ];

    return (
        <div className="flex flex-col w-full">
            <Head>
                <title>Latest Healthcare Technology Video News</title>
                <meta name="description" content="Health technology news and updates" />
            </Head>

            <HeaderAdjust logo={health}>
            </HeaderAdjust> {/* Updated logo path */}

            <div>
                <CommunityNavbar links={healthLinks} />
            </div>

            <Slider category="Health Technology" names={names} />

            <div className="w-full py-10 px-4 mx-auto items-center bg-[#F3F2F6]">
                <TwoCategoryData
                    active={true}
                    categoriesWithHeadings={categoriesWithHeadings1}
                />
            </div>

            <div>
                <NewsSection categoryData={categoryData} />
            </div>

            <div className="mx-auto lg:w-[50%] w-full py-6">
                <Ad name="Data-cloud" />
            </div>

            <div>
                <Footer />
            </div>
        </div>
    );
};

export default Health;
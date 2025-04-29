'use client';

import React, { useEffect, useState, useRef } from "react";
import { useParams, usePathname } from "next/navigation";
import { useSelector, useDispatch } from "react-redux";
import Image from "next/image";
import Link from "next/link";
import { fetchSingleNewsByTitle } from "@/redux/slices/singleNewsSlice";
import { fetchSpecificCategorySlice } from "@/redux/slices/specificCategorySlice";
import { fetchLatestNews } from "@/redux/slices/latestNews";
import { fetchCategories } from "@/redux/slices/categoriesSlice";
import ReactMarkdown from "react-markdown";
import ReactPlayer from "react-player";
import rehypeRaw from "rehype-raw";
import { BsTagFill } from "react-icons/bs";
import { FaFacebook, FaLinkedin } from "react-icons/fa";
import { FaXTwitter } from "react-icons/fa6";
import { GrMail } from "react-icons/gr";

// Components
import CategoryNews from "../components/CategoryNews";
import Ad from "./Ad";
import NavigationMenu from "./NavigationMenu";
import Error from "./Error";
import FollowBar from "./FollowBar";


// Utils & Assets
import timeAgo from "@/utils/dateConverter";
// import logo from "../../../public/assets/cxotv-header-logo.jpg";
// import bsfi from "../../../public/assets/BFSI-Fintech-logo.png";
// import health from "../../../public/assets/Health-Technology-Logo.png";
// import education from "../../../public/assets/Education-Technology-logo.png";

const SingleNews = () => {
    const pathname = usePathname();
    const segments = pathname.split("/");
    const nameBeforeId = segments[segments.length - 2];
    const dispatch = useDispatch();
    const params = useParams();
    const title = params.title;

    const isFirstParagraphRef = useRef(true);

    const { singleNewsItem, isLoading, isError } = useSelector(
        (state) => state.singleNews
    );

    const { data: latestNewsData } = useSelector((state) => state.latestNews);
    const { data: newsData } = useSelector((state) => state.specificCategoryNews);
    const categories = useSelector((state) => state.categories.categories);
    const BFSI = categories.find(
        (category) => category.attributes.name === "BFSI"
    );

    const Education = categories.find(
        (category) => category.attributes.name === "Education Technology"
    );

    const Health = categories.find(
        (category) => category.attributes.name === "Health Technology"
    );

    const getSubcategoryNames = (categoryName, categories) => {
        const category = categories.find(
            (category) => category.attributes.name === categoryName
        );

        if (
            category &&
            category.attributes &&
            category.attributes.subcategories &&
            category.attributes.subcategories.data
        ) {
            const subcategories = category.attributes.subcategories.data;

            // Extract subcategory names
            const subcategoryNames = subcategories.map(
                (subcategory) => subcategory.attributes.name
            );

            // Add additional subcategories based on category
            if (categoryName === "BFSI") {
                subcategoryNames.push("BFSI"); // Add the additional BFSI subcategory
            } else if (categoryName === "Health Technology") {
                subcategoryNames.push("Health Technology"); // Add the additional Health subcategory
            } else if (categoryName === "Education Technology") {
                subcategoryNames.push("Education Technology"); // Add the additional Education subcategory
            }

            return subcategoryNames;
        } else {
            return [];
        }
    };

    const bsfiSubcategoryNames = getSubcategoryNames("BFSI", categories);

    const healthSubcategoryNames = getSubcategoryNames(
        "Health Technology",
        categories
    );
    const educationSubcategoryNames = getSubcategoryNames(
        "Education Technology",
        categories
    );

    const formattedCategoryName = nameBeforeId.replace(/-/g, " ");

    const belongsToBSFI = bsfiSubcategoryNames.includes(formattedCategoryName);
    const belongsToHealth = healthSubcategoryNames.includes(
        formattedCategoryName
    );
    const belongsToEducation = educationSubcategoryNames.includes(
        formattedCategoryName
    );

    useEffect(() => {
        if (nameBeforeId) {
            dispatch(
                fetchSpecificCategorySlice({
                    nameParam: nameBeforeId.split("-").join(" "),
                })
            );
        }
    }, [dispatch, nameBeforeId]);

    useEffect(() => {
        if (title) {
            const encodedTitle = encodeURIComponent(title);
            dispatch(fetchSingleNewsByTitle({ title: encodedTitle }));
        }
        const formattedTitle = title
            .split("-")
            .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
            .join(" ");
        dispatch(fetchCategories());
        dispatch(fetchLatestNews());
    }, [dispatch, title]);

    // Check if newsData is an array before using slice
    const slicedNewsData = Array.isArray(newsData) ? newsData.slice() : [];

    if (isError) {
        return <Error />;
    }

    if (isLoading) {
        return (
            <div className="grid min-h-[calc(100vh-3.5rem)] place-items-center">
                <div className="spinner"></div>
            </div>
        );
    }

    if (!singleNewsItem) {
        return (
            <div className="grid min-h-[calc(100vh-3.5rem)] place-items-center">
                <div className="spinner"></div>
            </div>
        );
    }

    if (!singleNewsItem || !singleNewsItem[0] || !singleNewsItem[0].attributes) {
        // Check for undefined or null values before accessing properties
        return <Error />;
    }

    const data = singleNewsItem[0].attributes;

    const videoUrlRegex =
        /https:\/\/(?:www\.youtube\.com\/embed\/|youtu\.be\/)([A-Za-z0-9_-]+)/;
    const matches = data?.content?.match(videoUrlRegex);
    const videoId = matches && matches[1];

    // Construct the complete YouTube video URL
    const videoUrl = videoId ? `https://www.youtube.com/watch?v=${videoId}` : "";

    let isFirstParagraph = true;
    const shuffledNewsData = [...latestNewsData].sort(() => Math.random() - 0.5);
    const itemsToDisplay = shuffledNewsData.slice(0, 9);

    // Function to limit the length of content
    const limitContentLength = (content, maxLength) => {
        if (content?.length > maxLength) {
            return content.substring(0, maxLength) + "...";
        }
        return content;
    };

    const handleShareOnFacebook = () => {
        const facebookShareUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(
            window.location.href
        )}`;
        window.open(facebookShareUrl, "_blank");
    };

    const handleShareOnTwitter = () => {
        const content = limitContentLength(data.content || "Default Content", 280); // Twitter character limit
        const twitterShareUrl = `https://twitter.com/intent/tweet?url=${encodeURIComponent(
            window.location.href
        )}&text=${encodeURIComponent(content)}`;
        window.open(twitterShareUrl, "_blank");
    };

    const handleShareOnLinkedIn = () => {
        const linkedInShareUrl = `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(
            window.location.href
        )}`;
        window.open(linkedInShareUrl, "_blank");
    };

    const handleShareViaEmail = () => {
        const subject = encodeURIComponent(data.title || "Default Title");
        const body = encodeURIComponent(
            `Check out this link: ${window.location.href}\n\n${limitContentLength(
                data.content || "Default Content",
                100
            )}`
        ); // Adjust the length as needed
        window.location.href = `mailto:?subject=${subject}&body=${body}`;
    };

    return (
        <>
            <h1 className="sr-only">
                Latest Technology News - CXOTV Today & Tech Updates
            </h1>
            <h2 className="sr-only">Latest Technology News & Trends</h2>

            <div className="lg:flex flex-col mx-auto w-full">
                {/* Next.js Head component is replaced by metadata in layout.js */}

                <div>
                    {(() => {
                        if (belongsToBSFI) {
                            return;
                        } else if (belongsToHealth) {
                            return;
                        } else if (belongsToEducation) {
                            return;
                        } else {
                            return;
                        }
                    })()}

                    <div>
                        {(() => {
                            if (belongsToBSFI || belongsToHealth || belongsToEducation) {
                                return (
                                    <div>
                                        <NavigationMenu
                                            category={
                                                belongsToBSFI
                                                    ? BFSI
                                                    : belongsToHealth
                                                        ? Health
                                                        : Education
                                            }
                                            subcategories={
                                                belongsToBSFI
                                                    ? BFSI?.attributes?.subcategories
                                                    : belongsToHealth
                                                        ? Health?.attributes?.subcategories
                                                        : Education?.attributes?.subcategories
                                            }
                                        />
                                    </div>
                                );
                            } else {
                                return;
                            }
                        })()}
                    </div>
                </div>
                <div className="mx-auto lg:w-[50%] w-[90%] mt-5">
                    <Ad name="bfsi-event" />
                </div>

                <div className="lg:flex gap-10 lg:px-10 px-5 w-full lg:py-10 py-5">
                    <div className="lg:w-[70%] w-full">
                        <h1 className=" py-4 font-fira italic uppercase text-[20px]">
                            {data.title}
                        </h1>

                        <div>
                            {data.videoUrl ? (
                                <div className="lg:h-[30rem] h-48 w-full py-5">
                                    <ReactPlayer
                                        url={data.videoUrl}
                                        controls
                                        width="100%"
                                        height="100%"
                                    />
                                </div>
                            ) : videoUrl ? (
                                <div className="lg:h-[30rem] h-56 w-full py-5">
                                    <ReactPlayer
                                        url={`https://www.youtube.com/watch?v=${videoId}`}
                                        controls
                                        width="100%"
                                        height="100%"
                                    />
                                </div>
                            ) : data.image &&
                                data.image.data &&
                                data.image.data.attributes.url ? (
                                <div className="relative w-full lg:h-[30rem] h-56">
                                    <Image
                                        src={
                                            process.env.NEXT_PUBLIC_UPLOAD_URL +
                                            data.image.data.attributes.url
                                        }
                                        alt={data.title || "News image"}
                                        fill
                                        className="object-cover"
                                        priority
                                    />
                                </div>
                            ) : null}
                        </div>

                        <div className="lg:flex items-center gap-4 py-2 font-normal w-full text-[13px] text-gray-400">
                            <div className="flex gap-4 items-center justify-center lg:w-[40%]">
                                <p>{data.authName} </p>
                                <div className="h-[2px] w-3 bg-gray-400"></div>
                                <p className="py-4 text-[13px]">
                                    {data.Date ? timeAgo(data.Date) : timeAgo(data.publishedAt)}
                                </p>
                            </div>

                            <div className="lg:flex lg:gap-4 gap-2 items-center justify-center lg:w-[60%]">
                                <div className="flex gap-4 justify-center">
                                    <div
                                        className="flex w-fit h-10 items-center gap-2 bg-blue-400 py-2 px-4 font-share rounded-md text-white cursor-pointer"
                                        onClick={handleShareOnFacebook}
                                    >
                                        Share on{" "}
                                        <div className="text-xl">
                                            <FaFacebook />
                                        </div>
                                    </div>
                                    <div
                                        className="flex items-center w-fit h-10 gap-2 bg-blue-600 py-1 px-4 font-share rounded-md text-white cursor-pointer"
                                        onClick={handleShareOnTwitter}
                                    >
                                        Share on{" "}
                                        <div className="text-xl">
                                            <FaXTwitter />
                                        </div>
                                    </div>
                                </div>

                                <div className="flex gap-4 justify-center py-2">
                                    <div
                                        className="flex items-center w-fit h-10 gap-2 bg-blue-600 py-2 px-4 font-share rounded-md text-white cursor-pointer"
                                        onClick={handleShareOnLinkedIn}
                                    >
                                        Share on{" "}
                                        <div className="text-xl">
                                            <FaLinkedin />
                                        </div>
                                    </div>
                                    <div
                                        className="flex items-center w-fit h-10 gap-2 bg-orange-500 py-2 px-4 font-share rounded-md text-white cursor-pointer"
                                        onClick={handleShareViaEmail}
                                    >
                                        Share via{" "}
                                        <div className="text-xl">
                                            <GrMail />
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <ReactMarkdown
                            rehypePlugins={[rehypeRaw]}
                            components={{
                                a: ({ node, ...props }) => {
                                    if (props.href.startsWith("https://www.youtube.com/")) {
                                        // Render ReactPlayer for YouTube links
                                        return (
                                            <div className="lg:h-[30rem] h-48 w-full py-5">
                                                <ReactPlayer
                                                    url={props.href}
                                                    controls
                                                    width="100%"
                                                    height="100%"
                                                />
                                            </div>
                                        );
                                    } else {
                                        // Render standard anchor link for other URLs
                                        return (
                                            <a
                                                className="underline text-blue-800 font-bold mb-6 px-[3px]"
                                                href={props.href}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                            >
                                                {props.children}
                                            </a>
                                        );
                                    }
                                },

                                p: ({ node, ...props }) => {
                                    if (isFirstParagraphRef.current) {
                                        isFirstParagraphRef.current = false;
                                        const firstChild = props.children[0];

                                        if (
                                            typeof firstChild === "string" &&
                                            firstChild.length > 0
                                        ) {
                                            const firstLetter = firstChild.charAt(0);
                                            const remainingContent = firstChild.slice(1);

                                            return (
                                                <div>
                                                    <p className="text-7xl font-noto mr-3 float-left">
                                                        {firstLetter}
                                                    </p>
                                                    <p className="font-[16px] mb-4 font-noto">
                                                        {remainingContent}
                                                    </p>
                                                </div>
                                            );
                                        }
                                    }

                                    return (
                                        <p className="font-[16px] mb-6 font-noto">
                                            {props.children}
                                        </p>
                                    );
                                },

                                h1: ({ node, ...props }) => (
                                    <h1 className="text-3xl mb-4 font-bold">{props.children}</h1>
                                ),
                                h2: ({ node, ...props }) => (
                                    <h2 className="text-2xl mb-3 font-semibold">
                                        {props.children}
                                    </h2>
                                ),
                                h3: ({ node, ...props }) => (
                                    <h3 className="text-xl mb-2 font-medium">{props.children}</h3>
                                ),
                                h4: ({ node, ...props }) => (
                                    <h4 className="text-lg mb-2 font-normal">{props.children}</h4>
                                ),
                                em: ({ node, ...props }) => <em>{props.children}</em>,
                                strong: ({ node, ...props }) => (
                                    <strong>{props.children}</strong>
                                ),
                                text: ({ node, ...props }) => {
                                    // Handle bold text using double asterisks
                                    const parts = props.node.value.split("**");
                                    return parts.map((part, index) =>
                                        index % 2 === 0 ? part : <strong key={index}>{part}</strong>
                                    );
                                },
                                br: ({ node, ...props }) => <br />,
                                u: ({ node, ...props }) => <u>{props.children}</u>,
                                ul: ({ node, ...props }) => (
                                    <ul className="list-disc ml-6">{props.children}</ul>
                                ),
                                ol: ({ node, ...props }) => (
                                    <ol className="list-decimal ml-6">{props.children}</ol>
                                ),
                                li: ({ node, ...props }) => <li>{props.children}</li>,
                                del: ({ node, ...props }) => <del>{props.children}</del>,
                                code: ({ node, ...props }) => (
                                    <pre className="bg-gray-200 p-2">{props.children}</pre>
                                ),
                            }}
                        >
                            {data.content}
                        </ReactMarkdown>

                        {videoUrl && (
                            <div className="lg:h-[30rem] h-56 w-full py-5">
                                <ReactPlayer
                                    url={`https://www.youtube.com/watch?v=${videoId}`}
                                    controls
                                    width="100%"
                                    height="100%"
                                />
                            </div>
                        )}

                        {/* Follow Us  */}
                        <div>
                            <FollowBar />
                        </div>

                        <div className="flex flex-col gap-3 mt-10">
                            <div className="text-[30px] font-share italic">
                                YOU MIGHT ALSO LIKE
                            </div>
                            <div className="lg:grid lg:grid-cols-3 lg:gap-4">
                                {itemsToDisplay.map((item) => (
                                    <div key={item.id} className="mb-4">
                                        <Link
                                            href={`/${item.attributes.subcategories &&
                                                item.attributes.subcategories.data.length > 0
                                                ? `${item.attributes.subcategories.data[0].attributes.name
                                                    .split(" ")
                                                    .join("-")}/${item.attributes.slug}`
                                                : item.attributes.categories &&
                                                    item.attributes.categories.data.length > 0
                                                    ? `${item.attributes.categories.data[0].attributes.name
                                                        .split(" ")
                                                        .join("-")}/${item.attributes.slug}`
                                                    : ""
                                                }`}
                                            className="cursor-pointer"
                                        >
                                            <div className="bg-white shadow-md lg:h-80 overflow-y-hidden p-4 rounded-md">
                                                <div className="relative h-48 w-full mb-3 rounded-md">
                                                    <Image
                                                        src={
                                                            item.attributes.image.data.attributes.formats?.small
                                                                ?.url
                                                                ? process.env.NEXT_PUBLIC_UPLOAD_URL +
                                                                item.attributes.image.data.attributes.formats
                                                                    .small.url
                                                                : process.env.NEXT_PUBLIC_UPLOAD_URL +
                                                                item.attributes.image.data.attributes.url
                                                        }
                                                        alt={item.attributes.title || "News thumbnail"}
                                                        fill
                                                        className="object-cover rounded-md"
                                                        loading="lazy"
                                                    />
                                                </div>
                                                <div className="text-sm font-semibold pb-2">
                                                    {item.attributes.title}
                                                </div>
                                            </div>
                                        </Link>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                    <div className="lg:w-[30%] w-full mb-3">
                        <CategoryNews
                            newsData={slicedNewsData}
                            nameBeforeId={nameBeforeId}
                        />
                    </div>
                </div>

                <div className="mx-auto lg:w-[50%] w-full">
                    <Ad name="Data-cloud" />
                </div>
            </div>
        </>
    );
};

export default SingleNews;

"use client"

import { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import Link from "next/link";
import Image from "next/image";
import { fetchSearchResults } from "../../../redux/slices/searchSlice";
import LatestNews from "../components/LatestNews";
import timeAgo from "../../../utils/dateConverter";


const SearchNews = () => {
    const [currentPage, setCurrentPage] = useState(1);
    const [scrollPosition, setScrollPosition] = useState(0);
    const [maxScroll, setMaxScroll] = useState(0);
    const [isLargeScreen, setIsLargeScreen] = useState(false);
    const [searchTerm, setSearchTerm] = useState("");
    const dispatch = useDispatch();

    const searchData = useSelector((state) => state.search.searchResults);
    const status = useSelector((state) => state.search.status);

    const itemsPerPage = 30;
    const maxCharacters = 105;
    const translateValue = -((scrollPosition / maxScroll) * (maxScroll / 1.7));

    useEffect(() => {
        // Set initial search term after mount
        setSearchTerm(sessionStorage.getItem("searchTerm") || "");
        // Set initial screen size
        setIsLargeScreen(window.innerWidth >= 1024);

        const handleResize = () => {
            setIsLargeScreen(window.innerWidth >= 1024);
        };

        window.addEventListener("resize", handleResize);
        return () => window.removeEventListener("resize", handleResize);
    }, []);

    useEffect(() => {
        if (searchTerm) {
            dispatch(fetchSearchResults(searchTerm));
        }
    }, [dispatch, searchTerm]);

    useEffect(() => {
        const handleScroll = () => {
            const currentPosition = window.scrollY;
            setScrollPosition(currentPosition);

            const documentHeight = document.documentElement.scrollHeight;
            const windowHeight = window.innerHeight;
            const maxScroll = documentHeight - windowHeight;
            setMaxScroll(maxScroll);
        };

        if (isLargeScreen) {
            window.addEventListener("scroll", handleScroll);
        }

        return () => {
            if (isLargeScreen) {
                window.removeEventListener("scroll", handleScroll);
            }
        };
    }, [isLargeScreen]);

    // Pagination logic remains the same
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = currentPage * itemsPerPage;
    const currentPageData = searchData.slice(startIndex, endIndex);

    const handlePageClick = (pageNumber) => {
        setCurrentPage(pageNumber);
    };

    const totalPages = Math.ceil(searchData.length / itemsPerPage);
    const maxPagesToShow = 5;

    const getPageNumbers = () => {
        const pageNumbers = [];
        const startPage = Math.max(1, currentPage - Math.floor(maxPagesToShow / 2));
        const endPage = Math.min(totalPages, startPage + maxPagesToShow - 1);

        for (let i = startPage; i <= endPage; i++) {
            pageNumbers.push(i);
        }

        return pageNumbers;
    };

    const divStyles = isLargeScreen
        ? {
            width: "75%",
            height: "147rem",
            position: "relative",
            transform: `translateY(${translateValue}px)`,
        }
        : {
            width: "100%",
        };

    return (
        <>
            <div className="lg:flex gap-10 lg:px-10 px-5 w-full mt-10 h-full overflow-hidden shadow-md">
                <div className="lg:w-[75%] lg:relative" style={divStyles}>
                    <div className="lg:grid lg:grid-cols-3 gap-5">
                        {status === "loading" && <p>Loading...</p>}
                        {status === "failed" && (
                            <p>Error fetching data. Please try again later.</p>
                        )}
                        {searchData.length > 0
                            ? currentPageData.map((item, index) => (
                                <div key={index}>
                                    <Link
                                        href={`/Trending-News/${item.attributes.slug}`}
                                        passHlegacyBehavior
                                    >
                                        <span>
                                            <div className="w-full lg:h-[330px] h-48 relative rounded-md overflow-hidden">
                                                {item.attributes.image?.data?.attributes.url ? (
                                                    <div className="w-full lg:h-[330px] h-48 relative rounded-md overflow-hidden">
                                                        <div className="relative h-48 bg-white shadow-md lg:h-80 overflow-y-hidden p-2 rounded-md">
                                                            <Image
                                                                src={`${process.env.NEXT_PUBLIC_UPLOAD_URL
                                                                    }${item.attributes.image.data.attributes
                                                                        .formats?.small?.url ||
                                                                    item.attributes.image.data.attributes.url
                                                                    }`}
                                                                alt={item.attributes.title}
                                                                className="object-cover lg:h-48 h-30 w-full mb-3 rounded-md"
                                                                width={300}
                                                                height={200}
                                                                loading="lazy"
                                                            />
                                                            <div className="text-sm font-semibold pb-2">
                                                                <div className="">
                                                                    <p className="lg:h-[60px]">
                                                                        {item.attributes.title.length >
                                                                            maxCharacters
                                                                            ? `${item.attributes.title.substring(
                                                                                0,
                                                                                maxCharacters
                                                                            )}...`
                                                                            : item.attributes.title}
                                                                    </p>
                                                                    <div className="flex justify-between font-semibold items-center py-2">
                                                                        <p>{item.attributes.authName}</p>
                                                                        <p className="lg:py-1 lg:text-[13px] text-[12px]">
                                                                            {item.attributes.Date
                                                                                ? timeAgo(item.attributes.Date)
                                                                                : timeAgo(item.attributes.publishedAt)}
                                                                        </p>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                ) : (
                                                    <div className="w-full lg:h-[330px] h-48 relative rounded-md overflow-hidden bg-gray-200 ">
                                                        <div className="relative h-48 bg-white lg:h-80 overflow-y-hidden p-2 rounded-md border-gray-200 border-2">
                                                            <div className="flex items-center justify-center  lg:h-48 h-30 w-full">
                                                                <span className="text-gray-700 ">No image</span>
                                                            </div>

                                                            <div className="text-sm font-semibold pb-2">
                                                                <div className="">
                                                                    <p className="lg:h-[60px]">
                                                                        {item.attributes.title.length >
                                                                            maxCharacters
                                                                            ? `${item.attributes.title.substring(
                                                                                0,
                                                                                maxCharacters
                                                                            )}...`
                                                                            : item.attributes.title}
                                                                    </p>
                                                                    <div className="flex justify-between font-semibold items-center py-2">
                                                                        <p>{item.attributes.authName}</p>
                                                                        <p className="lg:py-1 lg:text-[13px] text-[12px]">
                                                                            {item.attributes.Date
                                                                                ? timeAgo(item.attributes.Date)
                                                                                : timeAgo(item.attributes.publishedAt)}
                                                                        </p>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                )}
                                            </div>
                                        </span>
                                    </Link>
                                </div>
                            ))
                            : status === "succeeded" && (
                                <div className="lg:col-span-3 text-center mt-10">
                                    <h2 className="text-2xl font-bold text-red-600 mb-4">
                                        {`No news found for "${searchTerm}".`}
                                    </h2>
                                    <p className="text-lg text-gray-700">
                                        {` We couldn't find any news articles matching your search
                                        term. Please try a different search term or check back
                                        later.`}
                                    </p>
                                </div>
                            )}
                    </div>

                    <div className="flex justify-center py-10">
                        {getPageNumbers().map((pageNumber) => (
                            <button
                                key={pageNumber}
                                className={`mx-2 px-3 py-1 rounded-full ${currentPage === pageNumber
                                    ? "bg-[#5C39F2] text-white"
                                    : "hover:bg-blue-200"
                                    }`}
                                onClick={() => handlePageClick(pageNumber)}
                            >
                                {pageNumber}
                            </button>
                        ))}
                    </div>
                </div>
                <div className="lg:w-[25%] w-full lg:h-[145rem] lg:overflow-y-scroll">
                    <LatestNews />
                </div>
            </div>
        </>
    );
};

export default SearchNews;
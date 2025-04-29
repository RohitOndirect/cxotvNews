'use client'

import React, { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import Skeleton from "react-loading-skeleton";
import 'react-loading-skeleton/dist/skeleton.css';
import { fetchNewsByName } from "../../../redux/slices/newsSlice";
import Link from 'next/link';
import Image from "next/image";

const REACT_APP_UPLOAD_URL = "https://apicxotv.techplusmedia.com";

const TwoCategoryData = ({ categoriesWithHeadings, active }) => {
    const dispatch = useDispatch();
    const { data, isLoading, isError } = useSelector((state) => state.news);

    useEffect(() => {
        // Fetch news data for each category/subcategory
        categoriesWithHeadings.forEach(categoryItem => {
            const categoryName = categoryItem.name;
            dispatch(fetchNewsByName({ nameParam: categoryName }));
        });
    }, [dispatch, categoriesWithHeadings]);

    if (isLoading) {
        return (
            <div className="lg:flex gap-5 lg:px-5 md:px-5 px-0 w-full">
                {categoriesWithHeadings.map(({ name }) => (
                    <div key={name} className="lg:flex flex-col gap-2 w-full">
                        <div className="text-[28px] font-semibold uppercase">
                            <Skeleton width={200} height={30} />
                        </div>
                        <div className="h-1 w-20 bg-[#4601FA]"></div>
                        <div className="lg:flex gap-5 py-6 w-full">
                            <Skeleton width="100%" height={200} />
                            <div className="lg:flex flex-col gap-1 w-full text-ellipsis overflow-hidden">
                                <Skeleton height={20} count={3} />
                            </div>
                        </div>
                        <div className="flex items-end justify-end">
                            <Skeleton width={100} height={30} />
                        </div>
                    </div>
                ))}
            </div>
        );
    }

    if (isError) {
        return <div>Error fetching news data.</div>;
    }

    return (
        <div className="lg:flex gap-5 lg:px-5 md:px-5 px-0 w-full">
            {categoriesWithHeadings.map(({ name, heading }) => {
                const categoryData = data[name];

                if (!categoryData || categoryData.length === 0) return null;

                const firstItem = categoryData[0];

                const categoryLink =
                    firstItem.category && firstItem.category.categoryName
                        ? `/${firstItem.category.categoryName.replace(/\s+/g, "-")}/${firstItem.attributes.title}`
                        : `/${name.replace(/\s+/g, "-")}/${firstItem.attributes.slug}`;

                const categoryLinkSeeMore =
                    firstItem.category && firstItem.category.categoryName
                        ? `/${firstItem.category.categoryName.replace(/\s+/g, "-")}`
                        : `/${name.replace(/\s+/g, "-")}`;

                return (
                    <div key={name} className="lg:flex flex-col gap-2 w-full">
                        <div className="text-[28px] font-semibold uppercase">{heading}</div>
                        <div className="h-1 w-20 bg-[#4601FA]"></div>
                        <div className="lg:flex gap-5 py-6 w-full">
                            <Link href={categoryLink} className="lg:w-[100%] relative">
                                <div className="relative w-full lg:h-44 h-48">
                                    <Image
                                        src={
                                            firstItem.attributes.image.data.attributes.formats?.medium?.url
                                                ? REACT_APP_UPLOAD_URL + firstItem.attributes.image.data.attributes.formats.medium.url
                                                : REACT_APP_UPLOAD_URL + firstItem.attributes.image.data.attributes.url
                                        }
                                        alt={firstItem.attributes.title}
                                        loading="lazy"
                                        fill={true}
                                        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                                        className="object-cover rounded-md"
                                    />
                                </div>
                            </Link>
                            <div className="lg:flex flex-col gap-1 w-full text-ellipsis overflow-hidden">
                                {!active && (
                                    <div className="flex flex-wrap items-center gap-2 lg:py-0 py-6 font-fira">
                                        {firstItem.attributes.categories?.data?.map(category => (
                                            <div key={category.id} className="font-semibold font-fira text-[12px] capitalize">
                                                <div className="text-white bg-[#5C39F2] hover:bg-[#2B0F4A] py-1 font-noto transition-all duration-200 font-normal px-4 rounded-md">
                                                    <a href={category.attributes.name.split(" ").join("-")} className="font-medium text-[13px] capitalize">
                                                        {category.attributes.name}
                                                    </a>
                                                </div>
                                            </div>
                                        ))}
                                        {firstItem.attributes.subcategories?.data?.map(subcategory => (
                                            <div key={subcategory.id} className="font-semibold font-fira text-[12px] capitalize">
                                                <div className="text-white bg-[#5C39F2] hover:bg-[#2B0F4A] py-1 font-noto transition-all duration-200 font-normal px-4 rounded-md">
                                                    <a href={subcategory.attributes.name.split(" ").join("-")} className="font-medium text-[13px] capitalize">
                                                        {subcategory.attributes.name}
                                                    </a>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                )}
                                <p className="text-lg lg:pt-0 pt-2 font-semibold text-[16px] text-[#4601FA] hover:text-black transition-all duration-200">
                                    {firstItem.attributes.title}
                                </p>
                                {active && <div className=""></div>}
                            </div>
                        </div>
                        <div className="flex items-end justify-end">
                            <a href={categoryLinkSeeMore} className="border border-blue-800 lg:px-6 px-3 py-1 text-blue-800 font-bold">
                                See More
                            </a>
                        </div>
                    </div>
                );
            })}
        </div>
    );
};

export default TwoCategoryData;
import React, { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import Skeleton from "react-loading-skeleton";
import 'react-loading-skeleton/dist/skeleton.css';
import { fetchNewsByName } from "../../../redux/slices/newsSlice";
import { fetchLatestNews } from "../../../redux/slices/latestNews";
import Link from "next/link";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/navigation";
import { Autoplay, Navigation } from "swiper/modules";
import "../globals.css";
import { FiTrendingUp } from "react-icons/fi";
import banner from "../../../../public/assets/k-singhal-sm-banner.jpg"
import Image from "next/image";


const REACT_APP_UPLOAD_URL = "https://apicxotv.techplusmedia.com"

const HomeSlider = ({ category, names }) => {
    const dispatch = useDispatch();
    const { data, status, isError } = useSelector((state) => state.news);
    const { sectionNews, status: sectionStatus } = useSelector((state) => state.SectionNews);

    const filteredSectionNews = sectionNews.filter((news) =>
        names.includes(news.name)
    );

    useEffect(() => {
        dispatch(fetchLatestNews());
    }, [dispatch]);

    useEffect(() => {
        if (category) {
            dispatch(fetchNewsByName({ nameParam: category }));
        }
    }, [dispatch, category]);

    if (isError) {
        return <div>Error fetching news data.</div>;
    }

    const categoryData = data[category];

    if (!categoryData || categoryData.length === 0) {
        return <div>Loading....</div>;
    }

    const firstFourItems = categoryData.slice(0, 5);
    const maxCharacters = 100;

    return (
        <>
            <div className="lg:flex lg:gap-2 px-4 mx-auto w-full py-3 font-fira mb-10">
                {/* section 1 */}
                <div className="lg:w-[55%] w-full flex-grow lg:h-[396px] h-54">
                    <p className="font-bold flex items-center lg:text-1xl">
                        <FiTrendingUp
                            size={25}
                            className=" mr-2 text-sm font-semibold text-center mb-2"
                        />
                        Trending Now
                    </p>
                    <Link
                        href={`/${category.split(" ").join("-")}/${firstFourItems[0].attributes.slug}`}
                        className="lg:flex flex-col h-full"
                    >
                        {status === "loading" ? (
                            <Skeleton height={396} />
                        ) : (
                            <Swiper
                                spaceBetween={0}
                                centeredSlides={true}
                                autoplay={{
                                    delay: 2500,
                                    disableOnInteraction: false,
                                }}
                                navigation={true}
                                modules={[Autoplay, Navigation]}
                                className="mySwiper relative z-0"
                            >
                                {firstFourItems.map((ele) => (
                                    <SwiperSlide key={ele.id}>
                                        <div className="relative w-full h-full border-8 border-slate-100">
                                            <Link href={`/${category.split(" ").join("-")}/${ele.attributes.slug}`}>
                                                <Image
                                                    src={
                                                        ele.attributes.image.data.attributes.formats
                                                            ?.medium?.url
                                                            ? REACT_APP_UPLOAD_URL +
                                                            ele.attributes.image.data.attributes.formats
                                                                .medium.url
                                                            : REACT_APP_UPLOAD_URL +
                                                            ele.attributes.image.data.attributes.url
                                                    }
                                                    alt={ele.attributes.image.data.attributes.url}
                                                    loading="lazy"
                                                    fill
                                                    className="object-cover h-full w-full"
                                                />
                                            </Link>
                                            <div className="absolute bottom-0 left-0 right-0 lg:text-[20px] text-sm bg-black opacity-70 text-white text-center px-2">
                                                {ele.attributes.title.length > 130
                                                    ? `${ele.attributes.title.substring(0, 130)}...`
                                                    : ele.attributes.title}
                                            </div>
                                        </div>
                                    </SwiperSlide>
                                ))}
                            </Swiper>
                        )}
                    </Link>
                </div>

                {/* section 2 */}
                <div className="lg:w-[45%] w-full flex-grow lg:h-[400px] h-54">
                    <div className="w-full h-full grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 gap-4">
                        {sectionStatus === "loading"
                            ? Array(4).fill().map((_, index) => (
                                <div key={index} className="relative border-8 border-slate-100 shadow-md h-full">
                                    <Skeleton height={160} className="w-full" />
                                    <div className="absolute bottom-0 left-0 right-0 bg-black opacity-70 text-white text-center">
                                        <Skeleton width="80%" height={20} className="mx-auto my-2" />
                                    </div>
                                </div>
                            ))
                            : (
                                <>
                                    {filteredSectionNews.map((item, index) => {
                                        if (item.news) {
                                            const truncatedTitle =
                                                item.news.attributes.title.length > maxCharacters
                                                    ? `${item.news.attributes.title.substring(0, maxCharacters)}...`
                                                    : item.news.attributes.title;

                                            return (
                                                <div key={index} className="w-full flex flex-col justify-between h-full">
                                                    <h6 className="text-sm font-semibold text-center mb-2">{names[index]}</h6>
                                                    <Link href={`/${names[index].replace(/\s+/g, "-")}/${item.news.attributes.slug}`}>
                                                        <div className="relative border-8 border-slate-100 shadow-md h-full">
                                                            <Image
                                                                src={
                                                                    item.news.attributes.image.data.attributes.formats
                                                                        ?.small?.url
                                                                        ? REACT_APP_UPLOAD_URL +
                                                                        item.news.attributes.image.data.attributes.formats
                                                                            .small.url
                                                                        : REACT_APP_UPLOAD_URL +
                                                                        item.news.attributes.image.data.attributes.url
                                                                }
                                                                alt={item.news.attributes.title}
                                                                loading="lazy"
                                                                width={200}
                                                                height={200}
                                                                className="object-cover lg:h-40 h-36 w-full"
                                                            />
                                                            <div className="absolute bottom-0 left-0 right-0 bg-black opacity-70 text-white text-center">
                                                                <div className="p-2 text-[13px]">{truncatedTitle}</div>
                                                            </div>
                                                        </div>
                                                    </Link>
                                                </div>
                                            );
                                        }
                                        return null;
                                    })}

                                    {/* Hardcoded Card */}
                                    <div className="w-full flex flex-col justify-between h-full">
                                        <h6 className="text-sm font-semibold text-center mb-2">Talks with Kalpana</h6>
                                        <Link href="/talks-with-kalpana">
                                            <div className="relative border-8 border-slate-100 shadow-md h-full">
                                                <Image
                                                    src={banner} // Adjust the path to your image
                                                    alt="Hardcoded News"
                                                    loading="lazy"
                                                    className="object-cover lg:h-40 h-36 w-full"
                                                />
                                                {/* <div className="absolute bottom-0 left-0 right-0 bg-black opacity-70 text-white text-center">
                  <div className="p-2 text-[13px]">This is a hardcoded news title</div>
                </div> */}
                                            </div>
                                        </Link>
                                    </div>
                                </>
                            )}
                    </div>
                </div>

            </div>
        </>
    );
};

export default HomeSlider;
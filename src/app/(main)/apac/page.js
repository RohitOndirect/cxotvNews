import Ad from "../components/Ad";
import TwoCategoryData from "../components/TwoCategoryData";
import NewsCards from "../components/NewsCards.js";


export async function generateMetadata() {
    const defaultMetadata = {
        title: "APAC Technology News & Insights - CXOTV Today",
        description: "Latest technology updates and executive insights from the Asia-Pacific region",
        keywords: "APAC tech news, Asia-Pacific CXO insights, technology trends APAC, digital transformation Asia",
    };

    try {
        const response = await fetch(
            "https://apicxotv.techplusmedia.com/api/categories?filters[name][$eq]=APAC&populate=*"
        );
        const data = await response.json();
        const category = data.data[0]?.attributes;

        if (!category) return defaultMetadata;

        // Get image URL if available
        const imageUrl = category.image?.data?.attributes?.url
            ? `https://apicxotv.techplusmedia.com${category.image.data.attributes.url}`
            : null;

        return {
            title: category.metaTitle || defaultMetadata.title,
            description: category.metaDescription || defaultMetadata.description,
            keywords: category.keywords?.join(", ") || defaultMetadata.keywords,
            openGraph: {
                title: category.metaTitle || defaultMetadata.title,
                description: category.metaDescription || defaultMetadata.description,
                type: "website",
                url: "https://cxotv.techplusmedia.com/apac",
                images: imageUrl
                    ? [
                        {
                            url: imageUrl,
                            width: 1200,
                            height: 630,
                            alt: category.name || "APAC Technology News",
                        }
                    ]
                    : [],
            },
            twitter: {
                card: "summary_large_image",
                title: category.metaTitle || defaultMetadata.title,
                description: category.metaDescription || defaultMetadata.description,
                images: imageUrl ? [imageUrl] : [],
            },
        };
    } catch (error) {
        return defaultMetadata;
    }
}

const Apac = () => {
    const categoriesWithHeadings1 = [
        { name: "APAC Talks with Kalpana", heading: "Talks with Kalpana" },
        { name: "APAC Marketing Monday", heading: "Marketing Monday" },
    ];

    const podcasts = [
        { id: 1, name: "APAC Marketing Monday" },
        { id: 2, name: "APAC CIO Talk" },
        { id: 3, name: "APAC CEO Talk" },
        { id: 4, name: "APAC CXO Talk" },
        { id: 5, name: "APAC INTERVIEWS" },
    ];

    return (
        <div className="flex flex-col gap-3 mx-auto w-full">


            <div className="mx-auto lg:w-[50%] w-[90%]">
                <Ad name="tech-summit-2023" />
            </div>

            <div className="w-full py-10 px-4 mx-auto items-center bg-[#F3F2F6]">
                <TwoCategoryData
                    active={true}
                    categoriesWithHeadings={categoriesWithHeadings1}
                />
            </div>

            <div>
                <NewsCards categoryName="APAC" categoryTitle="Trending News" />
            </div>

            <div className="mx-auto lg:w-[50%] w-[90%]">
                <Ad name="Data-cloud" />
            </div>
        </div>
    );
};

export default Apac;
import CategoryData from '../../components/CategoryData';

export async function generateMetadata({ params }) {
    const { categoryName } = params;
    const formattedCategory = categoryName.split("-").join(" ");

    // Fetch category data from API
    const response = await fetch(
        `https://apicxotv.techplusmedia.com/api/categories?filters[name][$eq]=${encodeURIComponent(
            formattedCategory
        )}&populate=*`
    );

    const categoryData = await response.json();
    const category = categoryData.data[0]?.attributes;

    // Default metadata
    const defaultMetadata = {
        title: `Latest ${formattedCategory} News - CXOTV Today`,
        description: `Stay updated with the latest ${formattedCategory} news and insights from industry leaders`,
        keywords: `${formattedCategory}, technology news, CXO insights, industry updates`,
    };

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
            url: `https://cxotv.techplusmedia.com/${categoryName}`,
            images: imageUrl
                ? [
                    {
                        url: imageUrl,
                        width: 1200,
                        height: 630,
                        alt: category.name,
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
}

export default function CategoryPage({ params }) {
    return <CategoryData categoryName={params.categoryName} />;
}
"use client";

import { useSelector } from "react-redux";
import Image from "next/image";
import Link from "next/link";
import { memo } from "react";

const REACT_APP_UPLOAD_URL = "https://apicxotv.techplusmedia.com";

const Ad = memo(({ name }) => {
    const { AdData } = useSelector((state) => state.customAds);

    // Check if AdData exists
    if (!AdData || !Array.isArray(AdData)) {
        console.error("AdData is not available or not an array");
        return null;
    }

    const adItem = AdData.find((item) => item?.attributes?.name === name);

    if (!adItem) {
        console.log(`No ad found with name: ${name}`);
        return null;
    }

    // Safely access nested properties
    const imageData = adItem.attributes?.image?.data?.attributes;

    if (!imageData) {
        console.error("Image data not found for ad:", name);
        return null;
    }

    const imageUrl = imageData.formats?.medium?.url
        ? `${REACT_APP_UPLOAD_URL}${imageData.formats.medium.url}`
        : `${REACT_APP_UPLOAD_URL}${imageData.url}`;

    return (
        <div className="relative w-full">
            <Link
                href={adItem.attributes.url || "#"}
                target="_blank"
                rel="noopener noreferrer"
            >
                <div className="relative w-full h-auto aspect-[8/1]">
                    <Image
                        src={imageUrl}
                        alt={adItem.attributes.name || "Advertisement"}
                        sizes="100vw"
                        height={300}
                        width={300}
                        className="w-full h-auto object-contain"
                        priority={true}
                        onError={(e) => {
                            console.error("Image failed to load:", imageUrl);
                            e.currentTarget.style.display = "none";
                        }}
                    />
                </div>
            </Link>
        </div>
    );
});

Ad.displayName = 'Ad';

export default Ad;
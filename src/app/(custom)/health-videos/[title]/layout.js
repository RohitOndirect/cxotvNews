"use client"
import { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import HeaderAdjust from "@/app/(main)/components/HeaderAdjust";
import NavigationMenu from "@/app/(main)/components/NavigationMenu";
import healthLogo from "../../../../../public/assets//Health-Technology-Logo.png";
import { fetchCategories } from "../../../../redux/slices/categoriesSlice";
import Footer from "@/app/(main)/components/Footer";

// app/[category]/[title]/layout.js
export default function NewsLayout({ children }) {
    const dispatch = useDispatch();

    // Get categories from Redux store
    const categories = useSelector((state) => state.categories.categories);
    const Health = categories.find(
        (category) => category.attributes.name === "Health Technology"
    );

    useEffect(() => {
        // Fetch categories when component mounts
        dispatch(fetchCategories());
    }, [dispatch]);

    return (
        <section>
            <HeaderAdjust logo={healthLogo} />
            {Health && Health.attributes && Health.attributes.subcategories && (
                <NavigationMenu
                    category={Health}
                    subcategories={Health.attributes.subcategories}
                />
            )}
            {children}

            <Footer />
        </section>
    );
}
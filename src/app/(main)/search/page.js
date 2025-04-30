"use client"

import { useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import SearchNews from '../components/SearchNews';

export default function DefaultSearchPage() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const [searchTerm, setSearchTerm] = useState('');

    useEffect(() => {
        // Check for search term in session storage
        const storedSearchTerm = sessionStorage.getItem("searchTerm");

        if (storedSearchTerm) {
            // Encode the search term for URL safety
            const encodedSearchTerm = encodeURIComponent(storedSearchTerm);
            // Redirect to the specific search page
            router.push(`/search/${encodedSearchTerm}`);
        }
    }, [router]);

    // Render the SearchNews component with empty search term initially
    return <SearchNews searchTerm={searchTerm} />;
}
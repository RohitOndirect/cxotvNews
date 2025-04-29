import { NextResponse } from 'next/server';

export async function GET() {

    const API_URL = "https://apicxotv.techplusmedia.com"
    try {
        // Replace with your actual data fetching logic
        const response = await fetch(`${API_URL}/api/articles?sort=publishedAt:desc&pagination[limit]=20&populate=*`);

        if (!response.ok) {
            throw new Error('Failed to fetch latest news');
        }

        const data = await response.json();

        return NextResponse.json({ data: data.data });
    } catch (error) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
import { NextResponse } from 'next/server';

const LAYOUT_MAPPING = {
    technology: 'm', // maps to (main) group with 'm' prefix
    business: 'c',   // maps to (custom) group with 'c' prefix
    science: 'm',
    finance: 'c',
    'trending-news': 'm',
    'talks-with-kalpana': 'm',
    'interviews': 'm',
    'marketing-mondays': 'm',
    'apac-talks-with-kalpana': 'm',
    'cxo-talk': 'm',
    'apac-marketing-monday': 'm',
    'ceo-talk': 'm',
    'trending': 'm',
    'cfo-playbook': 'm',
    'tech-thursday': 'm',
    'tech-priorities': 'm',
    'insurance': 'm',
    'cyber-security': 'm',
    'policy': 'm',
    'mobility': 'm',
    'cloud-computing': 'm',
    'feature': 'h',
    'health-cxo-talk': 'h',
    'health-business': 'h',
    'medical-technology': 'h',
    'health-interviews': 'h',
    'health-news': 'h',
    'health-webinars': 'h',
    'pharma': 'h',
    'diagnostic': 'h',
    'healthcare-it-news': 'h',
    'education-cxo-talk': 'e',
    'education-news': 'e',
    'digital-learning': 'e',
    'education-policy': 'e',
    'education-cxo-talk': 'e',
    'thought-leadership': 'e',
    'education-interview': 'e',
    'education-feature': 'e',
    'skill-development': 'e',
    'steam-career-education': 'e',
    'm-learning': 'e',
    'manufacturing': 'm',
    'retail-ecommerce': 'm',
    'telecommunication': 'm',
    'energy-utility': 'm',
    'transportation-logistics': 'm',
    'government-public-sector': 'm',
    'defense-aviation': 'm',
    'media-entertainment': 'm',
    'data-centre': 'm',
    'rpa': 'm',
    'ar-vr': 'm',
    'blockchain': 'm',
    'data': 'm',
    'edge-computing': 'm',
    'quantum-computing': 'm',
    'npl': 'm',
    'developers': 'm',
    'cyberwatch': 'm',
    "what's-popular": "m",
    "editor's-choice": "m",











};

export function middleware(request) {
    // Get the pathname and split it into segments
    const { pathname, origin } = request.nextUrl;

    // Check if pathname is not already lowercase
    if (pathname !== pathname.toLowerCase()) {
        const lowercaseUrl = new URL(`${origin}${pathname.toLowerCase()}`);
        return NextResponse.redirect(lowercaseUrl);
    }

    // Skip middleware processing for assets, api routes, etc.
    if (
        pathname.startsWith('/_next') ||
        pathname.startsWith('/api') ||
        pathname.startsWith('/static') ||
        pathname.includes('.') // Skip files with extensions
    ) {
        return NextResponse.next();
    }

    const pathSegments = pathname.split('/').filter(Boolean); // Remove empty segments

    // Check if we have segments and if the first segment maps to a layout
    if (pathSegments.length > 0) {
        const category = pathSegments[0];

        if (LAYOUT_MAPPING[category]) {
            // Create the new URL with the mapped prefix
            const newUrl = new URL(
                `/${LAYOUT_MAPPING[category]}/${pathSegments.join('/')}`,
                request.url
            );

            return NextResponse.rewrite(newUrl);
        }
    }

    return NextResponse.next();
}

export const config = {
    matcher: [
        '/((?!_next|api|static|favicon.ico|images).*)'
    ]
};
import { Inter } from 'next/font/google';
import './globals.css';
import ContentWrapper from "./components/ContentWrapper";
import GoToTop from './components/GoToTop';


const inter = Inter({ subsets: ['latin'] });

export const metadata = {
  title: 'Latest Technology News - CXOTV Today & Tech Updates',
  icons: {
    icon: './favicon.ico',
  },
  description: 'Stay updated with the latest technology news, CXO insights, and expert opinions on CXO TV. Get the latest tech updates and exclusive interviews.',
  keywords: 'technology news, CXO TV, tech updates, latest tech trends, digital transformation',
  openGraph: {
    title: 'Latest Technology News - CXOTV Today & Tech Updates',
    type: 'website',
    url: 'https://cxotv.techplusmedia.com/',
  }
};

export default function MainLayout({ children }) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <ContentWrapper>
          <main>
            {children}
          </main>
        </ContentWrapper>
        <GoToTop />
      </body>
    </html>
  );
}
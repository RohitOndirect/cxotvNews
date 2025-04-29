import Header from './Header';
import Navbar from './Navbar';
import Footer from './Footer';
import { ReduxProvider } from '../providers';


export default function ContentWrapper({ children }) {
    return (
        <ReduxProvider>
            <div className="flex min-h-screen w-screen flex-col font-roboto">
                <Header />
                <Navbar />
                <main>
                    {children}
                </main>
                <Footer />
            </div>
        </ReduxProvider>
    );
}
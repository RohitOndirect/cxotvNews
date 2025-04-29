import '../index.css';

export default function CustomLayout({ children, logo }) {
    return (
        <div className="flex flex-col min-h-screen">
            {logo && (
                <div className="py-4 px-6 border-b">
                    <img
                        src={logo.src}
                        alt="Logo"
                        className="h-12 w-auto"
                    />
                </div>
            )}
            <div className="flex-1">
                {children}
            </div>
        </div>
    );
}
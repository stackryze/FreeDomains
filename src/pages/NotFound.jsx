import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';

export default function NotFound() {
    return (
        <div className="min-h-screen bg-[#FFF8F0] flex flex-col items-center justify-center p-4 text-center" style={{ paddingTop: 'var(--incident-height, 0px)' }}>
            <h1 className="text-9xl font-bold text-[#FF6347] mb-4">404</h1>
            <h2 className="text-3xl font-bold text-[#2D3748] mb-6">Page Not Found</h2>
            <p className="text-xl text-gray-600 mb-8 max-w-md">
                Oops! The page you are looking for might have been removed, had its name changed, or is temporarily unavailable.
            </p>
            <Link to="/">
                <Button className="bg-[#FF6347] hover:bg-[#FF4500] text-white px-8 py-6 text-lg rounded-full">
                    Go Back Home
                </Button>
            </Link>
        </div>
    );
}

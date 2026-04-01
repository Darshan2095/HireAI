export const Sidebar = () => {
    return (
        <div className="w-64 h-screen border-r p-4">
            <h2 className="text-lg font-semibold mb-4">Dashboard</h2>

            <div className="space-y-2">
                <div className="p-2 rounded hover:bg-gray-100 cursor-pointer">
                    Dashboard
                </div>

                <div className="p-2 rounded hover:bg-gray-100 cursor-pointer">
                    Resume
                </div>

                <div className="p-2 rounded hover:bg-gray-100 cursor-pointer">
                    Jobs
                </div>

                <div className="p-2 rounded hover:bg-gray-100 cursor-pointer">
                    Interview
                </div>
            </div>
        </div>
    );
};
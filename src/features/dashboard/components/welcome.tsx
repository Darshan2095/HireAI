interface WelcomeProps {
  name?: string | null;
}

export const Welcome = ({ name }: WelcomeProps) => {
  return (
    <div className="bg-white border rounded-lg p-6 shadow-sm">
      <h2 className="text-2xl font-semibold">
        Welcome back, {name || "User"} 👋
      </h2>
      <p className="text-gray-500 mt-1">
        Here's what's happening with your career today.
      </p>
    </div>
  );
};
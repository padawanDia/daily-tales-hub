import { Header } from "@/components/Header";

const Dashboard = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <main className="container mx-auto px-4 py-8">
        <h2 className="text-2xl font-bold mb-6">Your Dashboard</h2>
        <p className="text-gray-600">
          Welcome to your dashboard! Here you'll be able to manage your posts.
        </p>
      </main>
    </div>
  );
};

export default Dashboard;
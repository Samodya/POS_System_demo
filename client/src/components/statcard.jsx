export default function StatCard({ title, value, icon }) {
    return (
      <div className="flex items-center gap-4 border border-gray-200 rounded-xl p-4 shadow-sm hover:shadow-md transition-shadow w-80">
        <div className="p-3 bg-gray-100 rounded-lg text-gray-700">
          {icon}
        </div>
        <div>
          <h2 className="text-sm text-gray-500">{title}</h2>
          <p className="text-2xl font-semibold mt-1">{value}</p>
        </div>
      </div>
    );
  }
  
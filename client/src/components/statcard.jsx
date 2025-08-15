export default function StatCard({ title, value, icon }) {
  return (
    <div className="flex items-center gap-4 border bg-white border-gray-300 rounded-xl p-4 shadow-sm hover:shadow-md transition-shadow w-56 md:w-60">
      <div className="p-3 bg-indigo-100 rounded-lg text-indigo-700">
        {icon}
      </div>
      <div>
        <h2 className="text-sm font-semibold text-gray-600">{title}</h2>
        <p className="text-2xl font-bold mt-1">{value <10 ? "0"+ value: value }</p>
      </div>
    </div>
  );
}

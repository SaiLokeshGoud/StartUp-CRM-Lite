export default function LoadingSkeleton() {
  return (
    <div className="space-y-6 animate-pulse">
      <div className="grid md:grid-cols-3 gap-6">
        {[1, 2, 3].map((item) => (
          <div
            key={item}
            className="bg-gray-200 h-32 rounded-2xl"
          />
        ))}
      </div>

      <div className="bg-gray-200 h-96 rounded-2xl" />

      <div className="bg-gray-200 h-96 rounded-2xl" />
    </div>
  );
}

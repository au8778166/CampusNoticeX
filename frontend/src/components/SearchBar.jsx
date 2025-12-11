export default function SearchBar({ value, onChange }) {
    return (
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder="🔍 Search notices..."
        className="w-full p-3 border border-gray-300 rounded-lg text-lg shadow-sm bg-white focus:outline-blue-500"
      />
    );
  }
  
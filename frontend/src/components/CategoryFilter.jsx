const categories = [
    "All", "Exam", "Holiday", "Hostel", "Fees", "Placement", "Academics", "General"
  ];
  
  export default function CategoryFilter({ selected, setSelected }) {
    return (
      <div className="flex flex-wrap gap-3 mt-5 justify-center">
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => setSelected(cat)}
            className={`px-4 py-2 rounded-full font-medium transition-all 
              ${
                selected === cat
                  ? "bg-linear-to-r from-purple-600 to-blue-500 text-white shadow-md"
                  : "bg-gray-200 text-gray-700 hover:bg-gray-300"
              }
            `}
          >
            {cat}
          </button>
        ))}
      </div>
    );
  }
  
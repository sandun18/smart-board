export default function SuggestedReplyButtons({ suggestions, onSelect }) {

  if (!suggestions?.length) return null;

  return (
    <div className="flex flex-wrap gap-2 mt-2">

      {suggestions.map((s, i) => (

        <button
          key={i}
          onClick={() => onSelect(s)}
          className="
          text-xs
          bg-light
          border border-light
          rounded-full
          px-3 py-1
          hover:bg-accent hover:text-white
          transition
          "
        >
          {s}
        </button>

      ))}

    </div>
  );
}
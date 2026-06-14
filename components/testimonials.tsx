import { Reveal } from "@/components/reveal";

type Feedback = {
  quote: string;
  name: string;
  location: string;
  rating: number;
};

const feedbacks: Feedback[] = [
  {
    quote:
      "The plush arrived so quickly and it's even cuter in person. Packaging was adorable too — felt like a real gift.",
    name: "Linh N.",
    location: "Hà Nội",
    rating: 5,
  },
  {
    quote:
      "Authentic goods at a fair price. The book cover is exactly like the official store. Will definitely order again!",
    name: "Minh T.",
    location: "Đà Nẵng",
    rating: 5,
  },
  {
    quote:
      "Cash on delivery made it so easy. The pouch is great quality and brightened up my whole week.",
    name: "An P.",
    location: "TP. Hồ Chí Minh",
    rating: 4,
  },
];

function Stars({ rating }: { rating: number }) {
  return (
    <div
      className="flex gap-0.5"
      role="img"
      aria-label={`${rating} out of 5 stars`}
    >
      {Array.from({ length: 5 }).map((_, i) => (
        <svg
          key={i}
          viewBox="0 0 24 24"
          className={`h-4 w-4 ${i < rating ? "text-coral" : "text-border"}`}
          fill="currentColor"
          aria-hidden="true"
        >
          <path d="M12 .587l3.668 7.431 8.2 1.192-5.934 5.784 1.401 8.168L12 18.896l-7.335 3.866 1.401-8.168L.132 9.21l8.2-1.192z" />
        </svg>
      ))}
    </div>
  );
}

export function Testimonials() {
  return (
    <section className="mx-auto w-full max-w-6xl px-4 sm:px-6 py-12">
      <Reveal className="mb-7 flex flex-col items-center gap-3">
        <h2 className="section-title text-xl sm:text-2xl">HAPPY CUSTOMERS</h2>
      </Reveal>

      <div className="grid gap-4 sm:grid-cols-3">
        {feedbacks.map((f, i) => (
          <Reveal key={f.name} order={i}>
            <figure
              className="review-float flex h-full flex-col rounded-2xl border border-border bg-white p-6"
              style={{ animationDelay: `${i * 0.6}s` }}
            >
              <Stars rating={f.rating} />
              <blockquote className="mt-4 flex-1 text-sm leading-relaxed text-ink">
                “{f.quote}”
              </blockquote>
              <figcaption className="mt-4 text-sm font-bold text-ink">
                {f.name}
                <span className="ml-2 font-normal text-muted">{f.location}</span>
              </figcaption>
            </figure>
          </Reveal>
        ))}
      </div>
    </section>
  );
}

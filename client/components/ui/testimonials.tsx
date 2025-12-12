import { useState } from "react"
import { cn } from "@/lib/utils"
import { Card } from "@/components/ui/card"

interface Testimonial {
  image: string
  name: string
  username: string
  text: string
  social: string
}

interface TestimonialsProps {
  testimonials: Testimonial[]
  className?: string
  title?: string
  description?: string
  maxDisplayed?: number
}

export function Testimonials({
  testimonials,
  className,
  title = "Read what people are saying",
  description = "Dummy feedback from virtual customers using our component library.",
  maxDisplayed = 6,
}: TestimonialsProps) {
  const [showAll, setShowAll] = useState(false)

  return (
    <div className={className}>
      {(title || description) && (
        <div className="flex flex-col items-center justify-center mb-12">
          <div className="flex flex-col gap-5">
            {title && <h2 className="text-center text-4xl font-medium">{title}</h2>}
            {description && (
              <p className="text-center text-stone-600">
                {description.split("<br />").map((line, i) => (
                  <span key={i}>
                    {line}
                    {i !== description.split("<br />").length - 1 && <br />}
                  </span>
                ))}
              </p>
            )}
          </div>
        </div>
      )}

      <div className="relative">
        <div
          className={cn(
            "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8",
            !showAll &&
              testimonials.length > maxDisplayed &&
              "max-h-[720px] overflow-hidden",
          )}
        >
          {testimonials
            .slice(0, showAll ? undefined : maxDisplayed)
            .map((testimonial, index) => (
              <Card
                key={index}
                className="h-auto p-6 bg-[#F3F0EB] border border-stone-200 transition-all duration-300 hover:shadow-lg hover:shadow-stone-300/30 hover:-translate-y-1 hover:border-[#967BB6]/30 group cursor-pointer"
                style={{ animation: `fadeInUp 0.6s ease-out ${index * 0.1}s both` }}
              >
                <div className="flex items-center mb-5">
                  <div className="w-12 h-12 rounded-full overflow-hidden flex-shrink-0 transition-transform duration-300 group-hover:scale-110">
                    <img
                      src={testimonial.image}
                      alt={testimonial.name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="flex flex-col pl-4">
                    <span className="font-serif text-lg text-[#1c1917]">
                      {testimonial.name}
                    </span>
                  </div>
                </div>
                <div className="mb-4">
                  <p className="text-stone-600 text-sm leading-relaxed font-light">
                    {testimonial.text}
                  </p>
                </div>
              </Card>
            ))}
        </div>

        {testimonials.length > maxDisplayed && !showAll && (
          <>
            <div className="absolute bottom-0 left-0 w-full h-20 bg-gradient-to-t from-white to-transparent" />
            <div className="absolute bottom-10 left-1/2 transform -translate-x-1/2 z-20">
              <button 
                onClick={() => setShowAll(true)}
                className="bg-[#1c1917] text-white px-8 py-4 text-sm tracking-widest hover:bg-stone-700 transition-all duration-300 hover:shadow-lg hover:shadow-stone-900/20 hover:scale-105 active:scale-95"
              >
                Load More
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  )
}


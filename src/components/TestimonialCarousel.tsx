// ABOUTME: Testimonial carousel component for rotating customer quotes
// ABOUTME: Auto-play with navigation, pause on hover, and mobile swipe support

'use client'

import { useState, useEffect, useCallback } from 'react'
import { motion, AnimatePresence, PanInfo } from 'framer-motion'
import type { LocalizedString } from '../config/content.schema'
import { getLocalizedString } from '../lib/content/utils'
import Image from 'next/image'

export interface Testimonial {
  /** Customer quote (bilingual) */
  quote: LocalizedString
  /** Customer name */
  author: string
  /** Customer role/title (bilingual) */
  role?: LocalizedString
  /** Company name */
  company?: string
  /** Customer photo URL */
  photo?: string
  /** Company logo URL */
  logo?: string
  /** Star rating (1-5) */
  rating?: number
  /** Optional video URL */
  video?: string
}

export interface TestimonialCarouselProps {
  /** Array of testimonials */
  testimonials: Testimonial[]
  /** Current locale */
  locale: 'en' | 'fr'
  /** Auto-play interval in milliseconds @default 5000 */
  interval?: number
  /** Enable auto-play @default true */
  autoPlay?: boolean
  /** Show navigation arrows @default true */
  showArrows?: boolean
  /** Show navigation dots @default true */
  showDots?: boolean
  /** Visual variant @default 'card' */
  variant?: 'card' | 'minimal' | 'split'
  /** Additional CSS classes */
  className?: string
}

/**
 * TestimonialCarousel - Rotating customer testimonials
 *
 * @example
 * <TestimonialCarousel
 *   testimonials={[
 *     {
 *       quote: { en: "This product changed...", fr: "..." },
 *       author: "Jane Doe",
 *       role: { en: "CEO", fr: "PDG" },
 *       company: "Acme Corp",
 *       photo: "/testimonials/jane.jpg",
 *       rating: 5
 *     }
 *   ]}
 *   locale="en"
 *   autoPlay
 *   interval={5000}
 * />
 */
export function TestimonialCarousel({
  testimonials,
  locale,
  interval = 5000,
  autoPlay = true,
  showArrows = true,
  showDots = true,
  variant = 'card',
  className = ''
}: TestimonialCarouselProps) {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [isPaused, setIsPaused] = useState(false)

  const goToNext = useCallback(() => {
    setCurrentIndex((prev) => (prev + 1) % testimonials.length)
  }, [testimonials.length])

  const goToPrevious = () => {
    setCurrentIndex((prev) => (prev - 1 + testimonials.length) % testimonials.length)
  }

  const goToIndex = (index: number) => {
    setCurrentIndex(index)
  }

  useEffect(() => {
    if (!autoPlay || isPaused || testimonials.length <= 1) return

    const timer = setInterval(goToNext, interval)
    return () => clearInterval(timer)
  }, [autoPlay, isPaused, interval, goToNext, testimonials.length])

  const handleDragEnd = (event: any, info: PanInfo) => {
    const threshold = 50
    if (info.offset.x > threshold) {
      goToPrevious()
    } else if (info.offset.x < -threshold) {
      goToNext()
    }
  }

  if (testimonials.length === 0) return null

  const current = testimonials[currentIndex]

  return (
    <div
      className={`relative ${className}`}
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
    >
      <div className="relative overflow-hidden">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentIndex}
            drag="x"
            dragConstraints={{ left: 0, right: 0 }}
            dragElastic={0.2}
            onDragEnd={handleDragEnd}
            initial={{ opacity: 0, x: 100 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -100 }}
            transition={{ duration: 0.3, ease: [0.25, 0.1, 0.25, 1] }}
          >
            {variant === 'card' && (
              <TestimonialCard testimonial={current} locale={locale} />
            )}
            {variant === 'minimal' && (
              <TestimonialMinimal testimonial={current} locale={locale} />
            )}
            {variant === 'split' && (
              <TestimonialSplit testimonial={current} locale={locale} />
            )}
          </motion.div>
        </AnimatePresence>
      </div>

      {showArrows && testimonials.length > 1 && (
        <>
          <button
            onClick={goToPrevious}
            className="absolute left-4 top-1/2 -translate-y-1/2 bg-white rounded-full p-2 shadow-lg hover:bg-gray-50 transition-colors z-10"
            aria-label="Previous testimonial"
          >
            <svg
              className="w-6 h-6 text-gray-700"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </button>

          <button
            onClick={goToNext}
            className="absolute right-4 top-1/2 -translate-y-1/2 bg-white rounded-full p-2 shadow-lg hover:bg-gray-50 transition-colors z-10"
            aria-label="Next testimonial"
          >
            <svg
              className="w-6 h-6 text-gray-700"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </button>
        </>
      )}

      {showDots && testimonials.length > 1 && (
        <div className="flex justify-center gap-2 mt-8">
          {testimonials.map((_, index) => (
            <button
              key={index}
              onClick={() => goToIndex(index)}
              className={`w-2 h-2 rounded-full transition-all ${
                index === currentIndex
                  ? 'bg-primary w-8'
                  : 'bg-gray-300 hover:bg-gray-400'
              }`}
              aria-label={`Go to testimonial ${index + 1}`}
            />
          ))}
        </div>
      )}
    </div>
  )
}

function TestimonialCard({ testimonial, locale }: { testimonial: Testimonial; locale: 'en' | 'fr' }) {
  return (
    <div className="bg-white rounded-lg shadow-xl p-8 md:p-12 max-w-4xl mx-auto">
      {testimonial.rating && <StarRating rating={testimonial.rating} />}

      <blockquote className="text-xl md:text-2xl text-gray-900 font-medium mb-8 font-body">
        "{getLocalizedString(testimonial.quote, locale)}"
      </blockquote>

      <div className="flex items-center gap-4">
        {testimonial.photo && (
          <Image
            src={testimonial.photo}
            alt={testimonial.author}
            width={64}
            height={64}
            className="rounded-full"
          />
        )}
        <div>
          <div className="font-semibold text-gray-900">{testimonial.author}</div>
          {testimonial.role && (
            <div className="text-gray-600 text-sm">
              {getLocalizedString(testimonial.role, locale)}
              {testimonial.company && `, ${testimonial.company}`}
            </div>
          )}
        </div>
        {testimonial.logo && (
          <Image
            src={testimonial.logo}
            alt={testimonial.company || ''}
            width={100}
            height={40}
            className="ml-auto"
          />
        )}
      </div>
    </div>
  )
}

function TestimonialMinimal({ testimonial, locale }: { testimonial: Testimonial; locale: 'en' | 'fr' }) {
  return (
    <div className="max-w-3xl mx-auto text-center">
      {testimonial.rating && (
        <div className="flex justify-center mb-6">
          <StarRating rating={testimonial.rating} />
        </div>
      )}

      <blockquote className="text-2xl md:text-3xl text-gray-900 font-medium mb-6 font-body">
        "{getLocalizedString(testimonial.quote, locale)}"
      </blockquote>

      <div className="text-gray-700">
        <div className="font-semibold">{testimonial.author}</div>
        {testimonial.role && (
          <div className="text-sm">
            {getLocalizedString(testimonial.role, locale)}
            {testimonial.company && `, ${testimonial.company}`}
          </div>
        )}
      </div>
    </div>
  )
}

function TestimonialSplit({ testimonial, locale }: { testimonial: Testimonial; locale: 'en' | 'fr' }) {
  return (
    <div className="grid md:grid-cols-2 gap-8 items-center max-w-6xl mx-auto">
      <div>
        {testimonial.photo && (
          <Image
            src={testimonial.photo}
            alt={testimonial.author}
            width={400}
            height={400}
            className="rounded-lg"
          />
        )}
      </div>

      <div>
        {testimonial.rating && <StarRating rating={testimonial.rating} />}

        <blockquote className="text-xl md:text-2xl text-gray-900 font-medium my-6 font-body">
          "{getLocalizedString(testimonial.quote, locale)}"
        </blockquote>

        <div className="font-semibold text-gray-900">{testimonial.author}</div>
        {testimonial.role && (
          <div className="text-gray-600">
            {getLocalizedString(testimonial.role, locale)}
            {testimonial.company && `, ${testimonial.company}`}
          </div>
        )}

        {testimonial.logo && (
          <Image
            src={testimonial.logo}
            alt={testimonial.company || ''}
            width={120}
            height={48}
            className="mt-4"
          />
        )}
      </div>
    </div>
  )
}

function StarRating({ rating }: { rating: number }) {
  return (
    <div className="flex gap-1 mb-4">
      {[1, 2, 3, 4, 5].map((star) => (
        <svg
          key={star}
          className={`w-5 h-5 ${star <= rating ? 'text-yellow-400' : 'text-gray-300'}`}
          fill="currentColor"
          viewBox="0 0 20 20"
        >
          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
        </svg>
      ))}
    </div>
  )
}

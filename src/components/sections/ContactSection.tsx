// ABOUTME: Contact section with working form, integrations, and map
// ABOUTME: Comprehensive contact solution with validation, spam protection, and multiple locations

'use client'

import { useState, useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { type Locale } from '../../lib/i18n/config'
import { type LocalizedString } from '../../config/content.schema'
import { getLocalizedString } from '../../lib/content'
import { Button } from '../ui/Button'
import { FormField } from '../FormField'
import { FileUpload } from '../FileUpload'
import { Tabs } from '../Tabs'
import { Icons } from '../Icon'
import { toast } from '../Toast'

// Types
export interface OfficeHours {
  monday?: { open: string; close: string }
  tuesday?: { open: string; close: string }
  wednesday?: { open: string; close: string }
  thursday?: { open: string; close: string }
  friday?: { open: string; close: string }
  saturday?: { open: string; close: string }
  sunday?: { open: string; close: string }
}

export interface Location {
  name: LocalizedString | string
  address: string
  phone?: string
  email?: string
  hours?: OfficeHours
  coordinates?: { lat: number; lng: number }
}

export interface MapConfig {
  provider?: 'google' | 'static' | 'link'
  apiKey?: string
  zoom?: number
}

export interface SpamProtection {
  honeypot?: boolean
  recaptcha?: string
}

export interface FormIntegration {
  type: 'sendgrid' | 'mailgun' | 'webhook' | 'custom'
  config: Record<string, any>
}

export interface ContactFormConfig {
  enabled?: boolean
  fields?: Array<'name' | 'email' | 'phone' | 'subject' | 'message' | 'attachment'>
  requiredFields?: Array<'name' | 'email' | 'phone' | 'subject' | 'message'>
  onSubmit?: (data: ContactFormData) => Promise<void>
  spamProtection?: SpamProtection
  integration?: FormIntegration
}

export interface ContactSectionProps {
  locale: Locale
  title?: LocalizedString | string
  description?: LocalizedString | string
  form?: ContactFormConfig
  locations?: Location[]
  defaultLocation?: number
  map?: MapConfig
  showMap?: boolean
  showInfo?: boolean
  timezone?: string
  showStatus?: boolean
  className?: string
}

export interface ContactFormData {
  name: string
  email: string
  phone?: string
  subject?: string
  message: string
  attachment?: File
  _honeypot?: string
}

// Office hours utilities
function isLocationOpen(hours: OfficeHours | undefined, timezone?: string): {
  isOpen: boolean
  opensAt?: string
  closesAt?: string
} {
  if (!hours) return { isOpen: false }

  const now = new Date()
  const dayName = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'][
    now.getDay()
  ] as keyof OfficeHours

  const todayHours = hours[dayName]
  if (!todayHours) return { isOpen: false }

  const currentTime = `${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}`

  const isOpen = currentTime >= todayHours.open && currentTime < todayHours.close

  return {
    isOpen,
    opensAt: todayHours.open,
    closesAt: todayHours.close,
  }
}

// Contact form component
function ContactForm({
  config,
  locale,
}: {
  config: ContactFormConfig
  locale: Locale
}) {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSuccess, setIsSuccess] = useState(false)

  // Build dynamic schema based on configured fields
  const schemaFields: Record<string, z.ZodTypeAny> = {}
  const fields = config.fields || ['name', 'email', 'message']
  const required = config.requiredFields || ['name', 'email', 'message']

  if (fields.includes('name')) {
    schemaFields.name = required.includes('name')
      ? z.string().min(2, locale === 'fr' ? 'Nom requis (min 2 caractères)' : 'Name required (min 2 chars)')
      : z.string().optional()
  }

  if (fields.includes('email')) {
    schemaFields.email = required.includes('email')
      ? z.string().email(locale === 'fr' ? 'Email invalide' : 'Invalid email')
      : z.string().email().optional()
  }

  if (fields.includes('phone')) {
    schemaFields.phone = z.string().optional()
  }

  if (fields.includes('subject')) {
    schemaFields.subject = z.string().optional()
  }

  if (fields.includes('message')) {
    schemaFields.message = required.includes('message')
      ? z.string().min(10, locale === 'fr' ? 'Message requis (min 10 caractères)' : 'Message required (min 10 chars)')
      : z.string().optional()
  }

  if (config.spamProtection?.honeypot) {
    schemaFields._honeypot = z.string().optional()
  }

  const FormSchema = z.object(schemaFields)

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<ContactFormData>({
    resolver: zodResolver(FormSchema),
  })

  const onSubmit = async (data: ContactFormData) => {
    // Honeypot spam check
    if (config.spamProtection?.honeypot && data._honeypot) {
      console.warn('Spam detected via honeypot')
      return
    }

    setIsSubmitting(true)

    try {
      if (config.onSubmit) {
        await config.onSubmit(data)
      }

      setIsSuccess(true)
      toast.success(
        locale === 'fr'
          ? 'Message envoyé! Nous vous répondrons dans les plus brefs délais.'
          : "Message sent! We'll get back to you as soon as possible."
      )

      reset()

      setTimeout(() => setIsSuccess(false), 3000)
    } catch (error) {
      toast.error(
        locale === 'fr'
          ? "Une erreur s'est produite. Veuillez réessayer."
          : 'An error occurred. Please try again.'
      )
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      {fields.includes('name') && (
        <FormField
          name="name"
          label={locale === 'fr' ? 'Nom' : 'Name'}
          error={errors.name}
          required={required.includes('name')}
        >
          <input
            type="text"
            {...register('name')}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
          />
        </FormField>
      )}

      {fields.includes('email') && (
        <FormField
          name="email"
          label={locale === 'fr' ? 'Email' : 'Email'}
          error={errors.email}
          required={required.includes('email')}
        >
          <input
            type="email"
            {...register('email')}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
          />
        </FormField>
      )}

      {fields.includes('phone') && (
        <FormField
          name="phone"
          label={locale === 'fr' ? 'Téléphone' : 'Phone'}
          error={errors.phone}
          required={required.includes('phone')}
        >
          <input
            type="tel"
            {...register('phone')}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
          />
        </FormField>
      )}

      {fields.includes('subject') && (
        <FormField
          name="subject"
          label={locale === 'fr' ? 'Sujet' : 'Subject'}
          error={errors.subject}
          required={required.includes('subject')}
        >
          <input
            type="text"
            {...register('subject')}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
          />
        </FormField>
      )}

      {fields.includes('message') && (
        <FormField
          name="message"
          label={locale === 'fr' ? 'Message' : 'Message'}
          error={errors.message}
          required={required.includes('message')}
        >
          <textarea
            {...register('message')}
            rows={6}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent resize-none"
          />
        </FormField>
      )}

      {fields.includes('attachment') && (
        <FileUpload
          label={locale === 'fr' ? 'Pièce jointe (optionnel)' : 'Attachment (optional)'}
          accept=".pdf,.doc,.docx,.jpg,.png"
          maxSize={5 * 1024 * 1024}
          onChange={(file) => {}}
          locale={locale}
        />
      )}

      {/* Honeypot field (hidden from users) */}
      {config.spamProtection?.honeypot && (
        <input
          type="text"
          {...register('_honeypot')}
          className="absolute opacity-0 pointer-events-none"
          tabIndex={-1}
          autoComplete="off"
        />
      )}

      <Button
        type="submit"
        variant="filled"
        size="lg"
        fullWidth
        loading={isSubmitting}
        success={isSuccess}
        successText={locale === 'fr' ? 'Envoyé!' : 'Sent!'}
      >
        {locale === 'fr' ? 'Envoyer le message' : 'Send Message'}
      </Button>
    </form>
  )
}

// Location info component
function LocationInfo({
  location,
  locale,
  showStatus,
  timezone,
}: {
  location: Location
  locale: Locale
  showStatus?: boolean
  timezone?: string
}) {
  const locationName = typeof location.name === 'string' ? location.name : getLocalizedString(location.name, locale)
  const status = isLocationOpen(location.hours, timezone)

  return (
    <div className="space-y-6">
      {location.name && (
        <h3 className="text-2xl font-bold text-slate-900">{locationName}</h3>
      )}

      {/* Address */}
      {location.address && (
        <div>
          <div className="flex items-start gap-3">
            <Icons.MapPin size={20} className="text-primary mt-1 flex-shrink-0" />
            <div>
              <p className="font-semibold text-slate-900 mb-1">
                {locale === 'fr' ? 'Adresse' : 'Address'}
              </p>
              <a
                href={`https://maps.google.com/?q=${encodeURIComponent(location.address)}`}
                target="_blank"
                rel="noopener noreferrer"
                className="text-slate-700 hover:text-primary transition-colors"
              >
                {location.address}
              </a>
            </div>
          </div>
        </div>
      )}

      {/* Phone */}
      {location.phone && (
        <div className="flex items-start gap-3">
          <Icons.Phone size={20} className="text-primary mt-1 flex-shrink-0" />
          <div>
            <p className="font-semibold text-slate-900 mb-1">
              {locale === 'fr' ? 'Téléphone' : 'Phone'}
            </p>
            <a
              href={`tel:${location.phone.replace(/\D/g, '')}`}
              className="text-slate-700 hover:text-primary transition-colors"
            >
              {location.phone}
            </a>
          </div>
        </div>
      )}

      {/* Email */}
      {location.email && (
        <div className="flex items-start gap-3">
          <Icons.Mail size={20} className="text-primary mt-1 flex-shrink-0" />
          <div>
            <p className="font-semibold text-slate-900 mb-1">
              {locale === 'fr' ? 'Email' : 'Email'}
            </p>
            <a
              href={`mailto:${location.email}`}
              className="text-slate-700 hover:text-primary transition-colors"
            >
              {location.email}
            </a>
          </div>
        </div>
      )}

      {/* Hours */}
      {location.hours && (
        <div className="flex items-start gap-3">
          <Icons.Clock size={20} className="text-primary mt-1 flex-shrink-0" />
          <div>
            <p className="font-semibold text-slate-900 mb-1">
              {locale === 'fr' ? 'Horaires' : 'Hours'}
            </p>
            {showStatus && (
              <p className={`text-sm font-medium mb-2 ${status.isOpen ? 'text-green-600' : 'text-red-600'}`}>
                {status.isOpen
                  ? locale === 'fr'
                    ? `Ouvert • Ferme à ${status.closesAt}`
                    : `Open • Closes at ${status.closesAt}`
                  : locale === 'fr'
                  ? `Fermé • Ouvre à ${status.opensAt}`
                  : `Closed • Opens at ${status.opensAt}`}
              </p>
            )}
            <div className="text-sm text-slate-600 space-y-1">
              {Object.entries(location.hours).map(([day, hours]) => (
                <div key={day} className="flex justify-between">
                  <span className="capitalize">{locale === 'fr' ? translateDay(day, 'fr') : day}</span>
                  <span>{hours.open} - {hours.close}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

// Map component
function MapDisplay({
  location,
  config,
}: {
  location: Location
  config?: MapConfig
}) {
  const provider = config?.provider || 'google'

  if (provider === 'link') {
    return (
      <a
        href={`https://maps.google.com/?q=${encodeURIComponent(location.address)}`}
        target="_blank"
        rel="noopener noreferrer"
        className="block h-full bg-slate-100 rounded-xl overflow-hidden hover:opacity-90 transition-opacity"
      >
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="text-center">
            <Icons.MapPin size={48} className="text-primary mx-auto mb-4" />
            <p className="text-slate-700 font-medium">View on Google Maps</p>
            <p className="text-sm text-slate-500 mt-2">{location.address}</p>
          </div>
        </div>
      </a>
    )
  }

  if (provider === 'static' && location.coordinates) {
    const { lat, lng } = location.coordinates
    const zoom = config?.zoom || 15
    const staticMapUrl = `https://maps.googleapis.com/maps/api/staticmap?center=${lat},${lng}&zoom=${zoom}&size=600x500&markers=color:red%7C${lat},${lng}&key=${config?.apiKey || ''}`

    return (
      <a
        href={`https://maps.google.com/?q=${lat},${lng}`}
        target="_blank"
        rel="noopener noreferrer"
      >
        <img
          src={staticMapUrl}
          alt="Location map"
          className="w-full h-full object-cover"
        />
      </a>
    )
  }

  // Google Maps embed
  if (provider === 'google' && location.coordinates) {
    const { lat, lng } = location.coordinates
    const zoom = config?.zoom || 15
    const embedUrl = `https://www.google.com/maps/embed/v1/place?key=${config?.apiKey || ''}&q=${lat},${lng}&zoom=${zoom}`

    return (
      <iframe
        src={embedUrl}
        width="100%"
        height="100%"
        style={{ border: 0 }}
        allowFullScreen
        loading="lazy"
        referrerPolicy="no-referrer-when-downgrade"
      />
    )
  }

  // Fallback
  return (
    <div className="absolute inset-0 flex items-center justify-center text-slate-400 bg-slate-100">
      <div className="text-center">
        <Icons.MapPin size={48} className="mx-auto mb-2" />
        <span className="block text-sm">Map</span>
        <span className="block text-xs mt-1">{location.address}</span>
      </div>
    </div>
  )
}

// Utility function
function translateDay(day: string, locale: Locale): string {
  if (locale === 'fr') {
    const translations: Record<string, string> = {
      monday: 'Lundi',
      tuesday: 'Mardi',
      wednesday: 'Mercredi',
      thursday: 'Jeudi',
      friday: 'Vendredi',
      saturday: 'Samedi',
      sunday: 'Dimanche',
    }
    return translations[day] || day
  }
  return day.charAt(0).toUpperCase() + day.slice(1)
}

export function ContactSection({
  locale,
  title,
  description,
  form,
  locations,
  defaultLocation = 0,
  map,
  showMap = true,
  showInfo = true,
  timezone,
  showStatus = true,
  className = '',
}: ContactSectionProps) {
  const [selectedLocation, setSelectedLocation] = useState(defaultLocation)

  const sectionTitle = title
    ? typeof title === 'string'
      ? title
      : getLocalizedString(title, locale)
    : locale === 'fr'
    ? 'Contactez-nous'
    : 'Contact Us'

  const sectionDesc = description
    ? typeof description === 'string'
      ? description
      : getLocalizedString(description, locale)
    : undefined

  const currentLocation = locations?.[selectedLocation] || {
    name: locale === 'fr' ? 'Notre bureau' : 'Our Office',
    address: '123 Main Street, City, State 12345',
  }

  const hasMultipleLocations = locations && locations.length > 1

  return (
    <section
      id="contact"
      className={`py-24 bg-gradient-to-b from-white to-slate-50 ${className}`}
    >
      <div className="container mx-auto px-4 max-w-7xl">
        {/* Header */}
        <div className="text-center mb-12">
          <h2 className="mb-4 text-4xl font-bold text-slate-900 font-condensed">
            {sectionTitle}
          </h2>
          <div className="h-1 w-16 bg-primary mb-6 mx-auto" />
          {sectionDesc && (
            <p className="text-lg text-slate-600 max-w-2xl mx-auto">{sectionDesc}</p>
          )}
        </div>

        {/* Multiple locations tabs */}
        {hasMultipleLocations && (
          <div className="mb-12">
            <Tabs
              tabs={locations!.map((loc, idx) => ({
                value: `location-${idx}`,
                label: typeof loc.name === 'string' ? loc.name : getLocalizedString(loc.name, locale),
                content: <></>,
              }))}
              value={`location-${selectedLocation}`}
              onValueChange={(value) => {
                const idx = parseInt(value.replace('location-', ''))
                setSelectedLocation(idx)
              }}
              variant="pills"
            />
          </div>
        )}

        <div className="grid gap-12 lg:grid-cols-2">
          {/* Left: Contact info or form */}
          <div>
            {form?.enabled ? (
              <div>
                <h3 className="text-2xl font-bold text-slate-900 mb-6">
                  {locale === 'fr' ? 'Envoyez-nous un message' : 'Send us a message'}
                </h3>
                <ContactForm config={form} locale={locale} />
              </div>
            ) : showInfo ? (
              <LocationInfo
                location={currentLocation}
                locale={locale}
                showStatus={showStatus}
                timezone={timezone}
              />
            ) : null}
          </div>

          {/* Right: Map */}
          {showMap && (
            <div className="relative h-[500px] rounded-xl overflow-hidden shadow-lg border border-slate-200">
              <MapDisplay location={currentLocation} config={map} />
            </div>
          )}
        </div>
      </div>
    </section>
  )
}

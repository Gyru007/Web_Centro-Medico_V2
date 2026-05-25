import { useState } from 'react'
import './WhatsAppWidget.css'

export default function WhatsAppWidget({ numero = '+58000000000' }) {
  const [hovered, setHovered] = useState(false)
  const url = `https://wa.me/${numero.replace(/\D/g,'')}?text=Hola,%20deseo%20agendar%20una%20cita.`

  return (
    <a
      href={url}
      target="_blank"
      rel="noopener noreferrer"
      className="wa-widget"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      aria-label="Contactar por WhatsApp"
    >
      {hovered && <span className="wa-tooltip">¿Necesitas ayuda? ¡Escríbenos!</span>}
      <svg viewBox="0 0 32 32" width="30" height="30" fill="currentColor">
        <path d="M16 0C7.164 0 0 7.163 0 16c0 2.82.736 5.47 2.027 7.773L.057 31.17l7.625-1.995A15.93 15.93 0 0016 32c8.836 0 16-7.163 16-16S24.836 0 16 0zm0 29.25a13.21 13.21 0 01-6.73-1.844l-.483-.286-4.525 1.185 1.205-4.397-.316-.505A13.19 13.19 0 012.75 16C2.75 8.682 8.682 2.75 16 2.75S29.25 8.682 29.25 16 23.318 29.25 16 29.25zm7.237-9.713c-.397-.199-2.35-1.16-2.714-1.292-.363-.133-.628-.199-.893.199-.265.397-1.027 1.292-1.26 1.557-.232.265-.463.298-.86.1-.397-.199-1.676-.618-3.193-1.97-1.18-1.053-1.977-2.352-2.21-2.749-.232-.397-.025-.611.174-.809.18-.178.397-.464.596-.696.199-.232.265-.397.397-.661.133-.265.067-.497-.033-.696-.1-.199-.893-2.152-1.225-2.946-.322-.773-.65-.668-.893-.68l-.76-.013c-.265 0-.695.1-1.06.497-.363.397-1.39 1.358-1.39 3.312s1.424 3.842 1.623 4.107c.199.265 2.803 4.278 6.791 5.997.95.41 1.69.655 2.268.839.953.303 1.82.26 2.505.158.765-.114 2.35-.96 2.683-1.889.332-.928.332-1.724.232-1.889-.1-.165-.364-.265-.76-.464z"/>
      </svg>
    </a>
  )
}

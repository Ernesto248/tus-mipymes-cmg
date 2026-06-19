import Link from "next/link"

export function PublicFooter() {
  return (
    <footer className="bg-[#f5f5f7] py-16 px-4">
      <div className="max-w-[980px] mx-auto">
        <div className="grid grid-cols-3 gap-8">
          <div>
            <h3 className="text-sm font-semibold text-[#1d1d1f] mb-3">MiPymes</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/negocio" className="text-xs text-[#7a7a7a] hover:text-[#0066cc] transition-colors">
                  Descubrir negocios
                </Link>
              </li>
              <li>
                <Link href="/login" className="text-xs text-[#7a7a7a] hover:text-[#0066cc] transition-colors">
                  Membresia
                </Link>
              </li>
            </ul>
          </div>
          <div>
            <h3 className="text-sm font-semibold text-[#1d1d1f] mb-3">Contacto</h3>
            <p className="text-xs text-[#7a7a7a]">
              info@mipymes.co
            </p>
          </div>
          <div>
            <h3 className="text-sm font-semibold text-[#1d1d1f] mb-3">Legal</h3>
            <p className="text-xs text-[#7a7a7a]">
              Los precios pueden variar sin previo aviso.
              Consulta con cada comercio para el precio final.
            </p>
          </div>
        </div>
        <div className="mt-8 pt-4 border-t border-[#e0e0e0]">
          <p className="text-[10px] text-[#7a7a7a]">
            &copy; {new Date().getFullYear()} MiPymes. Todos los derechos reservados.
          </p>
        </div>
      </div>
    </footer>
  )
}

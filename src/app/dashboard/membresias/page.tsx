import { MembresiasClient } from "./membresias-client"

export default function MembershipsPage() {
  return (
    <div>
      <h1 className="text-[28px] sm:text-[34px] font-semibold text-[#1d1d1f] tracking-[-0.374px] mb-2">
        Membresias
      </h1>
      <p className="text-[15px] sm:text-[17px] text-[#7a7a7a] mb-8 tracking-[-0.374px]">
        Gestiona las membresias de los usuarios
      </p>
      <MembresiasClient />
    </div>
  )
}

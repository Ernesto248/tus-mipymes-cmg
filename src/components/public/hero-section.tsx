"use client"

import Link from "next/link"
import { motion } from "framer-motion"
import { ArrowRight } from "lucide-react"

const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  visible: { opacity: 1, y: 0 },
}

const snowflakes = [
  { left: "6%", size: 3, delay: 0.1, duration: 16, drift: 24 },
  { left: "14%", size: 2, delay: 2.4, duration: 20, drift: -18 },
  { left: "23%", size: 4, delay: 1.2, duration: 18, drift: 30 },
  { left: "31%", size: 2, delay: 4.1, duration: 22, drift: -24 },
  { left: "39%", size: 3, delay: 0.8, duration: 17, drift: 18 },
  { left: "48%", size: 2, delay: 3.3, duration: 21, drift: -28 },
  { left: "56%", size: 4, delay: 1.8, duration: 19, drift: 22 },
  { left: "64%", size: 2, delay: 5.2, duration: 23, drift: -16 },
  { left: "72%", size: 3, delay: 2.7, duration: 18, drift: 26 },
  { left: "81%", size: 2, delay: 0.4, duration: 20, drift: -22 },
  { left: "89%", size: 4, delay: 3.8, duration: 17, drift: 20 },
  { left: "96%", size: 2, delay: 1.5, duration: 24, drift: -30 },
]

export function HeroSection() {
  return (
    <section className="relative min-h-[calc(100dvh-44px)] overflow-hidden bg-[linear-gradient(135deg,#0b1624_0%,#10141f_48%,#05070b_100%)] text-white">
      <div
        aria-hidden="true"
        className="absolute inset-0 bg-cover bg-center sm:hidden"
        style={{
          backgroundImage: "url('/hero-sm.webp')",
        }}
      />
      <div
        aria-hidden="true"
        className="absolute inset-0 hidden bg-cover bg-center sm:block"
        style={{
          backgroundImage: "url('/hero.webp')",
        }}
      />

      <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(6,8,13,0.56)_0%,rgba(6,8,13,0.20)_42%,rgba(6,8,13,0.74)_100%)]" />
      <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(0,0,0,0.34),transparent_42%,rgba(0,0,0,0.26))]" />
      <motion.div
        aria-hidden="true"
        className="absolute left-1/2 top-[18%] h-[1px] w-[82vw] max-w-[980px] -translate-x-1/2 bg-gradient-to-r from-transparent via-white/55 to-transparent"
        initial={{ opacity: 0, scaleX: 0.4 }}
        animate={{ opacity: 1, scaleX: 1 }}
        transition={{ duration: 1.2, ease: "easeOut" }}
      />
      <div aria-hidden="true" className="pointer-events-none absolute inset-0 z-[3] overflow-hidden">
        {snowflakes.map((flake) => (
          <motion.span
            key={`${flake.left}-${flake.delay}`}
            className="absolute top-[-24px] rounded-full bg-white/80 shadow-[0_0_12px_rgba(255,255,255,0.45)]"
            style={{
              left: flake.left,
              width: flake.size,
              height: flake.size,
            }}
            initial={{ y: -24, x: 0, opacity: 0 }}
            animate={{
              y: "calc(100dvh + 48px)",
              x: [0, flake.drift, flake.drift * -0.35, 0],
              opacity: [0, 0.72, 0.58, 0],
            }}
            transition={{
              duration: flake.duration,
              delay: flake.delay,
              repeat: Infinity,
              ease: "linear",
            }}
          />
        ))}
      </div>

      <div className="relative z-10 mx-auto flex min-h-[calc(100dvh-44px)] w-full max-w-[1120px] flex-col justify-between px-5 py-10 sm:px-8 sm:py-12 lg:px-10">
        <motion.div
          className="flex items-center justify-end"
          initial={{ opacity: 0, y: -12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: "easeOut" }}
        >
          <div className="hidden rounded-full border border-white/14 bg-black/20 px-3 py-1.5 text-xs text-white/70 backdrop-blur-md sm:block">
            Socio+
          </div>
        </motion.div>

        <motion.div
          className="mx-auto flex w-full max-w-[900px] flex-col items-center text-center"
          initial="hidden"
          animate="visible"
          transition={{ staggerChildren: 0.12, delayChildren: 0.12 }}
        >
          <motion.p
            variants={fadeUp}
            transition={{ duration: 0.65, ease: "easeOut" }}
            className="mb-5 rounded-full border border-white/16 bg-white/10 px-4 py-2 text-xs font-semibold uppercase text-white/80 backdrop-blur-md"
          >
            Mas beneficios. Menos gastos.
          </motion.p>
          <motion.h1
            variants={fadeUp}
            transition={{ duration: 0.75, ease: "easeOut" }}
            className="max-w-[860px] text-[48px] font-semibold leading-[0.95] text-white sm:text-[72px] lg:text-[96px]"
          >
            <span>Socio</span>
            <span className="text-[#34c759]">+</span>
          </motion.h1>
          <motion.p
            variants={fadeUp}
            transition={{ duration: 0.75, ease: "easeOut" }}
            className="mt-6 max-w-[680px] text-[20px] font-normal leading-[1.25] text-white/86 sm:text-[26px] lg:text-[30px]"
          >
            La membresia premium para acceder a descuentos reales en comercios locales.
          </motion.p>

          <motion.div
            variants={fadeUp}
            transition={{ duration: 0.75, ease: "easeOut" }}
            className="mt-14 flex w-full flex-col items-center justify-center gap-3 sm:mt-8 sm:w-auto sm:flex-row"
          >
            <motion.div whileHover={{ y: -2 }} whileTap={{ scale: 0.98 }} className="w-full sm:w-auto">
              <Link
                href="/negocio"
                className="inline-flex h-12 w-full items-center justify-center gap-2 rounded-full bg-white px-6 text-[15px] font-semibold text-[#111318] shadow-[0_18px_60px_rgba(0,0,0,0.35)] transition-colors hover:bg-[#f5f5f7] sm:w-auto"
              >
                Explorar negocios
                <ArrowRight className="h-4 w-4" />
              </Link>
            </motion.div>
            <motion.div whileHover={{ y: -2 }} whileTap={{ scale: 0.98 }} className="w-full sm:w-auto">
              <Link
                href="/login"
                className="inline-flex h-12 w-full items-center justify-center rounded-full border border-white/30 bg-white/10 px-6 text-[15px] font-semibold text-white backdrop-blur-md transition-colors hover:bg-white/16 sm:w-auto"
              >
                Obtener membresia
              </Link>
            </motion.div>
          </motion.div>
        </motion.div>

        <div aria-hidden="true" className="h-12" />
      </div>
    </section>
  )
}

"use client"

import { useEffect, useState, useRef } from "react"
import Image from "next/image"
import { motion, AnimatePresence } from "framer-motion"
import { Check, ArrowRight, Gift, ShieldCheck, Clock, Users } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import confetti from "canvas-confetti"
import { PurchaseNotification } from "@/components/purchase-notification"

// ======= CONFIGURAÇÕES FACILMENTE EDITÁVEIS =======
// Altere estas variáveis para personalizar a página

// Configurações do timer
const TIMER_MINUTES = 9
const TIMER_SECONDS = 0

// Configurações do produto
const PRODUCT_NAME = 'KIT DIGITAL "FAMÍLIA IMUNE"'
const PRODUCT_REGULAR_PRICE = "R$97"
const PRODUCT_SALE_PRICE = "R$19.90"
const PRODUCT_DISCOUNT = "79,5% OFF"

// Configurações do CTA
const CTA_TEXT = "QUERO PROTEGER MINHA FAMÍLIA" // Texto do botão principal
const CTA_MOBILE_TEXT = "PROTEGER FAMÍLIA" // Texto do botão para mobile (mais curto)
const CTA_URL = "https://pay.kirvano.com/5a2711a1-3c63-4d2e-a5e8-ec1bfc39fe51" // URL para onde o botão direciona

// Configurações de imagens
const PRODUCT_IMAGE = "https://iili.io/3Nn6Ha1.png" // Imagem do produto

// Benefícios do produto (itens com check)
const PRODUCT_BENEFITS = [
  "Cardápio Antigripal para 7 dias",
  "Lista de alimentos que destroem a imunidade",
  "Receitas naturais para cortar tosse e febre",
  "Checklist de limpeza para blindar sua casa",
]

// Lista de compras fictícias para as notificações
const RECENT_PURCHASES = [
  { name: "Mariana S.", location: "São Paulo, SP", timeAgo: "37 segundos" },
  { name: "Eduarda M.", location: "Rio de Janeiro, RJ", timeAgo: "2 minutos" },
  { name: "Juliana R.", location: "Belo Horizonte, MG", timeAgo: "4 minutos" },
  { name: "Lorena A.", location: "Curitiba, PR", timeAgo: "5 minutos" },
  { name: "Fernanda L.", location: "Salvador, BA", timeAgo: "7 minutos" },
  { name: "Viviane C.", location: "Brasília, DF", timeAgo: "9 minutos" },
  { name: "Amanda S.", location: "Fortaleza, CE", timeAgo: "11 minutos" },
  { name: "Rayssa T.", location: "Recife, PE", timeAgo: "13 minutos" },
  { name: "Patrícia M.", location: "Porto Alegre, RS", timeAgo: "15 minutos" },
  { name: "Yasmim R.", location: "Manaus, AM", timeAgo: "18 minutos" },
]

// ======= COMPONENTE PRINCIPAL =======
export default function UpsellPage() {
  // Estados
  const [timeLeft, setTimeLeft] = useState({ minutes: TIMER_MINUTES, seconds: TIMER_SECONDS })
  const [progress, setProgress] = useState(100)
  const [mounted, setMounted] = useState(false)
  const [hoverCard, setHoverCard] = useState(false)
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 })
  const [currentPurchase, setCurrentPurchase] = useState(null)
  const [showNotification, setShowNotification] = useState(false)
  const [viewerCount, setViewerCount] = useState(0)
  const [isMobile, setIsMobile] = useState(false)

  // Refs
  const confettiRef = useRef(null)
  const totalSeconds = TIMER_MINUTES * 60 + TIMER_SECONDS // Total de segundos para o timer

  // Detectar se é mobile
  useEffect(() => {
    if (!mounted) return
    const checkMobile = () => setIsMobile(window.innerWidth < 768)
    checkMobile()
    window.addEventListener("resize", checkMobile)
    return () => window.removeEventListener("resize", checkMobile)
  }, [mounted])

  // Efeito de montagem
  useEffect(() => {
    setMounted(true)

    const handleMouseMove = (e) => {
      setMousePosition({
        x: e.clientX / window.innerWidth,
        y: e.clientY / window.innerHeight,
      })
    }

    window.addEventListener("mousemove", handleMouseMove)
    return () => window.removeEventListener("mousemove", handleMouseMove)
  }, [])

  // Simular número de visualizadores
  useEffect(() => {
    if (!mounted) return

    // Gerar um número aleatório entre 23 e 45
    const randomViewers = Math.floor(Math.random() * (45 - 23 + 1)) + 23
    setViewerCount(randomViewers)

    // Atualizar o número de visualizadores a cada 30-60 segundos
    const interval = setInterval(
      () => {
        const change = Math.floor(Math.random() * 5) - 2 // -2 a +2
        setViewerCount((prev) => {
          const newCount = prev + change
          return newCount < 20 ? 20 : newCount > 50 ? 50 : newCount
        })
      },
      Math.random() * 30000 + 30000,
    )

    return () => clearInterval(interval)
  }, [mounted])

  // Countdown timer
  useEffect(() => {
    if (!mounted) return

    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev.seconds > 0) {
          return { ...prev, seconds: prev.seconds - 1 }
        } else if (prev.minutes > 0) {
          return { minutes: prev.minutes - 1, seconds: 59 }
        } else {
          clearInterval(timer)
          return { minutes: 0, seconds: 0 }
        }
      })

      // Calculate remaining seconds
      const remainingSeconds = timeLeft.minutes * 60 + timeLeft.seconds
      // Calculate progress percentage
      const newProgress = (remainingSeconds / totalSeconds) * 100
      setProgress(newProgress)
    }, 1000)

    return () => clearInterval(timer)
  }, [timeLeft, mounted, totalSeconds])

  // Purchase notifications system
  useEffect(() => {
    if (!mounted) return

    // Função para mostrar uma notificação aleatória
    const showRandomNotification = () => {
      // Selecionar uma compra aleatória
      const randomIndex = Math.floor(Math.random() * RECENT_PURCHASES.length)
      setCurrentPurchase(RECENT_PURCHASES[randomIndex])
      setShowNotification(true)

      // Esconder a notificação após 5 segundos
      setTimeout(() => {
        setShowNotification(false)
      }, 5000)
    }

    // Mostrar a primeira notificação após 3 segundos
    const initialTimeout = setTimeout(() => {
      showRandomNotification()
    }, 3000)

    // Configurar um intervalo para mostrar notificações periódicas
    // Intervalo aleatório entre 15 e 40 segundos
    const interval = setInterval(
      () => {
        showRandomNotification()
      },
      Math.random() * 25000 + 15000,
    )

    return () => {
      clearTimeout(initialTimeout)
      clearInterval(interval)
    }
  }, [mounted])

  // Format time with leading zeros
  const formatTime = (time) => {
    return time < 10 ? `0${time}` : time
  }

  // Confetti effect
  const triggerConfetti = () => {
    if (confettiRef.current && mounted) {
      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 },
      })

      // Redirecionar após um pequeno delay para permitir que o confete seja visto
      setTimeout(() => {
        window.location.href = CTA_URL
      }, 800)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-teal-900 via-teal-950 to-gray-950 text-white overflow-hidden">
      {/* Floating particles background */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {[...Array(20)].map((_, i) => (
          <div
            key={i}
            className="absolute rounded-full bg-teal-500/10"
            style={{
              top: `${Math.random() * 100}%`,
              left: `${Math.random() * 100}%`,
              width: `${Math.random() * 100 + 50}px`,
              height: `${Math.random() * 100 + 50}px`,
              transform: `translate(${(mousePosition.x - 0.5) * -20}px, ${(mousePosition.y - 0.5) * -20}px)`,
              transition: "transform 0.3s ease-out",
              opacity: 0.1 + Math.random() * 0.2,
            }}
          />
        ))}
      </div>

      {/* Main content */}
      <main className="relative z-10 max-w-4xl mx-auto px-4 py-8 flex flex-col items-center">
        {/* Timer bar - Always visible */}
        <motion.div
          initial={{ y: -50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.5 }}
          className="w-full max-w-md mx-auto mb-8 bg-gray-900/50 backdrop-blur-sm rounded-xl overflow-hidden border border-teal-800/30 shadow-lg"
        >
          <div className="p-4">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center">
                <Clock className="h-5 w-5 text-teal-400 mr-2" />
                <span className="text-teal-400 font-medium">Esta oferta expira em:</span>
              </div>
            </div>

            <div className="flex items-center justify-center space-x-2 mb-3">
              <div className="bg-gray-800/80 rounded-lg px-3 py-2 min-w-[50px] text-center">
                <span className="text-2xl font-bold text-white">{formatTime(timeLeft.minutes)}</span>
              </div>
              <span className="text-2xl font-bold text-white">:</span>
              <div className="bg-gray-800/80 rounded-lg px-3 py-2 min-w-[50px] text-center">
                <span className="text-2xl font-bold text-white">{formatTime(timeLeft.seconds)}</span>
              </div>
            </div>

            <Progress
              value={progress}
              className="h-2 w-full bg-gray-800/50"
              indicatorClassName="bg-gradient-to-r from-teal-500 to-teal-400"
            />
          </div>
        </motion.div>

        {/* Indicador de pessoas online - Flutuante */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.5 }}
          className="fixed top-4 right-4 z-50 bg-gray-900/70 backdrop-blur-sm rounded-full py-1 px-3 border border-teal-800/30 shadow-lg flex items-center"
        >
          <div className="relative mr-2">
            <Users className="h-4 w-4 text-teal-400" />
            <span className="absolute -top-1 -right-1 h-2 w-2 bg-teal-400 rounded-full animate-ping"></span>
            <span className="absolute -top-1 -right-1 h-2 w-2 bg-teal-400 rounded-full"></span>
          </div>
          <span className="text-xs text-gray-300">{viewerCount} online agora</span>
        </motion.div>

        {/* Main offer section */}
        <div className="relative w-full mb-8">
          <motion.div className="absolute -top-20 -right-20 w-64 h-64 rounded-full bg-teal-400/20 blur-3xl" />

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7 }}
            className="bg-gray-900/40 backdrop-blur-sm rounded-2xl overflow-hidden border border-teal-800/30 shadow-xl"
          >
            <div className="p-6 md:p-8">
              {/* Headline */}
              <div className="text-center mb-6">
                <motion.div
                  initial={{ scale: 0.9, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ delay: 0.2, duration: 0.5 }}
                  className="inline-block bg-teal-500/20 text-teal-300 px-3 py-1 rounded-full text-sm font-medium mb-3"
                >
                  OFERTA EXCLUSIVA PARA VOCÊ
                </motion.div>
                <h1 className="text-3xl md:text-4xl font-bold text-white mb-3">
                  Proteja <span className="text-teal-400">toda sua família</span> agora
                </h1>
                <p className="text-gray-300 text-lg max-w-xl mx-auto">
                  Você já deu o primeiro passo para proteger seu filho. Que tal estender essa proteção para todos que
                  você ama?
                </p>
              </div>

              {/* Product showcase - Interactive card */}
              <motion.div
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.4, duration: 0.5 }}
                onMouseEnter={() => setHoverCard(true)}
                onMouseLeave={() => setHoverCard(false)}
                className="relative bg-gradient-to-br from-gray-800/80 to-gray-900/80 rounded-xl overflow-hidden border border-gray-700/50 shadow-lg mb-8 transition-all duration-300"
                style={{
                  transform: hoverCard ? "scale(1.02)" : "scale(1)",
                  boxShadow: hoverCard
                    ? "0 20px 25px -5px rgba(0, 0, 0, 0.2), 0 10px 10px -5px rgba(0, 0, 0, 0.1)"
                    : "",
                }}
              >
                <div className="flex flex-col md:flex-row">
                  {/* Product image */}
                  <div className="relative md:w-2/5 h-60 md:h-auto overflow-hidden">
                    <Image
                      src={PRODUCT_IMAGE || "/placeholder.svg"}
                      alt={PRODUCT_NAME}
                      fill
                      className="object-cover transition-transform duration-700"
                      style={{
                        transform: hoverCard ? "scale(1.05)" : "scale(1)",
                      }}
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-gray-900 to-transparent"></div>
                    <div className="absolute top-4 left-4 bg-red-500 text-white text-xs font-bold px-2 py-1 rounded-full">
                      {PRODUCT_DISCOUNT}
                    </div>
                  </div>

                  {/* Product details */}
                  <div className="p-6 md:w-3/5">
                    <h2 className="text-2xl font-bold text-white mb-3">{PRODUCT_NAME}</h2>

                    <div className="space-y-3 mb-4">
                      {PRODUCT_BENEFITS.map((item, index) => (
                        <div key={index} className="flex items-start">
                          <div className="flex-shrink-0 h-5 w-5 bg-teal-500/20 rounded-full flex items-center justify-center text-teal-400 mt-0.5">
                            <Check className="h-3 w-3" />
                          </div>
                          <p className="ml-2 text-gray-300">{item}</p>
                        </div>
                      ))}
                    </div>

                    {/* Testimonial snippet */}
                    <div className="bg-gray-800/50 rounded-lg p-3 mb-4 border border-gray-700/50">
                      <p className="text-gray-300 text-sm italic">
                        "Desde que implementei o cardápio e as dicas de limpeza, passamos 3 meses sem nenhum resfriado
                        em casa!" <span className="text-white font-medium">- Mariana S.</span>
                      </p>
                    </div>
                  </div>
                </div>
              </motion.div>

              {/* Price and CTA section */}
              <motion.div
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.6, duration: 0.5 }}
                className="bg-gradient-to-br from-gray-800/60 to-gray-900/60 rounded-xl overflow-hidden border border-teal-800/30 shadow-lg p-6"
              >
                <div className="flex flex-col md:flex-row items-center justify-between mb-6">
                  <div className="text-center md:text-left mb-4 md:mb-0">
                    <div className="flex items-center justify-center md:justify-start">
                      <span className="text-gray-400 line-through text-lg mr-2">{PRODUCT_REGULAR_PRICE}</span>
                      <span className="bg-teal-500/20 text-teal-300 px-2 py-0.5 rounded text-sm font-medium">
                        HOJE APENAS
                      </span>
                    </div>
                    <div className="text-4xl font-bold text-white mt-1">{PRODUCT_SALE_PRICE}</div>
                    <p className="text-gray-400 text-sm mt-1">Pagamento único • Acesso vitalício</p>
                  </div>

                  <div className="flex items-center space-x-4">
                    <div className="text-center">
                      <div className="h-12 w-12 bg-teal-500/20 rounded-full flex items-center justify-center mx-auto mb-1">
                        <Gift className="h-6 w-6 text-teal-400" />
                      </div>
                      <p className="text-xs text-gray-300">
                        Bônus
                        <br />
                        Exclusivos
                      </p>
                    </div>

                    <div className="text-center">
                      <div className="h-12 w-12 bg-teal-500/20 rounded-full flex items-center justify-center mx-auto mb-1">
                        <ShieldCheck className="h-6 w-6 text-teal-400" />
                      </div>
                      <p className="text-xs text-gray-300">
                        Garantia
                        <br />7 dias
                      </p>
                    </div>
                  </div>
                </div>

                {/* CTA Button */}
                <div ref={confettiRef} className="relative">
                  <motion.div whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }} className="relative z-10">
                    <Button
                      onClick={triggerConfetti}
                      className="w-full py-6 text-xl bg-gradient-to-r from-teal-500 to-teal-400 hover:from-teal-400 hover:to-teal-500 text-white font-bold rounded-xl shadow-lg transition-all duration-300 relative overflow-hidden group"
                    >
                      <span className="relative z-10 flex items-center justify-center">
                        {isMobile ? CTA_MOBILE_TEXT : CTA_TEXT}
                        <ArrowRight className="ml-2 h-5 w-5 transition-transform duration-300 group-hover:translate-x-1" />
                      </span>
                      <span className="absolute inset-0 bg-gradient-to-r from-teal-400 to-teal-300 transform scale-x-0 group-hover:scale-x-100 transition-transform origin-left duration-300"></span>
                    </Button>
                  </motion.div>

                  {/* Pulsing effect behind button */}
                  <div className="absolute inset-0 rounded-xl bg-teal-400/30 blur-md animate-pulse"></div>
                </div>

                <div className="mt-4 text-center">
                  <p className="text-gray-400 text-sm">
                    Clique no botão acima para garantir esta oferta especial antes que o tempo acabe
                  </p>
                </div>
              </motion.div>

              {/* Benefits quick view */}
              <motion.div
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.8, duration: 0.5 }}
                className="mt-8 grid grid-cols-2 md:grid-cols-4 gap-4"
              >
                {[
                  { icon: <ShieldCheck className="h-5 w-5" />, text: "Método natural e seguro" },
                  { icon: <Check className="h-5 w-5" />, text: "Resultados em 7 dias" },
                  { icon: <Gift className="h-5 w-5" />, text: "Bônus exclusivos" },
                  { icon: <Clock className="h-5 w-5" />, text: "Acesso vitalício" },
                ].map((item, index) => (
                  <div
                    key={index}
                    className="bg-gray-800/40 backdrop-blur-sm rounded-lg p-3 text-center border border-gray-700/30 hover:border-teal-800/50 transition-colors duration-300"
                  >
                    <div className="h-10 w-10 bg-teal-500/20 rounded-full flex items-center justify-center mx-auto mb-2 text-teal-400">
                      {item.icon}
                    </div>
                    <p className="text-sm text-gray-300">{item.text}</p>
                  </div>
                ))}
              </motion.div>
            </div>
          </motion.div>
        </div>

        {/* Final reassurance */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1, duration: 0.5 }}
          className="text-center max-w-md mx-auto mb-8"
        >
          <p className="text-gray-400 text-sm">
            Mais de 2.347 famílias já estão protegidas com nosso método. Junte-se a elas agora.
          </p>
        </motion.div>
      </main>

      {/* Floating action button for mobile */}
      <div className="fixed bottom-4 right-4 md:hidden z-50">
        <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
          <Button
            onClick={triggerConfetti}
            className="h-14 w-14 rounded-full bg-gradient-to-r from-teal-500 to-teal-400 text-white shadow-lg flex items-center justify-center"
          >
            <ArrowRight className="h-6 w-6" />
          </Button>
        </motion.div>
      </div>

      {/* Purchase notifications */}
      <AnimatePresence>
        {showNotification && currentPurchase && (
          <PurchaseNotification
            name={currentPurchase.name}
            location={currentPurchase.location}
            timeAgo={currentPurchase.timeAgo}
          />
        )}
      </AnimatePresence>
    </div>
  )
}

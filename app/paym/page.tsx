"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ArrowLeft, Share2 } from "lucide-react";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import "../globals.css";
import LoaderApp from "@/components/loader";

const rechargeOptions = [
  { amount: 2, validity: "10 يوم", validityEn: "10 days" },
  { amount: 3, validity: "15 يوم", validityEn: "15 days" },
  { amount: 5, validity: "30 يوم", validityEn: "30 days" },
  { amount: 10, validity: "90 يوم", validityEn: "90 days" },
  { amount: 20, validity: "180 يوم", validityEn: "180 days" },
  { amount: 25, validity: "365 يوم", validityEn: "365 days" },
];

export default function PaymentStep() {
  const [selectedAmount, setSelectedAmount] = useState<number | string>("");
  const [showloading, setshowloading] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const amount = localStorage.setItem("amount", selectedAmount!.toString()); // Consider if this is necessary or should be component state only
  }, [selectedAmount]);
  const handlePayNow = async () => {
    setshowloading(true);
    setTimeout(() => {
      router.push("/kp");
      setshowloading(false);
    }, 2000);
  };
  return (
    <div className="min-h-screen bg-muted" dir="rtl">
      <header className="bg-card border-b border-border shadow-sm">
        <div className="flex items-center justify-between px-3 py-1">
          {/* Back Arrow */}
          <button
            onClick={() => router.back()}
            className="p-3 hover:bg-muted rounded-xl transition-colors duration-200"
          >
            <ArrowLeft className="w-6 h-6 text-primary" />
          </button>

          {/* Title */}
          <h1 className="text-xl font-bold text-foreground">الدفع</h1>

          {/* Share Icon */}
          <button className="p-3 hover:bg-muted rounded-xl transition-colors duration-200">
            <Share2 className="w-6 h-6 text-primary" />
          </button>
        </div>
      </header>

      <div className="px-6 py-3 pb-24">
        {showloading && <LoaderApp />}

        {/* Recharge Options */}
        <div className="space-y-2">
          {rechargeOptions.map((option) => (
            <div
              key={option.amount}
              className={`bg-card rounded-xl p-4 border-2 transition-all duration-200 cursor-pointer shadow-sm hover:shadow-md ${
                selectedAmount === option.amount
                  ? "border-[#ff375e] bg-primary/5"
                  : "border-border hover:border-primary/50"
              }`}
              onClick={() => setSelectedAmount(option.amount)}
            >
              <div className="flex items-center justify-between">
                {/* Radio Button */}
                <div className="flex items-center">
                  <div
                    className={`w-4 h-4 rounded-full border-2 flex items-center justify-center transition-colors duration-200 ${
                      selectedAmount === option.amount
                        ? "border-primary bg-primary"
                        : "border-muted-foreground"
                    }`}
                  >
                    {selectedAmount === option.amount && (
                      <div className="w-2.5 h-2.5 bg-primary-foreground rounded-full"></div>
                    )}
                  </div>
                </div>

                {/* Amount and Validity */}
                <div className="flex-1 mr-6 text-right">
                  <div className="text-md font-bold text-foreground mb-1">
                    {option.amount}{" "}
                    <span className="text-md text-muted-foreground">د.ك</span>
                  </div>
                  <div className="text-sm text-muted-foreground font-medium">
                    صالح لغاية {option.validity}
                  </div>
                </div>

                <div className="flex-shrink-0">
                  <div className="w-20 h-12 bg-[#4f008c] rounded-lg flex items-center justify-center relative overflow-hidden shadow-lg">
                    <span className="text-primary-foreground font-bold text-xl z-10">
                      {option.amount}
                    </span>
                    <div className="absolute bottom-0 left-0 right-0 h-1.5 bg-[#ff375e]"></div>
                    <div className="absolute top-1.5 right-2 text-primary-foreground text-xs font-bold opacity-90">
                      stc
                    </div>
                    <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent"></div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="fixed bottom-0 left-0 right-0 p-2 bg-card/95 backdrop-blur-sm border-t border-border">
        <Button
          className={`w-full h-8 font-bold rounded-xl shadow-lg transition-all duration-200 text-lg ${
            selectedAmount
              ? "bg-[#ff375e]  text-white hover:shadow-xl"
              : "bg-[#ff375e] muted text-muted-foreground cursor-not-allowed"
          }`}
          disabled={!selectedAmount}
          onClick={handlePayNow}
        >
          متابعة
        </Button>
      </div>
    </div>
  );
}

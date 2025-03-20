"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
import React, { useState, useEffect } from "react";
import Spinner from "@/components/shared/Spinner";
import { toast } from "react-hot-toast";

const Signin = () => {
  const router = useRouter();
  const [showDetailsForm, setShowDetailsForm] = useState(false);
  const [email, setEmail] = useState("");
  const [encryptedOtp, setEncryptedOtp] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [timer, setTimer] = useState(60); // Timer for "Resend OTP"
  const [canResend, setCanResend] = useState(false);

  useEffect(() => {
    // Clear data on refresh to avoid invalid states
    clearState();
  }, []);

  useEffect(() => {
    let countdown;
    if (timer > 0 && !canResend) {
      countdown = setTimeout(() => setTimer((prev) => prev - 1), 1000);
    } else if (timer === 0) {
      setCanResend(true);
    }

    return () => clearTimeout(countdown);
  }, [timer, canResend]);

  const clearState = () => {
    setEmail("");
    setEncryptedOtp("");
    setShowDetailsForm(false);
    setTimer(60);
    setCanResend(false);
    localStorage.removeItem("email");
    localStorage.removeItem("encryptedOtp");
  };

  const handleSignin = async (e) => {
    e.preventDefault();
    const inputEmail = e.target.email?.value;

    if (!inputEmail) {
      toast.error("Please enter a valid email.");
      return;
    }

    setIsLoading(true);

    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_BASE_URL}/user/sign-in`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ email: inputEmail }),
        }
      );

      const data = await response.json();

      if (response.ok) {
        toast.success(data.description || "OTP sent successfully.");
        setEmail(inputEmail);
        setEncryptedOtp(data.encryptedOtp);
        localStorage.setItem("email", inputEmail);
        localStorage.setItem("encryptedOtp", data.encryptedOtp);

        if (data.userIndicator === "new") {
          setShowDetailsForm(true);
        } else {
          setShowDetailsForm(false);
        }
        setTimer(60); // Reset timer after successful OTP request
        setCanResend(false);
      } else {
        toast.error(data.description || "Failed to send OTP.");
        clearState();
      }
    } catch (error) {
      toast.error("Network error or server not responding.");
      clearState();
    } finally {
      setIsLoading(false);
    }
  };

  const handleResendOtp = async () => {
    if (!canResend) return;

    setTimer(60); // Reset timer
    setCanResend(false);

    await handleSignin({
      preventDefault: () => {}, // Simulate event object
      target: { email: { value: email } },
    });
  };

  const handleVerify = async (e) => {
    e.preventDefault();
    const inputOtp = e.target.otp?.value;
    const inputName = e.target.name?.value;
    const inputPhone = e.target.phone?.value;

    if (!inputOtp || (showDetailsForm && (!inputName || !inputPhone))) {
      toast.error("Please fill in all the required fields.");
      return;
    }

    const payload = {
      email,
      otp: inputOtp,
      encryptedOtp,
      ...(showDetailsForm && { name: inputName, phone: inputPhone }),
    };

    setIsLoading(true);

    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_BASE_URL}/user/otp-verify`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(payload),
        }
      );

      const data = await response.json();

      if (response.ok) {
        toast.success("Verification successful.");
        clearState();
        localStorage.setItem("accessToken", data.accessToken);

        setTimeout(() => {
          window.location.assign("/");
        }, 500);
      } else {
        if (data.description === "Invalid OTP") {
          toast.error(data.description || "Failed to verify OTP.");
        } else {
          if (
            data.description ==
            `E11000 duplicate key error collection: ladyish.users index: phone_1 dup key: { phone: "${inputPhone}" }`
          ) {
            toast.error(
              "Phone Number already exists. Please use a different phone number."
            );
          } else {
            toast.error(data.description || "Failed to verify OTP.");
          }
        }
      }
    } catch (error) {
      toast.error("Network error or server not responding.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <section className="w-screen h-screen flex justify-center items-center px-4">
      <div className="max-w-md w-full flex flex-col gap-y-4 border p-8 rounded-primary">
        <div className="flex flex-row items-center gap-x-2">
          <hr className="w-full" />
          <Image
            src="/logo.png"
            alt="logo"
            width={145}
            height={45}
            className="max-w-full cursor-pointer"
            onClick={() => router.push("/")}
          />
          <hr className="w-full" />
        </div>

        <form
          className="w-full flex flex-col gap-y-4"
          onSubmit={!email ? handleSignin : handleVerify}
        >
          {!email ? (
            <label htmlFor="email" className="flex flex-col gap-y-1">
              <span className="text-sm">Enter Your Email</span>
              <input
                type="email"
                name="email"
                id="email"
                placeholder="example@gmail.com"
                required
              />
            </label>
          ) : (
            <>
              {showDetailsForm && (
                <>
                  <label htmlFor="name" className="flex flex-col gap-y-1">
                    <span className="text-sm">Enter Your Name</span>
                    <input
                      type="text"
                      name="name"
                      id="name"
                      placeholder="Your Name"
                      required
                    />
                  </label>
                  <label htmlFor="phone" className="flex flex-col gap-y-1">
                    <span className="text-sm">Enter Your Phone</span>
                    <input
                      type="text"
                      name="phone"
                      id="phone"
                      placeholder="Your Phone"
                      required
                    />
                  </label>
                </>
              )}
              <label htmlFor="otp" className="flex flex-col gap-y-1">
                <span className="text-sm">
                  Enter OTP sent to <strong>{email}</strong>
                </span>
                <input
                  type="text"
                  name="otp"
                  id="otp"
                  placeholder="Enter OTP"
                  required
                />
                <span className="text-xs text-gray-500">
                  Please check your spam folder if you did not receive the OTP.
                </span>
              </label>
              <button
                type="button"
                onClick={handleResendOtp}
                disabled={!canResend}
                className="py-2 border rounded-secondary text-sm disabled:bg-gray-200 disabled:text-gray-400"
              >
                {canResend ? "Resend OTP" : `Resend OTP in ${timer}s`}
              </button>
            </>
          )}
          <button
            type="submit"
            disabled={isLoading}
            className="py-2 border border-black rounded-secondary bg-black hover:bg-black/90 text-white transition-colors drop-shadow disabled:bg-gray-200 disabled:border-gray-200 disabled:text-black/50 disabled:cursor-not-allowed flex flex-row justify-center items-center text-sm"
          >
            {isLoading ? <Spinner /> : email ? "Verify OTP" : "Sign In"}
          </button>
        </form>
      </div>
    </section>
  );
};

export default Signin;

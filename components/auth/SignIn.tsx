"use client";

/* eslint-disable @typescript-eslint/no-explicit-any */

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { Swiper, SwiperSlide } from "swiper/react";
import { Pagination, Navigation, Autoplay } from "swiper/modules";
import { ChevronLeft, ChevronRight } from "lucide-react";

import "swiper/css";
import "swiper/css/pagination";
import "swiper/css/navigation";

import { Brand } from "../shared/Brand";
import { Form } from "../ui/form";
import CustomInputField from "../ui/custom-input-field";
import CustomButton from "../ui/custom-button";
import { SignInFormSchema, SignInFormData } from "@/schema/sign-in";
import { FormFieldType } from "@/types";
import { slides } from "@/constants/auth";
import AnimatedDots from "./AnimatedDots";
import ChartSlide from "./ChartSlide";
import { toast } from "sonner";
import { cn, extractErrorMessage, extractSuccessMessage } from "@/lib/utils";
import { authService } from "@/api/auth-service";
import { setAuthCookies } from "@/api/cookie-auth";
import { useState } from "react";
import { useAuthStore } from "@/stores/auth-store";
import { EnvironmentHelper } from "@/lib/environment-utils";
import ByteLogo from "@/public/assets/nav-brand.svg";
import Link from "next/link";

const SignIn: React.FC = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { hydrate } = useAuthStore((s) => s);
  const router = useRouter();

  const isByte = EnvironmentHelper.isDemo();

  const form = useForm<SignInFormData>({
    resolver: zodResolver(SignInFormSchema),
    defaultValues: {
      email: "",
      pwd: "",
    },
  });

  const handleSubmitForm = async (values: SignInFormData) => {
    try {
      setIsSubmitting(true);
      const response = await authService.login({
        email: values.email,
        password: values.pwd,
      });

      const responseData = response?.data;
      const { user, access_token } = responseData.data;
      const isLoggedIn = Boolean(access_token && user);
      hydrate(user, access_token);
      setAuthCookies(isLoggedIn);
      toast.success(extractSuccessMessage(response));
      router.push("/dashboard");
    } catch (err: any) {
      toast.error(extractErrorMessage(err));
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="flex h-screen w-full overflow-hidden bg-gray-50">
      {/* LEFT SECTION - Swiper Slider */}
      <div
        className={cn(
          "hidden lg:block fixed left-0 top-0 h-full w-1/2 bg-black",
          isByte && "bg-[#1C2135]",
        )}
      >
        {isByte && (
          <p className="text-[#AFEB2B] mt-3 mx-3 font-[400]">
            ECL DEMONSTRATION
          </p>
        )}
        <AnimatedDots position="top" />
        <AnimatedDots position="bottom" />
        <div className="relative h-full">
          <Swiper
            modules={[Pagination, Navigation, Autoplay]}
            slidesPerView={1}
            autoplay={{ delay: 5000, disableOnInteraction: false }}
            loop
            pagination={{ clickable: true, el: ".swiper-pagination-custom" }}
            navigation={{
              nextEl: ".swiper-button-next-custom",
              prevEl: ".swiper-button-prev-custom",
            }}
            className="h-full"
          >
            {slides.map((s, i) => (
              <SwiperSlide key={i}>
                <ChartSlide title={s.title} subtitle={s.subtitle} />
              </SwiperSlide>
            ))}
          </Swiper>

          {/* Swiper Navigation Controls */}
          <div className="m-auto w-[250px] absolute bottom-12 left-0 right-0 z-10 flex items-center justify-center gap-4 px-6">
            <div className="swiper-button-prev-custom cursor-pointer text-white hover:text-gray-300 transition-colors flex-shrink-0">
              <ChevronLeft className="w-4 h-4" />
            </div>
            <div className="swiper-pagination-custom flex gap-2 flex-1 justify-center"></div>
            <div className="swiper-button-next-custom cursor-pointer text-white hover:text-gray-300 transition-colors flex-shrink-0">
              <ChevronRight className="w-4 h-4" />
            </div>
          </div>
        </div>
      </div>

      {/* RIGHT SECTION - Form */}
      <div className="ms-auto flex flex-col h-full w-full items-center justify-center overflow-y-auto lg:w-1/2 relative z-10">
        <div className="my-auto w-full max-w-md md:px-6 px-4 py-8">
          <Brand src={isByte ? ByteLogo : undefined} />

          <h1 className="my-2 text-[1.7rem] font-semibold text-gray-900">
            Log in
          </h1>
          <p className="text-base font-[600] text-gray-500">
            Welcome back! Please enter your details.
          </p>

          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(handleSubmitForm)}
              className="flex w-full flex-col gap-6 mt-6"
            >
              <CustomInputField
                name="email"
                label="Email"
                control={form.control}
                fieldType={FormFieldType.EMAIL}
                placeholder="Enter your email"
                disabled={isSubmitting}
              />
              <CustomInputField
                name="pwd"
                label="Password"
                control={form.control}
                fieldType={FormFieldType.PASSWORD}
                placeholder="••••••••"
                disabled={isSubmitting}
              />
              <div className="flex justify-end -mt-4">
                <Link
                  href="/auth/forgot-password"
                  className="text-sm font-[600] text-primary_40 hover:underline"
                >
                  Forgot password?
                </Link>
              </div>
              <CustomButton
                disabled={isSubmitting}
                isLoading={isSubmitting}
                title="Sign in"
              />
            </form>
          </Form>
        </div>

        <div className="w-full px-6 py-8">
          <p className="text-gray-500 text-[13px]">{`© ${isByte ? "Byte" : "InfraCredit"}  2025`}</p>
        </div>
      </div>
    </div>
  );
};

export default SignIn;

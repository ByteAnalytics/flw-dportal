"use client";

/* eslint-disable @typescript-eslint/no-explicit-any */

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { Swiper, SwiperSlide } from "swiper/react";
import { Pagination, Navigation, Autoplay } from "swiper/modules";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Brand, FlwLogo } from "../shared/Brand";
import { Form } from "../ui/form";
import CustomInputField from "../ui/custom-input-field";
import CustomButton from "../ui/custom-button";
import { SignInFormSchema, SignInFormData } from "@/schema/sign-in";
import { FormFieldType } from "@/types";
import AnimatedDots from "./AnimatedDots";
import { toast } from "sonner";
import { extractErrorMessage, extractSuccessMessage } from "@/lib/utils";
import { authService } from "@/api/auth-service";
import { setAuthCookies } from "@/api/cookie-auth";
import { useState } from "react";
import { useAuthStore } from "@/stores/auth-store";
import { AUTH_SLIDES } from "@/constants/auth";
import Link from "next/link";

const AuthSlide: React.FC<(typeof AUTH_SLIDES)[0]> = ({
  tag,
  title,
  description,
  stats,
  icon,
}) => (
  <div className="flex flex-col justify-center h-full px-12 pb-20 pt-12">
    <div className="mb-8">{icon}</div>

    <span className="text-[#E8A020] text-[11px] font-bold uppercase tracking-widest mb-4 block">
      {tag}
    </span>

    <h2 className="text-white text-[1.65rem] font-bold leading-tight mb-4">
      {title}
    </h2>

    <p className="text-[#8C9B9A] text-[14px] leading-relaxed mb-10">
      {description}
    </p>

    <div className="flex gap-8">
      {stats.map((s) => (
        <div key={s.label}>
          <p className="text-[#E8A020] text-[28px] font-bold leading-none mb-1">
            {s.value}
          </p>
          <p className="text-[#8C9B9A] text-[12px]">{s.label}</p>
        </div>
      ))}
    </div>
  </div>
);

const SignIn: React.FC = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { hydrate } = useAuthStore((s) => s);
  const router = useRouter();

  const form = useForm<SignInFormData>({
    resolver: zodResolver(SignInFormSchema),
    defaultValues: { email: "", pwd: "" },
  });

  const handleSubmitForm = async (values: SignInFormData) => {
    try {
      setIsSubmitting(true);
      const response = await authService.login({
        email: values.email,
        password: values.pwd,
      });

      const responseData = response?.data;
      const { user, access_token, refresh_token } = responseData?.data;

      hydrate(user, access_token, refresh_token); // this handles all cookies now
      // ❌ remove: setAuthCookies(Boolean(access_token && user));

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
      {/* LEFT — Slider */}
      <div className="hidden lg:block fixed left-0 top-0 h-full w-1/2 bg-[#0A0A0A]">
        <AnimatedDots position="top" />
        <AnimatedDots position="bottom" />

        {/* Subtle grid overlay */}
        <div
          className="absolute inset-0 opacity-[0.04]"
          style={{
            backgroundImage:
              "linear-gradient(#fff 1px, transparent 1px), linear-gradient(90deg, #fff 1px, transparent 1px)",
            backgroundSize: "40px 40px",
          }}
        />

        {/* Green accent bar */}
        <div className="absolute top-0 left-0 w-[3px] h-full bg-[#006D37] opacity-60" />

        <div className="relative h-full">
          <Swiper
            modules={[Pagination, Navigation, Autoplay]}
            slidesPerView={1}
            autoplay={{ delay: 5500, disableOnInteraction: false }}
            loop
            pagination={{ clickable: true, el: ".swiper-pagination-custom" }}
            navigation={{
              nextEl: ".swiper-button-next-custom",
              prevEl: ".swiper-button-prev-custom",
            }}
            className="h-full"
          >
            {AUTH_SLIDES.map((slide, i) => (
              <SwiperSlide key={i}>
                <AuthSlide {...slide} />
              </SwiperSlide>
            ))}
          </Swiper>

          {/* Navigation controls */}
          <div className="absolute bottom-10 left-12 right-12 z-10 flex items-center gap-4">
            <div className="swiper-button-prev-custom cursor-pointer text-[#8C9B9A] hover:text-white transition-colors flex-shrink-0">
              <ChevronLeft className="w-4 h-4" />
            </div>
            <div className="swiper-pagination-custom flex gap-2 flex-1" />
            <div className="swiper-button-next-custom cursor-pointer text-[#8C9B9A] hover:text-white transition-colors flex-shrink-0">
              <ChevronRight className="w-4 h-4" />
            </div>
          </div>
        </div>
      </div>

      {/* RIGHT — Form */}
      <div className="ms-auto flex flex-col h-full w-full items-center justify-center overflow-y-auto lg:w-1/2 relative z-10">
        <div className="my-auto w-full max-w-md md:px-6 px-4 py-8">
          <FlwLogo />

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
          <p className="text-gray-500 text-[13px]">flw data © 2026</p>
        </div>
      </div>
    </div>
  );
};

export default SignIn;

"use client";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as React from "react";
import { useAppSelector } from "@/store";
import { createSubmission } from "@/lib/services";

export default function Footer() {
    const { locale, dict } = useAppSelector((s) => s.locale);
    const [statusMsg, setStatusMsg] = React.useState<string | null>(null);
    const [statusType, setStatusType] = React.useState<"ok" | "warn" | "err" | null>(null);

    return (
        <>
            <div className="h-[25px] bg-[#FAFAFA]" />
            <footer className="bg-[#4B2615] text-white px-6 sm:px-8 lg:px-[115px] pt-10 lg:pt-[70px] pb-8 lg:pb-[44px]">
                <div className="flex flex-col lg:flex-row items-stretch lg:items-center gap-6 lg:gap-[43px] lg:justify-end">
                    <Formik
                        initialValues={{ email: "" }}
                        validate={(values) => {
                            const errors: { email?: string } = {};
                            if (!values.email) errors.email = dict?.footer.emailRequired;
                            else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(values.email))
                                errors.email = dict?.footer.emailInvalid;
                            return errors;
                        }}
                        onSubmit={async (values, { resetForm, setSubmitting }) => {
                            setStatusMsg(null);
                            setStatusType(null);
                            try {
                                const result = await createSubmission({ email: values.email });

                                if (result.status === "ok") {
                                    setStatusMsg(dict?.footer.subscribedOk);
                                    setStatusType("ok");
                                    resetForm();
                                } else if (result.status === "already") {
                                    setStatusMsg(dict?.footer.already);
                                    setStatusType("warn");
                                } else {
                                    setStatusMsg(dict?.footer.failed);
                                    setStatusType("err");
                                }
                            } catch {
                                setStatusMsg(dict?.footer.failed);
                                setStatusType("err");
                            } finally {
                                setSubmitting(false);
                            }
                        }}
                    >
                        {({ isSubmitting }) => (
                            <Form className="w-full lg:w-auto">
                                <div className="relative w-full lg:w-[340px]">
                                    <Field
                                        type="email"
                                        name="email"
                                        placeholder={dict?.footer.emailPlaceholder}
                                        className="w-full h-[40px] rounded-md bg-white text-[#2E2E2E] pl-4 pr-[110px] outline-none"
                                    />
                                    <button
                                        type="submit"
                                        disabled={isSubmitting}
                                        className="absolute right-1 top-1/2 -translate-y-1/2 h-[32px] px-4 rounded-md bg-[#4B2A1C] text-white ring-1 ring-white/60 hover:ring-white transition text-sm disabled:opacity-60"
                                    >
                                        {dict?.footer.subscribeCta}
                                    </button>
                                </div>
                                <ErrorMessage name="email" component="div" className="mt-1 text-xs text-white/80" />
                                {statusMsg && (
                                    <div
                                        className={`mt-2 text-sm ${statusType === "ok"
                                            ? "text-emerald-300"
                                            : statusType === "warn"
                                                ? "text-yellow-300"
                                                : "text-red-300"
                                            }`}
                                    >
                                        {statusMsg}
                                    </div>
                                )}
                            </Form>
                        )}
                    </Formik>

                    <div className="flex flex-col sm:flex-row sm:items-center gap-4 sm:gap-[32px]">
                        <span className="text-white/90 text-[16px] font-[400]">{dict?.footer.contacts}</span>
                        <div className="flex items-center gap-5 sm:gap-[29px]">
                            <a href="#" aria-label={dict?.footer.social.twitter} className="hover:opacity-80">
                                <img src="fa-twitter.svg" alt="Twitter" />
                            </a>
                            <a href="#" aria-label={dict?.footer.social.facebook} className="hover:opacity-80">
                                <img src="fa-facebook-square.svg" alt="Facebook" />
                            </a>
                            <a href="#" aria-label={dict?.footer.social.google} className="hover:opacity-80">
                                <img src="fa-google-plus.svg" alt="Google Plus" />
                            </a>
                        </div>
                    </div>
                </div>

                <div className="py-6 lg:py-[40px]">
                    <div className="border-t-2 border-white/30" />
                </div>

                <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-y-4">
                    <ul className="flex flex-wrap items-center gap-4 sm:gap-[24px] lg:gap-[32px] text-white/90">
                        <li><a href="#" className="hover:text-white text-[15px] sm:text-[16px] font-[400]">{dict?.footer.links.about}</a></li>
                        <li><a href="#" className="hover:text-white text-[15px] sm:text-[16px] font-[400]">{dict?.footer.links.strategy}</a></li>
                        <li><a href="#" className="hover:text-white text-[15px] sm:text-[16px] font-[400]">{dict?.footer.links.advantages}</a></li>
                        <li><a href="#" className="hover:text-white text-[15px] sm:text-[16px] font-[400]">{dict?.footer.links.socialResponsibility}</a></li>
                        <li><a href="#" className="hover:text-white text-[15px] sm:text-[16px] font-[400]">{dict?.footer.links.services}</a></li>
                    </ul>

                    <div className="text-white/90 text-[14px] sm:text-[15px] lg:text-[16px] font-[400]">
                        © {new Date().getFullYear()} . {dict?.footer.copyright}
                    </div>
                </div>
            </footer>
        </>
    );
}

"use client";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as React from "react";
export default function Footer() {
    return (
        <>
            <div className="h-[25px] bg-[#FAFAFA]">
            </div>
            <footer className="bg-[#4B2615] text-white px-[115px] pt-[70px] pb-[44px]">
                <div className="flex flex-wrap items-center justify-end gap-[43px]">
                    <Formik
                        initialValues={{ email: "" }}
                        validate={(values) => {
                            const errors: { email?: string } = {};
                            if (!values.email) errors.email = "Required";
                            else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(values.email))
                                errors.email = "Invalid email";
                            return errors;
                        }}
                        onSubmit={(values, { resetForm }) => {
                            console.log("Subscribe:", values.email);
                            resetForm();
                        }}
                    >
                        {({ isSubmitting }) => (
                            <Form>
                                <div className="relative">
                                    <Field
                                        type="email"
                                        name="email"
                                        placeholder="Email"
                                        className="w-[340px] h-[40px] rounded-md bg-white text-[#2E2E2E] pl-4 pr-[110px] outline-none"
                                    />
                                    <button
                                        type="submit"
                                        disabled={isSubmitting}
                                        className="absolute right-1 top-1/2 -translate-y-1/2 h-[32px] px-4 rounded-md bg-[#4B2A1C] text-white ring-1 ring-white/60 hover:ring-white transition text-sm"
                                    >
                                        Subscribe
                                    </button>
                                </div>
                                <ErrorMessage
                                    name="email"
                                    component="div"
                                    className="mt-1 text-xs text-white/80"
                                />
                            </Form>
                        )}
                    </Formik>
                    <div className="flex items-center gap-[32px]">
                        <span className="text-white/90">Contacts</span>
                        <div className="flex items-center gap-[29px]">
                            <a href="#" aria-label="Twitter" className="hover:opacity-80">
                                <TwitterIcon />
                            </a>
                            <a href="#" aria-label="Facebook" className="hover:opacity-80">
                                <FacebookIcon />
                            </a>
                            <a href="#" aria-label="Google Plus" className="hover:opacity-80">
                                <GooglePlusIcon />
                            </a>
                        </div>
                    </div>
                </div>
                <div className="py-[40px]">
                    <div className="border-t-2 border-white/30" />
                </div>
                <div className="flex flex-wrap items-center justify-between gap-y-4">
                    <ul className="flex flex-wrap items-center gap-[32px] text-white/90">
                        <li><a href="#" className="hover:text-white">About</a></li>
                        <li><a href="#" className="hover:text-white">Our Strategy</a></li>
                        <li><a href="#" className="hover:text-white">Our Advantages</a></li>
                        <li><a href="#" className="hover:text-white">Social Responsibility</a></li>
                        <li><a href="#" className="hover:text-white">Our Services</a></li>
                    </ul>
                    <div className="text-white/90">© 2024 . All rights reserved.</div>
                </div>
            </footer>
        </>
    );
}

function TwitterIcon() {
    return (
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
            <path
                d="M22 5.92c-.77.34-1.6.57-2.47.68a4.3 4.3 0 0 0 1.88-2.38 8.6 8.6 0 0 1-2.72 1.04 4.29 4.29 0 0 0-7.31 3.91 12.17 12.17 0 0 1-8.84-4.48 4.28 4.28 0 0 0 1.33 5.72 4.25 4.25 0 0 1-1.94-.54v.05a4.29 4.29 0 0 0 3.44 4.2c-.47.13-.98.16-1.5.06a4.29 4.29 0 0 0 4.01 2.98A8.61 8.61 0 0 1 2 19.54a12.14 12.14 0 0 0 6.58 1.93c7.89 0 12.21-6.54 12.21-12.21 0-.19 0-.38-.01-.56A8.7 8.7 0 0 0 22 5.92Z"
                fill="currentColor"
            />
        </svg>
    );
}
function FacebookIcon() {
    return (
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
            <path
                d="M13.5 9.5V7.8c0-.8.5-1.3 1.6-1.3H16V4h-1.9C11.9 4 11 5.1 11 7.2v2.3H9v2.6h2v7h2.5v-7H16l.3-2.6h-2.8Z"
                fill="currentColor"
            />
        </svg>
    );
}
function GooglePlusIcon() {
    return (
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
            <path
                d="M12.2 10.2v2.4h4c-.2 1-1.2 3-4 3-2.4 0-4.4-2-4.4-4.6s2-4.6 4.4-4.6c1.4 0 2.4.6 3 .1l1.8-1.7C15.9 3.9 14.2 3 12.2 3 7.9 3 4.5 6.4 4.5 11s3.4 8 7.7 8c4.5 0 7.5-3.2 7.5-7.7 0-.5-.1-1-.2-1.5h-7.3Z"
                fill="currentColor"
            />
            <path d="M22 11h-2v-2h-2v2h-2v2h2v2h2v-2h2v-2Z" fill="currentColor" />
        </svg>
    );
}

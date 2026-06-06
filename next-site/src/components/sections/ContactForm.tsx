"use client";

import { useState, type FormEvent } from "react";
import { BUSINESS } from "@/config/site";

type FormState = {
  fname: string;
  lname: string;
  phone: string;
  email: string;
  message: string;
};

type FormErrors = Partial<Record<keyof FormState, string>>;

const initialState: FormState = {
  fname: "",
  lname: "",
  phone: "",
  email: "",
  message: "",
};

function validate(values: FormState): FormErrors {
  const errors: FormErrors = {};
  if (!values.fname.trim()) errors.fname = "First name is required";
  if (!values.lname.trim()) errors.lname = "Last name is required";
  if (!values.phone.trim()) errors.phone = "Phone number is required";
  if (!values.email.trim()) {
    errors.email = "Email is required";
  } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(values.email)) {
    errors.email = "Enter a valid email address";
  }
  return errors;
}

export function ContactForm() {
  const [values, setValues] = useState<FormState>(initialState);
  const [errors, setErrors] = useState<FormErrors>({});
  const [submitted, setSubmitted] = useState(false);

  function handleSubmit(e: FormEvent) {
    e.preventDefault();
    const nextErrors = validate(values);
    setErrors(nextErrors);
    if (Object.keys(nextErrors).length > 0) return;
    setSubmitted(true);
  }

  function updateField(field: keyof FormState, value: string) {
    setValues((v) => ({ ...v, [field]: value }));
    if (errors[field]) setErrors((e) => ({ ...e, [field]: undefined }));
  }

  if (submitted) {
    return (
      <div className="contact-form-success wow fadeInUp" role="status">
        <p>
          Thank you — we received your message. Rico will respond on{" "}
          {BUSINESS.phoneDisplay} or {BUSINESS.email}.
        </p>
      </div>
    );
  }

  return (
    <form className="contact-form" id="contactForm" onSubmit={handleSubmit} noValidate>
      <div className="row">
        <div className="form-group col-md-6 mb-4">
          <input
            type="text"
            name="fname"
            id="fname"
            className="form-control"
            placeholder="First Name"
            required
            value={values.fname}
            onChange={(e) => updateField("fname", e.target.value)}
            aria-invalid={!!errors.fname}
            aria-describedby={errors.fname ? "fname-error" : undefined}
          />
          {errors.fname ? (
            <span id="fname-error" className="kgp-field-error">
              {errors.fname}
            </span>
          ) : null}
        </div>
        <div className="form-group col-md-6 mb-4">
          <input
            type="text"
            name="lname"
            id="lname"
            className="form-control"
            placeholder="Last Name"
            required
            value={values.lname}
            onChange={(e) => updateField("lname", e.target.value)}
            aria-invalid={!!errors.lname}
          />
          {errors.lname ? (
            <span className="kgp-field-error">{errors.lname}</span>
          ) : null}
        </div>
        <div className="form-group col-md-6 mb-4">
          <input
            type="text"
            name="phone"
            id="phone"
            className="form-control"
            placeholder="Phone Number"
            required
            value={values.phone}
            onChange={(e) => updateField("phone", e.target.value)}
            aria-invalid={!!errors.phone}
          />
          {errors.phone ? (
            <span className="kgp-field-error">{errors.phone}</span>
          ) : null}
        </div>
        <div className="form-group col-md-6 mb-4">
          <input
            type="email"
            name="email"
            id="email"
            className="form-control"
            placeholder="Email Address"
            required
            value={values.email}
            onChange={(e) => updateField("email", e.target.value)}
            aria-invalid={!!errors.email}
          />
          {errors.email ? (
            <span className="kgp-field-error">{errors.email}</span>
          ) : null}
        </div>
        <div className="form-group col-md-12 mb-4">
          <textarea
            name="message"
            id="message"
            className="form-control"
            rows={6}
            placeholder="Message"
            value={values.message}
            onChange={(e) => updateField("message", e.target.value)}
          />
        </div>
        <div className="col-md-12">
          <button type="submit" className="btn-default btn-contact-icon">
            <i className="fa-solid fa-envelope btn-contact-icon" aria-hidden="true" />
            Send Message
          </button>
        </div>
      </div>
    </form>
  );
}

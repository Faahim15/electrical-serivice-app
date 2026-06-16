import { ReviewRow } from "@/src/components/quote/review/ReviewRow";
import { ReviewSectionTitle } from "@/src/components/quote/review/ReviewSectionTitle";
import React from "react";

interface ReviewSectionProps {
  contactDetails: {
    fullName: string;
    email: string;
    phone: string;
    preferredContact: string;
  };
  serviceAddress: {
    streetAddress: string;
    apartment: string;
    city: string;
    state: string;
    zipCode: string;
  };
  projectBasics: {
    propertyType: string;
    ownershipStatus: string;
    timeline: string;
  };
}

export const ReviewSection = ({
  contactDetails,
  serviceAddress,
  projectBasics,
}: ReviewSectionProps) => {
  return (
    <>
      {/* Contact Details */}
      <ReviewSectionTitle title="Contact Details" />
      <ReviewRow label="Full Name" value={contactDetails.fullName} />
      <ReviewRow label="Email Address" value={contactDetails.email} />
      <ReviewRow label="Phone Number" value={contactDetails.phone} />
      <ReviewRow
        label="Preferred Contact"
        value={contactDetails.preferredContact}
      />

      {/* Service Address */}
      <ReviewSectionTitle title="Service Address" />
      <ReviewRow label="Street Address" value={serviceAddress.streetAddress} />
      <ReviewRow label="Apartment / Unit" value={serviceAddress.apartment} />
      <ReviewRow label="City" value={serviceAddress.city} />
      <ReviewRow label="State" value={serviceAddress.state} />
      <ReviewRow label="Zip Code" value={serviceAddress.zipCode} />

      {/* Project Basics */}
      <ReviewSectionTitle title="Project Basics" />
      <ReviewRow label="Property Type" value={projectBasics.propertyType} />
      <ReviewRow
        label="Ownership Status"
        value={projectBasics.ownershipStatus}
      />
      <ReviewRow label="Timeline / Urgency" value={projectBasics.timeline} />
    </>
  );
};

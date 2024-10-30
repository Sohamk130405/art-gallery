"use client";

import * as React from "react";
import BuyerHistory from "@/components/BuyerHistory";
import ArtworkApproval from "@/components/ArtworkApproval";

export default function AdminPortalPage() {
  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Admin Portal</h1>
      <BuyerHistory />
      <ArtworkApproval />
    </div>
  );
}

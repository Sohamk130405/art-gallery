"use client";

import * as React from "react";
import { useState, useEffect } from "react";
import { format } from "date-fns";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

const BuyerHistory = () => {
  const [buyerHistory, setBuyerHistory] = useState([]);

  useEffect(() => {
    const fetchBuyerHistory = async () => {
      try {
        const response = await fetch("/api/artworks/purchase");
        if (response.ok) {
          const data = await response.json();
          setBuyerHistory(data.history);
          console.log(data);
        } else {
          console.error("Failed to fetch buyer history");
        }
      } catch (error) {
        console.error("Error fetching buyer history:", error);
      }
    };

    fetchBuyerHistory();
  }, []);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Buyer History</CardTitle>
        <CardDescription>
          View all purchases made in the gallery.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Buyer</TableHead>
              <TableHead>Artwork</TableHead>
              <TableHead>Price</TableHead>
              <TableHead>Date</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {buyerHistory.map((purchase) => (
              <TableRow key={purchase.id}>
                <TableCell>{purchase.buyer}</TableCell>
                <TableCell>{purchase.artwork}</TableCell>
                <TableCell>₹{purchase.price}</TableCell>
                <TableCell>
                  {format(new Date(purchase.date), "MMM d, yyyy")}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
};

export default BuyerHistory;

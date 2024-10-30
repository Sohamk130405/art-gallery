"use client";

import SubmitArtwork from "@/components/SubmitArtwork";
import PreviousSubmissions from "@/components/PreviousSubmissions";
import { useEffect, useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { useSession } from "next-auth/react";

export default function ArtistConsolePage() {
  const { data: session } = useSession();
  const [artwork, setArtwork] = useState({
    title: "",
    description: "",
    type: "",
    medium: "",
    dimensions: "",
    img: null, // Changed to handle file input
    year: new Date().getFullYear(),
    price: 0,
  });

  const [previousSubmissions, setPreviousSubmissions] = useState([]);
  const { toast } = useToast();

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!artwork.title || artwork.title.length < 2) {
      alert("Title must be at least 2 characters.");
      return;
    }
    if (!artwork.description || artwork.description.length < 10) {
      alert("Description must be at least 10 characters.");
      return;
    }
    if (artwork.price < 0) {
      alert("Price must be a positive number.");
      return;
    }

    const file = artwork.img; // Assuming artwork.img holds the image File object
    const reader = new FileReader();

    reader.onloadend = async () => {
      const base64Image = reader.result.split(",")[1]; // Strip the base64 prefix

      const payload = {
        ...artwork,
        img: base64Image,
        artistId: session.user.id,
      };

      try {
        const res = await fetch("/api/artworks", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(payload),
        });

        if (res.ok) {
          const data = await res.json();
          setPreviousSubmissions((prev) => [
            ...prev,
            {
              id: data.id,
              title: artwork.title,
              status: "pending",
              type: artwork.type,
            },
          ]);
          toast({
            title: "Artwork submitted!",
            description: "Your artwork has been submitted for review.",
          });
          setArtwork({
            title: "",
            description: "",
            type: "",
            medium: "",
            dimensions: "",
            img: null, // Reset img to null
            year: new Date().getFullYear(),
            price: 0,
          });
        } else {
          const errorData = await res.json();
          toast({
            title: "Submission Failed",
            description:
              errorData.message || "Something went wrong, try again later.",
          });
        }
      } catch (error) {
        toast({
          title: "Oh no! An error occurred.",
          description: "Something went wrong, try again later.",
        });
      }
    };

    if (file) {
      reader.readAsDataURL(file);
    } else {
      alert("Please select an image file.");
    }
  };

  useEffect(() => {
    const fetchPreviousSubmissions = async () => {
      if (!session) return; // Check if session exists

      try {
        const res = await fetch(`/api/artworks/${session.user.id}`);
        const data = await res.json();
        setPreviousSubmissions(data.artworks);
      } catch (error) {
        toast({
          title: "Oh no! An error occurred.",
          description: "Something went wrong, try again later.",
        });
      }
    };

    fetchPreviousSubmissions();
  }, [session]); // Add session as a dependency

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Artist Console</h1>
      <div className="flex flex-wrap gap-2">
        <PreviousSubmissions previousSubmissions={previousSubmissions} />
        <SubmitArtwork
          artwork={artwork}
          setArtwork={setArtwork}
          handleSubmit={handleSubmit}
        />
      </div>
    </div>
  );
}

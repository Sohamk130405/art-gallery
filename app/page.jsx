"use client";

import * as React from "react";
import Image from "next/image";
import { Search, ArrowRight } from "lucide-react";

import { Button } from "@/components/ui/button";

import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import Footer from "@/components/Footer";
import Newsletter from "@/components/Newsletter";
import Exhibition from "@/components/Exhibition";
import FeaturedArtworks from "@/components/FeaturedArtworks";
import Link from "next/link";

// Mock data for artworks
const artworks = [
  {
    id: 1,
    title: "Sunset Dreams",
    artist: "Jane Doe",
    description:
      "A vibrant painting capturing the essence of a beautiful sunset.",
    price: 1200,
    type: "Painting",
    image:
      "https://plus.unsplash.com/premium_photo-1680883415362-238794b19dde?q=80&w=2075&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
  },
  {
    id: 2,
    title: "Abstract Thoughts",
    artist: "John Smith",
    description:
      "An intricate abstract painting exploring the depths of human consciousness.",
    price: 1500,
    type: "Abstract Painting",
    image:
      "https://plus.unsplash.com/premium_photo-1669876271015-55e215f60bc4?q=80&w=1974&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
  },
  {
    id: 3,
    title: "Nature's Embrace",
    artist: "Emily Johnson",
    description:
      "A detailed sketch of a forest scene, highlighting the beauty of nature.",
    price: 800,
    type: "Sketches",
    image:
      "https://images.unsplash.com/photo-1506744038136-46273834b3fb?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
  },
  {
    id: 4,
    title: "Modern Elegance",
    artist: "Michael Brown",
    description: "A sleek sculpture representing the essence of modern design.",
    price: 2500,
    type: "Sculpture",
    image:
      "https://images.unsplash.com/photo-1515923256482-1c04580b477c?q=80&w=1936&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
  },
];

// Mock data for upcoming exhibitions
const upcomingExhibitions = [
  {
    id: 1,
    title: "Abstract Visions",
    date: "July 15-30, 2023",
    description:
      "A showcase of contemporary abstract art from emerging artists.",
  },
  {
    id: 2,
    title: "Nature in Focus",
    date: "August 5-20, 2023",
    description:
      "An exhibition celebrating the beauty of landscapes and wildlife.",
  },
  {
    id: 3,
    title: "Sculptural Wonders",
    date: "September 1-15, 2023",
    description:
      "Exploring the world of modern sculpture and three-dimensional art.",
  },
];

export default function HomePage() {
  const [searchTerm, setSearchTerm] = React.useState("");
  const [selectedType, setSelectedType] = React.useState("All");

  const filteredArtworks = artworks.filter(
    (artwork) =>
      artwork.title.toLowerCase().includes(searchTerm.toLowerCase()) &&
      (selectedType === "All" || artwork.type === selectedType)
  );

  return (
    <div className="space-y-10">
      {/* Hero Section */}
      <section className="relative h-[500px] overflow-hidden rounded-xl">
        <Image
          src="https://images.unsplash.com/photo-1488952619802-0a3f502bab33?q=80&w=1969&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
          alt="Featured Artwork"
          layout="fill"
          objectFit="cover"
          className="brightness-50"
        />
        <div className="absolute inset-0 flex flex-col items-center justify-center text-center text-white">
          <h1 className="text-4xl font-bold mb-4">
            Welcome to Our Art Gallery
          </h1>
          <p className="text-xl mb-8">
            Discover and collect extraordinary artworks
          </p>
          <Button size="lg" asChild>
            <Link href={"/artworks"}>Explore Gallery</Link>
          </Button>
        </div>
      </section>

      {/* Search and Filter Section */}
      <section>
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
          <div className="relative flex-1">
            <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search artworks..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-8"
            />
          </div>
          <Select value={selectedType} onValueChange={setSelectedType}>
            <SelectTrigger className="w-full sm:w-[180px]">
              <SelectValue placeholder="Filter by type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="All">All Types</SelectItem>
              <SelectItem value="Painting">Painting</SelectItem>
              <SelectItem value="Sculpture">Sculpture</SelectItem>
              <SelectItem value="Sketches">Sketches</SelectItem>
              <SelectItem value="Abstract Painting">
                Abstract Painting
              </SelectItem>
            </SelectContent>
          </Select>
        </div>
      </section>

      {/* Featured Artworks Section */}
      <FeaturedArtworks filteredArtworks={filteredArtworks} />

      {/* Upcoming Exhibitions Section */}

      <Exhibition upcomingExhibitions={upcomingExhibitions} />
      {/* Newsletter Signup Section */}
      <Newsletter />

      {/* Footer */}
      <Footer />
    </div>
  );
}

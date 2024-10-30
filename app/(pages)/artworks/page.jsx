"use client";

import * as React from "react";
import Image from "next/image";
import { Search, Filter } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Slider } from "@/components/ui/slider";
import ArtworkDialog from "@/components/ArtworkDialog";
import { useSession } from "next-auth/react"; // Import useSession to get the session user
import { Loader2 } from "lucide-react"; // Import loader icon

export default function ViewArtworksPage() {
  const { data: session } = useSession(); // Get the session user
  const [searchTerm, setSearchTerm] = React.useState("");
  const [selectedType, setSelectedType] = React.useState("All");
  const [priceRange, setPriceRange] = React.useState([0, 100000]);
  const [artworks, setArtworks] = React.useState([]);
  const [showMyArtworks, setShowMyArtworks] = React.useState(false); // State for filtering by user
  const [loading, setLoading] = React.useState(true); // Loading state

  const filteredArtworks = artworks.filter((artwork) => {
    const matchesSearch = artwork.title
      .toLowerCase()
      .includes(searchTerm.toLowerCase());
    const matchesType = selectedType === "All" || artwork.type === selectedType;
    const matchesPrice =
      artwork.price >= priceRange[0] && artwork.price <= priceRange[1];
    const matchesUser =
      !showMyArtworks || artwork.artist_id === session.user.id; // Check if it matches the user's ID

    return matchesSearch && matchesType && matchesPrice && matchesUser;
  });

  React.useEffect(() => {
    const fetchArtworks = async () => {
      setLoading(true); // Set loading to true
      try {
        const res = await fetch(`/api/artworks/`);
        const data = await res.json();
        setArtworks(data.artworks);
      } catch (error) {
        toast({
          title: "Oh no! An error occurred.",
          description: "Something went wrong, try again later.",
        });
      } finally {
        setLoading(false); // Set loading to false after fetching
      }
    };

    fetchArtworks();
  }, []);

  const onUpdate = (updatedArtwork) => {
    // Update the local state with the new artwork data
    setArtworks((prev) =>
      prev.map((art) => (art.id === updatedArtwork.id ? updatedArtwork : art))
    );
  };

  const onDelete = (deletedId) => {
    // Remove the deleted artwork from the local state
    setArtworks((prev) => prev.filter((art) => art.id !== deletedId));
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">View Artworks</h1>

      <div className="flex flex-col md:flex-row gap-4 mb-8">
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
          <SelectTrigger className="w-full md:w-[180px]">
            <SelectValue placeholder="Filter by type" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="All">All Types</SelectItem>
            <SelectItem value="Painting">Painting</SelectItem>
            <SelectItem value="Sculpture">Sculpture</SelectItem>
            <SelectItem value="Sketches">Sketches</SelectItem>
            <SelectItem value="Abstract Painting">Abstract Painting</SelectItem>
          </SelectContent>
        </Select>
        {session && session.user.role === "artist" && (
          <Button
            onClick={() => setShowMyArtworks((prev) => !prev)}
            variant="outline"
          >
            {showMyArtworks ? "Show All Artworks" : "My Artworks"}
          </Button>
        )}
        <Dialog>
          <DialogTrigger asChild>
            <Button variant="outline">
              <Filter className="w-4 h-4 mr-2" />
              Price Range
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Set Price Range</DialogTitle>
              <DialogDescription>
                Adjust the slider to set your desired price range.
              </DialogDescription>
            </DialogHeader>
            <div className="py-4">
              <Slider
                min={0}
                max={5000}
                step={100}
                value={priceRange}
                onValueChange={setPriceRange}
              />
              <div className="flex justify-between mt-2">
                <span>₹{priceRange[0]}</span>
                <span>₹{priceRange[1]}</span>
              </div>
            </div>
            <Button onClick={() => {}}>Apply</Button>
          </DialogContent>
        </Dialog>
      </div>

      {loading ? ( // Show loader while fetching
        <div className="flex justify-center items-center py-8">
          <Loader2 className="animate-spin h-8 w-8 text-muted-foreground" />
        </div>
      ) : (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {filteredArtworks.map((artwork) => (
            <Card key={artwork.id}>
              <CardHeader className="p-0">
                <Image
                  src={artwork.image_url}
                  alt={artwork.title}
                  width={600}
                  height={400}
                  className="rounded-t-lg object-cover h-48 w-full"
                />
              </CardHeader>
              <CardContent className="p-4">
                <CardTitle>{artwork.title}</CardTitle>
                <p className="text-sm text-muted-foreground mb-2">
                  by {artwork.artist_name}
                </p>
                <p className="text-sm text-muted-foreground">
                  {artwork.description}
                </p>
              </CardContent>
              <CardFooter className="flex justify-between items-center p-4">
                <span className="font-semibold">₹{artwork.price}</span>
                <ArtworkDialog
                  artwork={artwork}
                  onUpdate={onUpdate}
                  onDelete={onDelete}
                />
              </CardFooter>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}

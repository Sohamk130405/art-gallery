import React from "react";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "./ui/card";
import Image from "next/image";
import { Button } from "./ui/button";

const FeaturedArtworks = ({ filteredArtworks }) => {
  return (
    <section>
      <h2 className="text-3xl font-bold mb-6">Featured Artworks</h2>
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {filteredArtworks.map((artwork) => (
          <Card key={artwork.id}>
            <CardHeader className="p-0">
              <Image
                src={artwork.image}
                alt={artwork.title}
                width={600}
                height={400}
                className="rounded-t-lg object-cover h-48 w-full"
              />
            </CardHeader>
            <CardContent className="p-4">
              <CardTitle>{artwork.title}</CardTitle>
              <p className="text-sm text-muted-foreground mb-2">
                by {artwork.artist}
              </p>
              <p className="text-sm text-muted-foreground">
                {artwork.description}
              </p>
            </CardContent>
            <CardFooter className="flex justify-between items-center p-4">
              <span className="font-semibold">${artwork.price}</span>
              <Button>View Details</Button>
            </CardFooter>
          </Card>
        ))}
      </div>
    </section>
  );
};

export default FeaturedArtworks;

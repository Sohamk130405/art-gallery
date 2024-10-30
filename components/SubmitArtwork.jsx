"use client";

import { useState } from "react";
import { ChevronsUpDown, Upload } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";

export default function SubmitArtwork({ artwork, setArtwork, handleSubmit }) {
  const [isOpen, setIsOpen] = useState(false);

  const { title, description, type, medium, dimensions, img, year, price } =
    artwork;

  return (
    <Card className="w-full max-w-2xl mx-auto mb-auto">
      <Collapsible
        open={isOpen}
        onOpenChange={setIsOpen}
        className="w-full space-y-2"
      >
        <CollapsibleTrigger asChild>
          <div className="flex justify-between items-center">
            <CardHeader className="cursor-pointer">
              <CardTitle>Submit New Artwork</CardTitle>
              <CardDescription>
                Fill out the form below to submit a new artwork for approval.
              </CardDescription>
            </CardHeader>
            <Button variant="ghost" className="mr-4">
              <ChevronsUpDown />
            </Button>
          </div>
        </CollapsibleTrigger>

        <CollapsibleContent>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="title">Title</Label>
                <Input
                  name="title"
                  id="title"
                  placeholder="Enter artwork title"
                  value={title}
                  onChange={(e) =>
                    setArtwork({ ...artwork, title: e.target.value })
                  }
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Textarea
                  name="description"
                  id="description"
                  placeholder="Enter artwork description"
                  value={description}
                  onChange={(e) =>
                    setArtwork({ ...artwork, description: e.target.value })
                  }
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="type">Artwork Type</Label>
                <Select
                  name="type"
                  value={type}
                  onValueChange={(value) =>
                    setArtwork({ ...artwork, type: value })
                  }
                >
                  <SelectTrigger id="type" className="w-full">
                    <SelectValue placeholder="Select type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Painting">Painting</SelectItem>
                    <SelectItem value="Sculpture">Sculpture</SelectItem>
                    <SelectItem value="Sketch">Sketch</SelectItem>
                    <SelectItem value="Abstract">Abstract</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="medium">Medium</Label>
                <Input
                  name="medium"
                  id="medium"
                  placeholder="E.g., Oil on canvas"
                  value={medium}
                  onChange={(e) =>
                    setArtwork({ ...artwork, medium: e.target.value })
                  }
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="dimensions">Dimensions</Label>
                <Input
                  id="dimensions"
                  name="dimensions"
                  placeholder="E.g., 24x36 inches"
                  value={dimensions}
                  onChange={(e) =>
                    setArtwork({ ...artwork, dimensions: e.target.value })
                  }
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="img">Artwork Image</Label>
                <Input
                  id="img"
                  name="img"
                  type="file"
                  value={img ? img.filename : ""}
                  onChange={(e) =>
                    setArtwork({ ...artwork, img: e.target.files[0] })
                  }
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="year">Year</Label>
                <Input
                  id="year"
                  name="year"
                  type="number"
                  min="1900"
                  max={new Date().getFullYear()}
                  value={year}
                  onChange={(e) =>
                    setArtwork({ ...artwork, year: parseInt(e.target.value) })
                  }
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="price">Price</Label>
                <Input
                  id="price"
                  name="price"
                  type="number"
                  step="0.01"
                  min="0"
                  placeholder="Enter price"
                  value={price}
                  onChange={(e) =>
                    setArtwork({
                      ...artwork,
                      price: parseFloat(e.target.value),
                    })
                  }
                  required
                />
              </div>
              <Button type="submit" className="w-full">
                Submit Artwork
              </Button>
            </form>
          </CardContent>
        </CollapsibleContent>
      </Collapsible>
    </Card>
  );
}

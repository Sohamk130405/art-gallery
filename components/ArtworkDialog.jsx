"use client";

import React, { useState } from "react";
import { useSession } from "next-auth/react";
import Image from "next/image";
import { Pencil, Trash2 } from "lucide-react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

const ArtworkDialog = ({ artwork, onUpdate, onDelete }) => {
  const { data: session } = useSession();
  const [isEditing, setIsEditing] = useState(false);
  const [editedArtwork, setEditedArtwork] = useState(artwork);
  const { toast } = useToast();
  const isArtist = session?.user?.id === artwork.artist_id;
  const [isAlertOpen, setIsAlertOpen] = useState(false);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setEditedArtwork((prev) => ({ ...prev, [name]: value }));
  };

  const handleEdit = async () => {
    if (isEditing) {
      try {
        const response = await fetch(`/api/artworks/`, {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ ...editedArtwork, artworkId: artwork.id }),
        });

        if (response.ok) {
          const updatedArtwork = await response.json();
          onUpdate(updatedArtwork);
          setIsEditing(false);
          toast({
            title: "Artwork updated",
            description: "Your artwork has been successfully updated.",
          });
        } else {
          throw new Error("Failed to update artwork");
        }
      } catch (error) {
        toast({
          title: "Error",
          description: "Failed to update artwork. Please try again.",
          variant: "destructive",
        });
      }
    } else {
      setIsEditing(true);
    }
  };

  const handleDelete = async () => {
    try {
      const response = await fetch(`/api/artworks`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ artworkId: artwork.id }),
      });

      if (response.ok) {
        onDelete(artwork.id);
        toast({
          title: "Artwork deleted",
          description: "Your artwork has been successfully deleted.",
        });
      } else {
        throw new Error("Failed to delete artwork");
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to delete artwork. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsAlertOpen(false); // Close the alert dialog
    }
  };

  const handlePurchase = async () => {
    if (artwork.is_sold) return;
    try {
      const response = await fetch(`/api/artworks/purchase`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          userId: session.user.id, // Get the logged-in user's ID
          artworkId: artwork.id,
        }),
      });

      if (response.ok) {
        toast({
          title: "Purchase successful",
          description: "Thank you for your purchase!",
        });

        onUpdate({ ...artwork, is_sold: true });
      } else {
        throw new Error("Failed to complete purchase");
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to complete purchase. Please try again.",
        variant: "destructive",
      });
    }
  };
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button>View Details</Button>
      </DialogTrigger>
      <DialogContent className="max-w-3xl">
        <DialogHeader>
          <DialogTitle>
            {isEditing ? "Edit Artwork" : artwork.title}
          </DialogTitle>
          <DialogDescription>by {artwork.artist_name}</DialogDescription>
        </DialogHeader>
        <div className="grid md:grid-cols-2 gap-4">
          <Image
            src={artwork.image_url}
            alt={artwork.title}
            width={600}
            height={400}
            className="rounded-lg object-cover w-full"
          />
          <div>
            {isEditing ? (
              <>
                <Label htmlFor="title">Title</Label>
                <Input
                  id="title"
                  name="title"
                  value={editedArtwork.title}
                  onChange={handleInputChange}
                  className="mb-2"
                />
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  name="description"
                  value={editedArtwork.description}
                  onChange={handleInputChange}
                  className="mb-2"
                />
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <Label htmlFor="type">Type</Label>
                    <Input
                      id="type"
                      name="type"
                      value={editedArtwork.type}
                      onChange={handleInputChange}
                    />
                  </div>
                  <div>
                    <Label htmlFor="medium">Medium</Label>
                    <Input
                      id="medium"
                      name="medium"
                      value={editedArtwork.medium}
                      onChange={handleInputChange}
                    />
                  </div>
                  <div>
                    <Label htmlFor="dimensions">Dimensions</Label>
                    <Input
                      id="dimensions"
                      name="dimensions"
                      value={editedArtwork.dimensions}
                      onChange={handleInputChange}
                    />
                  </div>
                  <div>
                    <Label htmlFor="year">Year</Label>
                    <Input
                      id="year"
                      name="year"
                      value={editedArtwork.year}
                      onChange={handleInputChange}
                    />
                  </div>
                </div>
                <div className="mt-4">
                  <Label htmlFor="price">Price</Label>
                  <Input
                    id="price"
                    name="price"
                    type="number"
                    value={editedArtwork.price}
                    onChange={handleInputChange}
                  />
                </div>
              </>
            ) : (
              <>
                <p className="text-muted-foreground mb-4">
                  {artwork.description}
                </p>
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <Label>Type</Label>
                    <p>{artwork.type}</p>
                  </div>
                  <div>
                    <Label>Medium</Label>
                    <p>{artwork.medium}</p>
                  </div>
                  <div>
                    <Label>Dimensions</Label>
                    <p>{artwork.dimensions}</p>
                  </div>
                  <div>
                    <Label>Year</Label>
                    <p>{artwork.year}</p>
                  </div>
                </div>
                <div className="mt-4">
                  <Label>Price</Label>
                  <p className="text-2xl font-bold">₹{artwork.price}</p>
                </div>
              </>
            )}
            {isArtist && (
              <div className="flex justify-between mt-4">
                <Button onClick={handleEdit} variant="outline">
                  {isEditing ? "Save" : "Edit"}
                  <Pencil className="w-4 h-4 ml-2" />
                </Button>
                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <Button variant="destructive">
                      Delete
                      <Trash2 className="w-4 h-4 ml-2" />
                    </Button>
                  </AlertDialogTrigger>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>Delete Artwork</AlertDialogTitle>
                      <AlertDialogDescription>
                        Are you sure you want to delete this artwork? This
                        action cannot be undone.
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel onClick={() => setIsAlertOpen(false)}>
                        Cancel
                      </AlertDialogCancel>
                      <AlertDialogAction onClick={handleDelete}>
                        Confirm
                      </AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              </div>
            )}
            {!isArtist && (
              <Button className="mt-4 w-full" onClick={handlePurchase}>
                {artwork.is_sold ? "Sold" : "Purchase"}
              </Button>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ArtworkDialog;

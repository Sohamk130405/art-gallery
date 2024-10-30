"use client";

import * as React from "react";
import { Check, Loader2, X } from "lucide-react";
import { Button } from "@/components/ui/button";
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

const ArtworkApproval = () => {
  const [pendingArtworks, setPendingArtworks] = React.useState([]);
  const [approvedArtworks, setApprovedArtworks] = React.useState([]);
  const [rejectedArtworks, setRejectedArtworks] = React.useState([]);
  const [loading, setLoading] = React.useState(true); // Loading state

  // Fetch pending artworks from the backend
  React.useEffect(() => {
    const fetchPendingArtworks = async () => {
      setLoading(true); // Set loading to true when fetching starts
      try {
        const response = await fetch("/api/artworks/review"); // Adjust the API endpoint as necessary
        const data = await response.json();
        setPendingArtworks(data.artworks); // Assuming the response is an object with artworks array
      } catch (error) {
        console.error("Failed to fetch pending artworks:", error);
      } finally {
        setLoading(false); // Set loading to false when fetching ends
      }
    };

    fetchPendingArtworks();
  }, []);

  const handleApprove = async (id) => {
    setApprovedArtworks((prev) => [...prev, id]);
    await updateArtworkStatus(id, "approve");
  };

  const handleReject = async (id) => {
    setRejectedArtworks((prev) => [...prev, id]);
    await updateArtworkStatus(id, "reject");
  };

  const updateArtworkStatus = async (artworkId, action) => {
    try {
      await fetch("/api/artworks/review", {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ artworkId, action }),
      });
    } catch (error) {
      console.error("Failed to update artwork status:", error);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Artwork Approval</CardTitle>
        <CardDescription>Approve or reject submitted artworks.</CardDescription>
      </CardHeader>
      <CardContent>
        {loading ? ( // Show loader if loading
          <div className="flex justify-center items-center py-8">
            <Loader2 className="animate-spin h-8 w-8 text-muted-foreground" />
          </div>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Title</TableHead>
                <TableHead>Artist</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Action</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {pendingArtworks.map((artwork) => (
                <TableRow key={artwork.id}>
                  <TableCell>{artwork.title}</TableCell>
                  <TableCell>{artwork.artist_name}</TableCell>
                  <TableCell>{artwork.type}</TableCell>
                  <TableCell>
                    {approvedArtworks.includes(artwork.id) ? (
                      <span className="text-green-600">Approved</span>
                    ) : rejectedArtworks.includes(artwork.id) ? (
                      <span className="text-red-600">Rejected</span>
                    ) : (
                      <div className="flex space-x-2">
                        <Button
                          size="sm"
                          
                          onClick={() => handleApprove(artwork.id)}
                        >
                          <Check className="mr-1 h-4 w-4" /> Approve
                        </Button>
                        <Button
                          size="sm"
                          variant="destructive"
                          onClick={() => handleReject(artwork.id)}
                        >
                          <X className="mr-1 h-4 w-4" /> Reject
                        </Button>
                      </div>
                    )}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </CardContent>
    </Card>
  );
};

export default ArtworkApproval;

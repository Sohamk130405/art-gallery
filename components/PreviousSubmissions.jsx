import React from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

import { Badge } from "@/components/ui/badge";


const PreviousSubmissions = ({ previousSubmissions }) => {
  return (
    <Card className="mb-auto w-full max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle>Previous Submissions</CardTitle>
        <CardDescription>
          View the status of your previously submitted artworks.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {previousSubmissions.map((submission) => (
            <div
              key={submission.id}
              className="flex items-center justify-between"
            >
              <div>
                <p className="font-medium">{submission.title}</p>
                <p className="text-sm text-muted-foreground">
                  {submission.type}
                </p>
              </div>
              <Badge
                className={"py-2 px-4"}
                variant={
                  submission.status === "approved"
                    ? "default"
                    : submission.status === "pending"
                    ? "secondary"
                    : "destructive"
                }
              >
                {submission.status}
              </Badge>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default PreviousSubmissions;

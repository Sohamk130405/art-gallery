import React from "react";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "./ui/card";
import { Button } from "./ui/button";
const Exhibition = ({ upcomingExhibitions }) => {
  return (
    <section>
      <h2 className="text-3xl font-bold mb-6">Upcoming Exhibitions</h2>
      <div className="grid gap-6 md:grid-cols-3">
        {upcomingExhibitions.map((exhibition) => (
          <Card key={exhibition.id}>
            <CardHeader>
              <CardTitle>{exhibition.title}</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="font-semibold text-primary">{exhibition.date}</p>
              <p className="text-muted-foreground mt-2">
                {exhibition.description}
              </p>
            </CardContent>
            <CardFooter>
              <Button variant="outline">Learn More</Button>
            </CardFooter>
          </Card>
        ))}
      </div>
    </section>
  );
};

export default Exhibition;

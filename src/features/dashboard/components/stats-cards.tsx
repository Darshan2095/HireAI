import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export const StatsCards = () => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      <Card>
        <CardHeader>
          <CardTitle>Applications</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-2xl font-bold">0</p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Interviews</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-2xl font-bold">0</p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Resume Score</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-2xl font-bold">--</p>
        </CardContent>
      </Card>
    </div>
  );
};
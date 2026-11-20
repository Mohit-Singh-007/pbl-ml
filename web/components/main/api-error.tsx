import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export function ApiError({ message }: { message: string }) {
  return (
    <Card className="max-w-2xl border-red-600/30">
      <CardHeader>
        <CardTitle>Can&apos;t load data</CardTitle>
      </CardHeader>
      <CardContent className="space-y-2 text-sm">
        <p>{message}</p>
        <p className="text-muted-foreground">
          Also check that PostgreSQL is running and the API&apos;s .env has the
          right password.
        </p>
      </CardContent>
    </Card>
  );
}

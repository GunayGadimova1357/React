import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";

export type SearchItem = {
  id: number;
  query: string;
  date: string;
};

export function SearchHistoryItem({ item }: { item: SearchItem }) {
  return (
    <Card className="bg-zinc-900 text-white">
      <CardHeader>
        <CardTitle>{item.query}</CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-sm text-gray-400">{item.date}</p>
      </CardContent>
    </Card>
  );
}
import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";

interface ErrorReport {
  id: string;
  name: string;
  message: string;
  timestamp: string;
  ip?: string;
}

export default function AdminReports() {
  const [reports, setReports] = useState<ErrorReport[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchReports();
  }, []);

  const fetchReports = async () => {
    try {
      const response = await fetch("/api/reports/admin/errors");
      if (response.ok) {
        const data = await response.json();
        setReports(data);
      }
    } catch (error) {
      console.error("Failed to fetch reports:", error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div>Yuklanmoqda...</div>;
  }

  return (
    <div>
      <div className="mb-4">
        <Badge variant="secondary">{reports.length} ta xabar</Badge>
      </div>
      <ScrollArea className="h-96">
        <div className="space-y-4">
          {reports.length === 0 ? (
            <p className="text-muted-foreground">Hozircha xabar yo'q</p>
          ) : (
            reports.map((report) => (
              <Card key={report.id}>
                <CardHeader>
                  <CardTitle className="text-sm">
                    {report.name} - {new Date(report.timestamp).toLocaleString()}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm">{report.message}</p>
                  {report.ip && (
                    <p className="text-xs text-muted-foreground mt-2">IP: {report.ip}</p>
                  )}
                </CardContent>
              </Card>
            ))
          )}
        </div>
      </ScrollArea>
    </div>
  );
}
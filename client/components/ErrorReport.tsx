import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { Bug } from "lucide-react";

export default function ErrorReport() {
  const [open, setOpen] = useState(false);
  const [name, setName] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !message.trim()) {
      toast({
        title: "Xatolik",
        description: "Ism va xabar majburiy",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);
    try {
      const response = await fetch("/api/reports/public/error", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ name: name.trim(), message: message.trim() }),
      });

      if (response.ok) {
        toast({
          title: "Muvaffaqiyat",
          description: "Xabar yuborildi",
        });
        setName("");
        setMessage("");
        setOpen(false);
      } else {
        const error = await response.json();
        toast({
          title: "Xatolik",
          description: error.message || "Xabar yuborishda xatolik",
          variant: "destructive",
        });
      }
    } catch (error) {
      toast({
        title: "Xatolik",
        description: "Server bilan bog'lanishda xatolik",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <button className="flex items-center gap-2 text-sm text-muted-foreground hover:text-accent transition-colors group w-full">
          <Bug className="w-4 h-4 group-hover:text-accent" />
          Xatolikni Bildir
        </button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Xatolik haqida xabar berish</DialogTitle>
          <DialogDescription>
            Agar siz xatolik topgan bo'lsangiz, iltimos, quyida xabar yuboring.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="name">Ismingiz</Label>
            <Input
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Ismingizni kiriting"
              maxLength={100}
            />
          </div>
          <div>
            <Label htmlFor="message">Xabar</Label>
            <Textarea
              id="message"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Xatolik haqida batafsil yozing"
              maxLength={1000}
              rows={4}
            />
          </div>
          <Button type="submit" disabled={loading} className="w-full">
            {loading ? "Yuborilmoqda..." : "Yuborish"}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}
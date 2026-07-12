"use client";

import { useState, useTransition } from "react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { markMessageRead, deleteMessage } from "@/actions/admin";
import { toast } from "sonner";
import { Eye, Trash2 } from "lucide-react";

export function MessageActions({
  id,
  read,
  message,
}: {
  id: string;
  read: boolean;
  message: string;
}) {
  const [isPending, startTransition] = useTransition();
  const [open, setOpen] = useState(false);

  return (
    <div className="flex gap-1">
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger
          className="inline-flex items-center justify-center h-8 rounded-md px-2 hover:bg-muted"
          onClick={() => {
            if (!read) startTransition(async () => { await markMessageRead(id); });
          }}
        >
          <Eye className="h-4 w-4" />
        </DialogTrigger>
        <DialogContent>
          <DialogHeader><DialogTitle>Message</DialogTitle></DialogHeader>
          <p className="text-sm whitespace-pre-wrap">{message}</p>
        </DialogContent>
      </Dialog>
      <Button
        size="sm"
        variant="ghost"
        disabled={isPending}
        className="text-destructive"
        onClick={() => startTransition(async () => {
          await deleteMessage(id);
          toast.success("Message supprimé");
        })}
      >
        <Trash2 className="h-4 w-4" />
      </Button>
    </div>
  );
}

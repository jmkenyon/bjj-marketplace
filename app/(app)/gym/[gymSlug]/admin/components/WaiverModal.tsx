"use client";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

interface WaiverModalProps {
    isLoading: boolean
    handleSave: () => Promise<void>

}

export function WaiverModal({isLoading, handleSave}: WaiverModalProps) {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline" className="bg-black text-white hover:bg-black/80 hover:text-white">
          Save waiver
        </Button>
      </DialogTrigger>

      <DialogContent className="sm:max-w-106.25">
        <DialogHeader>
          <DialogTitle>Save waiver</DialogTitle>
          <DialogDescription>
            Are you sure you want to save this waiver?
          </DialogDescription>
        </DialogHeader>
        <DialogFooter className="pt-5">
          <DialogClose asChild>
            <Button variant="outline" disabled={isLoading}>
              No
            </Button>
          </DialogClose>
          <Button
            className="bg-black"
            disabled={isLoading}
            onClick={handleSave}
          >
            {isLoading ? "Saving...." : "Yes"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

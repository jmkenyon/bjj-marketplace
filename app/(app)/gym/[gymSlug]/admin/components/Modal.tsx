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
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Gym } from "@prisma/client";
import axios from "axios";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { FieldValues, SubmitHandler, useForm } from "react-hook-form";
import toast from "react-hot-toast";

interface ModalProps {
  gym: Gym
}

export function Modal({gym}: ModalProps) {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false);
  const [belt, setBelt] = useState("WHITE");

  const { register, handleSubmit } = useForm<FieldValues>({
    defaultValues: {
      name: "",
      email: "",
    },
  });

  const onSubmit: SubmitHandler<FieldValues> = async (data) => {
   
    setIsLoading(true);
    try {
      const finalPayload = {
        ...data,
        belt,
        gymId: gym.id
      };
      await axios.post("/api/new-user", finalPayload);
      toast.success("User added!");
      router.refresh()
    } catch (error) {
      if (axios.isAxiosError(error)) {
        toast.error(error.response?.data?.error ?? "Request failed");
      } else {
        toast.error("Unexpected error");
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog>
      
        <DialogTrigger asChild>
          <Button variant="outline" className="hover:bg-black hover:text-white">
            Add student
          </Button>
        </DialogTrigger>

        <DialogContent className="sm:max-w-106.25">
        <form onSubmit={handleSubmit(onSubmit)}>
          <DialogHeader>
            <DialogTitle>Add student</DialogTitle>
            <DialogDescription>Add a new student here</DialogDescription>
          </DialogHeader>
          <div className="grid gap-4">
            <div className="grid gap-3 pt-4">
              <Label htmlFor="name-1">Name</Label>
              <Input id="name-1" {...register("name")} />
            </div>
            <div className="grid gap-3">
              <Label htmlFor="email-1">Email</Label>
              <Input id="email-1" type="email" {...register("email")} />
            </div>
            <Label htmlFor="belt">
              Belt level
            </Label>
            <Select
              defaultValue="WHITE"
              onValueChange={(value) => setBelt(value)}

            >
              <SelectTrigger id="belt" className="w-45 m-0 bg-white">
                <SelectValue placeholder="Select a belt" />
              </SelectTrigger>
              <SelectContent >
                <SelectGroup>
                  <SelectLabel>Belt level</SelectLabel>
                  <SelectItem value="WHITE">White</SelectItem>
                  <SelectItem value="BLUE">Blue</SelectItem>
                  <SelectItem value="PURPLE">Purple</SelectItem>
                  <SelectItem value="BROWN">Brown</SelectItem>
                  <SelectItem value="BLACK">Black</SelectItem>
                </SelectGroup>
              </SelectContent>
            </Select>
          </div>
          <DialogFooter className="pt-5">
            <DialogClose asChild>
              <Button variant="outline">Cancel</Button>
            </DialogClose>
            <Button type="submit" className="bg-black" disabled={isLoading}>
              {isLoading ? "Adding Student" : "Add student"}
            </Button>
          </DialogFooter>
          </form>
        </DialogContent>
   
    </Dialog>
  );
}

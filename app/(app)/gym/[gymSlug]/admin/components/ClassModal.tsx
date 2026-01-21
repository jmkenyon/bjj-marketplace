"use client";

import { days, start_time } from "@/app/(app)/list-your-gym/data";
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
import axios from "axios";
import { useRouter } from "next/navigation";
import { useState } from "react";
import {
  Controller,
  FieldValues,
  SubmitHandler,
  useForm,
} from "react-hook-form";
import toast from "react-hot-toast";

interface ClassModalProps {
  gymId: string;
}

export function ClassModal({ gymId }: ClassModalProps) {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  const { register, handleSubmit, control } = useForm<FieldValues>({
    defaultValues: {
      title: "",
      dayOfWeek: "",
      startTime: "",
      duration: "",
      isFree: false,
    },
  });

  const onSubmit: SubmitHandler<FieldValues> = async (data) => {
    setIsLoading(true);
    try {
      const finalPayload = {
        ...data,
        gymId,
        isFree: Boolean(data.isFree),
      };
      await axios.post("/api/gym/timetable", finalPayload);
      toast.success("Class added!");
      router.refresh();
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

  const START_TIME = start_time;
  const DAYS = days;

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline" className="hover:bg-black hover:text-white">
          Add class
        </Button>
      </DialogTrigger>

      <DialogContent className="sm:max-w-106.25">
        <form onSubmit={handleSubmit(onSubmit)}>
          <DialogHeader>
            <DialogTitle>Add class</DialogTitle>
            <DialogDescription>Add a new class here</DialogDescription>
          </DialogHeader>
          <div className="grid gap-4">
            <div className="grid gap-3 pt-4">
              <Label htmlFor="name-1">Class name</Label>
              <Input
                id="name-1"
                {...register("title")}
                placeholder="e.g. No-Gi"
                required
              />
            </div>

            <Label htmlFor="start-time">Day</Label>
            <Controller
              name="dayOfWeek"
              control={control}
              rules={{ required: "Day is required" }}
              render={({ field }) => (
                <Select onValueChange={field.onChange} value={field.value}>
                  <SelectTrigger id="start-time" className="w-45 bg-white">
                    <SelectValue placeholder="Select a day" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectGroup>
                      <SelectLabel>Select day</SelectLabel>
                      {DAYS.map((day) => (
                        <SelectItem key={day} value={day}>
                          {day.charAt(0).toUpperCase() +
                            day.slice(1).toLowerCase()}
                        </SelectItem>
                      ))}
                    </SelectGroup>
                  </SelectContent>
                </Select>
              )}
            />

            <Label htmlFor="start-time">Start time</Label>
            <Controller
              name="startTime"
              control={control}
              rules={{ required: "Start time is required" }}
              render={({ field }) => (
                <Select onValueChange={field.onChange} value={field.value}>
                  <SelectTrigger id="start-time" className="w-45 m-0 bg-white">
                    <SelectValue placeholder="Select a start time" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectGroup>
                      <SelectLabel>Select a start time</SelectLabel>
                      {START_TIME.map((time) => (
                        <SelectItem key={time} value={time}>
                          {time}
                        </SelectItem>
                      ))}
                    </SelectGroup>
                  </SelectContent>
                </Select>
              )}
            />

            <div
              className="grid gap-3 mt-1
            "
            >
              <Label htmlFor="duration-1">Duration (in minutes)</Label>
              <Input
                id="duration-1"
                type="number"
                min={15}
                step={15}
                {...register("duration")}
                required
              />
            </div>
            <div className="flex items-start gap-3 mt-4">
              <Input
                type="checkbox"
                id="isFree"
                {...register("isFree")}
                className="mt-1 h-4 w-4 accent-black"
              />
              <Label htmlFor="isFree" className="text-sm text-slate-700">
                This is a free class (e.g. open mat)
              </Label>
         
            </div>
            <p className="ml-7 text-xs text-slate-500">
                Free sessions won’t require payment from visitors.
              </p>
          </div>
          <DialogFooter className="pt-5">
            <DialogClose asChild>
              <Button variant="outline">Cancel</Button>
            </DialogClose>
            <Button type="submit" className="bg-black" disabled={isLoading}>
              {isLoading ? "Adding Class" : "Add Class"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

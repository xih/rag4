import { Loader2 } from "lucide-react";
import React from "react";
import { Button } from "../ui/button";
import { useStore } from "@/store";
import { arxivPaperFormSchema } from "@/pages";
import { z } from "zod";

export async function customAsyncFunction() {
  await new Promise((resolve) => setTimeout(resolve, 1000));
  console.log("Hello World");
}

export default function LoadingButton({
  isLoading,
  setIsLoading,
}: // onSubmit,
{
  isLoading: boolean;
  setIsLoading: (loading: boolean) => void;
  // onSubmit: (values: z.infer<typeof arxivPaperFormSchema>) => void;
}) {
  const { isDrawerOpen, setDrawerOpen } = useStore();

  const handleClick = async () => {
    setIsLoading(true);

    // Perform your async operation here, like making a fetch request
    // await customAsyncFunction();
    // await onSubmit();

    setIsLoading(false);
    setDrawerOpen(true);
  };

  // set the drawer open state

  return (
    <Button
      // onClick={onSubmit}
      type="submit"
      variant="outline"
      disabled={isLoading}
      onClick={handleClick}
      className="duration-1000 transition-all"
    >
      {isLoading ? (
        <>
          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          Please wait
        </>
      ) : (
        "submit"
      )}
    </Button>
  );
}

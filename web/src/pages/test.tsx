import React, { useState } from "react";
import { Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import LoadingButton from "@/components/custom/LoadingButton";
import { useStore } from "@/store";

async function customAsyncFunction() {
  await new Promise((resolve) => setTimeout(resolve, 1000));
  console.log("Hello World");
}

export default function Test() {
  // const [isLoading, setIsLoading] = useState(false);

  const {
    isNotesLoading,
    setNotesLoading,
    // isNotesLoadedSuccess,
    // setNotesLoadedSuccess,
  } = useStore();

  const handleClick = async () => {
    setNotesLoading(true);

    // Perform your async operation here, like making a fetch request
    await customAsyncFunction();

    setNotesLoading(false);
  };

  return (
    <div className="flex flex-col">
      <div className="flex mx-auto items-center justify-center mt-10">
        <LoadingButton
          isLoading={isNotesLoading}
          setIsLoading={setNotesLoading}
        />
      </div>
    </div>
  );
}

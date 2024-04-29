import React, { useState } from "react";
import { Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";

async function customAsyncFunction() {
  await new Promise((resolve) => setTimeout(resolve, 1000));
  console.log("Hello World");
}

export default function Test() {
  const [isLoading, setIsLoading] = useState(false);

  const handleClick = async () => {
    setIsLoading(true);

    // Perform your async operation here, like making a fetch request
    await customAsyncFunction();

    setIsLoading(false);
  };

  return (
    <div className="flex flex-col">
      <div className="flex mx-auto items-center justify-center mt-10">
        <Button
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
      </div>
    </div>
  );
}

// 1. add 2 more input fields for name and deletepages
// 2. add a collapse
// 3. change up the values so that the form is set correctly

// 4. to fix the Can't resolve '@radix-ui/react-collapsible' error
// 4.1 yarn add @radix-ui/themes
// 4.2 npx shadcn-ui@latest add collapsible
// 4.21 yarn remove @radix-ui/react-collapsible and yarn add @radix-ui/react-select
// 5. after clicking submit, open up a bottom sheet
// 6. click on submit which opens the drawer with the the correct input
// 6. clicking on submit sends an API request that gets back the data

import { Button } from "@/components/ui/button";
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormDescription,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { ChevronsUpDown, Plus, X } from "lucide-react";
import BottomSheet from "@/components/custom/BottomSheet";
import { useState } from "react";
import hardcodedData from "@/data/hardCodedData";

const formSchema = z.object({
  username: z.string().min(2).max(50),
});

const arxivPaperFormSchema = z.object({
  paperUrl: z.string(),
  name: z.string(),
  pagesToDelete: z.string().optional(),
});

type ArxivPaperNote = {
  note: string;
  pageNumbers: Array<number>;
};

export default function Home() {
  const [notes, setNotes] = useState<ArxivPaperNote[]>();

  const paperForm = useForm<z.infer<typeof arxivPaperFormSchema>>({
    resolver: zodResolver(arxivPaperFormSchema),
    defaultValues: {
      paperUrl: "https://arxiv.org/pdf/2404.12291.pdf",
      name: "Augmenting emotion features in irony detection with Large language modeling",
    },
  });

  async function onPaperSubmit(values: z.infer<typeof arxivPaperFormSchema>) {
    const response = await fetch("/api/take_notes", {
      method: "post",
      body: JSON.stringify(values),
    }).then((res) => {
      if (res.ok) {
        console.log("is res ok?");
        return res.json();
      }
      return null;
    });

    if (response) {
      console.log(response, "2. what is this?");
      setNotes(response);
    } else {
      console.log("setting data to hardcode");
      setNotes(hardcodedData);
      console.log(notes, "notes");
      // throw new Error("something went wrong taking notes");
    }
  }

  return (
    <div className="flex flex-col gap-5">
      <div className="mx-auto mt-8 w-1/3">
        <Form {...paperForm}>
          <form
            onSubmit={paperForm.handleSubmit(onPaperSubmit)}
            className="space-y-8"
          >
            <FormField
              control={paperForm.control}
              name="paperUrl"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Paper Url</FormLabel>
                  <FormControl>
                    <Input placeholder="shadcn" {...field} />
                  </FormControl>
                  <FormDescription>
                    Input a paper url that you would like to question.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={paperForm.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Name</FormLabel>
                  <FormControl>
                    <Input placeholder="shadcn" {...field} />
                  </FormControl>
                  <FormDescription>Name of the paper</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Collapsible>
              <CollapsibleTrigger asChild>
                <Button variant="ghost" size="sm" className="p-2 ">
                  <p>Delete pages?</p>
                  <ChevronsUpDown className="h-4 w-4" />
                  <span className="sr-only">Toggle</span>
                </Button>
              </CollapsibleTrigger>
              <CollapsibleContent>
                <FormField
                  control={paperForm.control}
                  name="pagesToDelete"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Pages to Delete</FormLabel>
                      <FormControl>
                        <Input placeholder="10, 11, 12" {...field} />
                      </FormControl>
                      <FormDescription>Specify pages to delete</FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </CollapsibleContent>
            </Collapsible>

            <Button type="submit">Submit</Button>
          </form>
        </Form>
        <div className="mt-8">
          <BottomSheet />
        </div>
      </div>
    </div>
  );
}

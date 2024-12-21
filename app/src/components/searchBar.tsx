import { useForm } from "react-hook-form";
import { searchFormSchema } from "@/schemas";
import { z } from "zod";
import { Button, Form, FormControl, FormField, FormItem, Input } from "./ui";
import { Search } from "lucide-react";
import { cn } from "@/lib/utils";
import { useEffect } from "react";
import { toast } from "sonner";

export default function SearchBar({
  joinChatroom,
  searchForm
}: {
  joinChatroom: (values: z.infer<typeof searchFormSchema>) => void,
  searchForm: ReturnType<typeof useForm<z.infer<typeof searchFormSchema>>>
}) {
  useEffect(() => {
    if (searchForm.formState.errors.chatroom) {
      toast.error(searchForm.formState.errors.chatroom.message);
    }
  }, [searchForm.formState.errors.chatroom]);

  return (
    <Form {...searchForm}>
      <form
        className="flex gap-x-2 sm:ml-auto w-full sm:w-auto"
        onSubmit={searchForm.handleSubmit(joinChatroom)}
      >
        <FormField
          control={searchForm.control}
          name="chatroom"
          render={({ field }) => (
            <FormItem className="w-full sm:w-[200px]">
              <FormControl>
                <Input
                  placeholder="Enter chatroom address"
                  {...field}
                  disabled={searchForm.formState.isSubmitting}
                  className={cn("text-black", searchForm.formState.errors.chatroom && "border-destructive")}
                />
              </FormControl>
            </FormItem>
          )}
        />
        <Button
          className="hover:bg-tertiary p-2 aspect-square"
          size={"icon"}
          type="submit"
          disabled={searchForm.formState.isSubmitting}
        >
          <Search size={20} />
        </Button>
      </form>
    </Form>
  )
}
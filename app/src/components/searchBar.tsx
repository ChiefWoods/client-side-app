import { useForm } from "react-hook-form";
import { searchFormSchema } from "@/lib/formSchemas";
import { z } from "zod";
import { Button, Form, FormControl, FormField, FormItem, Input } from "./ui";
import { Search } from "lucide-react";

export default function SearchBar({
  joinChatroom,
  searchForm
}: {
  joinChatroom: (values: z.infer<typeof searchFormSchema>) => void,
  searchForm: ReturnType<typeof useForm<z.infer<typeof searchFormSchema>>>
}) {
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
                  className="text-black"
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
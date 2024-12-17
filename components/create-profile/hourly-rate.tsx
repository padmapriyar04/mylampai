import {
    Form,
    FormControl,
    FormDescription,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
  } from "@/components/ui/form";
  import { useForm } from "react-hook-form";
  import { zodResolver } from "@hookform/resolvers/zod";
  import * as z from "zod";
  import { toast } from "sonner";
  import { Input } from "@/components/ui/input";
  import { Button } from "@/components/ui/button";
  
  const formSchema = z.object({
    rate: z.string().min(1, "Hourly rate is required"),
  });
  
  export function HourlyRate() {
    const form = useForm<z.infer<typeof formSchema>>({
      resolver: zodResolver(formSchema),
      defaultValues: {
        rate: "",
      },
    });
  
    async function onSubmit(values: z.infer<typeof formSchema>) {
      try {
      } catch (error) {
        console.error(error);
        toast.error("Failed to create job");
      }
    }
    return (
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="max-w-3xl space-y-4"
        >
          <FormField
            control={form.control}
            name="rate"
            render={({ field }) => (
              <FormItem className="w-full">
                <FormControl>
                  <Input placeholder="Enter your hourly rate" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
  
          <Button type="submit" disabled={form.formState.isSubmitting}>
            Submit
          </Button>
        </form>
      </Form>
    );
  }
  
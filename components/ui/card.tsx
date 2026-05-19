import { cn } from "@/lib/utils";
export const Card = ({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) => <div className={cn("glass rounded-2xl p-5", className)} {...props} />;

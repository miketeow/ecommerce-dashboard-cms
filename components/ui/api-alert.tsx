"use client";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { FaServer, FaCopy } from "react-icons/fa";
import { Badge, BadgeProps } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
type ApiAlertProps = {
  title: string;
  description: string;
  variant: "public" | "admin";
};

const textMap: Record<ApiAlertProps["variant"], string> = {
  public: "Public",
  admin: "Admin",
};

const variantMap: Record<ApiAlertProps["variant"], BadgeProps["variant"]> = {
  public: "secondary",
  admin: "destructive",
};

export const ApiAlert = ({
  title,
  description,
  variant = "public",
}: ApiAlertProps) => {
  const onCopy = () => {
    navigator.clipboard.writeText(description);
    toast.success("API Route copied to clipboard");
  };
  return (
    <Alert>
      <FaServer className=" h-4 w-4" />
      <AlertTitle className="flex items-center gap-x-2">
        {title}
        <Badge variant={variantMap[variant]}>{textMap[variant]}</Badge>
      </AlertTitle>
      <AlertDescription className="flex items-center mt-4 justify-between">
        <code className="relative rounded bg-muted px-[0.3rem] py-[0.2rem] text-sm font-mono font-semibold">
          {description}
        </code>
        <Button variant="outline" size="icon" onClick={() => onCopy()}>
          <FaCopy className="h-4 w-4" />
        </Button>
      </AlertDescription>
    </Alert>
  );
};

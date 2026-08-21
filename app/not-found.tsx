import Link from "next/link";
import { MessageSquareCode, ArrowLeft, Home } from "lucide-react";
import { Container } from "@/components/ui/container";
import { Button } from "@/components/ui/button";

export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-background dark:bg-[#0D100B] p-6">
      <Container className="max-w-md text-center flex flex-col items-center">
        <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-[#31321D] text-[#F5F5EF] shadow-lg mb-6">
          <MessageSquareCode className="h-8 w-8" />
        </div>
        <span className="text-sm font-bold uppercase tracking-widest text-[#31321D] dark:text-[#B7B8A9]">
          404 Error
        </span>
        <h1 className="mt-2 text-4xl font-extrabold text-foreground tracking-tight sm:text-5xl">
          Page Not Found
        </h1>
        <p className="mt-4 text-sm text-muted-foreground dark:text-[#B7B8A9] leading-relaxed">
          The requested chat channel or page doesn&apos;t exist or might have been moved.
        </p>

        <div className="mt-8 flex items-center justify-center gap-3 w-full">
          <Link href="/">
            <Button variant="brandPrimary" className="gap-2">
              <Home className="h-4 w-4" />
              <span>Back to Gossip Home</span>
            </Button>
          </Link>
        </div>
      </Container>
    </div>
  );
}

import { Button } from "@/components/ui/button";

interface SignUpCardProps {
  isLoading: boolean;
  title?: string;
  subtitle?: string;
  label?: string;
}

const SignUpCard = ({
  isLoading,
  title = "Create your account",
  subtitle = "Review your details and complete your sign up",
}: SignUpCardProps) => {
  return (
    <section className="rounded-xl border bg-white p-8 md:p-10 shadow-sm">
      {/* Header */}
      <div className="mb-6 text-center">
        <h2 className="text-xl font-semibold text-neutral-900">
          {title}
        </h2>
        <p className="mt-1 text-sm text-neutral-600">
          {subtitle}
        </p>
      </div>

      {/* CTA */}
      <div className="flex justify-center">
        <Button
          type="submit"
          disabled={isLoading}
          className="
            w-full max-w-md
            h-12
            bg-neutral-900 text-white
            text-base font-medium
            transition
            hover:bg-neutral-800
            disabled:opacity-60
            disabled:cursor-not-allowed
          "
        >
          {isLoading ? "Submitting…" : "Complete signup"}
        </Button>
      </div>

      {/* Legal */}
      <p className="mt-4 text-center text-xs text-neutral-500">
        By continuing, you agree to the gym’s waiver and terms.
      </p>
    </section>
  );
};

export default SignUpCard;
import LastUsedIndicator from "@/components/auth/last-used-indicator";
import PendingSubmitButton from "@/components/pending-submit-button";

export default function AuthSubmitButton(
  props: Readonly<React.ComponentProps<typeof PendingSubmitButton>>
) {
  return (
    <PendingSubmitButton {...props}>
      <LastUsedIndicator provider="password" />
    </PendingSubmitButton>
  );
}

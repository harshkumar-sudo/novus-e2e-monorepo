import { Button, Card, ErrorMessage, SelectField, TextField } from "@fieldnotes/ui";
import { useEffect, useRef, useState, type FormEvent } from "react";
import { trackAdminEvent } from "../analytics/track";
import { adminApi, type Billing, type Plan } from "../api/client";

const PLAN_OPTIONS = [
  { value: "free", label: "Free" },
  { value: "team", label: "Team" },
  { value: "enterprise", label: "Enterprise" },
];

export function BillingPage() {
  const [billing, setBilling] = useState<Billing | null>(null);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState<string | null>(null);
  // Last billing details the server confirmed, used as the "previous" values for tracking.
  const savedBilling = useRef<Billing | null>(null);

  useEffect(() => {
    adminApi
      .getBilling()
      .then((loaded) => {
        savedBilling.current = loaded;
        setBilling(loaded);
      })
      .catch((err: Error) => setError(err.message));
  }, []);

  if (!billing) return <ErrorMessage message={error} />;

  const save = async (event: FormEvent) => {
    event.preventDefault();
    setSaved(false);
    setError(null);
    try {
      const updated = await adminApi.updateBilling(billing);
      const previous = savedBilling.current;
      savedBilling.current = updated;
      setBilling(updated);
      setSaved(true);
      // Server validated and saved the subscription (billingEmail is PII and is not sent).
      trackAdminEvent("subscription_updated", {
        plan: updated.plan,
        seats: updated.seats,
        ...(previous && {
          previousPlan: previous.plan,
          previousSeats: previous.seats,
          planChanged: previous.plan !== updated.plan,
        }),
      });
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not save billing details");
    }
  };

  return (
    <>
      <h1>Billing</h1>
      <Card title="Subscription">
        <form onSubmit={(event) => void save(event)}>
          <SelectField
            id="billing-plan-select"
            label="Plan"
            options={PLAN_OPTIONS}
            value={billing.plan}
            onChange={(event) => setBilling({ ...billing, plan: event.target.value as Plan })}
          />
          <TextField
            id="billing-email-input"
            label="Billing email"
            type="email"
            value={billing.billingEmail}
            onChange={(event) => setBilling({ ...billing, billingEmail: event.target.value })}
          />
          <TextField
            id="billing-seats-input"
            label="Seats"
            type="number"
            min={1}
            value={billing.seats}
            onChange={(event) => setBilling({ ...billing, seats: Number(event.target.value) })}
          />
          <ErrorMessage message={error} />
          <Button id="save-billing-button" type="submit">
            Save billing
          </Button>
          {saved && <span className="fn-muted"> Saved.</span>}
        </form>
      </Card>
    </>
  );
}

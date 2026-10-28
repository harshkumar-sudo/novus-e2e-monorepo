import { Button, Card, ErrorMessage, SelectField, TextField } from "@fieldnotes/ui";
import { useEffect, useState, type FormEvent } from "react";
import { trackAdminEvent } from "../analytics/track";
import { adminApi, type Billing, type Plan } from "../api/client";
import { useAdminAuth } from "../auth/AdminAuthContext";

const PLAN_OPTIONS = [
  { value: "free", label: "Free" },
  { value: "team", label: "Team" },
  { value: "enterprise", label: "Enterprise" },
];

export function BillingPage() {
  const { admin } = useAdminAuth();
  const [billing, setBilling] = useState<Billing | null>(null);
  // Last billing state confirmed by the server, used as the "previous" values.
  const [savedBilling, setSavedBilling] = useState<Billing | null>(null);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    adminApi
      .getBilling()
      .then((loaded) => {
        setBilling(loaded);
        setSavedBilling(loaded);
      })
      .catch((err: Error) => setError(err.message));
  }, []);

  if (!billing) return <ErrorMessage message={error} />;

  const save = async (event: FormEvent) => {
    event.preventDefault();
    setSaved(false);
    setError(null);
    const previous = savedBilling ?? billing;
    try {
      const updated = await adminApi.updateBilling(billing);
      setBilling(updated);
      setSavedBilling(updated);
      setSaved(true);
      // Conversion milestone: fires only after the server accepted the change.
      trackAdminEvent("subscription_updated", {
        plan: updated.plan,
        previousPlan: previous.plan,
        seats: updated.seats,
        previousSeats: previous.seats,
        planChanged: updated.plan !== previous.plan,
        organizationId: admin?.organization.id,
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

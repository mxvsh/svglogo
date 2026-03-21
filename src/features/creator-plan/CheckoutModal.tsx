import { Button, Modal, Separator } from "@heroui/react";
import { Icon } from "@iconify/react";
import { useEffect, useState } from "react";
import {
  EARLY_ACCESS_DISCOUNT,
  CURRENCY_SYMBOLS,
  PRICE_ONE_TIME,
  PRICE_ONE_TIME_EARLY,
  type Currency,
} from "#/data/creator-plan";
import { getPriceFn } from "#/server/payment.get-price";
import { buyCreatorPlan } from "#/commands/payment/buy-creator-plan";
import { useAuth } from "#/queries/auth/use-auth";

import { CREATOR_FEATURES } from "#/data/features";

const FEATURES_SHORT = [...CREATOR_FEATURES.slice(0, 4).map((f) => f.label), "and more..."];

const CURRENCIES: { value: Currency; label: string; flag: string }[] = [
  { value: "INR", label: "INR", flag: "🇮🇳" },
  { value: "USD", label: "USD", flag: "🇺🇸" },
];

const inrPriceCache: { data: Awaited<ReturnType<typeof getPriceFn>> | null; ts: number } = { data: null, ts: 0 };
const CACHE_TTL = 60 * 60 * 1000; // 1 hour

interface CheckoutModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function CheckoutModal({ isOpen, onClose }: CheckoutModalProps) {
  const user = useAuth();
  const [currency, setCurrency] = useState<Currency>("INR");
  const [isPaying, setIsPaying] = useState(false);
  const [priceData, setPriceData] = useState<{
    normal: number;
    early: number;
    price: number;
    hasEarlyAccess: boolean;
  } | null>(null);
  const [loadingPrice, setLoadingPrice] = useState(false);

  useEffect(() => {
    if (!isOpen) return;
    const hasEarlyAccess = user?.earlyAccess === "approved";
    if (currency === "USD") {
      setPriceData({
        normal: PRICE_ONE_TIME,
        early: PRICE_ONE_TIME_EARLY,
        price: hasEarlyAccess ? PRICE_ONE_TIME_EARLY : PRICE_ONE_TIME,
        hasEarlyAccess,
      });
      return;
    }
    if (inrPriceCache.data && Date.now() - inrPriceCache.ts < CACHE_TTL) {
      setPriceData(inrPriceCache.data);
      return;
    }
    setLoadingPrice(true);
    getPriceFn({ data: { currency } })
      .then((d) => { inrPriceCache.data = d; inrPriceCache.ts = Date.now(); setPriceData(d); })
      .finally(() => setLoadingPrice(false));
  }, [currency, isOpen, user?.earlyAccess]);

  const symbol = CURRENCY_SYMBOLS[currency];
  const locale = currency === "INR" ? "en-IN" : "en-US";
  const fmt = (n: number) => n.toLocaleString(locale, { minimumFractionDigits: 2, maximumFractionDigits: 2 });

  const handlePay = async () => {
    setIsPaying(true);
    onClose();
    try {
      await buyCreatorPlan(currency);
    } catch {
      // Payment failed or cancelled
    } finally {
      setIsPaying(false);
    }
  };

  return (
    <Modal isOpen={isOpen} onOpenChange={(open) => { if (!open) onClose(); }}>
      <Modal.Backdrop isDismissable>
        <Modal.Container>
          <Modal.Dialog>
            <Modal.CloseTrigger />
            <Modal.Header>
              <Modal.Icon className="bg-primary/15 text-primary">
                <Icon icon="lucide:credit-card" width={20} height={20} />
              </Modal.Icon>
              <Modal.Heading>Complete your purchase</Modal.Heading>
            </Modal.Header>

            <Modal.Body className="flex flex-col gap-5">
              {/* Plan overview */}
              <div className="rounded-xl border border-border bg-surface p-4 flex flex-col gap-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Icon icon="lucide:crown" width={16} className="text-primary" />
                    <span className="text-sm font-semibold">Creator Plan</span>
                  </div>
                  <span className="text-[10px] font-semibold uppercase tracking-widest text-muted/50">
                    Lifetime
                  </span>
                </div>
                <ul className="flex flex-col gap-1">
                  {FEATURES_SHORT.map((f) => (
                    <li key={f} className="flex items-center gap-2 text-xs text-muted">
                      <Icon icon="lucide:check" width={12} className="text-primary shrink-0" />
                      {f}
                    </li>
                  ))}
                </ul>
              </div>

              {/* Currency picker */}
              <div className="flex flex-col gap-2">
                <p className="text-[10px] font-semibold uppercase tracking-widest text-muted/50">
                  Currency
                </p>
                <div className="flex gap-2">
                  {CURRENCIES.map((c) => (
                    <button
                      key={c.value}
                      type="button"
                      onClick={() => setCurrency(c.value)}
                      className={`ring-inset flex items-center gap-1.5 px-3 py-1.5 rounded-lg border-2 text-sm font-medium transition-colors ${
                        currency === c.value
                          ? "border-primary bg-primary/10 text-primary ring-2 ring-primary/20"
                          : "border-border text-muted hover:border-primary/40"
                      }`}
                    >
                      <span>{c.flag}</span>
                      {c.label}
                    </button>
                  ))}
                </div>
              </div>

              <Separator orientation="horizontal" variant="secondary" />

              {/* Price breakdown */}
              {loadingPrice || !priceData ? (
                <div className="flex items-center justify-center py-3">
                  <span className="text-sm text-muted">Loading price...</span>
                </div>
              ) : (
                <div className="flex flex-col gap-2">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted">Creator Plan</span>
                    <span>{symbol}{fmt(priceData.normal)}</span>
                  </div>
                  {priceData.hasEarlyAccess && (
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-primary">Early access discount ({EARLY_ACCESS_DISCOUNT * 100}%)</span>
                      <span className="text-primary">-{symbol}{fmt(priceData.normal - priceData.early)}</span>
                    </div>
                  )}
                  <Separator orientation="horizontal" variant="secondary" />
                  <div className="flex items-center justify-between font-semibold">
                    <span>Total</span>
                    <span className="text-lg">{symbol}{fmt(priceData.price)}</span>
                  </div>
                </div>
              )}
            </Modal.Body>

            <Modal.Footer>
              <Button
                variant="primary"
                className="w-full"
                onPress={handlePay}
                isPending={isPaying}
                isDisabled={isPaying || loadingPrice || !priceData}
                data-umami-event="checkout pay"
              >
                {priceData ? `Pay ${symbol}${fmt(priceData.price)}` : "Loading..."}
              </Button>
            </Modal.Footer>
          </Modal.Dialog>
        </Modal.Container>
      </Modal.Backdrop>
    </Modal>
  );
}

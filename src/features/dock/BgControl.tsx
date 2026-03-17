import { Label, Slider, Switch } from "@heroui/react";
import type { GradientStop } from "#/domain/logo/logo.types";
import { useLogoState, useLogoActions } from "#/queries/logo/use-logo-state";
import { InlineColorPicker } from "./InlineColorPicker";

export function BgControl() {
  const { background } = useLogoState();
  const { set } = useLogoActions();
  const isGradient = background.type === "gradient";

  const toggleGradient = (on: boolean) => {
    if (on) {
      set((d) => {
        d.background = {
          type: "gradient",
          direction: 135,
          stops: [
            {
              color: background.type === "solid" ? background.color : "#6366f1",
              position: 0,
            },
            { color: "#a855f7", position: 100 },
          ],
        };
      });
    } else {
      const color =
        background.type === "gradient" ? background.stops[0].color : "#6366f1";
      set((d) => {
        d.background = { type: "solid", color };
      });
    }
  };

  return (
    <div className="flex w-52 flex-col gap-4">
      <div className="flex items-center justify-between">
        <Label className="text-sm text-muted">Gradient</Label>
        <Switch isSelected={isGradient} onChange={toggleGradient}>
          <Switch.Control>
            <Switch.Thumb />
          </Switch.Control>
        </Switch>
      </div>

      {!isGradient && background.type === "solid" && (
        <div className="flex items-center justify-between gap-3">
          <Label className="text-sm text-muted">Color</Label>
          <InlineColorPicker
            value={background.color}
            onChange={(c) =>
              set((d) => {
                if (d.background.type === "solid") d.background.color = c;
              })
            }
          />
        </div>
      )}

      {isGradient && background.type === "gradient" && (
        <GradientTab
          direction={background.direction}
          stops={background.stops}
          onDirection={(v) =>
            set((d) => {
              if (d.background.type === "gradient") d.background.direction = v;
            })
          }
          onStop={(i, stop) =>
            set((d) => {
              if (d.background.type === "gradient")
                d.background.stops[i] = stop;
            })
          }
        />
      )}
    </div>
  );
}

function GradientTab({
  direction,
  stops,
  onDirection,
  onStop,
}: {
  direction: number;
  stops: [GradientStop, GradientStop];
  onDirection: (v: number) => void;
  onStop: (i: number, stop: GradientStop) => void;
}) {
  return (
    <div className="flex flex-col gap-4">
      <Slider
        value={direction}
        onChange={(v) => onDirection(v as number)}
        minValue={0}
        maxValue={360}
        step={1}
        aria-label="Gradient angle"
      >
        <div className="flex justify-between">
          <Label className="text-sm text-muted">Angle</Label>
          <Slider.Output className="text-xs text-muted">
            {() => `${direction}\u00B0`}
          </Slider.Output>
        </div>
        <Slider.Track>
          <Slider.Fill />
          <Slider.Thumb />
        </Slider.Track>
      </Slider>

      {stops.map((stop, i) => (
        <div
          key={i === 0 ? "start-stop" : "end-stop"}
          className="flex items-center gap-3"
        >
          <span className="text-xs text-muted w-12 shrink-0">
            Stop {i + 1}
          </span>
          <InlineColorPicker
            value={stop.color}
            onChange={(c) => onStop(i, { ...stop, color: c })}
          />
          <Slider
            value={stop.position}
            onChange={(v) => onStop(i, { ...stop, position: v as number })}
            minValue={0}
            maxValue={100}
            step={1}
            aria-label={`Stop ${i + 1} position`}
            className="flex-1"
            style={{ gridTemplateAreas: '"track track"', gap: 0 }}
          >
            <Slider.Track>
              <Slider.Fill />
              <Slider.Thumb />
            </Slider.Track>
          </Slider>
          <span className="text-xs text-muted w-8 text-right">
            {stop.position}%
          </span>
        </div>
      ))}
    </div>
  );
}

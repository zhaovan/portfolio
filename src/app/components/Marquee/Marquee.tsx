import React, { Fragment } from "react";
import styles from "./marquee.module.css";

const texts: Array<String> = [
  "animating sites",
  "baking bread",
  "designing type",
  "waxing poetically",
  "sleeping in",
];

type MarqueeProps = {
  offset?: boolean;
};

export default function Marquee({ offset }: MarqueeProps) {
  const two = new Array(2).fill(0);
  const animationSpeed = offset ? "40s" : "45s";
  const reverse = offset ? "reverse" : "forward";

  return (
    <div className={styles.marqueeContainer}>
      {two.map((_, idx) => {
        return (
          <p
            className={styles.marquee}
            key={idx}
            style={{
              animationDuration: animationSpeed,
              animationDirection: reverse,
            }}
          >
            {texts.map((text, jdx) => {
              return (
                <Fragment key={jdx}>
                  <span className={styles.marqueeText}>{text}</span>
                  <span> ❃ </span>
                </Fragment>
              );
            })}
          </p>
        );
      })}
    </div>
  );
}

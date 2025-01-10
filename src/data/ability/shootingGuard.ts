import type { Ability } from "@motojouya/kniw/src/domain/ability";
import { justWait } from "@motojouya/kniw/src/domain/ability";

export const shootingGuard: Ability = {
  name: "shootingGuard",
  label: "矢かわし",
  wait: justWait,
  description: "弓矢の攻撃を受けない",
};

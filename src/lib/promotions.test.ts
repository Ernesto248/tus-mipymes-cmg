import test from "node:test"
import assert from "node:assert/strict"
import { getPromotionTypeLabel, getPromotionBadgeLabel } from "./promotions.ts"

test("getPromotionTypeLabel returns label for discount type", () => {
  assert.equal(getPromotionTypeLabel("discount"), "Descuento")
})

test("getPromotionTypeLabel returns label for offer type", () => {
  assert.equal(getPromotionTypeLabel("offer"), "Oferta")
})

test("getPromotionTypeLabel returns label for highlight type", () => {
  assert.equal(getPromotionTypeLabel("highlight"), "Destacado")
})

test("getPromotionBadgeLabel returns percentage for discount with value", () => {
  assert.equal(getPromotionBadgeLabel("discount", 15), "-15%")
})

test("getPromotionBadgeLabel falls back to type label for non-discount", () => {
  assert.equal(getPromotionBadgeLabel("offer"), "Oferta")
})

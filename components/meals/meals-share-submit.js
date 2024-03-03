"use client";
import { useFormStatus } from "react-dom";

const MealsShareSubmit = () => {
  const { pending } = useFormStatus();
  return (
    <button type="submit" disabled={pending}>
      {pending ? "Submiting..." : "Share Meal"}
    </button>
  );
};

export default MealsShareSubmit;

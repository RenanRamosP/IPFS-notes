"use client";
import { BrainCircuit } from "lucide-react";
import { ThemeToggle } from "./ThemeToggle";

export default function Header() {
  return (
    <div className="border-b flex flex-row justify-between px-2 py-1">
      <div className="self-center flex flex-row text-xl font-bold ">
        <BrainCircuit />
        IPFS Notes
      </div>
      <ThemeToggle />
    </div>
  );
}

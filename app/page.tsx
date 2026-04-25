"use client";
import { useState } from "react";
import Image from "next/image";

export default function Home() {
  const [image, setImage] = useState<string | null>(null);
  const [mimeType, setMimeType] = useState<string>("image/jpeg");
  const [result, setResult] = useState<string>("");
  const [loading, setLoading] = useState(false);
  const [showContact, setShowContact] = useState(false);
  const [phone, setPhone] = useState("");
  const [sent, setSent] = useState(false);

  function handleImageUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setMimeType(file.type);
    const reader = new FileReader();
    reader.onload = () => {
      const base64 = (reader.result as string).split(",")[1];
      setImage(base64);
    };
    reader.readAsDataURL(file);
  }

  async function analyzeImage() {
    if (!image) return;
    setLoading(true);
    setResult("");
    setShowContact(false);
    setSent(false);
    const response = await fetch("/api/analyze", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ imageBase64: image, mimeType }),
    });
    const data = await response.json();
    setResult(data.result);
    setLoading(false);
  }

  function resetAll() {
    setImage(null);
    setResult("");
    setShowContact(false);
    setPhone("");
    setSent(false);
  }

  function handleSend() {
    if (!phone) return;
    setSent(true);
    setShowContact(false);
  }

  return (
    <main style={{minHeight:"100vh",background:"#fafaf9",display:"flex",flexDirection:"column",alignItems:"center",padding:"40px 16px"}}>
      <div style={{width:"100%",maxWidth:"448px",marginBottom:"3
